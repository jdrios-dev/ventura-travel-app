import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Image,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MyTripStack} from './myTripStack';
import {HomeStack} from './homeStack';
import {Icons, Keys} from '../constants';
import {ColorSet} from '../styles';
import {useTranslation} from 'react-i18next';
import {FlightStack} from './flightStack';
import {SettingStack} from './settingStack';
import {getDataFromStorage} from '../utils/storage';
import {SplashScreen} from '../screens';
const Tab = createBottomTabNavigator();

const TRIP_SCREEN_BY_ROLE = {
  TC: 'GuidePlan',
  CLIENT: 'MyTrip',
};

export function TabOfflineNavigator() {
  const {t} = useTranslation();
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    getRole();
  }, []);

  async function getRole() {
    const role = await await getDataFromStorage(Keys.userRole);
    setUserRole(role);
  }

  const tabItems = [
    {
      route: 'Dashboard',
      label: t('tab_home'),
      selectIcon: Icons.tabHomeColored,
      unSelectIcon: Icons.tabHome,
      component: HomeStack,
      color: ColorSet.theme,
      testId: 'bottomTabDashboard',
      show: true,
    },
    {
      route: TRIP_SCREEN_BY_ROLE?.[userRole] ?? 'GuidePlan',
      label: t('tab_myTrip'),
      selectIcon: `${
        userRole === 'TC' ? Icons.guidePlanColored : Icons.tabTripColored
      }`,
      unSelectIcon: `${userRole === 'TC' ? Icons.guidePlan : Icons.tabTrip}`,
      component: MyTripStack,
      color: ColorSet.theme,
      testId: 'bottomTabTrip',
      show: true,
    },
    {
      route: 'Flights',
      label: t('tab_flights'),
      selectIcon: Icons.tabFlightColored,
      unSelectIcon: Icons.tabFlight,
      component: FlightStack,
      color: ColorSet.theme,
      testId: 'flightTabPhotos',
      show: true,
    },
    {
      route: 'Settings',
      label: t('tab_more'),
      selectIcon: Icons.tabSettingColored,
      unSelectIcon: Icons.tabSetting,
      component: SettingStack,
      color: ColorSet.theme,
      testId: 'settingsTabPhotos',
      show: true,
    },
    {
      route: 'Splash',
      label: 'SplashScreen',
      selectIcon: Icons.tabSettingColored,
      unSelectIcon: Icons.tabSetting,
      component: SplashScreen,
      color: ColorSet.theme,
      testId: 'splashTabPhotos',
      show: false,
    },
  ];

  const tabItemsToShow = tabItems.filter(item => item.show);
  const TabButton = props => {
    const {item, onPress, accessibilityState, testId} = props;
    const focused = accessibilityState.selected;
    const tabItemsWidthByLenght = 100 / tabItemsToShow?.length;

    return (
      <TouchableOpacity
        testID={testId}
        onPress={onPress}
        activeOpacity={1}
        style={[styles.container, {width: `${tabItemsWidthByLenght}%`}]}>
        <View style={styles.btn}>
          <Image
            source={focused ? item.selectIcon : item.unSelectIcon}
            style={[styles.tabIcon, focused ? {opacity: 1} : {opacity: 0.8}]}
          />
          <Text
            style={[
              styles.lableStyle,
              focused ? {color: ColorSet.theme} : {color: ColorSet.grayMedium},
            ]}>
            {item.label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.barStyle,
      }}>
      {tabItemsToShow.map((item, index) => {
        return (
          <Tab.Screen
            key={index}
            name={item.route}
            component={item.component}
            initialParams={{offlineMode: true}}
            options={{
              tabBarShowLabel: false,
              tabBarButton: props => (
                <TabButton testId={item?.testId} {...props} item={item} />
              ),
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  barStyle: {
    backgroundColor: ColorSet.white,
    height: Platform.OS === 'ios' ? 90 : 70,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    shadowColor: ColorSet.black,
    shadowOpacity: 0.15,
    shadowOffset: {width: 0, height: 10},
    shadowRadius: 40,
    elevation: 10,
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
  },
  tabIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },

  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    flexDirection: 'column',
  },
  lableStyle: {
    fontSize: 14,
    paddingTop: 5,
    textAlign: 'center',
  },
});
