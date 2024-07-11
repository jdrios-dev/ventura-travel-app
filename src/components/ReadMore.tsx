/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {ColorSet} from '../styles';

const ReadMore = ({children}) => {
  const [isOpen, setIsOpen] = useState(false);
  const {t} = useTranslation();
  return (
    <View>
      <View style={isOpen ? styles.open : styles.close}>{children}</View>
      <Pressable onPress={() => setIsOpen(prev => !prev)}>
        <Text style={{color: ColorSet.theme, fontSize: 16}}>
          {t(isOpen ? 'text_show-less' : 'text_read-more')}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  open: {
    height: 'auto',
  },
  close: {
    height: 150,
    overflow: 'hidden',
  },
});

export default ReadMore;
