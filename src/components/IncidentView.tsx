import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import {ColorSet, FamilySet} from '../styles';
import {useTranslation} from 'react-i18next';

interface HeaderProps {
  title?: string | undefined;
  startDate?: string | undefined;
  incidentDate?: string | undefined;
  incidentPlace?: string | undefined;
  tc?: string | undefined;
  traveler?: string | undefined;
  signedBy?: string | undefined;
  des?: string | undefined;
  signatureHistory?: string | undefined;
  onPress?: (() => void) | undefined;
}

const IncidentView: React.FC<HeaderProps> = props => {
  const {
    title,
    startDate,
    incidentDate,
    incidentPlace,
    tc,
    traveler,
    signedBy,
    des,
    signatureHistory,
    onPress,
  } = props;
  const {t} = useTranslation();
  return (
    <TouchableOpacity onPress={onPress} style={styles.containerStyle}>
      {title && (
        <Text style={styles.titleTextStyle}>
          {t('title_trip_to_destination', {destination: ''})}
        </Text>
      )}
      {startDate && (
        <Text style={styles.desTextStyle}>
          {t('label_trip-start-date')} {startDate}
        </Text>
      )}
      {incidentDate && (
        <Text style={styles.desTextStyle}>
          {t('label_date-of-incident')} {incidentDate}
        </Text>
      )}
      {incidentPlace && (
        <Text style={styles.desTextStyle}>
          {t('label_place-of-incident')} {incidentPlace}
        </Text>
      )}
      {tc && <Text style={styles.desTextStyle}>TC: {tc}</Text>}
      {traveler && (
        <Text style={styles.desTextStyle}>
          {t('label_traveler')} {traveler}
        </Text>
      )}
      {signedBy && (
        <Text style={styles.desTextStyle}>
          {t('label_signed-by')} {signedBy}
        </Text>
      )}
      {des && (
        <Text style={styles.desTextStyle}>
          {t('label_incident-description')} {des}
        </Text>
      )}
      {signatureHistory && (
        <View>
          <Text style={styles.signatureTextStyle}>
            {t('label_signature-history')}
          </Text>
          <Text style={styles.desTextStyle}>{signatureHistory}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    padding: 10,
    backgroundColor: ColorSet.secondaryLight,
    marginBottom: 20,
  },
  titleTextStyle: {
    fontSize: 16,
    fontFamily: FamilySet.bold,
    color: ColorSet.secondary,
    paddingVertical: 5,
  },
  desTextStyle: {
    fontSize: 12,
    fontFamily: FamilySet.bold,
    color: ColorSet.grey,
    paddingBottom: 5,
  },
  signatureTextStyle: {
    fontSize: 12,
    fontFamily: FamilySet.bold,
    color: ColorSet.grey,
    paddingVertical: 20,
  },
});

export default IncidentView;
