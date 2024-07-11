import React, {useEffect} from 'react';
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
import {Icons, Images, Keys} from '../../constants';
import {ColorSet, FamilySet} from '../../styles';
import {H1} from '../../components/index';
import {screenHeight} from '../../styles/screenSize';
import {Screen} from '../../constants/screens/screens';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import {getDataFromStorage, storeDataToStorage} from '../../utils/storage';
import {Helper} from '../../utils';
const LanguageSelection: React.FC<{navigation: any}> = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [languageView, setLanguageView] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState('');
  const [savedLangauge, setSaveLanguage] = React.useState('');
  const [lang, setLang] = React.useState('');
  const LanguageArray = [
    {title: 'English', id: 1, lang: 'en'},
    {title: 'German', id: 2, lang: 'de'},
    {title: 'French', id: 3, lang: 'fr'},
    {title: 'Spanish', id: 4, lang: 'es'},
    {title: 'Dutch', id: 5, lang: 'nl'},
  ];
  const selectLanguage = async (data: any) => {
    setLang(data.lang);
    setSelectedLanguage(data.title);
    i18n.changeLanguage(data.lang);
    setLanguageView(false);
  };
  const GoToLogin = async () => {
    const language = lang ? lang : savedLangauge;
    await storeDataToStorage(Keys.selectedLanguage, language);
    selectedLanguage
      ? navigation.replace(Screen.LoginScreen)
      : Helper.showToast(t('text_select-language-continue'));
  };
  const getLang = async () => {
    const language = await getDataFromStorage(Keys.selectedLanguage);
    setSaveLanguage(language);
  };
  useEffect(() => {
    getLang();
  }, []);
  return (
    <SafeAreaView
      testID="languageSelectionScreen"
      style={[appStyle.safeContainer]}>
      <ImageBackground style={[appStyle.flex1]} source={Images.bgImage}>
        <StatusBar hidden />
        <View style={[appStyle.flex1]}>
          <View style={[appStyle.halfPageView, appStyle.pt30]}>
            <H1>{t('button_selectLanguage')}</H1>
            <View
              style={[appStyle.flex1, appStyle.jcSpaceBetween, appStyle.pt30]}>
              <KeyboardAwareScrollView
                keyboardShouldPersistTaps="always"
                contentContainerStyle={appStyle.scrollContainer}>
                <View style={[appStyle.flex1]}>
                  <TouchableOpacity
                    testID="langSelectionDropdown"
                    onPress={() => setLanguageView(!languageView)}
                    style={styles.selectLangStyle}>
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
                            testID={`langSelectionDropdown.${data.title}`}
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
            <View style={styles.buttonStyle}>
              <Button
                testID="langSelectNextButton"
                themeColor
                onPress={() => GoToLogin()}>
                {t('button_Next')}
              </Button>
              <View style={[appStyle.aiCenter, appStyle.pb20]}>
                <Image
                  style={[styles.logoDetail]}
                  source={Images.logoDetailBlack}
                />
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default LanguageSelection;

const styles = StyleSheet.create({
  buttonStyle: {
    height: screenHeight.height20,
    justifyContent: 'space-between',
  },
  selectLangTitle: {
    color: ColorSet.grey,
    fontFamily: FamilySet.regular,
    fontSize: 16,
  },
  selectLangStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
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
