import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
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
const CreateNewIncident: React.FC<{navigation: any}> = ({navigation}) => {
  const {t} = useTranslation();
  const [selectedTrip, setSelectedTrip] = React.useState('');
  const [tripDropdownView, setTripDropdownView] = React.useState(false);
  const [selectedPass, setSelectedPass] = React.useState('');
  const [passDropdownView, setPassDropdownView] = React.useState(false);
  const [dateOfIncident, setDateOfIncident] = React.useState('');
  const [dateOfIncidentView, setDateOfIncedentView] = React.useState(false);
  const [date, setDate] = React.useState('');
  const [dateView, setDateView] = React.useState(false);
  const tripArray = [
    {title: 'Flight to Brazil', id: 1},
    {title: 'Flight to London', id: 2},
    {title: 'Flight to Germany', id: 3},
  ];
  const passArray = [
    {name: 'John Doe', id: 1},
    {name: 'Mark', id: 2},
  ];

  const selectrip = data => {
    setSelectedTrip(data);
    setTripDropdownView(false);
  };

  const selectPassenger = data => {
    setSelectedPass(data);
    setPassDropdownView(false);
  };

  const selectDate = (value, type) => {
    Keyboard.dismiss();
    type === 1
      ? setDateOfIncident(value.toDateString())
      : setDate(value.toDateString());
  };

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.goBack()}
        title={t('screen_common_addIncident')}
        // headerIconTwo={Icons.notification}
        // onPressheaderIconTwo={() => navigation.navigate(Screen.Notification)}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <View style={[appStyle.p25, appStyle.flex1]}>
          <View style={[appStyle.pb20]}>
            <TextField
              label={t('tripeName')}
              fontSize={16}
              value={selectedTrip}
              baseColor={ColorSet.grey}
              editable={false}
              tintColor={ColorSet.red}
              renderRightAccessory={() => (
                <TouchableOpacity
                  onPress={() => setTripDropdownView(!tripDropdownView)}>
                  <Image
                    source={tripDropdownView ? Icons.arrowUp : Icons.arrowDown}
                    style={styles.arrowDownStyle}
                  />
                </TouchableOpacity>
              )}
            />
            {tripDropdownView && (
              <View style={[appStyle.flex1, appStyle.mv5]}>
                {/* Items are harcoded above */}
                {tripArray.map((data, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => selectrip(data.title)}
                      key={index}
                      style={appStyle.pv10}>
                      <Text style={{color: ColorSet.black}}>{data.title}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
            <TextField
              label={t('tripStateDate')}
              fontSize={16}
              baseColor={ColorSet.grey}
              tintColor={ColorSet.red}
            />
            <TextField
              label={t('dateOfNewIncident')}
              value={dateOfIncident}
              onFocus={() => setDateOfIncedentView(!dateOfIncidentView)}
              fontSize={16}
              onChangeText={() => setDateOfIncedentView(!dateOfIncidentView)}
              baseColor={ColorSet.grey}
              tintColor={ColorSet.red}
            />
            <DateTimePickerModal
              isVisible={dateOfIncidentView}
              mode="date"
              onConfirm={value => selectDate(value, 1)}
              onCancel={() => setDateOfIncedentView(!dateOfIncidentView)}
            />
            <TextField
              label={t('tcName')}
              fontSize={16}
              baseColor={ColorSet.grey}
              tintColor={ColorSet.red}
            />
            <TextField
              label={t('passengerName')}
              fontSize={16}
              value={selectedPass}
              baseColor={ColorSet.grey}
              editable={false}
              tintColor={ColorSet.red}
              renderRightAccessory={() => (
                <TouchableOpacity
                  onPress={() => setPassDropdownView(!passDropdownView)}>
                  <Image
                    source={passDropdownView ? Icons.arrowUp : Icons.arrowDown}
                    style={styles.arrowDownStyle}
                  />
                </TouchableOpacity>
              )}
            />
            {passDropdownView && (
              <View style={[appStyle.flex1, appStyle.mv5]}>
                {passArray.map((data, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => selectPassenger(data.name)}
                      key={index}
                      style={appStyle.pv10}>
                      <Text style={{color: ColorSet.black}}>{data.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
            <TextField
              label={t('briefDescriptionOfTheIncident')}
              fontSize={16}
              baseColor={ColorSet.grey}
              tintColor={ColorSet.red}
              multiline={true}
            />
            <TextField
              label={t('fullName')}
              fontSize={16}
              baseColor={ColorSet.grey}
              tintColor={ColorSet.red}
            />
            <TextField
              label={t('date')}
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
              onConfirm={value => selectDate(value, 2)}
              onCancel={() => setDateView(!dateView)}
            />
            <TextField
              label={t('city')}
              fontSize={16}
              baseColor={ColorSet.grey}
              tintColor={ColorSet.red}
              multiline={true}
            />
            <Text style={styles.desTextStyle}>
              {t('text_signingThisMeansYouConfirmAllInfo')}
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View style={appStyle.p20}>
        <Button onPress={() => navigation.goBack()}>
          {t('button_SaveAndSendTotravler')}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default CreateNewIncident;

const styles = StyleSheet.create({
  arrowDownStyle: {
    resizeMode: 'contain',
    width: 20,
    height: 15,
  },
  desTextStyle: {
    color: ColorSet.grey,
    fontSize: 16,
    fontFamily: FamilySet.regular,
    paddingTop: 10,
    textAlign: 'center',
  },
});
