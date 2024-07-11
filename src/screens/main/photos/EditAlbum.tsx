import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {deleteAlbumPhoto, getAlbumPhotos} from '../../../networking/Services';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/common/common.selectors';
import FastImage from 'react-native-fast-image';
import {Header} from '../../../components';
import {ColorSet, appStyle} from '../../../styles';
import {Icons} from '../../../constants';
import {useTranslation} from 'react-i18next';

const RenderItem = ({item, departureId, refreshCallback}) => {
  const {t} = useTranslation();
  return (
    <View style={styles.itemContainer}>
      <FastImage source={{uri: item?.url}} style={styles.tinyImage} />
      <View style={styles.itemNameContainer}>
        <Text style={styles.itemNameText}>{item?.name}</Text>
      </View>
      <TouchableOpacity
        onPress={() => showAlert(item?.name, departureId, refreshCallback, t)}>
        <FastImage source={Icons.delete} style={styles.iconStyle} />
      </TouchableOpacity>
    </View>
  );
};

const showAlert = (
  imageName: string,
  departureId: number,
  refreshCallback: () => void,
  t: any,
) =>
  Alert.alert(
    t('alert_delete-image-from-album'),
    t('label_delete-image-confirmation-description'),
    [
      {
        text: t('touchable_cancel'),
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: t('text_delete'),
        onPress: async () => {
          refreshCallback();
          await deleteAlbumPhoto(departureId, imageName);
        },
        style: 'destructive',
      },
    ],
    {
      cancelable: true,
      onDismiss: () => null,
    },
  );

const handleEmpty = t => {
  return <Text style={styles.noData}>{t('msg_no-photos-available')}</Text>;
};

const EditAlbum = ({navigation}) => {
  const {t} = useTranslation();
  const [imagesUrls, setImagesUrls] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const {departureId}: any = useSelector(selectUser);
  const getData = useCallback(async () => {
    try {
      setRefreshing(true);
      const data = await getAlbumPhotos(departureId);
      const filesUrl = data?.data?.filesUrl;
      setImagesUrls(filesUrl);
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
      Alert.alert(t('send_album-error-msg'), error.message);
    }
  }, [departureId, t]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        title="Album"
        back
        onPressBack={() => navigation.goBack()}
        showProfile
      />
      <FlatList
        keyExtractor={item => item.name}
        data={imagesUrls}
        renderItem={({item}) => (
          <RenderItem
            item={item}
            departureId={departureId}
            refreshCallback={getData}
          />
        )}
        ListEmptyComponent={() => handleEmpty(t)}
        onRefresh={getData}
        refreshing={refreshing}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  tinyImage: {
    width: 100,
    height: 100,
    borderWidth: 1,
  },
  itemContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingHorizontal: 5,
  },
  itemNameContainer: {
    width: '60%',
  },
  itemNameText: {
    textAlign: 'left',
    color: ColorSet.textBase,
  },
  iconStyle: {
    width: 23,
    height: 23,
    resizeMode: 'contain',
    marginRight: 5,
  },
  noData: {
    width: '100%',
    textAlign: 'center',
    marginVertical: 100,
    fontSize: 18,
    color: ColorSet.textBase,
  },
});

export default EditAlbum;
