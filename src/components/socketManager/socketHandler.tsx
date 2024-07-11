import {io} from 'socket.io-client';
import {getDataFromStorage} from '../../utils/storage';
import {Keys, socketConnectionLink} from '../../constants';
export const socketManger = async () => {
  const user = await getDataFromStorage(Keys.userDetails);
  //connect to server
  const newSocket = io(socketConnectionLink, {
    reconnectionDelayMax: 10000,
    auth: {authorization: 'Bearer ' + user?.access_token},
  });
  return newSocket;
};
