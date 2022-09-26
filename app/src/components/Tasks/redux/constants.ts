import { TasksState } from './interfaces';

export const initialState: TasksState = {
  swimlanes: {
    dailies: {
      friendlyName: 'Dailies',
      statuses: {
        todo: {
          friendlyName: 'Todo',
          tasks: [],
        },
        inProgress: {
          friendlyName: 'In progress',
          tasks: [],
        },
        done: {
          friendlyName: 'Done',
          tasks: [],
        },
      },
    },
    weeklies: {
      friendlyName: 'Dailies',
      statuses: {
        todo: {
          friendlyName: 'Todo',
          tasks: [],
        },
        inProgress: {
          friendlyName: 'In progress',
          tasks: [],
        },
        done: {
          friendlyName: 'Done',
          tasks: [],
        },
      },
    },
    monthlies: {
      friendlyName: 'Dailies',
      statuses: {
        todo: {
          friendlyName: 'Todo',
          tasks: [],
        },
        inProgress: {
          friendlyName: 'In progress',
          tasks: [],
        },
        done: {
          friendlyName: 'Done',
          tasks: [],
        },
      },
    },
    singles: {
      friendlyName: 'Dailies',
      statuses: {
        todo: {
          friendlyName: 'Todo',
          tasks: [],
        },
        inProgress: {
          friendlyName: 'In progress',
          tasks: [],
        },
        done: {
          friendlyName: 'Done',
          tasks: [],
        },
      },
    },
  },
};
