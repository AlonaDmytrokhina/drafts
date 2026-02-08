import { Router } from "express";
import * as fanficsController from "./fanficsController.js";
import chaptersRoutes from "../chapters/chaptersRoutes.js";
import fanficsTagsRoutes from "../fanficsTags/fanficsTagsRoutes.js";
import likesRoutes from "../likes/likesRoutes.js";
import bookmarksRoutes from "../bookmarks/bookmarksRoutes.js";
import { authMiddleware, optionalAuth } from "../../middleware/authMiddleware.js";

const router = Router();

router.get('/', optionalAuth, fanficsController.getAllFanfics);
router.get('/:fanficId', fanficsController.getFanficById);
router.get('/search', fanficsController.searchFanficsByNameOrAuthor);
router.post('/search', fanficsController.searchByTags);
router.post('/', authMiddleware, fanficsController.createFanfic);
router.patch('/:fanficId', authMiddleware, fanficsController.patchFanfic);
router.delete('/:fanficId', authMiddleware, fanficsController.deleteFanfic);

router.use('/:fanficId/chapters', chaptersRoutes);

router.use('/:fanficId/tags', fanficsTagsRoutes);

router.use('/:fanficId/likes', likesRoutes);

router.use('/:fanficId/bookmarks', bookmarksRoutes);

export default router;
