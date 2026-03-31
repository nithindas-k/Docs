import { Router } from 'express';
import authRoutes from './authRoutes';
import categoryRoutes from './categoryRoutes';
import itemRoutes from './itemRoutes';
import personRoutes from './personRoutes';
import connectionRoutes from './connectionRoutes';
import scannerRoutes from './scannerRoutes';

const router = Router();

router.use('', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/items', itemRoutes);
router.use('/persons', personRoutes);
router.use('/connections', connectionRoutes);
router.use('/scanner', scannerRoutes);

export default router;
