import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: import.meta.env.VITE_WITH_CREDENTIALS === "true",
});

export default api;
