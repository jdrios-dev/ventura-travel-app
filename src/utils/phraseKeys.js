/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
require('dotenv').config();
const {Configuration, LocalesApi} = require('phrase-js');
var FormData = require('form-data');
var fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const locales = [
  {
    id: 'acf79eae0408b7d4bf8af736e49fea2b',
    name: 'de',
  },
  {
    id: 'f901b37df2a0e498ec4c8d672a8aec09',
    name: 'en',
  },
  {
    id: '94c36f668f739ad24c407d4862a6c8ed',
    name: 'es',
  },
  {
    id: 'f4596e0b5b66337d681461e513b13a3d',
    name: 'fr',
  },
  {
    id: '34599b004f59891e39acaf0cc5bc0a28',
    name: 'nl',
  },
];

const globalAny = global;
globalAny.window = {
  fetch,
};
globalAny.FormData = FormData;
const configuration = new Configuration({
  apiKey: `token ${process.env.PHRASE_API_KEY}`,
});

const getTranslationByLocale = locale => {
  const localeApi = new LocalesApi(configuration);

  let requestParameters = {
    projectId: process.env.PHRASE_PROJECT_ID,
    fileFormat: 'i18next',
    id: locale.id,
  };

  const localeFile = path.resolve(
    __dirname,
    `../../locale/${locale.name}/translation.json`,
  );

  localeApi
    .localeDownloadRaw(requestParameters)
    .then(
      async ({raw}) =>
        new Promise((resolve, reject) => {
          const fileStream = fs.createWriteStream(localeFile);
          raw.body.pipe(fileStream);
          raw.body.on('error', err => {
            console.error(err);
            reject(err);
          });
          fileStream.on('finish', () => {
            // eslint-diable-next-line no-console
            console.log(`Download lang keys: ${locale.name}`);
            resolve();
          });
        }),
    )
    .catch(e => console.error('DOWNLOAD KEYS ERROR', e));
};

locales.forEach(locale => {
  getTranslationByLocale(locale);
});
