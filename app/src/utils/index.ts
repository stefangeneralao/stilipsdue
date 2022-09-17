import { columnKeys, defaultTodos } from '~/constants';
import { ITodo, ITodos } from '~/types';

export const groupTodosBySwimlane = (todos: ITodo[]): ITodos =>
  todos.reduce<ITodos>((previousValue, currentValue) => {
    const { swimlane } = currentValue;
    return {
      ...previousValue,
      [swimlane]: [...previousValue[swimlane], currentValue],
    };
  }, defaultTodos);

export const groupTodosByStatus = (todos: ITodo[]) =>
  todos.reduce(
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

export const todosToArray = (todos: ITodos): ITodo[] =>
  Object.values(todos).flat();
