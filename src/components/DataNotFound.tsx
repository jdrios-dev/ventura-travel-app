import React from 'react';

import {StyleSheet, View, Text} from 'react-native';

import {ColorSet} from '../styles';
import {t} from 'i18next';

const DataNotFound: React.FC<any> = props => {
  return (
    <View style={styles.container}>
      <Text style={styles.dataNotFoundText}>{t('text_data-not-found')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataNotFoundText: {
    color: ColorSet.theme,
  },
});

export default DataNotFound;
