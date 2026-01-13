import { Router } from "express";
import * as chaptersController from "./chaptersController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router({ mergeParams: true });

router.get('/', chaptersController.getAllChapters);
router.get('/:chapterId', chaptersController.getChapterById);

router.post('/', authMiddleware, chaptersController.createChapter);
//router.patch('/:chapterId', authMiddleware, chaptersController.patchChapter);
router.delete('/:chapterId', authMiddleware, chaptersController.deleteChapterById);
router.delete('/', authMiddleware, chaptersController.deleteLastChapter);

export default router;
