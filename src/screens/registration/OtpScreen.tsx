import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';

import appStyle from '../../styles/appStyle';
import Button from '../../components/Button';
import {Icons, Images} from '../../constants';
import {ColorSet, FamilySet} from '../../styles';
import {H1} from '../../components/index';
import {screenHeight, screenWidth} from '../../styles/screenSize';
import {Screen} from '../../constants/screens/screens';
import {requestPassword} from '../../networking/Services';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Loader from '../../components/Loader';
import {Codes} from '../../constants/codes';
import {useTranslation} from 'react-i18next';
import {Helper} from '../../utils';
const OtpScreen: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  const {t} = useTranslation();
  const [loading, setLoadig] = React.useState(false);
  const confirmOtp = code => {
    navigation.replace(Screen.NewPassWord, {
      otpcode: code,
      email: route?.params?.email,
    });
  };
  const sendOtp = async () => {
    const params = {
      email: route?.params?.email,
    };
    setLoadig(true);
    const response = await requestPassword(params);
    setLoadig(false);
    if (response.statusCode === Codes.BAD_REQUEST) {
      Helper.showToast(t('error_enterEmail'));
    } else if (response.statusCode === Codes.SUCCESS) {
      Helper.showToast(response.message);
    }
  };
  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <ImageBackground style={[appStyle.flex1]} source={Images.bgImage}>
        <StatusBar hidden />
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={appStyle.scrollContainer}>
          <View style={appStyle.halfPageView}>
            <View style={appStyle.pv30}>
              <H1>
                {t('text_condeSentToEmail')}.{'\n'}
              </H1>
            </View>
            <View style={[appStyle.flex1, appStyle.jcSpaceBetween]}>
              <Loader isLoading={loading} layout={'outside'} />
              <View
                style={[appStyle.flex1, appStyle.aiCenter, appStyle.jcCenter]}>
                <Image style={[styles.lockStyle]} source={Icons.lock} />
                <Text style={styles.desStyle}>
                  {t('text_enterCodeRecievedInEmail')}
                </Text>
                <View>
                  <OTPInputView
                    placeholderCharacter="0"
                    placeholderTextColor={ColorSet.grey}
                    style={styles.otpContainer}
                    pinCount={6}
                    codeInputFieldStyle={styles.otp}
                    onCodeFilled={codeEntered => confirmOtp(codeEntered)}
                  />
                </View>
              </View>
            </View>
            <View style={styles.buttonStyle}>
              <Button themeColor onPress={() => sendOtp()}>
                {t('button_resendCode')}
              </Button>
              <View style={[appStyle.aiCenter, appStyle.pb20]}>
                <Image
                  style={[styles.logoDetail]}
                  source={Images.logoDetailBlack}
                />
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  desStyle: {
    color: ColorSet.grey,
    fontSize: 16,
    fontFamily: FamilySet.regular,
    padding: 20,
    textAlign: 'center',
  },
  otp: {
    width: 25,
    height: 50,
    fontFamily: FamilySet.regular,
    fontSize: 16,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 2,
    color: ColorSet.grey,
    borderBottomColor: ColorSet.grey,
  },
  otpContainer: {
    height: 52,
    width: screenWidth.width50,
  },
  buttonStyle: {
    height: screenHeight.height15,
    justifyContent: 'space-between',
  },
  lockStyle: {
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
