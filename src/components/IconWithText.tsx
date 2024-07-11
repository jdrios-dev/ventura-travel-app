import React from 'react';
import {
  StyleSheet,
  Image,
  Text,
  View,
  ImageSourcePropType,
  ViewStyle,
  TextStyle,
} from 'react-native';

import {TouchableOpacity} from 'react-native-gesture-handler';
import {Icons} from '../constants';
import {ColorSet, FamilySet} from '../styles';
import appStyle from '../styles/appStyle';
import {screenWidth} from '../styles/screenSize';

interface HeaderProps {
  title?: string | undefined;
  icon?: ImageSourcePropType | null;
  onPressIcon?: (() => void) | undefined;
  testID?: string;
}
const IconWithText: React.FC<HeaderProps> = props => {
  const {title, icon, onPressIcon, testID} = props;
  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPressIcon}
      style={[appStyle.row, appStyle.pb20]}>
      <View style={{width: screenWidth.width15}}>
        <View style={styles.iconTopView}>
          <Image source={icon} style={[styles.iconStyle]} />
        </View>
      </View>
      <View style={[appStyle.flex1, appStyle.jcCenter, appStyle.pl20]}>
        <Text style={styles.titleStyle}>{title}</Text>
      </View>
      <View style={styles.rightIconTopView}>
        <Image source={Icons.arrowRightRed} style={styles.iconStyle} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconTopView: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: ColorSet.themeExtraLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconStyle: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    tintColor: ColorSet.theme,
  },
  titleStyle: {
    fontSize: 16,
    fontFamily: FamilySet.semiBold,
    color: ColorSet.secondary,
  },
  rightIconTopView: {
    width: screenWidth.width10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default IconWithText;
