import UserRepository from '../repositories/UserRepository';
import CategoryRepository from '../repositories/CategoryRepository';
import { generateToken } from '../utils/jwt';

class AuthService {
  async handleGoogleLogin(data: { googleId: string; email: string; name: string; picture?: string }) {
    let user = await UserRepository.findByGoogleId(data.googleId);

    if (!user) {
      user = await UserRepository.create(data);
      
      // Auto-create default categories for new users
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
      
      await CategoryRepository.createMany(defaultCategories);
    }

    const token = generateToken(user._id);
    return { user, token };
  }

  async getProfile(userId: string) {
    return UserRepository.findById(userId);
  }
}

export default new AuthService();
