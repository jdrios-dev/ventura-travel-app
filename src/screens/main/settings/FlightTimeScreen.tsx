import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Linking,
} from 'react-native';

import appStyle from '../../../styles/appStyle';
import {ColorSet, FamilySet} from '../../../styles';
import {Header} from '../../../components/index';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import Loader from '../../../components/Loader';
import {getFlightReachability} from '../../../networking/Services';
import {checkIsOfflineMode} from '../../../utils/helper';
import {
  TABLE_OFFLINE_NAME,
  getValueForKey,
} from '../../../networking/DBConection';
import {DbKeys} from '../../../constants/screens/dbKeys';
const FlightTimeScreen: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  const isOfflineMode = checkIsOfflineMode(route);

  const [isLoading, setIsloading] = useState(false);
  const [flightArray, setFlightArray] = useState([]);

  const {t} = useTranslation();
  const makeCall = number => {
    Linking.openURL(`tel:${number}`);
  };

  const getReachabilityFlight = useCallback(async () => {
    if (!isOfflineMode) {
      setIsloading(true);
      const res = await getFlightReachability();
      if (res) {
        setFlightArray(res);
      }
      setIsloading(false);
    }
    if (isOfflineMode) {
      await getValueForKey(
        DbKeys.flightTime,
        setFlightArray,
        TABLE_OFFLINE_NAME,
      );
    }
  }, [isOfflineMode]);

  useEffect(() => {
    getReachabilityFlight();
  }, [getReachabilityFlight]);

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.goBack()}
        title={t('Touchable_flightTimeReachability')}
        // headerIconTwo={Icons.notification}
        // onPressheaderIconTwo={() => navigation.navigate(Screen.Notification)}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <View style={[appStyle.p25, appStyle.flex1]}>
          {flightArray?.map((data, index) => {
            return (
              <View key={index} style={appStyle.pt10}>
                <Text style={styles.titleTextStyle}>{data?.name}</Text>
                <View style={appStyle.rowBtw}>
                  <Text style={styles.detailTextStyle}>{data?.phone}</Text>
                  <TouchableOpacity onPress={() => makeCall(data?.phone)}>
                    <Text style={styles.detailTextStyle}>
                      {t('text_Callnow')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </KeyboardAwareScrollView>
      <Loader isLoading={isLoading} layout={'outside'} />
    </SafeAreaView>
  );
};

export default FlightTimeScreen;

const styles = StyleSheet.create({
  titleTextStyle: {
    fontSize: 18,
    fontFamily: FamilySet.bold,
    color: ColorSet.theme,
    paddingBottom: 10,
  },
  detailTextStyle: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
    color: ColorSet.grey,
    paddingBottom: 5,
  },
});
