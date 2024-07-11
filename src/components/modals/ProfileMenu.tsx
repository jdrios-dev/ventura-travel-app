import React, {useEffect, useState} from 'react';
import {
  Image,
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';

import {useNetInfo} from '@react-native-community/netinfo';
import {Icons, Screen} from '../../constants';
import {ColorSet, FamilySet} from '../../styles';
import {useTranslation} from 'react-i18next';
import {handleLogout} from '../../screens/main/settings/More';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import isNetworkAvailable from '../../utils/InternetConnection';

type ProfileMenu = {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
};

type MenuProfileItemType = {
  label: string;
  screen: Screen;
  icon: any;
  show: boolean;
};

const ProfileMenu = ({
  modalVisible,
  setModalVisible,
}: ProfileMenu): React.ReactNode => {
  const {t} = useTranslation();
  const {isInternetReachable} = useNetInfo();
  const navigation = useNavigation();
  // Next 2 useState are creacted only for handleLogout, do not remove - Dani 27 May 24
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const dispatch = useDispatch();
  const handleLogoutMenu = async () => {
    await handleLogout(dispatch, setLoading, navigation);
  };

  const menuProfileItem: MenuProfileItemType[] = [
    {
      label: t('Touchable_EditProfile'),
      screen: Screen.EditProfile,
      icon: Icons.user,
      show: Boolean(isInternetReachable),
    },
    {
      label: t('screen_common_accountSettings'),
      screen: Screen.AccountSetting,
      icon: Icons.setting,
      show: Boolean(isInternetReachable),
    },
    {
      label: t('tab_more'),
      screen: Screen.More,
      icon: Icons.menuBar,
      show: Boolean(isInternetReachable),
    },
    {
      label: !isInternetReachable
        ? t('screen_common_offline-version')
        : 'Online Mode',
      screen: isInternetReachable
        ? ('TabNavigator' as Screen)
        : Screen.TabOfflineNavigator,
      icon: isInternetReachable ? Icons.wifiOffline : Icons.wifiOnline,
      show: true,
    },
  ];

  async function checkConnection() {
    const connection = await isNetworkAvailable();
    setIsOfflineMode(!connection);
    return connection;
  }

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View>
            {menuProfileItem
              ?.filter(item => item?.show)
              ?.map(item => (
                <TouchableOpacity
                  key={item?.label}
                  style={styles.profileMenuItem}
                  onPress={() => {
                    navigation.navigate(item.screen as never);
                    setModalVisible(!modalVisible);
                  }}>
                  <View style={styles.iconTopView}>
                    <Image source={item.icon} style={[styles.iconStyle]} />
                  </View>
                  <Text style={styles.titleStyle}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            <View style={styles.spacer}></View>
            {isInternetReachable ? (
              <TouchableOpacity
                style={styles.profileMenuItem}
                onPress={() => {
                  handleLogoutMenu();
                  setModalVisible(!modalVisible);
                }}>
                <View style={styles.iconTopView}>
                  <Image source={Icons.logout} style={[styles.iconStyle]} />
                </View>
                <Text style={styles.titleStyle}>{t('Touchable_LogOut')}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        <Pressable
          onPress={() => setModalVisible(!modalVisible)}
          style={styles.hiddenButtonToClose}>
          <View></View>
        </Pressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: '#00000045',
    paddingTop: 70,
  },
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  headerText: {
    fontSize: 20,
    color: ColorSet.theme,
  },
  headerModal: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  icon: {width: 30, height: 30},
  iconTopView: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: ColorSet.themeExtraLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconStyle: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    tintColor: ColorSet.theme,
  },
  titleStyle: {
    fontSize: 16,
    fontFamily: FamilySet.semiBold,
    color: ColorSet.secondary,
  },
  profileMenuItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  hiddenButtonToClose: {flex: 1, width: '100%'},
  spacer: {
    marginBottom: 24,
  },
});

export default ProfileMenu;
