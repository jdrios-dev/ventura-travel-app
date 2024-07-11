import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  AccountSetting,
  AddNotes,
  CreateNewIncident,
  RoomingList,
  EditProfile,
  EULA,
  FlightTimeScreen,
  GuidePlan,
  Imprint,
  IncidentManagement,
  More,
  MyNotes,
  NewReceipt,
  PrivacyPolicy,
  Receipt,
  SignAnIncident,
  SignedIncident,
  FlightDetailScreen,
  FlightScreen,
  PassengerList,
  EmergencyContact,
  ClientProfileImages,
} from '../screens';
import {Screen} from '../constants/screens/screens';

const MyStack = createStackNavigator();
export const SettingStack = ({route}: any) => {
  const isOfflineMode = route?.params?.offlineMode;

  return (
    <MyStack.Navigator
      initialRouteName={Screen.More}
      screenOptions={{headerShown: false}}>
      <MyStack.Screen
        name={Screen.More}
        component={More}
        initialParams={{offlineMode: isOfflineMode}}
      />
      <MyStack.Screen
        name={Screen.EmergencyContact}
        component={EmergencyContact}
        initialParams={{offlineMode: isOfflineMode}}
      />
      <MyStack.Screen name={Screen.AccountSetting} component={AccountSetting} />
      <MyStack.Screen name={Screen.EULA} component={EULA} />
      <MyStack.Screen name={Screen.EditProfile} component={EditProfile} />
      <MyStack.Screen name={Screen.Imprint} component={Imprint} />
      <MyStack.Screen
        name={Screen.PassengerList}
        component={PassengerList}
        initialParams={{offlineMode: isOfflineMode}}
      />
      <MyStack.Screen name={Screen.RoomingList} component={RoomingList} />
      <MyStack.Screen name={Screen.PrivacyPolicy} component={PrivacyPolicy} />
      <MyStack.Screen name={Screen.GuidePlan} component={GuidePlan} />
      <MyStack.Screen
        name={Screen.IncidentManagement}
        component={IncidentManagement}
      />
      <MyStack.Screen name={Screen.SignAnIncident} component={SignAnIncident} />
      <MyStack.Screen name={Screen.SignedIncident} component={SignedIncident} />
      <MyStack.Screen
        name={Screen.CreateNewIncident}
        component={CreateNewIncident}
      />
      <MyStack.Screen
        name={Screen.FlightTimeScreen}
        component={FlightTimeScreen}
        initialParams={{offlineMode: isOfflineMode}}
      />
      <MyStack.Screen name={Screen.FlightScreen} component={FlightScreen} />
      <MyStack.Screen
        name={Screen.FlightDetailScreen}
        component={FlightDetailScreen}
      />
      <MyStack.Screen name={Screen.Receipt} component={Receipt} />
      <MyStack.Screen name={Screen.NewReceipt} component={NewReceipt} />
      <MyStack.Screen name={Screen.MyNotes} component={MyNotes} />
      <MyStack.Screen
        name={Screen.ClientProfileImages}
        component={ClientProfileImages}
      />
      <MyStack.Screen name={Screen.AddNotes} component={AddNotes} />
    </MyStack.Navigator>
  );
};
