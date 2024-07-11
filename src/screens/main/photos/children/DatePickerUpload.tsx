import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {TextField} from 'rn-material-ui-textfield';
import {ColorSet} from '../../../../styles/colors';
import formatISO from 'date-fns/formatISO';
/**
 * We had to create this tricky date picker due to on iOS when you select the date
 * it closes and open again the modal, which gives a bad UX.
 *
 * Daniel - 7 Mar 2023
 */
const DatePickerUpload = ({setDateView, dateView, date, selectDate}) => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <TextField
        label={t('date')}
        value={date}
        fontSize={16}
        onChangeText={() => setDateView(!dateView)}
        baseColor={ColorSet.grey}
        tintColor={ColorSet.red}
      />

      <TouchableOpacity
        style={styles.touchableOpacity}
        onPress={() => setDateView(!dateView)}
      />

      <DateTimePickerModal
        isVisible={dateView}
        mode="date"
        onConfirm={value => {
          selectDate(new Date(formatISO(value)));
          setDateView(!dateView);
        }}
        onCancel={() => setDateView(!dateView)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  touchableOpacity: {
    top: 10,
    right: 0,
    left: 0,
    bottom: 0,
    position: 'absolute',
  },
  container: {
    position: 'relative',
  },
});

export default DatePickerUpload;
