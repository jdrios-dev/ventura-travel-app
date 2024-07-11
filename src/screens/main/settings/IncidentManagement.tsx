import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import appStyle from '../../../styles/appStyle';
import {Icons} from '../../../constants';
import {ColorSet, FamilySet} from '../../../styles';
import {Header, IncidentView, Button} from '../../../components/index';
import {screenWidth} from '../../../styles/screenSize';
import {Screen} from '../../../constants/screens/screens';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {selectRole} from '../../../redux/common/common.selectors';
const IncidentManagement: React.FC<{navigation: any}> = ({navigation}) => {
  const userRole = useSelector(selectRole);
  const {t} = useTranslation();
  const [signedState, setSignedState] = React.useState(true);
  const [activeState, setActiveState] = React.useState(1);

  const updateState = type => {
    if (activeState === 1 && type === 2) {
      setSignedState(false);
      setActiveState(2);
    }
    if (activeState === 2 && type === 1) {
      setSignedState(true);
      setActiveState(1);
    }
  };

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.goBack()}
        title={t('Touchable_IncidentManagement')}
        // headerIconTwo={Icons.notification}
        // onPressheaderIconTwo={() => navigation.navigate(Screen.Notification)}
      />
      <View style={[appStyle.row, appStyle.p25]}>
        <TouchableOpacity
          onPress={() => updateState(1)}
          style={[
            styles.tabStyle,
            {
              borderBottomColor: signedState
                ? ColorSet.theme
                : ColorSet.grayLight,
            },
          ]}>
          <Text
            style={[
              styles.tabLableStyle,
              {color: signedState ? ColorSet.theme : ColorSet.grey},
            ]}>
            {t('local_common_notSignedYet')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => updateState(2)}
          style={[
            styles.tabStyle,
            {borderBottomColor: signedState ? ColorSet.grey : ColorSet.theme},
          ]}>
          <Text
            style={[
              styles.tabLableStyle,
              {color: signedState ? ColorSet.grey : ColorSet.theme},
            ]}>
            {t('local_common_signed')}
          </Text>
        </TouchableOpacity>
      </View>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <View style={[appStyle.ph25, appStyle.flex1]}>
          {activeState === 1 ? (
            <View style={appStyle.flex1}>
              <IncidentView
                onPress={() => navigation.navigate(Screen.SignAnIncident)}
                title="Trip to Paraguay"
                startDate="02 February 2022"
                incidentDate="13 February 2022"
                incidentPlace="The great lake of Timaktu"
                tc="John Doe"
                traveler="Samantha"
                signedBy="TC"
              />
              <IncidentView
                onPress={() => navigation.navigate(Screen.SignAnIncident)}
                title="Trip to Paraguay"
                startDate="02 February 2022"
                incidentDate="13 February 2022"
                incidentPlace="The great lake of Timaktu"
                tc="John Doe"
                traveler="Samantha"
                signedBy="TC"
              />
            </View>
          ) : (
            <View style={appStyle.flex1}>
              <IncidentView
                onPress={() => navigation.navigate(Screen.SignedIncident)}
                title="Trip to Paraguay"
                startDate="02 February 2022"
                incidentDate="13 February 2022"
                incidentPlace="The great lake of Timaktu"
                tc="John Doe"
                traveler="Samantha"
                signedBy="TC"
              />
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
      {userRole === 'TC' && (
        <View style={appStyle.p20}>
          <Button onPress={() => navigation.navigate(Screen.CreateNewIncident)}>
            {t('screen_common_addIncident')}
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
};

export default IncidentManagement;

const styles = StyleSheet.create({
  tabLableStyle: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
  },
  tabStyle: {
    width: screenWidth.width45,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    flex: 1,
  },
});
