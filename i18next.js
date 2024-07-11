/* eslint-disable @typescript-eslint/no-var-requires */
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import ChainedBackend from 'i18next-chained-backend';
import resourcesToBackend from 'i18next-resources-to-backend';
import translationEN from './locale/en/translation.json';
import translationDE from './locale/de/translation.json';
import translationES from './locale/es/translation.json';
import translationFR from './locale/fr/translation.json';
import translationNL from './locale/nl/translation.json';
import Phrase from 'react-native-phrase-sdk';
const localResources = {
  de: {
    translation: translationDE,
  },
  en: {
    translation: translationEN,
  },
  es: {
    translation: translationES,
  },
  fr: {
    translation: translationFR,
  },
  nl: {
    translation: translationNL,
  },
};
// "a40fc9bc1223560469cc6d4c61735595",
// "qqblPabGBhnRJIgmsOyDD6dcYVTBT0AWZ9RXYCOWpsc",

// 'cf301edd05cba3079eac3d9b2e465959',
// 'iHpVecOzU0QwzBaIlnMZsZAbcj2fI6jKPZu6QBMMvCI',
let phrase = new Phrase(
  'cf301edd05cba3079eac3d9b2e465959', // YOUR_DISTRIBUTION_ID
  'qqblPabGBhnRJIgmsOyDD6dcYVTBT0AWZ9RXYCOWpsc', // YOUR_ENVIRONMENT_ID
  require('./package.json').version,
  'i18next',
);

const backendPhrase = resourcesToBackend((language, namespace, callback) => {
  phrase
    .requestTranslation(language)
    .then(remoteResources => {
      callback(null, remoteResources);
    })
    .catch(error => {
      callback(error, null);
    });
});

const backendFallback = resourcesToBackend(localResources);

i18n
  .use(ChainedBackend)
  .use(initReactI18next)
  .init({
    backend: {
      backends: [backendPhrase, backendFallback],
    },
    compatibilityJSON: 'v3',
    debug: false,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      prefix: '{{',
      suffix: '}}',
    },
  });
