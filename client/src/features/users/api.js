import api from "@/shared/api/axios";


export const getUserByUsername = (username) =>
    api.get(`/users/${username}`);

export const updateMe = (data) =>
    api.patch("/users/me", data);

export const deleteMe = (id) =>
    api.delete(`/users/me`);
