import React, {memo, useState} from 'react';
import {
  StyleSheet,
  ViewStyle,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';
import {selectUser} from '../redux/common/common.selectors';
import {appStyle, ColorSet, FamilySet, screenWidth} from '../styles';
import {Helper} from '../utils';
import formatRelative from 'date-fns/formatRelative';
import {enUS, fr, de, es, nl} from 'date-fns/esm/locale';
import {Language} from '../types/common.types';

interface HeaderProps {
  onPress(value: string): void;
  messagesArray?: any | undefined;
  style?: ViewStyle | undefined;
  language: Language;
}

interface RenderMessagesProps {
  item?: any | undefined;
  onPress(value: string): void;
  language: Language;
}
const locales = {
  en: enUS,
  fr: fr,
  de: de,
  es: es,
  nl: nl,
};

export const RenderMessageView: React.FC<RenderMessagesProps> = props => {
  const user: any = useSelector(selectUser);
  const {item, onPress, language = 'en'} = props;

  const [loading, setLoading] = useState<boolean>(true);

  return (
    <View
      style={[
        item?.user?.id !== user?.id ? appStyle.asFlexStart : appStyle.asFlexEnd,
      ]}>
      {item?.content_type === 'text' ? (
        <View
          style={[
            item?.user?.id !== user?.id
              ? styles.chatColLeft
              : styles.chatColRight,
          ]}>
          {item?.user?.id !== user?.id && (
            <Text style={styles.nameStyle}>{item?.user?.full_name}</Text>
          )}
          <Text
            style={[
              styles.textStyle,
              {
                color:
                  item?.user?.id === user?.id
                    ? ColorSet.white
                    : ColorSet.secondary,
              },
            ]}>
            {item?.content}
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.imageView}
          onPress={() =>
            onPress(Helper.replaceCharater(item?.content, 'smart//', 'smart/'))
          }>
          <>
            <Text style={styles.nameStyle}>{item?.user?.full_name}</Text>
            <View style={styles.imageContainer}>
              <FastImage
                resizeMode={FastImage.resizeMode.contain}
                style={styles.imageStyle}
                source={{
                  uri: Helper.replaceCharater(
                    item?.content,
                    'smart//',
                    'smart/',
                  ),
                }}
                onLoadEnd={() => setLoading(false)}
              />
            </View>
          </>
          <View style={styles.loader}>
            <ActivityIndicator
              size="small"
              color={ColorSet.theme}
              animating={loading}
            />
          </View>
        </TouchableOpacity>
      )}
      <Text style={styles.dateStyle}>
        {formatRelative(new Date(item?.created_at), new Date(), {
          locale: locales[language],
        })}
      </Text>
    </View>
  );
};
const RenderMessages: React.FC<HeaderProps> = props => {
  const {messagesArray, onPress, language} = props;
  return (
    <View style={[appStyle.flex1]}>
      {messagesArray.length > 0
        ? messagesArray.map(item => (
            <View key={item.id}>
              <RenderMessageView
                item={item}
                onPress={onPress}
                language={language}
              />
            </View>
          ))
        : null}
    </View>
  );
};
const styles = StyleSheet.create({
  chatColLeft: {
    maxWidth: screenWidth.width100 / 1.5,
    backgroundColor: ColorSet.dividerColor,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderBottomLeftRadius: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  nameStyle: {
    color: ColorSet.theme,
    fontSize: 15,
    bottom: 5,
  },
  textStyle: {
    color: ColorSet.secondary,
    fontSize: 16,
    fontFamily: FamilySet.regular,
  },
  dateStyle: {
    fontSize: 12,
    color: ColorSet.grey,
    fontFamily: FamilySet.regular,
    paddingVertical: 10,
  },
  chatColRight: {
    maxWidth: screenWidth.width100 / 1.4,
    backgroundColor: ColorSet.secondary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderBottomRightRadius: 0,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    overflow: 'hidden',
    borderRadius: 10,
    height: 200,
    width: 200,
  },
  imageView: {
    paddingTop: 20,
    marginBottom: 20,
    height: 200,
    width: 200,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  loader: {
    position: 'absolute',
    top: '45%',
    left: '45%',
  },
});

export default memo(RenderMessages);
