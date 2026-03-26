import { Router } from 'express';
import CategoryController from '../controllers/CategoryController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', CategoryController.getCategories);
router.post('/', CategoryController.createCategory);

export default router;
