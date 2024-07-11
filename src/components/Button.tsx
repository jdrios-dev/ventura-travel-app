/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextStyle,
  TouchableOpacity,
  Image,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';

import appStyle from '../styles/appStyle';
import {Icons} from '../constants';
import {ColorSet, Fonts, FamilySet} from '../styles';

interface ButtonProps {
  style?: TextStyle | undefined;
  nextButton?: boolean | false;
  themeColor?: boolean | false;
  containerStyle?: ViewStyle | undefined;
  onPress?: (() => void) | undefined;
  icon?: ImageSourcePropType | undefined;
  disable?: boolean;
  children: string;
  testID?: string;
}

const Button: React.FC<ButtonProps> = props => {
  const {
    style,
    disable,
    containerStyle,
    onPress,
    icon,
    nextButton,
    themeColor,
    testID,
  } = props;

  return (
    <TouchableOpacity
      testID={testID}
      disabled={disable}
      style={[
        {
          ...styles.container,
          ...containerStyle,
          justifyContent: nextButton ? 'space-between' : 'center',
          paddingLeft: nextButton ? 25 : 0,
          paddingRight: nextButton ? 5 : 0,
          backgroundColor: themeColor ? ColorSet.theme : ColorSet.themeLight,
        },
        disable && {...styles.disable},
      ]}
      onPress={onPress}>
      <View style={[appStyle.rowCenter]}>
        {icon && <Image style={[styles.image, appStyle.mr5]} source={icon} />}
        <Text
          style={{
            ...styles.label,
            ...style,
            paddingTop: icon ? 8 : 0,
          }}>
          {props.children}
        </Text>
      </View>
      {nextButton && (
        <View style={styles.nextButtonStyle}>
          <Image style={styles.image} source={Icons.arrowRight} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  nextButtonStyle: {
    backgroundColor: ColorSet.white,
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    height: 60,
    borderRadius: 50,
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  label: {
    color: ColorSet.white,
    ...Fonts.size.normal,
    fontFamily: FamilySet.bold,
  },
  image: {
    width: 21,
    height: 21,
    resizeMode: 'contain',
  },
  disable: {
    backgroundColor: ColorSet.grayLight,
  },
});

export default Button;
