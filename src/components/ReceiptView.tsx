import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

import {ColorSet, FamilySet} from '../styles';

interface HeaderProps {
  title?: string | undefined;
  date?: string | undefined;
  receivedFrom?: string | undefined;
  amount?: string | undefined;
  by?: string | undefined;
  total?: string | undefined;
  onPress?: (() => void) | undefined;
}

const ReceiptView: React.FC<HeaderProps> = props => {
  const {title, date, receivedFrom, amount, by, total, onPress} = props;
  return (
    <TouchableOpacity onPress={onPress} style={styles.containerStyle}>
      {title && <Text style={styles.titleTextStyle}>Trip to Paraguay</Text>}
      {date && <Text style={styles.desTextStyle}>Date: {date}</Text>}
      {receivedFrom && (
        <Text style={styles.desTextStyle}>Received from: {receivedFrom}</Text>
      )}
      {amount && <Text style={styles.desTextStyle}>Amount of: {amount}</Text>}
      {by && <Text style={styles.desTextStyle}>By: {by}</Text>}
      {total && <Text style={styles.desTextStyle}>Total: {total}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    padding: 10,
    backgroundColor: ColorSet.secondaryLight,
    marginBottom: 20,
  },
  titleTextStyle: {
    fontSize: 16,
    fontFamily: FamilySet.bold,
    color: ColorSet.secondary,
    paddingVertical: 5,
  },
  desTextStyle: {
    fontSize: 12,
    fontFamily: FamilySet.bold,
    color: ColorSet.grey,
    paddingBottom: 5,
  },
});

export default ReceiptView;
