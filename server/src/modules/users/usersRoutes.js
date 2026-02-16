import { Router } from "express";
import * as usersController from './usersController.js';
import { authMiddleware, optionalAuth } from "../../middleware/authMiddleware.js";
import bookmarksRoutes from "../bookmarks/bookmarksRoutes.js";

const router = Router();

router.patch("/me", authMiddleware, usersController.patchMe);
router.delete("/me", authMiddleware, usersController.deleteMe);
router.get("/:username/fanfics", optionalAuth, usersController.getUserWorks);
router.get("/:username", optionalAuth, usersController.getUserByUsername);
router.get("/me/bookmarks", authMiddleware, usersController.getUserBookmarks);

export default router;