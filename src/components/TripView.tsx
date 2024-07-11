import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ReadMore from 'react-native-read-more-text';
import appStyle from '../styles/appStyle';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ColorSet, FamilySet} from '../styles';
import {screenWidth} from '../styles/screenSize';

interface HeaderProps {
  title?: string | undefined;
  messsage?: string | undefined;
  date?: string | undefined;
  day?: string | undefined;
  onPress?: (() => void) | undefined;
}

const MainChatView: React.FC<HeaderProps> = props => {
  const renderTruncatedFooter = () => {
    return null;
  };

  const renderRevealedFooter = () => {
    return null;
  };

  const {title, messsage, date, day, onPress} = props;
  return (
    <TouchableOpacity onPress={onPress} style={styles.topView}>
      <View style={appStyle.row}>
        <View style={{width: screenWidth.width15, alignItems: 'center'}}>
          <View style={styles.dateStyle}>
            <Text style={styles.iconTextStyle}>{date}</Text>
          </View>
          <Text style={styles.dateTextStyle}>{day}</Text>
        </View>
        <View style={[appStyle.flex1, appStyle.pl10]}>
          <Text style={styles.titleTextStyle}>{title}</Text>
          <View style={[appStyle.flex1]}>
            <ReadMore
              numberOfLines={3}
              renderTruncatedFooter={renderTruncatedFooter}
              renderRevealedFooter={renderRevealedFooter}>
              <Text style={styles.answerTextStyle}>{messsage}</Text>
            </ReadMore>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  topView: {
    backgroundColor: ColorSet.secondaryLight,
    padding: 10,
    marginBottom: 15,
  },
  dateStyle: {
    width: 50,
    height: 50,
    backgroundColor: ColorSet.themeLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleTextStyle: {
    fontSize: 18,
    fontFamily: FamilySet.bold,
    color: ColorSet.theme,
  },
  messageTextStyle: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
    color: ColorSet.grey,
    letterSpacing: 1.5,
  },
  dateTextStyle: {
    fontSize: 12,
    fontFamily: FamilySet.regular,
    color: ColorSet.secondary,
    paddingVertical: 5,
  },
  iconTextStyle: {
    fontSize: 12,
    fontFamily: FamilySet.regular,
    color: ColorSet.white,
  },
  answerTextStyle: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
    color: ColorSet.grey,
  },
});

export default MainChatView;
