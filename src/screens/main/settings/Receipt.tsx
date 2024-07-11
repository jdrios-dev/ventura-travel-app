import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';

import appStyle from '../../../styles/appStyle';
import {Icons} from '../../../constants';
import {ColorSet, FamilySet} from '../../../styles';
import {Header, BottomSheet, Button} from '../../../components/index';
import {Screen} from '../../../constants/screens/screens';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
const bottomRef = React.createRef();

const Receipt: React.FC<{navigation: any}> = ({navigation}) => {
  const {t} = useTranslation();
  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        back
        onPressBack={() => navigation.goBack()}
        title={t('receipt')}
        // headerIconTwo={Icons.notification}
        // onPressheaderIconTwo={() => navigation.navigate(Screen.Notification)}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={appStyle.scrollContainer}
      />
      <View style={appStyle.p20}>
        <Button onPress={() => navigation.navigate(Screen.NewReceipt)}>
          {t('Touchable_addreceipt')}
        </Button>
      </View>
      <BottomSheet bottomSheetRef={bottomRef}>
        <View>
          <TouchableOpacity style={[appStyle.rowCenter, appStyle.pv15]}>
            <Image source={Icons.messageBlue} style={styles.iconStyle} />
            <Text style={styles.buttonTextStyle}>
              {t('button_sendReceiptViaEmail')}
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={[appStyle.rowCenter, appStyle.pv15]}>
            <Image source={Icons.view} style={styles.iconStyle} />
            <Text style={styles.buttonTextStyle}>{t('text_view')}</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={[appStyle.rowCenter, appStyle.pt15]}>
            <Image source={Icons.download} style={styles.iconStyle} />
            <Text style={styles.buttonTextStyle}>{t('button_download')}</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default Receipt;

const styles = StyleSheet.create({
  iconStyle: {
    width: 13,
    height: 13,
    resizeMode: 'contain',
    marginRight: 5,
  },
  buttonTextStyle: {
    color: ColorSet.secondary,
    fontSize: 16,
    fontFamily: FamilySet.semiBold,
  },
  divider: {
    borderWidth: 1,
    borderColor: ColorSet.dividerColor,
  },
});
