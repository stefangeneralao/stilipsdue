import axios, { AxiosRequestConfig } from 'axios';
import dotenv from 'dotenv';
import { MongoTask } from '~/types';
import { Task, TaskWithUserId } from '/types';
dotenv.config();

const issuer = process.env.AUTH0_ISSUER_BASE_URL;
const managementApiToken = { token: '' };
const clientId = process.env.AUTH0_CLIENT_ID;
const clientSecret = process.env.AUTH0_CLIENT_SECRET;
const managementAudience = process.env.AUTH0_MANAGEMENT_AUDIENCE;

export const getManagementApiToken = () => ({ ...managementApiToken });

export const refreshManagementApiToken = async () => {
  const options = {
    method: 'POST',
    url: `${issuer}/oauth/token`,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      audience: managementAudience,
    }),
  };

  const response = await axios.request(options);

  managementApiToken.token = `Bearer ${response.data.access_token}`;
};

export const asyncCallWithRetries = async (
  callback: () => Promise<any>,
  retries = 3
): Promise<any> => {
  try {
    return await callback();
  } catch (error) {
    if (retries == 0) {
      throw error;
    }

    const { code } = error;

    if (code === 'ERR_BAD_REQUEST') {
      await refreshManagementApiToken();
    }

    console.log(`Remaining retries: ${retries}`);
    return await asyncCallWithRetries(callback, retries - 1);
  }
};

export const axiosRequestWithRetries = async (
  config: () => AxiosRequestConfig
) => {
  return await asyncCallWithRetries(() => axios.request(config()));
};

export const setAuth0UserMetadata = async (
  userId: string,
  userMetadata: any
) => {
  const configCallback = () => ({
    method: 'PATCH',
    url: `${issuer}/api/v2/users/${userId}`,
    headers: {
      authorization: getManagementApiToken().token,
      'content-type': 'application/json',
    },
    data: {
      user_metadata: userMetadata,
    },
  });

  await axiosRequestWithRetries(configCallback);
};

export const tasksGroupedByUser = <T extends TaskWithUserId | MongoTask>(
  tasks: T[]
) =>
  tasks.reduce(
    (acc, task) => ({
      ...acc,
      [task.userId]: [...(acc[task.userId] || []), task],
    }),
    {} as Record<string, T[]>
  );

export const mongoTaskToTaskWithUserId = ({
  _id,
  ...rest
}: MongoTask): TaskWithUserId => ({
  id: _id.toString(),
  ...rest,
});

export const compareTasks =
  <T extends MongoTask | TaskWithUserId>(compareKey: keyof T) =>
  (a: T, b: T) => {
    if (a[compareKey] < b[compareKey]) return -1;
    if (a[compareKey] > b[compareKey]) return 1;
    return 0;
  };
