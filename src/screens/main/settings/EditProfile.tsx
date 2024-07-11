import React, {createRef} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';

import appStyle from '../../../styles/appStyle';
import {Icons, Keys} from '../../../constants';
import {ColorSet, FamilySet} from '../../../styles';
import {
  Header,
  BottomSheet,
  Button,
  PhoneCountryCodeInput,
} from '../../../components/index';
import {Screen} from '../../../constants/screens/screens';
import {screenHeight, screenWidth} from '../../../styles/screenSize';
import {TextField} from 'rn-material-ui-textfield';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  editProfile,
  createProfile,
  sendFile,
} from '../../../networking/Services';
import {permissionCamera} from '../../../components/permissionManager/CameraPermission';
import {
  cameraImagePicker,
  libraryImagePicker,
} from '../../../components/uploadsManager/ImagePicker';
import {useSelector, useDispatch} from 'react-redux';
import Loader from '../../../components/Loader';
import {selectUser} from '../../../redux/common/common.selectors';
import {setUser} from '../../../redux/common/common.slice';
import {Codes} from '../../../constants/codes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import {Helper} from '../../../utils';
import Toast from 'react-native-simple-toast';
const photoBottomRef = createRef<any>();
const EditProfile: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  const {t} = useTranslation();
  const userdetails: any = useSelector<any>(selectUser);
  const dispatch = useDispatch();
  const [loading, setloading] = React.useState(false);
  const checkNewUser = route?.params?.createProfile;
  const [email] = React.useState(userdetails.email);
  const [fullName, setFullName] = React.useState(userdetails.fullName);
  const [phoneNumber, setPhoneNumber] = React.useState(userdetails.phoneNumber);
  const [image, setImage] = React.useState(userdetails.profilePicture);
  const addImage = async (type: number) => {
    photoBottomRef.current?.setModalVisible(false);
    const cropping = true;
    setTimeout(async () => {
      if (type === 1) {
        if (Platform.OS === 'android') {
          const granted = await permissionCamera();
          if (granted) {
            const res = await cameraImagePicker(cropping);
            setImage(res.path);
          }
          return;
        }

        const res = await cameraImagePicker(cropping);
        setImage(res.path);
        return;
      }
      const res = await libraryImagePicker(cropping);
      setImage(res.path);
    }, 1000);
  };
  const ProfileEdit = async () => {
    setloading(true);
    let profilePicture = '';
    const res = await sendFile(image);
    if (res) {
      profilePicture = res?.data?.path;
    } else {
      Helper.showToast('There is problem with uploading image');
      return;
    }
    const params = {
      email,
      fullName,
      phoneNumber,
      profilePicture,
    };
    const response = await editProfile(params);
    setloading(false);
    if (response !== null) {
      dispatch(setUser(response.data));
      Helper.showToast(response.message);
      navigation.goBack();
    }
  };
  const ProfileCreate = async () => {
    if (!fullName) {
      return Helper.showToast(t('error_name-missing'));
    }
    if (!phoneNumber) {
      return Helper.showToast(t('error_phone-missing'));
    }
    if (!image) {
      return Helper.showToast(t('error_image-missing'));
    } else {
      const res = await sendFile(image);

      if (!res) {
        Helper.showToast('There is problem with uploading image');
        return;
      }
      const profilePicture: string = res?.data?.path;

      const params = {
        fullName,
        phoneNumber,
        profilePicture,
      };
      setloading(true);
      const response = await createProfile(params);

      setloading(false);
      if (response.statusCode === Codes.PROFILE_CREATED) {
        dispatch(setUser(response.data));
        Helper.showToast(response.message);
        setTimeout(() => {
          navigation.navigate('TabNavigator');
        }, 500);
      } else if (response.statusCode === Codes.UNAUTHORIZED) {
        await AsyncStorage.removeItem(Keys.userDetails);
        navigation.navigate(Screen.LoginScreen);
      } else if (response.statusCode === Codes.BAD_REQUEST) {
        Helper.showToast(t('error_pleaseFillAllFields'));
      } else {
        Toast.show(response.message);
      }
    }
  };
  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back={!checkNewUser && true}
        onPressBack={() => navigation.goBack()}
        title={
          checkNewUser ? t('screen_common_welcome') : t('Touchable_EditProfile')
        }
        headerIconOne={`${!checkNewUser && Icons.notification}`}
        onPressheaderIconOne={() => navigation.navigate(Screen.Notification)}
      />
      <Loader isLoading={loading} layout={'outside'} />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <View style={[appStyle.p25, appStyle.flex1]}>
          <TouchableOpacity
            onPress={() => photoBottomRef.current?.setModalVisible()}
            style={[appStyle.aiCenter, appStyle.pv20]}>
            <View style={styles.imageTopViewStyle}>
              {image === null ? (
                <Image source={Icons.tabCamera} style={styles.cameraStyle} />
              ) : (
                <Image source={{uri: image}} style={styles.imageTopViewStyle} />
              )}
            </View>
            <Text style={styles.titleStyle}>{t('addPicture')}</Text>
          </TouchableOpacity>
          {!checkNewUser ? (
            <TextField
              label={t('emailAdress')}
              fontSize={16}
              maxLength={50}
              value={email}
              editable={false}
              baseColor={ColorSet.grey}
              tintColor={ColorSet.red}
            />
          ) : null}
          <TextField
            label={t('fullName')}
            fontSize={16}
            maxLength={20}
            value={fullName}
            baseColor={ColorSet.grey}
            tintColor={ColorSet.red}
            onChangeText={newText => setFullName(newText)}
          />

          <PhoneCountryCodeInput
            label={t('phoneNumber')}
            keyboardType="phone-pad"
            value={phoneNumber}
            fontSize={16}
            maxLength={20}
            baseColor={ColorSet.grey}
            tintColor={ColorSet.red}
            onChangeText={newText => setPhoneNumber(newText)}
          />
        </View>
      </KeyboardAwareScrollView>
      <View style={appStyle.p20}>
        <Button
          onPress={() => {
            checkNewUser ? ProfileCreate() : ProfileEdit();
          }}>
          {t('button_save')}
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

export default EditProfile;

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
    top: 10,
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
