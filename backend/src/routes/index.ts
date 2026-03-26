import { Router } from 'express';
import authRoutes from './authRoutes';
import categoryRoutes from './categoryRoutes';
import itemRoutes from './itemRoutes';

const router = Router();

router.use('', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/items', itemRoutes);

export default router;
