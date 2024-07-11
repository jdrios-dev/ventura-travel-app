import React from 'react';

import {SafeAreaView, StatusBar} from 'react-native';

import {ColorSet, appStyle} from '../../../styles';
import {Header, FlightComponent} from '../../../components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {t} from 'i18next';

const FlightDetailScreen: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  const data = route?.params?.data;
  const name = route?.params?.name;
  const ticket = route?.params?.ticket;

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.pop()}
        title={t('title_flights-details')}
      />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
        <FlightComponent data={data} name={name} ticket={ticket} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default FlightDetailScreen;
