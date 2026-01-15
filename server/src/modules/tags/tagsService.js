import * as tagsRepository from "./tagsRepository.js";
import { normalizeTagName } from './tagsUtils.js';
import { validateBase, validateByType } from './tagsValidators.js';

export const createTag = async ({ name, type }) => {
    const normalized = normalizeTagName(name);

    validateBase({ name: normalized, type });
    validateByType(normalized, type);

    const existing = await tagsRepository.findTagByNameAndType(normalized, type);
    if (existing) return existing;

    return await tagsRepository.createTag({ name: normalized, type });
};
