import RNFetchBlob from 'rn-fetch-blob';
import {Platform} from 'react-native';
import {Helper} from '../../utils';
const downloadfile = (url: string) => {
  Helper.showToast('Starting download please wait');
  const {
    dirs: {DocumentDir},
  } = RNFetchBlob.fs;
  const newImgUri = url.lastIndexOf('/');
  const imageName = url.substring(newImgUri);
  const isIOS = Platform.OS === 'ios';
  const dirs = RNFetchBlob.fs.dirs;
  const aPath = Platform.select({
    ios: DocumentDir,
    android: dirs.PictureDir + imageName,
  });
  const ext = 'png';
  const randomNumbers = Math.floor(Math.random() * 500);
  const fileExt = `VenturaPhoto${randomNumbers}.png`;
  const fPath = `${aPath}/${fileExt}`;
  const configureOptions: any = Platform.select({
    ios: {
      fileCache: true,
      path: fPath,
      appendExt: ext,
    },
    android: {
      fileCache: true,
      appendExt: ext,
      indicator: true,
      IOSBackgroundTask: true,
      path: aPath,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: aPath,
        description: 'Image',
      },
    },
  });
  if (isIOS) {
    RNFetchBlob.config(configureOptions)
      .fetch('GET', url)
      .then(res => {
        RNFetchBlob.ios.previewDocument('file//' + res.path());
      });
    return;
  } else {
    RNFetchBlob.config(configureOptions)
      .fetch('GET', url)
      .then((res: any) => {
        RNFetchBlob.android.actionViewIntent('file://', res.path());
      })
      .catch(error => {
        console.log(error);
      });
  }
};
export default downloadfile;
