import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';

import appStyle from '../../../styles/appStyle';
import Button from '../../../components/Button';
import {Icons, Keys} from '../../../constants';
import {ColorSet, FamilySet} from '../../../styles';
import {Header} from '../../../components/index';
import {Screen} from '../../../constants/screens/screens';
import {TextField} from 'rn-material-ui-textfield';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/common/common.selectors';
import {changePassword} from '../../../networking/Services';
import Loader from '../../../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Codes} from '../../../constants/codes';
import {useTranslation} from 'react-i18next';
import {storeDataToStorage} from '../../../utils/storage';
import {Helper} from '../../../utils';
const AccountSetting: React.FC<{navigation: any}> = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const userdetails: any = useSelector(selectUser);
  const [loading, setloading] = React.useState(false);
  const [confirmPass, setConfirmPass] = React.useState(Icons.hide);
  const [pass, setPass] = React.useState(Icons.hide);
  const [oldPassword, setOldPass] = React.useState('');
  const [newPassword, setNewPass] = React.useState('');
  const [languageView, setLanguageView] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState('');
  const LanguageArray = [
    {title: 'English', id: 1, lang: 'en'},
    {title: 'German', id: 2, lang: 'de'},
    {title: 'French', id: 3, lang: 'fr'},
    {title: 'Spanish', id: 4, lang: 'es'},
    {title: 'Dutch', id: 5, lang: 'nl'},
  ];
  const selectLanguage = async (data: any) => {
    setSelectedLanguage(data.title);
    i18n.changeLanguage(data.lang);
    await storeDataToStorage(Keys.selectedLanguage, data.lang);
    setLanguageView(false);
  };
  const showPassword = type => {
    if (type === 1) {
      pass === Icons.hide ? setPass(Icons.show) : setPass(Icons.hide);
    } else {
      confirmPass === Icons.hide
        ? setConfirmPass(Icons.show)
        : setConfirmPass(Icons.hide);
    }
  };
  const passwordChange = async () => {
    const params = {
      oldPassword,
      newPassword,
    };
    setloading(true);
    const response = await changePassword(params);
    setloading(false);
    if (response.statusCode === Codes.SUCCESS) {
      Helper.showToast(response.message);
      navigation.goBack();
    } else if (response.statusCode === Codes.UNAUTHORIZED) {
      await AsyncStorage.removeItem(Keys.userDetails);
      navigation.replace(Screen.LoginScreen);
    } else if (response.statusCode === Codes.iNVALID_PASS) {
      Helper.showToast(t('error_oldPasswordIsWrong'));
    } else if (response.statusCode === Codes.BAD_REQUEST) {
      Helper.showToast(t('error_oldAndNewPasswordLongerOrEqaulTo'));
    }
  };
  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        testId="accountSettingTitle"
        back
        onPressBack={() => navigation.goBack()}
        title={t('screen_common_accountSettings')}
        headerIconOne={Icons.notification}
        onPressheaderIconOne={() => navigation.navigate(Screen.Notification)}
      />
      <Loader isLoading={loading} layout={'outside'} />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <View
          testID="accountSettingContainer"
          style={[appStyle.p25, appStyle.flex1]}>
          <TextField
            label={t('emailAdress')}
            fontSize={16}
            disabled={true}
            value={userdetails.email}
            baseColor={ColorSet.grey}
            tintColor={ColorSet.red}
          />
          <TextField
            label={t('oldPassword')}
            fontSize={16}
            baseColor={ColorSet.grey}
            tintColor={ColorSet.red}
            secureTextEntry={pass === Icons.hide ? true : false}
            onChangeText={text => setOldPass(text)}
            renderRightAccessory={() => (
              <TouchableOpacity onPress={() => showPassword(1)}>
                <Image source={pass} style={styles.eyeStyle} />
              </TouchableOpacity>
            )}
          />
          <TextField
            label={t('newPassword')}
            fontSize={16}
            baseColor={ColorSet.grey}
            tintColor={ColorSet.red}
            secureTextEntry={confirmPass === Icons.hide ? true : false}
            onChangeText={text => setNewPass(text)}
            renderRightAccessory={() => (
              <TouchableOpacity onPress={() => showPassword(2)}>
                <Image source={confirmPass} style={styles.eyeStyle} />
              </TouchableOpacity>
            )}
          />
          <View style={[appStyle.flex1, appStyle.jcSpaceBetween]}>
            <KeyboardAwareScrollView
              keyboardShouldPersistTaps="always"
              contentContainerStyle={appStyle.scrollContainer}>
              <View style={[appStyle.mt40, appStyle.jcCenter]}>
                <TouchableOpacity
                  testID="accountSettingInputDropdown"
                  onPress={() => setLanguageView(!languageView)}
                  style={[styles.selectLangStyle, appStyle.aiCenter]}>
                  <Text style={styles.selectLangTitle}>
                    {selectedLanguage === ''
                      ? t('button_selectLanguage')
                      : selectedLanguage}
                  </Text>
                  <Image
                    style={[styles.arrowDownStyle]}
                    source={languageView ? Icons.arrowUp : Icons.arrowDown}
                  />
                </TouchableOpacity>
                {languageView && (
                  <View style={[appStyle.flex1, appStyle.mv5]}>
                    {LanguageArray.map((data, index) => {
                      return (
                        <TouchableOpacity
                          testID={`accountSettingLanguage.${data.title}`}
                          onPress={() => selectLanguage(data)}
                          key={index}
                          style={appStyle.pv10}>
                          <Text style={{color: ColorSet.black}}>
                            {data.title}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            </KeyboardAwareScrollView>
          </View>
          {/* <View style={styles.pushTopViewStyle}>
                        <Text style={styles.pushStyle}>{t('text_pushNotification')}</Text>
                        <ToggleSwitch
                            isOn={toggleButton}
                            onColor={ColorSet.theme}
                            offColor={ColorSet.grey}
                            labelStyle={{ display: 'none' }}
                            size="small"
                            onToggle={() => setToggleButton(!toggleButton)}
                        />
                    </View> */}
        </View>
      </KeyboardAwareScrollView>
      <View style={appStyle.p20}>
        <Button onPress={() => passwordChange()}>{t('button_save')}</Button>
      </View>
    </SafeAreaView>
  );
};

export default AccountSetting;

const styles = StyleSheet.create({
  pushTopViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  pushStyle: {
    color: ColorSet.grey,
    fontSize: 16,
    fontFamily: FamilySet.regular,
  },
  eyeStyle: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  selectLangTitle: {
    color: ColorSet.grey,
    fontFamily: FamilySet.regular,
    fontSize: 16,
  },
  selectLangStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: ColorSet.grey,
    paddingBottom: 10,
  },
  arrowDownStyle: {
    resizeMode: 'contain',
    width: 20,
    height: 15,
  },
  logoDetail: {
    resizeMode: 'contain',
    width: 173,
    height: 16,
  },
});
