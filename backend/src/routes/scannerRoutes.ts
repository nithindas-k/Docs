import { Router } from 'express';
import { scannerController, uploadMiddleware } from '../controllers/ScannerController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Endpoint for Aadhaar scanning (requires authentication)
router.post('/scan-aadhaar', authenticate, uploadMiddleware, scannerController.scanAadhaar);

export default router;
