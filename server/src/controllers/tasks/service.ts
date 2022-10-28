import { defaultTask } from '~/constants';
import MongoDBAdapter from '~/db/MongoDBAdapter';
import { Task } from '/types';

export const getTasks = async (userId: string): Promise<Task[]> => {
  const mongoTasks = await MongoDBAdapter.getUserTasks(userId);
  return mongoTasks.map((mongoTask) => {
    const { _id, ...rest } = mongoTask;

    return {
      id: _id.toString(),
      ...rest,
    };
  });
};

export const createUserTask = async (
  userId: string,
  task: Partial<Task>
): Promise<void> => {
  const inputTask = {
    ...defaultTask,
    ...task,
    userId,
  };
  await MongoDBAdapter.createUserTask(inputTask);
  await MongoDBAdapter.adjustTasksIndexes(userId, {
    status: inputTask.status,
    swimlane: inputTask.swimlane,
  });
};

export const updateUserTasks = async (
  userId: string,
  tasks: Partial<Task>[]
) => {
  const mongoTasks = tasks.map((task) => ({
    ...task,
    userId,
  }));

  return await MongoDBAdapter.updateUserTasks(mongoTasks);
};

export const deleteUserTask = async (taskId: string) => {
  const { userId, status, swimlane } = await MongoDBAdapter.deleteUserTask(
    taskId
  );
  await MongoDBAdapter.adjustTasksIndexes(userId, { status, swimlane });
};
