import React from 'react';
import {StyleSheet, Image, Text, View, ImageSourcePropType} from 'react-native';

import appStyle from '../styles/appStyle';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ColorSet, FamilySet} from '../styles';
import {screenWidth} from '../styles/screenSize';

interface HeaderProps {
  title?: string | undefined;
  messsage?: string | undefined;
  image?: ImageSourcePropType | null;
  count?: number | undefined;
  date?: string | undefined;
  onPress?: (() => void) | undefined;
  onLongPress?: (() => void) | undefined;
}

const MainChatView: React.FC<HeaderProps> = props => {
  const {title, messsage, image, count, date, onPress, onLongPress} = props;
  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
      <View style={appStyle.row}>
        <View style={{width: screenWidth.width25}}>
          <View>
            <Image source={image} style={styles.imageStyle} />
            <View style={styles.countTopView}>
              <Text style={styles.countTextStyle}>{count}</Text>
            </View>
          </View>
        </View>
        <View style={appStyle.flex1}>
          <Text style={styles.titleTextStyle}>{title}</Text>
          <Text style={styles.messageTextStyle}>{messsage}</Text>
        </View>
      </View>
      <Text style={styles.dateTextStyle}>{date}</Text>
      <View style={styles.divider} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    width: 75,
    height: 75,
    borderTopLeftRadius: 25,
    borderBottomRightRadius: 25,
    resizeMode: 'contain',
  },
  countTopView: {
    width: 25,
    height: 25,
    borderRadius: 15,
    backgroundColor: ColorSet.themeLight,
    position: 'absolute',
    bottom: -4,
    right: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countTextStyle: {
    fontSize: 12,
    fontFamily: FamilySet.bold,
    color: ColorSet.white,
  },
  titleTextStyle: {
    fontSize: 16,
    fontFamily: FamilySet.bold,
    color: ColorSet.secondary,
  },
  messageTextStyle: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
    color: ColorSet.grey,
  },
  dateTextStyle: {
    fontSize: 12,
    fontFamily: FamilySet.regular,
    color: ColorSet.secondary,
    paddingVertical: 5,
  },
  divider: {
    borderWidth: 1,
    borderColor: ColorSet.dividerColor,
    marginBottom: 10,
  },
});

export default MainChatView;
