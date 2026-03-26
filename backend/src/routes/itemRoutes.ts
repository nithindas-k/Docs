import { Router } from 'express';
import ItemController from '../controllers/ItemController';
import { authenticate } from '../middlewares/authMiddleware';
import upload from '../middlewares/uploadMiddleware';

const router = Router();

router.use(authenticate);

router.get('/category/:categoryId', ItemController.getItemsByCategory);
router.post('/', upload.single('photo'), ItemController.createItem);
router.put('/:id', upload.single('photo'), ItemController.updateItem);
router.delete('/:id', ItemController.deleteItem);

export default router;
