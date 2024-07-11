import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Linking,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import appStyle from '../../../styles/appStyle';
import {ColorSet, FamilySet} from '../../../styles';
import {Header, VsocialLink} from '../../../components/index';
import {screenHeight, screenWidth} from '../../../styles/screenSize';
import {Screen} from '../../../constants/screens/screens';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import dateFormator from '../../../components/formatesManager/DateFormateHandler';
import Markdown from 'react-native-markdown-display';
import {getLocalizedDateFormat} from '../../../utils/datesFormater';
import {Language} from '../../../types/common.types';
import {checkIsOfflineMode} from '../../../utils/helper';
// import {useSelector} from 'react-redux';
// import {selectRole} from '../../../redux/common/common.selectors';
import {getRecommendedRestaurants} from '../../../networking/Services';
import RecommendedRestaurantItem from '../../../components/RecommendedRestaurantItem';
// const bottomRef = React.createRef();

const TripDetail: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  const item = route?.params?.items;
  const isOfflineMode = checkIsOfflineMode(route);

  // const userRole = useSelector(selectRole);
  const {t, i18n} = useTranslation();
  const [recommendedRestaurants, setRecommendedRestaurants] = useState([]);
  const [showRecomRestaurants, setShowRecomRestaurants] = useState(false);
  const showAccommodationPhone =
    item?.accomodation?.phone !== null &&
    item?.accomodation?.phone !== item?.accomodation?.cellphone;

  const getRestaurants = async () => {
    const destinationsIds = [
      item?.destinations?.startDestination?.id,
      item?.destinations?.stopDestination?.id,
      item?.destinations?.endDestination?.id,
    ]?.filter(item => item != null);

    try {
      const data = await getRecommendedRestaurants(destinationsIds);

      setRecommendedRestaurants(data?.restaurants);
      if (data?.restaurants?.length) {
        setShowRecomRestaurants(data?.config === 'TC_AND_PAX' ? true : false);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Fetch recom. restaurants itinerary error:', error);
    }
  };

  useEffect(() => {
    getRestaurants();
  }, []);

  const renderImages = ({item}) => {
    return (
      <TouchableOpacity
        style={[appStyle.rowWrap, appStyle.ph5, {paddingLeft: 0}]}
        onPress={() =>
          navigation.navigate(Screen.PhotoDetail, {
            items: item,
            hideActions: true,
            hideProperties: true,
          })
        }>
        <FastImage style={[styles.imageView]} source={{uri: item?.url}} />
      </TouchableOpacity>
    );
  };

  const makeAllMedia = media => {
    const result = media.map(item => ({
      ...item,
      url: `https://storage.googleapis.com/media_ventura_travel/${item?.key}`,
    }));
    return result;
  };

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        showProfile
        back
        onPressBack={() => navigation.goBack()}
        title={
          item?.title?.length > 20
            ? item?.title?.substring(0, 20) + ' ..'
            : item?.title
        }
        // headerIconTwo={Icons.notification}
        // onPressheaderIconTwo={() => navigation.navigate(Screen.Notification)}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <View style={[appStyle.p25, appStyle.flex1]}>
          <View style={[appStyle.pt10]}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(Screen.PhotoDetail, {
                  items: makeAllMedia(item?.media)?.[0],
                  hideActions: true,
                  hideProperties: true,
                })
              }>
              <FastImage
                source={{
                  uri: makeAllMedia(item?.media)?.[0].url,
                }}
                style={{
                  width: screenWidth.width90 - 14,
                  height: screenHeight.height20,
                  marginBottom: 10,
                }}
              />
            </TouchableOpacity>
            {
              <FlatList
                data={makeAllMedia(item?.media)?.slice(1)}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={renderImages}
              />
            }
          </View>
          <View style={styles.containerView}>
            <View style={[appStyle.rowBtw]}>
              <Text style={styles.titleTextStyle}>{t('date')}</Text>
              <Text style={styles.detailTextStyle}>
                {dateFormator(
                  item?.date,
                  getLocalizedDateFormat(i18n.language as Language),
                )}
              </Text>
            </View>
          </View>
          <View style={styles.containerView}>
            <Text style={styles.titleTextStyle}>{t('text_description')}</Text>

            <Markdown
              style={{
                body: {
                  color: ColorSet.grey,
                  fontSize: 16,
                  fontFamily: FamilySet.regular,
                },
                link: {
                  color: ColorSet.secondary,
                  fontWeight: '600',
                },
              }}>
              {item?.description}
            </Markdown>
          </View>

          <View style={styles.containerView}>
            {item?.transport?.length !== 0 ? (
              <>
                <View style={[appStyle.rowBtw]}>
                  <Text style={styles.titleTextStyle}>
                    {t('title_transportation')}
                  </Text>
                </View>
                {item?.transport?.map((element: any) => (
                  <Text style={styles.detailTextStyle}>{element}</Text>
                ))}
              </>
            ) : null}
            {item?.meals?.length !== 0 && (
              <View style={[appStyle.rowBtw]}>
                <Text style={styles.titleTextStyle}>{t('title_meals')}</Text>
              </View>
            )}
            {item?.meal?.map((element: any) => (
              <Text style={styles.detailTextStyle}>{element}</Text>
            ))}
          </View>
          {item?.accomodation?.serviceName && (
            <View style={styles.containerView}>
              <Text style={styles.titleTextStyle}>
                {t('label_accommodation')}
              </Text>
              <View style={styles.accommodationDetails}>
                {item?.accomodation?.website ? (
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(item?.accomodation?.website)
                    }>
                    <Text style={[styles.detailTextStyle, appStyle.textLink]}>
                      {item?.accomodation?.providerName}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.detailTextStyle}>
                    {item?.accomodation?.serviceName} (
                    {item?.accomodation?.providerName})
                  </Text>
                )}
                {item?.accomodation?.cellphone && (
                  <View
                    style={[
                      appStyle.pb5,
                      appStyle.row,
                      appStyle.jcSpaceBetween,
                    ]}>
                    <Text style={styles.detailTextStyle}>
                      {t('phoneNumber')}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(`tel:${item?.accomodation?.cellphone}`)
                      }>
                      <Text
                        style={[styles.detailTextStyle, {fontWeight: 'bold'}]}>
                        {item?.accomodation?.cellphone}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                {showAccommodationPhone && (
                  <View
                    style={[
                      appStyle.pb5,
                      appStyle.row,
                      appStyle.jcSpaceBetween,
                    ]}>
                    <Text style={styles.detailTextStyle}>{t('phone')}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(`tel:${item?.accomodation?.phone}`)
                      }>
                      <Text
                        style={[styles.detailTextStyle, {fontWeight: 'bold'}]}>
                        {item?.accomodation?.phone}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          )}

          {showRecomRestaurants && (
            <View style={[styles.containerView]}>
              <Text style={styles.titleTextStyle}>
                {t('recommended-restaurant')}
              </Text>
              <FlatList
                data={recommendedRestaurants}
                keyExtractor={item => item}
                renderItem={({item, index}) => (
                  <RecommendedRestaurantItem item={item} index={index} />
                )}
              />
            </View>
          )}

          {item?.vSocialProject && (
            <VsocialLink data={item?.vSocialProject} navigation={navigation} />
          )}
          {/* {userRole !== 'TC' && <TripInformation onPress={() => openMap()} title='Address' description='Open in  Maps' address='Street 12,' adressTwo='10897 Berlin' />} */}
          {/* {userRole === 'TC' &&
                        <View style={styles.containerView}>
                            <View style={[appStyle.rowBtw]}>
                                <Text style={styles.titleTextStyle}>{t('text_notes')}</Text>
                                <TouchableOpacity onPress={() => navigation.navigate(Screen.AddNotes)}>
                                    <Text style={styles.detailTextStyle}>+ {t('button_Addnotes')}</Text>
                                </TouchableOpacity>
                            </View>
                            {notesArray.map((data, index) => {
                                return (
                                    <TouchableOpacity onPress={() => bottomRef.current?.setModalVisible()} key={index} style={appStyle.pt10}>
                                        <Text style={styles.detailTextStyle}>{data.title}</Text>
                                        <Text style={styles.dateTextStyle}>{data.date}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    } */}
        </View>
      </KeyboardAwareScrollView>
      {/* <BottomSheet bottomSheetRef={bottomRef}>
                <View>
                    <TouchableOpacity onPress={() => bottomRef.current?.setModalVisible(false)} style={[appStyle.rowCenter, appStyle.pv15]}>
                        <Image source={Icons.settingBlue} style={styles.iconStyle} />
                        <Text style={styles.buttonTextStyle}>{t('button_editNote')}</Text>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity onPress={() => bottomRef.current?.setModalVisible(false)} style={[appStyle.rowCenter, appStyle.pt15]}>
                        <Image source={Icons.delete} style={styles.iconStyle} />
                        <Text style={styles.buttonTextStyle}>{t('button_delete')}</Text>
                    </TouchableOpacity>
                </View>
            </BottomSheet> */}
    </SafeAreaView>
  );
};

export default TripDetail;

const styles = StyleSheet.create({
  buttonTextStyle: {
    color: ColorSet.secondary,
    fontSize: 16,
    fontFamily: FamilySet.semiBold,
  },
  divider: {
    borderWidth: 1,
    borderColor: ColorSet.dividerColor,
  },
  iconStyle: {
    width: 13,
    height: 13,
    resizeMode: 'contain',
    marginRight: 5,
  },
  containerView: {
    backgroundColor: ColorSet.secondaryLight,
    padding: 10,
    marginTop: 10,
  },
  imageView: {
    marginBottom: 10,
    width: screenWidth.width100 / 3.5 - 5,
    height: screenWidth.width100 / 3.5 - 5,
    resizeMode: 'cover',
  },
  titleTextStyle: {
    fontSize: 18,
    fontFamily: FamilySet.bold,
    color: ColorSet.theme,
  },
  detailTextStyle: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
    color: ColorSet.grey,
    paddingTop: 5,
  },
  dateTextStyle: {
    fontSize: 12,
    fontFamily: FamilySet.bold,
    color: ColorSet.grey,
    paddingTop: 5,
  },
  body: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
    color: ColorSet.textBase,
    paddingTop: 5,
  },
  accommodationDetails: {
    marginBottom: 16,
  },
});
