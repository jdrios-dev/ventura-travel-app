import React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  StatusBar,
  TextInput,
} from 'react-native';

import appStyle from '../../../styles/appStyle';
import Button from '../../../components/Button';
import {Icons, Images} from '../../../constants';
import {ColorSet, FamilySet} from '../../../styles';
import {Header, NewMessage} from '../../../components/index';
import {Screen} from '../../../constants/screens/screens';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {createFilter} from 'react-native-search-filter';
import {useTranslation} from 'react-i18next';
const KEYS_TO_FILTERS = ['name'];

const GroupMembers: React.FC<{navigation: any}> = ({navigation}) => {
  const {t} = useTranslation();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [addedMembersArray, setAddMembersArray] = React.useState([
    {
      image: Images.dummy,
      name: 'Jhon Doe',
      id: 1,
    },
    {
      image: Images.dummyTwo,
      name: 'Mark',
      id: 2,
    },
    {
      image: Images.dummyThree,
      name: 'Seth',
      id: 3,
    },
  ]);

  const [membersArray, setMembersArray] = React.useState([
    {
      image: Images.dummy,
      name: 'Adam',
      id: 4,
    },
  ]);

  const addMembersToList = id => {
    const arr = membersArray.filter(item => item.id !== id);
    setMembersArray(arr);
    const findValue = membersArray.find(data => data.id === id);
    addedMembersArray.push(findValue);
  };

  const removeMembersFromList = id => {
    const arr = addedMembersArray.filter(item => item.id !== id);
    setAddMembersArray(arr);
    const findValue = addedMembersArray.find(data => data.id === id);
    membersArray.push(findValue);
  };

  const filteredArray = membersArray.filter(
    createFilter(searchTerm, KEYS_TO_FILTERS),
  );

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.goBack()}
        title={t('text_members')}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <View style={[appStyle.p25, appStyle.flex1]}>
          <View>
            <Text style={styles.titleStyle}>{t('text_peopleAddedToChat')}</Text>
            {addedMembersArray.length > 0 ? (
              addedMembersArray.map((data, index) => {
                return (
                  <View key={index}>
                    <NewMessage
                      onPressIcon={() => removeMembersFromList(data.id)}
                      image={data.image}
                      name={data.name}
                      icon={Icons.crossRed}
                    />
                  </View>
                );
              })
            ) : (
              <Text style={styles.emptyTextStyle}>{t('text_empty')}</Text>
            )}
          </View>
          <View>
            <Text style={styles.titleStyle}>{t('text_addNewMembers')}</Text>
            <View style={appStyle.pb20}>
              <TextInput
                placeholder={t('text_searchForPeople')}
                placeholderTextColor={ColorSet.grey}
                selectionColor={ColorSet.grey}
                onChangeText={term => setSearchTerm(term)}
                style={styles.textInputStyle}
              />
            </View>
            {filteredArray.length > 0 ? (
              filteredArray.map((data, index) => {
                return (
                  <View key={index}>
                    <NewMessage
                      onPressIcon={() => addMembersToList(data.id)}
                      image={data.image}
                      name={data.name}
                      icon={Icons.emptyChexBox}
                    />
                  </View>
                );
              })
            ) : (
              <Text style={styles.emptyTextStyle}>{t('text_empty')}</Text>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View style={appStyle.p20}>
        <Button onPress={() => navigation.goBack()}>{t('button_save')}</Button>
      </View>
    </SafeAreaView>
  );
};

export default GroupMembers;

const styles = StyleSheet.create({
  emptyTextStyle: {
    fontSize: 16,
    color: ColorSet.secondary,
    alignSelf: 'center',
  },
  textInputStyle: {
    borderBottomWidth: 1,
    borderBottomColor: ColorSet.grey,
    color: ColorSet.grey,
  },
  titleStyle: {
    fontSize: 22,
    fontFamily: FamilySet.bold,
    color: ColorSet.secondary,
    paddingTop: 10,
    paddingBottom: 20,
  },
});
