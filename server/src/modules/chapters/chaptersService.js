import * as chaptersRepository from "./chaptersRepository.js";
import * as fanficsRepository from "../fanfics/fanficsRepository.js";

export const createChapter = async (data, fanficId) => {

    if (!fanficId) {
        throw new Error("Fanfic ID is required");
    }

    if (!data.title?.trim()) {
        throw new Error("Title is required");
    }

    if (!data.content?.trim()) {
        throw new Error("Content is required");
    }

    const title = data.title;
    const content = data.content;

    return await chaptersRepository.createChapter({
        title,
        content,
        fanfic_id: fanficId
    });
};

export const getAllChapters = async (fanficId) => {

    if (!fanficId) {
        throw new Error("Fanfic ID is required");
    }

    await checkFic(fanficId);

    return await chaptersRepository.getAllChapters(fanficId);
};

export const getChapterById = async (chapterId) => {

    if (!chapterId) {
        throw new Error("Chapter ID is required");
    }

    return await chaptersRepository.getChapterById(chapterId);
};

export const deleteChapterById = async (chapterId) => {

    if (!chapterId) {
        throw new Error("Chapter ID is required");
    }

    return await chaptersRepository.deleteChapterById(chapterId);
};

const checkFic = async (fanficId) => {
    const fanfic = await fanficsRepository.getFanficById(fanficId);

    if (!fanfic) {
        throw new Error('Fanfic not found');
    }

};

export const deleteLastChapter = async (fanficId) => {

    if (!fanficId) {
        throw new Error("Fanfic ID is required");
    }

    await checkFic(fanficId);

    return await chaptersRepository.deleteLastChapter(fanficId);
};

