"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Category_1 = __importDefault(require("../models/Category"));
class CategoryRepository {
    async findByUser(userId) {
        return Category_1.default.find({ user: userId });
    }
    async create(categoryData) {
        return Category_1.default.create(categoryData);
    }
    async createMany(categories) {
        return Category_1.default.insertMany(categories);
    }
}
exports.default = new CategoryRepository();
