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
import {requestPassword} from '../../networking/Services';
import {TextField} from 'rn-material-ui-textfield';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Loader from '../../components/Loader';
import {Codes} from '../../constants/codes';
import {useTranslation} from 'react-i18next';
import {Helper} from '../../utils';
const ForgotPassword: React.FC<{navigation: any}> = ({navigation}) => {
  const {t} = useTranslation();
  const [loading, setLoadig] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const sendOtp = async () => {
    setLoadig(true);
    const response = await requestPassword({email});
    setLoadig(false);
    if (response.statusCode === Codes.BAD_REQUEST) {
      Helper.showToast(t('error_enterEmail'));
    } else if (response.statusCode === Codes.SUCCESS) {
      Helper.showToast(response.message);
      navigation.navigate(Screen.OtpScreen, {email: email});
    } else if (response.statusCode === Codes.USER_NOT_FOUND) {
      Helper.showToast(response.message);
    }
  };
  /**
   * TODO:
   * the component was render with an useState
   *  that never was updated
   * i'll set a var to true for the render
   *  while we figure out when it should change to false
   * Dani 21 06 2023
   */
  const SHOW_TRUE_NEVER_CHANGE = true;
  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <ImageBackground style={[appStyle.flex1]} source={Images.bgImage}>
        <StatusBar hidden />
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={appStyle.scrollContainer}>
          {SHOW_TRUE_NEVER_CHANGE ? (
            <View style={appStyle.halfPageView}>
              <View style={appStyle.pv30}>
                <H1>{t('h1_forgotPassword')}</H1>
              </View>

              <View style={[appStyle.flex1, appStyle.jcSpaceBetween]}>
                <Loader isLoading={loading} layout={'outside'} />
                <View style={[appStyle.flex1, appStyle.pt30]}>
                  <Text style={styles.desStyle}>{t('text_instructions')}</Text>
                  <View>
                    <TextField
                      label={t('emailAdress')}
                      fontSize={16}
                      maxLenght={50}
                      onChangeText={text => setEmail(text)}
                      baseColor={ColorSet.grey}
                      tintColor={ColorSet.red}
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
                <Button themeColor onPress={() => sendOtp()}>
                  {t('button_sendInstructions')}
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
                <H1>
                  {t('h1_accountCreated')}.{'\n'}
                  {t('h1_confirmEmail')}
                </H1>
              </View>
              <View style={[appStyle.flex1, appStyle.jcSpaceBetween]}>
                <View
                  style={[
                    appStyle.flex1,
                    appStyle.aiCenter,
                    appStyle.jcCenter,
                  ]}>
                  <Image style={[styles.messageStyle]} source={Icons.message} />
                  <Text style={styles.desStyle}>
                    {t('text_infoAboutAccount')}
                  </Text>
                </View>
              </View>
              <View style={styles.buttonStyle}>
                <Button themeColor onPress={() => sendOtp()}>
                  {t('button_resendInstructions')}
                </Button>
              </View>
              <View style={styles.buttonStyle}>
                <Button
                  themeColor
                  onPress={() => navigation.navigate(Screen.NewPassWord)}>
                  {t('button_procceedToOTP')}
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

export default ForgotPassword;

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
  messageStyle: {
    resizeMode: 'contain',
    width: 38,
    height: 50,
  },
  logoDetail: {
    resizeMode: 'contain',
    width: 173,
    height: 16,
  },
});
