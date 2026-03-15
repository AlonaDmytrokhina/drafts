import { create } from "zustand";
import {
    getCommentsByChapter,
    createComment,
    deleteComment
} from "@/features/comments/api";

export const useCommentsStore = create((set, get) => ({
    commentsByChapter: {},
    loading: false,
    error: null,

    fetchComments: async (fanficId, chapterId) => {
        set({ loading: true, error: null });
        try {
            const response = await getCommentsByChapter(fanficId, chapterId);
            set(state => ({
                commentsByChapter: {
                    ...state.commentsByChapter,
                    [chapterId]: {
                        items: response.data,
                    }
                },
                loading: false
            }));
        } catch (err) {
            console.error(err);
            set({ error: "Коментарі не знайдено", loading: false });
        }
    },

    addComment: async (fanficId, chapterId, content) => {
        try {
            const newComment = await createComment(fanficId, chapterId, content );
            set(state => ({
                commentsByChapter: {
                    ...state.commentsByChapter,
                    [chapterId]: {
                        ...state.commentsByChapter[chapterId],
                        items: [newComment.data, ...(state.commentsByChapter[chapterId]?.items || [])],
                    }
                }
            }));
        } catch (err) {
            console.error(err);
        }
    },

    removeComment: async (fanficId, chapterId, commentId) => {
        try {
            await deleteComment(fanficId, chapterId, commentId);

            set(state => ({
                commentsByChapter: {
                    ...state.commentsByChapter,
                    [chapterId]: {
                        ...state.commentsByChapter[chapterId],
                        items: state.commentsByChapter[chapterId].items.filter(
                            c => c.id !== commentId
                        ),
                    }
                }
            }));
        } catch (err) {
            console.error(err);
        }
    },

    clearComments: (chapterId) => {
        set(state => ({
            commentsByChapter: {
                ...state.commentsByChapter,
                [chapterId]: { items: [], totalCount: 0 }
            }
        }));
    }
}));