import React from 'react';
import {View, SafeAreaView, StatusBar} from 'react-native';

import appStyle from '../../../styles/appStyle';
import {Icons} from '../../../constants';
import {ColorSet} from '../../../styles';
import {Header, IncidentView} from '../../../components/index';
import {Screen} from '../../../constants/screens/screens';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
const SignedIncident: React.FC<{navigation: any}> = ({navigation}) => {
  const {t} = useTranslation();
  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.goBack()}
        title={t('incidentDeclaration')}
        headerIconOne={Icons.notification}
        onPressheaderIconOne={() => navigation.navigate(Screen.Notification)}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <View style={[appStyle.p25, appStyle.flex1]}>
          {/* TODO: Remove hardcoded text */}
          <IncidentView
            onPress={() => navigation.navigate(Screen.SignAnIncident)}
            title="Trip to Paraguay"
            startDate="02 February 2022"
            incidentDate="13 February 2022"
            incidentPlace="The great lake of Timaktu"
            tc="John Doe"
            traveler="Samantha"
            signedBy="TC"
            des="This include a snake had bitten the passenger named Samantha. and she was taken to a medical emergency near Timaktu and was cured by the magical powers of rose petals"
            signatureHistory="John Doe (TC)22 September 2002 at 12:34 pm"
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignedIncident;
