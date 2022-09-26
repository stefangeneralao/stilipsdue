import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { Task } from '/types';

export interface RequestWithAuth extends Request {
  auth?: {
    sub: string;
  };
}

export type MongoTask = Omit<Task, 'id'> & {
  userId: string;
  _id?: ObjectId;
};
