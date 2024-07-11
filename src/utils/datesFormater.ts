import {Language} from '../types/common.types';

export const getLocalizedDateFormat = (chosenLanguage: Language) => {
  switch (chosenLanguage) {
    case 'de':
      return 'dd.MM.yyyy';
    case 'fr':
      return 'DD/MM/yyyy';
    case 'es':
      return 'DD/MM/yyyy';
    default:
      return 'dd MMM yyyy';
  }
};
