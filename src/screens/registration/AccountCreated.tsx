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
import {screenHeight} from '../../styles/screenSize';
import {Screen} from '../../constants/screens/screens';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
const AccountCreated: React.FC<{navigation: any}> = ({navigation}) => {
  const {t} = useTranslation();
  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <ImageBackground style={[appStyle.flex1]} source={Images.bgImage}>
        <StatusBar hidden />
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={appStyle.scrollContainer}>
          <View style={appStyle.halfPageView}>
            <View style={appStyle.pv30}>
              <H1>{t('h1_accountActivated')}</H1>
            </View>
            <View style={[appStyle.flex1, appStyle.jcSpaceBetween]}>
              <View
                style={[appStyle.flex1, appStyle.aiCenter, appStyle.jcCenter]}>
                <Image style={[styles.tickStyle]} source={Icons.tick} />
                <Text style={styles.desStyle}>{t('text_congratulations')}</Text>
              </View>
            </View>
            <View style={styles.buttonStyle}>
              <Button
                themeColor
                onPress={() => navigation.replace(Screen.LoginScreen)}>
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
        </KeyboardAwareScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default AccountCreated;

const styles = StyleSheet.create({
  desStyle: {
    color: ColorSet.grey,
    fontSize: 16,
    fontFamily: FamilySet.regular,
    padding: 20,
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
});
