import { Router } from "express";
import * as commentsController from "./commentsController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router({ mergeParams: true });

// router.get('/', chaptersController.getAllChapters);
router.get('/', commentsController.getCommentsByChapter);

router.post('/', authMiddleware, commentsController.createComment);
//router.patch('/:chapterId', authMiddleware, chaptersController.patchChapter);
router.delete('/:commentId', authMiddleware, commentsController.deleteComment);
// router.delete('/', authMiddleware, chaptersController.deleteLastChapter);


export default router;