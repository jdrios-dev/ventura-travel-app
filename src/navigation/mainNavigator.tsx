import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {
  SplashScreen,
  LoginScreen,
  LanguageSelection,
  OtpScreen,
  AccountCreated,
  Dashboard,
  DashboardTc,
  More,
  EditProfile,
  ForgotPassword,
  NewPassWord,
  ChatDetailScreen,
  CreateNewGroup,
  AddMembers,
  GroupSetting,
  GroupMembers,
  Notification,
  ImageViewer,
  TripDetail,
  PhotoDetail,
  TripInfo,
  EmergencyContact,
  YourGuide,
  Summary,
  Faq,
  Health,
  HealthFormSigning,
  Engagement,
  AddNotes,
  PassengerInfo,
  MoreInformation,
  CreateNewIncident,
  NewReceipt,
  MyNotes,
  DayDetails,
  ReceiptDetail,
  PassengerList,
  AccountSetting,
  FlightTimeScreen,
  Receipt,
  RoomingList,
  PrivacyPolicy,
  EULA,
  Imprint,
  FlightScreen,
  UpdateDeparture,
  FlightDetailScreen,
  ClientProfileImages,
  ClientProfileImagesDetail,
  VSocialDonationForm,
  VSocialDetailProject,
} from '../screens';
import {navigationRef} from '../../RootNavigation';
import {Screen} from '../constants/screens/screens';
import {TabNavigator} from './tabNavigator';
import linking from '../Linking';
import {TabOfflineNavigator} from './tabOfflineNavigator';
import {SettingStack} from './settingStack';
import VSocial from '../screens/main/settings/VSocial';

const MyStack = createStackNavigator();
export const Stack = () => {
  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <MyStack.Navigator
        initialRouteName={Screen.SplashScreen}
        screenOptions={{headerShown: false}}>
        <MyStack.Screen name={Screen.SplashScreen} component={SplashScreen} />
        <MyStack.Screen
          name={Screen.LanguageSelection}
          component={LanguageSelection}
        />
        <MyStack.Screen name={Screen.EditProfile} component={EditProfile} />
        <MyStack.Screen name={Screen.LoginScreen} component={LoginScreen} />
        <MyStack.Screen name={Screen.OtpScreen} component={OtpScreen} />
        <MyStack.Screen
          name={Screen.AccountCreated}
          component={AccountCreated}
        />
        <MyStack.Screen name={Screen.Dashboard} component={Dashboard} />
        <MyStack.Screen
          name={Screen.DashboardTc}
          component={DashboardTc}
          initialParams={{id: 0}}
        />
        <MyStack.Screen
          name={Screen.ForgotPassword}
          component={ForgotPassword}
        />
        <MyStack.Screen name={Screen.NewPassWord} component={NewPassWord} />
        <MyStack.Screen name="TabNavigator" component={TabNavigator} />
        <MyStack.Screen name="SettingStack" component={SettingStack} />
        <MyStack.Screen
          name="TabOfflineNavigator"
          component={TabOfflineNavigator}
        />
        <MyStack.Screen
          name={Screen.ChatDetailScreen}
          component={ChatDetailScreen}
        />
        <MyStack.Screen
          name={Screen.CreateNewGroup}
          component={CreateNewGroup}
        />
        <MyStack.Screen name={Screen.AddMembers} component={AddMembers} />
        <MyStack.Screen name={Screen.GroupMembers} component={GroupMembers} />
        <MyStack.Screen name={Screen.GroupSetting} component={GroupSetting} />
        <MyStack.Screen name={Screen.Notification} component={Notification} />
        <MyStack.Screen name={Screen.ImageViewer} component={ImageViewer} />
        <MyStack.Screen name={Screen.PhotoDetail} component={PhotoDetail} />
        <MyStack.Screen
          name={Screen.AccountSetting}
          component={AccountSetting}
        />
        <MyStack.Screen name={Screen.TripInfo} component={TripInfo} />
        <MyStack.Screen name={Screen.More} component={More} />
        <MyStack.Screen
          name={Screen.MoreInformation}
          component={MoreInformation}
        />
        <MyStack.Screen
          name={Screen.EmergencyContact}
          component={EmergencyContact}
        />
        <MyStack.Screen
          name={Screen.ClientProfileImages}
          component={ClientProfileImages}
        />
        <MyStack.Screen
          name={Screen.ClientProfileImagesDetail}
          component={ClientProfileImagesDetail}
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
        <MyStack.Screen name={Screen.PassengerInfo} component={PassengerInfo} />
        <MyStack.Screen name={Screen.PassengerList} component={PassengerList} />
        <MyStack.Screen name={Screen.TripDetail} component={TripDetail} />
        <MyStack.Screen
          name={Screen.CreateNewIncident}
          component={CreateNewIncident}
        />
        <MyStack.Screen name={Screen.AddNotes} component={AddNotes} />
        <MyStack.Screen name={Screen.MyNotes} component={MyNotes} />
        <MyStack.Screen name={Screen.ReceiptDetail} component={ReceiptDetail} />
        <MyStack.Screen name={Screen.NewReceipt} component={NewReceipt} />
        <MyStack.Screen name={Screen.DayDetails} component={DayDetails} />
        <MyStack.Screen
          name={Screen.FlightTimeScreen}
          component={FlightTimeScreen}
        />
        <MyStack.Screen name={Screen.Receipt} component={Receipt} />
        <MyStack.Screen name={Screen.RoomingList} component={RoomingList} />
        <MyStack.Screen name={Screen.PrivacyPolicy} component={PrivacyPolicy} />
        <MyStack.Screen name={Screen.EULA} component={EULA} />
        <MyStack.Screen name={Screen.VSocial} component={VSocial} />
        <MyStack.Screen
          name={Screen.VSocialDetailProject}
          component={VSocialDetailProject}
        />
        <MyStack.Screen
          name={Screen.VSocialDonationForm}
          component={VSocialDonationForm}
        />
        <MyStack.Screen name={Screen.Imprint} component={Imprint} />
        <MyStack.Screen name={Screen.FlightScreen} component={FlightScreen} />
        <MyStack.Screen
          name={Screen.FlightDetailScreen}
          component={FlightDetailScreen}
        />
        <MyStack.Screen
          name={Screen.UpdateDeparture}
          component={UpdateDeparture}
        />
      </MyStack.Navigator>
    </NavigationContainer>
  );
};
