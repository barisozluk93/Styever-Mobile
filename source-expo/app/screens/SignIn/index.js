import { useEffect, useState } from 'react';
import { TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { BaseColor, BaseStyle, Images, useTheme } from '@/config';
import { Button, Header, Icon, Image, SafeAreaView, Text, TextInput } from '@/components';
import styles from './styles';
import { getUserByToken, login } from '@/actions/auth';
import { loadToken } from '@/utils/storage';
import Toast from 'react-native-toast-message';
import { isNullOrEmpty } from '@/utils/utility';
import { registerForPushNotificationsAsync } from '@/services/notification.service';
import { registerDevice } from '@/apis/notificationApi';

const successInit = {
  id: true,
  password: true,
};

const SignIn = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(successInit);
  const { error, token, isPaymentRequired } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const access_token = loadToken();

    if (!access_token) {
      dispatch({ type: 'AUTH_LOGOUT' });
      dispatch({ type: 'USER_INIT' });
    }
  }, [navigation, dispatch]);

  useEffect(() => {
    if (!token) return;

    async function initAfterLogin() {
      try {
        const pushToken = await registerForPushNotificationsAsync();
        console.log('Push token sonucu:', pushToken);

        if (pushToken) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userId = Number(payload?.id);

          if (pushToken && userId) {
            await registerDevice({
              pushToken,
              platform: Platform.OS,
              userId
            });

            console.log('Cihaz kaydı başarılı.');
          }
        } else {
          console.log('Push token null döndü, registerDevice çağrılmadı.');
        }

        dispatch(getUserByToken());

        setTimeout(() => {
          setLoading(false);

          if (isPaymentRequired) {
            navigation.navigate('Payment', { item: { typeId: 1 } });
          } else {
            navigation.navigate('NHome');
          }
        }, 500);
      } catch (err) {
        console.log('Login sonrası init hatası:', err);
        setLoading(false);

        dispatch(getUserByToken());

        if (isPaymentRequired) {
          navigation.navigate('Payment', { item: { typeId: 1 } });
        } else {
          navigation.navigate('NHome');
        }
      }
    }

    initAfterLogin();
  }, [token, isPaymentRequired, navigation, dispatch]);

  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('error_login_message'),
      });

      setLoading(false);
    }
  }, [error, t]);

  const onLogin = () => {
    if (!isNullOrEmpty(id) && !isNullOrEmpty(password)) {
      setLoading(true);
      dispatch(login(id, password));
    } else {
      setSuccess({
        ...success,
        id: !isNullOrEmpty(id),
        password: !isNullOrEmpty(password),
      });
    }
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
      <Header
        title={t('sign_in')}
        renderLeft={() => {
          return <Icon name="angle-left" size={20} color={colors.primary} enableRTL={true} />;
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />

      <View style={{ alignItems: 'center', marginTop: 50 }}>
        <Image source={Images.logo} style={styles.logo} resizeMode="contain" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{ flex: 1 }}
      >
        <View style={styles.contain}>
          <TextInput
            style={[BaseStyle.textInput]}
            onChangeText={(text) => setId(text)}
            autoCorrect={false}
            placeholder={t('email_address')}
            placeholderTextColor={success.id ? BaseColor.grayColor : colors.primary}
            value={id}
            selectionColor={colors.primary}
          />

          <TextInput
            style={[BaseStyle.textInput, { marginTop: 10 }]}
            onChangeText={(text) => setPassword(text)}
            autoCorrect={false}
            placeholder={t('password')}
            secureTextEntry={true}
            placeholderTextColor={success.password ? BaseColor.grayColor : colors.primary}
            value={password}
            selectionColor={colors.primary}
          />

          <View style={{ width: '100%', marginVertical: 16 }}>
            <Button full loading={loading} style={{ marginTop: 20 }} onPress={onLogin}>
              {t('sign_in')}
            </Button>
          </View>

          <View style={styles.contentActionBottom}>
            <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
              <Text body2 grayColor>
                {t('forgot_your_password')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Pricing', {
                  isStandByPage: false,
                  isProfilePage: false,
                })
              }
            >
              <Text body2 primaryColor>
                {t('not_have_account')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;