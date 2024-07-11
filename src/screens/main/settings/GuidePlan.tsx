import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  FlatList,
  Text,
  StyleSheet,
} from 'react-native';

import appStyle from '../../../styles/appStyle';
import {Icons} from '../../../constants';
import {ColorSet, FamilySet} from '../../../styles';
import {Header, NewMessage} from '../../../components/index';
import {Screen} from '../../../constants/screens/screens';
import {useTranslation} from 'react-i18next';
import {getDays} from '../../../networking/Services';
import Loader from '../../../components/Loader';
import {checkIsOfflineMode} from '../../../utils/helper';
import {
  TABLE_OFFLINE_NAME,
  getValueForKey,
} from '../../../networking/DBConection';
import {DayIndex, DbKeys} from '../../../constants/screens/dbKeys';

const RenderItem = ({item, index, navigation, t, isOfflineMode}) => {
  const [isAvailableOffline, setIsAvailableOffline] = useState(null);

  const checkAvailability = useCallback(async () => {
    await getValueForKey(
      `day${item.day_number}` as DayIndex,
      setIsAvailableOffline,
      TABLE_OFFLINE_NAME,
    );
  }, [item.day_number]);

  useEffect(() => {
    checkAvailability();
  }, [checkAvailability]);

  if (isOfflineMode) {
    return (
      <NewMessage
        testId={`guidePlanDayNumber.${index + 1}`}
        onPressIcon={
          isAvailableOffline
            ? () => navigation.navigate(Screen.DayDetails, {item})
            : () => null
        }
        name={t('text_day-number', {dayNumber: item?.day_number})}
        icon={isAvailableOffline ? Icons.arrowRightRed : null}
      />
    );
  }

  return (
    <NewMessage
      testId={`guidePlanDayNumber.${index + 1}`}
      onPressIcon={() => navigation.navigate(Screen.DayDetails, {item})}
      name={t('text_day-number', {dayNumber: item?.day_number})}
      icon={Icons.arrowRightRed}
    />
  );
};

const GuidePlan: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  const isOfflineMode = checkIsOfflineMode(route);

  const {t} = useTranslation();
  const [days, setDays] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const getDayList = async () => {
    if (!isOfflineMode) {
      setLoading(true);
      const response = await getDays();
      setLoading(false);
      if (response) {
        return setDays(response);
      }
    }
    if (isOfflineMode) {
      getValueForKey(DbKeys.itineraryTc, setDays, TABLE_OFFLINE_NAME);
    }
  };
  useEffect(() => {
    getDayList();
  }, []);
  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <Loader isLoading={loading} layout={'outside'} />
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header showProfile title={t('Touchable_GuidePlan')} />
      <View style={[appStyle.p20, appStyle.flex1]}>
        {days?.length === 0 && !loading ? (
          <View
            style={[
              appStyle.p25,
              appStyle.flex1,
              appStyle.aiCenter,
              appStyle.jcCenter,
            ]}>
            <Text style={styles.titleTextStyle}>
              {t('text_no-days-available')}
            </Text>
          </View>
        ) : (
          <FlatList
            data={days}
            renderItem={({item, index}) => (
              <RenderItem
                item={item}
                index={index}
                navigation={navigation}
                t={t}
                isOfflineMode={isOfflineMode}
              />
            )}
            keyExtractor={item => item.day_number}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
export default GuidePlan;
const styles = StyleSheet.create({
  titleTextStyle: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
    color: ColorSet.secondary,
    paddingBottom: 5,
  },
});
