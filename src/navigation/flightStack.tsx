import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {FlightDetailScreen, FlightScreen} from '../screens';
import {Screen} from '../constants/screens/screens';

const MyStack = createStackNavigator();
export const FlightStack = ({route}: any) => {
  const isOfflineMode = route?.params?.offlineMode;
  return (
    <MyStack.Navigator
      initialRouteName={Screen.FlightScreen}
      screenOptions={{headerShown: false}}>
      <MyStack.Screen
        name={Screen.FlightScreen}
        component={FlightScreen}
        initialParams={{offlineMode: isOfflineMode}}
      />
      <MyStack.Screen
        name={Screen.FlightDetailScreen}
        component={FlightDetailScreen}
        initialParams={{offlineMode: isOfflineMode}}
      />
    </MyStack.Navigator>
  );
};
