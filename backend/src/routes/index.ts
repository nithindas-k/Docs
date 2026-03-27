import { Router } from 'express';
import authRoutes from './authRoutes';
import categoryRoutes from './categoryRoutes';
import itemRoutes from './itemRoutes';
import personRoutes from './personRoutes';

const router = Router();

router.use('', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/items', itemRoutes);
router.use('/persons', personRoutes);

export default router;
