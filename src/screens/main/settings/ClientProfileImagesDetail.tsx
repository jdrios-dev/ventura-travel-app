import {
  Text,
  SafeAreaView,
  StatusBar,
  Platform,
  View,
  Image,
  StyleSheet,
  Switch,
} from 'react-native';
import React, {createRef, useEffect, useState} from 'react';
import Toast from 'react-native-simple-toast';
import {
  ColorSet,
  FamilySet,
  appStyle,
  screenHeight,
  screenWidth,
} from '../../../styles';
import {BottomSheet, Button, Header, Loader} from '../../../components';
import {useTranslation} from 'react-i18next';
import {permissionCamera} from '../../../components/permissionManager/CameraPermission';
import {
  cameraImagePicker,
  libraryImagePicker,
} from '../../../components/uploadsManager/ImagePicker';
import {Icons} from '../../../constants';
import {updateClientPhoto} from '../../../networking/Services';
import {
  TABLE_CONFIG_NAME,
  getDBConnection,
  getValueForKey,
  saveDbValue,
} from '../../../networking/DBConection';
import {DbKeys} from '../../../constants/screens/dbKeys';
import {storeDataToStorage} from '../../../utils/storage';
import {Colors} from 'react-native/Libraries/NewAppScreen';
const photoBottomRef = createRef<any>();
const isAndroid = Platform.OS === 'android';

const ClientProfileImagesDetail = ({navigation, route}) => {
  const {t} = useTranslation();
  const {params} = route;
  const {id: mainBookerId, names, localItem} = params;

  const [image, setImage] = useState<any>(localItem?.path || null);
  const [loading, setLoading] = useState<boolean>(false);
  const [clientDenied, setClientDenied] = useState(
    localItem?.photoDenied || false,
  );
  const [reservationListLocal, setReservationListLocal] = useState([]);

  const updateLocalClientDB = async (
    clientId: string,
    isPhotoDenied: boolean,
    previousItems: any[],
    imagePath: string | null,
  ) => {
    const db = await getDBConnection();
    const existingClientIndex = previousItems?.findIndex(
      i => i?.id === clientId,
    );

    let newData = [...previousItems];

    if (existingClientIndex !== -1) {
      newData[existingClientIndex] = {
        id: clientId,
        photoDenied: isPhotoDenied,
        path: imagePath,
      };
    } else {
      newData = [
        ...newData,
        {id: clientId, photoDenied: isPhotoDenied, path: imagePath},
      ];

      await storeDataToStorage(DbKeys.updateClientList, newData?.length);
    }

    await saveDbValue(
      db,
      DbKeys.updateClientList,
      JSON.stringify(newData),
      TABLE_CONFIG_NAME,
    );
  };

  const addImage = async (type: number) => {
    photoBottomRef.current?.setModalVisible(false);
    const cropping = false;
    setTimeout(async () => {
      if (type === 1) {
        if (isAndroid) {
          const granted = await permissionCamera();
          if (granted) {
            const res = await cameraImagePicker(cropping);
            setImage(res.path);
          }
          return;
        }
        const res = await cameraImagePicker(cropping);
        setImage(res.path);
        return;
      }
      const res = await libraryImagePicker(cropping);
      setImage(res.path);
    }, 500);
  };
  const getData = async () => {
    await getValueForKey(
      DbKeys.updateClientList,
      val => setReservationListLocal(JSON.parse(val === null ? [] : val)),
      TABLE_CONFIG_NAME,
    );
  };
  const sendImage = async () => {
    try {
      setLoading(true);
      const res = await updateClientPhoto(mainBookerId, image);

      if (res?.statusCode === 200) {
        Toast.show(t('send_client-update-photo-msg'));
        await updateLocalClientDB(
          mainBookerId,
          false,
          reservationListLocal,
          image,
        );
      }

      setImage(null);
      setLoading(false);
    } catch (error) {
      Toast.show(t('send_album-error-msg'));
      setLoading(false);
      // eslint-disable-next-line no-console
      console.log('SEND CLIENT IMAGE ERROR:', error);
    }
  };

  const handleClienteDenied = async () => {
    await updateLocalClientDB(mainBookerId, true, reservationListLocal, null);
    setClientDenied(prev => !prev);
  };
  // const handleDeleteRow = async () => {
  //   const db = await getDBConnection();
  //   await deleteRow(db, DbKeys.updateClientList, TABLE_CONFIG_NAME);
  // };
  useEffect(() => {
    // handleDeleteRow();
    getData();
  }, []);

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.goBack()}
        title={t('client-update-profile-title')}
      />
      <View
        style={[
          appStyle.ph25,
          appStyle.flex1,
          appStyle.aiCenter,
          appStyle.pt10,
        ]}>
        <Text style={styles.namesTitle}>{names}</Text>
        <View style={styles.imageTopViewStyle}>
          {image === null ? (
            <Image source={Icons.tabCamera} />
          ) : (
            <Image source={{uri: image}} style={styles.imageStyle} />
          )}
        </View>
        <Text style={styles.namesText}>
          {t('label_upload-client-explanation')}
        </Text>
        <View style={[appStyle.mb10, appStyle.w100]}>
          <Button
            disable={clientDenied}
            onPress={() => photoBottomRef.current?.setModalVisible()}>
            {t(localItem?.path ? 'button_change-photo' : 'button_select-photo')}
          </Button>
        </View>

        <BottomSheet bottomSheetRef={photoBottomRef}>
          <View style={[appStyle.pb20, appStyle.pt10, appStyle.aiCenter]}>
            <Text style={styles.sheetTitleStyle}>
              {t('text_pleaseSelectOneOfThem')}
            </Text>
          </View>
          <View style={[appStyle.rowBtw]}>
            <View style={{width: screenWidth.width40}}>
              <Button onPress={() => addImage(1)}>
                {t('button_takePhoto')}
              </Button>
            </View>
            <View style={{width: screenWidth.width40}}>
              <Button onPress={() => addImage(2)}>
                {t('button_openLibrary')}
              </Button>
            </View>
          </View>
        </BottomSheet>
        <View style={[appStyle.flex1, appStyle.w100]}>
          <Loader isLoading={loading} layout={'outside'} />
        </View>

        <View style={[appStyle.w100, appStyle.mb10]}>
          <View style={[appStyle.rowBtw, appStyle.mb10]}>
            <Text style={styles.namesText}>
              {t('toggle_client-denies-photo')}
            </Text>
            <Switch
              trackColor={{
                true: ColorSet.themeLight,
                false: ColorSet.grayMedium,
              }}
              onValueChange={handleClienteDenied}
              value={clientDenied}
              thumbColor={clientDenied ? ColorSet.theme : ColorSet.grayLight}
            />
          </View>
          <Button disable={!image} onPress={() => sendImage()}>
            {t('button_save')}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageTopViewStyle: {
    width: screenWidth.width90,
    height: screenHeight.height25,
    borderColor: ColorSet.themeLight,
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  imageStyle: {
    width: screenWidth.width90,
    height: screenHeight.height25,
    borderColor: ColorSet.themeLight,
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetTitleStyle: {
    color: ColorSet.secondary,
    fontSize: 18,
    fontFamily: FamilySet.bold,
  },
  namesTitle: {
    marginBottom: 10,
    fontSize: 18,
    color: ColorSet.textBase,
  },
  namesText: {
    marginBottom: 10,
    fontSize: 16,
    color: ColorSet.textBase,
  },
});

export default ClientProfileImagesDetail;
