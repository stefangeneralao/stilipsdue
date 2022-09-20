import { MongoClient, ObjectID, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import { IMongoTodo } from '~/types';
import { ITodo } from '/types';
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
  private static readonly todosCollection =
    MongoDBAdapter.database.collection<IMongoTodo>('todos');

  static connect = () => MongoDBAdapter.client.connect();

  static getUserTodos = async (userId: string) => {
    const mongoTodos = await MongoDBAdapter.todosCollection
      .find({ userId: { $eq: userId } })
      .toArray();

    return mongoTodos.map((mongoTodo) => {
      const { _id, ...rest } = mongoTodo;

      return {
        id: _id,
        ...rest,
      };
    });
  };

  static updateUserTodos = async (todos: (ITodo & { userId: string })[]) => {
    const mongoDBBulk =
      MongoDBAdapter.todosCollection.initializeUnorderedBulkOp();
    todos.forEach((todo) => {
      const { id, ...rest } = todo;

      const newDocument = {
        _id: new ObjectId(id),
        ...rest,
      };

      mongoDBBulk.find({ _id: new ObjectId(todo.id) }).replaceOne(newDocument);
    });
    await mongoDBBulk.execute();
  };

  static createUserTodos = async (todos: (ITodo & { userId: string })[]) => {
    const mongoTodos = todos.map((todo) => {
      const { id, ...rest } = todo;
      return rest;
    });

    const { insertedIds } = await MongoDBAdapter.todosCollection.insertMany(
      mongoTodos.map((todo) => Object.assign({}, todo))
    );

    return mongoTodos.map((todo, index) => ({
      ...todo,
      id: insertedIds[index].toString(),
    }));
  };
}

MongoDBAdapter.connect();

export default MongoDBAdapter;
