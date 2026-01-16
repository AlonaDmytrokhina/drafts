import { Router } from "express";
import * as likesController from "./likesController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router({ mergeParams: true });

router.post("/", authMiddleware, likesController.toggleLike);

export default router;