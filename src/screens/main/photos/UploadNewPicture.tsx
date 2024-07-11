import React, {createRef, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  Keyboard,
  Platform,
} from 'react-native';

import appStyle from '../../../styles/appStyle';
import Button from '../../../components/Button';
import {Icons} from '../../../constants';
import {ColorSet, FamilySet} from '../../../styles';
import {Header, BottomSheet} from '../../../components/index';
import {Screen} from '../../../constants/screens/screens';
import {screenHeight, screenWidth} from '../../../styles/screenSize';
import Loader from '../../../components/Loader';
import {CommonActions} from '@react-navigation/native';
import {TextField} from 'rn-material-ui-textfield';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {permissionCamera} from '../../../components/permissionManager/CameraPermission';
import {
  cameraImagePicker,
  libraryImagePicker,
} from '../../../components/uploadsManager/ImagePicker';
import {createPhoto} from '../../../networking/PhotosApiService';
import {useTranslation} from 'react-i18next';
import {Codes} from '../../../constants/codes';
import {Helper} from '../../../utils';
import DatePickerUpload from './children/DatePickerUpload';
import {getItineraryDestinations} from '../../../networking/Services';
const photoBottomRef = createRef<any>();
const UploadNewPicture: React.FC<{navigation: any}> = ({navigation}) => {
  const {t} = useTranslation();
  const [destinationDropdownView, setDestinationDropdownView] = useState(false);
  const [image, setImage] = useState('');
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescrition] = useState('');
  const [location, setLocation] = useState({name: null, id: null});
  const [dateView, setDateView] = useState(false);
  const [loading, setloading] = useState(false);
  const [allowToShare, setAllowToShare] = useState(false);
  const [destinationForDropdown, setDestinationForDropdown] = useState([]);
  const selectDate = (value: Date) => {
    Keyboard.dismiss();
    setDate(value.toDateString());
  };
  const addImage = async (type: number) => {
    photoBottomRef.current?.setModalVisible(false);
    const cropping = false;
    setTimeout(async () => {
      if (type === 1) {
        if (Platform.OS === 'android') {
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
    }, 1000);
  };
  const uploadPhoto = async () => {
    if (!title || !description || !image || !date || !location.id) {
      Helper.showToast(t('error_pleaseFillAllFields'));
      return;
    }
    const formdata = new FormData();
    if (image) {
      const uri = Platform.OS === 'ios' ? image.replace('file://', '') : image;
      const localUri = decodeURIComponent(uri);
      const filename = localUri.split('/').pop();
      const type = 'image/jpeg';
      const file: any =
        typeof {uri: localUri, name: filename, type} !== 'undefined'
          ? {uri: localUri, name: filename, type}
          : 0;
      formdata.append('file', file);
    }
    formdata.append('title', title);
    formdata.append('description', description);
    formdata.append('date', date);
    formdata.append('location', location.id);

    setloading(true);
    const response = await createPhoto(formdata);
    setloading(false);
    if (response.statusCode === Codes.SUCCESS) {
      Helper.showToast(response.message);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: Screen.Photos,
              params: {state: 2},
            },
          ],
        }),
      );
      return;
    }

    Helper.showToast('Something went wrong');
  };

  const getDestinationsNew = async () => {
    if (!destinationForDropdown.length) {
      const response = await getItineraryDestinations();
      setDestinationForDropdown(response?.destinations);
    }
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
        headerIconOne={Icons.notification}
        onPressheaderIconOne={() => navigation.navigate(Screen.Notification)}
      />
      <Loader isLoading={loading} layout={'outside'} />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <View style={[appStyle.ph25, appStyle.flex1]}>
          <TouchableOpacity
            onPress={() => photoBottomRef.current?.setModalVisible()}
            style={[appStyle.aiCenter, appStyle.pv20]}>
            <View style={styles.imageTopViewStyle}>
              {image === '' ? (
                <Image source={Icons.tabCamera} style={styles.cameraStyle} />
              ) : (
                <Image source={{uri: image}} style={styles.imageStyle} />
              )}
            </View>
            <Text style={styles.titleStyle}>{t('addPicture')}</Text>
          </TouchableOpacity>
          <TextField
            label={t('title')}
            fontSize={16}
            baseColor={ColorSet.grey}
            tintColor={ColorSet.red}
            onChangeText={(value: string) => setTitle(value)}
          />
          <TextField
            label={t('text_description')}
            fontSize={16}
            baseColor={ColorSet.grey}
            tintColor={ColorSet.red}
            onChangeText={(value: string) => setDescrition(value)}
          />
          <DatePickerUpload
            setDateView={setDateView}
            dateView={dateView}
            date={date}
            selectDate={selectDate}
          />

          <View style={styles.dropdownContainer}>
            <TextField
              label={t('location')}
              fontSize={16}
              value={location.name}
              baseColor={ColorSet.grey}
              editable={false}
              tintColor={ColorSet.red}
              renderRightAccessory={() => (
                <Image
                  source={
                    destinationDropdownView ? Icons.arrowUp : Icons.arrowDown
                  }
                  style={styles.arrowDownStyle}
                />
              )}
            />

            {/* TODO: Create a dropdown component
              this workaround is to improve the UX,the list will only show up
              if we press on the icon imagem not in the field
              Dani 16 Mar 2023
              */}
            <TouchableOpacity
              onPress={() =>
                setDestinationDropdownView(!destinationDropdownView)
              }
              style={styles.dropdown}
            />
            {destinationDropdownView && (
              <View style={[appStyle.flex1, appStyle.mv5]}>
                {destinationForDropdown.map(destination => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setLocation(destination);
                        setDestinationDropdownView(!destinationForDropdown);
                      }}
                      key={destination?.id}
                      style={appStyle.pv10}>
                      <Text style={{color: ColorSet.black}}>
                        {destination?.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
            <TouchableOpacity
              onPress={() => setAllowToShare(prev => !prev)}
              style={[appStyle.row, appStyle.pv15]}>
              <View style={styles.checkBoxView}>
                <Image
                  style={[styles.checkBox]}
                  source={allowToShare ? Icons.checkBox : Icons.emptyChexBox}
                />
              </View>
              <Text style={styles.checkboxLabelStyle}>
                {t('text_share-photos-message')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={appStyle.p20}>
          <Button
            disable={!allowToShare}
            onPress={() => {
              uploadPhoto();
            }}>
            {t('button_upload')}
          </Button>
        </View>
      </KeyboardAwareScrollView>
      <BottomSheet bottomSheetRef={photoBottomRef}>
        <View style={[appStyle.pb20, appStyle.pt10, appStyle.aiCenter]}>
          <Text style={styles.sheetTitleStyle}>
            {t('text_pleaseSelectOneOfThem')}
          </Text>
        </View>
        <View style={[appStyle.rowBtw]}>
          {/* <View style={{width: screenWidth.width40}}>
            <Button onPress={() => addImage(1)}>{t('button_takePhoto')}</Button>
          </View> */}
          {/*remove the take photo button,  temporal change requested by Alberto 26 apr 2023,  */}
          <View style={{width: screenWidth.width90}}>
            <Button onPress={() => addImage(2)}>
              {t('button_openLibrary')}
            </Button>
          </View>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default UploadNewPicture;

const styles = StyleSheet.create({
  selectLangTitle: {
    color: ColorSet.grey,
    fontFamily: FamilySet.regular,
    fontSize: 16,
  },
  dateViewStyle: {
    paddingVertical: 20,
    borderBottomWidth: 0.2,
    borderBottomColor: ColorSet.grey,
    paddingBottom: 10,
  },
  imageTopViewStyle: {
    width: screenWidth.width55,
    height: screenHeight.height25,
    borderColor: ColorSet.themeLight,
    borderWidth: 1,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    width: screenWidth.width55,
    height: screenHeight.height25,
    borderColor: ColorSet.themeLight,
    borderWidth: 1,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'stretch',
  },
  titleStyle: {
    fontSize: 12,
    fontFamily: FamilySet.regular,
    color: ColorSet.grey,
    paddingRight: 5,
    paddingTop: 5,
  },
  cameraStyle: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  sheetTitleStyle: {
    color: ColorSet.secondary,
    fontSize: 18,
    fontFamily: FamilySet.bold,
  },
  arrowDownStyle: {
    resizeMode: 'contain',
    width: 20,
    height: 15,
  },
  dropdown: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  dropdownContainer: {
    position: 'relative',
  },
  checkBox: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  checkBoxView: {
    paddingRight: 10,
    paddingTop: 3,
  },
  checkboxLabelStyle: {
    color: ColorSet.grey,
    fontFamily: FamilySet.regular,
    fontSize: 16,
    flex: 1,
    flexWrap: 'wrap',
    marginRight: 6,
  },
});
