import {Text, View, SafeAreaView, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import Button from '../../../components/Button';
import {useTranslation} from 'react-i18next';
import {TextField} from 'rn-material-ui-textfield';
import {ColorSet, appStyle} from '../../../styles';
import {updateDepartureId} from '../../../networking/Services';
import {Header, Loader} from '../../../components/index';
import {handleLogout} from './More';
import {useDispatch} from 'react-redux';
import {
  TABLE_CONFIG_NAME,
  emptyLocalTable,
  getDBConnection,
} from '../../../networking/DBConection';
import {DbKeys} from '../../../constants/screens/dbKeys';
import {storeDataToStorage} from '../../../utils/storage';

const UpdateDeparture = ({navigation}) => {
  const {t} = useTranslation();
  const [departureId, setDepartureId] = useState('');
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    const db = await getDBConnection();
    setIsLoading(true);
    const res = await updateDepartureId(departureId);
    setMessage(res.message);
    setIsLoading(false);

    setTimeout(() => {
      setMessage(null);
    }, 5000);
    if (res?.statusCode === 200) {
      await emptyLocalTable(db, TABLE_CONFIG_NAME);
      await storeDataToStorage(DbKeys.updateClientList, 0);

      handleLogout(dispatch, setIsLoading, navigation);
    }
    return null;
  };
  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <Header
        title={t('label_departure-update')}
        back
        onPressBack={() => navigation.goBack()}
      />
      <View style={appStyle.p25}>
        <Text style={styles.label}>{t('text_departure-update-label')}</Text>
        <TextField
          label={t('label_departure')}
          fontSize={16}
          baseColor={ColorSet.grey}
          tintColor={ColorSet.red}
          onChangeText={e => setDepartureId(e)}
          value={departureId}
          autoCapitalize="none"
          autoComplete="off"
          keyboardType="phone-pad"
        />
        <View style={styles.button}>
          <Button disable={isLoading} onPress={handleSubmit}>
            {t('button_save')}
          </Button>
        </View>
        <View>
          {message && <Text style={styles.messageResponse}>{message}</Text>}
        </View>
        {isLoading && <Loader isLoading={isLoading} layout={'outside'} />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {margin: 16},
  button: {marginBottom: 16},
  label: {
    fontSize: 16,
    color: ColorSet.textBase,
  },
  messageResponse: {
    fontSize: 16,
    textAlign: 'center',
    color: ColorSet.textBase,
  },
});

export default UpdateDeparture;
