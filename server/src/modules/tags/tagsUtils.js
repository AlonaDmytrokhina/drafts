export const normalizeTagName = (name) =>
    name.trim().replace(/\s+/g, ' ');

export const makeTagSlug = (name) =>
    name.toLowerCase().replace(/\s+/g, '-');
