import Category, { ICategory } from '../models/Category';

class CategoryRepository {
  async findByUser(userId: string): Promise<ICategory[]> {
    return Category.find({ user: userId });
  }

  async create(categoryData: Partial<ICategory>): Promise<ICategory> {
    return Category.create(categoryData);
  }

  async createMany(categories: Partial<ICategory>[]): Promise<ICategory[]> {
    return Category.insertMany(categories) as Promise<ICategory[]>;
  }
}

export default new CategoryRepository();
