import { create } from "zustand";
import { getUserWorks, getMyBookmarks } from "./api";
import {useAuthStore} from "@/features/auth/auth.store"; // Імпортуй свої API методи

export const useUserStore = create((set, get) => ({
    list: [],
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
    limit: 10,

    fetchUserContent: async (username, type = "my", page = 1) => {
        const { limit } = get();
        const authUser = useAuthStore.getState().user;

        if (type === "saved" && authUser?.username !== username) {
            set({ error: "Ви не можете переглядати чужі закладки", list: [] });
            return;
        }

        set({ loading: true, error: null });

        try {
            let res;
            if (type === "my") {
                res = await getUserWorks(username, page, limit);
            } else {
                res = await getMyBookmarks(page, limit);
            }

            const items = res.data?.items || [];
            const totalCount = Number(res.data?.totalCount || 0);


            set({
                list: items,
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit) || 1,
                loading: false
            });
        } catch (err) {
            set({
                error: "Не вдалося завантажити контент",
                loading: false,
                list: []
            });
        }
    },

    setList: (list) => {
        set({ list: list });
    },

    resetUserContent: () => set({
        list: [],
        currentPage: 1,
        totalPages: 1,
        error: null,
        loading: false
    })
}));