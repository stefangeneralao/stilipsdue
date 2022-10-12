import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { Task, TaskWithUserId } from '/types';

export interface Auth {
  auth?: {
    sub?: string;
  };
}

export type RequestWithAuth = Request & Auth;

export type RequestWithUserTasks = Request<unknown, unknown, Task[]> & Auth;

export type MongoTask = Omit<TaskWithUserId, 'id'> & {
  _id?: ObjectId;
};
