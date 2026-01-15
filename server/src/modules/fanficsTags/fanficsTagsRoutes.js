import { Router } from "express";
import * as fanficsTagsController from "./fanficsTagsController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router({ mergeParams: true });

router.post('/', authMiddleware, fanficsTagsController.createFanficTag);
router.delete('/', authMiddleware, fanficsTagsController.deleteFanficTag);

export default router;