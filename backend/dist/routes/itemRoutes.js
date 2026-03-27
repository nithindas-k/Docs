"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ItemController_1 = __importDefault(require("../controllers/ItemController"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const uploadMiddleware_1 = __importDefault(require("../middlewares/uploadMiddleware"));
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticate);
router.get('/category/:categoryId', ItemController_1.default.getItemsByCategory);
router.get('/person/:personId', ItemController_1.default.getItemsByPerson);
router.get('/:id', ItemController_1.default.getItemById);
router.post('/', uploadMiddleware_1.default.array('photos', 5), ItemController_1.default.createItem);
router.put('/:id', uploadMiddleware_1.default.array('photos', 5), ItemController_1.default.updateItem);
router.delete('/:id', ItemController_1.default.deleteItem);
exports.default = router;
