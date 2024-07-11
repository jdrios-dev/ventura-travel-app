import {View, Text, Platform, Linking, TouchableOpacity} from 'react-native';
import React from 'react';
import {ColorSet, FamilySet, appStyle} from '../styles';
import {StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';

const RecommendedRestaurantItem = ({item, index}) => {
  const {t} = useTranslation();

  // // Maps config
  const coordinates = item?.location?.coordinates;
  const isCoordinatesValid =
    coordinates && coordinates?.[0] !== 0 && coordinates?.[1] !== 0;
  const scheme = Platform.select({
    ios: 'maps://0,0?q=',
    android: 'geo:0,0?q=',
  });
  const latLng = `${coordinates?.[1]},${coordinates?.[0]}`;
  const locationLabel = item?.name;
  const url = Platform.select({
    ios: `${scheme}${locationLabel}@${latLng}`,
    android: `${scheme}${latLng}(${locationLabel})`,
  });

  //Whatsapp config
  const whatsappLink = `whatsapp://send?text=Ventura Travel&phone=${item?.whatsapp}`;
  const handleWhatsapp = async () => {
    const whatsappLinkSupported = await Linking.canOpenURL(whatsappLink);
    if (whatsappLinkSupported) {
      await Linking.openURL(whatsappLink);
    } else {
      await Linking.openURL(`tel:${item?.whatsapp}`);
    }
  };

  return (
    <View style={styles.roomsView}>
      {item?.name !== '' && (
        <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
          <TouchableOpacity
            onPress={
              item?.website
                ? () => Linking.openURL(`${item?.website}`)
                : () => null
            }>
            <Text
              testID={`dayDetailTabService.${index + 1}`}
              style={[
                styles.titleStyle,
                item?.website && appStyle.textLink,
                {color: ColorSet.theme},
              ]}>
              {item?.name}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {item?.phone && (
        <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
          <Text style={styles.titleStyle}>{t('phone')}</Text>
          <TouchableOpacity onPress={() => Linking.openURL(`${item?.phone}`)}>
            <Text style={[styles.infoTextStyle, {fontWeight: 'bold'}]}>
              {item?.phone}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {item?.whatsapp && (
        <View style={[appStyle.pb5, appStyle.row, appStyle.jcSpaceBetween]}>
          <Text style={styles.titleStyle}>Whatsapp</Text>
          <TouchableOpacity onPress={() => handleWhatsapp()}>
            <Text style={[styles.infoTextStyle, {fontWeight: 'bold'}]}>
              {item?.whatsapp}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {isCoordinatesValid && (
        <TouchableOpacity
          style={styles.mapLink}
          onPress={() => {
            Linking.openURL(url!);
          }}>
          <Text style={styles.mapLinkText}>
            {t('touchable_link-visit-map')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  roomsView: {
    flex: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingVertical: 5,
    justifyContent: 'space-between',
  },
  mapLink: {
    display: 'flex',
    alignItems: 'center',
    paddingVertical: 3,
  },
  mapLinkText: {color: ColorSet.theme, fontWeight: 'bold'},
  infoTextStyle: {
    color: ColorSet.grey,
    fontSize: 16,
    width: 130,
    fontFamily: FamilySet.regular,
  },
  titleStyle: {
    color: ColorSet.grey,
    fontSize: 16,
  },
});

export default RecommendedRestaurantItem;
