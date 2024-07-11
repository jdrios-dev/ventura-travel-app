import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  StatusBar,
  RefreshControl,
  ScrollView,
} from 'react-native';

import appStyle from '../../../styles/appStyle';
import {Icons} from '../../../constants';
import {ColorSet, FamilySet} from '../../../styles';
import {Header} from '../../../components';
import {Screen} from '../../../constants/screens/screens';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {screenHeight} from '../../../styles/screenSize';
import {useTranslation} from 'react-i18next';
import {getTripSummary} from '../../../networking/Services';
import Loader from '../../../components/Loader';
import isNetworkAvailable from '../../../utils/InternetConnection';
import dateFormator from '../../../components/formatesManager/DateFormateHandler';
import {getLocalizedDateFormat} from '../../../utils/datesFormater';
import {Language} from '../../../types/common.types';
const Summary: React.FC<{navigation: any}> = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [summaryArray, setSummaryArray] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  useEffect(() => {
    async function getData() {
      if (await isNetworkAvailable()) {
        await getSummary();
      }
      setFetching(false);
    }

    fetching && getData();
  }, [fetching]);

  const getSummary = async () => {
    setIsloading(true);

    const res = await getTripSummary();
    if (res) {
      setSummaryArray(res?.data);
    }
    setIsloading(false);
    setRefreshing(false);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setFetching(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.goBack()}
        title={t('screen_common_Summary')}
        headerIconOne={Icons.notification}
        onPressheaderIconOne={() => navigation.navigate(Screen.Notification)}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
        {summaryArray?.length > 0 ? (
          <View style={[appStyle.p20, appStyle.flex1]}>
            {summaryArray?.map((item, index) => {
              const value = summaryArray?.[index + 1];
              return (
                <View key={index} style={[appStyle.row, appStyle.pb5]}>
                  <Text style={styles.timeStyle}>
                    {dateFormator(
                      item?.date,
                      getLocalizedDateFormat(i18n.language as Language),
                    )}
                  </Text>
                  <View style={[appStyle.aiCenter, appStyle.ph10]}>
                    <View style={styles.circleStyle} />
                    {value && <View style={styles.dottedLineStyle} />}
                  </View>
                  <View style={[appStyle.flex1]}>
                    <View style={appStyle.row}>
                      <Text style={styles.dayStyle}>
                        {t('text_day-number', {dayNumber: item?.dayNumber})}
                      </Text>
                      <Text style={styles.dayStyle}> {item?.weekDay}</Text>
                    </View>
                    <Text style={styles.nameStyle}>{item?.title}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View
            style={[
              appStyle.pb20,
              appStyle.flex1,
              appStyle.aiCenter,
              appStyle.jcCenter,
            ]}>
            {/* <Text>Data Not Found</Text> */}
          </View>
        )}
      </KeyboardAwareScrollView>
      <Loader isLoading={isLoading} layout={'outside'} />
    </SafeAreaView>
  );
};

export default Summary;

const styles = StyleSheet.create({
  dottedLineStyle: {
    height: screenHeight.height10,
    borderLeftColor: ColorSet.dividerColor,
    borderLeftWidth: 1,
    borderStyle: 'solid',
    marginTop: 5,
  },
  circleStyle: {
    width: 20,
    height: 20,
    backgroundColor: ColorSet.themeLight,
    borderRadius: 10,
  },
  timeStyle: {
    fontSize: 12,
    fontFamily: FamilySet.bold,
    color: ColorSet.grey,
    paddingTop: 2,
  },
  dayStyle: {
    fontSize: 16,
    fontFamily: FamilySet.bold,
    color: ColorSet.secondary,
  },
  nameStyle: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
    color: ColorSet.grey,
  },
});
