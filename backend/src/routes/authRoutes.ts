import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { authenticate } from '../middlewares/authMiddleware';
import { ROUTES } from '../constants';

const router = Router();

router.get(ROUTES.AUTH.GOOGLE, AuthController.initGoogleAuth);
router.get(ROUTES.AUTH.GOOGLE_CALLBACK, AuthController.googleCallback);
router.get(ROUTES.AUTH.PROFILE, authenticate, AuthController.getProfile);

export default router;
