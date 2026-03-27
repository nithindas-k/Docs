import { Request, Response } from 'express';
import AuthService from '../services/AuthService';
import { STATUS_CODES, MESSAGES } from '../constants';
import { getAuthUrl, getGoogleUser } from '../utils/googleAuth';

class AuthController {
  async initGoogleAuth(_req: Request, res: Response) {
    const url = getAuthUrl();
    res.redirect(url);
  }

  async googleCallback(req: Request, res: Response) {
    try {
      const { code } = req.query;
      if (!code) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Code is required' });
      }

      const googleUser = await getGoogleUser(code as string);
      const { user, token } = await AuthService.handleGoogleLogin(googleUser);

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/login?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
    } catch (error) {
      console.error('Google Auth Error:', error);
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
