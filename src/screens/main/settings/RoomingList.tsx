import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
  SafeAreaView,
} from 'react-native';

import appStyle from '../../../styles/appStyle';
import {Icons} from '../../../constants';
import {ColorSet, FamilySet} from '../../../styles';
import {Header} from '../../../components/index';
import {Screen} from '../../../constants/screens/screens';
import {useTranslation} from 'react-i18next';
import {getRooms} from '../../../networking/Services';
import Loader from '../../../components/Loader';
const RoomingList: React.FC<{navigation: any}> = ({navigation}) => {
  const {t} = useTranslation();
  const [rooms, setRooms] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const renderItem = ({item}) => (
    <View style={styles.roomsView}>
      <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
        <Text style={styles.titleStyle}>{t('label_name')}</Text>
        <Text style={styles.infoTextStyle}>
          {item?.firstName + ' ' + item.lastName}
        </Text>
      </View>
      <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
        <Text style={styles.titleStyle}>{t('label_room-type')}</Text>
        <Text style={styles.infoTextStyle}>{item?.roomType}</Text>
      </View>
      <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
        <Text style={styles.titleStyle}>{t('label_room-number')}</Text>
        <Text style={styles.infoTextStyle}>{item?.roomNumber}</Text>
      </View>
    </View>
  );

  const getRoomsList = async () => {
    setLoading(true);
    const response = await getRooms();
    setLoading(false);
    if (response) {
      setRooms(response);
    }
  };
  useEffect(() => {
    getRoomsList();
  }, []);
  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <Loader isLoading={loading} layout={'outside'} />
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.goBack()}
        title={t('title_rooming-list')}
        // headerIconTwo={Icons.notification}
        // onPressheaderIconTwo={() => navigation.navigate(Screen.Notification)}
      />
      <View
        style={[
          appStyle.ph25,
          appStyle.flex1,
          appStyle.pt30,
          appStyle.jcCenter,
        ]}>
        {rooms.length === 0 && !loading ? (
          <View
            style={[
              appStyle.p25,
              appStyle.flex1,
              appStyle.aiCenter,
              appStyle.jcCenter,
            ]}>
            <Text style={styles.titleTextStyle}>
              {t('text_no-rooms-available')}
            </Text>
          </View>
        ) : (
          <FlatList
            data={rooms}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default RoomingList;

const styles = StyleSheet.create({
  roomsView: {
    width: '100%',
    height: 120,
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
    fontFamily: FamilySet.regular,
  },
  titleStyle: {
    color: ColorSet.theme,
    fontSize: 14.5,
    fontFamily: FamilySet.bold,
  },
  titleTextStyle: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
    color: ColorSet.secondary,
    paddingBottom: 5,
  },
});
