import {View, Text, SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import React from 'react';
import {ColorSet, appStyle} from '../../../styles';
import {Header} from '../../../components';
import {Icons, Screen} from '../../../constants';
import {compressString} from '../../../utils/helper';
import {t} from 'i18next';

const ReceiptDetail = ({navigation, route}) => {
  const {
    number = '',
    amount = '',
    currency = '',
    placeAndDate = '',
    reason = '',
    signature = '',
  } = route?.params?.receipt;

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.goBack()}
        title={compressString(number || '', 20)}
        // headerIconTwo={Icons.notification}
        // onPressheaderIconTwo={() => navigation.navigate(Screen.NewReceipt)}
      />
      <View style={[appStyle.ph10, appStyle.pt10]}>
        <View style={[appStyle.row, appStyle.jcSpaceBetween, appStyle.mb20]}>
          <View>
            <Text style={[styles.title, {fontWeight: 'bold'}]}>
              {t('tile_receipt-own-receipt')}
            </Text>
            <Text style={styles.label}>Ventura Travel GMBH</Text>
          </View>
          <View style={appStyle.aiFlexEnd}>
            <Text style={styles.label}>{t('label_receipt-label-number')}</Text>
            <Text style={[styles.value, {fontWeight: 'bold'}]}>{number}</Text>
          </View>
        </View>

        <Text style={styles.label}>{t('label_receipt-label-amount')}</Text>
        <Text style={styles.value}>
          {amount} {currency}
        </Text>
        <Text style={styles.label}>{t('label_receipt-label-place-date')}</Text>
        <Text style={styles.value}>{placeAndDate}</Text>
        <Text style={styles.label}>{t('label_receipt-label-reason')}</Text>
        <Text style={styles.value}>{reason}</Text>
        <Text style={styles.label}>{t('label_receipt-label-signature')}</Text>
        <Text style={styles.value}>{signature}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 5,
    fontSize: 18,
    color: ColorSet.secondary,
  },

  value: {
    marginBottom: 15,
    fontSize: 20,
    color: ColorSet.textBase,
  },
  title: {
    fontSize: 24,
    color: ColorSet.textBase,
  },
});

export default ReceiptDetail;
