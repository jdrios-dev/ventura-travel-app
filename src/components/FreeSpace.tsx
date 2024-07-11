import {View, Text, Platform} from 'react-native';
import React, {useEffect, useState} from 'react';
import RNFetchBlob from 'rn-fetch-blob';
import {H1} from './Typography';
import {useTranslation} from 'react-i18next';
import {ColorSet} from '../styles';
import {StyleSheet} from 'react-native';

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    'Bytes',
    'KiB',
    'MiB',
    'GiB',
    'TiB',
    'PiB',
    'EiB',
    'ZiB',
    'YiB',
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
const MIN_BYTES = 314572800; // 300 Mb is the recommended for offline mode -  Dani 29 May 24

const FreeSpace = () => {
  const {t} = useTranslation();
  const [freeSpaceBytes, setFreeSpaceBytes] = useState(0);
  const [freeSpaceBytesInternal, setFreeSpaceBytesInternal] = useState(0);
  const [freeSpaceBytesExternal, setFreeSpaceBytesExternal] = useState(0);
  const checkFreeSpace = async () => {
    RNFetchBlob.fs.df().then(response => {
      if (Platform.OS === 'ios') {
        setFreeSpaceBytes(response.free);
      }
      if (Platform.OS === 'android') {
        setFreeSpaceBytesInternal(response.internal_free);
        setFreeSpaceBytesExternal(response.external_free);
      }
    });
  };

  const messageByPlatform = {
    ios: t('text_free-space-ios', {
      value: formatBytes(freeSpaceBytes),
    }),
    android: t('text_free-space-android', {
      internalValue: formatBytes(freeSpaceBytesInternal),
      externalValue: formatBytes(freeSpaceBytesExternal),
    }),
  };

  const showMessageByPlatform = {
    ios: freeSpaceBytes <= MIN_BYTES,
    android:
      freeSpaceBytesInternal <= MIN_BYTES ||
      freeSpaceBytesExternal <= MIN_BYTES,
  };

  const showMessage = showMessageByPlatform[Platform.OS];

  useEffect(() => {
    checkFreeSpace();
  }, []);

  return showMessage ? (
    <View>
      <H1>{t('title_free-space')} ⚠️</H1>
      <Text style={styles.text}>{messageByPlatform[Platform.OS]}</Text>
      <Text style={styles.text}>{t('text_recommended-space')}</Text>
      <Text style={styles.text}>1. {t('text_delete-unused-app')}</Text>
      <Text style={styles.text}>2. {t('text_clear-cache')}</Text>
      <Text style={styles.text}>3. {t('text_delete-photos-videos')}</Text>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  text: {
    color: ColorSet.textBase,
    fontSize: 16,
  },
});

export default FreeSpace;
