import { Filter, MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import { MongoTask } from '~/types';
import { StatusId, SwimlaneId, TaskWithUserId } from '/types';
dotenv.config();

const {
  MONGO_USER: mongoUser,
  MONGO_PASSWORD: mongoPassword,
  MONGO_CLUSTER: mongoCluster,
  MONGO_DATABASE_NAME: mongoDatabaseName,
  MONGO_COLLECTION_NAME: mongoCollectionName,
} = process.env;

if (
  !mongoUser ||
  !mongoPassword ||
  !mongoCluster ||
  !mongoDatabaseName ||
  !mongoCollectionName
) {
  throw new Error(
    '.env must contain MONGO_USER, MONGO_PASSWORD, MONGO_CLUSTER, MONGO_DATABASE_NAME and MONGO_COLLECTION_NAME.'
  );
}

const uri = `mongodb+srv://${mongoUser}:${mongoPassword}@${mongoCluster}/?retryWrites=true&w=majority`;

class MongoDBAdapter {
  private static readonly client = new MongoClient(uri);
  private static readonly database =
    MongoDBAdapter.client.db(mongoDatabaseName);
  private static readonly tasksCollection =
    MongoDBAdapter.database.collection<MongoTask>(mongoCollectionName);

  static connect = () => MongoDBAdapter.client.connect();

  static getUserTasks = async (userId: string) => {
    const mongoTasks = await MongoDBAdapter.tasksCollection
      .find({ userId: { $eq: userId } })
      .toArray();

    return mongoTasks.map((mongoTask) => {
      const { _id, ...rest } = mongoTask;

      return {
        id: _id,
        ...rest,
      };
    });
  };

  static updateUserTasks = async (tasks: TaskWithUserId[]) => {
    const mongoDBBulk =
      MongoDBAdapter.tasksCollection.initializeUnorderedBulkOp();
    tasks.forEach((task) => {
      const { id, ...rest } = task;

      const newDocument = {
        _id: new ObjectId(id),
        ...rest,
      };

      mongoDBBulk
        .find({ _id: new ObjectId(task.id) })
        .updateOne({ $set: { ...newDocument } });
    });
    await mongoDBBulk.execute();
  };

  static createUserTasks = async (tasks: TaskWithUserId[]) => {
    const mongoTasks = tasks.map((task) => {
      const { id, ...rest } = task;
      return rest;
    });

    const { insertedIds } = await MongoDBAdapter.tasksCollection.insertMany(
      mongoTasks.map((task) => Object.assign({}, task))
    );

    return mongoTasks.map((task, index) => ({
      ...task,
      id: insertedIds[index].toString(),
    }));
  };

  static createUserTask = async (task: any) =>
    await MongoDBAdapter.tasksCollection.insertOne(task);

  static deleteUserTasks = async (filter: Filter<MongoTask>) => {
    await MongoDBAdapter.tasksCollection.deleteMany(filter);
  };

  static updateAllTasksStatus = async (
    swimlane: SwimlaneId,
    toStatus: StatusId
  ) => {
    const tasks = await MongoDBAdapter.findUserTasks({
      swimlane: { $eq: swimlane },
    });

    const tasksGroupedByUser = tasks.reduce((acc, task) => {
      if (!acc[task.userId]) {
        acc[task.userId] = [];
      }
      acc[task.userId].push(task);
      return acc;
    }, {} as { [userId: string]: MongoTask[] });

    const updatedDailyTasks = Object.values(tasksGroupedByUser).flatMap(
      (tasks) =>
        tasks.map(({ _id, ...rest }, index) => ({
          ...rest,
          index,
          status: toStatus,
          id: _id.toString(),
        }))
    );

    await MongoDBAdapter.updateUserTasks(updatedDailyTasks);
  };

  static findUserTasks = async (filter: Filter<MongoTask>) =>
    await MongoDBAdapter.tasksCollection.find(filter).toArray();
}

MongoDBAdapter.connect();

export default MongoDBAdapter;
