
export const normalizeIcons = (str = "") =>
    str
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/\//g, "-");
