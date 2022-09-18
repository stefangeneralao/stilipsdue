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

  static updateUserTodos = async (
    userId: string,
    todos: (ITodo & { userId: string })[]
  ) => {
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

  static addListItem = async (listId: string, title: string) => {
    if (!(await MongoDBAdapter.listExists(listId))) {
      throw new Error('List does not exist');
    }

    const listItems = MongoDBAdapter.database.collection('list-items');
    const listItem = await listItems.insertOne({
      listId,
      title,
    });

    const lists = MongoDBAdapter.database.collection('lists');
    await lists.updateOne(
      { _id: new ObjectId(listId) },
      { $push: { listItemIds: listItem.insertedId.toString() } }
    );

    return listItem.insertedId.toString();
  };

  static updateListItem = async (
    listItemId: string,
    config: { title?: string; description?: string }
  ) => {
    const listItems = MongoDBAdapter.database.collection('list-items');
    await listItems.updateOne(
      { _id: new ObjectId(listItemId) },
      { $set: config }
    );
  };

  static listExists = async (listId: string) => {
    const lists = MongoDBAdapter.database.collection('lists');

    return (
      (await lists.find({ _id: new ObjectId(listId) }).toArray()).length > 0
    );
  };

  static deleteListItem = async (listItemId: string) => {
    const listItems = MongoDBAdapter.database.collection('list-items');
    await listItems.deleteOne({ _id: new ObjectId(listItemId) });
  };

  static reorderList = async (order: string[]) => {
    const listOrderDocument = MongoDBAdapter.database.collection('list-order');
    await listOrderDocument.updateOne({}, { $set: { order } });
  };

  static moveListItem = async (
    listItemId: string,
    sourceListId: string,
    destinationListId: string,
    destinationListItemIds: string[]
  ) => {
    const lists = MongoDBAdapter.database.collection('lists');
    await Promise.all([
      lists.updateOne(
        { _id: new ObjectId(sourceListId) },
        { $pull: { listItemIds: listItemId } }
      ),
      lists.updateOne(
        { _id: new ObjectId(destinationListId) },
        { $set: { listItemIds: destinationListItemIds } }
      ),
    ]);
  };

  static updateList = async (
    listId: string,
    config: { title?: string; listItemIds?: string[] }
  ) => {
    const lists = MongoDBAdapter.database.collection('lists');
    await lists.updateOne(
      { _id: new ObjectId(listId) },
      { $set: JSON.parse(JSON.stringify(config)) }
    );
  };

  static addList = async (title: string) => {
    const lists = MongoDBAdapter.database.collection('lists');
    const listOrder = MongoDBAdapter.database.collection('list-order');

    const list = await lists.insertOne({
      title,
      listItemIds: [],
    });

    await listOrder.updateOne(
      {},
      { $push: { order: list.insertedId.toString() } }
    );

    return list.insertedId.toString();
  };

  static deleteList = async (listId: string) => {
    const lists = MongoDBAdapter.database.collection('lists');
    const listItems = MongoDBAdapter.database.collection('list-items');
    const listOrder = MongoDBAdapter.database.collection('list-order');

    const listItemIds = (
      await lists.findOne({ _id: new ObjectId(listId) })
    ).listItemIds.map((id: string) => new ObjectId(id));

    await Promise.all([
      listItems.deleteMany({ _id: { $in: listItemIds } }),
      lists.deleteOne({ _id: new ObjectId(listId) }),
      listOrder.updateOne({}, { $pull: { order: listId } }),
    ]);
  };
}

MongoDBAdapter.connect();

export default MongoDBAdapter;
