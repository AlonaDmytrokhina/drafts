import * as authService from './authService.js';

export const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const me = async (req, res) => {
    const {
        id,
        username,
        email,
        avatar_url,
        bio,
        is_admin,
        created_at
    } = req.user;

    res.json({
        id,
        username,
        email,
        avatar_url,
        bio,
        is_admin,
        created_at
    });
};


