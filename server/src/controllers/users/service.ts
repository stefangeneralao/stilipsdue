import { axiosRequestWithRetries, getManagementApiToken } from '~/utils';
import dotenv from 'dotenv';
dotenv.config();

const issuer = process.env.ISSUER_BASE_URL;

export const getUser = async (userId: string): Promise<any> => {
  const configCallback = () => ({
    method: 'GET',
    url: `${issuer}/api/v2/users/${userId}`,
    headers: {
      authorization: getManagementApiToken().token,
      'content-type': 'application/json',
    },
  });

  return (await axiosRequestWithRetries(configCallback)).data;
};

export const getUserMetadata = async (userId: string): Promise<any> => {
  const user = await getUser(userId);
  return user.user_metadata;
};

export const setUserMetadata = async (
  userId: string,
  metadata: any
): Promise<any> => {
  const configCallback = () => ({
    method: 'PATCH',
    url: `${issuer}/api/v2/users/${userId}`,
    headers: {
      authorization: getManagementApiToken().token,
      'content-type': 'application/json',
    },
    data: {
      user_metadata: metadata,
      app_metadata: { plan: 'full' },
    },
  });

  return (await axiosRequestWithRetries(configCallback)).data;
};
