import React, {useEffect} from 'react';
import {
  StyleSheet,
  View,
  Image,
  StatusBar,
  ImageBackground,
} from 'react-native';
import appStyle from '../../styles/appStyle';
import {Screen} from '../../constants/screens/screens';
import {Images, Keys} from '../../constants';
import {getProfile} from '../../networking/Services';
import {useDispatch} from 'react-redux';
import {setUser, setRole, setItinerary} from '../../redux/common/common.slice';
import {Codes} from '../../constants/codes';
import {getDataFromStorage} from '../../utils/storage';
import {useTranslation} from 'react-i18next';
import {getItinerary} from '../../networking/Services';
import {Helper, isNetworkAvailable} from '../../utils';
import {TABLE_OFFLINE_NAME, getValueForKey} from '../../networking/DBConection';
import {DbKeys} from '../../constants/screens/dbKeys';

const SplashScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {i18n} = useTranslation();
  const dispatch = useDispatch();
  const getLang = async () => {
    const language = await getDataFromStorage(Keys.selectedLanguage);
    i18n.changeLanguage(language);
    return language;
  };
  const getUserRole = async () => {
    const userRole = await getDataFromStorage(Keys.userRole);
    dispatch(setRole(userRole));
  };
  const getItinerarys = async () => {
    const isOnline = await isNetworkAvailable();
    if (!isOnline) {
      return await getValueForKey(
        DbKeys.itinerary,
        updateOfflineItinerary,
        TABLE_OFFLINE_NAME,
      );
    }
    if (isOnline) {
      const response = await getItinerary();
      if (response) {
        const result = mapItinerary(response);
        dispatch(setItinerary(result));
      }
    }
  };
  const mapItinerary = data => {
    const tempUpcoming: any = [];
    const tempCompleted: any = [];
    data.map((item: any) => {
      Helper.compareDates(item?.date)
        ? tempUpcoming.push(item)
        : tempCompleted.push(item);
    });

    return {
      upComingItinerary: tempUpcoming,
      completedItinerary: tempCompleted,
    };
  };

  const updateOfflineItinerary = data => {
    const result = mapItinerary(data);
    dispatch(setItinerary(result));
  };

  const Authenticationcheck = async () => {
    const isOnline = await isNetworkAvailable();
    await getItinerarys();
    if (!isOnline) {
      return navigation.replace('TabOfflineNavigator');
    }
    const languageSelected = await getLang();
    await getUserRole();
    const response = await getProfile();
    if (response?.statusCode === Codes.SUCCESS) {
      if (
        response?.data?.fullName === null &&
        response?.data?.phoneNumber === null &&
        response?.data?.profilePicture === null
      ) {
        dispatch(setUser(response?.data));
        navigation.replace(Screen.EditProfile, {createProfile: true});
      } else {
        dispatch(setUser(response?.data));
        navigation.replace('TabNavigator');
      }
    } else {
      languageSelected
        ? navigation.replace(Screen.LoginScreen)
        : navigation.replace(Screen.LanguageSelection);
    }
  };
  useEffect(() => {
    Authenticationcheck();
  }, []);
  return (
    <ImageBackground style={appStyle.flex1} source={Images.splashBG}>
      <StatusBar hidden />
      <View style={[styles.container]}>
        <Image style={[styles.logo]} source={Images.logo} />
      </View>
      <View style={[appStyle.aiCenter, appStyle.pv10]}>
        <Image style={[styles.logoDetail]} source={Images.logoDetail} />
      </View>
    </ImageBackground>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    resizeMode: 'contain',
    width: 232,
    height: 70,
  },
  logoDetail: {
    resizeMode: 'contain',
    width: 173,
    height: 16,
  },
});
