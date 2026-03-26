import User, { IUser } from '../models/User';

class UserRepository {
  async findByGoogleId(googleId: string): Promise<IUser | null> {
    return User.findOne({ googleId });
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  async create(userData: Partial<IUser>): Promise<IUser> {
    return User.create(userData);
  }
}

export default new UserRepository();
