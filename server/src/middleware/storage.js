import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "D:/курсач/drafts/server/uploads/covers");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "cover-" + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Тільки зображення дозволені!"), false);
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // ліміт 5МБ
});

// middleware/parseData.js

export const parseFicData = (req, res, next) => {
    try {
        // Якщо tags прийшли як рядок від FormData, парсимо їх
        if (req.body.tags && typeof req.body.tags === 'string') {
            req.body.tags = JSON.parse(req.body.tags);
        }

        // Можна також розпарсити інші масиви, якщо вони є
        // Наприклад, warnings, якщо ви передаєте їх як масив
        if (req.body.warnings && typeof req.body.warnings === 'string') {
            try {
                req.body.warnings = JSON.parse(req.body.warnings);
            } catch {
                // якщо це просто рядок "Violence, Death", залишаємо як є
            }
        }

        next(); // Переходимо до контролера
    } catch (error) {
        return res.status(400).json({
            message: "Помилка при обробці даних форми (некоректний JSON)",
            details: error.message
        });
    }
};