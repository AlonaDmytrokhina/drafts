import { create } from "zustand";
import { getChapter, getAllChapters } from "./api";

export const useChapterPageStore = create((set, get) => ({
    chapters: [],
    currentChapter: null,
    loading: false,
    error: null,

    getPrevChapterId: () => {
        const { chapters, currentChapter } = get();
        if (!currentChapter || !chapters || chapters.length === 0) return null;

        const currentIndex = chapters.findIndex(c => c.id === currentChapter.id);
        return currentIndex > 0 ? chapters[currentIndex - 1].id : null;
    },

    getNextChapterId: () => {
        const { chapters, currentChapter } = get();
        if (!currentChapter || !chapters || chapters.length === 0) return null;

        const currentIndex = chapters.findIndex(c => c.id === currentChapter.id);
        return (currentIndex !== -1 && currentIndex < chapters.length - 1)
            ? chapters[currentIndex + 1].id
            : null;
    },

    fetchChapterById: async (fanficId, chapterId) => {
        set({ loading: true, error: null });
        try {
            const existingChapters = get().chapters;

            const [chapterRes, chaptersRes] = await Promise.all([
                getChapter(fanficId, chapterId),
                existingChapters.length === 0 ? getAllChapters(fanficId) : Promise.resolve(null)
            ]);

            set((state) => ({
                currentChapter: chapterRes.data,
                chapters: chaptersRes ? chaptersRes.data : state.chapters,
                loading: false
            }));
        } catch (err) {
            console.error(err);
            set({ error: "Розділ або фанфік не знайдено", loading: false });
        }
    },

    clearCurrentChapter: () => set({ currentChapter: null, chapters: [], error: null }),
}));