import api from "@/shared/api/axios";

export const getAllChapters = (fanficId) => api.get(`/fanfics/${fanficId}/chapters`);
export const getChapter = (fanficId, chapterId) => api.get(`/fanfics/${fanficId}/chapters/${chapterId}`);

export const addChapter = (fanficId, data) => api.post(`/fanfics/${fanficId}/chapters`, data);


