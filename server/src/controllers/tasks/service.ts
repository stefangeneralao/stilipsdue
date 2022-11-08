import { defaultTask } from '~/constants';
import MongoDBAdapter from '~/db/MongoDBAdapter';
import { mongoTaskToTaskWithUserId } from '~/utils';
import { PartialTask, PartialTaskWithUserId, Task } from '/types';

export const getTasks = async (userId: string): Promise<Task[]> => {
  const mongoTasks = await MongoDBAdapter.getUserTasks(userId);
  return mongoTasks.map(mongoTaskToTaskWithUserId);
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
  await MongoDBAdapter.adjustTasksIndexes({
    userId,
    status: inputTask.status,
    swimlane: inputTask.swimlane,
  });
};

export const updateUserTasks = async (
  userId: string,
  tasks: PartialTask[]
): Promise<PartialTaskWithUserId[]> => {
  const mongoTasks = tasks.map((task) => ({
    ...task,
    userId,
  }));

  const updatedUserTasks = await MongoDBAdapter.updateUserTasks(mongoTasks);
  return updatedUserTasks.map(mongoTaskToTaskWithUserId);
};

export const deleteUserTask = async (taskId: string) => {
  const { userId, status, swimlane } = await MongoDBAdapter.deleteUserTask(
    taskId
  );
  await MongoDBAdapter.adjustTasksIndexes({ userId, status, swimlane });
};
