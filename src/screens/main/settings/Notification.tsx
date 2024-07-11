import React from 'react';
import {StyleSheet, View, Text, SafeAreaView, StatusBar} from 'react-native';

import appStyle from '../../../styles/appStyle';
import {ColorSet, FamilySet} from '../../../styles';
import {Header} from '../../../components/index';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
const Notification: React.FC<{navigation: any}> = ({navigation}) => {
  const {t} = useTranslation();
  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.goBack()}
        title={t('local_common_notification')}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <View style={[appStyle.p25, appStyle.flex1]}>
          <View>
            <Text style={styles.title}>{t('text_maintenance-msg')}</Text>
            <Text style={styles.date}>3 Hour ago</Text>
            <View style={styles.divider} />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  title: {
    color: ColorSet.grey,
    fontSize: 16,
    fontFamily: FamilySet.regular,
    paddingBottom: 10,
  },
  date: {
    color: ColorSet.grey,
    fontSize: 12,
    fontFamily: FamilySet.regular,
    paddingBottom: 10,
  },
  divider: {
    borderWidth: 1,
    borderColor: ColorSet.dividerColor,
    marginBottom: 10,
  },
});
