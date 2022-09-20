import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
import { getUser } from '~/controllers/users/service';
import MongoDBAdapter from '~/db/MongoDBAdapter';
import { IMongoTodo } from '~/types';
import {
  axiosRequestWithRetries,
  getManagementApiToken,
  setAuth0UserMetadata,
} from '~/utils';
import { ITodo } from '/types';

dotenv.config();

const issuer = process.env.AUTH0_ISSUER_BASE_URL;

export const getTodos = async (userId: string): Promise<any> => {
  // const user = await getUser(userId);
  // return user.user_metadata.todos;

  return await MongoDBAdapter.getUserTodos(userId);
};

export const updateUserTodos = async (
  userId: string,
  todos: ITodo[]
): Promise<void> => {
  const mongoTodos = todos.map((todo) => {
    return {
      ...todo,
      userId,
    };
  });

  await MongoDBAdapter.updateUserTodos(mongoTodos);
  // setAuth0UserMetadata(userId, { todos });
};

export const createUserTodos = async (userId: string, todos: ITodo[]) => {
  const mongoTodos = todos.map((todo) => {
    return {
      ...todo,
      userId,
    };
  });

  await MongoDBAdapter.createUserTodos(mongoTodos);
};
