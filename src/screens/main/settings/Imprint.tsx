import React, {useEffect, useState} from 'react';
import appStyle from '../../../styles/appStyle';
import {Icons} from '../../../constants';
import {ColorSet} from '../../../styles';
import {Header} from '../../../components/index';
import {Screen} from '../../../constants/screens/screens';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import HtmlWebView from '../../../components/WebView';
import {useTranslation} from 'react-i18next';
import {imprints} from '../../../constants/legalTexts';
import {SafeAreaView, StatusBar} from 'react-native';

const Imprint: React.FC<{navigation: any}> = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [imprintText, setImprintText] = useState('');
  function getObjKey(value: string) {
    Object.keys(imprints).find(key => {
      if (key === value) {
        setImprintText(imprints[key]);
        return;
      }
    });
  }
  useEffect(() => {
    getObjKey(i18n.language);
  }, [i18n.language]);
  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.goBack()}
        title={t('Touchable_Imprint')}
        headerIconOne={Icons.notification}
        onPressheaderIconOne={() => navigation.navigate(Screen.Notification)}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <HtmlWebView htmlCode={imprintText} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Imprint;
