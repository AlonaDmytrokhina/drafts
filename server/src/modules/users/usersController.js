import * as usersService from "./usersService.js";

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
        const { search, limit, offset } = req.query;

        const works = await usersService.allUserWorks(username, {
            search,
            limit,
            offset,
        });

        res.json(works);
    } catch (err) {
        if (err.message === "USER_NOT_FOUND") {
            return res.status(404).json({ message: "Користувача не знайдено" });
        }

        res.status(500).json({ message: "Помилка сервера" });
    }
};




