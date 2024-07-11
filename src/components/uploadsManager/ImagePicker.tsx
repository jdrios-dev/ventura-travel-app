import ImagePicker from 'react-native-image-crop-picker';
export const cameraImagePicker = async (cropping: boolean) => {
  const response = await ImagePicker.openCamera({
    mediaType: 'photo',
    cropping: cropping,
  }).then(image => {
    return image;
  });
  return response;
};
export const libraryImagePicker = async (cropping: boolean) => {
  const response = await ImagePicker.openPicker({
    mediaType: 'photo',
    cropping: cropping,
  }).then(image => {
    return image;
  });
  return response;
};
