export const columns = {
  todo: {
    friendlyName: 'Do',
  },
  inProgress: {
    friendlyName: 'Do ASAP',
  },
  done: {
    friendlyName: 'Done',
  },
} as const;

export const columnKeys = ['todo', 'inProgress', 'done'] as const;
