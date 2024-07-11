import React from 'react';
import {StyleSheet, View, SafeAreaView, Text, StatusBar} from 'react-native';

import appStyle from '../../../styles/appStyle';
import Button from '../../../components/Button';
import {Icons} from '../../../constants';
import {ColorSet, FamilySet} from '../../../styles';
import {Header, IncidentView} from '../../../components/index';
import {Screen} from '../../../constants/screens/screens';

import {TextField} from 'rn-material-ui-textfield';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
const SignAnIncident: React.FC<{navigation: any}> = ({navigation}) => {
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
          {/* TODO: Remove the hardcoded text */}
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
          />
          <View>
            <TextField
              label={t('fullName')}
              fontSize={16}
              baseColor={ColorSet.grey}
              tintColor={ColorSet.red}
            />
            <TextField
              label={t('date')}
              fontSize={16}
              baseColor={ColorSet.grey}
              tintColor={ColorSet.red}
            />
            <TextField
              label={t('city')}
              fontSize={16}
              baseColor={ColorSet.grey}
              tintColor={ColorSet.red}
            />
            <Text style={styles.titleStyle}>
              {t('text_signingThisMeansYouConfirmAllInfo')}
            </Text>
            <Button onPress={() => navigation.goBack()}>
              {t('loginScreen_signUp_title')}
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignAnIncident;

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
    color: ColorSet.grey,
    paddingVertical: 10,
    textAlign: 'center',
  },
});