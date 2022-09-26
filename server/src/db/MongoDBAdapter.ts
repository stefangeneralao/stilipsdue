import { MongoClient, ObjectID, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import { MongoTask } from '~/types';
import { Task } from '/types';
dotenv.config();

const {
  MONGODB_USER: mongoDBUser,
  MONGODB_PASSWORD: mongoDBPassword,
  MONGODB_CLUSTER: mongoDBCluster,
} = process.env;

const uri = `mongodb+srv://${mongoDBUser}:${mongoDBPassword}@${mongoDBCluster}/?retryWrites=true&w=majority`;

class MongoDBAdapter {
  private static readonly client = new MongoClient(uri);
  private static readonly database = MongoDBAdapter.client.db('stilipsdueDB');
  private static readonly tasksCollection =
    MongoDBAdapter.database.collection<MongoTask>('tasks');

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

  static updateUserTasks = async (tasks: (Task & { userId: string })[]) => {
    const mongoDBBulk =
      MongoDBAdapter.tasksCollection.initializeUnorderedBulkOp();
    tasks.forEach((task) => {
      const { id, ...rest } = task;

      const newDocument = {
        _id: new ObjectId(id),
        ...rest,
      };

      mongoDBBulk.find({ _id: new ObjectId(task.id) }).replaceOne(newDocument);
    });
    await mongoDBBulk.execute();
  };

  static createUserTasks = async (tasks: (Task & { userId: string })[]) => {
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
}

MongoDBAdapter.connect();

export default MongoDBAdapter;
