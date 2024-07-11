import React, {useEffect, useState} from 'react';
import {View, SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import appStyle from '../../../styles/appStyle';
import {Icons} from '../../../constants';
import {ColorSet} from '../../../styles';
import {Header} from '../../../components/index';
import {Screen} from '../../../constants/screens/screens';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import {privacyContentData} from '../../../constants/legalTexts';
import Markdown from 'react-native-markdown-display';

const PrivacyPolicy: React.FC<{navigation: any}> = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [privacyText, setPrivacyText] = useState('');

  useEffect(() => {
    setPrivacyText(privacyContentData[i18n.language]);
  }, [i18n.language]);

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.goBack()}
        title={t('Touchable_PrivacyPolicy')}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <View testID="privacyPolicyContainer" style={styles.container}>
          <Markdown style={styles}>{privacyText}</Markdown>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  text: {
    color: ColorSet.textBase,
  },
});

export default PrivacyPolicy;
