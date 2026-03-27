import ItemRepository from '../repositories/ItemRepository';
import { encrypt, decrypt } from '../utils/encryption';

class ItemService {
  async getItemsByCategory(categoryId: string, userId: string) {
    const items = await ItemRepository.findByCategoryIdAndUser(categoryId, userId);
   
    return items.map(item => {
      const decryptedFields = item.fields.map(field => {
        if (field.isEncrypted) {
          return { ...field, value: decrypt(field.value) };
        }
        return field;
      });
      return { ...item.toObject(), fields: decryptedFields };
    });
  }

  async getItemsByPerson(personId: string, userId: string) {
    const items = await ItemRepository.findByPersonIdAndUser(personId, userId);
    return items.map(item => {
      const decryptedFields = item.fields.map(field => {
        if (field.isEncrypted) {
          return { ...field, value: decrypt(field.value) };
        }
        return field;
      });
      return { ...item.toObject(), fields: decryptedFields };
    });
  }

  async getItemById(id: string, userId: string) {
    const item = await ItemRepository.findByIdAndUser(id, userId);
    if (!item) return null;
    
    const decryptedFields = item.fields.map(field => {
      if (field.isEncrypted) {
        return { ...field, value: decrypt(field.value) };
      }
      return field;
    });
    return { ...item.toObject(), fields: decryptedFields };
  }

  async createItem(userId: string, categoryId: string, data: any) {
    const fieldsToSave = data.fields?.map((field: any) => {
      if (field.isEncrypted) {
        return { ...field, value: encrypt(field.value) };
      }
      return field;
    });

     return ItemRepository.create({
      user: userId as any,
      category: categoryId as any,
      title: data.title,
      photoUrl: data.photoUrl,
      photoUrls: data.photoUrls || [],
      person: data.person,
      fields: fieldsToSave || [],
    } as any);
  }

  async updateItem(userId: string, itemId: string, data: any) {
    const item = await ItemRepository.findByIdAndUser(itemId, userId);
    if (!item) return null;

    const fieldsToSave = data.fields?.map((field: any) => {
      if (field.isEncrypted && !field.value.startsWith('iv:')) {
     
        return { ...field, value: encrypt(field.value) };
      }
      return field;
    });

    item.title = data.title;
   
    if (data.photoUrl !== undefined) {
      item.photoUrl = data.photoUrl;
    }
    if (data.photoUrls !== undefined) {
      (item as any).photoUrls = data.photoUrls;
    }
    if (data.person !== undefined) {
      item.person = data.person;
    }
    item.fields = fieldsToSave || [];
    await item.save();

    return this.getItemById(itemId, userId);
  }

  async deleteItem(userId: string, itemId: string) {
    return ItemRepository.delete(itemId, userId);
  }
}

export default new ItemService();
