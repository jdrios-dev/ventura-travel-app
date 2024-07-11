import React from 'react';
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
import {PhotosStack} from './photosStack';
import {HomeStack} from './homeStack';
import {ChatDetailScreen} from '../screens';
import {Icons} from '../constants';
import {ColorSet} from '../styles';
import {useTranslation} from 'react-i18next';
import {selectRole} from '../redux/common/common.selectors';
import {useSelector} from 'react-redux';
import {FlightStack} from './flightStack';
const Tab = createBottomTabNavigator();

export function TabNavigator() {
  const userRole = useSelector(selectRole);
  const {t} = useTranslation();
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
      route: 'ChatDetailsScreen',
      label: t('tab_chat'),
      selectIcon: Icons.tabChatColored,
      unSelectIcon: Icons.tabChat,
      component: ChatDetailScreen,
      color: ColorSet.theme,
      testId: 'bottomTabChat',
      show: true,
    },
    {
      route: `${userRole !== 'TC' ? 'MyTrip' : 'GuidePlan'}`,
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
      route: 'Photos',
      label: t('tab_phots'),
      selectIcon: Icons.tabCameraColored,
      unSelectIcon: Icons.tabCamera,
      component: PhotosStack,
      color: ColorSet.theme,
      testId: 'bottomTabPhotos',
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
      show: userRole === 'TC',
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
