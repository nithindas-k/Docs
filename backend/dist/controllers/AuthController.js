"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthService_1 = __importDefault(require("../services/AuthService"));
const constants_1 = require("../constants");
const googleAuth_1 = require("../utils/googleAuth");
class AuthController {
    async initGoogleAuth(_req, res) {
        const url = (0, googleAuth_1.getAuthUrl)();
        res.redirect(url);
    }
    async googleCallback(req, res) {
        try {
            const { code } = req.query;
            if (!code) {
                return res.status(constants_1.STATUS_CODES.BAD_REQUEST).json({ message: 'Code is required' });
            }
            const googleUser = await (0, googleAuth_1.getGoogleUser)(code);
            const { user, token } = await AuthService_1.default.handleGoogleLogin(googleUser);
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            res.redirect(`${frontendUrl}/login?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
        }
        catch (error) {
            console.error('Google Auth Error:', error);
            res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: constants_1.MESSAGES.SERVER_ERROR });
        }
    }
    async getProfile(req, res) {
        try {
            if (!req.user) {
                return res.status(constants_1.STATUS_CODES.UNAUTHORIZED).json({ message: constants_1.MESSAGES.UNAUTHORIZED });
            }
            const profile = await AuthService_1.default.getProfile(req.user.userId);
            res.status(constants_1.STATUS_CODES.OK).json({ data: profile });
        }
        catch (error) {
            res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: constants_1.MESSAGES.SERVER_ERROR });
        }
    }
}
exports.default = new AuthController();
