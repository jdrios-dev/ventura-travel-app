import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getMoreInformation} from '../networking/Services';
import {H1} from './Typography';
import {ColorSet, appStyle} from '../styles';
import {useTranslation} from 'react-i18next';

const DepartureNote = () => {
  const {t} = useTranslation();
  const [departureNote, setDepartureNote] = useState();
  useEffect(() => {
    const getData = async () => {
      const {tripDetails} = await getMoreInformation();
      if (tripDetails?.departureComment) {
        setDepartureNote(tripDetails?.departureComment);
      }
      return;
    };
    getData();
  }, []);

  if (!departureNote) {
    return null;
  }

  return (
    <View style={{marginBottom: 20}}>
      <View style={[appStyle.rowBtw, appStyle.pv10]}>
        <H1>{t('screen_common_departure-comment')}</H1>
      </View>

      <Text style={styles.textComment}>{departureNote}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  textComment: {
    fontSize: 16,
    color: ColorSet.textBase,
  },
});

export default DepartureNote;
