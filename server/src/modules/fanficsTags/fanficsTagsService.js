import * as tagsRepository from "../tags/tagsRepository.js";
import * as fanficsRepository from "../fanfics/fanficsRepository.js";
import * as fanficsTagsRepository from "./fanficsTagsRepository.js";
import {NotFoundError} from '../../errors/index.js';
import {TagFanficCreationError} from './fanficsTagsErrors.js';

export const createFanficTag = async ({ fanficId, tagId }) => {
    await validate({ fanficId, tagId });

    const created = await fanficsTagsRepository.createFanficTag(fanficId, tagId);

    if (!created) {
        throw new TagFanficCreationError('Tag already attached to fanfic');
    }

    return created;
};


export const deleteFanficTag = async ({ fanficId, tagId }) => {
    await validate({ fanficId, tagId });
    return await fanficsTagsRepository.deleteFanficTag(fanficId, tagId);
};




const validate = async ({ fanficId, tagId }) => {
    if (!fanficId || !tagId) {
        throw new TagFanficCreationError('fanficId and tagId are required');
    }

    const fanfic = await fanficsRepository.getFanficById(fanficId);
    if (!fanfic) {
        throw new NotFoundError('Fanfic not found');
    }

    const tag = await tagsRepository.findTagById(tagId);
    if (!tag) {
        throw new NotFoundError('Tag not found');
    }
};