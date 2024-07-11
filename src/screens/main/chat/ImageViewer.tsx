import React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import appStyle from '../../../styles/appStyle';
import {Icons} from '../../../constants';
import {screenHeight} from '../../../styles/screenSize';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
const ImageViewer: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  const photo = route?.params?.items;
  const imageUrl = photo?.url ? photo?.url : photo?.path ? photo?.path : photo;
  return (
    <SafeAreaView style={[appStyle.safeContainer, {backgroundColor: 'black'}]}>
      <StatusBar hidden />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.cross}>
        <Image style={styles.iconXmd} source={Icons.close} />
      </TouchableOpacity>
      <KeyboardAwareScrollView
        contentContainerStyle={appStyle.scrollContainer}
        keyboardShouldPersistTaps="always">
        <View style={[appStyle.flex1, appStyle.jcCenter, {overflow: 'hidden'}]}>
          <View>
            <FastImage
              style={styles.imageView}
              resizeMode={FastImage.resizeMode.contain}
              source={{uri: imageUrl}}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default ImageViewer;

const styles = StyleSheet.create({
  cross: {
    alignItems: 'flex-end',
    marginRight: 15,
    marginTop: 20,
  },
  imageView: {
    width: '100%',
    height: screenHeight.height50,
    resizeMode: 'cover',
  },
  iconXmd: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
});
