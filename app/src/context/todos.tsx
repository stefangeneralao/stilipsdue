import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { ITodo, ITodos, TSwimlane, TTodoStatus } from '/types';
import { defaultTodos } from '~/constants';
import {
  todosToArray,
  groupTodosBySwimlane,
  groupTodosByStatus,
  sortTodosByIndexCallback,
} from '~/utils';
import { DropResult } from 'react-beautiful-dnd';

const apiUrl = 'http://localhost:3001';

const defaultContext = {
  isLoading: false,
  isFailed: false,
  isAuthenticated: false,
  todos: { ...defaultTodos },
  refetchTodos: () => {},
  reorderTodos: (_: DropResult) => {},
  addTodo: (label: string, swimlaneId: TSwimlane, status: TTodoStatus) => {},
};

const TodosContext = createContext(defaultContext);

interface Props {
  children: React.ReactNode;
}

export const TodosProvider = ({ children }: Props) => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [fetchingState, setFetchingState] = useState<
    'PENDING' | 'LOADING' | 'FAILED'
  >('LOADING');
  const [todos, setTodos] = useState<ITodos>(defaultTodos);

  const refetchTodos = async (): Promise<void> => {
    if (!user) return;

    try {
      setFetchingState('LOADING');

      const token = await getAccessTokenSilently();

      const {
        data: { todos: fetchedTodos },
      } = await axios.get<{ todos: ITodo[] }>(`${apiUrl}/todos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const transformedTodos = groupTodosBySwimlane(fetchedTodos);

      setTodos(transformedTodos);
    } catch (e) {
      console.log('Failed to get todos');
      console.log(e);
      setFetchingState('FAILED');
    } finally {
      setFetchingState('PENDING');
    }
  };

  const postTodos = async (todos: ITodos) => {
    const todosArray = todosToArray(todos);

    try {
      const token = await getAccessTokenSilently();

      await axios.patch(`${apiUrl}/todos`, todosArray, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const reorderTodos = async (result: DropResult): Promise<void> => {
    const { draggableId, destination, source } = result;
    if (!destination) return;

    const draggedTodo = findTodoById(draggableId);
    if (!draggedTodo) return;

    const { index: destinationIndex, droppableId: destinationDroppableId } =
      destination;
    const { index: sourceIndex, droppableId: sourceDroppableId } = source;

    const destinationSwimlaneId = destinationDroppableId
      .split('-')[0]
      .split(':')[1] as TSwimlane;
    const destinationStatus = destinationDroppableId
      .split('-')[1]
      .split(':')[1] as TTodoStatus;
    const sourceSwimlaneId = sourceDroppableId
      .split('-')[0]
      .split(':')[1] as TSwimlane;
    const sourceStatus = sourceDroppableId
      .split('-')[1]
      .split(':')[1] as TTodoStatus;

    if (destinationDroppableId === sourceDroppableId) {
      const destinationList = todos[destinationSwimlaneId]
        .filter(
          (todo) => todo.status === destinationStatus && todo.id !== draggableId
        )
        .sort(sortTodosByIndexCallback);
      destinationList.splice(destinationIndex, 0, draggedTodo);

      const destinationListAdjustedIndex = destinationList.map(
        (todo, index) => ({
          ...todo,
          index,
        })
      );

      const newSwimlane = [
        ...todos[destinationSwimlaneId].filter(
          (todo) => todo.status !== destinationStatus
        ),
        ...destinationListAdjustedIndex,
      ];

      const newTodos = {
        ...todos,
        [destinationSwimlaneId]: newSwimlane,
      };

      postTodos(newTodos);
      setTodos(newTodos);

      return;
    }

    const destinationList = todos[destinationSwimlaneId].filter(
      (todo) => todo.status === destinationStatus
    );
    const sourceList = todos[sourceSwimlaneId].filter(
      (todo) => todo.status === sourceStatus
    );

    const updatedTodo = {
      ...draggedTodo,
      status: destinationStatus,
      swimlane: destinationSwimlaneId,
    };
    destinationList.splice(destinationIndex, 0, updatedTodo);
    sourceList.splice(sourceIndex, 1);

    const destinationListAdjustedIndex = destinationList.map((todo, index) => ({
      ...todo,
      index,
    }));
    const sourceListAdjustedIndex = sourceList.map((todo, index) => ({
      ...todo,
      index,
    }));

    if (destinationSwimlaneId === sourceSwimlaneId) {
      const destinationSwimlane = [
        ...todos[destinationSwimlaneId].filter(
          (todo) =>
            todo.status !== destinationStatus && todo.status !== sourceStatus
        ),
        ...destinationListAdjustedIndex,
        ...sourceListAdjustedIndex,
      ];
      const newTodos = {
        ...todos,
        [destinationSwimlaneId]: destinationSwimlane,
      };

      postTodos(newTodos);
      setTodos(newTodos);
    } else {
      const destinationSwimlane = [
        ...todos[destinationSwimlaneId].filter(
          (todo) => todo.status !== destinationStatus
        ),
        ...destinationListAdjustedIndex,
      ];
      const sourceSwimlane = [
        ...todos[sourceSwimlaneId].filter(
          (todo) => todo.status !== sourceStatus
        ),
        ...sourceListAdjustedIndex,
      ];

      const newTodos = {
        ...todos,
        [destinationSwimlaneId]: destinationSwimlane,
        [sourceSwimlaneId]: sourceSwimlane,
      };

      postTodos(newTodos);
      setTodos(newTodos);
    }
  };

  const findTodoById = (id: string): ITodo | undefined =>
    todosToArray(todos).find((todo) => todo.id === id);

  const postTodo = async (todo: ITodo) => {
    try {
      const token = await getAccessTokenSilently();

      return (
        await axios.post<ITodo[]>(`${apiUrl}/todos`, [todo], {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      ).data;
    } catch (error) {
      console.log(error);
    }
  };

  const addTodo = async (
    label: string,
    swimlane: TSwimlane,
    status: TTodoStatus
  ) => {
    const temporaryId = uuid();
    const targetSwimlane = groupTodosByStatus(todos[swimlane]);
    const targetList = targetSwimlane[status];
    const index = targetList.length;

    const temporaryTodo: ITodo = {
      id: temporaryId,
      index,
      label,
      status,
      swimlane,
    };

    const temporaryNewSwimlane = [
      ...Object.values(targetSwimlane).flat(),
      temporaryTodo,
    ];

    const temporaryNewTodos = {
      ...todos,
      [swimlane]: temporaryNewSwimlane,
    };

    setTodos(temporaryNewTodos);
    try {
      const insertedTodos = (await postTodo(temporaryTodo)) || [];
      console.log(insertedTodos);

      const newTodos = {
        ...todos,
        [swimlane]: [...todos[swimlane], ...insertedTodos],
      };
      setTodos(newTodos);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    refetchTodos();
  }, [isAuthenticated]);

  const isLoading = fetchingState === 'LOADING';
  const isFailed = fetchingState === 'FAILED';

  const value = {
    isLoading,
    isFailed,
    isAuthenticated,
    todos,
    refetchTodos,
    reorderTodos,
    addTodo,
  };

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};

export const useTodos = () => {
  const value = useContext(TodosContext);

  return value;
};
