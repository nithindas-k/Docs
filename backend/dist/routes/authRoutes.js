"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const constants_1 = require("../constants");
const router = (0, express_1.Router)();
router.get(constants_1.ROUTES.AUTH.GOOGLE, AuthController_1.default.initGoogleAuth);
router.get(constants_1.ROUTES.AUTH.GOOGLE_CALLBACK, AuthController_1.default.googleCallback);
router.get(constants_1.ROUTES.AUTH.PROFILE, authMiddleware_1.authenticate, AuthController_1.default.getProfile);
exports.default = router;
