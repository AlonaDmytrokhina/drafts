import { Router } from 'express';

import authRoutes from './modules/auth/authRoutes.js';
import usersRoutes from './modules/users/usersRoutes.js';
import fanficsRoutes from './modules/fanfics/fanficsRoutes.js';
import tagsRoutes from "./modules/tags/tagsRoutes.js";
import readingHistoryRoutes from "./modules/reading-history/readingHistoryRoutes.js";

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/fanfics', fanficsRoutes);
router.use('/tags', tagsRoutes);
router.use('/reading-history', readingHistoryRoutes);

export default router;