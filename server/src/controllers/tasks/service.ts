import MongoDBAdapter from '~/db/MongoDBAdapter';
import { Task } from '/types';

export const getTasks = async (userId: string): Promise<any> => {
  return await MongoDBAdapter.getUserTasks(userId);
};

export const createUserTask = async (userId: string, task: any) =>
  await MongoDBAdapter.createUserTask({
    ...task,
    userId,
  });

export const updateUserTasks = async (userId: string, tasks: Task[]) => {
  const mongoTasks = tasks.map((task) => ({
    ...task,
    userId,
  }));

  return await MongoDBAdapter.updateUserTasks(mongoTasks);
};

export const deleteUserTask = async (taskId: string) => {
  const { userId, status, swimlane } = await MongoDBAdapter.findTaskById(
    taskId
  );
  await MongoDBAdapter.deleteUserTask(taskId);
  await MongoDBAdapter.adjustTasksIndexes(userId, { status, swimlane });
};
