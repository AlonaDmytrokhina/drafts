import { create } from "zustand";
import { toggleLike, toggleBookmark, getFanfic } from "./api";

export const useFanficPageStore = create((set, get) => ({

    loading: false,
    error: null,
    currentFic: null,

    fetchFanficById: async (id) => {
        set({ loading: true, error: null });
        try {
            const res = await getFanfic(id);
            console.log(res);
            set({ currentFic: res.data, loading: false });
        } catch (err) {
            console.log(err);
            set({ error: "Фанфік не знайдено", loading: false });
        }
    },

    clearCurrentFic: () => set({ currentFic: null }),

    toggleLike: async (id) => {
        const { currentFic } = get();

        const updateFic = (f) => ({
            ...f,
            isLiked: !f.isLiked,
            likesCount: (f.likesCount ?? 0) + (f.isLiked ? -1 : 1)
        });

        set({
            currentFic: currentFic?.id === id ? updateFic(currentFic) : currentFic
        });

        try {
            await toggleLike(id);
        } catch (err) {
            const rollback = get();
            set({
                currentFic: rollback.currentFic?.id === id ? updateFic(rollback.currentFic) : rollback.currentFic
            });
            console.error("Помилка лайку:", err);
        }
    },

    toggleBookmark: async (id) => {
        const { currentFic } = get();

        const updateFic = (f) => ({ ...f, isBookmarked: !f.isBookmarked });

        set({
            currentFic: currentFic?.id === id ? updateFic(currentFic) : currentFic
        });

        try {
            await toggleBookmark(id);
        } catch (err) {
            const rollback = get();
            set({
                currentFic: rollback.currentFic?.id === id ? updateFic(rollback.currentFic) : rollback.currentFic
            });
            console.error("Помилка закладки:", err);
        }
    },
}));