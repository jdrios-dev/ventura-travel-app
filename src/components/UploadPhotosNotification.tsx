import {View, Text, StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Screen} from '../constants';
import addDays from 'date-fns/addDays';
import isAfter from 'date-fns/isAfter';
import {
  getDays,
  getReservationGroupList,
  getSingleDay,
} from '../networking/Services';
import {DbKeys} from '../constants/screens/dbKeys';
import {useTranslation} from 'react-i18next';
import {useFocusEffect} from '@react-navigation/native';
import {getDataFromStorage} from '../utils/storage';

type UploadPhotosNotificationProps = {
  navigation: any;
};

const UploadPhotosNotification = ({
  navigation,
}: UploadPhotosNotificationProps) => {
  const {t} = useTranslation();
  const [allClients, setAllClients] = useState([]);
  const [clientsMissing, setClientsMissing] = useState(0);
  const [departuerStartDate, setDepartuerStartDate] = useState(Date.now());

  const getData = async () => {
    const data = await getReservationGroupList();
    const days = await getDays();

    const firstDayId = days?.find(day => day.day_number === 1)?.id;
    const firstDay = await getSingleDay(firstDayId, 1);

    setDepartuerStartDate(firstDay?.information?.startDate);

    setAllClients(data);
  };

  const readLocalUpdate = async () => {
    const clientsUpdatedX = await getDataFromStorage(DbKeys.updateClientList);
    setClientsMissing(allClients?.length - clientsUpdatedX);
  };

  const SHOW_BANNER_AFTER_X_DAYS = 7;
  const dateToShowBanner = addDays(
    new Date(departuerStartDate),
    SHOW_BANNER_AFTER_X_DAYS,
  );

  const showBanner =
    clientsMissing > 0 &&
    isAfter(new Date(Date.now()), new Date(dateToShowBanner));
  useEffect(() => {
    getData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      readLocalUpdate();
    }, []),
  );

  if (!showBanner) {
    return null;
  }
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(Screen.ClientProfileImages)}>
      <View style={styles.container}>
        <Text style={styles.text}>
          {t('banner_qty-client-photos-missing', {
            clientsMissing,
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 2,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UploadPhotosNotification;
