import api from "@/shared/api/axios";

export const getCommentsByChapter = (fanficId, chapterId) => api.get(`/fanfics/${fanficId}/chapters/${chapterId}/comments`);
export const createComment = (fanficId, chapterId, content) => api.post(`/fanfics/${fanficId}/chapters/${chapterId}/comments`, content);
export const deleteComment = (fanficId, chapterId, commentId) => api.delete(`/fanfics/${fanficId}/chapters/${chapterId}/comments/${commentId}`);