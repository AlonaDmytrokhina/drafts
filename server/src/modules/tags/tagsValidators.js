import { TAG_TYPES } from './tagsConstants.js';
import { TagValidationError } from './tagsErrors.js';

export const validateBase = ({ name, type }) => {
    if (!name || typeof name !== 'string') {
        throw new TagValidationError('Tag name is required');
    }

    if (!TAG_TYPES.includes(type)) {
        throw new TagValidationError('Invalid tag type');
    }

    if (name.length < 2 || name.length > 100) {
        throw new TagValidationError('Tag name must be 2–100 characters');
    }
};

export const validateByType = (name, type) => {
    switch (type) {
        case 'Relationship':
            if (!/[\/&]/.test(name)) {
                throw new TagValidationError(
                    'Relationship must contain "/" or "&"'
                );
            }
            break;
    }
};
