import { Router } from "express";
import * as readingHistoryController from "./readingHistoryController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();

router.post('/', authMiddleware, readingHistoryController.createReadingHistory);

export default router;