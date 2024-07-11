import {Keys} from '../constants';
import {Codes} from '../constants/codes';
import {Helper} from '../utils';
import {callApi} from './NetworkManager';
import {refreshTokenHandler} from './RefreshToken';

export async function handleResponse(res: any) {
  const {response, params} = res;
  const {endPoint, method, data, isBearer, multipart, id} = params;
  if (
    response?.status === Codes.SUCCESS ||
    response?.status === Codes.SUCCESS_WITH_CREATION
  ) {
    return response;
  } else if (response?.status === Codes.BAD_REQUEST) {
    Helper.showToast(Keys.badRequest);
    return null;
  } else if (response?.status === Codes.UNAUTHORIZED) {
    const result = await refreshTokenHandler();
    if (result) {
      const responseApi = await callApi(
        endPoint,
        method,
        data,
        isBearer,
        multipart,
        id,
      );
      const resultApi = await handleResponse(responseApi);
      return resultApi;
    }
    return null;
  } else if (response?.status === Codes.SERVER_ERROR) {
    return null;
  }

  return null;
}
