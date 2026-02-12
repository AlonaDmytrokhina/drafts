import axios from "axios";
import qs from "qs";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'repeat' });
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;