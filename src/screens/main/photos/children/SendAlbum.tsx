import React, {useState, useCallback, useEffect} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-simple-toast';
import * as ImagePicker from 'react-native-image-picker';
import Button from '../../../../components/Button';
import {ColorSet, appStyle} from '../../../../styles';
import {
  confirmAllPhotosAlbum,
  getPhotoAlbumStatus,
  getSignedUrlPhotos,
} from '../../../../networking/Services';
import {
  selectAlbumTemp,
  selectUser,
} from '../../../../redux/common/common.selectors';
import {Icons, Screen} from '../../../../constants';
import ConfirmationModal from './ConfirmationModal';
import {
  setAlbumTemp,
  setRemoveAlbumPhoto,
} from '../../../../redux/common/common.slice';
import UnconfirmAlbum from './UnconfirmAlbum';
import {HelperLabel} from '../../../../components';
import {useNavigation} from '@react-navigation/native';

/* toggle includeExtra */
const includeExtra = true;

const SendAlbum = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user: any = useSelector(selectUser);
  const {departureId} = user;
  const [isSending, setIsSending] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isAlbumConfirmed, setIsAlbumConfirmed] = useState(false);
  const [uploadedProgress, setUploadedProgress] = useState('0%');
  const albumTempFromStorage = useSelector(selectAlbumTemp);

  const handleChangeImages = useCallback(async (type, options) => {
    try {
      const result = await ImagePicker.launchImageLibrary(options);
      dispatch(setAlbumTemp(result.assets as []));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }, []);

  const handleRemove = (id: string) => {
    const tempImages = albumTempFromStorage?.filter(item => item.id !== id);
    dispatch(setRemoveAlbumPhoto(tempImages as []));
  };

  const handleSendImages = async (confirmAllPhotos: boolean) => {
    if (!albumTempFromStorage || !albumTempFromStorage.length) {
      return null;
    }

    setIsSending(true);
    const images = albumTempFromStorage.map(item => item?.fileName);

    // obtain the signed urls for each individual image:
    const result = await getSignedUrlPhotos(departureId, images);

    // this check is optional, but could be a good start to detect some bugs:
    if (result.data?.signedUrls?.length !== images.length) {
      throw new Error(
        'Something went wrong while trying to upload the photos.',
      );
    }

    const uploadPhotosPromises = result.data.signedUrls.map(
      async ({fileName, signedUrl}) => {
        if (signedUrl) {
          const image = albumTempFromStorage.find(
            item => item?.fileName === fileName,
          );

          return new Promise((resolve, reject) => {
            const uploadTask = RNFetchBlob.fetch(
              'PUT',
              signedUrl,
              {
                'Content-Type': 'image/jpeg',
              },
              RNFetchBlob.wrap(
                Platform.OS === 'ios'
                  ? image?.uri?.replace('file://', '')
                  : image?.uri,
              ),
            ).uploadProgress({interval: 250}, (written, total) => {
              const progress = (written / total) * 100;
              // Here you can update your progress indicator or do something with the progress value
              setUploadedProgress(progress.toFixed(2));
            });

            uploadTask
              .then(resp => {
                // Handle the response if needed

                resolve(resp);
              })
              .catch(err => {
                // Handle errors
                reject(err);
              });
          });
        }
      },
    );

    try {
      await Promise.all(uploadPhotosPromises);
      setIsSending(false);
      Toast.show(t('send_album-success-msg'));
      // All uploads completed successfully
    } catch (error) {
      // Handle errors that occurred during uploads
      console.error('Error sending images:', error);
      setIsSending(false);
      Toast.show(t('send_album-error-msg'));
    }

    dispatch(setRemoveAlbumPhoto([]));
    setModalVisible(false);
    // now that all the images were saved in the GCS bucket, we can confirm that the photo album images were uploaded, so the zip generation can be triggered:
    if (confirmAllPhotos) {
      await confirmAllPhotosAlbum(departureId, true);
      setIsAlbumConfirmed(true);
    }
  };

  useEffect(() => {
    const getStatus = async () => {
      const result = await getPhotoAlbumStatus(departureId);
      setIsAlbumConfirmed(result?.is_photo_album_upload_confirmed);
      return result?.is_photo_album_upload_confirmed;
    };
    getStatus();
  }, [departureId]);

  if (isSending) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={ColorSet.theme} />
        <Text style={styles.loadingText}>
          {t('label_send-album-wait')} ({uploadedProgress}%)
        </Text>
      </View>
    );
  }

  return (
    <View style={[appStyle.flex1, {position: 'relative'}]}>
      <View style={styles.editButtonContainer}>
        <Button onPress={() => navigation.navigate(Screen.EditAlbum)}>
          <Text>{t('button_edit-album')}</Text>
        </Button>
      </View>
      {!!albumTempFromStorage?.length ? (
        <ScrollView style={{flex: 1}}>
          <View style={styles.imageContainer}>
            {albumTempFromStorage?.map(
              ({uri, id}: {uri: string; id: string}) => (
                <View key={uri}>
                  <Image
                    resizeMode="cover"
                    resizeMethod="scale"
                    style={styles.image}
                    source={{uri: uri}}
                  />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemove(id)}>
                    <View>
                      <Image
                        source={Icons.close}
                        style={{width: 30, height: 30}}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              ),
            )}
          </View>
        </ScrollView>
      ) : (
        <HelperLabel
          text={t('text_album-help-text')}
          icon={Icons.cameraLight}
        />
      )}

      {isAlbumConfirmed ? (
        <UnconfirmAlbum setIsAlbumConfirmed={setIsAlbumConfirmed} />
      ) : (
        <>
          <View style={{marginBottom: 5}}>
            <Button
              onPress={() =>
                handleChangeImages('library', {
                  selectionLimit: 10,
                  mediaType: 'photo',
                  includeBase64: false,
                  includeExtra,
                })
              }>
              {t('button_openLibrary')}
            </Button>
          </View>

          <Button
            disable={albumTempFromStorage.length < 1}
            onPress={() => setModalVisible(prev => !prev)}>
            {t('button_send-album')}
          </Button>
        </>
      )}

      <ConfirmationModal
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
        quantityOfPhotos={albumTempFromStorage?.length}
        handleSendImages={handleSendImages}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  imageContainer: {
    minWidth: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 5,
    marginRight: 5,
  },
  removeButton: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 5,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    borderRadius: 50,
    right: 10,
    top: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: ColorSet.textBase,
  },
  fabButton: {position: 'absolute', bottom: 0, right: 0, margin: 20},
  fabContainer: {
    backgroundColor: ColorSet.theme,
    height: 60,
    width: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  fabIcon: {
    width: 50,
    height: 50,
  },
  editButtonContainer: {
    marginBottom: 16,
  },
});

export default SendAlbum;
