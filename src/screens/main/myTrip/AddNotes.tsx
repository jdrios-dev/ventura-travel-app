import React, {useState} from 'react';
import {View, SafeAreaView, StatusBar} from 'react-native';

import appStyle from '../../../styles/appStyle';
import {Icons} from '../../../constants';
import {ColorSet} from '../../../styles';
import {Header, Button} from '../../../components/index';
import {Screen} from '../../../constants/screens/screens';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TextField} from 'rn-material-ui-textfield';
import {useTranslation} from 'react-i18next';
import {addNote, editNote} from '../../../networking/Services';
import Loader from '../../../components/Loader';
import {Helper} from '../../../utils';
const AddNotes: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  const notes = route?.params?.note;
  const {t} = useTranslation();
  const [title, setTitle] = useState<any>(notes?.title);
  const [label, setLabel] = useState(notes?.label);
  const [isLoading, setIsloading] = useState(false);
  const [note, setNotes] = useState(notes?.description);
  const notesHandler = async () => {
    if (title && label && note) {
      const params = {
        title: title,
        label: label,
        description: note,
      };
      setIsloading(true);
      const response = notes
        ? await editNote(params, notes?.id)
        : await addNote(params);
      setIsloading(false);
      if (response) {
        notes
          ? Helper.showToast(t('msg_note-updated-success'))
          : Helper.showToast(t('msg_note-added-success'));
        navigation.goBack();
        return;
      }

      return;
    }
    Helper.showToast(t('error_pleaseFillAllFields'));
  };
  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <Loader isLoading={isLoading} layout={'outside'} />
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.goBack()}
        title={notes ? t('label_edit-notes') : t('button_Addnotes')}
        headerIconOne={Icons.notification}
        onPressheaderIconOne={() => navigation.navigate(Screen.Notification)}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}>
        <View style={[appStyle.p25, appStyle.flex1]}>
          <View style={[appStyle.pb20]}>
            <TextField
              label={t('title')}
              fontSize={16}
              value={title}
              baseColor={ColorSet.grey}
              tintColor={ColorSet.red}
              multiline={true}
              onChangeText={(value: any) => setTitle(value)}
            />
            <TextField
              label={t('text_sub-title')}
              fontSize={16}
              value={label}
              baseColor={ColorSet.grey}
              tintColor={ColorSet.red}
              multiline={true}
              onChangeText={(value: any) => setLabel(value)}
            />
            <TextField
              label={t('text_description')}
              fontSize={16}
              value={note}
              baseColor={ColorSet.grey}
              tintColor={ColorSet.red}
              multiline={true}
              onChangeText={(value: any) => setNotes(value)}
            />
          </View>
        </View>
        <View style={appStyle.p20}>
          <Button onPress={() => notesHandler()}>{t('button_save')}</Button>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default AddNotes;
