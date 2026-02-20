import { pool } from "../../config/db.js";
import * as fanficsRepository from "./fanficsRepository.js";
import * as tagsRepository from "../tags/tagsRepository.js";
import * as chaptersRepository from "../chapters/chaptersRepository.js";
import * as patchUtils from "./fanficsUtils.js";

const usedFields = ['title', 'summary', 'image_url', 'words_count', 'rating', 'status', 'warnings'];

export const createFanficRaw = async (data, userId) => {
    if(!data.title){
        throw new Error("Title is required");
    }

    return await fanficsRepository.createFanfic({
        ...data,
        author_id: userId,
    });
};

export const createFanfic = async (data, userId, image_url) => {
    // Middleware вже зробив data.tags масивом, тому перевірка проста
    if (!data.title || !data.content) {
        throw new Error("Заголовок та контент обов'язкові");
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Розрахунок кількості слів
        const wordsCount = data.content.trim().split(/\s+/).length;

        // 1. Створення фанфіка
        const newFic = await fanficsRepository.createFanfic(client, {
            ...data,
            image_url: image_url,
            words_count: wordsCount,
            author_id: userId
        });

        // 2. Створення першого розділу
        await chaptersRepository.createFirstChapter(client, {
            fanfic_id: newFic.id,
            title: data.chapterTitle || "Розділ 1",
            content: data.content
        });

        // 3. Обробка тегів (data.tags вже є масивом завдяки middleware)
        if (data.tags && Array.isArray(data.tags)) {
            for (const tag of data.tags) {
                // Знаходимо або створюємо тег у базі
                const tagN = await tagsRepository.findOrCreateTag(client, {
                    name: tag.name,
                    type: tag.type,
                    relationship: tag.relationship
                });

                // Лінкуємо тег до фанфіка
                if (tagN && tagN.id) {
                    await fanficsRepository.linkTagToFic(client, newFic.id, tagN.id);
                }
            }
        }

        await client.query('COMMIT');
        return newFic;

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Service Error:", error.message);
        throw error;
    } finally {
        client.release();
    }
};


export const getFanficById = async (id, userId = null) => {
    return await fanficsRepository.getFanficById(id, userId);
}


export const patchFanfic = async (fanficId, userId, body) => {

    await checkAuthor(fanficId, userId);

    const info = patchUtils.getPatchInfo(body, usedFields);

    const fields = info.fields;
    const values = info.values;
    let index = info.index;

    return await fanficsRepository.patchFanfic({fields, values, index, fanficId});
}

export const deleteFanfic = async (fanficId, userId) => {
    await checkAuthor(fanficId, userId);
    return await fanficsRepository.deleteFanficById(fanficId);
}



const checkAuthor = async (fanficId, userId) => {
    const fanfic = await fanficsRepository.getFanficById(fanficId);

    if (!fanfic) {
        throw new Error('Fanfic not found');
    }

    if(fanfic.author_id !== userId) {
        throw new Error('You are not the author of this fanfic');
    }
}


export const findFanfics = async (userId, filters = {}) => {
    const { items, totalCount } = await fanficsRepository.findFanfics({
        userId,
        ...filters,
    });

    return {
        items,
        totalCount
    };
};
