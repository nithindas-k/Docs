import { Request, Response } from 'express';
import AuthService from '../services/AuthService';
import { STATUS_CODES, MESSAGES } from '../constants';

class AuthController {
  async googleCallback(req: Request, res: Response) {
    try {
      const result = await AuthService.handleGoogleLogin(req.body);
      res.status(STATUS_CODES.OK).json({
        message: MESSAGES.SUCCESS,
        data: result,
      });
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.UNAUTHORIZED });
      }
      const profile = await AuthService.getProfile(req.user.userId);
      res.status(STATUS_CODES.OK).json({ data: profile });
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR });
    }
  }
}

export default new AuthController();
