import {
  SafeAreaView,
  StatusBar,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Header, NewMessage} from '../../../components';
import {ColorSet, appStyle} from '../../../styles';
import {useTranslation} from 'react-i18next';
import {getReservationGroupList} from '../../../networking/Services';
import {Icons, Images, Keys, Screen} from '../../../constants';
import {View} from 'react-native';
import {
  TABLE_CONFIG_NAME,
  getValueForKey,
} from '../../../networking/DBConection';
import {DbKeys} from '../../../constants/screens/dbKeys';
import {getDataFromStorage, storeDataToStorage} from '../../../utils/storage';

type ClientProfileImagesProps = {
  navigation: any;
};

type ReservationGroupType = {
  id: string;
  names: string;
  mainBookerId: string;
};

const ExpanationBanner = ({onClose, t}) => {
  return (
    <View style={styles.bannerContainer}>
      <Text style={styles.bannerText}>
        {t('text_update-client-photo-explanation')}
      </Text>
      <TouchableOpacity style={styles.bannerClose} onPress={onClose}>
        <Text style={styles.bannerCloseText}>x</Text>
      </TouchableOpacity>
    </View>
  );
};

const getNotificationColorByStatus = (statusDenied: boolean): string => {
  if (typeof statusDenied === 'undefined') return 'red';
  return statusDenied ? 'grey' : 'green';
};

const reservationItem = ({item}, navigation, reservationListLocal) => {
  const localItem = reservationListLocal?.find(i => i.id === item.mainBookerId);

  return (
    <NewMessage
      onPressIcon={() =>
        navigation.navigate(Screen.ClientProfileImagesDetail, {
          id: item.mainBookerId,
          names: item.names,
          localItem,
        })
      }
      image={localItem?.path || Images.dummyTwo}
      name={item.names}
      icon={Icons.arrowRightRed}
      notificationColor={getNotificationColorByStatus(localItem?.photoDenied)}
    />
  );
};

const ClientProfileImages = ({navigation}: ClientProfileImagesProps) => {
  const {t} = useTranslation();
  const [reservationList, setReservationList] = useState<
    ReservationGroupType[]
  >([]);
  const [showExplanationBanner, setShowExplanationBanner] = useState(true);
  const [reservationListLocal, setReservationListLocal] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const getData = async () => {
    setRefreshing(true);
    const data = await getReservationGroupList();
    await getValueForKey(
      DbKeys.updateClientList,
      val => setReservationListLocal(JSON.parse(val === null ? [] : val)),
      TABLE_CONFIG_NAME,
    );
    setReservationList(data);
    setRefreshing(false);
  };
  const checkBanner = async () => {
    const bannerShown = await getDataFromStorage(
      Keys.updateClientImageBannerShown,
    );
    if (bannerShown) {
      setShowExplanationBanner(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    checkBanner();
  }, []);

  const handleShowExplanationBanner = async () => {
    await storeDataToStorage(Keys.updateClientImageBannerShown, true);
    setShowExplanationBanner(false);
  };

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.goBack()}
        title={t('client-update-profile-title')}
      />
      <View style={[appStyle.ph25, appStyle.flex1, appStyle.pt30]}>
        <FlatList
          ListHeaderComponent={
            showExplanationBanner ? (
              <ExpanationBanner onClose={handleShowExplanationBanner} t={t} />
            ) : null
          }
          data={reservationList}
          renderItem={item =>
            reservationItem(item, navigation, reservationListLocal)
          }
          keyExtractor={item => item?.id}
          onRefresh={getData}
          refreshing={refreshing}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bannerText: {
    fontSize: 16,
    color: ColorSet.textBase,
    width: '90%',
  },
  bannerContainer: {
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: ColorSet.theme,
    backgroundColor: ColorSet.themeExtraLight,
    padding: 10,
    borderRadius: 5,
  },
  bannerClose: {
    width: '10%',
    justifyContent: 'center',
  },
  bannerCloseText: {
    fontSize: 24,
    textAlign: 'center',
    color: ColorSet.textBase,
  },
});

export default ClientProfileImages;
