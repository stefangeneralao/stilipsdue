import axios, { AxiosRequestConfig } from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const issuer = process.env.ISSUER_BASE_URL;
const managementApiToken = { token: '' };
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const managementAudience = process.env.MANAGEMENT_AUDIENCE;

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
