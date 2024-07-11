import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';

import appStyle from '../../../styles/appStyle';
import {ColorSet, FamilySet} from '../../../styles';
import {Header} from '../../../components/index';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import {getMoreInformation} from '../../../networking/Services';
import isNetworkAvailable from '../../../utils/InternetConnection';
import {screenWidth} from '../../../styles/screenSize';
import Loader from '../../../components/Loader';
const MoreInformation: React.FC<{navigation: any}> = ({navigation}) => {
  const {t} = useTranslation();
  const [infromation, setInformation] = useState<any>([]);
  const [isLoading, setIsloading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [moreInfo, setMoreInfo] = React.useState(true);
  const [guide, setGuide] = React.useState(false);
  const [engagement, setengagement] = React.useState(false);

  const updateState = type => {
    setMoreInfo(false);
    setGuide(false);
    setengagement(false);
    if (type === 1) {
      setMoreInfo(true);
      setGuide(false);
      setengagement(false);
    }
    if (type === 2) {
      setGuide(true);
      setengagement(false);
      setMoreInfo(false);
    }
    if (type === 3) {
      setGuide(false);
      setengagement(true);
      setMoreInfo(false);
    }
  };

  useEffect(() => {
    async function getData() {
      if (await isNetworkAvailable()) {
        await getInformation();
      }
      setFetching(false);
    }

    fetching && getData();
  }, [fetching]);
  const getInformation = async () => {
    setIsloading(true);
    const res = await getMoreInformation();

    if (res) {
      setInformation(res);
    }
    setIsloading(false);
  };

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.goBack()}
        title={t('h1_moreInformation')}
        // headerIconOne={Icons.notification}
        // onPressheaderIconOne={() => navigation.navigate(Screen.Notification)}
      />
      <View style={[appStyle.row, appStyle.p25]}>
        <TouchableOpacity
          onPress={() => updateState(1)}
          style={[
            styles.tabStyle,
            {borderBottomColor: moreInfo ? ColorSet.theme : ColorSet.grayLight},
          ]}>
          <Text
            style={[
              styles.tabLableStyle,
              {color: moreInfo ? ColorSet.theme : ColorSet.grey},
            ]}>
            {t('h1_moreInformation')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => updateState(2)}
          style={[
            styles.tabStyle,
            {borderBottomColor: guide ? ColorSet.theme : ColorSet.grayLight},
          ]}>
          <Text
            style={[
              styles.tabLableStyle,
              {color: guide ? ColorSet.theme : ColorSet.grey},
            ]}>
            {t('Touchable_yourGuide')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => updateState(3)}
          style={[
            styles.tabStyle,
            {
              borderBottomColor: engagement
                ? ColorSet.theme
                : ColorSet.grayLight,
            },
          ]}>
          <Text
            style={[
              styles.tabLableStyle,
              {color: engagement ? ColorSet.theme : ColorSet.grey},
            ]}>
            {t('text_engagement')}
          </Text>
        </TouchableOpacity>
      </View>
      {moreInfo && (
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={appStyle.scrollContainer}>
          <View style={[appStyle.p25, appStyle.flex1]}>
            <Text style={styles.titleStyle}>{infromation?.moreInfo}</Text>
          </View>
        </KeyboardAwareScrollView>
      )}
      {guide && (
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={appStyle.scrollContainer}>
          <View style={[appStyle.p25, appStyle.flex1]}>
            <View style={[appStyle.row, appStyle.pb15]}>
              <View style={{width: screenWidth.width20}}>
                <Image
                  source={{uri: infromation?.guide?.media?.[0]?.url}}
                  style={styles.imageStyle}
                />
              </View>
              <View style={[appStyle.flex1, appStyle.ph10]}>
                <Text style={styles.textStyle}>{infromation?.guide?.name}</Text>
              </View>
            </View>
            <Text style={styles.titleStyle}>
              {infromation?.guide?.description}
            </Text>
          </View>
        </KeyboardAwareScrollView>
      )}
      {engagement && (
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={appStyle.scrollContainer}>
          <View style={[appStyle.p25, appStyle.flex1]}>
            <Text style={styles.titleStyle}>{infromation?.engagement}</Text>
          </View>
        </KeyboardAwareScrollView>
      )}
      <Loader isLoading={isLoading} layout={'outside'} />
    </SafeAreaView>
  );
};

export default MoreInformation;

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
    color: ColorSet.grey,
    letterSpacing: 1,
  },
  tabLableStyle: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
  },
  tabStyle: {
    width: screenWidth.width45,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    flex: 1,
  },
  imageStyle: {
    width: 70,
    height: 70,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    resizeMode: 'contain',
  },
  textStyle: {
    fontSize: 22,
    fontFamily: FamilySet.bold,
    color: ColorSet.theme,
  },
});
