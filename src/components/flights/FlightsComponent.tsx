import React from 'react';

import {ScrollView, StyleSheet, Text, View} from 'react-native';

import {
  ColorSet,
  FamilySet,
  appStyle,
  screenHeight,
  screenWidth,
} from '../../styles';
import {t} from 'i18next';
type FlightComponentProps = {
  name?: string | undefined;
  data: any[];
  ticket?: number | undefined;
};
const FlightComponent: React.FC<FlightComponentProps> = props => {
  const {name, data, ticket} = props;

  const showList = data?.length > 0;
  return (
    <View style={[appStyle.p10, appStyle.aiCenter]}>
      <View style={styles.buttonContainer}>
        <Text style={styles.titleTextNameStyle}>{name}</Text>
      </View>
      {ticket && (
        <View
          style={[
            appStyle.aiCenter,
            appStyle.row,
            appStyle.jcSpaceBetween,
            appStyle.ph15,
            appStyle.pb20,
            {width: screenWidth.width90, backgroundColor: ColorSet.white},
          ]}>
          <Text style={[styles.titleTextStyle, appStyle.pb0]}>
            {t('text_ticket-number')}
          </Text>
          <Text>{ticket}</Text>
        </View>
      )}
      <ScrollView>
        {showList ? (
          data?.map((item, index) => {
            return (
              <View
                style={[appStyle.flex1, appStyle.mb10, styles.detailContainer]}
                key={index.toString()}>
                <View style={[appStyle.flex1, appStyle.rowBtw]}>
                  {item?.flight_number ? (
                    <View>
                      <Text style={styles.titleTextStyle}>
                        {t('label_flight')}
                      </Text>
                      <Text style={styles.detailTextStyle}>
                        {item?.airline_code}
                        {item?.flight_number}
                      </Text>
                    </View>
                  ) : null}

                  {item?.class_of_service ? (
                    <View>
                      <Text style={styles.titleTextStyle}>
                        {t('label_class')}
                      </Text>
                      <Text style={styles.detailTextStyle}>
                        {item?.class_of_service}
                      </Text>
                    </View>
                  ) : null}
                  {item?.file_key ? (
                    <View>
                      <Text style={styles.titleTextStyle}>PNR</Text>
                      <Text style={styles.detailTextStyle}>
                        {item?.file_key}
                      </Text>
                    </View>
                  ) : null}
                </View>
                <View style={[appStyle.flex1, appStyle.rowBtw]}>
                  <View>
                    <Text style={styles.titleTextStyle}>
                      {t('label_departure')}
                    </Text>
                    <Text style={styles.detailTextStyle}>
                      {item?.departure_city?.name} ({item?.departure_city?.code}
                      )
                    </Text>
                    <Text style={styles.detailTextStyle}>
                      {item?.departure_date}({item?.departure_time})
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.titleTextStyle}>
                      {t('label_arrival')}
                    </Text>
                    <Text style={styles.detailTextStyle}>
                      {item?.arrival_city?.name} ({item?.arrival_city?.code})
                    </Text>
                    <Text style={styles.detailTextStyle}>
                      {item?.arrival_date}({item?.arrival_time})
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.nullDataView}>
            <Text style={styles.titleTextStyle}>
              {t('text_data-not-found')}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  detailContainer: {
    minWidth: '100%',
    paddingVertical: 10,
    borderBottomColor: ColorSet.grayLight,
    borderBottomWidth: 1,
  },
  titleTextStyle: {
    fontSize: 15,
    fontFamily: FamilySet.bold,
    color: ColorSet.grayMedium,
  },
  titleTextNameStyle: {
    fontSize: 18,
    fontFamily: FamilySet.bold,
    color: ColorSet.theme,
  },
  detailTextStyle: {
    fontSize: 14,
    fontFamily: FamilySet.regular,
    color: ColorSet.grey,
  },
  buttonContainer: {
    width: screenWidth.width90,
    height: screenHeight.height5,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 6,
    paddingTop: 5,
  },

  nullDataView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FlightComponent;
