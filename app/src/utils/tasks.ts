import { TasksState } from '~/components/Tasks/redux/interfaces';
import { Task, StatusId, SwimlaneId } from '/types';
import { transposeMatrix } from '.';
import { store } from '~/store';

export const groupBySwimlane = (
  tasks: Task[]
): { [id in SwimlaneId]: { friendlyName: string; tasks: Task[] } } => {
  const initialValue = {
    dailies: {
      friendlyName: '',
      tasks: [],
    },
    weeklies: {
      friendlyName: '',
      tasks: [],
    },
    monthlies: {
      friendlyName: '',
      tasks: [],
    },
    singles: {
      friendlyName: '',
      tasks: [],
    },
  };

  return tasks.reduce((previousValue, currentValue) => {
    const { swimlane } = currentValue;

    return {
      ...previousValue,
      [swimlane]: {
        friendlyName: getFriendlyName(swimlane),
        tasks: [...previousValue[swimlane].tasks, currentValue],
      },
    };
  }, initialValue);
};

export const groupByStatus = (
  tasks: Task[]
): { [id in StatusId]: { friendlyName: string; tasks: Task[] } } => {
  const initialValue = {
    todo: {
      friendlyName: '',
      tasks: [],
    },
    inProgress: {
      friendlyName: '',
      tasks: [],
    },
    done: {
      friendlyName: '',
      tasks: [],
    },
  };

  const groupedByStatus = tasks.reduce((previousValue, currentValue) => {
    const { status } = currentValue;

    return {
      ...previousValue,
      [status]: {
        friendlyName: getFriendlyName(status),
        tasks: [...previousValue[status].tasks, currentValue],
      },
    };
  }, initialValue);

  const statusEntries = Object.entries(groupedByStatus).map(
    ([statusId, statusValue]) => {
      return [
        statusId,
        {
          ...statusValue,
          tasks: statusValue.tasks.sort(compareIndex),
        },
      ];
    }
  );

  const groupedAndSorted = Object.fromEntries(statusEntries);

  return groupedAndSorted;
};

export const groupBySwimlaneAndStatus = (tasks: Task[]): TasksState => {
  const swimlanes = groupBySwimlane(tasks);
  const swimlaneEntries = Object.entries(swimlanes);
  const swimlaneEntriesWithGroupedStatus = swimlaneEntries.map(
    ([swimlaneId, { tasks, ...rest }]) => {
      return [
        swimlaneId,
        {
          ...rest,
          statuses: groupByStatus(tasks),
        },
      ];
    }
  );

  return { swimlanes: Object.fromEntries(swimlaneEntriesWithGroupedStatus) };
};

export const compareIndex = (a: Task, b: Task) => {
  const indexA = a.index;
  const indexB = b.index;

  if (indexA < indexB) return -1;
  if (indexA > indexB) return 1;
  return 0;
};

export const compareTaskByKey = (key: keyof Task) => (a: Task, b: Task) => {
  if (a[key] < b[key]) return -1;
  if (a[key] > b[key]) return 1;
  return 0;
};

const friendlyNameMap = {
  todo: 'Todo',
  inProgress: 'In progress',
  done: 'Done',
  dailies: 'Dailies',
  weeklies: 'Weeklies',
  monthlies: 'Monthlies',
  singles: 'Singles',
};

export const getFriendlyName = (key: keyof typeof friendlyNameMap) =>
  friendlyNameMap[key];

export const diffTasks = (
  previousTasks: Task[],
  currentTasks: Task[]
): Task[] => {
  const sortedPreviousTasks = previousTasks.sort(compareTaskByKey('id'));
  const sortedCurrentTasks = currentTasks.sort(compareTaskByKey('id'));
  const comparisonPairs = transposeMatrix([
    sortedPreviousTasks,
    sortedCurrentTasks,
  ]);

  comparisonPairs.forEach((pair) => {
    if (pair[0].id !== pair[1].id) {
      throw new Error(
        'Incomplete pairs. Ids in previousTasks does not match ids in currentTasks.'
      );
    }
  });

  const diff = comparisonPairs.flatMap((comparisonPair) => {
    const [previousTask, currentTask] = comparisonPair;

    if (JSON.stringify(previousTask) !== JSON.stringify(currentTask)) {
      return currentTask;
    }
    return [];
  });

  return diff;
};

export const findTask = (state: TasksState, id: string): Task => {
  const searchResult = Object.values(state.swimlanes).flatMap((swimlane) =>
    Object.values(swimlane.statuses).flatMap((status) =>
      status.tasks.flatMap((task) => (task.id === id ? task : []))
    )
  );
  return searchResult[0];
};
