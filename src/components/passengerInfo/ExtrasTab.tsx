import React from 'react';
import {Linking, Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {ColorSet, FamilySet, appStyle} from '../../styles';
import dateFormator from '../formatesManager/DateFormateHandler';
import {useTranslation} from 'react-i18next';
import {getLocalizedDateFormat} from '../../utils/datesFormater';
import {Language} from '../../types/common.types';

const ExtrasTab = ({extras}) => {
  const {t, i18n} = useTranslation();

  return (
    <View style={[appStyle.pb5, appStyle.jcSpaceBetween, appStyle.pb20]}>
      <View style={appStyle.pb5}>
        <Text style={styles.titleStyle}>{t('label_extras')}</Text>
      </View>
      {extras?.map((addon: any) => {
        return (
          <View style={[styles.infoHeading, appStyle.mb20]}>
            {addon?.type && (
              <Text
                style={[
                  styles.infoTextStyle,
                  appStyle.mb5,
                  styles.extraTypeTitle,
                ]}>
                {addon?.type}
              </Text>
            )}
            {addon?.name && (
              <Text style={[styles.infoTextStyle]}>{addon.name}</Text>
            )}
            <View style={[appStyle.rowBtw, appStyle.jcFlexStart]}>
              {addon.pickUpTime && (
                <Text style={[styles.infoTextStyle]}>
                  {addon.pickUpTime} -{' '}
                </Text>
              )}
              {addon?.serviceDate && (
                <Text style={styles.infoTextStyle}>
                  {dateFormator(
                    addon?.serviceDate,
                    getLocalizedDateFormat(i18n.language as Language),
                  )}{' '}
                </Text>
              )}
              {addon?.endDate !== addon?.serviceDate && !!addon?.endDate && (
                <Text style={styles.infoTextStyle}>
                  -{' '}
                  {dateFormator(
                    addon?.endDate,
                    getLocalizedDateFormat(i18n.language as Language),
                  )}
                </Text>
              )}
            </View>
            {addon?.provider?.name && (
              <>
                <Text style={[styles.infoTextStyle]}>
                  Provider: {addon?.provider?.name}
                </Text>
                {addon?.provider?.phone && (
                  <TouchableOpacity
                    style={[appStyle.rowBtw]}
                    onPress={() =>
                      Linking.openURL(`tel:${addon?.provider?.phone}`)
                    }>
                    <Text style={[styles.infoTextStyle]}>{t('phone')}</Text>
                    <Text style={[styles.infoTextStyle, appStyle.textLink]}>
                      {addon?.provider?.phone}
                    </Text>
                  </TouchableOpacity>
                )}
                {addon?.provider?.cellphone && (
                  <TouchableOpacity
                    style={[appStyle.rowBtw]}
                    onPress={() =>
                      Linking.openURL(`tel:${addon?.provider?.cellphone}`)
                    }>
                    <Text style={[styles.infoTextStyle]}>Cellphone</Text>
                    <Text style={[styles.infoTextStyle, appStyle.textLink]}>
                      {addon?.provider?.cellphone}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
            {addon?.specialist?.name && (
              <>
                <Text style={styles.infoTextStyle}>
                  Specialist: {addon?.specialist?.name}
                </Text>
                {addon?.specialist?.phone && (
                  <TouchableOpacity
                    style={[appStyle.rowBtw]}
                    onPress={() =>
                      Linking.openURL(`tel:${addon?.specialist?.phone}`)
                    }>
                    <Text style={[styles.infoTextStyle]}>
                      {t('label_phone-number')}
                    </Text>
                    <Text style={[styles.infoTextStyle, appStyle.textLink]}>
                      {addon?.specialist?.phone}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
            {addon?.note && (
              <View style={[appStyle.rowBtw, appStyle.w90]}>
                <Text style={[styles.infoTextStyle]}>Note: </Text>
                <Text style={[styles.infoTextStyle]}>{addon?.note}</Text>
              </View>
            )}
          </View>
        );
      })}
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
  extraTypeTitle: {
    fontWeight: 'bold',
  },
  infoTextStyle: {
    color: ColorSet.grey,
    fontSize: 16,
    alignSelf: 'flex-start',
    fontFamily: FamilySet.regular,
  },
});

export default ExtrasTab;
