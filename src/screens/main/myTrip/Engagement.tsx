import React from 'react';
import {StyleSheet, View, SafeAreaView, Text, StatusBar} from 'react-native';

import appStyle from '../../../styles/appStyle';
import {Icons} from '../../../constants';
import {ColorSet, FamilySet} from '../../../styles';
import {Header} from '../../../components/index';
import {Screen} from '../../../constants/screens/screens';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
const Engagement: React.FC<{navigation: any}> = ({navigation}) => {
  const {t} = useTranslation();
  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.goBack()}
        title={t('local_common_ourEngaement')}
        headerIconOne={Icons.notification}
        onPressheaderIconOne={() => navigation.navigate(Screen.Notification)}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <View style={[appStyle.p25, appStyle.flex1]}>
          <Text style={styles.titleStyle}>
            La découverte du monde doit avoir un impact positif. C'est pourquoi,
            nos voyages répondent toujours à des exigences spécifiques afin de
            produire des effets positifs et durables, tout en veillant à ce que
            vous passiez le meilleur moment de votre vie. Susana Cerón Baumann
            est notre responsable RSE au sein du groupe Ventura TRAVEL, vous
            pouvez lui poser toutes vos questions en visitant notre site web :
            https://www.viventura.fr/engagement-social
          </Text>
          <Text style={styles.titleStyle}>
            Votre voyage est compensé en CO2 Votre voyage est entièrement
            compensé (vol, hôtel, excursions, etc.) par un projet international
            Gold Standard. Nous avons obtenu des certificats de CO2 pour nos
            voyageurs par le biais d'un fournisseur de services de compensation
            de CO2 qui a été testé et certifié par TÜV-Nord.
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Engagement;

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
    color: ColorSet.grey,
    paddingBottom: 20,
  },
});
