import React from 'react';
import {View, SafeAreaView, StatusBar} from 'react-native';
import * as yup from 'yup';
import appStyle from '../../../styles/appStyle';
import {Icons} from '../../../constants';
import {ColorSet} from '../../../styles';
import {Header, Button} from '../../../components/index';
import {Screen} from '../../../constants/screens/screens';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TextField} from 'rn-material-ui-textfield';
import {useTranslation} from 'react-i18next';
import {Formik} from 'formik';
const NewReceipt: React.FC<{navigation: any}> = ({navigation}) => {
  const {t} = useTranslation();

  const receiptValidationSchema = yup.object().shape({
    number: yup.string().required(t('error_receipt-number-mandatory')),
    amount: yup.string().required(t('error_receipt-value-mandatory')),
    currency: yup.string().required(t('error_receipt-currency-mandatory')),
    placeAndDate: yup
      .string()
      .required(t('error_receipt-place-date-mandatory')),
    reason: yup.string().required(t('error_receipt-reason-mandatory')),
    signature: yup.string().required(t('error_receipt-signature-mandatory')),
  });

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.goBack()}
        title={t('Touchable_addreceipt')}
        // headerIconTwo={Icons.notification}
        // onPressheaderIconTwo={() => navigation.navigate(Screen.Notification)}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <View style={[appStyle.p25, appStyle.flex1]}>
          {/* TODO: Add validation with yup */}
          <Formik
            validationSchema={receiptValidationSchema}
            initialValues={{
              number: '',
              amount: '',
              currency: '',
              placeAndDate: '',
              reason: '',
              signature: '',
            }}
            onSubmit={values => {
              navigation.navigate(Screen.ReceiptDetail, {receipt: values});
            }}>
            {({handleChange, handleSubmit, values, resetForm, errors}) => (
              <View>
                <TextField
                  label={t('receiptNumber')}
                  onChangeText={handleChange('number')}
                  fontSize={16}
                  baseColor={ColorSet.grey}
                  tintColor={ColorSet.red}
                  value={values.number}
                  error={errors.number}
                />
                <TextField
                  label={t('ammount')}
                  onChangeText={handleChange('amount')}
                  fontSize={16}
                  baseColor={ColorSet.grey}
                  tintColor={ColorSet.red}
                  value={values.amount}
                  error={errors.amount}
                />
                <TextField
                  label={t('currency')}
                  onChangeText={handleChange('currency')}
                  fontSize={16}
                  baseColor={ColorSet.grey}
                  tintColor={ColorSet.red}
                  value={values.currency}
                  error={errors.currency}
                />
                <TextField
                  label={t('label_receipt-label-place-date')}
                  onChangeText={handleChange('placeAndDate')}
                  fontSize={16}
                  baseColor={ColorSet.grey}
                  tintColor={ColorSet.red}
                  value={values.placeAndDate}
                  error={errors.placeAndDate}
                />
                <TextField
                  label={t('reasonForReceipt')}
                  onChangeText={handleChange('reason')}
                  fontSize={16}
                  autoComplete="none"
                  baseColor={ColorSet.grey}
                  tintColor={ColorSet.red}
                  value={values.reason}
                  error={errors.reason}
                  multiline={true}
                />
                <TextField
                  label={t('by')}
                  onChangeText={handleChange('signature')}
                  fontSize={16}
                  baseColor={ColorSet.grey}
                  tintColor={ColorSet.red}
                  value={values.signature}
                  error={errors.signature}
                />
                <View style={appStyle.p10}>
                  <Button onPress={() => handleSubmit()}>
                    {t('button_generateReceipt')}
                  </Button>
                </View>
                <View style={appStyle.p10}>
                  <Button onPress={() => resetForm()}>
                    {t('button_reset-form')}
                  </Button>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default NewReceipt;
