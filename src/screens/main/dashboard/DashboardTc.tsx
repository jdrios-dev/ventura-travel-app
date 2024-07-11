import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import ReadMore from 'react-native-read-more-text';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';
import {useSelector, useDispatch} from 'react-redux';

import appStyle from '../../../styles/appStyle';
import {ColorSet, FamilySet, Fonts} from '../../../styles';
import {Header, H1, DepartureNote, FreeSpace} from '../../../components/index';
import {Screen} from '../../../constants/screens/screens';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  selecMytripPhoto,
  selectUser,
} from '../../../redux/common/common.selectors';
import {screenWidth} from '../../../styles/screenSize';
import {getNotes, getPassengerListBirthday} from '../../../networking/Services';
import {getMyTripPhotos} from '../../../networking/PhotosApiService';
import {Codes} from '../../../constants/codes';
import {setTripPhotos} from '../../../redux/common/common.slice';
import dateFormator from '../../../components/formatesManager/DateFormateHandler';
import Toast from 'react-native-simple-toast';
import DepartureIdUpdateModal from '../../../components/modals/DepartureIdUpdateModal';
import PaxBirthdayList from '../../../components/paxBirthdayList/PaxBirthdayList';
import {checkIsOfflineMode} from '../../../utils/helper';
import {DbKeys} from '../../../constants/screens/dbKeys';
import {
  TABLE_OFFLINE_NAME,
  getValueForKey,
} from '../../../networking/DBConection';
import {getLocalizedDateFormat} from '../../../utils/datesFormater';
import UploadPhotosNotification from '../../../components/UploadPhotosNotification';

const DashboardTc: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  const isOfflineMode = checkIsOfflineMode(route);

  const [passengerListBirthday, setPassengerListBirthday] = useState([]);
  const [modalDepartureId, setModalDepartureId] = useState(false);
  const departureId = route?.params?.departureId;

  const handleDepartureIdUpdate = useCallback(() => {
    setModalDepartureId(true);
  }, []);

  const handleCloseModal = () => {
    setModalDepartureId(false);
    route.params.departureId = null;
  };

  useEffect(() => {
    if (departureId) {
      handleDepartureIdUpdate();
    }
    return () => {
      setPassengerListBirthday([]);
    };
  }, [departureId, handleDepartureIdUpdate]);

  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();

  const user: any = useSelector(selectUser);

  const tcPhotos: any = useSelector(selecMytripPhoto);
  const [notes, setNotes] = useState<any>([]);
  const notesHaveAtLeastTwoItems = notes?.length >= 2; // We show the 2 newest notes on the Dashboard - Daniel 3 Apr 23
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={[appStyle.ph3]}
        onPress={() => navigation.navigate(Screen.PhotoDetail, {items: item})}>
        <FastImage style={[styles.imageView]} source={{uri: item?.path}} />
      </TouchableOpacity>
    );
  };

  const renderTruncatedFooter = handlePress => {
    return (
      <Text style={{color: ColorSet.theme, marginTop: 5}} onPress={handlePress}>
        Read more
      </Text>
    );
  };
  const renderRevealedFooter = handlePress => {
    return (
      <Text style={{color: ColorSet.theme, marginTop: 5}} onPress={handlePress}>
        Show less
      </Text>
    );
  };
  const getAllNotes = async () => {
    const response = await getNotes();
    const sortedNotes = response.sort(function (a, b) {
      return new Date(b.created_at) - new Date(a.created_at);
    });
    setNotes(sortedNotes);
  };

  const getPhotos = async () => {
    const myTripPhotoRespone = await getMyTripPhotos();

    if (myTripPhotoRespone.statusCode === Codes.SUCCESS) {
      dispatch(setTripPhotos(myTripPhotoRespone?.data));
    } else {
      Toast.show(myTripPhotoRespone.message);
    }
  };
  const readOfflinePassengerListBirthday = async () => {
    await getValueForKey(
      DbKeys.paxBirthday,
      setPassengerListBirthday,
      TABLE_OFFLINE_NAME,
    );
  };
  const getPaxListBirthday = async () => {
    if (!isOfflineMode) {
      const dataPaxBirthday = await getPassengerListBirthday();
      setPassengerListBirthday(dataPaxBirthday);
    }
    if (isOfflineMode) {
      await readOfflinePassengerListBirthday();
    }
  };
  useEffect(() => {
    getPhotos();
    getAllNotes();
    getPaxListBirthday();
  }, []);
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getAllNotes();
    });

    return unsubscribe;
  }, [navigation]);
  const showBirthdaySection = passengerListBirthday?.length > 0;
  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header showProfile title={t('screen_common_dashboard')} />

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <View style={[appStyle.p25, appStyle.flex1]}>
          {!isOfflineMode ? (
            <>
              <UploadPhotosNotification navigation={navigation} />
              <View style={[appStyle.w100, appStyle.row, appStyle.mt10]}>
                <H1 testID="dashboardHelloTitle">
                  {t('text_hello-dashboard')}
                </H1>
                <Text style={[styles.nameStyle, appStyle.ml10]}>
                  {user.fullName + ' '}
                </Text>
                <H1>!</H1>
              </View>
            </>
          ) : (
            <View
              style={[
                appStyle.w100,
                appStyle.row,
                appStyle.mt10,
                appStyle.mb20,
              ]}>
              <H1 testID="dashboardHelloTitle">
                {t('text_hello-dashboard-offline')}
              </H1>
            </View>
          )}
          {!isOfflineMode && (
            <Text style={[appStyle.mb20, {color: ColorSet.textBase}]}>
              {user?.tripCode?.toUpperCase()} - {user?.departureId}
            </Text>
          )}
          {/* <H1>Spendings</H1>
                    <View style={[styles.spendingsView]}>
                    <View style={[styles.rowStyleView]}>
                    <Text style={[styles.spendingsStyle]}>Total spendings</Text>
                    <Text style={[styles.spendingsStyle,{color:ColorSet.black1}]}>1040 PEN</Text>
                    </View>
                    <View style={[styles.rowStyleView]}>
                    <Text style={[styles.spendingsStyle]}>Average spendings</Text>
                    <Text style={[styles.spendingsStyle,{color:ColorSet.black1}]}>200 PEN</Text>
                    </View>
                    </View> */}
          {!isOfflineMode && (
            <>
              <View style={[appStyle.rowBtw, appStyle.pt10]}>
                <H1>{t('screen_common_photos')}</H1>
                <TouchableOpacity onPress={() => navigation.navigate('Photos')}>
                  <Text style={styles.viewAllTextStyle}>
                    {t('button_ViewAll')}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={[appStyle.rowWrap, appStyle.pt10]}>
                {tcPhotos.length > 0 ? (
                  <FlatList
                    data={tcPhotos}
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
          {!isOfflineMode && (
            <>
              <View style={[appStyle.rowBtw, appStyle.pt10]}>
                <H1>{t('screen_common_notes')}</H1>
                <TouchableOpacity
                  onPress={() => navigation.navigate('MyNotes')}>
                  <Text style={styles.viewAllTextStyle}>
                    {t('button_ViewAll')}
                  </Text>
                </TouchableOpacity>
              </View>
              {notes?.length > 0 ? (
                <View style={[appStyle.rowWrap]}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate(Screen.MyNotes)}
                    style={[styles.renderView]}>
                    <Text style={styles.titleTextStyle}>{notes[0]?.title}</Text>
                    <Text
                      style={[
                        styles.titleTextStyle,
                        {color: ColorSet.secondary},
                      ]}>
                      {notes[0]?.label}
                    </Text>
                    <ReadMore
                      numberOfLines={3}
                      renderTruncatedFooter={renderTruncatedFooter}
                      renderRevealedFooter={renderRevealedFooter}>
                      <Text style={styles.answerTextStyle}>
                        {notes && notes[0]?.description}
                      </Text>
                    </ReadMore>
                    <Text style={styles.dateTextStyle}>
                      {dateFormator(
                        notes[0]?.created_at,
                        getLocalizedDateFormat(i18n.language as Locale),
                      )}
                    </Text>
                  </TouchableOpacity>
                  {notesHaveAtLeastTwoItems && (
                    <TouchableOpacity
                      onPress={() => navigation.navigate(Screen.MyNotes)}
                      style={[styles.renderView]}>
                      <Text style={styles.titleTextStyle}>
                        {notes[1]?.title}
                      </Text>
                      <Text
                        style={[
                          styles.titleTextStyle,
                          {color: ColorSet.secondary},
                        ]}>
                        {notes[1]?.label}
                      </Text>
                      <ReadMore
                        numberOfLines={3}
                        renderTruncatedFooter={renderTruncatedFooter}
                        renderRevealedFooter={renderRevealedFooter}>
                        <Text style={styles.answerTextStyle}>
                          {notes && notes[1]?.description}
                        </Text>
                      </ReadMore>
                      <Text style={styles.dateTextStyle}>
                        {dateFormator(
                          notes[1]?.created_at,
                          getLocalizedDateFormat(i18n.language as Locale),
                        )}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <View
                  style={[
                    appStyle.flex1,
                    appStyle.aiCenter,
                    appStyle.jcCenter,
                  ]}>
                  <Text style={{color: ColorSet.black}}>
                    {t('error_noPhotosAvailable')}
                  </Text>
                </View>
              )}
            </>
          )}
          {showBirthdaySection && (
            <PaxBirthdayList
              listPax={passengerListBirthday}
              navigation={navigation}
            />
          )}
          <DepartureNote />
          <FreeSpace />
        </View>
        <DepartureIdUpdateModal
          setModalVisible={handleCloseModal}
          modalVisible={modalDepartureId}
          departureId={departureId}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default DashboardTc;

const styles = StyleSheet.create({
  nameStyle: {
    ...Fonts.size.xmedium,
    color: ColorSet.theme,
    fontFamily: FamilySet.bold,
  },
  spendingsStyle: {
    ...Fonts.size.normal,
    paddingVertical: 5,
    color: ColorSet.theme,
    fontFamily: FamilySet.regular,
    justifyContent: 'space-between',
  },
  renderView: {
    width: '100%',
    marginVertical: 20,
    backgroundColor: ColorSet.secondaryLight,
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    justifyContent: 'flex-start',
  },
  spendingsView: {
    width: '100%',
    paddingVertical: 10,
    backgroundColor: ColorSet.secondaryLight,
    borderRadius: 5,
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  rowStyleView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: ColorSet.secondaryLight,
  },
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
  titleTextStyle: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
    color: ColorSet.theme,
    paddingBottom: 5,
  },
  dateTextStyle: {
    fontSize: 12,
    marginTop: 7,
    fontFamily: FamilySet.bold,
    color: ColorSet.secondary,
    paddingBottom: 5,
  },
  answerTextStyle: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
    color: ColorSet.grey,
  },
});
