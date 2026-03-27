"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const categoryRoutes_1 = __importDefault(require("./categoryRoutes"));
const itemRoutes_1 = __importDefault(require("./itemRoutes"));
const personRoutes_1 = __importDefault(require("./personRoutes"));
const connectionRoutes_1 = __importDefault(require("./connectionRoutes"));
const router = (0, express_1.Router)();
router.use('', authRoutes_1.default);
router.use('/categories', categoryRoutes_1.default);
router.use('/items', itemRoutes_1.default);
router.use('/persons', personRoutes_1.default);
router.use('/connections', connectionRoutes_1.default);
exports.default = router;
