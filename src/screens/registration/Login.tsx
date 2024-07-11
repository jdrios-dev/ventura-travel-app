import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import Loader from '../../components/Loader';
import {storeDataToStorage} from '../../utils/storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TextField} from 'rn-material-ui-textfield';
import {Formik} from 'formik';
import * as yup from 'yup';
import {signup, signin} from '../../networking/OauthAPIService';
import {getProfile} from '../../networking/Services';
import appStyle from '../../styles/appStyle';
import Button from '../../components/Button';
import {Icons, Images} from '../../constants';
import {ColorSet, FamilySet} from '../../styles';
import {screenHeight, screenWidth} from '../../styles/screenSize';
import {Screen} from '../../constants/screens/screens';
import {Keys} from '../../constants';
import {Codes} from '../../constants/codes';
import {setItinerary, setRole, setUser} from '../../redux/common/common.slice';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {getItinerary} from '../../networking/Services';
import {Helper} from '../../utils';
import {
  TABLE_OFFLINE_NAME,
  getDBConnection,
  saveDbValue,
} from '../../networking/DBConection';
import {DbKeys} from '../../constants/screens/dbKeys';

const LoginScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const formRef = useRef<any>();
  const loginRef = useRef<any>();
  const [loading, setloading] = React.useState(false);
  const [loginState, setLoginState] = React.useState(true);

  const [activeState, setActiveState] = React.useState(1);
  const [pass, setPass] = React.useState(Icons.hide);
  const [passSignup, setPassSignup] = React.useState(Icons.hide);
  const [confirmPass, setConfirmPass] = React.useState(Icons.hide);
  const [heightIncreased, setHeightIncreased] = useState(0);
  const signupValidationSchema = yup.object().shape({
    email: yup.string().email(t('emailAddress_isValid')),
    invitationCode: yup.string(),
    password: yup.string().min(8, () => t('password_isValid')),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], t('password_isMatched')),
    termsOfService: yup
      .boolean()
      .oneOf([true], t('termsAndConditions_isRequired')),
  });
  const signinValidationSchema = yup.object().shape({
    email: yup.string().email(t('emailAddress_isValid')),
    password: yup.string().min(8, () => t('password_isValid')),
  });
  const updateState = async (type: number) => {
    if (activeState === 1 && type === 2) {
      await loginRef.current?.resetForm();
      setLoginState(false);
      setActiveState(2);
    }
    if (activeState === 2 && type === 1) {
      await formRef.current?.resetForm();
      setLoginState(true);
      setActiveState(1);
    }
  };

  const setValuesAfterLogin = async (result: any) => {
    const db = await getDBConnection();
    await saveDbValue(
      db,
      DbKeys.userRole,
      result?.data?.role,
      TABLE_OFFLINE_NAME,
    );
    dispatch(setRole(result?.data?.role));
    await storeDataToStorage(Keys.userRole, result?.data?.role);
    await storeDataToStorage(Keys.userDetails, result.data);

    const responseItinerary = await getItinerary();

    if (responseItinerary) {
      const tempUpcoming: any = [];
      const tempCompleted: any = [];
      responseItinerary.map((item: any) => {
        Helper.compareDates(item?.date)
          ? tempUpcoming.push(item)
          : tempCompleted.push(item);
      });
      const res = {
        upComingItinerary: tempUpcoming,
        completedItinerary: tempCompleted,
      };
      dispatch(setItinerary(res));
    }
  };

  const loginHandler = async () => {
    if (loginRef.current?.isValid) {
      const formReference = loginRef.current.values;

      const params = {
        email: formReference.email,
        password: formReference.password,
      };
      setloading(true);
      if (!params.email || !params.password) {
        setloading(false);
        Helper.showToast(t('error_invalidInputs'));
      } else {
        const result = await signin(params);

        if (result) {
          if (
            result?.status === Codes.SUCCESS ||
            result?.status === Codes.PROFILE_CREATED
          ) {
            setValuesAfterLogin(result);
            const response = await getProfile();
            setloading(false);

            if (
              response.data.fullName === null &&
              response.data.phoneNumber === null &&
              response.data.profilePicture === null
            ) {
              navigation.replace(Screen.EditProfile, {createProfile: true});
            } else {
              dispatch(setUser(response.data));
              navigation.replace('TabNavigator');
            }
          } else {
            setloading(false);
            Helper.showToast(Keys.invalidCredentials);
          }
        }
        setloading(false);
      }
    } else {
      setloading(false);
    }
    setloading(false);
  };

  const login = async () => {
    if (loginRef.current) {
      loginRef.current?.handleSubmit();
    }
    await loginHandler();
  };

  const signUpHandler = async () => {
    if (formRef.current) {
      formRef.current?.handleSubmit();
      if (formRef.current?.isValid) {
        const formReference = formRef.current.values;

        const params = {
          email: formReference.email,
          invitationCode: formReference.invitationCode,
          password: formReference.password,
          isTermAccepted: formReference.termsOfService,
        };
        setloading(true);
        const result = await signup(params);
        setValuesAfterLogin(result);
        setloading(false);
        if (result === null) {
          return Helper.showToast(t('signup_error-invitation-code'));
        }
        if (result) {
          await loginHandler();
          navigation.replace(Screen.EditProfile, {createProfile: true});
        }
        if (result.statusCode === Codes.BAD_REQUEST) {
          return Helper.showToast(t('error_invalidInputs'));
        }
      } else {
        return setloading(false);
      }
    }
  };

  const showPassword = type => {
    if (type === 1) {
      pass === Icons.hide ? setPass(Icons.show) : setPass(Icons.hide);
    } else if (type === 2) {
      passSignup === Icons.hide
        ? setPassSignup(Icons.show)
        : setPassSignup(Icons.hide);
    } else {
      confirmPass === Icons.hide
        ? setConfirmPass(Icons.show)
        : setConfirmPass(Icons.hide);
    }
  };

  const renderScreenTabsHeaderView = () => {
    return (
      <View testID="loginScreen" style={[appStyle.row]}>
        <TouchableOpacity
          onPress={() => updateState(1)}
          style={[
            styles.tabStyle,
            {
              borderBottomColor: loginState
                ? ColorSet.theme
                : ColorSet.grayLight,
            },
          ]}>
          <Text
            style={[
              styles.tabLableStyle,
              {color: loginState ? ColorSet.theme : ColorSet.grey},
            ]}>
            {t('loginScreen_login_title')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => updateState(2)}
          style={[
            styles.tabStyle,
            {
              borderBottomColor: loginState
                ? ColorSet.grayLight
                : ColorSet.theme,
            },
          ]}>
          <Text
            style={[
              styles.tabLableStyle,
              {color: loginState ? ColorSet.grey : ColorSet.theme},
            ]}>
            {t('loginScreen_signUp_title')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderLoginTabView = () => {
    return (
      <Formik
        initialValues={{email: '', password: ''}}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onSubmit={_ => {}}
        innerRef={loginRef}
        validateOnBlur={false}
        validationSchema={signinValidationSchema}>
        {({handleChange, handleBlur, values, errors}) => (
          <View style={[appStyle.flex1, appStyle.pt20]}>
            <TextField
              testID={'loginEmailInput'}
              label={t('emailAdress')}
              fontSize={16}
              baseColor={ColorSet.grey}
              tintColor={ColorSet.red}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              error={errors.email}
              autoCapitalize="none"
              autoComplete="off"
            />
            <TextField
              testID={'passwordPasswordInput'}
              label={t('password')}
              fontSize={16}
              focused={false}
              baseColor={ColorSet.grey}
              tintColor={ColorSet.red}
              secureTextEntry={passSignup === Icons.hide ? true : false}
              renderRightAccessory={() => (
                <TouchableOpacity onPress={() => showPassword(2)}>
                  <Image source={passSignup} style={styles.eyeStyle} />
                </TouchableOpacity>
              )}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              error={errors.password}
              autoCapitalize="none"
              autoComplete="off"
            />
            <TouchableOpacity
              onPress={() => navigation.navigate(Screen.ForgotPassword)}>
              <Text style={styles.forgotPassStyle}>
                {t('button_forgotPassword')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    );
  };

  const renderSignupTabView = () => {
    return (
      <Formik
        initialValues={{
          email: '',
          password: '',
          invitationCode: '',
          confirmPassword: '',
          termsOfService: true,
        }}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onSubmit={_ => {}}
        innerRef={formRef}
        validateOnBlur={false}
        validationSchema={signupValidationSchema}>
        {({handleChange, handleBlur, values, errors, setFieldValue}) => (
          <View style={appStyle.flex1}>
            <TextField
              label={t('emailAdress')}
              fontSize={16}
              baseColor={ColorSet.grey}
              tintColor={ColorSet.red}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              error={errors.email}
              autoCapitalize="none"
              autoComplete="off"
            />
            <TextField
              label={t('invitationCode')}
              fontSize={16}
              baseColor={ColorSet.grey}
              tintColor={ColorSet.red}
              onChangeText={handleChange('invitationCode')}
              onBlur={handleBlur('invitationCode')}
              value={values.invitationCode}
              error={errors.invitationCode}
            />
            <TextField
              label={t('password')}
              fontSize={16}
              baseColor={ColorSet.grey}
              tintColor={ColorSet.red}
              secureTextEntry={passSignup === Icons.hide ? true : false}
              renderRightAccessory={() => (
                <TouchableOpacity onPress={() => showPassword(2)}>
                  <Image source={passSignup} style={styles.eyeStyle} />
                </TouchableOpacity>
              )}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              error={errors.password}
              autoCapitalize="none"
              autoComplete="off"
            />
            <TextField
              label={t('comfirmPassword')}
              fontSize={16}
              baseColor={ColorSet.grey}
              tintColor={ColorSet.red}
              secureTextEntry={confirmPass === Icons.hide ? true : false}
              renderRightAccessory={() => (
                <TouchableOpacity onPress={() => showPassword(3)}>
                  <Image source={confirmPass} style={styles.eyeStyle} />
                </TouchableOpacity>
              )}
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              value={values.confirmPassword}
              error={errors.confirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() =>
                setFieldValue('termsOfService', !values.termsOfService)
              }
              style={[appStyle.row, appStyle.pv15]}>
              <View style={styles.checkBoxView}>
                <Image
                  style={[styles.checkBox]}
                  source={
                    values.termsOfService ? Icons.checkBox : Icons.emptyChexBox
                  }
                />
              </View>
              <Text style={styles.termsStyle}>{t('termsAndConditions')}</Text>
            </TouchableOpacity>

            <View style={[appStyle.asCenter, appStyle.colCenter]}>
              <TouchableOpacity
                onPress={() => navigation.navigate(Screen.EULA)}>
                <Text style={appStyle.textLink}>{t('Touchable_EULA')}</Text>
              </TouchableOpacity>
              <Text style={{color: ColorSet.grey}}> & </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate(Screen.PrivacyPolicy)}>
                <Text style={appStyle.textLink}>
                  {t('Touchable_PrivacyPolicy')}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.termsOfService && (
              <Text style={styles.termsTextError}>{errors.termsOfService}</Text>
            )}
          </View>
        )}
      </Formik>
    );
  };

  const renderBottomView = () => {
    return (
      <View style={styles.buttonStyle}>
        <Button
          testID="loginContinueButton"
          themeColor
          onPress={() => (loginState ? login() : signUpHandler())}>
          {loginState ? t('button_login') : t('button_createAccount')}
        </Button>
        <View style={[appStyle.aiCenter, appStyle.pb20]}>
          <Image style={[styles.logoDetail]} source={Images.logoDetailBlack} />
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <ImageBackground style={[appStyle.flex1]} source={Images.bgImage}>
        <StatusBar hidden />
        <View style={[appStyle.flex1]}>
          <View style={[appStyle.halfPageView, appStyle.pt30]}>
            <View style={[appStyle.flex1, appStyle.jcSpaceBetween]}>
              <View style={appStyle.flex1}>
                {renderScreenTabsHeaderView()}
                <KeyboardAwareScrollView
                  onKeyboardDidShow={() => setHeightIncreased(150)}
                  onKeyboardDidHide={() => setHeightIncreased(0)}
                  keyboardShouldPersistTaps="always"
                  contentContainerStyle={[
                    appStyle.scrollContainer,
                    {paddingBottom: heightIncreased},
                  ]}>
                  {activeState === 1
                    ? renderLoginTabView()
                    : renderSignupTabView()}
                  {renderBottomView()}
                </KeyboardAwareScrollView>
              </View>
            </View>
          </View>
          <Loader isLoading={loading} layout={'outside'} />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  buttonStyle: {
    height: screenHeight.height15,
    justifyContent: 'space-between',
  },
  termsStyle: {
    color: ColorSet.grey,
    fontFamily: FamilySet.regular,
    fontSize: 16,
    flex: 1,
    flexWrap: 'wrap',
    marginRight: 6,
  },
  forgotPassStyle: {
    fontFamily: FamilySet.semiBold,
    fontSize: 14,
    color: ColorSet.secondary,
    paddingTop: 10,
    marginBottom: 16,
  },
  tabLableStyle: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
  },
  tabStyle: {
    width: screenWidth.width45,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    flex: 1,
  },
  checkBox: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  checkBoxView: {
    paddingRight: 10,
    paddingTop: 3,
  },
  logoDetail: {
    resizeMode: 'contain',
    width: 173,
    height: 16,
  },
  eyeStyle: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  termsTextError: {
    color: ColorSet.red,
    bottom: 15,
    marginTop: 7,
  },
});
