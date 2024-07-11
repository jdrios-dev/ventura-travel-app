import React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  StatusBar,
  TextInput,
  Keyboard,
} from 'react-native';

import appStyle from '../../../styles/appStyle';
import {Icons} from '../../../constants';
import {ColorSet, FamilySet} from '../../../styles';
import {Header, Button} from '../../../components/index';
import {Screen} from '../../../constants/screens/screens';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TextField} from 'rn-material-ui-textfield';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useTranslation} from 'react-i18next';
const HealthFormSigning: React.FC<{navigation: any}> = ({navigation}) => {
  const {t} = useTranslation();
  const [medicineArray] = React.useState(['Insulin - 20mg']);
  const [date, setDate] = React.useState('');
  const [dateView, setDateView] = React.useState(false);

  const selectDate = value => {
    Keyboard.dismiss();
    setDate(value.toDateString());
  };
  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.goBack()}
        title={t('local_common_SignHealthForm')}
        headerIconOne={Icons.notification}
        onPressheaderIconOne={() => navigation.navigate(Screen.Notification)}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <View style={[appStyle.p20, appStyle.flex1]}>
          <Text style={styles.titleStyle}>
            {t('text_pleaseCheckAllInformation')}
          </Text>
          <View>
            <View style={appStyle.pb5}>
              <Text style={styles.titleStyleTwo}>{t('name')}</Text>
              <View style={appStyle.row}>
                <TextInput
                  placeholder="jhon Doe"
                  style={styles.searchTextStyle}
                  placeholderTextColor={ColorSet.grey}
                  selectionColor={ColorSet.grey}
                  editable={false}
                />
              </View>
            </View>
            <View style={appStyle.pb5}>
              <Text style={styles.titleStyleTwo}>
                {t('emergencyContactName')}
              </Text>
              <View style={appStyle.row}>
                <TextInput
                  placeholder="jhon Doe"
                  style={styles.searchTextStyle}
                  placeholderTextColor={ColorSet.grey}
                  selectionColor={ColorSet.grey}
                  editable={false}
                />
              </View>
            </View>
            <View style={appStyle.pb5}>
              <Text style={styles.titleStyleTwo}>
                {t('emergencyContactNumber')}
              </Text>
              <View style={appStyle.row}>
                <TextInput
                  placeholder="123-456-7890"
                  style={styles.searchTextStyle}
                  placeholderTextColor={ColorSet.grey}
                  selectionColor={ColorSet.grey}
                  editable={false}
                />
              </View>
            </View>
            <View style={appStyle.pb5}>
              <Text style={styles.titleStyleTwo}>{t('bloodGroup')}</Text>
              <View style={appStyle.row}>
                <TextInput
                  placeholder="O+"
                  style={styles.searchTextStyle}
                  placeholderTextColor={ColorSet.grey}
                  selectionColor={ColorSet.grey}
                  editable={false}
                />
              </View>
            </View>
            <Text style={styles.titleStyleTwo}>{t('text_Medicine')}</Text>
            {medicineArray.map((data, index) => {
              return (
                <View key={index} style={[appStyle.rowBtw, appStyle.pt10]}>
                  <Text style={[styles.titleStyle]}>{data}</Text>
                  <View style={[appStyle.row]} />
                </View>
              );
            })}
            <View style={appStyle.pb10}>
              <TextField
                label={t('fullName')}
                fontSize={16}
                disabled={true}
                baseColor={ColorSet.grey}
                tintColor={ColorSet.red}
              />
              <TextField
                label={t('date')}
                disabled={true}
                value={date}
                onFocus={() => setDateView(!dateView)}
                fontSize={16}
                onChangeText={() => setDateView(!dateView)}
                baseColor={ColorSet.grey}
                tintColor={ColorSet.red}
              />
              <DateTimePickerModal
                isVisible={dateView}
                mode="date"
                onConfirm={value => selectDate(value)}
                onCancel={() => setDateView(!dateView)}
              />
              <TextField
                label={t('city')}
                disabled={true}
                fontSize={16}
                baseColor={ColorSet.grey}
                tintColor={ColorSet.red}
              />
            </View>
            <Text style={styles.titleStyle}>
              {t('text_signingThisMeansYouConfirmAllInfo')}
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View style={appStyle.p20}>
        <Button onPress={() => navigation.goBack()}>
          {t('loginScreen_signUp_title')}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default HealthFormSigning;

const styles = StyleSheet.create({
  titleStyleTwo: {
    color: ColorSet.theme,
    fontSize: 18,
    fontFamily: FamilySet.bold,
  },
  searchTextStyle: {
    fontSize: 17,
    fontFamily: FamilySet.regular,
    color: ColorSet.grey,
    flex: 1,
  },
  arrowDownStyle: {
    resizeMode: 'contain',
    width: 15,
    height: 12,
  },
  titleStyle: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
    color: ColorSet.grey,
    textAlign: 'center',
  },
});
