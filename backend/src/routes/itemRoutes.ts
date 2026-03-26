import { Router } from 'express';
import ItemController from '../controllers/ItemController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/category/:categoryId', ItemController.getItemsByCategory);
router.post('/', ItemController.createItem);
router.put('/:id', ItemController.updateItem);
router.delete('/:id', ItemController.deleteItem);

export default router;
