import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { Task, TaskWithUserId } from '/types';

export interface AuthType {
  auth?: {
    sub?: string;
  };
}

export type RequestWithAuth = Request & AuthType;

export type RequestWithUserTasks = Request<unknown, unknown, Task[]> & AuthType;

export type MongoTask = Omit<TaskWithUserId, 'id'> & {
  _id: ObjectId;
};

export type PartialMongoTask = Omit<Partial<TaskWithUserId>, 'id'> & {
  _id: ObjectId;
};
