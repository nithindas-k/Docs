import { Router } from 'express';
import PersonController from '../controllers/PersonController';
import { authenticate } from '../middlewares/authMiddleware';

import upload from '../middlewares/uploadMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', PersonController.getPersons);
router.post('/', upload.single('photo'), PersonController.createPerson);
router.put('/:id', upload.single('photo'), PersonController.updatePerson);
router.delete('/:id', PersonController.deletePerson);

export default router;
