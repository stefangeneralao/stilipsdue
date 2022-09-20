import { columnKeys, defaultTodos } from '~/constants';
import { ITodo, ITodos } from '/types';

export const groupTodosBySwimlane = (todos: ITodo[]): ITodos =>
  todos.reduce<ITodos>((previousValue, currentValue) => {
    const { swimlane } = currentValue;
    return {
      ...previousValue,
      [swimlane]: [...previousValue[swimlane], currentValue],
    };
  }, defaultTodos);

export const groupTodosByStatus = (todos: ITodo[]) => {
  const groupedTodos = todos.reduce(
    (previousValue, currentValue) => {
      const { status } = currentValue;

      let nextValue = { ...previousValue };

      if (!previousValue[status]) {
        nextValue = { ...nextValue, [status]: [] };
      }

      nextValue[status] = [...nextValue[status], currentValue];

      return nextValue;
    },
    { todo: [], inProgress: [], done: [] } as Record<
      typeof columnKeys[number],
      ITodo[]
    >
  );

  const sortedByIndex = Object.fromEntries(
    Object.entries(groupedTodos).map(([key, value]) => [
      key,
      sortTodosArrayByIndex(value),
    ])
  );

  return sortedByIndex;
};

export const todosToArray = (todos: ITodos): ITodo[] =>
  Object.values(todos).flat();

export const sortTodosArrayByIndex = (todos: ITodo[]): ITodo[] => {
  const newTodos = [...todos];
  newTodos.sort((a, b) => {
    const indexA = a.index;
    const indexB = b.index;

    if (indexA < indexB) return -1;
    if (indexB > indexB) return 1;
    return 0;
  });
  return newTodos;
};

export const sortTodosByIndexCallback = (a: ITodo, b: ITodo) => {
  const indexA = a.index;
  const indexB = b.index;

  if (indexA < indexB) return -1;
  if (indexB > indexB) return 1;
  return 0;
};
