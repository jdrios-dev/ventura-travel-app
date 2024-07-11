import {
  Image,
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React from 'react';
import {Icons} from '../../../../constants';
import Button from '../../../../components/Button';
import {ColorSet, appStyle} from '../../../../styles';
import {useTranslation} from 'react-i18next';

type ConfirmationModalProps = {
  setModalVisible: (value: boolean) => void;
  modalVisible: boolean;
  quantityOfPhotos: number;
  handleSendImages: (confirmAllPhotosAlbum: boolean) => void;
};

const ConfirmationModal = ({
  setModalVisible,
  modalVisible,
  quantityOfPhotos,
  handleSendImages,
}: ConfirmationModalProps) => {
  const {t} = useTranslation();
  return (
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
              {t('title_send-and-save-modal')}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
              <Image source={Icons.close} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.textConfirmation, appStyle.mb30]}>
            {t('text_album-explain-upload', {
              quantityOfPhotos: quantityOfPhotos,
            })}
          </Text>
          <Button onPress={() => handleSendImages(true)}>
            {t('button_confirm-and-send')}
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000045',
  },
  modalView: {
    margin: 10,
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  headerText: {
    fontSize: 20,
    color: ColorSet.theme,
  },
  headerModal: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  icon: {width: 30, height: 30},
  textConfirmation: {
    fontSize: 16,
    color: ColorSet.textBase,
  },
  buttonSpacing: {width: '100%', marginBottom: 16},
});

export default ConfirmationModal;
