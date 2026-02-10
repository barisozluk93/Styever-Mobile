import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Header, Icon, Image, SafeAreaView, TextInput } from '@/components';
import { BaseColor, BaseStyle, Images, useTheme } from '@/config';
import styles from './styles';
import { isNullOrEmpty } from '@/utils/utility';
import Toast from 'react-native-toast-message';

const successInit = {
  name: true,
  surname: true,
  email: true,
  phone: true,
  password: true,
  passwordConfirm: true,
  address: true,
};

const SignUp = (props) => {
  const { navigation, route } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [success, setSuccess] = useState(successInit);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route?.params?.selectedPlanId) {
      if (route?.params?.selectedPlanId === 2) {
        setRoles([2]);
      }
      else if (route?.params?.selectedPlanId === 3) {
        setRoles([3]);
      }
      else if (route?.params?.selectedPlanId === 4) {
        setRoles([4]);
      }
    }
  }, [route?.params])

  const continueRegister = () => {
    if (isNullOrEmpty(name) || isNullOrEmpty(surname) || isNullOrEmpty(email) || isNullOrEmpty(password) || isNullOrEmpty(passwordConfirm) || isNullOrEmpty(phone)) {
      setSuccess({
        ...success,
        name: !isNullOrEmpty(name) ? true : false,
        surname: !isNullOrEmpty(surname) ? true : false,
        email: !isNullOrEmpty(email) ? true : false,
        password: !isNullOrEmpty(password) ? true : false,
        passwordConfirm: !isNullOrEmpty(passwordConfirm) ? true : false,
        phone: !isNullOrEmpty(phone) ? true : false,
      });
    } else {
      if (password !== passwordConfirm) {
        setSuccess({
          ...success,
          name: !isNullOrEmpty(name) ? true : false,
          surname: !isNullOrEmpty(surname) ? true : false,
          email: !isNullOrEmpty(email) ? true : false,
          password: false,
          passwordConfirm: false,
          phone: !isNullOrEmpty(phone) ? true : false,
        });

        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('pw_didnt_match_message'),
        });
      }
      else {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          var user = { id: 0, agree: true, roles: roles, name: name, surname: surname, email: email, username: email, password: password, phone: phone,
            voucher: route?.params?.voucher
          };
          console.log(user);
          
          navigation.navigate('Address', { user: user })
        }, 500);
      }
    }
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
      <Header
        title={t('membership_info')}
        renderLeft={() => {
          return <Icon name="angle-left" size={20} color={colors.primary} enableRTL={true} />;
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{
          flex: 1,
        }}
      >
        <View style={{ alignItems: 'center', marginTop: 50 }}>
          <Image source={Images.logo} style={styles.logo} resizeMode="contain" />
        </View>

        <ScrollView>
          <View style={styles.contain}>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                style={[styles.textInputName, { marginTop: 65, marginRight: 10 }]}
                onChangeText={(text) => setName(text)}
                autoCorrect={false}
                placeholder={t('name')}
                placeholderTextColor={success.name ? BaseColor.grayColor : colors.primary}
                value={name}
              />
              <TextInput
                style={[styles.textInputName, { marginTop: 65 }]}
                onChangeText={(text) => setSurname(text)}
                autoCorrect={false}
                placeholder={t('surname')}
                placeholderTextColor={success.surname ? BaseColor.grayColor : colors.primary}
                value={surname}
              />
            </View>
            <TextInput
              style={[styles.textInput, { marginTop: 10 }]}
              onChangeText={(text) => setEmail(text)}
              autoCorrect={false}
              placeholder={t('email')}
              keyboardType="email-address"
              placeholderTextColor={success.email ? BaseColor.grayColor : colors.primary}
              value={email}
            />
            <View style={{ flexDirection: "row" }}>
              <TextInput
                style={[styles.textInputName, { marginTop: 10, marginRight: 10 }]}
                onChangeText={(text) => setPassword(text)}
                autoCorrect={false}
                placeholder={t('password')}
                secureTextEntry={true}
                placeholderTextColor={success.password ? BaseColor.grayColor : colors.primary}
                value={password}
              />
              <TextInput
                style={[styles.textInputName, { marginTop: 10 }]}
                onChangeText={(text) => setPasswordConfirm(text)}
                autoCorrect={false}
                placeholder={t('password_confirm')}
                secureTextEntry={true}
                placeholderTextColor={success.passwordConfirm ? BaseColor.grayColor : colors.primary}
                value={passwordConfirm}
              />
            </View>
            <TextInput
              style={[BaseStyle.textInput, { marginTop: 10 }]}
              onChangeText={(text) => setPhone(text)}
              autoCorrect={false}
              placeholder={t('phone')}
              placeholderTextColor={success.phone ? BaseColor.grayColor : colors.primary}
              value={phone}
            />
            <View style={{ width: '100%' }}>
              <Button full style={{ marginTop: 20 }} loading={loading} onPress={() => continueRegister()}>
                {t('continue')}
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
