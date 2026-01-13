import { Router } from 'express';

import authRoutes from './modules/auth/authRoutes.js';
import usersRoutes from './modules/users/usersRoutes.js';
import fanficsRoutes from './modules/fanfics/fanficsRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/fanfics', fanficsRoutes);

export default router;