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
    selectedTagsId: [],

    abortController: null,

    fetchFanfics: async (page = 1) => {
        const currentController = get().abortController;
        if (currentController) currentController.abort();

        const newController = new AbortController();
        set({ loading: true, error: null, abortController: newController });

        const { search, limit, selectedTagsId } = get();

        try {
            const res = await findFanfics(
                {
                    search,
                    tags: selectedTagsId,
                    limit,
                    page
                },
                { signal: newController.signal }
            );

            const { data, meta } = res.data;

            set({
                list: data || [],
                currentPage: meta.currentPage || page,
                totalPages: meta.totalPages || 1,
                loading: false,
                abortController: null
            });

            if (page !== get().currentPage) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (err) {
            if (err.name === 'CanceledError' || err.name === 'AbortError') return;

            console.error(err);
            set({ error: "Не вдалося завантажити дані", loading: false, list: [], abortController: null });
        }
    },

    toggleLike: async (id, onUpdate) => {
        const updateAction = onUpdate || ((targetId, updater) => {
            set((state) => ({
                list: state.list.map(f => f.id === targetId ? updater(f) : f)
            }));
        });

        updateAction(id, (f) => ({
            ...f,
            isLiked: !f.isLiked,
            likesCount: (f.likesCount ?? 0) + (f.isLiked ? -1 : 1)
        }));

        try {
            await toggleLike(id);
        } catch (err) {
            updateAction(id, (f) => ({
                ...f,
                isLiked: !f.isLiked,
                likesCount: (f.likesCount ?? 0) + (f.isLiked ? -1 : 1)
            }));
        }
    },

    toggleBookmark: async (id, onUpdate) => {
        const updateAction = onUpdate || ((targetId, updater) => {
            set((state) => ({
                list: state.list.map(f => f.id === targetId ? updater(f) : f)
            }));
        });

        updateAction(id, (f) => ({ ...f, isBookmarked: !f.isBookmarked }));

        try {
            await toggleBookmark(id);
        } catch (err) {
            updateAction(id, (f) => ({ ...f, isBookmarked: !f.isBookmarked }));
        }
    },

    setTags: (ids) => {
        set({ selectedTagsId: ids, currentPage: 1 });
        get().fetchFanfics(1);
    },

    setSearch: (search) => set({ search }),

    resetFanfics: () => set({
        list: [],
        currentPage: 1,
        totalPages: 1,
        search: "",
        selectedTagsId: [],
        error: null
    }),
}));