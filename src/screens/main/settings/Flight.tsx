import React, {useEffect, useState} from 'react';

import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from 'react-native';

import {Icons, Keys, Screen} from '../../../constants';
import {
  ColorSet,
  FamilySet,
  appStyle,
  screenHeight,
  screenWidth,
} from '../../../styles';
import {Header, Loader, NewMessage} from '../../../components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import isNetworkAvailable from '../../../utils/InternetConnection';
import {
  getFlightInformation,
  getFlightInformationPerPax,
} from '../../../networking/Services';
import {checkIsOfflineMode} from '../../../utils/helper';
import {
  TABLE_OFFLINE_NAME,
  getValueForKey,
} from '../../../networking/DBConection';
import {DbKeys} from '../../../constants/screens/dbKeys';
import {getDataFromStorage} from '../../../utils/storage';

const FlightScreen: React.FC<{navigation: any}> = ({navigation, route}) => {
  const isOfflineMode = checkIsOfflineMode(route);
  const [userRole, setUserRole] = useState('');

  async function getRole() {
    const role = await getDataFromStorage(Keys.userRole);
    setUserRole(role);
  }

  useEffect(() => {
    getRole();
  }, []);

  const {t} = useTranslation();

  const [isLoading, setIsloading] = useState<boolean>(false);
  const [flightArray, setFlightArray] = useState<Array<any>>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  async function getData() {
    if (await isNetworkAvailable()) {
      await getInformationFlight();
    }

    if (isOfflineMode) {
      await readOfflineFlights();
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const getInformationFlight = async () => {
    setIsloading(true);
    const role = await getDataFromStorage(Keys.userRole);

    const res =
      role === 'TC'
        ? await getFlightInformation()
        : await getFlightInformationPerPax();

    if (res?.length) {
      setFlightArray(res);
    }
    setIsloading(false);
    setRefreshing(false);
  };

  const readOfflineFlights = async () => {
    const role = await getDataFromStorage(Keys.userRole);
    await getValueForKey(
      role === 'TC' ? DbKeys.flights : DbKeys.flightsPax,
      setFlightArray,
      TABLE_OFFLINE_NAME,
    );
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getData();
  }, []);

  const RenderItem = ({item}) => {
    const name = `${item?.pax?.isTc ? 'TC - ' : ''} ${item?.pax?.fullName}`;
    return (
      <NewMessage
        onPressIcon={() =>
          navigation.navigate(Screen.FlightDetailScreen, {
            data: item?.itinerary || [],
            name: item?.pax?.fullName,
            ticket: item?.passengers?.[0]?.full_ticket_number,
          })
        }
        name={name}
        icon={Icons.arrowRightRed}
      />
    );
  };

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        title={t('title_departure-flights')}
        showProfile
        back={userRole === 'CLIENT'}
        onPressBack={() => navigation.goBack()}
      />
      <View style={[appStyle.p10, appStyle.flex1]}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {flightArray?.length ? (
            flightArray?.map((item: any) => (
              <RenderItem key={item?.pax?.fullName} item={item} />
            ))
          ) : (
            <View style={styles.nullDataView}>
              <Text style={styles.textStyle}>
                {t('text_data-is-not-available')}
              </Text>
            </View>
          )}
        </KeyboardAwareScrollView>
      </View>
      <Loader isLoading={isLoading} layout={'outside'} />
    </SafeAreaView>
  );
};

export default FlightScreen;

const styles = StyleSheet.create({
  titleTextStyle: {
    fontSize: 18,
    fontFamily: FamilySet.bold,
    color: ColorSet.theme,
    width: 320,
  },
  textStyle: {
    fontSize: 18,
    fontFamily: FamilySet.bold,
    color: ColorSet.grayMedium,
  },
  detailTextStyle: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
    color: ColorSet.grey,
    paddingBottom: 5,
  },
  buttonContainer: {
    width: screenWidth.width90,
    height: screenHeight.height10,
    backgroundColor: ColorSet.secondaryLight,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  addIcon: {
    tintColor: ColorSet.theme,
    height: 20,
    width: 15,
  },
  nullDataView: {
    width: screenWidth.width100,
    height: screenHeight.height100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
