import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import ConnectionController from '../controllers/ConnectionController';

const router = Router();

router.use(authenticate);

router.post('/request', ConnectionController.sendRequest.bind(ConnectionController));
router.get('/pending', ConnectionController.getPendingRequests.bind(ConnectionController));
router.post('/respond/:id', ConnectionController.respondToRequest.bind(ConnectionController));
router.get('/linked', ConnectionController.getLinkedUsers.bind(ConnectionController));
router.delete('/:id', ConnectionController.disconnect.bind(ConnectionController));
router.get('/items/:userId', ConnectionController.getLinkedUserItems.bind(ConnectionController));

export default router;
