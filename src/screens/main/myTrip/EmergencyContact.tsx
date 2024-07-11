import React, {useCallback, useEffect, useState} from 'react';

import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  StatusBar,
  Linking,
} from 'react-native';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';

import {Icons} from '../../../constants';
import {ColorSet, FamilySet, appStyle} from '../../../styles';
import {DataNotFound, Header, IconWithText, Loader} from '../../../components';
import {getEmergencyContact} from '../../../networking/Services';
import {ObjectFormater} from '../../../utils';
import {
  checkIsOfflineMode,
  replaceTextWithObjectValues,
} from '../../../utils/helper';
import {
  TABLE_OFFLINE_NAME,
  getValueForKey,
} from '../../../networking/DBConection';
import {DbKeys} from '../../../constants/screens/dbKeys';

const makeCall = (phoneNumber: number) => {
  Linking.openURL(`tel:${phoneNumber}`);
};

const EmergencyContact: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  const isOfflineMode = checkIsOfflineMode(route);

  const {t} = useTranslation();

  const [emergencyArray, setEmergencyArray] = useState<Array<any>>([]);
  const [isLoading, setIsloading] = useState<boolean>(false);

  const getContactEmergency = useCallback(async () => {
    if (!isOfflineMode) {
      setIsloading(true);

      const res = await getEmergencyContact();
      ObjectFormater(res);
      if (res) {
        setEmergencyArray(res);
      }
      setIsloading(false);
    }
    if (isOfflineMode) {
      await getValueForKey(
        DbKeys.emergency,
        updateAndFormatData,
        TABLE_OFFLINE_NAME,
      );
    }
  }, [isOfflineMode]);

  const updateAndFormatData = data => {
    return setEmergencyArray(ObjectFormater(data));
  };

  useEffect(() => {
    getContactEmergency();
  }, [getContactEmergency]);

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.goBack()}
        title={t('button_emergencyContact')}
      />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
        {emergencyArray?.content?.length > 0 ? (
          <View style={[appStyle.p25, appStyle.flex1]}>
            <Text style={styles.titleStyle}>
              {replaceTextWithObjectValues(
                emergencyArray?.content,
                emergencyArray?.replacements,
              )}
            </Text>

            <Text style={styles.titleStyle}>
              {t('msg_emergency-msg-availability-during-trip')}
            </Text>
            <IconWithText
              onPressIcon={() => {
                makeCall(emergencyArray?.replacements?.TS_PHONE_NUMBER);
              }}
              icon={Icons.call}
              title={emergencyArray?.replacements?.TS_PHONE_NUMBER}
            />
            <Text style={styles.titleStyle}>
              {t('msg_outside-office-hours')}
            </Text>
            <IconWithText
              onPressIcon={() => {
                makeCall(emergencyArray?.replacements?.EMERGENCY_NUMBER);
              }}
              icon={Icons.call}
              title={emergencyArray?.replacements?.EMERGENCY_NUMBER}
            />
          </View>
        ) : (
          <DataNotFound />
        )}
      </KeyboardAwareScrollView>
      <Loader isLoading={isLoading} layout={'outside'} />
    </SafeAreaView>
  );
};

export default EmergencyContact;

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 18,
    fontFamily: FamilySet.regular,
    color: ColorSet.grey,
    paddingBottom: 20,
  },
});
