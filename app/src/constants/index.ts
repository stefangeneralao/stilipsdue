import { ITodos } from '/types';

export const defaultTodos: ITodos = {
  dailies: [],
  weeklies: [],
  monthlies: [],
  singles: [],
};

export const columns = {
  todo: {
    friendlyName: 'Todo',
  },
  inProgress: {
    friendlyName: 'In progress',
  },
  done: {
    friendlyName: 'Done',
  },
} as const;

export const columnKeys = ['todo', 'inProgress', 'done'] as const;
