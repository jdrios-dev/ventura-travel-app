import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';

import appStyle from '../../../styles/appStyle';
import {Icons, Images} from '../../../constants';
import {ColorSet, FamilySet} from '../../../styles';
import {Header, NewMessage, Button} from '../../../components/index';
import {Screen} from '../../../constants/screens/screens';

import {createFilter} from 'react-native-search-filter';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
const KEYS_TO_FILTERS = ['name'];

const NewChatScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {t} = useTranslation();
  const [searchTerm, setSearchTerm] = React.useState('');
  const newChatArray = [
    {
      image: Images.dummy,
      name: 'John Doe',
    },
    {
      image: Images.dummyThree,
      name: 'Mark',
    },
    {
      image: Images.dummyTwo,
      name: 'Alex',
    },
  ];

  const filteredArray = newChatArray.filter(
    createFilter(searchTerm, KEYS_TO_FILTERS),
  );

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.goBack()}
        title={t('local_common_newChat')}
        headerIconOne={Icons.notification}
        onPressheaderIconOne={() => navigation.navigate(Screen.Notification)}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <View style={[appStyle.p25, appStyle.flex1]}>
          <Button
            onPress={() => navigation.navigate(Screen.CreateNewGroup)}
            icon={Icons.group}>
            {t('button_createNewGroup')}
          </Button>
          <View style={[appStyle.rowBtw, appStyle.pv15]}>
            <View style={styles.divider} />
            <View>
              <Text style={styles.dividerTextStyle}>
                {t('text_sendMessageToSignlePersion')}
              </Text>
            </View>
            <View style={styles.divider} />
          </View>
          <View style={appStyle.pb20}>
            <TextInput
              placeholder={t('enterNameToSearch')}
              placeholderTextColor={ColorSet.grey}
              selectionColor={ColorSet.grey}
              style={styles.textInputStyle}
              onChangeText={term => setSearchTerm(term)}
            />
          </View>
          {filteredArray.map((data, index) => {
            return (
              <View key={index}>
                <NewMessage
                  onPressIcon={() =>
                    navigation.navigate(Screen.ChatDetailScreen)
                  }
                  image={data.image}
                  name={data.name}
                  icon={Icons.send}
                />
              </View>
            );
          })}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default NewChatScreen;

const styles = StyleSheet.create({
  textInputStyle: {
    borderBottomWidth: 1,
    borderBottomColor: ColorSet.grey,
    color: ColorSet.grey,
  },
  divider: {
    borderBottomWidth: 1,
    flex: 1,
    borderBottomColor: ColorSet.grey,
  },
  dividerTextStyle: {
    paddingHorizontal: 10,
    fontSize: 12,
    color: ColorSet.grey,
    fontFamily: FamilySet.regular,
  },
});
