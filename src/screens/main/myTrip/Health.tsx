import React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  Keyboard,
} from 'react-native';

import appStyle from '../../../styles/appStyle';
import {Icons} from '../../../constants';
import {ColorSet, FamilySet} from '../../../styles';
import {Header, Button} from '../../../components/index';
import {Screen} from '../../../constants/screens/screens';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TextField} from 'rn-material-ui-textfield';
import {useTranslation} from 'react-i18next';
const Health: React.FC<{navigation: any}> = ({navigation}) => {
  const {t} = useTranslation();
  const [bloodGroupView, setBloodGroupView] = React.useState(false);
  const [selectedbloodGroup, setSelectedBloodGroup] = React.useState('');
  const [medicineArray, setMedicineArray] = React.useState([]);
  const [addMedInput, setAddMedInput] = React.useState(false);
  const [medName, setMedName] = React.useState('');
  const [editMedicine, setEditMedicine] = React.useState('');
  const [editMedicineValue, setEditMedicineValue] = React.useState(false);
  const bloodGroupAray = [
    {title: 'A+', id: 1},
    {title: 'A-', id: 2},
    {title: 'B+', id: 3},
    {title: 'B-', id: 4},
    {title: 'O+', id: 5},
    {title: 'O-', id: 6},
    {title: 'AB+', id: 7},
    {title: 'AB-', id: 8},
  ];

  const addMedicine = () => {
    medName !== '' && medicineArray.push(medName);
    setAddMedInput(false);
  };

  const editMed = data => {
    const arr = medicineArray.filter(item => item !== data);
    setMedicineArray(arr);
    setEditMedicine(data);
    setEditMedicineValue(true);
  };

  const deleteMed = data => {
    const arr = medicineArray.filter(item => item !== data);
    setMedicineArray(arr);
  };

  const updateMed = () => {
    Keyboard.dismiss();
    editMedicine !== '' && medicineArray.push(editMedicine);
    setAddMedInput(false);
    setEditMedicineValue(false);
  };

  const selectBlood = data => {
    setSelectedBloodGroup(data);
    setBloodGroupView(false);
  };

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.goBack()}
        title={t('local_common_healthForm')}
        headerIconOne={Icons.notification}
        onPressheaderIconOne={() => navigation.navigate(Screen.Notification)}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <View style={[appStyle.p20, appStyle.flex1]}>
          <Text style={styles.titleStyle}>
            {t('text_pleasefillInformationCorrectly')}
          </Text>
          <View style={[appStyle.pv20]}>
            <TextField
              label={t('name')}
              fontSize={16}
              baseColor={ColorSet.grey}
              tintColor={ColorSet.red}
            />
            <TextField
              label={t('emergencyContactName')}
              fontSize={16}
              baseColor={ColorSet.grey}
              tintColor={ColorSet.red}
            />
            <TextField
              label={t('emergencyContactNumber')}
              fontSize={16}
              baseColor={ColorSet.grey}
              tintColor={ColorSet.red}
            />
            <TextField
              label={t('bloodGroup')}
              fontSize={16}
              value={selectedbloodGroup}
              baseColor={ColorSet.grey}
              editable={false}
              tintColor={ColorSet.red}
              renderRightAccessory={() => (
                <TouchableOpacity
                  onPress={() => setBloodGroupView(!bloodGroupView)}>
                  <Image
                    source={bloodGroupView ? Icons.arrowUp : Icons.arrowDown}
                    style={styles.arrowDownStyle}
                  />
                </TouchableOpacity>
              )}
            />
            {bloodGroupView && (
              <View style={[appStyle.flex1, appStyle.mv5]}>
                {bloodGroupAray.map((data, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => selectBlood(data.title)}
                      key={index}
                      style={appStyle.pv10}>
                      <Text style={{color: ColorSet.black}}>{data.title}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
            <View style={[appStyle.rowBtw, appStyle.pt10]}>
              <Text style={[styles.titleStyle]}>Medicine</Text>
              <TouchableOpacity onPress={() => setAddMedInput(true)}>
                <Text style={[styles.titleStyle]}>+ {t('button_add')} </Text>
              </TouchableOpacity>
            </View>
            {medicineArray.length > 0 ? (
              medicineArray.map((data, index) => {
                return (
                  <View key={index} style={[appStyle.rowBtw, appStyle.pt10]}>
                    <Text style={[styles.titleStyle]}>{data}</Text>
                    <View style={[appStyle.row]}>
                      <TouchableOpacity
                        onPress={() => editMed(data)}
                        style={[appStyle.rowCenter, appStyle.pr5]}>
                        <Image
                          source={Icons.edit}
                          style={styles.arrowDownStyleTwo}
                        />
                        <Text style={[styles.titleStyle]}>
                          {t('text_Edit')}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => deleteMed(data)}
                        style={appStyle.rowCenter}>
                        <Image
                          source={Icons.deleteGrey}
                          style={styles.arrowDownStyleTwo}
                        />
                        <Text style={[styles.titleStyle]}>
                          {t('button_delete')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={[appStyle.ph30, appStyle.pt20]}>
                <Text
                  style={{
                    color: ColorSet.grey,
                    fontFamily: FamilySet.regular,
                    fontSize: 12,
                    textAlign: 'center',
                  }}>
                  {t('text_noMedicineAdded')}
                </Text>
              </View>
            )}
            {editMedicineValue && (
              <TextField
                label={t('editMedicineName')}
                placeholder={editMedicine}
                placeholderTextColor={ColorSet.grey}
                fontSize={16}
                baseColor={ColorSet.grey}
                tintColor={ColorSet.red}
                onChangeText={value => setEditMedicine(value)}
                renderRightAccessory={() => (
                  <View>
                    <TouchableOpacity
                      style={appStyle.pl10}
                      onPress={() => updateMed()}>
                      <Image
                        source={Icons.tickGrey}
                        style={styles.arrowDownStyleTwo}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}
            {addMedInput && (
              <TextField
                label={t('addMedicineName')}
                fontSize={16}
                baseColor={ColorSet.grey}
                tintColor={ColorSet.red}
                onChangeText={value => setMedName(value)}
                renderRightAccessory={() => (
                  <View style={appStyle.row}>
                    <TouchableOpacity onPress={() => setAddMedInput(false)}>
                      <Image
                        source={Icons.crossGrey}
                        style={styles.arrowDownStyleTwo}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={appStyle.pl10}
                      onPress={() => addMedicine()}>
                      <Image
                        source={Icons.tickGrey}
                        style={styles.arrowDownStyleTwo}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View style={appStyle.p20}>
        <Button onPress={() => navigation.replace(Screen.HealthFormSigning)}>
          {t('button_Next')}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default Health;

const styles = StyleSheet.create({
  arrowDownStyle: {
    resizeMode: 'contain',
    width: 20,
    height: 15,
  },
  arrowDownStyleTwo: {
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
