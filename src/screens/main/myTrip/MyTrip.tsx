import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';

import appStyle from '../../../styles/appStyle';
import {ColorSet, FamilySet} from '../../../styles';
import {Header, TripView} from '../../../components/index';
import {screenWidth} from '../../../styles/screenSize';
import {Screen} from '../../../constants/screens/screens';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {selectItinerary} from '../../../redux/common/common.selectors';
import dateFormator from '../../../components/formatesManager/DateFormateHandler';
import {Icons} from '../../../constants';
import {DbKeys} from '../../../constants/screens/dbKeys';
import {
  TABLE_OFFLINE_NAME,
  getValueForKey,
} from '../../../networking/DBConection';
import {checkIsOfflineMode} from '../../../utils/helper';
const MyTrip: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  const itinerary: any = useSelector(selectItinerary);
  const isOfflineMode = checkIsOfflineMode(route);
  const [_, setOfflineItinerary] = useState();
  const {t} = useTranslation();
  const [itineraryState, setItineraryState] = React.useState(true);
  const [activeState, setActiveState] = React.useState(1);
  const {upComingItinerary, completedItinerary} = itinerary;

  const updateState = type => {
    if (activeState === 1 && type === 2) {
      setItineraryState(false);
      setActiveState(2);
    }
    if (activeState === 2 && type === 1) {
      setItineraryState(true);
      setActiveState(1);
    }
  };
  const renderItem = ({item}) => {
    return (
      <TripView
        onPress={() => navigation.navigate(Screen.TripDetail, {items: item})}
        date={dateFormator(item?.date, 'd / MM')}
        day={t('text_day-number', {dayNumber: item.dayNumber})}
        title={item?.title}
        messsage={item?.description?.replace(/(\r\n|\n|\r)/gm, '')}
      />
    );
  };

  const getOfflineItinerary = async () => {
    await getValueForKey(
      DbKeys.itinerary,
      setOfflineItinerary,
      TABLE_OFFLINE_NAME,
    );
  };
  useEffect(() => {
    getOfflineItinerary();
  }, []);

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header title={t('screen_common_MyTrip')} showProfile />
      <View style={[appStyle.row, appStyle.p25]}>
        <TouchableOpacity
          onPress={() => updateState(1)}
          style={[
            styles.tabStyle,
            {
              borderBottomColor: itineraryState
                ? ColorSet.theme
                : ColorSet.grayLight,
            },
          ]}>
          <Text
            style={[
              styles.tabLableStyle,
              {color: itineraryState ? ColorSet.theme : ColorSet.grey},
            ]}>
            {t('text_upcoming')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => updateState(2)}
          style={[
            styles.tabStyle,
            {
              borderBottomColor: itineraryState
                ? ColorSet.grey
                : ColorSet.theme,
            },
          ]}>
          <Text
            style={[
              styles.tabLableStyle,
              {color: itineraryState ? ColorSet.grey : ColorSet.theme},
            ]}>
            {t('local_common_completed')}
          </Text>
        </TouchableOpacity>
      </View>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <View style={[appStyle.ph25, appStyle.flex1]}>
          {activeState === 1 ? (
            <FlatList
              data={upComingItinerary}
              showsHorizontalScrollIndicator={false}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
          ) : (
            <FlatList
              data={completedItinerary}
              showsHorizontalScrollIndicator={false}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
          )}
        </View>
      </KeyboardAwareScrollView>
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => navigation.navigate(Screen.FlightScreen)}>
        <View style={styles.fabContainer}>
          <Image source={Icons.flightRoundedWhite} style={styles.fabIcon} />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MyTrip;

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
  fabButton: {position: 'absolute', bottom: 0, right: 0, margin: 20},
  fabContainer: {
    backgroundColor: ColorSet.theme,
    height: 60,
    width: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  fabIcon: {width: 35, height: 35},
});
