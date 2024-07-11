import React, {useState} from 'react';
import {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity,
  ViewStyle,
  Platform,
} from 'react-native';

import appStyle from '../styles/appStyle';
import {Icons} from '../constants';
import {ColorSet, FamilySet} from '../styles';
import ProfileMenu from './modals/ProfileMenu';

interface HeaderProps {
  back?: boolean | false;
  onPressBack?: (() => void) | undefined;
  title?: string | undefined;
  titleStyle?: ViewStyle | undefined;
  showProfile?: boolean;
  testId?: string;
}

const Header: React.FC<HeaderProps> = props => {
  const {back, title, titleStyle, onPressBack, showProfile, testId} = props;
  const [modalVisible, setModalVisible] = useState(false);

  const handleChangeVisibility = () => {
    setModalVisible(prev => !prev);
  };
  return (
    <View style={styles.container}>
      <View style={[appStyle.rowBtw, appStyle.flex1]}>
        {back && (
          <View>
            <TouchableOpacity
              testID="headerBackButton"
              onPress={onPressBack}
              style={appStyle.pr20}>
              <Image style={styles.arrowBackStyle} source={Icons.arrowLeft} />
            </TouchableOpacity>
          </View>
        )}
        <View
          style={[
            appStyle.aiCenter,
            appStyle.jcCenter,
            appStyle.flex1,
            appStyle.row,
            {width: '100%'},
          ]}>
          {title && (
            <Text
              testID={testId}
              numberOfLines={1}
              style={[titleStyle, styles.textStyle, back && appStyle.mr30]}>
              {title}
            </Text>
          )}
          {showProfile && (
            <TouchableOpacity
              onPress={handleChangeVisibility}
              style={styles.headerContainer}>
              <Image source={Icons.user} style={styles.headerImageStyle} />
            </TouchableOpacity>
          )}
        </View>
        <ProfileMenu
          modalVisible={modalVisible}
          setModalVisible={handleChangeVisibility}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    right: 0,
  },
  headerImageStyle: {
    width: 25,
    height: 25,
  },
  container: {
    backgroundColor: ColorSet.white,
    height: Platform.OS === 'ios' ? 60 : 50,
    justifyContent: 'center',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 20,
    position: 'relative',
  },
  textStyle: {
    fontSize: 22,
    color: ColorSet.theme,
    fontFamily: FamilySet.bold,
  },
  arrowBackStyle: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  iconSm: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
});

export default Header;
