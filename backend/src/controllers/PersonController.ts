import { Request, Response } from 'express';
import PersonService from '../services/PersonService';
import { STATUS_CODES, MESSAGES } from '../constants';

import { uploadToCloudinary } from '../utils/cloudinary';

class PersonController {
  async getPersons(req: Request, res: Response) {
    try {
      const persons = await PersonService.getUserPersons(req.user!.userId);
      res.status(STATUS_CODES.OK).json({ data: persons });
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR });
    }
  }

  async createPerson(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const file = (req as any).file;

      if (!name) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Name is required' });
      }

      let imageUrl: string | undefined;
      if (file) {
        try {
          imageUrl = await uploadToCloudinary(file.buffer, file.originalname, 'persons');
        } catch (uploadError) {
          console.error('Cloudinary Upload Error (person create):', uploadError);
          return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Profile image upload failed' });
        }
      }

      const person = await PersonService.createPerson(req.user!.userId, {
        name,
        imageUrl,
      });

      res.status(STATUS_CODES.CREATED).json({
        message: MESSAGES.CREATED,
        data: person,
      });
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR });
    }
  }

  async updatePerson(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const file = (req as any).file;

      let imageUrl: string | undefined;
      if (file) {
        try {
          imageUrl = await uploadToCloudinary(file.buffer, file.originalname, 'persons');
        } catch (uploadError) {
          console.error('Cloudinary Upload Error (person update):', uploadError);
          return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Profile image upload failed' });
        }
      }

      const person = await PersonService.updatePerson(req.user!.userId, id, {
        name,
        imageUrl: imageUrl || undefined,
      });

      if (!person) {
        return res.status(STATUS_CODES.NOT_FOUND).json({ message: MESSAGES.NOT_FOUND });
      }
      res.status(STATUS_CODES.OK).json({
        message: MESSAGES.SUCCESS,
        data: person,
      });
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR });
    }
  }

  async deletePerson(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const person = await PersonService.deletePerson(req.user!.userId, id);
      if (!person) {
        return res.status(STATUS_CODES.NOT_FOUND).json({ message: MESSAGES.NOT_FOUND });
      }
      res.status(STATUS_CODES.OK).json({ message: MESSAGES.DELETED });
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR });
    }
  }
}

export default new PersonController();
