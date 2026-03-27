import PersonRepository from '../repositories/PersonRepository';
import { IPerson } from '../models/Person';
import { uploadToCloudinary } from '../utils/cloudinary';

class PersonService {
  async getUserPersons(userId: string) {
    return PersonRepository.findByUser(userId);
  }

  async createPerson(userId: string, data: { name: string; imageUrl?: string }) {
    let finalImageUrl = data.imageUrl;

    if (data.imageUrl && data.imageUrl.startsWith('data:image')) {
      try { 
        // Extract base64 content
        const base64Data = data.imageUrl.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Upload to Cloudinary
        finalImageUrl = await uploadToCloudinary(buffer, `${data.name}_profile`);
      } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        // Fallback to data URL if upload fails (though not ideal)
      }
    }

    return PersonRepository.create({ ...data, imageUrl: finalImageUrl, user: userId as any });
  }

  async updatePerson(userId: string, id: string, data: { name?: string; imageUrl?: string }) {
    let finalImageUrl = data.imageUrl;

    if (data.imageUrl && data.imageUrl.startsWith('data:image')) {
      try {
        const base64Data = data.imageUrl.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        finalImageUrl = await uploadToCloudinary(buffer, `${data.name || 'updated'}_profile`);
      } catch (error) {
        console.error('Cloudinary Upload Error:', error);
      }
    }

    return PersonRepository.update(id, userId, { ...data, imageUrl: finalImageUrl });
  }

  async deletePerson(userId: string, id: string) {
    return PersonRepository.delete(id, userId);
  }
}

export default new PersonService();
