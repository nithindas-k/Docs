"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserRepository_1 = __importDefault(require("../repositories/UserRepository"));
const CategoryRepository_1 = __importDefault(require("../repositories/CategoryRepository"));
const jwt_1 = require("../utils/jwt");
class AuthService {
    async handleGoogleLogin(data) {
        let user = await UserRepository_1.default.findByGoogleId(data.googleId);
        if (!user) {
            user = await UserRepository_1.default.create(data);
            const userId = user._id;
            const defaultCategories = [
                { name: 'Aadhaar', icon: 'credit-card' },
                { name: 'Driving Licence', icon: 'car' },
                { name: 'PAN Card', icon: 'file-text' },
                { name: 'Bank Account', icon: 'landmark' },
                { name: 'SSLC', icon: 'graduation-cap' },
                { name: 'Voter ID', icon: 'user-check' },
                { name: 'Passport', icon: 'book' },
            ].map(cat => ({ ...cat, user: userId, isDefault: true }));
            await CategoryRepository_1.default.createMany(defaultCategories);
        }
        const token = (0, jwt_1.generateToken)(user._id);
        return { user, token };
    }
    async getProfile(userId) {
        return UserRepository_1.default.findById(userId);
    }
}
exports.default = new AuthService();
