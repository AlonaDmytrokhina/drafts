import api from "@/shared/api/axios";
import {data} from "react-router-dom";

export const findFanfics = ({ search, tags, limit, page }) =>
    api.get("/fanfics", {
        params: { search, tags, limit, page }
    });

export const getFanfic = (id) => api.get(`/fanfics/${id}`);

export const toggleLike = (id) => api.post(`/fanfics/${id}/likes`);
export const toggleBookmark = (id) => api.post(`/fanfics/${id}/bookmarks`);

export const createFanfic = (data) => api.post("/fanfics", data);
