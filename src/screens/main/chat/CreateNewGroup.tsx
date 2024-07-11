import React, {createRef} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import appStyle from '../../../styles/appStyle';
import {Icons} from '../../../constants';
import {ColorSet, FamilySet} from '../../../styles';
import {Header, BottomSheet, Button} from '../../../components/index';
import {Screen} from '../../../constants/screens/screens';
import {screenHeight, screenWidth} from '../../../styles/screenSize';

import {TextField} from 'rn-material-ui-textfield';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useTranslation} from 'react-i18next';
const photoBottomRef = createRef<any>();

const CreateNewGroup: React.FC<{navigation: any}> = ({navigation}) => {
  const {t} = useTranslation();
  const [image, setImage] = React.useState('');

  const addImage = type => {
    photoBottomRef.current?.setModalVisible(false);
    const options: any = {
      mediaType: 'photo',
    };
    if (type === 1) {
      launchCamera(options, (response: any) => {
        if (response.didCancel) {
          return;
        } else {
          const selectedImageObj = response?.assets[0];
          setImage(selectedImageObj.uri);
        }
      });
    } else {
      launchImageLibrary(options, (response: any) => {
        if (response.didCancel) {
          return;
        } else {
          const selectedImageObj = response?.assets[0];
          setImage(selectedImageObj.uri);
        }
      });
    }
  };
  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.goBack()}
        title={t('local_common_newGroupChat')}
        headerIconOne={Icons.notification}
        onPressheaderIconOne={() => navigation.navigate(Screen.Notification)}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <View style={[appStyle.p25, appStyle.flex1]}>
          <TouchableOpacity
            onPress={() => photoBottomRef.current?.setModalVisible()}
            style={[appStyle.aiCenter, appStyle.pv20]}>
            <View style={styles.imageTopViewStyle}>
              {image === '' ? (
                <Image source={Icons.tabCamera} style={styles.cameraStyle} />
              ) : (
                <Image source={{uri: image}} style={styles.imageTopViewStyle} />
              )}
            </View>
            <Text style={styles.titleStyle}>{t('addPicture')}</Text>
          </TouchableOpacity>
          <TextField
            label={t('enterGroupName')}
            fontSize={16}
            baseColor={ColorSet.grey}
            tintColor={ColorSet.red}
          />
        </View>
      </KeyboardAwareScrollView>
      <View style={appStyle.p20}>
        <Button onPress={() => navigation.replace(Screen.AddMembers)}>
          {t('button_continue')}
        </Button>
      </View>
      <BottomSheet bottomSheetRef={photoBottomRef}>
        <View style={[appStyle.pb20, appStyle.pt10, appStyle.aiCenter]}>
          <Text style={styles.sheetTitleStyle}>
            {t('text_pleaseSelectOneOfThem')}
          </Text>
        </View>
        <View style={[appStyle.rowBtw]}>
          <View style={{width: screenWidth.width40}}>
            <Button onPress={() => addImage(1)}>{t('button_takePhoto')}</Button>
          </View>
          <View style={{width: screenWidth.width40}}>
            <Button onPress={() => addImage(2)}>
              {t('button_openLibrary')}
            </Button>
          </View>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default CreateNewGroup;

const styles = StyleSheet.create({
  sheetTitleStyle: {
    color: ColorSet.secondary,
    fontSize: 18,
    fontFamily: FamilySet.bold,
  },
  imageTopViewStyle: {
    width: 70,
    height: 70,
    borderColor: ColorSet.themeLight,
    borderWidth: 1,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
  },
  titleStyle: {
    fontSize: 12,
    fontFamily: FamilySet.regular,
    color: ColorSet.grey,
    paddingRight: 5,
    paddingTop: 5,
  },
  cameraStyle: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  closeButtonView: {
    position: 'absolute',
    zIndex: 5,
    right: -5,
    top: 25,
  },
  closeButtonStyle: {
    width: 20,
    height: 20,
  },
  imageStyle: {
    width: screenWidth.width90,
    height: screenHeight.height20,
    borderRadius: 20,
  },
});
