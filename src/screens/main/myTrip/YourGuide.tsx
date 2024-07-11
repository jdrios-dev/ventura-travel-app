import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import appStyle from '../../../styles/appStyle';
import {ColorSet, FamilySet} from '../../../styles';
import {Header} from '../../../components/index';
import {Screen} from '../../../constants/screens/screens';
import {screenWidth} from '../../../styles/screenSize';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import {isNetworkAvailable} from '../../../utils';
import {getMoreInformation} from '../../../networking/Services';
const YourGuide: React.FC<{navigation: any}> = ({navigation}) => {
  const {t} = useTranslation();
  const [isLoading, setIsloading] = useState(false);
  const [information, setInformation] = useState<any>([]);

  const [fetching, setFetching] = useState(true);
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

  if (isLoading) {
    return <ActivityIndicator size="large" color={ColorSet.theme} />;
  }

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.goBack()}
        title={t('Touchable_yourGuide')}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <View style={[appStyle.p25, appStyle.flex1]}>
          <View style={[appStyle.row, appStyle.pb15]}>
            <View style={{width: screenWidth.width20}}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(Screen.ImageViewer, {
                    items: information?.guide?.media?.[0],
                  })
                }>
                <Image
                  source={information?.guide?.media?.[0]}
                  style={styles.imageStyle}
                />
              </TouchableOpacity>
            </View>
            <View style={[appStyle.flex1, appStyle.ph10]}>
              <Text style={styles.textStyle}>{information?.guide?.name}</Text>
            </View>
          </View>
          <Text style={styles.titleStyle}>
            {information?.guide?.description}
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default YourGuide;

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
    color: ColorSet.grey,
    paddingBottom: 20,
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
