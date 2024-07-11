import NetInfo from '@react-native-community/netinfo';

const isNetworkAvailable = async (): Promise<boolean> => {
  const res = await NetInfo.fetch();
  if (!res.isConnected) {
    return false;
  }
  return res.isConnected;
};

export default isNetworkAvailable;
