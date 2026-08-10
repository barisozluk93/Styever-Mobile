import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Header, Icon, Image, SafeAreaView, Text, TextInput } from '@/components';
import { BaseColor, BaseStyle, Images, useTheme } from '@/config';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { profileEdit } from '@/apis/userApi';
import { getUserById } from '@/actions/auth';
import { avatarUploadFolderUrl, isNullOrEmpty } from '@/utils/utility';
import Toast from 'react-native-toast-message';

const successInit = {
  email: true,
  name: true,
  surname: true,
  username: true,
  phone: true
};

const ProfileEdit = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useSelector((state) => state.user);
  const [username, setUsername] = useState(user.username);
  const [name, setName] = useState(user.name);
  const [surname, setSurname] = useState(user.surname);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const avatarPath = user?.file?.path;
  const hasAvatar = Boolean(avatarPath);
  const image = hasAvatar
    ? {uri: avatarUploadFolderUrl + user.file.path.split("\\")[user.file.path.split("\\").length-1] + (user.file.extension == ".jpeg" || user.file.extension == ".jpg" ? ".jpg" : user.file.extension == ".png" ? ".png" : "")}
    : Images.avata5;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(successInit);

  const onConfirm = async () => {

    if (isNullOrEmpty(username) || isNullOrEmpty(name) || isNullOrEmpty(surname) || isNullOrEmpty(email) || isNullOrEmpty(phone)) {
      setSuccess({
        ...success,
        username: !isNullOrEmpty(username) ? true : false,
        name: !isNullOrEmpty(name) ? true : false,
        surname: !isNullOrEmpty(surname) ? true : false,
        email: !isNullOrEmpty(email) ? true : false,
        phone: !isNullOrEmpty(phone) ? true : false,
      });
    }
    else {
      setLoading(true);

      profileEdit(user.id, email, user.fileId, name, surname, username, phone, user.roles, "***").then(response => {
        if (response.isSuccess) {
          dispatch(getUserById(user.id));

          Toast.show({
            type: 'success',
            text1: t('success'),
            text2: t('success_message'),
          });

          setTimeout(() => {
            setLoading(false);
            navigation.goBack();
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
      }).catch((err) => {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('error_file_message'),
        });

        setLoading(false);
      })
    }
  }

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

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
        onPressRight={() => { }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{
          flex: 1,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.heading}>
            <View style={styles.kickerRow}>
              <View
                style={[
                  styles.kickerLine,
                  {backgroundColor:colors.primary},
                ]}
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
              {t('edit_profile')}
            </Text>

            <Text numberOfLines={0} grayColor style={styles.description}>
              {t('edit_profile_description')}
            </Text>
          </View>

          <View style={styles.contain}>
            <View style={styles.avatarWrapper}>
              <Image source={image} style={styles.thumb} borderRadius={50} />
            </View>
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('username')}
              </Text>
            </View>
            <TextInput
              style={BaseStyle.textInput}
              iconLeft={<Icon name="users" size={17} color={BaseColor.grayColor} style={{marginRight:12}} />}
            onChangeText={(text) => {setUsername(text); if(!isNullOrEmpty(text)) setSuccess(prev => ({...prev, username: true}));}}
              autoCorrect={false}
              placeholder={t('username')}
              placeholderTextColor={success.username ? BaseColor.grayColor : colors.primary}
              value={username}
              selectionColor={colors.primary}
            />
            {!success.username&&<Text style={styles.errorField}>{t('required_field')}</Text>}
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('name')}
              </Text>
            </View>
            <TextInput
              style={BaseStyle.textInput}
              iconLeft={<Icon name="id-card" size={17} color={BaseColor.grayColor} style={{marginRight:12}} />}
              onChangeText={(text) => {setName(text); if(!isNullOrEmpty(text)) setSuccess(prev => ({...prev, name: true}));}}
              autoCorrect={false}
              placeholder={t('name')}
              placeholderTextColor={success.name ? BaseColor.grayColor : colors.primary}
              value={name}
              selectionColor={colors.primary}
            />
            {!success.name&&<Text style={styles.errorField}>{t('required_field')}</Text>}
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('surname')}
              </Text>
            </View>
            <TextInput
              style={BaseStyle.textInput}
              iconLeft={<Icon name="signature" size={17} color={BaseColor.grayColor} style={{marginRight:12}} />}
              onChangeText={(text) => {setSurname(text); if(!isNullOrEmpty(text)) setSuccess(prev => ({...prev, surname: true}));}}
              autoCorrect={false}
              placeholder={t('surname')}
              placeholderTextColor={success.surname ? BaseColor.grayColor : colors.primary}
              value={surname}
              selectionColor={colors.primary}
            />
            {!success.surname&&<Text style={styles.errorField}>{t('required_field')}</Text>}
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('email')}
              </Text>
            </View>
            <TextInput
              style={BaseStyle.textInput}
              iconLeft={<Icon name="envelope" size={17} color={BaseColor.grayColor} style={{marginRight:12}} />}
              onChangeText={(text) => {setEmail(text); if(!isNullOrEmpty(text)) setSuccess(prev => ({...prev, email: true}));}}
              autoCorrect={false}
              placeholder={t('email')}
              placeholderTextColor={success.email ? BaseColor.grayColor : colors.primary}
              value={email}
            />
            {!success.email&&<Text style={styles.errorField}>{t('required_field')}</Text>}
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('phone')}
              </Text>
            </View>
            <TextInput
              style={BaseStyle.textInput}
              iconLeft={<Icon name="phone" size={17} color={BaseColor.grayColor} style={{marginRight:12}} />}
              onChangeText={(text) => {setPhone(text); if(!isNullOrEmpty(text)) setSuccess(prev => ({...prev, phone: true}));}}
              autoCorrect={false}
              placeholder={t('phone')}
              placeholderTextColor={success.phone ? BaseColor.grayColor : colors.primary}
              value={phone}
              selectionColor={colors.primary}
            />
            {!success.phone&&<Text style={styles.errorField}>{t('required_field')}</Text>}
          </View>
        </ScrollView>
        <View style={{ padding: 20 }}>
          <Button
            loading={loading}
            full
            onPress={() => {
              onConfirm();
            }}
          >
            {t('confirm')}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProfileEdit;
