import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import appStyle from '../../../styles/appStyle';
import {ColorSet, FamilySet} from '../../../styles';
import {Header} from '../../../components/index';
import {Screen} from '../../../constants/screens/screens';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import {getFAQ} from '../../../networking/Services';
import Loader from '../../../components/Loader';
const Faq: React.FC<{navigation: any}> = ({navigation}) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);
  const [answerViewIndex, setAnswerViewIndex] = React.useState<any>([]);
  const [FAQs, setFAQs] = React.useState<any>([]);
  const getFAQs = async () => {
    setLoading(true);
    const response = await getFAQ();
    setLoading(false);
    if (response) {
      setFAQs(response);
    }
  };

  const answerHandler = (index: number) => {
    if (answerViewIndex.includes(index)) {
      const filteredIndexes = answerViewIndex.filter(function (element) {
        return index !== element;
      });
      setAnswerViewIndex(filteredIndexes);
      return;
    }
    setAnswerViewIndex([...answerViewIndex, index]);
  };
  useEffect(() => {
    getFAQs();
  }, []);

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <Loader isLoading={loading} layout={'outside'} />
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.goBack()}
        title={t('local_common_FAQ')}
        onPressheaderIconOne={() => navigation.navigate(Screen.Notification)}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <View style={[appStyle.p25, appStyle.flex1]}>
          {FAQs?.map((data, index) => {
            return (
              <View key={index} style={appStyle.pb10}>
                <TouchableOpacity
                  onPress={() => answerHandler(index)}
                  style={[
                    appStyle.p10,
                    {
                      backgroundColor: answerViewIndex.includes(index)
                        ? ColorSet.theme
                        : ColorSet.secondaryLight,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.questionTextStyle,
                      {
                        color: answerViewIndex.includes(index)
                          ? ColorSet.white
                          : ColorSet.theme,
                      },
                    ]}>
                    {data?.question}
                  </Text>
                </TouchableOpacity>
                {answerViewIndex.includes(index) && (
                  <View style={styles.asnwerView}>
                    <Text style={styles.answerTextStyle}>{data?.answer}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Faq;

const styles = StyleSheet.create({
  asnwerView: {
    padding: 10,
    backgroundColor: ColorSet.secondaryLight,
  },
  answerTextStyle: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
    color: ColorSet.grey,
  },
  answerHeading: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
    color: ColorSet.theme,
  },
  questionTextStyle: {
    fontSize: 18,
    fontFamily: FamilySet.bold,
  },
});
