import React, {useState, useEffect} from 'react';
import {View, Text, Modal, StyleSheet} from 'react-native';
import Button from '../Button';
import {ColorSet, screenWidth} from '../../styles';
import {updateDepartureId} from '../../networking/Services';

const DepartureIdUpdateModal = ({
  setModalVisible,
  modalVisible,
  departureId,
}) => {
  const [responseIsOk, setResponseIsOk] = useState(false);
  const [updateResponseMessage, setUpdateResponseMessage] = useState(null);
  const [newDepartureId, setNewDepartureId] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleDepartureUpdate = async () => {
    setIsLoading(true);
    const res = await updateDepartureId(departureId);
    setIsLoading(false);

    setNewDepartureId(res?.data?.departureId);
    setUpdateResponseMessage(res?.message);

    return setResponseIsOk(res?.status === 200);
  };

  useEffect(() => {
    if (departureId) {
      handleDepartureUpdate();
    }
  }, [departureId]);

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible();
        }}>
        {isLoading ? (
          <Text>Loading</Text>
        ) : (
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {responseIsOk ? (
                <>
                  <Text style={styles.modalText}>
                    Your departure Id has been updated successfully.
                  </Text>
                  <Text
                    style={styles.modalText}>{`New ID:${newDepartureId}`}</Text>
                  <Text style={styles.modalText}>
                    Please close and re-open the app ({updateResponseMessage})
                  </Text>
                </>
              ) : (
                <Text style={styles.modalText}>
                  {/* TODO: change the text for t() */}
                  There was a problem, please contact with support
                </Text>
              )}

              <View style={{width: screenWidth.width40}}>
                <Button onPress={() => setModalVisible()}>Close</Button>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
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

  modalText: {
    marginBottom: 15,
    fontSize: 18,
    textAlign: 'center',
    color: ColorSet.textBase,
  },
});

export default DepartureIdUpdateModal;
