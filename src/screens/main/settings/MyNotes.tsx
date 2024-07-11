import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';

import appStyle from '../../../styles/appStyle';
import {Icons} from '../../../constants';
import {ColorSet, FamilySet} from '../../../styles';
import {Header, Button, BottomSheet} from '../../../components/index';
import {Screen} from '../../../constants/screens/screens';
import ReadMore from 'react-native-read-more-text';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import {deleteNote, getNotes} from '../../../networking/Services';
import Loader from '../../../components/Loader';
import dateFormator from '../../../components/formatesManager/DateFormateHandler';
import {getLocalizedDateFormat} from '../../../utils/datesFormater';
import {Language} from '../../../types/common.types';
const bottomRef = React.createRef<any>();

const MyNotes: React.FC<{navigation: any}> = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [notesArray, setNotesArray] = useState<any>([]);
  const [note, setNote] = useState<any>('');
  const [isLoading, setIsloading] = useState(false);
  const [notAvailabel, setNotAvailabel] = useState(false);
  const getAllNotes = async () => {
    setIsloading(true);
    const response = await getNotes();
    setIsloading(false);
    const sortedNotes = response.sort(function (a: any, b: any) {
      return new Date(b.created_at) - new Date(a.created_at);
    });
    setNotesArray('');
    setNotesArray(response && sortedNotes);
    setNotAvailabel(response.length === 0 && true);
  };
  const deleteNotes = async () => {
    bottomRef.current?.setModalVisible(false);
    setIsloading(true);
    const response = await deleteNote(note.id);
    setIsloading(false);
    if (response) {
      notesArray.length === 1 && setNotAvailabel(true);
      const result = notesArray?.filter((element: any) => {
        return element.id !== note.id;
      });
      setNotesArray(result);
      return;
    }
  };

  const renderTruncatedFooter = handlePress => {
    return (
      <Text style={{color: ColorSet.theme, marginTop: 5}} onPress={handlePress}>
        {t('text_read-more')}
      </Text>
    );
  };

  const renderRevealedFooter = handlePress => {
    return (
      <Text style={{color: ColorSet.theme, marginTop: 5}} onPress={handlePress}>
        {t('text_show-less')}
      </Text>
    );
  };

  useEffect(() => {
    getAllNotes();
  }, []);
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getAllNotes();
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <Loader isLoading={isLoading} layout={'outside'} />
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.goBack()}
        title={t('Touchable_MyNotes')}
        // headerIconTwo={Icons.notification}
        // onPressheaderIconTwo={() => navigation.navigate(Screen.Notification)}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        {notesArray.length > 0 && (
          <View style={[appStyle.p25, appStyle.flex1]}>
            {notesArray.map((data: any, index: number) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    bottomRef.current?.setModalVisible();
                    setNote(data);
                  }}
                  key={index}
                  style={styles.containerStyle}>
                  <Text style={styles.titleTextStyle}>{data.title}</Text>
                  <Text style={styles.titleTextStyle}>{data.label}</Text>
                  <ReadMore
                    numberOfLines={3}
                    renderTruncatedFooter={renderTruncatedFooter}
                    renderRevealedFooter={renderRevealedFooter}>
                    <Text style={styles.answerTextStyle}>
                      {notesArray && data?.description}
                    </Text>
                  </ReadMore>
                  <Text style={styles.dateTextStyle}>
                    {dateFormator(
                      data.created_at,
                      getLocalizedDateFormat(i18n.language as Language),
                    )}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        {notAvailabel && !isLoading && (
          <View
            style={[
              appStyle.p25,
              appStyle.flex1,
              appStyle.aiCenter,
              appStyle.jcCenter,
            ]}>
            <Text style={styles.titleTextStyle}>
              {t('text_no-notes-avaialble')}
            </Text>
          </View>
        )}
      </KeyboardAwareScrollView>
      <View style={appStyle.p20}>
        <Button
          onPress={() => {
            navigation.navigate(Screen.AddNotes);
            setNotAvailabel(false);
          }}>
          {t('button_Addnotes')}
        </Button>
      </View>
      <BottomSheet bottomSheetRef={bottomRef}>
        <View>
          <TouchableOpacity
            onPress={() => {
              bottomRef.current?.setModalVisible(false);
              navigation.navigate(Screen.AddNotes, {note});
            }}
            style={[appStyle.rowCenter, appStyle.pv15]}>
            <Image source={Icons.settingBlue} style={styles.iconStyle} />
            <Text style={styles.buttonTextStyle}>{t('button_editNote')}</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            onPress={() => deleteNotes()}
            style={[appStyle.rowCenter, appStyle.pt15]}>
            <Image source={Icons.delete} style={styles.iconStyle} />
            <Text style={styles.buttonTextStyle}>{t('button_delete')}</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default MyNotes;

const styles = StyleSheet.create({
  buttonTextStyle: {
    color: ColorSet.secondary,
    fontSize: 16,
    fontFamily: FamilySet.semiBold,
  },
  divider: {
    borderWidth: 1,
    borderColor: ColorSet.dividerColor,
  },
  iconStyle: {
    width: 13,
    height: 13,
    resizeMode: 'contain',
    marginRight: 5,
  },
  containerStyle: {
    backgroundColor: ColorSet.secondaryLight,
    padding: 10,
    marginBottom: 10,
  },
  titleTextStyle: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
    color: ColorSet.secondary,
    paddingBottom: 5,
  },
  detailTextStyle: {
    fontSize: 12,
    fontFamily: FamilySet.bold,
    color: ColorSet.grey,
    paddingBottom: 5,
  },
  dateTextStyle: {
    fontSize: 12,
    marginTop: 7,
    fontFamily: FamilySet.bold,
    color: ColorSet.secondary,
    paddingBottom: 5,
  },
  answerTextStyle: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
    color: ColorSet.grey,
  },
});
