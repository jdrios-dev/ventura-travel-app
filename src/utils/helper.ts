import SimpleToast from 'react-native-simple-toast';
export function showToast(message: string) {
  SimpleToast.show(message, 4);
}
export function formatMessage(message: string) {
  return message.replace(/(\r\n|\n|\r)/gm, ' ');
}
export function compressString(value: string, length: number) {
  return value?.length > length ? value?.substring(0, length) + ' ..' : value;
}
export function formatAMPM(timezone: any) {
  const date = new Date(timezone);
  let hours = date.getHours();
  let minutes: any = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  const strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

export function compareDates(value: string) {
  const date = new Date(value);
  const toDay = new Date();
  return toDay.getTime() <= date.getTime();
}

export function replaceCharater(
  str: string,
  char: string,
  replaceWith: string,
) {
  return str.replace(char, replaceWith);
}
export const replaceTextWithObjectValues = (text: string, values: any) => {
  for (const key in values) {
    const regex = new RegExp(`%${key}%`, 'g');
    text = text.replace(regex, values[key]);
  }
  return text;
};
export function removeAllSpecialCharater(str: string): string {
  return str?.replace('%OFFICE_HOURS%', '').replace('%TS_PHONE_NUMBER%', '');
}

export const checkIsOfflineMode = (route: any) => {
  return Boolean(route?.params?.offlineMode);
};
