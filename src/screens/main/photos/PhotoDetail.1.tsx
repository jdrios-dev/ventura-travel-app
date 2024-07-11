import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import FastImage from 'react-native-fast-image';
import appStyle from '../../../styles/appStyle';
import {ColorSet} from '../../../styles';
import {Header} from '../../../components/index';
import {useTranslation} from 'react-i18next';
import {sendPhotos} from '../../../networking/PhotosApiService';
import {Codes} from '../../../constants/codes';
import {Helper} from '../../../utils';
import {getItineraryDestinations} from '../../../networking/Services';
import {styles} from './PhotoDetail';

export const PhotoDetail: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  const {t, i18n} = useTranslation();
  const [destinationForDropdown, setDestinationForDropdown] = useState([]);

  const photo = route?.params?.items;

  const hideActions = route?.params?.hideActions;
  const imageUrl = photo?.url ? photo?.url : photo?.path;

  const [emailSendState, setEmailSendState] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const photoHandler = async (id: any) => {
    const isvalidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (isvalidEmail.test(email)) {
      const params = {
        email: email,
        id: id,
      };
      const response = await sendPhotos(params);
      if (response.statusCode === Codes.SUCCESS) {
        Helper.showToast(response.message);
        setEmailSendState(!emailSendState);
      } else {
        Helper.showToast(response.message);
      }
    } else {
      Helper.showToast(t('error_invalid-email'));
    }
  };
  const destinationToShow = destinationForDropdown.find(
    item => item?.id === photo?.location,
  )?.name;

  const getDestinationsNew = async () => {
    const response = await getItineraryDestinations();
    setDestinationForDropdown(response?.destinations);
  };

  useEffect(() => {
    getDestinationsNew();
  }, []);

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.goBack()}
        title={t('screen_common_photos')}
      />
      <FastImage source={{uri: imageUrl}} style={styles.imageStyle} />
      <Image />
      {/* <KeyboardAwareScrollView
              keyboardShouldPersistTaps="always"
              contentContainerStyle={appStyle.scrollContainer}>
              <View style={[appStyle.p25, appStyle.flex1, appStyle.jcSpaceBetween]}>
                <View>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate(Screen.ImageViewer, {items: photo})
                    }>
                    <FastImage source={{uri: imageUrl}} style={styles.imageStyle} />
                  </TouchableOpacity>
                  {photo?.title && (
                    <Text
                      style={[
                        styles.titleTextStyle,
                        appStyle.pt10,
                        {color: ColorSet.theme},
                      ]}>
                      {t('title')}
                    </Text>
                  )}
                  <Text style={[styles.titleTextStyle, appStyle.pt5]}>
                    {photo?.title}
                  </Text>
                  {photo?.description && (
                    <Text
                      style={[
                        styles.titleTextStyle,
                        appStyle.pt10,
                        {color: ColorSet.theme},
                      ]}>
                      {t('text_description')}
                    </Text>
                  )}
                  <Text style={[styles.titleTextStyle, appStyle.pt5]}>
                    {photo?.description}
                  </Text>
                  {photo?.date != '' && (
                    <Text
                      style={[
                        styles.titleTextStyle,
                        appStyle.pt10,
                        {color: ColorSet.theme},
                      ]}>
                      {t('date')}
                    </Text>
                  )}
                  <Text style={[styles.titleTextStyle, appStyle.pt5]}>
                    {dateFormator(
                      photo?.date,
                      getLocalizedDateFormat(i18n.language as Language),
                    )}
                  </Text>
                  {destinationToShow && (
                    <Text
                      style={[
                        styles.titleTextStyle,
                        appStyle.pt10,
                        {color: ColorSet.theme},
                      ]}>
                      {t('location')}
                    </Text>
                  )}
                  <Text style={[styles.titleTextStyle, appStyle.pt5]}>
                    {destinationToShow}
                  </Text>
                </View>
                {!hideActions && (
                  <View style={appStyle.pt10}>
                    <View style={appStyle.pb10}>
                      <Button onPress={() => downloadfile(imageUrl)}>
                        {t('button_download')}
                      </Button>
                    </View>
      
                    <View>
                      <Button
                        onPress={() => {
                          emailBottomRef.current?.setModalVisible(),
                            setEmail(''),
                            !emailSendState && setEmailSendState(true);
                        }}>
                        {t('button_sendMeInMail')}
                      </Button>
                    </View>
                  </View>
                )}
              </View>
            </KeyboardAwareScrollView> */}
      {/* <BottomSheet bottomSheetRef={emailBottomRef}>
              {emailSendState ? (
                <View>
                  <Text style={styles.titleTextStyle}>
                    {t('text_getPhotoToYourEmail')}
                  </Text>
                  <TextField
                    label={t('emailAdress')}
                    fontSize={16}
                    baseColor={ColorSet.grey}
                    tintColor={ColorSet.red}
                    onChangeText={(value: string) => setEmail(value)}
                  />
                  <View style={appStyle.pt10}>
                    <Button onPress={() => photoHandler(photo?.id)}>
                      {t('button_sendViaEmail')}
                    </Button>
                  </View>
                </View>
              ) : (
                <View>
                  <View style={appStyle.pv10}>
                    <Text style={styles.titleTextStyle}>
                      {t('text_photoHaveSentTo')}{' '}
                    </Text>
                    <Text style={styles.titleTextStyle}>{email}</Text>
                  </View>
                  <View style={appStyle.pt10}>
                    <Button
                      onPress={() => {
                        emailBottomRef.current?.setModalVisible(false),
                          setEmailSendState(!emailSendState);
                      }}>
                      {t('button_close')}
                    </Button>
                  </View>
                </View>
              )}
            </BottomSheet> */}
    </SafeAreaView>
  );
};
