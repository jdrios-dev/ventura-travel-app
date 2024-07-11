import React, {useEffect, useState} from 'react';
import {StyleSheet, SafeAreaView, StatusBar} from 'react-native';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';

import appStyle from '../../../styles/appStyle';
import {Icons} from '../../../constants';
import {ColorSet} from '../../../styles';
import {Header} from '../../../components/index';
import {Screen} from '../../../constants/screens/screens';
import {Eula} from '../../../constants';
import Markdown from 'react-native-markdown-display';

const EULA: React.FC<{navigation: any}> = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [eulaText, setEulaText] = useState('');

  useEffect(() => {
    setEulaText(Eula[i18n.language]);
  }, [i18n.language]);

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.goBack()}
        title={t('Touchable_EULA')}
        headerIconOne={Icons.notification}
        onPressheaderIconOne={() => navigation.navigate(Screen.Notification)}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={[
          appStyle.scrollContainer,
          styles.paddingHorizontal,
        ]}>
        <Markdown style={styles}>{eulaText}</Markdown>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default EULA;

const styles = StyleSheet.create({
  paddingHorizontal: {
    paddingHorizontal: 10,
  },
  text: {
    color: ColorSet.textBase,
  },
});
