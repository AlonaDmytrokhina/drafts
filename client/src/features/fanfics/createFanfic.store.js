import { create } from "zustand";
import { createFanfic } from "@/features/fanfics/api";

export const useCreateFicStore = create((set, get) => ({
    formData: {
        title: "",
        summary: "",
        chapterTitle: "",
        content: "",
        rating: "General",
        status: "Ongoing",
        relationship: "Gen",
        warnings: "No Warnings",
        tags: [],
    },
    coverFile: null,
    loading: false,
    error: null,

    setCoverFile: (file) => set({ coverFile: file }),

    updateField: (field, value) =>
        set((state) => ({
            formData: { ...state.formData, [field]: value }
        })),

    addTag: (type, name) => {
        console.log("Current tags:", get().formData.tags);
        const { tags } = get().formData;
        set((state) => ({
            formData: {
                ...state.formData,
                tags: [...tags, { name, type }]
            }
        }));
    },

    removeTag: (name) => {
        set((state) => ({
            formData: {
                ...state.formData,
                tags: state.formData.tags.filter(t => t.name !== name)
            }
        }));
    },

    toggleWarning: (value) => {
        const { warnings } = get().formData;
        let warningsArray = warnings === "No Warnings" ? [] : warnings.split(", ");

        if (warningsArray.includes(value)) {
            warningsArray = warningsArray.filter(w => w !== value);
        } else {
            warningsArray.push(value);
        }

        set((state) => ({
            formData: { ...state.formData, warnings: warningsArray.join(", ") }
        }));
    },

    submitFic: async () => {
        set({ loading: true, error: null });
        try {
            const { formData, coverFile } = get(); // Отримуємо все необхідне один раз
            const data = new FormData();

            Object.keys(formData).forEach(key => {
                if (key !== 'tags') { // Обробляємо теги окремо
                    data.append(key, formData[key]);
                }
            });

            data.append("tags", JSON.stringify(formData.tags));

            // 2. Додаємо файл обкладинки, якщо він вибраний
            if (coverFile) {
                data.append("cover", coverFile); // "cover" має збігатися з назвою в upload.single("cover") на бекенді
            } else {
                set({ coverFile: "testCover.jpg" });
            }

            formData.tags.forEach(tag => console.log(tag.name, tag.type));

            const response = await createFanfic(data);

            set({ loading: false });
            return response.data;
        } catch (err) {
            console.error("Submission error:", err);
            set({
                error: err.response?.data?.message || `Помилка при створенні: ${err.message}`,
                loading: false
            });
            return null;
        }
    },

    reset: () => set({ formData: {
            title: "",
            summary: "",
            chapterTitle: "",
            content: "",
            rating: "General",
            status: "Ongoing",
            relationship: "Gen",
            warnings: "No Warnings",
            tags: [],
        },
        coverFile: null,
        loading: false,
        error: null, })
}));