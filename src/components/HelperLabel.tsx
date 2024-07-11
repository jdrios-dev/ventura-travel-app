import {View, Text, StyleSheet, Image, ImageSourcePropType} from 'react-native';
import React from 'react';
import {ColorSet} from '../styles';

type HelperLabelType = {
  text: string;
  icon?: ImageSourcePropType;
};

const HelperLabel = ({text, icon}: HelperLabelType) => {
  return (
    <View style={styles.container}>
      {icon && <Image style={styles.image} source={icon} />}
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: ColorSet.grayLight,
  },
});

export default HelperLabel;
