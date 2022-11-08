import { Filter, MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import { MongoTask, PartialMongoTask } from '~/types';
import {
  Optional,
  PartialTaskWithUserId,
  StatusId,
  SwimlaneId,
  TaskWithUserId,
} from '/types';
import {
  compareTasks,
  mongoTaskToTaskWithUserId,
  tasksGroupedByUser,
} from '~/utils';
dotenv.config();

const {
  MONGO_USER: mongoUser,
  MONGO_PASSWORD: mongoPassword,
  MONGO_CLUSTER: mongoCluster,
  MONGO_DATABASE_NAME: mongoDatabaseName,
  MONGO_COLLECTION_NAME: mongoCollectionName,
  DB_CONNECTION: dbConnection,
} = process.env;

const uri = (() => {
  if (dbConnection === 'local') {
    return 'mongodb://127.0.0.1:27017';
  }

  if (
    mongoUser &&
    mongoPassword &&
    mongoCluster &&
    mongoDatabaseName &&
    mongoCollectionName
  ) {
    return `mongodb+srv://${mongoUser}:${mongoPassword}@${mongoCluster}/?retryWrites=true&w=majority`;
  }

  throw new Error(
    '.env must contain MONGO_USER, MONGO_PASSWORD, MONGO_CLUSTER, MONGO_DATABASE_NAME and MONGO_COLLECTION_NAME or DB_CONNECTION=local.'
  );
})();

class MongoDBAdapter {
  private static readonly client = new MongoClient(uri);
  private static readonly database = this.client.db(mongoDatabaseName);
  private static readonly tasksCollection =
    this.database.collection<Optional<MongoTask, '_id'>>(mongoCollectionName);

  static connect = () => this.client.connect();

  static getUserTasks = async (userId: string): Promise<MongoTask[]> =>
    await this.tasksCollection.find({ userId: { $eq: userId } }).toArray();

  static updateUserTasks = async (
    tasks: PartialTaskWithUserId[]
  ): Promise<PartialMongoTask[]> => {
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
    const { id: _, ...mongoTask } = task;
    await this.tasksCollection.insertOne(mongoTask);
  };

  static deleteUserTasks = async (filter: Filter<MongoTask>): Promise<void> => {
    await this.tasksCollection.deleteMany(filter);
  };

  static updateManyStatuses = async (
    swimlane: SwimlaneId,
    toStatus: StatusId
  ) => {
    await this.tasksCollection.updateMany(
      { swimlane },
      { $set: { status: toStatus } }
    );
    await this.adjustTasksIndexes({ swimlane, status: toStatus });
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

  static adjustTasksIndexes = async (filter: {
    userId?: string;
    swimlane?: SwimlaneId;
    status?: StatusId;
  }) => {
    const tasks = await this.findUserTasks({
      ...filter,
    });
    if (tasks.length === 0) {
      return;
    }

    const groupedByUser = Object.values(tasksGroupedByUser(tasks));
    const sortedTasks = groupedByUser
      .map((userTasks) =>
        userTasks.sort(compareTasks('index')).map((task, index) => ({
          ...mongoTaskToTaskWithUserId(task),
          index,
        }))
      )
      .flat();

    await this.updateUserTasks(sortedTasks);
  };
}

console.log('Connecting to MongoDB...');
MongoDBAdapter.connect()
  .then(() => {
    console.log('Connected to MongoDB.');
  })
  .catch((error) => {
    console.error(error);
  });

export default MongoDBAdapter;
