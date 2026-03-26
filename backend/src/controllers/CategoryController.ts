import { Request, Response } from 'express';
import CategoryService from '../services/CategoryService';
import { STATUS_CODES, MESSAGES } from '../constants';

class CategoryController {
  async getCategories(req: Request, res: Response) {
    try {
      const categories = await CategoryService.getUserCategories(req.user!.userId);
      res.status(STATUS_CODES.OK).json({ data: categories });
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR });
    }
  }

  async createCategory(req: Request, res: Response) {
    try {
      const category = await CategoryService.createCategory(req.user!.userId, req.body);
      res.status(STATUS_CODES.CREATED).json({
        message: MESSAGES.CREATED,
        data: category,
      });
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR });
    }
  }
}

export default new CategoryController();
