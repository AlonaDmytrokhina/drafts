import { Router } from "express";
import * as fanficsController from "./fanficsController.js";
import chaptersRoutes from "../chapters/chaptersRoutes.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();

router.get('/', fanficsController.getAllFanfics);
router.get('/:fanficId', fanficsController.getFanficById);
router.get('/search', fanficsController.searchFanfics);
router.post('/', authMiddleware, fanficsController.createFanfic);
router.patch('/:fanficId', authMiddleware, fanficsController.patchFanfic);
router.delete('/:fanficId', authMiddleware, fanficsController.deleteFanfic);

router.use('/:fanficId/chapters', chaptersRoutes);

export default router;
