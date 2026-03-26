"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthService_1 = __importDefault(require("../services/AuthService"));
const constants_1 = require("../constants");
class AuthController {
    async googleCallback(req, res) {
        try {
            const result = await AuthService_1.default.handleGoogleLogin(req.body);
            res.status(constants_1.STATUS_CODES.OK).json({
                message: constants_1.MESSAGES.SUCCESS,
                data: result,
            });
        }
        catch (error) {
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
