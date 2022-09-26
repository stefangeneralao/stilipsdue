import MongoDBAdapter from '~/db/MongoDBAdapter';

export const getTasks = async (userId: string): Promise<any> => {
  return await MongoDBAdapter.getUserTasks(userId);
};

export const createUserTask = async (userId: string, task: any) =>
  await MongoDBAdapter.createUserTask({
    ...task,
    userId,
  });

export const updateUserTasks = async (userId: string, tasks: any[]) => {
  const mongoTasks = tasks.map((task) => ({
    ...task,
    userId,
  }));

  return await MongoDBAdapter.updateUserTasks(mongoTasks);
};
