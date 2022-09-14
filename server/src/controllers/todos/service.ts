import { getUser, setUserMetadata } from '~/controllers/users/service';

export const resetUserTodos = (userId: string) =>
  setUserMetadata(userId, {
    todos: {
      dailies: [],
      weeklies: [],
      monthlies: [],
      singles: [],
    },
  });

export const getTodos = async (userId: string): Promise<any> => {
  const user = await getUser(userId);
  const userMetadata = user.user_metadata;

  return (await isTodosSchemeValid(userMetadata)) ? userMetadata.todos : null;
};

export const isTodosSchemeValid = async (metadata: any) => {
  if (!metadata?.todos) return false;
  if (!metadata?.todos?.dailies) return false;
  if (!metadata?.todos?.weeklies) return false;
  if (!metadata?.todos?.monthlies) return false;
  if (!metadata?.todos?.singles) return false;
  return true;
};
