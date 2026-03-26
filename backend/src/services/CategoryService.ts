import CategoryRepository from '../repositories/CategoryRepository';

class CategoryService {
  async getUserCategories(userId: string) {
    return CategoryRepository.findByUser(userId);
  }

  async createCategory(userId: string, data: { name: string; icon: string }) {
    return CategoryRepository.create({ ...data, user: userId as any } as any);
  }
}

export default new CategoryService();
