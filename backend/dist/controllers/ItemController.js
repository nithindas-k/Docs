"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ItemService_1 = __importDefault(require("../services/ItemService"));
const constants_1 = require("../constants");
const cloudinary_1 = require("../utils/cloudinary");
class ItemController {
    async getItemsByCategory(req, res) {
        try {
            const { categoryId } = req.params;
            const items = await ItemService_1.default.getItemsByCategory(categoryId, req.user.userId);
            res.status(constants_1.STATUS_CODES.OK).json({ data: items });
        }
        catch (error) {
            res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: constants_1.MESSAGES.SERVER_ERROR });
        }
    }
    async createItem(req, res) {
        try {
            const { category, title, fields } = req.body;
            const file = req.file;
            if (!category || !title) {
                return res.status(constants_1.STATUS_CODES.BAD_REQUEST).json({ message: 'Category and title are required' });
            }
            let photoUrl;
            if (file) {
                try {
                    photoUrl = await (0, cloudinary_1.uploadToCloudinary)(file.buffer, file.originalname);
                }
                catch (uploadError) {
                    return res.status(constants_1.STATUS_CODES.BAD_REQUEST).json({ message: 'Photo upload failed' });
                }
            }
            const item = await ItemService_1.default.createItem(req.user.userId, category, {
                title,
                fields: fields ? JSON.parse(fields) : undefined,
                photoUrl,
            });
            res.status(constants_1.STATUS_CODES.CREATED).json({
                message: constants_1.MESSAGES.CREATED,
                data: item,
            });
        }
        catch (error) {
            res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: constants_1.MESSAGES.SERVER_ERROR });
        }
    }
    async updateItem(req, res) {
        try {
            const { id } = req.params;
            const { title, fields } = req.body;
            const file = req.file;
            if (!title) {
                return res.status(constants_1.STATUS_CODES.BAD_REQUEST).json({ message: 'Title is required' });
            }
            let photoUrl;
            if (file) {
                try {
                    photoUrl = await (0, cloudinary_1.uploadToCloudinary)(file.buffer, file.originalname);
                }
                catch (uploadError) {
                    return res.status(constants_1.STATUS_CODES.BAD_REQUEST).json({ message: 'Photo upload failed' });
                }
            }
            const item = await ItemService_1.default.updateItem(req.user.userId, id, {
                title,
                fields: fields ? JSON.parse(fields) : undefined,
                photoUrl: photoUrl || undefined,
            });
            if (!item) {
                return res.status(constants_1.STATUS_CODES.NOT_FOUND).json({ message: constants_1.MESSAGES.NOT_FOUND });
            }
            res.status(constants_1.STATUS_CODES.OK).json({
                message: constants_1.MESSAGES.SUCCESS,
                data: item,
            });
        }
        catch (error) {
            res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: constants_1.MESSAGES.SERVER_ERROR });
        }
    }
    async deleteItem(req, res) {
        try {
            const { id } = req.params;
            const item = await ItemService_1.default.deleteItem(req.user.userId, id);
            if (!item) {
                return res.status(constants_1.STATUS_CODES.NOT_FOUND).json({ message: constants_1.MESSAGES.NOT_FOUND });
            }
            res.status(constants_1.STATUS_CODES.OK).json({ message: constants_1.MESSAGES.SUCCESS });
        }
        catch (error) {
            res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: constants_1.MESSAGES.SERVER_ERROR });
        }
    }
}
exports.default = new ItemController();
