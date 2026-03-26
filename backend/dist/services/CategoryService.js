"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CategoryRepository_1 = __importDefault(require("../repositories/CategoryRepository"));
class CategoryService {
    async getUserCategories(userId) {
        return CategoryRepository_1.default.findByUser(userId);
    }
    async createCategory(userId, data) {
        return CategoryRepository_1.default.create({ ...data, user: userId });
    }
}
exports.default = new CategoryService();
