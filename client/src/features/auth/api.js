import api from "@/shared/api/axios";
const API_URL = 'http://localhost:5000/api/auth';

export const loginUser = async (data) => {
    const response = await api.post("/auth/login", data);
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Помилка реєстрації');
    }

    return response.json();
};