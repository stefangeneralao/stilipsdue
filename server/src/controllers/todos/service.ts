import dotenv from 'dotenv';
import { getUser } from '~/controllers/users/service';
import { axiosRequestWithRetries, getManagementApiToken } from '~/utils';

dotenv.config();

const issuer = process.env.AUTH0_ISSUER_BASE_URL;

export const getTodos = async (userId: string): Promise<any> => {
  const user = await getUser(userId);
  return user.user_metadata.todos;
};

export const setTodos = async (userId: string, todos: []) => {
  const configCallback = () => ({
    method: 'PATCH',
    url: `${issuer}/api/v2/users/${userId}`,
    headers: {
      authorization: getManagementApiToken().token,
      'content-type': 'application/json',
    },
    data: {
      user_metadata: { todos },
    },
  });

  await axiosRequestWithRetries(configCallback);
};
