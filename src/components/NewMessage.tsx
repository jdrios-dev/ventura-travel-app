import React from 'react';
import {StyleSheet, Image, Text, View, ImageSourcePropType} from 'react-native';

import appStyle from '../styles/appStyle';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ColorSet, FamilySet} from '../styles';
import {screenWidth} from '../styles/screenSize';
import {Icons} from '../constants';

interface HeaderProps {
  name?: string | undefined;
  image?: ImageSourcePropType | null;
  icon?: ImageSourcePropType | null;
  onPressIcon?: (() => void) | undefined;
  testId?: string;
  notificationColor?: string | null;
}

const NewMessage: React.FC<HeaderProps> = props => {
  const {name, icon, onPressIcon, testId, notificationColor} = props;
  return (
    <TouchableOpacity
      testID={testId}
      onPress={onPressIcon}
      style={[appStyle.row, appStyle.mb20, appStyle.aiCenter]}>
      <View
        style={{
          minWidth: 44,
          minHeight: 44,
          borderWidth: notificationColor && 1,
          borderColor: notificationColor && notificationColor,
          borderRadius: notificationColor && 150,
        }}>
        <Image source={Icons.passengerIcon} style={styles.imageStyle} />
      </View>
      <View style={[appStyle.flex1, appStyle.jcCenter, appStyle.pl20]}>
        <Text style={styles.titleStyle}>{name}</Text>
      </View>
      <View style={styles.rightIconTopView}>
        <Image source={icon} style={styles.iconStyle} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 16,
    fontFamily: FamilySet.bold,
    color: ColorSet.grayMedium,
  },
  iconStyle: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  rightIconTopView: {
    width: screenWidth.width10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});

export default NewMessage;
