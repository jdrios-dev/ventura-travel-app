import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  FlatList,
  Text,
} from 'react-native';

import appStyle from '../../../styles/appStyle';
import {Icons, Images} from '../../../constants';
import {ColorSet, FamilySet} from '../../../styles';
import {Header, NewMessage} from '../../../components/index';
import {screenWidth} from '../../../styles/screenSize';
import {Screen} from '../../../constants/screens/screens';
import {useTranslation} from 'react-i18next';
import {getPassengerList} from '../../../networking/Services';
import Loader from '../../../components/Loader';
import {checkIsOfflineMode} from '../../../utils/helper';
import {
  TABLE_OFFLINE_NAME,
  getValueForKey,
} from '../../../networking/DBConection';
import {DbKeys} from '../../../constants/screens/dbKeys';
const PassengerList: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  const isOfflineMode = checkIsOfflineMode(route);

  const {t} = useTranslation();
  const [passengers, setPassenger] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const renderItem = ({item}) => (
    <NewMessage
      onPressIcon={
        isOfflineMode
          ? () => null
          : () => navigation.navigate(Screen.PassengerInfo, {id: item.id})
      }
      image={Images.dummyTwo}
      name={item.firstName + ' ' + item.lastName}
      icon={isOfflineMode ? null : Icons.arrowRightRed}
    />
  );
  const getPassengers = async () => {
    if (!isOfflineMode) {
      setLoading(true);
      const response = await getPassengerList();
      setLoading(false);
      if (response) {
        setPassenger(response);
      }
    }
    if (isOfflineMode) {
      await getValueForKey(
        DbKeys.travelersList,
        setPassenger,
        TABLE_OFFLINE_NAME,
      );
    }
  };

  useEffect(() => {
    getPassengers();
  }, []);
  return (
    <SafeAreaView
      testID="myTripTcTravelerList"
      style={[appStyle.safeContainer]}>
      <Loader isLoading={loading} layout={'outside'} />
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.goBack()}
        title={t('title_passenger-list')}
        // headerIconTwo={Icons.notification}
        // onPressheaderIconTwo={() => navigation.navigate(Screen.Notification)}
      />
      <View style={[appStyle.ph25, appStyle.flex1, appStyle.pt30]}>
        {passengers?.length === 0 && !loading ? (
          <View
            style={[
              appStyle.p25,
              appStyle.flex1,
              appStyle.aiCenter,
              appStyle.jcCenter,
            ]}>
            <Text style={styles.titleTextStyle}>
              {t('text_no-passenger-available')}
            </Text>
          </View>
        ) : (
          <FlatList
            data={passengers}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default PassengerList;

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
  titleTextStyle: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
    color: ColorSet.secondary,
    paddingBottom: 5,
  },
});
