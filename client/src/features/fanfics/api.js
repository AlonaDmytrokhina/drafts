import api from "@/shared/api/axios";

export const getFanfics = () => api.get("/fanfics");
export const findFanfics = ({ search, limit, page }) =>
    api.get("/fanfics/test", {
        params: { search, limit, page }
    });

export const getFanfic = (id) => api.get(`/fanfics/${id}`);

export const toggleLike = (id) => api.post(`/fanfics/${id}/likes`);
export const toggleBookmark = (id) => api.post(`/fanfics/${id}/bookmarks`);
