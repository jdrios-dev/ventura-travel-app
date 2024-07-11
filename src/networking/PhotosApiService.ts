import {Method, callApi} from './NetworkManager';
import {api} from './Environment';
import {handleResponse} from './ResponseHandler';
export const createPhoto = async (params: any) => {
  const data = params;
  const response = await callApi(
    api.createPhoto,
    Method.POST,
    data,
    true,
    true,
    null,
  );

  const result = await handleResponse(response);
  return result;
};
export const getMyPhotos = async () => {
  const data = null;
  const response = await callApi(
    api.getMyphotos,
    Method.GET,
    data,
    true,
    false,
    null,
  );
  const result = await handleResponse(response);
  return result;
};
export const getMyTripPhotos = async () => {
  const data = null;
  const response = await callApi(
    api.getMyTripPhotos,
    Method.GET,
    data,
    true,
    false,
    null,
  );
  const result = await handleResponse(response);
  return result;
};
export const sendPhotos = async (params: any) => {
  const response = await callApi(
    api.sendPhoto,
    Method.POST,
    params,
    true,
    false,
    null,
  );

  const result = await handleResponse(response);
  return result;
};
