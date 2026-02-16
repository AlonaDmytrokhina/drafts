import * as usersService from "./usersService.js";
import {getUserById} from "./usersService.js";

export const patchMe = async (req, res, next) => {
  try {
    const data = await usersService.patchUser(req.user, req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteMe = async (req, res, next) => {
  try {
    const data = await usersService.deleteUser(req.user.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getUserByUsername = async (req, res, next) => {
    const username = req.params.username;
    try {
        const data = await usersService.getUserByUsername(username);
        res.json(data);
    } catch (error) {
        next(error);
    }
}

export const getUserWorks = async (req, res) => {
    try {
        const { username } = req.params;
        const currentUserId = req.user?.id || null;
        const { limit, offset } = req.query;

        const works = await usersService.allUserWorks(username, currentUserId, limit, offset);
        if (Array.isArray(works)) {
            const totalCount = works.length > 0 ? parseInt(works[0].total_count) : 0;

            return res.json({
                items: works,
                totalCount: totalCount
            });
        }
        res.json(works);
    } catch (err) {
        if (err.message === "USER_NOT_FOUND") {
            return res.status(404).json({ message: "Користувача не знайдено" });
        }

        res.status(500).json({ message: "Помилка сервера" });
    }
};

export const getUserBookmarks = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const { limit, offset } = req.query;

        const result = await usersService.allUserBookmarks(currentUserId, limit, offset);
        if (Array.isArray(result)) {
            const totalCount = result.length > 0 ? parseInt(result[0].total_count) : 0;

            return res.json({
                items: result,
                totalCount: totalCount
            });
        }
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: "Помилка сервера" });
    }
};




