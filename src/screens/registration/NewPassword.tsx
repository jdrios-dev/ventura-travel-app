import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';

import appStyle from '../../styles/appStyle';
import Button from '../../components/Button';
import {Icons, Images} from '../../constants';
import {ColorSet, FamilySet} from '../../styles';
import {H1} from '../../components/index';
import {screenHeight} from '../../styles/screenSize';
import {Screen} from '../../constants/screens/screens';
import {resetPassword} from '../../networking/Services';
import {TextField} from 'rn-material-ui-textfield';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Codes} from '../../constants/codes';
import {useTranslation} from 'react-i18next';
import {Helper} from '../../utils';
const NewPassWord: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  const {t} = useTranslation();
  const [state, setSate] = React.useState(true);
  const [confirmPass, setConfirmPass] = React.useState(Icons.hide);
  const [pass, setPass] = React.useState(Icons.hide);
  const [passwordValue, setPasswordValue] = React.useState('');
  const [ComfirmPasswordValue, setComfirmPasswordValue] = React.useState('');

  const showPassword = type => {
    if (type === 1) {
      pass === Icons.hide ? setPass(Icons.show) : setPass(Icons.hide);
    } else {
      confirmPass === Icons.hide
        ? setConfirmPass(Icons.show)
        : setConfirmPass(Icons.hide);
    }
  };
  const passwordReset = async () => {
    const otp = Math.floor(route?.params?.otpcode);
    if (passwordValue === ComfirmPasswordValue) {
      const params = {
        email: route?.params?.email,
        resetHashCode: otp,
        password: passwordValue,
      };
      const response = await resetPassword(params);
      if (response.statusCode === Codes.BAD_REQUEST) {
        Helper.showToast(t('error_passwordInputs'));
      } else if (response.statusCode === Codes.SUCCESS) {
        Helper.showToast(response.message);
        setSate(false);
      } else {
        Helper.showToast(response.message);
      }
    } else {
      Helper.showToast(t('error_confirmPasswordShouldMatch'));
    }
  };
  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <ImageBackground style={[appStyle.flex1]} source={Images.bgImage}>
        <StatusBar hidden />
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={appStyle.scrollContainer}>
          {state ? (
            <View style={appStyle.halfPageView}>
              <View style={appStyle.pv30}>
                <H1>{t('h1_createNewPassword')}</H1>
              </View>
              <View style={[appStyle.flex1, appStyle.jcSpaceBetween]}>
                <View style={[appStyle.flex1, appStyle.pt30]}>
                  <View>
                    <TextField
                      label={t('password')}
                      fontSize={16}
                      baseColor={ColorSet.grey}
                      tintColor={ColorSet.red}
                      onChangeText={text => setPasswordValue(text)}
                      secureTextEntry={pass === Icons.hide ? true : false}
                      renderRightAccessory={() => (
                        <TouchableOpacity onPress={() => showPassword(1)}>
                          <Image source={pass} style={styles.eyeStyle} />
                        </TouchableOpacity>
                      )}
                    />
                    <TextField
                      label={t('comfirmPassword')}
                      fontSize={16}
                      onChangeText={text => setComfirmPasswordValue(text)}
                      baseColor={ColorSet.grey}
                      tintColor={ColorSet.red}
                      secureTextEntry={
                        confirmPass === Icons.hide ? true : false
                      }
                      renderRightAccessory={() => (
                        <TouchableOpacity onPress={() => showPassword(2)}>
                          <Image source={confirmPass} style={styles.eyeStyle} />
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                  <View style={appStyle.pt10}>
                    <View style={appStyle.rowBtw}>
                      <Text style={styles.haveAccountStyle}>
                        {t('text_alreadyHaveAccount')}
                      </Text>
                      <Text style={styles.haveAccountStyle}>
                        {t('text_newHere')}
                      </Text>
                    </View>
                    <View style={[appStyle.rowBtw, appStyle.pt5]}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate(Screen.LoginScreen)}>
                        <Text style={styles.loginStyle}>
                          {t('button_login')}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => navigation.navigate(Screen.LoginScreen)}>
                        <Text style={styles.loginStyle}>
                          {t('button_createAccount')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.buttonStyle}>
                <Button themeColor onPress={() => passwordReset()}>
                  {t('button_continue')}
                </Button>
                <View style={[appStyle.aiCenter, appStyle.pb20]}>
                  <Image
                    style={[styles.logoDetail]}
                    source={Images.logoDetailBlack}
                  />
                </View>
              </View>
            </View>
          ) : (
            <View style={appStyle.halfPageView}>
              <View style={appStyle.pv30}>
                <H1>{t('h1_passwordUpdated')}</H1>
              </View>
              <View style={[appStyle.flex1, appStyle.jcSpaceBetween]}>
                <View
                  style={[
                    appStyle.flex1,
                    appStyle.aiCenter,
                    appStyle.jcCenter,
                  ]}>
                  <Image style={[styles.tickStyle]} source={Icons.tick} />
                  <Text style={styles.desStyle}>
                    {t('text_passwordSucessfulyUpdated')}
                  </Text>
                </View>
              </View>
              <View style={styles.buttonStyle}>
                <Button
                  themeColor
                  onPress={() => navigation.navigate(Screen.LoginScreen)}>
                  {t('button_login')}
                </Button>
                <View style={[appStyle.aiCenter, appStyle.pb20]}>
                  <Image
                    style={[styles.logoDetail]}
                    source={Images.logoDetailBlack}
                  />
                </View>
              </View>
            </View>
          )}
        </KeyboardAwareScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default NewPassWord;

const styles = StyleSheet.create({
  loginStyle: {
    fontSize: 12,
    color: ColorSet.theme,
    fontFamily: FamilySet.bold,
  },
  haveAccountStyle: {
    fontSize: 12,
    color: ColorSet.secondary,
    fontFamily: FamilySet.bold,
  },
  desStyle: {
    color: ColorSet.grey,
    fontSize: 16,
    fontFamily: FamilySet.regular,
    padding: 10,
    textAlign: 'center',
  },
  buttonStyle: {
    height: screenHeight.height15,
    justifyContent: 'space-between',
  },
  tickStyle: {
    resizeMode: 'contain',
    width: 38,
    height: 50,
  },
  logoDetail: {
    resizeMode: 'contain',
    width: 173,
    height: 16,
  },
  eyeStyle: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
});
