import * as fanficsRepository from "./fanficsRepository.js";
import * as patchUtils from "./fanficsUtils.js";
const usedFields = ['title', 'summary', 'image_url', 'words_count', 'rating', 'status', 'warnings'];

export const createFanfic = async (data, userId) => {
    if(!data.title){
        throw new Error("Title is required");
    }

    return await fanficsRepository.createFanfic({
        ...data,
        author_id: userId,
    });
};

export const getAllFanfics = async () => {
    return await fanficsRepository.getAllFanfics();
}

export const getFanficById = async (id) => {
    return await fanficsRepository.getFanficById(id);
}

export const searchFanfics = async (q) => {
    return await fanficsRepository.searchFanfics(q);
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