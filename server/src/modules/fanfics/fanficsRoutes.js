import { Router } from "express";
import * as fanficsController from "./fanficsController.js";
import chaptersRoutes from "../chapters/chaptersRoutes.js";
import fanficsTagsRoutes from "../fanficsTags/fanficsTagsRoutes.js";
import likesRoutes from "../likes/likesRoutes.js";
import bookmarksRoutes from "../bookmarks/bookmarksRoutes.js";
import { authMiddleware, optionalAuth } from "../../middleware/authMiddleware.js";
import { upload, parseFicData } from "../../middleware/storage.js";

const router = Router();

router.get('/', optionalAuth, fanficsController.findFanfics);
router.get('/:fanficId', optionalAuth, fanficsController.getFanficById);
router.post('/', authMiddleware, upload.single("cover"), parseFicData, fanficsController.createFanfic);
router.patch('/:fanficId', authMiddleware, fanficsController.patchFanfic);
router.delete('/:fanficId', authMiddleware, fanficsController.deleteFanfic);

router.use('/:fanficId/chapters', chaptersRoutes);

router.use('/:fanficId/tags', fanficsTagsRoutes);

router.use('/:fanficId/likes', likesRoutes);

router.use('/:fanficId/bookmarks', bookmarksRoutes);

export default router;
