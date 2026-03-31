import { Router } from 'express';
import { scannerController, uploadMiddleware } from '../controllers/ScannerController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Universal scanning endpoint
router.post('/scan', authenticate, uploadMiddleware, scannerController.scanDocument);

// Alias for Aadhaar scanning (backward compatibility)
router.post('/scan-aadhaar', authenticate, uploadMiddleware, scannerController.scanAadhaar);

export default router;
