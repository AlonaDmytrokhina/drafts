import { Router } from "express";
import * as tagsController from "./tagsController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();

router.post('/', authMiddleware, tagsController.createTag);

export default router;