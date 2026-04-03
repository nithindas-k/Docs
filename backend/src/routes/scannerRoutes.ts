import { Router } from 'express';
import { scannerController, uploadMiddleware } from '../controllers/ScannerController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();


router.post('/scan', authenticate, uploadMiddleware, scannerController.scanDocument);


router.post('/scan-aadhaar', authenticate, uploadMiddleware, scannerController.scanAadhaar);

export default router;
