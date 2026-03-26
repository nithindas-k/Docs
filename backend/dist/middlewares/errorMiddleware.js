"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const constants_1 = require("../constants");
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: constants_1.MESSAGES.SERVER_ERROR,
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
};
exports.errorHandler = errorHandler;
