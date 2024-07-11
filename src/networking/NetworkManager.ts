import {Keys} from '../constants';
import {getDataFromStorage} from '../utils/storage';
import {baseURL} from './Environment';

export const AUTHORIZE = 'AUTHORIZE';
export const NETWORK_ERROR = 'NETWORK ERROR';
export const EXPIRED_STATE = 3000204;
export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}
const defaultHeaders: any = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export const callApi = async (
  endPoint,
  method,
  data,
  isBearer,
  multipart,
  id,
) => {
  let url = baseURL + endPoint;

  if (id) {
    url = baseURL + endPoint + id;
  }

  if (isBearer) {
    const userDetails = await getDataFromStorage(Keys.userDetails);

    defaultHeaders.Authorization = 'Bearer ' + userDetails?.access_token;
  } else {
    delete defaultHeaders.Authorization;
  }
  if (multipart) {
    defaultHeaders['Content-Type'] = 'multipart/form-data';
  } else {
    defaultHeaders['Content-Type'] = 'application/json';
  }
  try {
    const response = await fetch(url, {
      method: method,
      headers: defaultHeaders,
      body:
        method === Method.GET ? null : multipart ? data : JSON.stringify(data),
    });

    const status = response?.status;
    const responseJson = await response.json();

    responseJson.status = status;
    const dataToBeUsed = {
      response: responseJson,
      params: {
        endPoint,
        method,
        data,
        isBearer,
        multipart,
        id,
      },
    };
    return dataToBeUsed;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('API CALL ERROR:', endPoint, JSON.stringify(error));
    return null;
  }
};
