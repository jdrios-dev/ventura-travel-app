import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeDataToStorage = async (key: string, value: any) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const removeDataFromStorage = async (key: string) => {
  await AsyncStorage.removeItem(key);
};

export const getDataFromStorage = async (value: any) => {
  const data = await AsyncStorage.getItem(value);
  const newData = JSON.parse(data);
  return newData;
};
