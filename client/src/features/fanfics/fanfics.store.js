
//TODO: виправити лайки та зберігання!!!!! взагалі коороче пофіксити фанфіки та розібратися
import { create } from "zustand";
import { toggleLike, toggleBookmark, findFanfics } from "./api";

export const useFanficsStore = create((set, get) => ({
    list: [],
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
    search: "",
    limit: 10,

    fetchFanfics: async (page = 1) => {
        set({ loading: true, error: null });
        const { search, limit } = get();

        try {
            const res = await findFanfics({ search, limit, page });

            const { data, meta } = res.data;

            set({
                list: data || [],
                currentPage: meta.currentPage || page,
                totalPages: meta.totalPages || 1,
                loading: false,
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error(err);
            set({ error: "Не вдалося завантажити дані", loading: false, list: [] });
        }
    },

    toggleLike: async (id) => {

        const currentList = get().list;
        set((state) => ({
            list: state.list.map(f => f.id === id ? { ...f, isLiked: !f.isLiked } : f)
        }));

        try {
            await toggleLike(id);
        } catch (err) {
            set({ list: currentList });
            console.error("Like failed", err);
        }
    },

    toggleBookmark: async (id) => {
        const currentList = get().list;

        set((state) => ({
            list: state.list.map(f => f.id === id ? { ...f, isBookmarked: !f.isBookmarked } : f)
        }));

        try {
            await toggleBookmark(id);
        } catch (err) {
            set({ list: currentList });
            console.error("Bookmark failed", err);
        }
    },

    setSearch: (search) => {
        set({ search });
        get().fetchFanfics(1);
    },

    resetFanfics: () => set({
        list: [],
        currentPage: 1,
        totalPages: 1,
        search: ""
    }),
}));