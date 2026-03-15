import { create } from "zustand";
import { getRecommendations } from "./api";

export const useRecommendationsStore = create((set, get) => ({
    recommendations: [],
    loading: false,
    error: null,

    updateRecommendations: (id, updater) =>
        set((state) => ({
            recommendations: state.recommendations.map((f) =>
                f.id === id ? updater(f) : f
            )
        })),

    fetchRecommendations: async () => {
        set({ loading: true, error: null });

        try {
            const res = await getRecommendations({});

            set({
                recommendations: res.data.data.items || [],
                loading: false
            });
        } catch (err) {
            console.error(err);
            set({
                error: "Не вдалося завантажити рекомендації",
                loading: false
            });
        }
    },

    resetRecommendations: () =>
        set({
            recommendations: [],
            error: null
        })
}));