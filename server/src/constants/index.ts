import { ObjectId } from 'mongodb';
import { Task } from '/types';

export const defaultTask: Task = {
  id: new ObjectId().toString(),
  index: 0,
  label: '',
  status: null,
  swimlane: null,
  description: '',
};
