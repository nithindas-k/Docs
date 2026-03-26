"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CategoryService_1 = __importDefault(require("../services/CategoryService"));
const constants_1 = require("../constants");
class CategoryController {
    async getCategories(req, res) {
        try {
            const categories = await CategoryService_1.default.getUserCategories(req.user.userId);
            res.status(constants_1.STATUS_CODES.OK).json({ data: categories });
        }
        catch (error) {
            res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: constants_1.MESSAGES.SERVER_ERROR });
        }
    }
    async createCategory(req, res) {
        try {
            const category = await CategoryService_1.default.createCategory(req.user.userId, req.body);
            res.status(constants_1.STATUS_CODES.CREATED).json({
                message: constants_1.MESSAGES.CREATED,
                data: category,
            });
        }
        catch (error) {
            res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: constants_1.MESSAGES.SERVER_ERROR });
        }
    }
}
exports.default = new CategoryController();
