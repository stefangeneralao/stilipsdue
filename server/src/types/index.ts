import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { ITodo } from '/types';

export interface RequestWithAuth extends Request {
  auth?: {
    sub: string;
  };
}

export type IMongoTodo = Omit<ITodo, 'id'> & {
  userId: string;
  _id?: ObjectId;
};
