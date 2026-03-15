import { pool } from "../../config/db.js";
import * as fanficsRepository from "./fanficsRepository.js";
import * as tagsRepository from "../tags/tagsRepository.js";
import * as chaptersRepository from "../chapters/chaptersRepository.js";
import * as patchUtils from "./fanficsUtils.js";


const usedFields = ['title', 'summary', 'image_url', 'words_count', 'rating', 'status', 'warnings'];


export const createFanfic = async (data, userId, image_url) => {

    if (!data.title || !data.content) {
        throw new Error("Заголовок та контент обов'язкові");
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const wordsCount = data.content.trim().split(/\s+/).length;

        const newFic = await fanficsRepository.createFanfic(client, {
            ...data,
            image_url: image_url,
            words_count: wordsCount,
            author_id: userId
        });

        await chaptersRepository.createFirstChapter(client, {
            fanfic_id: newFic.id,
            title: data.chapterTitle || "Розділ 1",
            content: data.content
        });

        if (data.tags && Array.isArray(data.tags)) {
            for (const tag of data.tags) {
                const tagN = await tagsRepository.findOrCreateTag(client, {
                    name: tag.name,
                    type: tag.type,
                    relationship: tag.relationship
                });

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
};


export const patchFanfic = async (fanficId, userId, body) => {

    await checkAuthor(fanficId, userId);

    const info = patchUtils.getPatchInfo(body, usedFields);

    const fields = info.fields;
    const values = info.values;
    let index = info.index;

    return await fanficsRepository.patchFanfic({fields, values, index, fanficId});
};



export const deleteFanfic = async (fanficId, userId) => {
    await checkAuthor(fanficId, userId);
    return await fanficsRepository.deleteFanficById(fanficId);
};


export const findFanfics = async (userId, query = {}) => {
    const {
        search,
        tags,
        rating,
        status,
        relationship,
        limit = 10,
        page = 1
    } = query;

    let tagsArray = [];

    if (tags) {
        tagsArray = Array.isArray(tags) ? tags : [tags];
        tagsArray = tagsArray.map(Number).filter(n => !isNaN(n));
    }

    const pageSize = Number(limit);
    const currentPage = Number(page);
    const offset = (currentPage - 1) * pageSize;

    const { items, totalCount } = await fanficsRepository.findFanfics({
        userId,
        search,
        tags: tagsArray,
        rating,
        status,
        relationship,
        limit: pageSize,
        offset
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
        data: items,
        meta: {
            totalCount,
            totalPages,
            currentPage,
            hasNextPage: currentPage < totalPages,
            hasPreviousPage: currentPage > 1
        }
    };
};





const checkAuthor = async (fanficId, userId) => {
    const fanfic = await fanficsRepository.getFanficById(fanficId);

    if (!fanfic) {
        throw new Error('Fanfic not found');
    }

    if(fanfic.author_id !== userId) {
        throw new Error('You are not the author of this fanfic');
    }
};
