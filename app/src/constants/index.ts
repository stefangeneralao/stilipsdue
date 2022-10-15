export const columns = {
  todo: {
    friendlyName: 'Do',
  },
  doASAP: {
    friendlyName: 'Do ASAP',
  },
  done: {
    friendlyName: 'Done',
  },
} as const;

export const columnKeys = ['todo', 'doASAP', 'done'] as const;

export const friendlyNameMap = {
  todo: 'Todo',
  doASAP: 'Do ASAP',
  done: 'Done',
  dailies: 'Dailies',
  weeklies: 'Weeklies',
  monthlies: 'Monthlies',
  singles: 'Singles',
};
