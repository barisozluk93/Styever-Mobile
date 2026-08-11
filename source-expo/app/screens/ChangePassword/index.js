import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BaseColor, BaseStyle, useTheme } from '@/config';
import {
  Button,
  Header,
  Icon,
  Image,
  SafeAreaView,
  Text,
  TextInput,
} from '@/components';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { changePasswordRequest } from '@/apis/authApi';
import { removeToken } from '@/utils/storage';
import Toast from 'react-native-toast-message';
import { isNullOrEmpty } from '@/utils/utility';

const successInit = {
  currentPassword: true,
  password: true,
  repassword: true,
};

const ChangePassword = (props) => {
  const dispatch = useDispatch();
  const { navigation } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useSelector((state) => state.user);
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(successInit);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const onChangePassowrd = () => {
    if (isNullOrEmpty(currentPassword) || isNullOrEmpty(password) || isNullOrEmpty(repassword)) {
      setSuccess({
        ...success,
        currentPassword: !isNullOrEmpty(currentPassword) ? true : false,
        password: !isNullOrEmpty(password) ? true : false,
        repassword: !isNullOrEmpty(repassword) ? true : false,
      });
    }
    else {
      if (password !== repassword) {
        setSuccess({
          ...success,
          currentPassword: !isNullOrEmpty(currentPassword),
          password: !isNullOrEmpty(password),
          repassword: !isNullOrEmpty(repassword),
        });
        setPasswordMismatch(true);
      }
      else {
        setPasswordMismatch(false);
        setLoading(true);
        changePasswordRequest(user.id, currentPassword, password).then(async (response) => {

          if (response.isSuccess) {
            await removeToken();
            dispatch({ type: 'AUTH_LOGOUT' });
            dispatch({ type: 'USER_INIT' });
            dispatch({ type: 'MEMORY_INIT' });
            dispatch({ type: 'ARTICLE_INIT' });

            Toast.show({
              type: 'success',
              text1: t('success'),
              text2: t('success_message'),
            });

            setTimeout(() => {
              setLoading(false);
              navigation.navigate('SignIn');
            }, 500);
          }
          else {
            Toast.show({
              type: 'error',
              text1: t('error'),
              text2: t('error_file_message'),
            });

            setLoading(false);
          }
        })
          .catch((error) => {
            Toast.show({
              type: 'error',
              text1: t('error'),
              text2: t('error_file_message'),
            });

            setLoading(false);
          });
      }
    }
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
      <Header
        title=""
        renderLeft={() => {
          return <Icon name="angle-left" size={20} color={colors.primary} enableRTL={true} />;
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heading}>
          <View style={styles.kickerRow}>
            <Image
                source={require('../../assets/images/styever-mark.png')}
                style={styles.kickerLogo}
                resizeMode="contain"
              />
            <Text
              style={[
                styles.kicker,
                {color:colors.primary},
              ]}
            >
              STYEVER
            </Text>
          </View>

          <Text numberOfLines={0} style={styles.pageTitle}>
            {t('change_password')}
          </Text>

          <Text numberOfLines={0} grayColor style={styles.description}>
            {t('change_password_description')}
          </Text>
        </View>

        <View style={styles.contain}>
          <View style={styles.contentTitle}>
            <Text headline semibold>
              {t('current_password')}
            </Text>
          </View>
          <TextInput
            style={BaseStyle.textInput}
            iconLeft={<Icon name="lock" size={17} color={BaseColor.grayColor} style={{marginRight:12}} />}
            onChangeText={(text) => {setCurrentPassword(text); if(!isNullOrEmpty(text)) setSuccess(prev => ({...prev, currentPassword: true}));}}
            autoCorrect={false}
            secureTextEntry={true}
            placeholder={t('current_password')}
            placeholderTextColor={success.currentPassword ? BaseColor.grayColor : colors.primary}
            value={currentPassword}
            selectionColor={colors.primary}
          />
          {!success.currentPassword&&<Text style={styles.errorField}>{t('required_field')}</Text>}
          <View style={styles.contentTitle}>
            <Text headline semibold>
              {t('new_password')}
            </Text>
          </View>
          <TextInput
            style={BaseStyle.textInput}
            onChangeText={(text) => {setPassword(text); setPasswordMismatch(false); if(!isNullOrEmpty(text)) setSuccess(prev => ({...prev, password: true}));}}
            autoCorrect={false}
            secureTextEntry={true}
            placeholder={t('new_password')}
            placeholderTextColor={success.password ? BaseColor.grayColor : colors.primary}
            value={password}
            selectionColor={colors.primary}
          />
          {!success.password&&<Text style={styles.errorField}>{t('required_field')}</Text>}
          <View style={styles.contentTitle}>
            <Text headline semibold>
              {t('new_password_confirm')}
            </Text>
          </View>
          <TextInput
            style={BaseStyle.textInput}
            onChangeText={(text) => {setRepassword(text); setPasswordMismatch(false); if(!isNullOrEmpty(text)) setSuccess(prev => ({...prev, repassword: true}));}}
            autoCorrect={false}
            secureTextEntry={true}
            placeholder={t('new_password_confirm')}
            placeholderTextColor={success.repassword ? BaseColor.grayColor : colors.primary}
            value={repassword}
            selectionColor={colors.primary}
          />
          {!success.repassword&&<Text style={styles.errorField}>{t('required_field')}</Text>}
          {passwordMismatch&&<Text style={styles.errorField}>{t('pw_didnt_match_message2')}</Text>}
        </View>
      </ScrollView>
      <View style={{ padding: 20 }}>
        <Button
          loading={loading}
          full
          onPress={() => {
            onChangePassowrd();
          }}
        >
          {t('confirm')}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default ChangePassword;
