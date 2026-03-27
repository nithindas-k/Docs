"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
    async getItemById(req, res) {
        try {
            const { id } = req.params;
            const myUserId = req.user.userId;
            let item = await ItemService_1.default.getItemById(id, myUserId);
            if (!item) {
                const Item = (await Promise.resolve().then(() => __importStar(require('../models/Item')))).default;
                const Connection = (await Promise.resolve().then(() => __importStar(require('../models/Connection')))).default;
                const rawItem = await Item.findById(id);
                if (!rawItem) {
                    return res.status(constants_1.STATUS_CODES.NOT_FOUND).json({ message: constants_1.MESSAGES.NOT_FOUND });
                }
                const itemOwnerId = rawItem.user.toString();
                const connection = await Connection.findOne({
                    $or: [
                        { fromUser: myUserId, toUser: itemOwnerId, status: 'accepted' },
                        { fromUser: itemOwnerId, toUser: myUserId, status: 'accepted' },
                    ],
                });
                if (!connection) {
                    return res.status(constants_1.STATUS_CODES.NOT_FOUND).json({ message: constants_1.MESSAGES.NOT_FOUND });
                }
                // Allowed — return item as-is (no decryption for linked user's encrypted fields for now)
                item = rawItem.toObject();
            }
            res.status(constants_1.STATUS_CODES.OK).json({ data: item });
        }
        catch (error) {
            res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: constants_1.MESSAGES.SERVER_ERROR });
        }
    }
    async getItemsByPerson(req, res) {
        try {
            const { personId } = req.params;
            const items = await ItemService_1.default.getItemsByPerson(personId, req.user.userId);
            res.status(constants_1.STATUS_CODES.OK).json({ data: items });
        }
        catch (error) {
            res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: constants_1.MESSAGES.SERVER_ERROR });
        }
    }
    async createItem(req, res) {
        try {
            const { category, title, fields, person } = req.body;
            const files = req.files;
            if (!category || !title) {
                return res.status(constants_1.STATUS_CODES.BAD_REQUEST).json({ message: 'Category and title are required' });
            }
            const photoUrls = [];
            if (files && files.length > 0) {
                try {
                    const uploadPromises = files.map(file => (0, cloudinary_1.uploadToCloudinary)(file.buffer, file.originalname));
                    const results = await Promise.all(uploadPromises);
                    photoUrls.push(...results);
                }
                catch (uploadError) {
                    console.error('Cloudinary Bulk Upload Error (create):', uploadError);
                    return res.status(constants_1.STATUS_CODES.BAD_REQUEST).json({ message: 'Photo upload failed' });
                }
            }
            const item = await ItemService_1.default.createItem(req.user.userId, category, {
                title,
                fields: fields ? JSON.parse(fields) : undefined,
                photoUrls,
                photoUrl: photoUrls.length > 0 ? photoUrls[0] : undefined, // For backwards compatibility
                person: person || undefined,
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
            const { title, fields, person } = req.body;
            const files = req.files;
            if (!title) {
                return res.status(constants_1.STATUS_CODES.BAD_REQUEST).json({ message: 'Title is required' });
            }
            const photoUrls = [];
            if (files && files.length > 0) {
                try {
                    const uploadPromises = files.map(file => (0, cloudinary_1.uploadToCloudinary)(file.buffer, file.originalname));
                    const results = await Promise.all(uploadPromises);
                    photoUrls.push(...results);
                }
                catch (uploadError) {
                    console.error('Cloudinary Bulk Upload Error (update):', uploadError);
                    return res.status(constants_1.STATUS_CODES.BAD_REQUEST).json({ message: 'Photo upload failed' });
                }
            }
            const updateData = {
                title,
                fields: fields ? JSON.parse(fields) : undefined,
                person: person || undefined,
            };
            if (photoUrls.length > 0) {
                updateData.photoUrls = photoUrls;
                updateData.photoUrl = photoUrls[0];
            }
            const item = await ItemService_1.default.updateItem(req.user.userId, id, updateData);
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
