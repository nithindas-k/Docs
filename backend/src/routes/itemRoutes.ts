import { Router } from 'express';
import ItemController from '../controllers/ItemController';
import { authenticate } from '../middlewares/authMiddleware';
import upload from '../middlewares/uploadMiddleware';

const router = Router();

router.use(authenticate);

router.get('/category/:categoryId', ItemController.getItemsByCategory);
router.get('/person/:personId', ItemController.getItemsByPerson);
router.get('/:id', ItemController.getItemById);
router.post('/', upload.array('photos', 5), ItemController.createItem);
router.put('/:id', upload.array('photos', 5), ItemController.updateItem);
router.delete('/:id', ItemController.deleteItem);

export default router;
