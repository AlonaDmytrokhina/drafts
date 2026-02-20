import { create } from "zustand";
import {addChapter} from "@/features/chapters/api";

export const useCreateChapterStore = create((set, get) => ({
    chapterData: {
        chapterTitle: "",
        content: "",
    },
    loading: false,
    error: null,

    updateField: (field, value) =>
        set((state) => {
            return {
                chapterData: {
                    ...state.chapterData,
                    [field]: value
                }
            };
        }),

    reset: () => set({
        chapterData: { chapterTitle: "", content: "" },
        error: null
    }),

    submitChapter: async (fanficId) => {
        set({ loading: true, error: null });
        try {
            const { chapterTitle, content } = get().chapterData;
            const result = await addChapter(fanficId, { title: chapterTitle, content });
            get().reset();
            return result;
        } catch (err) {
            set({ error: err.response?.data?.message || "Помилка при збереженні" });
            return null;
        } finally {
            set({ loading: false });
        }
    }
}));