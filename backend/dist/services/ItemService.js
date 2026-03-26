"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ItemRepository_1 = __importDefault(require("../repositories/ItemRepository"));
const encryption_1 = require("../utils/encryption");
class ItemService {
    async getItemsByCategory(categoryId, userId) {
        const items = await ItemRepository_1.default.findByCategoryIdAndUser(categoryId, userId);
        // Decrypt fields before sending to client
        return items.map(item => {
            const decryptedFields = item.fields.map(field => {
                if (field.isEncrypted) {
                    return { ...field, value: (0, encryption_1.decrypt)(field.value) };
                }
                return field;
            });
            return { ...item.toObject(), fields: decryptedFields };
        });
    }
    async getItemById(id, userId) {
        const item = await ItemRepository_1.default.findByIdAndUser(id, userId);
        if (!item)
            return null;
        const decryptedFields = item.fields.map(field => {
            if (field.isEncrypted) {
                return { ...field, value: (0, encryption_1.decrypt)(field.value) };
            }
            return field;
        });
        return { ...item.toObject(), fields: decryptedFields };
    }
    async createItem(userId, categoryId, data) {
        const fieldsToSave = data.fields?.map((field) => {
            if (field.isEncrypted) {
                return { ...field, value: (0, encryption_1.encrypt)(field.value) };
            }
            return field;
        });
        return ItemRepository_1.default.create({
            user: userId,
            category: categoryId,
            title: data.title,
            photoUrl: data.photoUrl,
            fields: fieldsToSave || [],
        });
    }
    async updateItem(userId, itemId, data) {
        const item = await ItemRepository_1.default.findByIdAndUser(itemId, userId);
        if (!item)
            return null;
        const fieldsToSave = data.fields?.map((field) => {
            if (field.isEncrypted && !field.value.startsWith('iv:')) {
                // Only encrypt if not already encrypted
                return { ...field, value: (0, encryption_1.encrypt)(field.value) };
            }
            return field;
        });
        item.title = data.title;
        item.photoUrl = data.photoUrl;
        item.fields = fieldsToSave || [];
        await item.save();
        return this.getItemById(itemId, userId);
    }
    async deleteItem(userId, itemId) {
        return ItemRepository_1.default.delete(itemId, userId);
    }
}
exports.default = new ItemService();
