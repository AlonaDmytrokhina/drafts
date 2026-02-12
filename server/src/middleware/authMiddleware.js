import jwt from 'jsonwebtoken';
import { getUserById } from "../modules/users/usersService.js";

const verifyAndFetchUser = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await getUserById(decoded.id);
        return user;
    } catch {
        return null;
    }
};

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: 'No token' });
    }

    const token = authHeader.split(' ')[1];
    const user = await verifyAndFetchUser(token);

    if (!user) {
        return res.status(403).json({ message: "Invalid token or user not found" });
    }

    req.user = user;
    next();
};

export const optionalAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return next();
    }

    const token = authHeader.split(" ")[1];
    const user = await verifyAndFetchUser(token);

    if (user) {
        req.user = user;
    }

    next();
};