"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = __importDefault(require("../models/Item"));
class ItemRepository {
    async findByCategoryIdAndUser(categoryId, userId) {
        return Item_1.default.find({ category: categoryId, user: userId });
    }
    async findByPersonIdAndUser(personId, userId) {
        return Item_1.default.find({ person: personId, user: userId });
    }
    async findByIdAndUser(id, userId) {
        return Item_1.default.findOne({ _id: id, user: userId });
    }
    async create(itemData) {
        return Item_1.default.create(itemData);
    }
    async delete(id, userId) {
        return Item_1.default.findOneAndDelete({ _id: id, user: userId });
    }
}
exports.default = new ItemRepository();
