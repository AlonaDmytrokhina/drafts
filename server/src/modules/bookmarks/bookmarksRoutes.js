import { Router } from "express";
import * as bookmarkController from "./bookmarksController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router({ mergeParams: true });

router.get("/", authMiddleware, bookmarkController.getUserBookmarks);
router.post("/", authMiddleware, bookmarkController.toggleBookmark);

export default router;