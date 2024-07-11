import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  AddNotes,
  DayDetails,
  EmergencyContact,
  Engagement,
  Faq,
  GuidePlan,
  Health,
  HealthFormSigning,
  MoreInformation,
  MyTrip,
  PassengerInfo,
  Summary,
  TripDetail,
  TripInfo,
  YourGuide,
} from '../screens';
import {Screen} from '../constants/screens/screens';
import {getDataFromStorage} from '../utils/storage';
import {Keys} from '../constants';

const MyStack = createStackNavigator();
export const MyTripStack = ({route}: any) => {
  const [userRole, setUserRole] = useState();

  const getUserRole = async () => {
    const data = await getDataFromStorage(Keys.userRole);
    setUserRole(data);
  };

  useEffect(() => {
    getUserRole();
  }, []);

  const isOfflineMode = route?.params?.offlineMode;
  return (
    <MyStack.Navigator
      initialRouteName={Screen.MyTrip}
      screenOptions={{headerShown: false}}>
      {userRole === 'TC' ? (
        <MyStack.Screen
          name={Screen.GuidePlan}
          component={GuidePlan}
          initialParams={{offlineMode: isOfflineMode}}
        />
      ) : (
        <MyStack.Screen
          name={Screen.MyTrip}
          component={MyTrip}
          initialParams={{offlineMode: isOfflineMode}}
        />
      )}
      <MyStack.Screen
        name={Screen.TripDetail}
        component={TripDetail}
        initialParams={{offlineMode: isOfflineMode}}
      />
      <MyStack.Screen
        name={Screen.DayDetails}
        component={DayDetails}
        initialParams={{offlineMode: isOfflineMode}}
      />
      <MyStack.Screen name={Screen.TripInfo} component={TripInfo} />
      <MyStack.Screen
        name={Screen.MoreInformation}
        component={MoreInformation}
      />
      <MyStack.Screen
        name={Screen.EmergencyContact}
        component={EmergencyContact}
        initialParams={{offlineMode: isOfflineMode}}
      />
      <MyStack.Screen name={Screen.YourGuide} component={YourGuide} />
      <MyStack.Screen name={Screen.Summary} component={Summary} />
      <MyStack.Screen name={Screen.Faq} component={Faq} />
      <MyStack.Screen name={Screen.Health} component={Health} />
      <MyStack.Screen
        name={Screen.HealthFormSigning}
        component={HealthFormSigning}
      />
      <MyStack.Screen name={Screen.Engagement} component={Engagement} />
      <MyStack.Screen name={Screen.AddNotes} component={AddNotes} />
      <MyStack.Screen name={Screen.PassengerInfo} component={PassengerInfo} />
    </MyStack.Navigator>
  );
};
