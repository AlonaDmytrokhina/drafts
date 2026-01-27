import api from "@/shared/api/axios";

export const getFanfics = () => api.get("/fanfics");
export const getFanfic = (id) => api.get(`/fanfics/${id}`);
