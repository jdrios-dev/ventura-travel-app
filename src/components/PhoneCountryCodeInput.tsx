import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import {TextField} from 'rn-material-ui-textfield';
import React, {useState} from 'react';
import {COUNTRY_PHONE_CODES} from '../utils/countryCodePhone';
import {Icons} from '../constants';
import {ColorSet} from '../styles';
import {useTranslation} from 'react-i18next';

const PhoneCountryCodeInput = ({
  value,
  label,
  keyboardType,
  fontSize,
  maxLength,
  baseColor,
  tintColor,
  onChangeText,
}) => {
  const {t} = useTranslation();
  const [country, setCountry] = useState(COUNTRY_PHONE_CODES[0]);
  const [allCountries, setAllCountries] = useState(COUNTRY_PHONE_CODES);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleChangeSearch = e => {
    setSearchValue(e);
    const filterCountries = allCountries.filter(item =>
      item?.name?.includes(e),
    );
    if (filterCountries.length === 0 || e.trim() === '') {
      return setAllCountries(COUNTRY_PHONE_CODES);
    }
    return setAllCountries(filterCountries);
  };

  const RenderCountryItem = ({item}) => {
    return (
      <TouchableOpacity
        key={item.code}
        style={styles.countryItem}
        onPress={() => {
          onChangeText(item.dial_code);
          setModalVisible(false);
          setCountry(item);
        }}>
        <Text style={styles.countryItemEmoji}>{item.emoji}</Text>
        <Text style={styles.countryItemLabel}>
          {` ${item.dial_code} ${item.name}`}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setModalVisible(!modalVisible)}
        style={styles.countryButton}>
        <Text style={styles.countryItemEmoji}>{country.emoji}</Text>
      </TouchableOpacity>
      <View style={{width: '80%'}}>
        <TextField
          label={label}
          keyboardType={keyboardType}
          value={value}
          fontSize={fontSize}
          maxLength={maxLength}
          baseColor={baseColor}
          tintColor={tintColor}
          onChangeText={onChangeText}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.headerModal}>
              <Text style={styles.headerText}>
                {t('title_select-country-code')}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                <Image source={Icons.close} style={styles.icon} />
              </TouchableOpacity>
            </View>

            <FlatList
              keyExtractor={item => item.code}
              data={allCountries}
              renderItem={({item}) => <RenderCountryItem item={item} />}
              ListHeaderComponent={
                <TextField
                  label={t('label_search')}
                  value={searchValue}
                  fontSize={fontSize}
                  maxLength={maxLength}
                  baseColor={baseColor}
                  tintColor={tintColor}
                  onChangeText={handleChangeSearch}
                />
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {display: 'flex', flexDirection: 'row'},
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  headerText: {
    fontSize: 20,
    color: ColorSet.theme,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '85%',
    marginVertical: 80,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  countryItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    minWidth: '100%',
  },
  countryItemLabel: {
    fontSize: 18,
    color: ColorSet.textBase,
    maxWidth: '85%',
  },
  countryItemEmoji: {fontSize: 30, alignContent: 'center'},
  icon: {width: 30, height: 30},
  headerModal: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  countryButton: {
    width: '20%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomColor: 'rgb(218,218,219)',
    borderBottomWidth: 1,
    marginRight: 8,
  },
});

export default PhoneCountryCodeInput;
