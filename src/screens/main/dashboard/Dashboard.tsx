import React, {createRef, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import appStyle from '../../../styles/appStyle';
import {ColorSet, FamilySet, Fonts} from '../../../styles';
import {
  Header,
  H1,
  TripView,
  Button,
  BottomSheet,
} from '../../../components/index';
import {screenWidth} from '../../../styles/screenSize';
import FastImage from 'react-native-fast-image';
import {Screen} from '../../../constants/screens/screens';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector, useDispatch} from 'react-redux';
import {
  selectItinerary,
  selectMyPhotos,
  selectUser,
} from '../../../redux/common/common.selectors';
import {getMyPhotos} from '../../../networking/PhotosApiService';
import {setMyPhotos} from '../../../redux/common/common.slice';
import {Codes} from '../../../constants/codes';
import dateFormator from '../../../components/formatesManager/DateFormateHandler';
import {getMoreInformation} from '../../../networking/Services';
import {checkIsOfflineMode} from '../../../utils/helper';
import {
  TABLE_OFFLINE_NAME,
  getValueForKey,
} from '../../../networking/DBConection';
import {DbKeys} from '../../../constants/screens/dbKeys';

const guideBottomRef = createRef();

const Dashboard: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  const isOfflineMode = checkIsOfflineMode(route);
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const [moreInformation, setMoreInformation] = useState({
    guide: null,
    tripDetails: null,
  });
  const guideData = moreInformation?.guide;
  const tripDetails = moreInformation?.tripDetails;
  const {upComingItinerary: itineraries}: any = useSelector(selectItinerary);
  const MyPhotos = useSelector(selectMyPhotos);
  const user: any = useSelector(selectUser);
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={[appStyle.ph3]}
        onPress={() => navigation.navigate(Screen.PhotoDetail, {items: item})}>
        <FastImage style={[styles.imageView]} source={{uri: item?.path}} />
      </TouchableOpacity>
    );
  };

  const getPhotos = async () => {
    const myPhotosResponse = await getMyPhotos();
    if (myPhotosResponse.statusCode === Codes.SUCCESS) {
      dispatch(setMyPhotos(myPhotosResponse?.data));
      return;
    }
  };
  const getInformation = async () => {
    if (!isOfflineMode) {
      const res = await getMoreInformation();
      if (res?.tripDetails) {
        setMoreInformation(res);
      }
    }
    if (isOfflineMode) {
      await getValueForKey(
        DbKeys.moreInformation,
        setMoreInformation,
        TABLE_OFFLINE_NAME,
      );
    }
  };
  useEffect(() => {
    getPhotos();
  }, []);
  useEffect(() => {
    getInformation();
    return () => {
      setMoreInformation({
        guide: null,
        tripDetails: null,
      });
    };
  }, []);

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header title={t('screen_common_dashboard')} showProfile />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <View style={[appStyle.p25, appStyle.flex1]}>
          {!isOfflineMode ? (
            <View style={appStyle.mb40}>
              <View style={[appStyle.w100, appStyle.row, appStyle.mt10]}>
                <H1>{t('text_hello-dashboard')}</H1>
                <Text style={[styles.nameStyle, appStyle.ml10]}>
                  {user.fullName + ' '}
                </Text>
                <H1>!</H1>
              </View>
              {tripDetails?.name !== '' && (
                <Text style={[{color: ColorSet.textBase}]}>
                  {tripDetails?.name}
                </Text>
              )}
            </View>
          ) : (
            <View style={[appStyle.w100, appStyle.mt10, appStyle.mb20]}>
              <H1 testID="dashboardHelloTitle">
                {t('text_hello-dashboard-offline')}
              </H1>
              {tripDetails?.name !== '' && (
                <Text style={[{color: ColorSet.textBase}]}>
                  {tripDetails?.name}
                </Text>
              )}
            </View>
          )}

          <View style={[appStyle.rowBtw, appStyle.pb20]}>
            <H1>{t('local_common_Itinerary')}</H1>
            <TouchableOpacity onPress={() => navigation.navigate('MyTrip')}>
              <Text style={styles.viewAllTextStyle}>{t('button_ViewAll')}</Text>
            </TouchableOpacity>
          </View>
          {itineraries?.length > 0 ? (
            <View>
              <TripView
                onPress={() =>
                  navigation.navigate(Screen.TripDetail, {
                    items: itineraries[0],
                  })
                }
                date={dateFormator(itineraries[0]?.date, 'd / MM')}
                day={t('text_day-number', {
                  dayNumber: itineraries[0]?.dayNumber,
                })}
                title={itineraries[0]?.title}
                messsage={itineraries[0]?.description?.replace(
                  /(\r\n|\n|\r)/gm,
                  '',
                )}
              />
              <TripView
                onPress={() =>
                  navigation.navigate(Screen.TripDetail, {
                    items: itineraries[1],
                  })
                }
                date={dateFormator(itineraries[1]?.date, 'd / MM')}
                day={t('text_day-number', {
                  dayNumber: itineraries[1]?.dayNumber,
                })}
                title={itineraries[1]?.title}
                messsage={itineraries[1]?.description?.replace(
                  /(\r\n|\n|\r)/gm,
                  '',
                )}
              />
            </View>
          ) : (
            <View style={[appStyle.w100, appStyle.aiCenter, appStyle.jcCenter]}>
              <Text style={{color: ColorSet.black}}>
                {t('error_noPhotosAvailable')}
              </Text>
            </View>
          )}
          {!isOfflineMode && (
            <>
              <View style={[appStyle.rowBtw, appStyle.pt20]}>
                <H1>{t('screen_common_photos')}</H1>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Photos', {
                      screen: Screen.Photos,
                      params: {state: 2},
                    })
                  }>
                  <Text style={styles.viewAllTextStyle}>
                    {t('button_ViewAll')}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={[appStyle.flex1, appStyle.rowWrap, appStyle.pt10]}>
                {MyPhotos.length > 0 ? (
                  <FlatList
                    data={MyPhotos}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                  />
                ) : (
                  <View
                    style={[
                      appStyle.w100,
                      appStyle.aiCenter,
                      appStyle.jcCenter,
                    ]}>
                    <Text style={{color: ColorSet.black}}>
                      {t('error_noPhotosAvailable')}
                    </Text>
                  </View>
                )}
              </View>
            </>
          )}

          {guideData && (
            <>
              <TouchableOpacity
                onPress={() => navigation.navigate(Screen.YourGuide)}>
                <View style={[appStyle.rowBtw, appStyle.pt20]}>
                  <H1>{t('Touchable_yourGuide')}</H1>

                  <Text style={styles.viewAllTextStyle}>
                    {t('button_ViewNow')}
                  </Text>
                </View>
                <View style={[appStyle.row, appStyle.pb15]}>
                  {guideData?.media && (
                    <FastImage
                      style={[styles.imageStyle]}
                      source={{uri: guideData?.media?.[0]?.url}}
                    />
                  )}
                  <View style={[appStyle.flex1, appStyle.ph10]}>
                    <Text style={[styles.nameStyle, styles.guideTitle]}>
                      {guideData?.name}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAwareScrollView>
      <BottomSheet bottomSheetRef={guideBottomRef}>
        <View>
          <View style={appStyle.pv10}>
            <Text style={styles.viewAllTextStyle}>
              {t('text_pleaseVistWebsite')}
            </Text>
          </View>
          <View style={appStyle.pt10}>
            <Button
              onPress={() => guideBottomRef.current?.setModalVisible(false)}>
              {t('button_close')}
            </Button>
          </View>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  imageView: {
    marginBottom: 10,
    width: screenWidth.width100 / 3.5 - 5,
    height: screenWidth.width100 / 3.5 - 5,
    resizeMode: 'cover',
  },
  viewAllTextStyle: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
    color: ColorSet.grey,
  },
  nameStyle: {
    ...Fonts.size.xmedium,
    color: ColorSet.theme,
    fontFamily: FamilySet.bold,
  },
  imageStyle: {
    width: 70,
    height: 70,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    resizeMode: 'contain',
  },
  guideTitle: {
    color: ColorSet.secondary,
    fontFamily: FamilySet.regular,
    fontSize: 18,
  },
});
