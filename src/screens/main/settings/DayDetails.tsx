import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
  ScrollView,
} from 'react-native';
import {Linking} from 'react-native';

import appStyle from '../../../styles/appStyle';
import {Icons, Keys} from '../../../constants';
import {ColorSet, FamilySet} from '../../../styles';
import {Header, VsocialLink} from '../../../components/index';
import {screenHeight, screenWidth} from '../../../styles/screenSize';
import {Screen} from '../../../constants/screens/screens';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import {
  getSingleDay,
  getRecommendedRestaurants,
} from '../../../networking/Services';
import Loader from '../../../components/Loader';
import dateFormator, {
  formatTime,
} from '../../../components/formatesManager/DateFormateHandler';
import {getLocalizedDateFormat} from '../../../utils/datesFormater';
import {Language} from '../../../types/common.types';
import {checkIsOfflineMode, compressString} from '../../../utils/helper';
import {
  TABLE_OFFLINE_NAME,
  getValueForKey,
} from '../../../networking/DBConection';
import {DayIndex} from '../../../constants/screens/dbKeys';
import RecommendedRestaurantItem from '../../../components/RecommendedRestaurantItem';

const DayDetails: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  const PaymentTypes = ['Cash TC', 'All'];

  const day = route?.params?.item;

  const isOfflineMode = checkIsOfflineMode(route);

  const [fullDay, setFullDay] = useState({
    services: [],
    spendings: [],
    spendingsServices: [],
    information: {
      flightTo: '',
      comment: '',
      media: [{url: ''}],
      startDestination: '',
      stopDestination: '',
      endDestination: '',
      meals: [],
      transport: [],
      vplus: '',
      description: '',
    },
    vSocialProject: null,
    destinations: {},
  });

  const {services, spendings, spendingsServices, information, vSocialProject} =
    fullDay;

  const {t, i18n} = useTranslation();
  const [filteredServices, setFilterServices] = useState([]);
  const [filteredSpendings, setFilteredSpendgings] = useState([]);
  const [ProviderTypes, setProviderTypes] = useState<any>([]);
  const [recommendedRestaurants, setRecommendedRestaurants] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [activeState, setActiveState] = React.useState(1);
  const [selectionView, setSelectionView] = React.useState(false);
  const [selectedType, setSelectType] = React.useState('');

  const renderServiceItem = ({item, index}) => {
    // Maps config
    const coordinates = item?.location?.coordinates;
    const isCoordinatesValid =
      coordinates && coordinates?.[0] !== 0 && coordinates?.[1] !== 0;
    const scheme = Platform.select({
      ios: 'maps://0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${coordinates?.[1]},${coordinates?.[0]}`;
    const locationLabel = item.name;
    const url = Platform.select({
      ios: `${scheme}${locationLabel}@${latLng}`,
      android: `${scheme}${latLng}(${locationLabel})`,
    });

    //Whatsapp config
    const whatsappLink = `whatsapp://send?text=Ventura Travel&phone=${item?.whatsapp}`;
    const handleWhatsapp = async () => {
      const whatsappLinkSupported = await Linking.canOpenURL(whatsappLink);
      if (whatsappLinkSupported) {
        await Linking.openURL(whatsappLink);
      } else {
        await Linking.openURL(`tel:${item?.whatsapp}`);
      }
    };

    return (
      <View style={styles.roomsView}>
        {item?.name !== '' && (
          <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
            <Text
              testID={`dayDetailTabService.${index + 1}`}
              style={[styles.titleStyle, {color: ColorSet.theme}]}>
              {item?.name}
            </Text>
          </View>
        )}
        {item?.providerName !== '' && (
          <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
            <Text style={[styles.titleStyle]}>{t('title_provider')} </Text>
            <Text style={[styles.infoTextStyle]}>{item?.providerName}</Text>
          </View>
        )}
        {item?.startTime !== '' && (
          <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
            <Text style={styles.titleStyle}>{t('label_start-time')}</Text>
            <Text style={styles.infoTextStyle}>
              {formatTime(item?.startTime)}
            </Text>
          </View>
        )}
        {item?.startDate !== '' && (
          <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
            <Text style={styles.titleStyle}>{t('label_start-date')}</Text>
            <Text style={styles.infoTextStyle}>
              {dateFormator(
                item?.startDate,
                getLocalizedDateFormat(i18n.language as Language),
              )}
            </Text>
          </View>
        )}
        {item?.endDate !== '' && (
          <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
            <Text style={styles.titleStyle}>{t('label_end-time')}</Text>
            <Text style={styles.infoTextStyle}>
              {dateFormator(
                item?.endDate,
                getLocalizedDateFormat(i18n.language as Language),
              )}
            </Text>
          </View>
        )}
        {item?.pickUpTime !== '' && (
          <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
            <Text style={styles.titleStyle}>{t('text_time')}</Text>
            <Text style={styles.infoTextStyle}>{item?.pickUpTime}</Text>
          </View>
        )}
        {item?.cellphone && (
          <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
            <Text style={styles.titleStyle}>{t('phoneNumber')}</Text>
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${item?.cellphone}`)}>
              <Text style={[styles.infoTextStyle, {fontWeight: 'bold'}]}>
                {item?.cellphone}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {item?.phone && (
          <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
            <Text style={styles.titleStyle}>{t('phone')}</Text>
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${item?.phone}`)}>
              <Text style={[styles.infoTextStyle, {fontWeight: 'bold'}]}>
                {item?.phone}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {item?.whatsapp && (
          <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
            <Text style={styles.titleStyle}>Whatsapp</Text>
            <TouchableOpacity onPress={() => handleWhatsapp()}>
              <Text style={[styles.infoTextStyle, {fontWeight: 'bold'}]}>
                {item?.whatsapp}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {item?.emergencyCellphone && (
          <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
            <Text style={styles.titleStyle}>{t('emergencyContactNumber')}</Text>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(`tel:${item?.emergencyCellphone}`)
              }>
              <Text style={[styles.infoTextStyle, {fontWeight: 'bold'}]}>
                {item?.emergencyCellphone}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {item?.reservationText !== null && (
          <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
            <Text style={styles.titleStyle}>
              {t('label_reservation-comment')}
            </Text>
          </View>
        )}
        {item?.reservationText !== null && (
          <Text style={styles.infoTextStyle}>{item?.reservationText}</Text>
        )}
        {isCoordinatesValid && (
          <TouchableOpacity
            style={styles.mapLink}
            onPress={() => {
              Linking.openURL(url!);
            }}>
            <Text style={styles.mapLinkText}>
              {t('touchable_link-visit-map')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderSpendings = ({item}) => (
    <View style={[styles.roomsView]}>
      {item?.name !== '' && (
        <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
          <Text style={[styles.titleStyle, {color: ColorSet.theme}]}>
            {item?.name}
          </Text>
        </View>
      )}
      {item?.amount !== '' && (
        <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
          <Text style={[styles.titleStyle]}>{t('title_spending-per-pax')}</Text>
          <Text style={[styles.infoTextStyle]}>
            {t('text_spending-per-pax-amount', {
              amount: item?.amount,
              currency: item?.currency?.abbreviation,
            })}
          </Text>
        </View>
      )}
      {item?.service_payment_type?.description && (
        <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
          <Text style={[styles.titleStyle]}>{t('label_payment-type')}</Text>
          <Text style={styles.infoTextStyle}>
            {item?.service_payment_type?.description}
          </Text>
        </View>
      )}
    </View>
  );
  const onSelect = (data: any) => {
    setSelectionView(false);
    setSelectType(data);
    if (activeState === 2) {
      const result = services?.filter((item: any) => {
        if (item?.providerType === data) {
          return item;
        } else if (data === Keys.all) {
          return item;
        }
      });
      setFilterServices(result);
      return;
    }
    const result = spendings?.filter((item: any) => {
      if (item.service_payment_type?.description === data) {
        return item;
      } else if (data === Keys.all) {
        return item;
      }
    });
    setFilteredSpendgings(result);
  };

  const getDayDetails = async () => {
    if (!isOfflineMode) {
      setIsloading(true);
      const response = await getSingleDay(day.id, day.day_number);
      const destinationsIds = [
        response?.information?.destinations?.start?.id,
        response?.information?.destinations?.end?.id,
        response?.information?.destinations?.stop?.id,
      ];

      const destinationsIdsMapped = destinationsIds?.filter(id => id);

      const restaurantsResponse = await getRecommendedRestaurants(
        destinationsIdsMapped,
      );
      setRecommendedRestaurants(restaurantsResponse);

      setIsloading(false);
      if (response) {
        setFullDay(response);
        const providerTypes = Array.from(
          new Set(response?.services.map(({providerType}) => providerType)),
        );
        providerTypes.push('All');
        setProviderTypes(providerTypes);
      }
    }
    if (isOfflineMode) {
      await getValueForKey(
        `day${day.day_number}` as DayIndex,
        setFullDay,
        TABLE_OFFLINE_NAME,
      );
    }
  };

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
        <Image style={[styles.imageView]} source={{uri: item?.url}} />
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    getDayDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showRecommendedRestaurant = currentOption => {
    if (currentOption === 'TC_ONLY' || currentOption === 'TC_AND_PAX') {
      return true;
    }
    if (currentOption === 'HIDE') {
      return false;
    }
    return false;
  };

  const tabItems = [
    {
      id: 1,
      show: true,
      tabButton: t('label_information'),
      tabContent: (
        <View style={[appStyle.p25, appStyle.flex1]}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(Screen.PhotoDetail, {
                items: fullDay?.information?.media?.[0],
                hideActions: true,
                hideProperties: true,
              })
            }>
            <Image
              source={{uri: fullDay?.information?.media?.[0]?.url}}
              style={{
                width: screenWidth.width90 - 14, // TODO: check the what 14px are for and fix it
                height: screenHeight.height20,
                marginBottom: 10,
              }}
            />
          </TouchableOpacity>
          {
            <FlatList
              data={information?.media?.slice(1)}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={renderImages}
              keyExtractor={(_, index) => index.toString()}
            />
          }
          <View style={styles.containerView}>
            <View style={[appStyle.rowBtw, appStyle.jcSpaceBetween]}>
              {information?.startDestination !== '' && (
                <View style={styles.designationMain}>
                  <View style={styles.destinationView}>
                    <Image source={Icons.map} style={styles.iconStyle} />
                  </View>
                  <View style={styles.dropOfTextStyle}>
                    <Text style={styles.textStyleView}>
                      {compressString(information?.startDestination, 12)}
                    </Text>
                  </View>
                </View>
              )}
              {information?.stopDestination !== '' &&
                information?.startDestination !== '' && (
                  <View style={styles.line} />
                )}
              {information?.stopDestination !== '' && (
                <View style={styles.designationMain}>
                  <View style={styles.destinationView}>
                    <Image source={Icons.map} style={styles.iconStyle} />
                  </View>
                  <View style={styles.dropOfTextStyle}>
                    <Text style={styles.textStyleView}>
                      {compressString(information?.stopDestination, 12)}
                    </Text>
                  </View>
                </View>
              )}
              {information?.endDestination !== '' && (
                <View style={styles.line} />
              )}
              {information?.endDestination !== '' && (
                <View style={styles.designationMain}>
                  <View style={styles.destinationView}>
                    <Image source={Icons.map} style={styles.iconStyle} />
                  </View>
                  <View style={styles.dropOfTextStyle}>
                    <Text style={styles.textStyleView}>
                      {compressString(information?.endDestination, 12)}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
          {!!information?.description && (
            <View style={styles.containerView}>
              <Text style={styles.titleTextStyle}>{t('text_description')}</Text>
              <Text style={styles.detailTextStyle}>
                {information?.description}
              </Text>
            </View>
          )}
          {information?.comment ? (
            <View style={styles.containerView}>
              <Text style={styles.titleTextStyle}>
                {'Comment'}{' '}
                <Text style={styles.detailTextStyle}>(Trip Version)</Text>{' '}
              </Text>
              <Text style={styles.detailTextStyle}>{information?.comment}</Text>
            </View>
          ) : null}
          {information?.tcComment ? (
            <View style={styles.containerView}>
              <Text style={styles.titleTextStyle}>
                {'TC comment'}{' '}
                <Text style={styles.detailTextStyle}>(Departure)</Text>
              </Text>
              <Text style={styles.detailTextStyle}>
                {information?.tcComment}
              </Text>
            </View>
          ) : null}

          <View style={styles.containerView}>
            {information?.transport?.length !== 0 ? (
              <View style={[appStyle.rowBtw]}>
                <Text style={styles.titleTextStyle}>{t('text_transport')}</Text>
              </View>
            ) : null}
            {information?.transport?.map((element: any) => (
              <Text style={styles.detailTextStyle} key={element}>
                {element}
              </Text>
            ))}
            {information?.meals?.length !== 0 && (
              <View style={[appStyle.rowBtw]}>
                <Text style={styles.titleTextStyle}>
                  {t('label_included-meals')}
                </Text>
              </View>
            )}
            {information?.meals?.map((element: any) => (
              <Text style={styles.detailTextStyle} key={element}>
                {element}
              </Text>
            ))}
            {information?.vplus !== '' && (
              <View style={[appStyle.rowBtw]}>
                <Text style={styles.titleTextStyle}>{t('label_v-plus')}</Text>
              </View>
            )}
            <Text style={styles.detailTextStyle}>
              {information?.vplus?.replace(/[^a-zA-Z0-9 ]/g, '')}
            </Text>
            {information?.flightTo !== '' && (
              <View style={[appStyle.rowBtw]}>
                <Text style={styles.titleTextStyle}>{t('label_flights')}</Text>
              </View>
            )}
            <Text style={styles.detailTextStyle}>{information?.flightTo}</Text>
          </View>
          {vSocialProject && (
            <VsocialLink data={vSocialProject} navigation={navigation} />
          )}
        </View>
      ),
      activeStep: 1,
      testID: 'dayDetailTabInformation',
      onPress: () => {
        setActiveState(1);
      },
    },
    {
      id: 2,
      show: true,

      tabButton: t('label_services'),
      tabContent: (
        <View style={[appStyle.p25, appStyle.flex1]}>
          <FlatList
            data={filteredServices}
            renderItem={renderServiceItem}
            keyExtractor={item => item.id}
          />
        </View>
      ),
      activeStep: 2,
      testID: 'dayDetailTabService',
      onPress: () => {
        setActiveState(2);
        setSelectType('');
        selectionView && setSelectionView(!selectionView);
        setFilterServices(services);
      },
    },
    {
      id: 3,
      show: true,

      tabButton: t('title_spending-per-pax'),
      tabContent: (
        <View style={[appStyle.p25, appStyle.flex1]}>
          <FlatList
            data={filteredSpendings}
            renderItem={renderSpendings}
            keyExtractor={item => item.id}
          />
          <FlatList
            data={spendingsServices}
            renderItem={renderSpendings}
            keyExtractor={item => item.id}
          />
        </View>
      ),
      activeStep: 3,
      testID: 'dayDetailTabExpenses',
      onPress: () => {
        setActiveState(3);
        setSelectType('');
        selectionView && setSelectionView(!selectionView);
        setFilteredSpendgings(spendings);
      },
    },
    {
      id: 4,
      show: showRecommendedRestaurant(recommendedRestaurants?.config),
      tabButton: t('recommended-restaurant'),
      tabContent: (
        <View style={[appStyle.p25, appStyle.flex1]}>
          <FlatList
            data={recommendedRestaurants?.restaurants}
            renderItem={({item, index}) => {
              return <RecommendedRestaurantItem item={item} index={index} />;
            }}
            keyExtractor={item => item.id}
          />
        </View>
      ),
      activeStep: 4,
      testID: 'dayDetailTabExpenses',
      onPress: () => {
        setActiveState(4);
        setSelectType('');
        selectionView && setSelectionView(!selectionView);
        setFilteredSpendgings(spendings);
      },
    },
  ];

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <Loader isLoading={isLoading} layout={'outside'} />
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        testId="dayDetailTitle"
        back
        onPressBack={() => navigation.goBack()}
        title={t('text_day-number', {dayNumber: day.day_number})}
      />
      <View
        style={{
          height: 60,
        }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabItems
            ?.filter(item => item.show)
            ?.map(item => (
              <TouchableOpacity
                testID={item.testID}
                onPress={item.onPress}
                style={[
                  styles.tabStyle,
                  {
                    borderBottomColor:
                      activeState === item.id
                        ? ColorSet.theme
                        : ColorSet.grayLight,
                  },
                ]}>
                <Text
                  style={[
                    styles.tabLableStyle,
                    {
                      color:
                        activeState === item?.id
                          ? ColorSet.theme
                          : ColorSet.grey,
                    },
                  ]}>
                  {item.tabButton}
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        {((activeState === 2 && services?.length !== 0) ||
          (activeState === 3 && spendings?.length !== 0)) && (
          <View style={[appStyle.jcCenter, appStyle.w85, appStyle.asCenter]}>
            {!isOfflineMode && (
              <TouchableOpacity
                onPress={() => setSelectionView(!selectionView)}
                style={[styles.selectTypeStyle, appStyle.aiCenter]}>
                <Text style={styles.selectTitle}>
                  {selectedType === ''
                    ? activeState === 2 && !selectedType
                      ? t('label_filter-by-provider-type')
                      : t('label_payment-type')
                    : selectedType}
                </Text>
                <Image
                  style={[styles.arrowDownStyle]}
                  source={selectionView ? Icons.arrowUp : Icons.arrowDown}
                />
              </TouchableOpacity>
            )}

            {selectionView && (
              <View style={[appStyle.flex1, appStyle.mv5]}>
                {(activeState === 2 ? ProviderTypes : PaymentTypes).map(
                  (data: any, index) => {
                    return (
                      <TouchableOpacity
                        onPress={() => onSelect(data)}
                        key={index}
                        style={appStyle.pv10}>
                        <Text style={{color: ColorSet.black}}>{data}</Text>
                      </TouchableOpacity>
                    );
                  },
                )}
              </View>
            )}
          </View>
        )}
        {tabItems.find(item => item.id === activeState)?.tabContent}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default DayDetails;

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
    color: ColorSet.secondary,
    paddingTop: 5,
  },
  dateTextStyle: {
    fontSize: 12,
    fontFamily: FamilySet.bold,
    color: ColorSet.grey,
    paddingTop: 5,
  },
  tabLableStyle: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
  },
  tabStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    marginBottom: 20,
  },
  destinationView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropOfTextStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  textStyleView: {
    fontSize: 12,
    fontFamily: FamilySet.regular,
    color: ColorSet.grey,
  },
  line: {
    width: '5%',
    height: 1.5,
    backgroundColor: ColorSet.theme,
  },
  designationMain: {
    height: 50,
  },
  roomsView: {
    flex: 1,
    backgroundColor: ColorSet.secondaryLight,
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  singleView: {
    width: '100%',
    height: 20,
    backgroundColor: 'green',
  },
  infoTextStyle: {
    color: ColorSet.grey,
    fontSize: 14.5,
    width: 130,
    fontFamily: FamilySet.regular,
  },
  titleStyle: {
    color: ColorSet.grey,
    fontSize: 13.7,
    fontFamily: FamilySet.bold,
  },
  selectTypeStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: ColorSet.grey,
    paddingBottom: 10,
  },
  selectTitle: {
    color: ColorSet.grey,
    fontFamily: FamilySet.regular,
    fontSize: 16,
  },
  arrowDownStyle: {
    resizeMode: 'contain',
    width: 20,
    height: 15,
  },
  mapLink: {
    display: 'flex',
    alignItems: 'center',
    paddingVertical: 3,
  },
  mapLinkText: {color: ColorSet.theme, fontWeight: 'bold'},
});
