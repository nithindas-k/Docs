import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { authenticate } from '../middlewares/authMiddleware';
import { ROUTES } from '../constants';

const router = Router();

router.post(ROUTES.AUTH.GOOGLE, AuthController.googleCallback);
router.get(ROUTES.AUTH.PROFILE, authenticate, AuthController.getProfile);

export default router;
