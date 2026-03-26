import Item, { IItem } from '../models/Item';

class ItemRepository {
  async findByCategoryIdAndUser(categoryId: string, userId: string): Promise<IItem[]> {
    return Item.find({ category: categoryId, user: userId });
  }

  async findByIdAndUser(id: string, userId: string): Promise<IItem | null> {
    return Item.findOne({ _id: id, user: userId });
  }

  async create(itemData: Partial<IItem>): Promise<IItem> {
    return Item.create(itemData);
  }

  async delete(id: string, userId: string): Promise<IItem | null> {
    return Item.findOneAndDelete({ _id: id, user: userId });
  }
}

export default new ItemRepository();
