import Config from 'react-native-config';
import React, {Suspense, useCallback, useEffect} from 'react';
import {View, StatusBar, LogBox, Text} from 'react-native';
import appStyle from './src/styles/appStyle';
import {Stack} from './src/navigation/mainNavigator';
import store from './src/redux/store';
import {Provider} from 'react-redux';
import rudderClient from '@rudderstack/rudder-sdk-react-native';
import {
  TABLE_CONFIG_NAME,
  TABLE_OFFLINE_NAME,
  createTable,
  getDBConnection,
} from './src/networking/DBConection';

LogBox.ignoreAllLogs(true);
function App() {
  useEffect(() => {
    const initRudder = async () => {
      await rudderClient.setup(Config.WRITE_KEY_RUDDERSTACK, {
        dataPlaneUrl: Config.DATA_PLANE_URL_RUDDERSTACK,
      });
    };
    // eslint-disable-next-line no-console
    initRudder().catch(console.error);
  }, []);

  const loadDataCallback = useCallback(async () => {
    const db = await getDBConnection();

    await createTable(db, TABLE_OFFLINE_NAME);
    await createTable(db, TABLE_CONFIG_NAME);
  }, []);

  useEffect(() => {
    loadDataCallback();
  }, [loadDataCallback]);

  return (
    <View style={appStyle.flex1}>
      <Suspense fallback={<Text>Loading... </Text>}>
        <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
        <Provider store={store}>
          <Stack />
        </Provider>
      </Suspense>
    </View>
  );
}

export default App;
