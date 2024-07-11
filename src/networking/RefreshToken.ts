import {Keys} from '../constants';
import {Codes} from '../constants/codes';
import {getDataFromStorage, storeDataToStorage} from '../utils/storage';
import {api, baseURL} from './Environment';
const defaultHeaders: any = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};
export const refreshTokenHandler = async () => {
  const userDetails = await getDataFromStorage(Keys.userDetails);
  const refreshUrl = baseURL + api.refreshToken;
  defaultHeaders.Authorization = 'Bearer ' + userDetails?.refresh_token;
  const response = await fetch(refreshUrl, {
    method: 'POST',
    headers: defaultHeaders,
    body: null,
  });
  const status = response?.status;
  const jsonResponse = await response.json();
  jsonResponse.status = status;
  if (jsonResponse?.status === Codes.SUCCESS) {
    await storeDataToStorage(Keys.userDetails, jsonResponse?.data);
    return true;
  }
  return null;
};
