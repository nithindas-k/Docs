"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const constants_1 = require("../constants");
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(constants_1.STATUS_CODES.UNAUTHORIZED).json({ message: constants_1.MESSAGES.UNAUTHORIZED });
        }
        const token = authHeader.split(' ')[1];
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(constants_1.STATUS_CODES.UNAUTHORIZED).json({ message: constants_1.MESSAGES.UNAUTHORIZED });
    }
};
exports.authenticate = authenticate;
