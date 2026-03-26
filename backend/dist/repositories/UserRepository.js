"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
class UserRepository {
    async findByGoogleId(googleId) {
        return User_1.default.findOne({ googleId });
    }
    async findById(id) {
        return User_1.default.findById(id);
    }
    async create(userData) {
        return User_1.default.create(userData);
    }
}
exports.default = new UserRepository();
