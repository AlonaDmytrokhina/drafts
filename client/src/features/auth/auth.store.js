import { create } from "zustand";
import api from "@/shared/api/axios";
import { loginUser, registerUser, getMe } from "./api";

export const useAuthStore = create((set, get) => ({
    user: null,
    token: localStorage.getItem("token"),
    loading: false,
    error: null,
    getUserId: () => get().user?.id,

    login: async (credentials) => {
        set({ loading: true, error: null });

        try {
            const data = await loginUser(credentials);

            localStorage.setItem("token", data.accessToken);

            set({
                user: data.user,
                token: data.accessToken,
                loading: false,
            });

            return true;
        } catch (err) {
            set({
                error: err.response?.data?.message || "Невірний логін або пароль",
                loading: false,
            });
            return false;
        }
    },

    register: async (userData) => {
        set({ loading: true, error: null });

        try {
            await registerUser(userData);
            set({ loading: false });
            return true;
        } catch (err) {
            set({
                error: err.message || "Помилка реєстрації",
                loading: false,
            });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null });
    },

    checkAuth: async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const { data } = await getMe();
            set({ user: data, token });
        } catch {
            localStorage.removeItem("token");
            set({ user: null, token: null });
        }
    },
}));
