import multer from "multer";
import path from "path";
import fs from "fs";

const coversDir = path.join(process.cwd(), "uploads", "covers");
const avatarsDir = path.join(process.cwd(), "uploads", "avatars");

[coversDir, avatarsDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

const createStorage = (uploadPath, prefix) =>
    multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix =
                Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, `${prefix}-${uniqueSuffix}${path.extname(file.originalname)}`);
        },
    });

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Тільки зображення дозволені!"), false);
    }
};

export const uploadCover = multer({
    storage: createStorage(coversDir, "cover"),
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

export const uploadAvatar = multer({
    storage: createStorage(avatarsDir, "avatar"),
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

export const parseFicData = (req, res, next) => {
    try {
        if (req.body.tags && typeof req.body.tags === "string") {
            req.body.tags = JSON.parse(req.body.tags);
        }

        if (req.body.warnings && typeof req.body.warnings === "string") {
            try {
                req.body.warnings = JSON.parse(req.body.warnings);
            } catch {
            }
        }

        next();
    } catch (error) {
        return res.status(400).json({
            message: "Помилка при обробці даних форми (некоректний JSON)",
            details: error.message
        });
    }
};