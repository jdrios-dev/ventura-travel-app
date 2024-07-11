import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import appStyle from '../styles/appStyle';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ColorSet, FamilySet} from '../styles';

interface HeaderProps {
  title?: string | undefined;
  address?: string | undefined;
  description?: string | undefined;
  adressTwo?: string | undefined;
  onPress?: (() => void) | undefined;
}

const TripInfo: React.FC<HeaderProps> = props => {
  const {title, address, description, adressTwo, onPress} = props;
  return (
    <TouchableOpacity onPress={onPress} style={styles.topView}>
      <View style={[appStyle.rowBtw]}>
        <Text style={styles.titleTextStyle}>{title}</Text>
        <Text style={styles.detailTextStyle}>{address}</Text>
      </View>
      <View style={[appStyle.rowBtw, {paddingTop: 2}]}>
        <Text style={styles.desTextStyle}>{description}</Text>
        <Text style={styles.detailTextStyle}>{adressTwo}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  topView: {
    backgroundColor: ColorSet.secondaryLight,
    padding: 10,
    marginTop: 10,
  },
  titleTextStyle: {
    color: ColorSet.theme,
    fontSize: 18,
    fontFamily: FamilySet.bold,
  },
  detailTextStyle: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
    color: ColorSet.secondary,
  },
  desTextStyle: {
    color: ColorSet.secondary,
    fontSize: 12,
    fontFamily: FamilySet.bold,
  },
});

export default TripInfo;
