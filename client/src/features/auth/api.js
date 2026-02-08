import api from "@/shared/api/axios";

export const loginUser = async (data) => {
    const response = await api.post(`/auth/login`, data);
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await api.post(`/auth/register`, userData);
    return response.data;
};

export const getMe = () => api.get(`/auth/me`);