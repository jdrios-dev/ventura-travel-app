import {PermissionsAndroid} from 'react-native';
import {Helper} from '../../utils';
export const permissionCamera = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'VenturaTravel Camera Permission',
        message:
          'VenturaTravel App needs access to your camera ' +
          'so you can upload Photos.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return granted;
    }
    Helper.showToast('Please go to setting and turn on media permission');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('ERROR-CAMERA-PERMISSION', err);
  }
};
