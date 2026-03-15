import multer from "multer";
import path from "path";

const uploadDir = path.join(process.cwd(), "uploads", "avatars");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname));
    }
});

export const uploadAvatar = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});