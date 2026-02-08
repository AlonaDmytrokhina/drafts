import { create } from "zustand";
import { getFanfics, toggleLike, toggleBookmark } from "./api";
import {useAuthStore} from "@/features/auth/auth.store";

export const useFanficsStore = create((set, get) => ({
    list: [],
    loading: false,
    error: null,

    fetchFanfics: async () => {
        set({ loading: true, error: null });

        try {
            const res = await getFanfics();
            set({ list: res.data, loading: false });
        } catch (err){
            console.error("Fetch fanfics error:", err);
            set({ error: "Failed to load fanfics", loading: false });
        }
    },

    toggleLike: async (id) => {
        const { user } = useAuthStore.getState();
        if (!user) return;

        const fanfic = get().list.find(f => f.id === id);
        if (!fanfic) return;

        const prevLiked = fanfic.isLiked;

        set({
            list: get().list.map(f =>
                f.id === id ? { ...f, isLiked: !prevLiked } : f
            )
        });

        try {
            const { data } = await toggleLike(id);

            if (typeof data?.isLiked === "boolean") {
                set({
                    list: get().list.map(f =>
                        f.id === id ? { ...f, isLiked: data.isLiked } : f
                    )
                });
            }
        } catch (err) {
            set({
                list: get().list.map(f =>
                    f.id === id ? { ...f, isLiked: prevLiked } : f
                )
            });

            console.error("Toggle like failed", err);
        }
    },


    toggleBookmark: async (id) => {
        const { user } = useAuthStore.getState();
        if (!user) return;

        const fanfic = get().list.find(f => f.id === id);
        if (!fanfic) return;

        const prevBookmarked = fanfic.isBookmarked;

        set({
            list: get().list.map(f =>
                f.id === id ? { ...f, isBookmarked: !prevBookmarked } : f
            )
        });

        try {
            const { data } = await toggleBookmark(id);

            if (typeof data?.isBookmarked === "boolean") {
                set({
                    list: get().list.map(f =>
                        f.id === id ? { ...f, isBookmarked: data.isBookmarked } : f
                    )
                });
            }
        } catch (err) {
            set({
                list: get().list.map(f =>
                    f.id === id ? { ...f, isBookmarked: prevBookmarked } : f
                )
            });

            console.error("Toggle bookmark failed", err);
        }
    },
}));
