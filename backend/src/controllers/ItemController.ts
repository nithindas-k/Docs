import { Request, Response } from 'express';
import ItemService from '../services/ItemService';
import { STATUS_CODES, MESSAGES } from '../constants';
import { uploadToCloudinary } from '../utils/cloudinary';

class ItemController {
  async getItemsByCategory(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      const items = await ItemService.getItemsByCategory(categoryId, req.user!.userId);
      res.status(STATUS_CODES.OK).json({ data: items });
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR });
    }
  }

  async getItemById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const item = await ItemService.getItemById(id, req.user!.userId);
      if (!item) {
        return res.status(STATUS_CODES.NOT_FOUND).json({ message: MESSAGES.NOT_FOUND });
      }
      res.status(STATUS_CODES.OK).json({ data: item });
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR });
    }
  }

  async getItemsByPerson(req: Request, res: Response) {
    try {
      const { personId } = req.params;
      const items = await ItemService.getItemsByPerson(personId, req.user!.userId);
      res.status(STATUS_CODES.OK).json({ data: items });
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR });
    }
  }

  async createItem(req: Request, res: Response) {
    try {
      const { category, title, fields, person } = req.body;
      const files = (req as any).files as any[];

      if (!category || !title) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Category and title are required' });
      }

      const photoUrls: string[] = [];
      if (files && files.length > 0) {
        try {
          const uploadPromises = files.map(file => 
            uploadToCloudinary(file.buffer, file.originalname)
          );
          const results = await Promise.all(uploadPromises);
          photoUrls.push(...results);
        } catch (uploadError) {
          console.error('Cloudinary Bulk Upload Error (create):', uploadError);
          return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Photo upload failed' });
        }
      }

      const item = await ItemService.createItem(req.user!.userId, category, { 
        title, 
        fields: fields ? JSON.parse(fields) : undefined,
        photoUrls,
        photoUrl: photoUrls.length > 0 ? photoUrls[0] : undefined, // For backwards compatibility
        person: person || undefined,
      });
      res.status(STATUS_CODES.CREATED).json({
        message: MESSAGES.CREATED,
        data: item,
      });
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR });
    }
  }

  async updateItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, fields, person } = req.body;
      const files = (req as any).files as any[];

      if (!title) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Title is required' });
      }

      const photoUrls: string[] = [];
      if (files && files.length > 0) {
        try {
          const uploadPromises = files.map(file => 
            uploadToCloudinary(file.buffer, file.originalname)
          );
          const results = await Promise.all(uploadPromises);
          photoUrls.push(...results);
        } catch (uploadError) {
          console.error('Cloudinary Bulk Upload Error (update):', uploadError);
          return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Photo upload failed' });
        }
      }

      const updateData: any = { 
        title, 
        fields: fields ? JSON.parse(fields) : undefined,
        person: person || undefined,
      };

      if (photoUrls.length > 0) {
        updateData.photoUrls = photoUrls;
        updateData.photoUrl = photoUrls[0];
      }

      const item = await ItemService.updateItem(req.user!.userId, id, updateData);
      if (!item) {
        return res.status(STATUS_CODES.NOT_FOUND).json({ message: MESSAGES.NOT_FOUND });
      }
      res.status(STATUS_CODES.OK).json({
        message: MESSAGES.SUCCESS,
        data: item,
      });
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR });
    }
  }

  async deleteItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const item = await ItemService.deleteItem(req.user!.userId, id);
      if (!item) {
        return res.status(STATUS_CODES.NOT_FOUND).json({ message: MESSAGES.NOT_FOUND });
      }
      res.status(STATUS_CODES.OK).json({ message: MESSAGES.SUCCESS });
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR });
    }
  }
}

export default new ItemController();
