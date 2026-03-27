import { Router } from 'express';
import PersonController from '../controllers/PersonController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', PersonController.getPersons);
router.post('/', PersonController.createPerson);
router.put('/:id', PersonController.updatePerson);
router.delete('/:id', PersonController.deletePerson);

export default router;
