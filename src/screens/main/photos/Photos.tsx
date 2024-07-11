import React, {useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {useTranslation} from 'react-i18next';
import appStyle from '../../../styles/appStyle';
import {ColorSet, FamilySet} from '../../../styles';
import {Header, Button, HelperLabel} from '../../../components/index';
import {screenWidth} from '../../../styles/screenSize';
import {Screen} from '../../../constants/screens/screens';
import {
  selecMytripPhoto,
  selectMyPhotos,
} from '../../../redux/common/common.selectors';
import {setMyPhotos, setTripPhotos} from '../../../redux/common/common.slice';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../../components/Loader';
import {
  getMyPhotos,
  getMyTripPhotos,
} from '../../../networking/PhotosApiService';
import {Codes} from '../../../constants/codes';
import {selectRole} from '../../../redux/common/common.selectors';
import {Helper} from '../../../utils';
import SendAlbum from './children/SendAlbum';
import {Icons} from '../../../constants';
const Photos: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  const currentState = route?.params?.state;
  const dispatch = useDispatch();
  const myphotos = useSelector(selectMyPhotos);
  const userRole = useSelector(selectRole);
  const myTripphotos = useSelector(selecMytripPhoto);
  const {t} = useTranslation();
  const [loading, setloading] = React.useState(true);

  const [activeState, setActiveState] = React.useState(
    currentState ? currentState : 1,
  );
  const updateState = (type: number) => {
    if (type === 1) {
      setActiveState(1);
    }
    if (type === 2) {
      setActiveState(2);
    }
    if (type === 3) {
      setActiveState(3);
    }
  };
  const getPhotos = async () => {
    setloading(true);
    const myPhotosResponse = await getMyPhotos();
    const myTripPhotoRespone = await getMyTripPhotos();
    setloading(false);
    if (myPhotosResponse.statusCode === Codes.SUCCESS) {
      dispatch(setMyPhotos(myPhotosResponse?.data));
    } else {
      Helper.showToast(myPhotosResponse.message);
    }

    if (myTripPhotoRespone.statusCode === Codes.SUCCESS) {
      dispatch(setTripPhotos(myTripPhotoRespone?.data));
    } else {
      // Toast.show(myTripPhotoRespone.message)
    }
  };
  useEffect(() => {
    getPhotos();
  }, []);

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header title={t('screen_common_photos')} showProfile />
      {userRole === 'TC' && (
        <View style={[appStyle.row, appStyle.p25]}>
          <TouchableOpacity
            testID="photosTabTripPhotos"
            onPress={() => updateState(1)}
            style={[
              styles.tabStyle,
              {
                borderBottomColor:
                  activeState === 1 ? ColorSet.theme : ColorSet.grayLight,
              },
            ]}>
            <Text
              style={[
                styles.tabLableStyle,
                {color: activeState === 1 ? ColorSet.theme : ColorSet.grey},
              ]}>
              {t('local_common_TripPictures')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="photosTabPhotos"
            onPress={() => updateState(2)}
            style={[
              styles.tabStyle,
              {
                borderBottomColor:
                  activeState === 2 ? ColorSet.theme : ColorSet.grayLight,
              },
            ]}>
            <Text
              style={[
                styles.tabLableStyle,
                {color: activeState === 2 ? ColorSet.theme : ColorSet.grey},
              ]}>
              {t('label_travel-reports')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="photosTabPhotos"
            onPress={() => updateState(3)}
            style={[
              styles.tabStyle,
              {
                borderBottomColor:
                  activeState === 3 ? ColorSet.theme : ColorSet.grayLight,
              },
            ]}>
            <Text
              style={[
                styles.tabLableStyle,
                {color: activeState === 3 ? ColorSet.theme : ColorSet.grey},
              ]}>
              {t('local_common_label-album')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <Loader isLoading={loading} layout={'outside'} />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <View style={[appStyle.ph25, appStyle.flex1]}>
          {activeState === 1 &&
            (myTripphotos?.length > 0 ? (
              <View style={[appStyle.flex1, appStyle.rowWrap, appStyle.pt10]}>
                {myTripphotos.map((item: any, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate(Screen.PhotoDetail, {items: item})
                      }
                      key={index}
                      style={[appStyle.ph5, {paddingLeft: 0}]}>
                      <FastImage
                        style={[styles.imageView]}
                        source={{uri: item?.path}}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              !loading && (
                <HelperLabel
                  text={t('text_trip-photos-help-text')}
                  icon={Icons.imageLight}
                />
              )
            ))}

          {activeState === 2 &&
            (myphotos?.length > 0 ? (
              <View style={[appStyle.flex1, appStyle.rowWrap, appStyle.pt10]}>
                {myphotos.map((item: any, index) => {
                  return (
                    <TouchableOpacity
                      style={[appStyle.ph5, {paddingLeft: 0}]}
                      onPress={() => {
                        navigation.navigate(Screen.PhotoDetail, {items: item});
                      }}
                      key={index}>
                      <FastImage
                        style={[styles.imageView]}
                        source={{uri: item?.path}}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              !loading && (
                <HelperLabel
                  text={
                    userRole === 'CLIENT'
                      ? t('text_travel-report-client-help-text')
                      : t('text_travel-report-tc-help-text')
                  }
                  icon={Icons.cameraLight}
                />
              )
            ))}

          {activeState === 3 && (
            <View style={[appStyle.flex1, appStyle.rowWrap, appStyle.pt10]}>
              <SendAlbum />
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
      {activeState === 2 && (
        <View style={appStyle.p20}>
          <Button
            testID="photosUploadPhotoButton"
            onPress={() => navigation.navigate(Screen.UploadNewPicture)}>
            {t('button_upload')}
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Photos;

const styles = StyleSheet.create({
  imageView: {
    marginBottom: 10,
    width: screenWidth.width100 / 3.5 - 5,
    height: screenWidth.width100 / 3.5 - 5,
    resizeMode: 'cover',
  },
  tabLableStyle: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
  },
  tabStyle: {
    width: screenWidth.width45,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    flex: 1,
  },
});
