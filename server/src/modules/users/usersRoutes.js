import { Router } from "express";
import * as usersController from './usersController.js';
import { authMiddleware } from "../../middleware/authMiddleware.js";
import bookmarksRoutes from "../bookmarks/bookmarksRoutes.js";

const router = Router();

router.patch("/me", authMiddleware, usersController.patchMe);
router.delete("/me", authMiddleware, usersController.deleteMe);
router.use('/bookmarks', bookmarksRoutes);

export default router;