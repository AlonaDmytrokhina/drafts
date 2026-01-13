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
