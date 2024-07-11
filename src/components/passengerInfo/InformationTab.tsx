import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {ColorSet, FamilySet, appStyle} from '../../styles';
import dateFormator from '../formatesManager/DateFormateHandler';
import {useTranslation} from 'react-i18next';
import {getLocalizedDateFormat} from '../../utils/datesFormater';
import {Language} from '../../types/common.types';

const InformationTab = ({passengerInfo}) => {
  const {t, i18n} = useTranslation();

  return (
    <View style={appStyle.flex1}>
      <View style={appStyle.pb5}>
        <Text style={styles.titleStyle}>{t('text_basic-information')}</Text>
      </View>
      {passengerInfo?.fullName !== '' && (
        <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
          <View style={styles.infoHeading}>
            <Text style={styles.infoTextStyle}>{t('fullName')}</Text>
          </View>
          <View>
            <Text style={styles.infoHeadingTextStyle}>
              {passengerInfo?.fullName}
            </Text>
          </View>
        </View>
      )}
      {passengerInfo?.gender !== '' && (
        <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
          <View style={styles.infoHeading}>
            <Text style={styles.infoTextStyle}>{t('label_gender')}</Text>
          </View>
          <View>
            <Text style={styles.infoHeadingTextStyle}>
              {passengerInfo?.gender}
            </Text>
          </View>
        </View>
      )}
      {passengerInfo?.birthDay && (
        <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
          <View style={styles.infoHeading}>
            <Text style={styles.infoTextStyle}>{t('label_birthday')}</Text>
          </View>
          <View>
            <Text style={styles.infoHeadingTextStyle}>
              {dateFormator(
                passengerInfo?.birthDay,
                getLocalizedDateFormat(i18n.language as Language),
              )}
            </Text>
          </View>
        </View>
      )}
      {passengerInfo?.nationality !== '' && (
        <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
          <View style={styles.infoHeading}>
            <Text style={styles.infoTextStyle}>{t('label_nationality')}</Text>
          </View>
          <View>
            <Text style={styles.infoHeadingTextStyle}>
              {passengerInfo?.nationality}
            </Text>
          </View>
        </View>
      )}

      {(passengerInfo?.mainEmail != null ||
        passengerInfo.passengerInfo?.mainPhone != null) && (
        <View style={appStyle.pb5}>
          <Text style={styles.titleStyle}>
            {t('title_contact-information')}
          </Text>
        </View>
      )}
      {passengerInfo?.mainEmail != null && (
        <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
          <View style={styles.infoHeading}>
            <Text style={styles.infoTextStyle}>{t('emailAdress')}</Text>
          </View>
          <View>
            <Text style={styles.infoHeadingTextStyle}>
              {passengerInfo?.mainEmail}
            </Text>
          </View>
        </View>
      )}
      {passengerInfo.passengerInfo?.mainPhone != null && (
        <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
          <View style={styles.infoHeading}>
            <Text style={styles.infoTextStyle}>{t('phoneNumber')}</Text>
          </View>
          <View>
            <Text style={styles.infoHeadingTextStyle}>
              {passengerInfo?.mainPhone}
            </Text>
          </View>
        </View>
      )}
      {(passengerInfo?.passportNumber != null ||
        passengerInfo?.passportIssueDate != null ||
        passengerInfo?.passportExpiryDate != null) && (
        <View style={appStyle.pb5}>
          <Text style={styles.titleStyle}>
            {t('title_passport-information')}
          </Text>
        </View>
      )}
      {passengerInfo?.passportNumber != null && (
        <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
          <View style={styles.infoHeading}>
            <Text style={styles.infoTextStyle}>
              {t('label_passport-number')}
            </Text>
          </View>
          <View>
            <Text style={styles.infoHeadingTextStyle}>
              {passengerInfo?.passportNumber}
            </Text>
          </View>
        </View>
      )}
      {passengerInfo?.passportIssueDate != null && (
        <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
          <View style={styles.infoHeading}>
            <Text style={styles.infoTextStyle}>
              {t('label_passport-issue-date')}
            </Text>
          </View>
          <View>
            <Text style={styles.infoHeadingTextStyle}>
              {dateFormator(
                passengerInfo?.passportIssueDate,
                getLocalizedDateFormat(i18n.language as Language),
              )}
            </Text>
          </View>
        </View>
      )}
      {passengerInfo?.passportExpiryDate != null && (
        <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
          <View style={styles.infoHeading}>
            <Text style={styles.infoTextStyle}>
              {t('label_passport-expiry-date')}
            </Text>
          </View>
          <View>
            <Text style={styles.infoHeadingTextStyle}>
              {dateFormator(
                passengerInfo?.passportExpiryDate,
                getLocalizedDateFormat(i18n.language as Language),
              )}
            </Text>
          </View>
        </View>
      )}
      {passengerInfo?.dietaryRestrictions != null && (
        <View style={appStyle.pb5}>
          <Text style={styles.titleStyle}>
            {t('label_dietary-information')}
          </Text>
        </View>
      )}
      {passengerInfo?.dietaryRestrictions != null && (
        <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
          <View style={styles.infoHeading}>
            <Text style={styles.infoTextStyle}>
              {passengerInfo?.dietaryRestrictions}
            </Text>
          </View>
        </View>
      )}
      {passengerInfo?.allergies != null && (
        <View style={appStyle.pb5}>
          <Text style={styles.titleStyle}>{t('label_allergies')}</Text>
        </View>
      )}
      {passengerInfo?.allergies != null && (
        <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
          <View style={styles.infoHeading}>
            <Text style={styles.infoTextStyle}>{passengerInfo?.allergies}</Text>
          </View>
        </View>
      )}
      {!!passengerInfo?.invitationCode && (
        <View>
          <View style={appStyle.pb5}>
            <Text style={styles.titleStyle}>{t('label_invitation-code')}</Text>
          </View>
          <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
            <View style={styles.infoHeading}>
              <Text style={styles.infoTextStyle}>
                {passengerInfo?.invitationCode}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    color: ColorSet.theme,
    fontSize: 18,
    fontFamily: FamilySet.bold,
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

export default InformationTab;
