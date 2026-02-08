import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: 'No token' });
  }

  const token = header.split(' ')[1];

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ message: 'Invalid token' });
  }
};

export const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next();
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        next();
    }
};
