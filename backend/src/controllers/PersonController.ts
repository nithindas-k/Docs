import { Request, Response } from 'express';
import PersonService from '../services/PersonService';
import { STATUS_CODES, MESSAGES } from '../constants';

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
      const person = await PersonService.createPerson(req.user!.userId, req.body);
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
      const person = await PersonService.updatePerson(req.user!.userId, id, req.body);
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
