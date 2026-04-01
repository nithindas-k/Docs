import { Request, Response } from 'express';
import User from '../models/User';
import Connection from '../models/Connection';
import { STATUS_CODES, MESSAGES } from '../constants';

class ConnectionController {

  
  async sendRequest(req: Request, res: Response) {
    try {
      const fromUserId = req.user!.userId;
      const { email } = req.body;

      if (!email) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Email is required' });
      }

 
      const toUser = await User.findOne({ email: email.toLowerCase().trim() });
      if (!toUser) {
        return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'No user found with that email address' });
      }

      if (toUser._id.toString() === fromUserId) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'You cannot send a request to yourself' });
      }

     
      const existing = await Connection.findOne({
        $or: [
          { fromUser: fromUserId, toUser: toUser._id },
          { fromUser: toUser._id, toUser: fromUserId },
        ],
      });

      if (existing) {
        if (existing.status === 'accepted') {
          return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'You are already connected with this user' });
        }
        if (existing.status === 'pending') {
          return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'A link request is already pending with this user' });
        }
      
        await Connection.deleteOne({ _id: existing._id });
      }

      const connection = await Connection.create({ fromUser: fromUserId, toUser: toUser._id });
      return res.status(STATUS_CODES.CREATED).json({ message: 'Link request sent successfully', data: connection });
    } catch (error) {
      console.error('Send request error:', error);
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR });
    }
  }


  async getPendingRequests(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const pending = await Connection.find({ toUser: userId, status: 'pending' })
        .populate('fromUser', 'name email picture')
        .sort({ createdAt: -1 });

      return res.status(STATUS_CODES.OK).json({ data: pending });
    } catch (error) {
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR });
    }
  }


  async respondToRequest(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const { action } = req.body;

      if (!['accept', 'reject'].includes(action)) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Action must be accept or reject' });
      }

      const connection = await Connection.findOne({ _id: id, toUser: userId, status: 'pending' });
      if (!connection) {
        return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'Request not found' });
      }

      if (action === 'reject') {
        await Connection.deleteOne({ _id: id });
        return res.status(STATUS_CODES.OK).json({ message: 'Request rejected' });
      }

     
      connection.status = 'accepted';
      await connection.save();

      return res.status(STATUS_CODES.OK).json({ message: 'Connection accepted', data: connection });
    } catch (error) {
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR });
    }
  }

  
  async getLinkedUsers(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;

      const connections = await Connection.find({
        $or: [
          { fromUser: userId, status: 'accepted' },
          { toUser: userId, status: 'accepted' },
        ],
      })
        .populate('fromUser', 'name email picture')
        .populate('toUser', 'name email picture');

      // Return the "other" user in each connection
      const linkedUsers = connections.map((conn: any) => {
        const isFrom = conn.fromUser._id.toString() === userId;
        const otherUser = isFrom ? conn.toUser : conn.fromUser;
        return {
          connectionId: conn._id,
          user: otherUser,
        };
      });

      return res.status(STATUS_CODES.OK).json({ data: linkedUsers });
    } catch (error) {
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR });
    }
  }

  async disconnect(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params; 

      const connection = await Connection.findOne({
        _id: id,
        $or: [{ fromUser: userId }, { toUser: userId }],
      });

      if (!connection) {
        return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'Connection not found' });
      }

      await Connection.deleteOne({ _id: id });
      return res.status(STATUS_CODES.OK).json({ message: 'Disconnected successfully' });
    } catch (error) {
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR });
    }
  }

  
  async getLinkedUserItems(req: Request, res: Response) {
    try {
      const myId = req.user!.userId;
      const { userId } = req.params;

      const connection = await Connection.findOne({
        $or: [
          { fromUser: myId, toUser: userId, status: 'accepted' },
          { fromUser: userId, toUser: myId, status: 'accepted' },
        ],
      });

      if (!connection) {
        return res.status(STATUS_CODES.FORBIDDEN).json({ message: 'No active connection with this user' });
      }

      
      const Item = (await import('../models/Item')).default;
      const items = await Item.find({ user: userId, person: { $exists: false } }).sort({ createdAt: -1 });

      return res.status(STATUS_CODES.OK).json({ data: items });
    } catch (error) {
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR });
    }
  }
}

export default new ConnectionController();
