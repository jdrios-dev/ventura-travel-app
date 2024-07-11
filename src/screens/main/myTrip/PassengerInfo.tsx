import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import appStyle from '../../../styles/appStyle';
import {ColorSet, FamilySet} from '../../../styles';
import {Header} from '../../../components/index';
import {screenWidth} from '../../../styles/screenSize';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import {getSinglePassenger} from '../../../networking/Services';
import Loader from '../../../components/Loader';
import {compressString} from '../../../utils/helper';
import ExtrasTab from '../../../components/passengerInfo/ExtrasTab';
import HelpTab from '../../../components/passengerInfo/HelpTab';
import InformationTab from '../../../components/passengerInfo/InformationTab';
const PassengerInfo: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  const passengerId = route?.params?.id;
  const {t} = useTranslation();
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(false);
  const [passengerInfo, setPassengerInfo] = useState<any>('');
  const [emergencyContact, setEmergencyContact] = useState<any>('');
  const [addonsData, setAddonsData] = useState([]);

  const updateState = type => {
    setActiveTab(type);
  };
  const checkActiveTab = tab => {
    return tab === activeTab;
  };
  const sortByType = (a, b) => {
    if (a?.type > b?.type) {
      return 1;
    }
  };

  const getPassengerInfo = async () => {
    setLoading(true);
    const response = await getSinglePassenger(passengerId);

    setLoading(false);
    if (response) {
      setEmergencyContact(response?.emergencyContact);
      setPassengerInfo(response?.pax);
      setAddonsData(response?.pax?.extras?.sort(sortByType));
    }
  };

  useEffect(() => {
    getPassengerInfo();
  }, []);
  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <Loader isLoading={loading} layout={'outside'} />
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.goBack()}
        title={compressString(passengerInfo?.fullName, 20)}
      />

      <View style={[appStyle.row, appStyle.p25]}>
        <TouchableOpacity
          onPress={() => updateState(1)}
          style={[
            styles.tabStyle,
            {
              borderBottomColor: checkActiveTab(1)
                ? ColorSet.theme
                : ColorSet.grayLight,
            },
          ]}>
          <Text
            style={[
              styles.tabLableStyle,
              {color: checkActiveTab(1) ? ColorSet.theme : ColorSet.grey},
            ]}>
            {t('Touchable_Information')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => updateState(2)}
          style={[
            styles.tabStyle,
            {
              borderBottomColor: checkActiveTab(2)
                ? ColorSet.theme
                : ColorSet.grayLight,
            },
          ]}>
          <Text
            style={[
              styles.tabLableStyle,
              {color: checkActiveTab(2) ? ColorSet.theme : ColorSet.grey},
            ]}>
            {t('Touchable_EmergencyContact')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => updateState(3)}
          style={[
            styles.tabStyle,
            {
              borderBottomColor: checkActiveTab(3)
                ? ColorSet.theme
                : ColorSet.grayLight,
            },
          ]}>
          <Text
            style={[
              styles.tabLableStyle,
              {color: checkActiveTab(3) ? ColorSet.theme : ColorSet.grey},
            ]}>
            Extras
          </Text>
        </TouchableOpacity>
      </View>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <View style={[appStyle.ph25, appStyle.flex1]}>
          {activeTab === 1 && <InformationTab passengerInfo={passengerInfo} />}

          {activeTab === 2 && <HelpTab emergencyContact={emergencyContact} />}

          {activeTab === 3 && <ExtrasTab extras={addonsData} />}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default PassengerInfo;

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
