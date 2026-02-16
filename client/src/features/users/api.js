import api from "@/shared/api/axios";


export const getUserByUsername = (username) =>
    api.get(`/users/${username}`);

export const updateMe = (data) =>
    api.patch("/users/me", data);

export const deleteMe = (id) =>
    api.delete(`/users/me`);

export const getUserWorks = (username, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    return api.get(`/users/${username}/fanfics`, {
        params: { limit, offset }
    });
};

export const getMyBookmarks = (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    return api.get(`/users/me/bookmarks`, {
        params: { limit, offset }
    });
};

