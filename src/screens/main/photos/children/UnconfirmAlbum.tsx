import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import Button from '../../../../components/Button';
import {confirmAllPhotosAlbum} from '../../../../networking/Services';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../../redux/common/common.selectors';
import {ColorSet, appStyle} from '../../../../styles';
import {useTranslation} from 'react-i18next';

type UnconfirmAlbumProps = {
  setIsAlbumConfirmed: (value: boolean) => void;
};

const UnconfirmAlbum = ({setIsAlbumConfirmed}: UnconfirmAlbumProps) => {
  const user: any = useSelector(selectUser);
  const {t} = useTranslation();
  const handleClick = () => {
    confirmAllPhotosAlbum(user.departureId, false);
    setIsAlbumConfirmed(false);
  };
  return (
    <View style={[appStyle.mb15]}>
      <Text style={styles.text}>{t('text_unconfirm-album-message')}</Text>
      <Button onPress={handleClick}>{t('button_upload-more')}</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: ColorSet.textBase,
    marginBottom: 16,
  },
});

export default UnconfirmAlbum;
