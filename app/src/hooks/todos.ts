import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { ITodos } from '~/types';

const defaultTodos = {
  dailies: [],
  weeklies: [],
  monthlies: [],
  singles: [],
};

export const useTodos = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [fetchingState, setFetchingState] = useState<
    'PENDING' | 'LOADING' | 'FAILED'
  >('LOADING');
  const [todos, setTodos] = useState<ITodos>(defaultTodos);

  const refetchTodos = async () => {
    if (!user) return;

    try {
      setFetchingState('LOADING');

      const token = await getAccessTokenSilently();

      const {
        data: { todos: fetchedTodos },
      } = await axios.get<{ todos: ITodos; todosOrder: string[] }>(
        'http://localhost:3001/todos',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTodos(fetchedTodos);
    } catch (e) {
      console.log('Failed to get todos');
      console.log(e);
      setFetchingState('FAILED');
      return [];
    } finally {
      setFetchingState('PENDING');
    }
  };

  useEffect(() => {
    refetchTodos();
  }, [isAuthenticated]);

  const isLoading = fetchingState === 'LOADING';
  const isFailed = fetchingState === 'FAILED';

  return { isLoading, isFailed, todos, refetchTodos };
};
