import { Request, Response } from 'express';
import ItemService from '../services/ItemService';
import { STATUS_CODES, MESSAGES } from '../constants';

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

  async createItem(req: Request, res: Response) {
    try {
      const { category, title, fields } = req.body;
      if (!category || !title) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Category and title are required' });
      }
      const item = await ItemService.createItem(req.user!.userId, category, { title, fields });
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
      const { title, fields } = req.body;
      if (!title) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Title is required' });
      }
      const item = await ItemService.updateItem(req.user!.userId, id, { title, fields });
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
