import React from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {ColorSet, FamilySet, appStyle} from '../../styles';
import {H1} from '../Typography';
import {useTranslation} from 'react-i18next';
import {StackNavigationProp} from '@react-navigation/stack';
import {Screen} from '../../constants';
import dateFormator from '../formatesManager/DateFormateHandler';
import {getLocalizedDateFormat} from '../../utils/datesFormater';
import {Language} from '../../types/common.types';

type NavigationProp = StackNavigationProp<any, Screen.PassengerList>;

type PaxBirthdatType = {
  id: string;
  name: string;
  birthday: string;
  firstName: string;
  lastName: string;
  isBirthday: boolean;
};

type PaxBirthdayListProps = {
  listPax: PaxBirthdatType[] | null;
  navigation: NavigationProp;
};

const PaxBirthdayList = ({listPax, navigation}: PaxBirthdayListProps) => {
  const {t, i18n} = useTranslation();

  return (
    <>
      <View style={[appStyle.rowBtw, appStyle.pv10]}>
        <H1>{t('screen_common_birthday')}</H1>
        <TouchableOpacity
          onPress={() => navigation.navigate(Screen.PassengerList)}>
          <Text style={styles.viewAllTextStyle}>
            {t('local_common_Passengers')}
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={listPax}
        renderItem={({item}) => (
          <View key={item.id} style={[appStyle.pb10]}>
            <Text
              style={[
                styles.titleTextStyle,
              ]}>{`${item.firstName} ${item.lastName}`}</Text>
            <Text style={[styles.titleTextStyle, {color: ColorSet.secondary}]}>
              {dateFormator(
                item.birthday,
                getLocalizedDateFormat(i18n.language as Language),
              )}
            </Text>
          </View>
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  titleTextStyle: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
    color: ColorSet.theme,
    paddingBottom: 5,
  },
  viewAllTextStyle: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
    color: ColorSet.grey,
  },
});

export default PaxBirthdayList;
