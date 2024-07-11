import {View, Text, StyleSheet} from 'react-native';

import React from 'react';
import {ColorSet, FamilySet, appStyle} from '../../styles';
import {useTranslation} from 'react-i18next';

const HelpTab = ({emergencyContact}) => {
  const {t} = useTranslation();

  return (
    <View>
      <View style={appStyle.flex1}>
        {emergencyContact?.fullName && (
          <View style={appStyle.pb5}>
            <Text style={styles.titleStyle}>{t('name')}</Text>
            <Text style={[styles.searchTextStyle, appStyle.pv10]}>
              {emergencyContact?.fullName}
            </Text>
          </View>
        )}
        {(emergencyContact?.email !== '' ||
          emergencyContact?.phone !== '' ||
          emergencyContact?.cellphone !== '') && (
          <View style={appStyle.pb5}>
            <Text style={styles.titleStyle}>{t('label_information')}</Text>
          </View>
        )}
        {emergencyContact?.email !== '' && (
          <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
            <View style={styles.infoHeading}>
              <Text style={styles.infoTextStyle}>{t('emailAdress')}</Text>
            </View>
            <View>
              <Text style={styles.infoHeadingTextStyle}>
                {emergencyContact?.email}
              </Text>
            </View>
          </View>
        )}
        {emergencyContact?.phone !== '' && (
          <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
            <View style={styles.infoHeading}>
              <Text style={styles.infoTextStyle}>
                {t('label_phone-number')}
              </Text>
            </View>
            <View>
              <Text style={styles.infoHeadingTextStyle}>
                {emergencyContact?.phone}
              </Text>
            </View>
          </View>
        )}
        {emergencyContact?.cellphone !== '' && (
          <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
            <View style={styles.infoHeading}>
              <Text style={styles.infoTextStyle}>{t('phoneNumber')}</Text>
            </View>
            <View>
              <Text style={styles.infoHeadingTextStyle}>
                {emergencyContact?.cellphone}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    color: ColorSet.theme,
    fontSize: 18,
    fontFamily: FamilySet.bold,
  },
  searchTextStyle: {
    fontSize: 17,
    fontFamily: FamilySet.regular,
    color: ColorSet.grey,
  },

  tabLableStyle: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
  },
  infoHeading: {
    marginBottom: 16,
  },
  infoTextStyle: {
    color: ColorSet.grey,
    fontSize: 16,
    alignSelf: 'flex-start',
    fontFamily: FamilySet.regular,
  },
  infoHeadingTextStyle: {
    color: ColorSet.grey,
    fontSize: 16,
    alignSelf: 'flex-end',
    fontFamily: FamilySet.regular,
  },
});

export default HelpTab;
