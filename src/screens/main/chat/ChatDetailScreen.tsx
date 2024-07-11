import React, {createRef, useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';

import appStyle from '../../../styles/appStyle';
import {Icons, messageType, Screen} from '../../../constants';
import {ColorSet, FamilySet} from '../../../styles';
import {
  Header,
  BottomSheet,
  Button,
  HelperLabel,
} from '../../../components/index';
import {screenWidth} from '../../../styles/screenSize';
import {TextField} from 'rn-material-ui-textfield';
import {permissionCamera} from '../../../components/permissionManager/CameraPermission';
import {
  cameraImagePicker,
  libraryImagePicker,
} from '../../../components/uploadsManager/ImagePicker';
import Loader from '../../../components/Loader';
import {useTranslation} from 'react-i18next';
import {socketManger} from '../../../components/socketManager/socketHandler';
import {Helper} from '../../../utils';
import {getChat, sendFile} from '../../../networking/Services';
import {selectUser} from '../../../redux/common/common.selectors';
import {useSelector} from 'react-redux';
import RenderMessages from '../../../components/RenderMessages';
import SendPhoto from '../../../components/SendPhoto';
import {useFocusEffect} from '@react-navigation/native';
import {Language} from '../../../types/common.types';
const isAndroid = Platform.OS === 'android';
const photoBottomRef = createRef<any>();
const scrollRef = createRef<any>();
const ChatDetailScreen: React.FC<{navigation: any; route: any}> = ({
  navigation,
}) => {
  const {t, i18n} = useTranslation();
  const user: any = useSelector(selectUser);
  const [image, setImage] = React.useState<any>();
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [visible, setVisiable] = React.useState<boolean>(false);
  const [loading, setloading] = useState<boolean>(true);
  const [message, setMessage] = React.useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const [socketConnection, setSocketConnection] = React.useState<any>();
  const [messagesArray, setMessagesArray] = React.useState<any>([]);
  const [chatId, setChatId] = React.useState<string>();

  const addImage = async (type: number) => {
    photoBottomRef.current?.setModalVisible(false);
    const cropping = true;
    setTimeout(async () => {
      if (type === 1) {
        if (isAndroid) {
          const granted = await permissionCamera();
          if (granted) {
            const res = await cameraImagePicker(cropping);
            setMessage('');
            setImage(res.path);
            setVisiable(true);
          }
          return;
        }
        const res = await cameraImagePicker(cropping);
        setMessage('');
        setImage(res.path);
        setVisiable(true);
        return;
      }
      const res = await libraryImagePicker(cropping);
      setMessage('');
      setImage(res.path);
      setVisiable(true);
    }, 500);
  };
  const checkSocketConnection = useCallback(async () => {
    let socket = await socketManger();

    socket.on('connect', () => {
      setSocketConnection(socket);
      socket.emit('join', {chatId: chatId});
    });
    socket.on('error', payload => {
      // eslint-disable-next-line no-console
      console.log('ERROR-SOCKET: ', payload);
    });
    socket.on('newMessageCreated', (messageDto: any) => {
      setMessagesArray((previous: any) => [...previous, messageDto]);
      if (messageDto?.user?.full_name === user.fullName) {
        setMessage('');
        setImage('');
        setIsAnimating(false);
        setVisiable(false);
        setIsSending(false);
      }
    });
    socket.on('disconnect', async () => {
      socket = await socketManger();
      socket.close();
      setSocketConnection(socket);
    });
  }, [chatId, user]);
  const onSend = async () => {
    if (message || image) {
      setIsSending(true);
      let file = '';
      if (image) {
        setIsAnimating(true);
        const response = await sendFile(image);

        if (response) {
          file = response?.data?.path;
        } else {
          Helper.showToast(t('error_upload-image-error'));
        }
        setIsSending(false);
      }

      socketConnection.emit(
        'requestMessageCreation',
        {
          user: {id: user?.id, full_name: user?.fullName},
          content_type: message ? messageType.text : messageType.image,
          content: message ? message : file,
          chatId: chatId,
        },
        function (err, res) {
          // send data
          // now we got it once the server calls this callback
          // note -in this ex we dont need to send back any data
          // - could just have called fn() at server side
          if (err) {
            console.log({err});
          }
        },
      );
      socketConnection.on('connect', () => {
        socketConnection.emit('join', {
          chatId: chatId,
        });
      });

      setIsSending(false);

      return;
    }
    Helper.showToast(t('error_msg-required'));
  };
  const viewImage = (photo: string) => {
    navigation.navigate(Screen.ImageViewer, {items: photo});
  };
  const getMessages = async () => {
    const response = await getChat();

    if (response) {
      setChatId(response?.id);
      setMessagesArray(response?.message);
      setloading(false);
      return;
    }
    setloading(false);
  };
  const onChangeImage = () => {
    setVisiable(false);
    setImage('');
    photoBottomRef.current?.setModalVisible(true);
  };
  const onCancel = () => {
    setVisiable(false);
    setImage('');
  };
  const closeChat = async () => {
    const socket = await socketManger();

    socket.close();
  };

  useFocusEffect(
    React.useCallback(() => {
      getMessages();

      return () => {
        closeChat();
      };
    }, []),
  );

  useEffect(() => {
    if (chatId) {
      checkSocketConnection();
    }
  }, [chatId, checkSocketConnection]);
  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        title="Chat"
        back
        onPressBack={() => navigation.goBack()}
        showProfile
      />
      <Loader isLoading={loading} layout={'outside'} />

      {chatId ? (
        <>
          <KeyboardAvoidingView
            style={appStyle.scrollContainer}
            behavior={isAndroid ? undefined : 'padding'}>
            <View style={[appStyle.p25, appStyle.flex1]}>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={appStyle.scrollContainer}
                ref={scrollRef}
                onContentSizeChange={() => {
                  messagesArray &&
                    requestAnimationFrame(() => {
                      scrollRef?.current?.scrollToEnd({
                        animated: true,
                        useNativeDrive: true,
                      });
                    });
                }}>
                {!messagesArray.length ? (
                  <HelperLabel
                    text={t('text_no-messages-help-text')}
                    icon={Icons.chatBubbles}
                  />
                ) : (
                  <RenderMessages
                    language={i18n.language as Language}
                    messagesArray={messagesArray}
                    onPress={viewImage}
                  />
                )}
              </ScrollView>
            </View>
            <View style={styles.barStyle}>
              <TextField
                label={t('enterMessage')}
                fontSize={16}
                baseColor={ColorSet.grey}
                tintColor={ColorSet.red}
                multiline={true}
                value={message}
                onChangeText={(value: any) => {
                  setImage(''), setMessage(value);
                }}
                renderRightAccessory={() => (
                  <View style={appStyle.row}>
                    <TouchableOpacity
                      disabled={isSending}
                      onPress={() => photoBottomRef.current?.setModalVisible()}>
                      <Image
                        source={image ? Icons.imageSelected : Icons.image}
                        style={styles.iconStyle}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={isSending}
                      style={appStyle.pl15}
                      onPress={() => {
                        onSend();
                      }}>
                      <Image source={Icons.send} style={styles.iconStyle} />
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          </KeyboardAvoidingView>
          <BottomSheet bottomSheetRef={photoBottomRef}>
            <View style={[appStyle.pb20, appStyle.pt10, appStyle.aiCenter]}>
              <Text style={styles.sheetTitleStyle}>
                {t('text_pleaseSelectOneOfThem')}
              </Text>
            </View>
            <View style={[appStyle.rowBtw]}>
              <View style={{width: screenWidth.width40}}>
                <Button onPress={() => addImage(1)}>
                  {t('button_takePhoto')}
                </Button>
              </View>
              <View style={{width: screenWidth.width40}}>
                <Button onPress={() => addImage(2)}>
                  {t('button_openLibrary')}
                </Button>
              </View>
            </View>
          </BottomSheet>
          <SendPhoto
            visibale={visible}
            onPress={onSend}
            image={image}
            onChange={onChangeImage}
            onCancel={onCancel}
            isAnimating={isAnimating}
          />
        </>
      ) : (
        <View style={appStyle.colCenter}>
          <Text style={{color: ColorSet.grayLight}}>
            {t('text_chat-not-active')}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ChatDetailScreen;

const styles = StyleSheet.create({
  sheetTitleStyle: {
    color: ColorSet.secondary,
    fontSize: 18,
    fontFamily: FamilySet.bold,
  },
  deleteTextStyle: {
    color: ColorSet.secondary,
    fontSize: 12,
    fontFamily: FamilySet.semiBold,
    textAlign: 'center',
  },
  iconStyleThree: {
    width: 13,
    height: 13,
    resizeMode: 'contain',
    marginRight: 5,
  },
  iconStyleFour: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
    marginRight: 5,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: ColorSet.white,
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 20,
    shadowColor: ColorSet.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  searchTextStyle: {
    fontSize: 17,
    fontFamily: FamilySet.regular,
    color: ColorSet.grey,
    flex: 1,
  },
  imageStyle: {
    width: 121,
    height: 121,
    resizeMode: 'contain',
  },
  dateStyle: {
    fontSize: 12,
    color: ColorSet.grey,
    fontFamily: FamilySet.regular,
    paddingVertical: 10,
  },
  textStyle: {
    color: ColorSet.secondary,
    fontSize: 16,
    fontFamily: FamilySet.regular,
  },
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
  chatColRight: {
    maxWidth: screenWidth.width100 / 1.4,
    backgroundColor: ColorSet.secondary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderBottomRightRadius: 0,
  },
  iconStyle: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  barStyle: {
    backgroundColor: ColorSet.white,
    marginBottom: 0,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 24,
  },
  nameStyle: {
    color: ColorSet.theme,
    fontSize: 15,
    bottom: 5,
  },
});
