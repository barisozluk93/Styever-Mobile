import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BaseColor, BaseStyle, useTheme } from '@/config';
import { Button, Header, Icon, SafeAreaView, Text, TextInput } from '@/components';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { changePasswordRequest } from '@/apis/authApi';
import { removeToken } from '@/utils/storage';
import Toast from 'react-native-toast-message';
import { isNullOrEmpty } from '@/utils/utility';

const ChangePassword = (props) => {
  const dispatch = useDispatch();
  const { navigation } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useSelector((state) => state.user);
  const [ currentPassword, setCurrentPassword] = useState('');
  const [ password, setPassword] = useState('');
  const [ repassword, setRepassword] = useState('');

  function isButtonDisabled() {
    if (isNullOrEmpty(currentPassword) || isNullOrEmpty(password) || isNullOrEmpty(repassword)) {
      return true;
    }
    
    return false;
  }

  const onChangePassowrd = () => {
    changePasswordRequest(user.id, currentPassword, password).then(async (response) => {

      if (response.isSuccess) {
        await removeToken();
        dispatch({ type: 'AUTH_LOGOUT' });
        dispatch({ type: 'USER_INIT' });

        Toast.show({
          type: 'success',
          text1: t('success'),
          text2: t('success_message'),
        });

        navigation.navigate('SignIn');
      }
    })
      .catch((error) => {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('error_file_message'),
        });
      });
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
      <Header
        title={t('change_password')}
        renderLeft={() => {
          return <Icon name="angle-left" size={20} color={colors.primary} enableRTL={true} />;
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <ScrollView>
        <View style={styles.contain}>
          <View style={styles.contentTitle}>
            <Text headline semibold>
              {t('current_password')}
            </Text>
          </View>
          <TextInput
            style={BaseStyle.textInput}
            onChangeText={(text) => setCurrentPassword(text)}
            autoCorrect={false}
            secureTextEntry={true}
            placeholder={t('current_password')}
            placeholderTextColor={BaseColor.grayColor}
            value={currentPassword}
            selectionColor={colors.primary}
          />
          <View style={styles.contentTitle}>
            <Text headline semibold>
              {t('new_password')}
            </Text>
          </View>
          <TextInput
            style={BaseStyle.textInput}
            onChangeText={(text) => setPassword(text)}
            autoCorrect={false}
            secureTextEntry={true}
            placeholder={t('new_password')}
            placeholderTextColor={BaseColor.grayColor}
            value={password}
            selectionColor={colors.primary}
          />
          <View style={styles.contentTitle}>
            <Text headline semibold>
              {t('password_confirm')}
            </Text>
          </View>
          <TextInput
            style={BaseStyle.textInput}
            onChangeText={(text) => setRepassword(text)}
            autoCorrect={false}
            secureTextEntry={true}
            placeholder={t('password_confirm')}
            placeholderTextColor={BaseColor.grayColor}
            value={repassword}
            selectionColor={colors.primary}
          />
        </View>
      </ScrollView>
      <View style={{ padding: 20 }}>
        <Button
          disabled={isButtonDisabled()}
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
