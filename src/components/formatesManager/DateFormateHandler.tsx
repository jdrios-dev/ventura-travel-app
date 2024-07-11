import format from 'date-fns/format';
import parse from 'date-fns/parse';

const dateFormator = (date: string, formatString: string): string => {
  // JS has a behaviour that will add or remove a day in ISO dates
  // if the string date has - instead of /
  // That is because we replace all - with / on parsedISOtoDate variable
  // Daniel 2 Feb 24
  const parsedISOtoDate = new Date(date?.split('T')[0].replace(/-/g, '/'));

  try {
    const formatedISODate = format(parsedISOtoDate, formatString);
    return formatedISODate;
  } catch (error) {
    return date;
  }
};

export const formatTime = date => {
  const time = date?.split?.('T')?.[1];
  const timeFormated = format(
    parse(time.split(':', 2).join(':'), 'HH:mm', new Date()),
    'hh:mm a',
  );
  return timeFormated;
};

export default dateFormator;
