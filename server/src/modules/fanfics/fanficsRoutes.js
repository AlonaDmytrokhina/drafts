import { Router } from "express";
import * as fanficsController from "./fanficsController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();

router.get('/', fanficsController.getAllFanfics);
router.get('/:id', fanficsController.getFanficById);
router.get('/search', fanficsController.searchFanfics);
router.post('/', authMiddleware, fanficsController.createFanfic);
router.patch('/:id', authMiddleware, fanficsController.patchFanfic);
router.delete('/:id', authMiddleware, fanficsController.deleteFanfic);

export default router;
