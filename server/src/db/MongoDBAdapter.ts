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
  private static readonly database = this.client.db(mongoDatabaseName);
  private static readonly tasksCollection =
    this.database.collection<MongoTask>(mongoCollectionName);

  static connect = () => this.client.connect();

  static getUserTasks = async (userId: string): Promise<MongoTask[]> =>
    await this.tasksCollection.find({ userId: { $eq: userId } }).toArray();

  static updateUserTasks = async (
    tasks: TaskWithUserId[]
  ): Promise<MongoTask[]> => {
    const mongoDBBulk = this.tasksCollection.initializeUnorderedBulkOp();
    const updatedTasks = tasks.map((task) => {
      const { id, ...rest } = task;

      const newDocument = {
        _id: new ObjectId(id),
        ...rest,
      };

      mongoDBBulk
        .find({ _id: new ObjectId(task.id) })
        .updateOne({ $set: { ...newDocument } });

      return newDocument;
    });
    await mongoDBBulk.execute();
    return updatedTasks;
  };

  static createUserTask = async (task: TaskWithUserId): Promise<void> => {
    const { id, ...mongoTask } = task;
    await this.tasksCollection.insertOne(mongoTask);
  };

  static deleteUserTasks = async (filter: Filter<MongoTask>): Promise<void> => {
    await this.tasksCollection.deleteMany(filter);
  };

  static updateAllTasksStatus = async (
    swimlane: SwimlaneId,
    toStatus: StatusId
  ) => {
    await this.tasksCollection.updateMany(
      { swimlane },
      { $set: { status: toStatus } }
    );
  };

  static findUserTasks = async (
    filter: Filter<MongoTask>
  ): Promise<MongoTask[]> => await this.tasksCollection.find(filter).toArray();

  static findTaskById = async (taskId: string): Promise<MongoTask | null> =>
    await this.tasksCollection.findOne({ _id: new ObjectId(taskId) });

  static deleteUserTask = async (taskId: string): Promise<MongoTask> => {
    const _id = new ObjectId(taskId);
    const deleteResult = await this.tasksCollection.findOneAndDelete({
      _id,
    });

    if (!deleteResult.value) {
      throw new Error(`Task with id ${taskId} not found.`);
    }
    return deleteResult.value;
  };

  static adjustTasksIndexes = async (
    userId: string,
    filter: { swimlane: SwimlaneId; status: StatusId }
  ) => {
    const tasks = await this.findUserTasks({
      ...filter,
      userId: { $eq: userId },
    });
    if (tasks.length === 0) {
      return;
    }

    const sortedTasks = [...tasks].sort((a, b) => a.index - b.index);
    const updatedTasks = sortedTasks.map(({ _id, ...task }, index) => ({
      ...task,
      index,
      id: _id.toString(),
    }));
    await this.updateUserTasks(updatedTasks);
  };
}

MongoDBAdapter.connect();

export default MongoDBAdapter;
