import { Request, Response } from 'express';
import { AadhaarScannerService } from '../services/AadhaarScannerService';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const scannerService = new AadhaarScannerService();

export class ScannerController {
  async scanAadhaar(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image file uploaded' });
      }

      const result = await scannerService.scanAadhaar(req.file.buffer);
      
      let warning = '';
      if (result.isFront && !result.isBack && !result.address) {
        warning = 'Front side detected. Please upload the back side for address details.';
      } else if (result.isBack && !result.isFront && !result.name) {
        warning = 'Back side detected. Please upload the front side for name and identity details.';
      }

      return res.json({
        success: true,
        data: result,
        detectedSide: result.isFront ? 'front' : (result.isBack ? 'back' : null),
        warning: warning
      });
    } catch (error: any) {
      console.error('Scanner Controller Error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Error scanning document'
      });
    }
  }
}

export const scannerController = new ScannerController();
export const uploadMiddleware = upload.single('image');
