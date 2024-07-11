import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Dashboard, DashboardTc, YourGuide} from '../screens';
import {Screen} from '../constants/screens/screens';
import {TABLE_OFFLINE_NAME, getValueForKey} from '../networking/DBConection';
import {DbKeys} from '../constants/screens/dbKeys';
const MyStack = createStackNavigator();

export const HomeStack = ({route}) => {
  const [userRole, setUserRole] = useState();
  const isOfflineMode = route?.params?.offlineMode;

  const getUserRole = async () => {
    getValueForKey(DbKeys.userRole, setUserRole, TABLE_OFFLINE_NAME);
  };

  useEffect(() => {
    getUserRole();
  }, []);
  return (
    <MyStack.Navigator
      initialRouteName={
        userRole === 'TC' ? Screen.DashboardTc : Screen.Dashboard
      }
      screenOptions={{headerShown: false}}>
      {userRole === 'TC' ? (
        <MyStack.Screen
          name={Screen.DashboardTc}
          component={DashboardTc}
          initialParams={{offlineMode: isOfflineMode}}
        />
      ) : (
        <MyStack.Screen
          name={Screen.Dashboard}
          component={Dashboard}
          initialParams={{offlineMode: isOfflineMode}}
        />
      )}
      {isOfflineMode && (
        <MyStack.Screen
          name={Screen.YourGuide}
          component={YourGuide}
          initialParams={{offlineMode: isOfflineMode}}
        />
      )}
    </MyStack.Navigator>
  );
};
