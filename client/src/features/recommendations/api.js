import api from "@/shared/api/axios";

export const getRecommendations = ( config = {}) =>
    api.get(`/recommendations`, {
        ...config
    });