import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Header, Icon, Image, SafeAreaView, Text, TextInput } from '@/components';
import { BaseColor, BaseStyle, Images, useTheme } from '@/config';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { profileEdit } from '@/apis/userApi';
import { getUserById } from '@/actions/auth';
import { isNullOrEmpty } from '@/utils/utility';
import Toast from 'react-native-toast-message';

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
  const [image] = useState(user.fileResult ? user.fileResult.fileContents : Images.avata5);

  const onConfirm = async () => {
    profileEdit(user.id, email, user.fileId, name, surname, username, phone, user.roles, "***").then(response => {
      if (response.isSuccess) {
        dispatch(getUserById(user.id));

        Toast.show({
          type: 'success',
          text1: t('success'),
          text2: t('success_message'),
        });

        navigation.goBack();
      }
      else {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('error_file_message'),
        });
      }
    }).catch((err) => {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('error_file_message'),
      });
    })
  }

  function isButtonDisabled() {
    if (isNullOrEmpty(username) || isNullOrEmpty(name) || isNullOrEmpty(surname) || isNullOrEmpty(email) || isNullOrEmpty(phone)) {
      return true;
    }

    return false;
  }

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
      <Header
        title={t('edit_profile')}
        renderLeft={() => {
          return <Icon name="angle-left" size={20} color={colors.primary} enableRTL={true} />;
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={() => { }}
      />
      <ScrollView>
        <View style={styles.contain}>
          <View>
            <Image source={{ uri: `data:image/*;base64,${image}` }} style={styles.thumb} borderRadius={50} />
          </View>
          <View style={styles.contentTitle}>
            <Text headline semibold>
              {t('username')}
            </Text>
          </View>
          <TextInput
            style={BaseStyle.textInput}
            onChangeText={(text) => setUsername(text)}
            autoCorrect={false}
            placeholder={t('input_id')}
            placeholderTextColor={BaseColor.grayColor}
            value={username}
            selectionColor={colors.primary}
          />
          <View style={styles.contentTitle}>
            <Text headline semibold>
              {t('name')}
            </Text>
          </View>
          <TextInput
            style={BaseStyle.textInput}
            onChangeText={(text) => setName(text)}
            autoCorrect={false}
            placeholder={t('input_name')}
            placeholderTextColor={BaseColor.grayColor}
            value={name}
            selectionColor={colors.primary}
          />
          <View style={styles.contentTitle}>
            <Text headline semibold>
              {t('surname')}
            </Text>
          </View>
          <TextInput
            style={BaseStyle.textInput}
            onChangeText={(text) => setSurname(text)}
            autoCorrect={false}
            placeholder={t('input_surname')}
            placeholderTextColor={BaseColor.grayColor}
            value={surname}
            selectionColor={colors.primary}
          />
          <View style={styles.contentTitle}>
            <Text headline semibold>
              {t('email')}
            </Text>
          </View>
          <TextInput
            style={BaseStyle.textInput}
            onChangeText={(text) => setEmail(text)}
            autoCorrect={false}
            placeholder={t('input_email')}
            placeholderTextColor={BaseColor.grayColor}
            value={email}
          />
          <View style={styles.contentTitle}>
            <Text headline semibold>
              {t('phone')}
            </Text>
          </View>
          <TextInput
            style={BaseStyle.textInput}
            onChangeText={(text) => setPhone(text)}
            autoCorrect={false}
            placeholder={t('input_phone')}
            placeholderTextColor={BaseColor.grayColor}
            value={phone}
            selectionColor={colors.primary}
          />
        </View>
      </ScrollView>
      <View style={{ padding: 20 }}>
        <Button
          disabled={isButtonDisabled()}
          full
          onPress={() => {
            onConfirm();
          }}
        >
          {t('confirm')}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default ProfileEdit;
