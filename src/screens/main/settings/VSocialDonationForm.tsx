import {SafeAreaView, StatusBar} from 'react-native';
import React from 'react';
import {WebView} from 'react-native-webview';
import {Header} from '../../../components';
import {ColorSet, appStyle} from '../../../styles';
import {useTranslation} from 'react-i18next';

const VSocialDonationForm = ({navigation}) => {
  const {t} = useTranslation();
  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        title={t('button_donate-now')}
        back
        onPressBack={() => navigation.goBack()}
      />
      <WebView
        originWhitelist={['*']}
        source={{uri: 'https://form.jotform.com/230752656233354'}}
        style={{marginTop: 20}}
      />
    </SafeAreaView>
  );
};

export default VSocialDonationForm;
