import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import VersionCheck from 'react-native-version-check';

import appStyle from '../../../styles/appStyle';
import {Icons, Keys} from '../../../constants';
import {ColorSet, FamilySet} from '../../../styles';
import {Header, IconWithText} from '../../../components/index';
import {Screen} from '../../../constants/screens/screens';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Loader from '../../../components/Loader';
import {useDispatch} from 'react-redux';
import {setUser} from '../../../redux/common/common.slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import {
  TABLE_OFFLINE_NAME,
  emptyLocalTable,
  getDBConnection,
  getValueForKey,
} from '../../../networking/DBConection';
import {DbKeys} from '../../../constants/screens/dbKeys';

export const handleLogout = async (
  dispatch: any,
  setLoadig: any,
  navigation: any,
) => {
  const db = await getDBConnection();
  setLoadig(true);
  await AsyncStorage.removeItem(Keys.userDetails);
  await AsyncStorage.removeItem(Keys.userRole);
  await emptyLocalTable(db, TABLE_OFFLINE_NAME);
  dispatch(setUser(''));
  navigation.replace(Screen.LoginScreen);
  setLoadig(false);
};

const More: React.FC<{navigation: any; route: any}> = ({navigation, route}) => {
  const [userRole, setUserRole] = useState();
  const isOfflineMode = route?.params?.offlineMode;

  const getUserRole = async () => {
    getValueForKey(DbKeys.userRole, setUserRole, TABLE_OFFLINE_NAME);
  };
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoadig] = React.useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);

  const [currentVersion, setCurrentVersion] = useState(0);

  const navigateToScreen = screen => {
    navigation.navigate(screen);
  };
  const logout = async () => {
    await handleLogout(dispatch, setLoadig, navigation);
  };
  const opPressDeleteHandler = () => {
    setModalConfirm(false);
    setLoadig(true);
    setTimeout(() => {
      setLoadig(false);
      setModalVisible(true);
    }, 3000);
  };
  useEffect(() => {
    getUserRole();
  }, []);
  useEffect(() => {
    VersionCheck.needUpdate({
      latestVersion: '1.0.0', // we can change this last version 1.0.0 by default // Dani 5 Jan 24
    }).then(res => {
      setCurrentVersion(res?.currentVersion);
    });
  }, []);

  const menuItems = [
    {
      onPress: () => navigateToScreen(Screen.FlightTimeScreen),
      icon: Icons.phone,
      title: t('Touchable_FlighTeamReachabililty'),
      show: userRole === 'TC',
    },
    {
      onPress: () => navigateToScreen(Screen.Receipt),
      icon: Icons.receipt,
      title: t('Touchable_ReceiptManagement'),
      show: userRole === 'TC',
    },
    {
      onPress: () => navigateToScreen(Screen.ClientProfileImages),
      icon: Icons.tabCamera,
      title: t('client-update-profile-title'),
      show: userRole === 'TC' && !isOfflineMode,
    },
    {
      onPress: () => navigateToScreen(Screen.RoomingList),
      icon: Icons.incidentManagement,
      title: t('title_rooming-list'),
      show: userRole === 'TC' && !isOfflineMode,
    },
    {
      onPress: () => navigateToScreen(Screen.PassengerList),
      icon: Icons.faceIcon,
      title: t('title_passenger-list'),
      show: userRole === 'TC',
    },
    {
      onPress: () => navigateToScreen(Screen.UpdateDeparture),
      icon: Icons.edit,
      title: t('label_departure-update'),
      show: userRole === 'TC' && !isOfflineMode,
    },
    {
      onPress: () => navigateToScreen(Screen.MyNotes),
      icon: Icons.notes,
      title: t('Touchable_MyNotes'),
      show: userRole === 'TC' && !isOfflineMode,
    },
    {
      onPress: () => navigateToScreen(Screen.MoreInformation),
      icon: Icons.info,
      title: t('title_more-information'),
      show: userRole === 'CLIENT' && !isOfflineMode,
    },
    {
      onPress: () => navigateToScreen(Screen.VSocial),
      icon: Icons.handHearthTheme,
      title: t('title_vsocial-projects'),
      show: true,
    },
    {
      onPress: () => navigateToScreen(Screen.EmergencyContact),
      icon: Icons.info,
      title: t('title_emergency-contacts'),
      show: userRole === 'CLIENT',
    },
    {
      onPress: () => navigateToScreen(Screen.Summary),
      icon: Icons.summary,
      title: t('title_summary-trip'),
      show: userRole === 'CLIENT' && !isOfflineMode,
    },
    {
      onPress: () => navigateToScreen(Screen.Faq),
      icon: Icons.faceIcon,
      title: t('title_faq'),
      show: userRole === 'CLIENT' && !isOfflineMode,
    },

    {
      onPress: () => navigateToScreen(Screen.PrivacyPolicy),
      icon: Icons.faq,
      title: t('Touchable_PrivacyPolicy'),
      show: true,
    },
    {
      onPress: () => navigateToScreen(Screen.Imprint),
      icon: Icons.faq,
      title: t('Touchable_Imprint'),
      show: true,
    },
    {
      onPress: () => navigateToScreen(Screen.EULA),
      icon: Icons.faq,
      title: t('Touchable_EULA'),
      show: true,
    },
    {
      onPress: () => logout(),
      icon: Icons.logout,
      title: t('Touchable_LogOut'),
      show: !isOfflineMode,
    },
  ];

  const menuItemsToShow = menuItems?.filter(item => item.show);

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        title={t('tab_more')}
        back
        onPressBack={() => navigation.goBack()}
      />
      <Loader isLoading={loading} layout={'outside'} />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <View style={[appStyle.p20, appStyle.flex1]}>
          {menuItemsToShow?.map(itemMenu => (
            <IconWithText
              key={itemMenu.title}
              onPressIcon={itemMenu.onPress}
              icon={itemMenu.icon}
              title={itemMenu.title}
            />
          ))}
          <View style={[appStyle.aiCenter, appStyle.mv10]}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(Screen.TabOfflineNavigator);
              }}>
              <Text style={styles.deleteAccount}>
                {t('text_change-to-offline-mode')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[appStyle.aiCenter, appStyle.mv10]}>
            <TouchableOpacity
              onPress={() => {
                setModalConfirm(true);
              }}>
              <Text style={styles.deleteAccount}>
                {t('touchable_delete-account')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[appStyle.aiCenter, appStyle.mv10]}>
          <Text style={styles.versionLabel}>v. {currentVersion}</Text>
        </View>
      </KeyboardAwareScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert(t('text_delete-account-modal-closed'));
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={[styles.modalText]}>
              {t('text_delete-account-sent-notification')}
            </Text>
            <View style={styles.buttonContainerVisible}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(false);
                }}>
                <Text style={styles.textStyleModal}>{t('text_close')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalConfirm}
        onRequestClose={() => setModalConfirm(!modalConfirm)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={[styles.modalText]}>
              {t('text_delete-prevention')}
            </Text>
            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalConfirm(!modalConfirm)}>
                <Text style={styles.textStyleModal}>
                  {t('touchable_cancel')}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => {
                  opPressDeleteHandler();
                }}>
                <Text style={styles.textStyleModal}>{t('touchable_ok')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default More;
const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 16,
    fontFamily: FamilySet.semiBold,
    color: ColorSet.secondary,
  },
  legalTextView: {
    width: '90%',
    alignSelf: 'center',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    justifyContent: 'space-between',
  },
  textStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '80%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: ColorSet.theme,
    width: 100,
    height: 40,
  },
  buttonClose: {
    backgroundColor: ColorSet.grayLight,
    width: 100,
    height: 40,
  },
  textStyleModal: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: FamilySet.semiBold,
    color: ColorSet.secondary,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  buttonContainerVisible: {
    width: 100,
  },
  deleteAccount: {
    fontSize: 16,
    color: ColorSet.theme,
    fontWeight: 'bold',
  },
  versionLabel: {
    color: ColorSet.textBase,
  },
});
