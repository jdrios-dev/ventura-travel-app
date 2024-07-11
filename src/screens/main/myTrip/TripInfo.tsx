import React from 'react';
import {View, SafeAreaView, StatusBar} from 'react-native';

import appStyle from '../../../styles/appStyle';
import {Icons} from '../../../constants';
import {ColorSet} from '../../../styles';
import {Header, IconWithText} from '../../../components/index';
import {Screen} from '../../../constants/screens/screens';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
const TripInfo: React.FC<{navigation: any}> = ({navigation}) => {
  const {t} = useTranslation();
  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.goBack()}
        title={t('local_common_TripInformation')}
        headerIconOne={Icons.notification}
        onPressheaderIconOne={() => navigation.navigate(Screen.Notification)}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <View style={[appStyle.ph25, appStyle.pt30, appStyle.flex1]}>
          <IconWithText
            onPressIcon={() => navigation.navigate(Screen.MoreInformation)}
            icon={Icons.info}
            title={t('h1_moreInformation')}
          />
          <IconWithText
            onPressIcon={() => navigation.navigate(Screen.EmergencyContact)}
            icon={Icons.call}
            title={t('button_emergencyContact')}
          />
          <IconWithText
            onPressIcon={() => navigation.navigate(Screen.YourGuide)}
            icon={Icons.guide}
            title={t('Touchable_yourGuide')}
          />
          <IconWithText
            onPressIcon={() => navigation.navigate(Screen.Summary)}
            icon={Icons.summary}
            title={t('Touchable_summaryOfTrip')}
          />
          <IconWithText
            onPressIcon={() => navigation.navigate(Screen.Faq)}
            icon={Icons.faq}
            title={t('Touchable_frequentlyAskQuestions')}
          />
          <IconWithText
            onPressIcon={() => navigation.navigate(Screen.Health)}
            icon={Icons.health}
            title={t('local_common_healthForm')}
          />
          <IconWithText
            onPressIcon={() => navigation.navigate(Screen.Engagement)}
            icon={Icons.engagement}
            title={t('local_common_ourEngaement')}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default TripInfo;
