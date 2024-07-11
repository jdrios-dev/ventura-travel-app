import React from 'react';

import {StyleSheet, Text, View, ViewStyle} from 'react-native';

import {Fonts, FamilySet, ColorSet} from '../../styles';

interface Props {
  containerStyle?: ViewStyle;
  children: any;
  theme?: boolean | false;
  testID?: string;
}

const H1: React.FC<Props> = ({
  children,
  theme,
  containerStyle,
  testID,
}: Props) => {
  return (
    <View style={containerStyle}>
      <Text
        testID={testID}
        style={[
          styles.h1,
          {color: theme ? ColorSet.theme : ColorSet.secondary},
        ]}>
        {children}
      </Text>
    </View>
  );
};

export default H1;

const styles = StyleSheet.create({
  h1: {
    ...Fonts.size.xmedium,
    fontFamily: FamilySet.bold,
  },
});
