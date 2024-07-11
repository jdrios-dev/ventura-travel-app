import {Method, callApi} from './NetworkManager';
import {api} from './Environment';
import {handleResponse} from './ResponseHandler';

export const signup = async ({
  email,
  invitationCode,
  password,
  isTermAccepted,
}) => {
  const data = {email, invitationCode, password, isTermAccepted};
  const response = await callApi(
    api.signup,
    Method.POST,
    data,
    false,
    false,
    null,
  );

  const result = await handleResponse(response);
  return result;
};
export const signin = async ({email, password}) => {
  const data = {email, password};
  const response = await callApi(
    api.login,
    Method.POST,
    data,
    false,
    false,
    null,
  );
  const result = await handleResponse(response);
  return result;
};
export const logout = async () => {
  const data = null;
  const response = await callApi(
    api.logout,
    Method.POST,
    data,
    true,
    false,
    null,
  );
  const result = await handleResponse(response);
  return result;
};
export const refreshToken = async () => {
  const data = null;
  const response = await callApi(
    api.refreshToken,
    Method.POST,
    data,
    true,
    false,
    null,
  );
  const result = await handleResponse(response);
  return result;
};
