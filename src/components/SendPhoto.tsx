import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Image,
  ActivityIndicator,
} from 'react-native';

import appStyle from '../styles/appStyle';
import {Icons} from '../constants';
import {ColorSet, FamilySet} from '../styles';
interface SendPhotoProps {
  image?: string;
  isAnimating?: boolean;
  onPress?: (() => void) | undefined;
  onChange?: (() => void) | undefined;
  onCancel?: (() => void) | undefined;
  visibale?: boolean | undefined;
}

const SendPhoto: React.FC<SendPhotoProps> = props => {
  const {visibale, onPress, onChange, onCancel, image, isAnimating} = props;
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visibale}
      onRequestClose={() => {}}>
      <View style={[appStyle.flex1, styles.container]} />
      <View style={styles.ImageContainer}>
        <TouchableOpacity
          disabled={isAnimating}
          onPress={onCancel}
          style={styles.cross}>
          <Image style={styles.iconXmd} source={Icons.close} />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={isAnimating}
          onPress={onChange}
          style={styles.ImageView}>
          <Image style={styles.imageStyle} source={{uri: image}} />
          <Image source={Icons.tabCamera} style={styles.cameraStyle} />
          <View style={styles.loader}>
            <ActivityIndicator
              size="large"
              color={ColorSet.theme}
              animating={isAnimating}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={isAnimating}
          onPress={onPress}
          style={[styles.send, {opacity: isAnimating ? 0.5 : 1}]}>
          <Text style={styles.textStyle}>Send</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorSet.white,
    opacity: 0.7,
  },
  ImageContainer: {
    position: 'absolute',
    top: '27%',
    height: 350,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: ColorSet.dividerColor,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  iconXmd: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  cross: {
    alignItems: 'flex-end',
    marginRight: 15,
    marginTop: 14,
  },
  ImageView: {
    height: '65%',
    width: '90%',
    top: 5,
    margin: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 10,
  },
  imageStyle: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  cameraStyle: {
    position: 'absolute',
    alignSelf: 'center',
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  send: {
    width: '50%',
    height: 40,
    borderRadius: 25,
    backgroundColor: ColorSet.theme,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    top: 10,
  },
  textStyle: {
    color: ColorSet.white,
    fontSize: 14,
    fontFamily: FamilySet.semiBold,
    textAlign: 'center',
  },
  loader: {
    position: 'absolute',
  },
});

export default SendPhoto;
