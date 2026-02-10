import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import { BaseColor, BaseStyle, useTheme } from '@/config';
import { Button, Header, Icon, SafeAreaView, Text, TextInput } from '@/components';
import styles from './styles';
import { isNullOrEmpty } from '@/utils/utility';
import Toast from 'react-native-toast-message';
import { saveRequest } from '@/apis/contactUsApi';


const successInit = {
  fullname: true,
  email: true,
  subject: true,
  message: true,
};

const ContactUs = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [success, setSuccess] = useState(successInit);
  const [loading, setLoading] = useState(false);

  /**
   * @description Called when user sumitted form
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */
  const onSubmit = () => {
    if (isNullOrEmpty(fullname) || isNullOrEmpty(email) || isNullOrEmpty(subject) || isNullOrEmpty(message)) {
      setSuccess({
        ...success,
        email: !isNullOrEmpty(email) ? true : false,
        fullname: !isNullOrEmpty(fullname) ? true : false,
        message: !isNullOrEmpty(message) ? true : false,
        subject: !isNullOrEmpty(subject) ? true : false,
      });
    } else {
      setLoading(true);
      saveRequest(0, fullname, subject, message, email).then(response => {
        if (response.isSuccess) {

          setFullname('');
          setEmail('');
          setSubject('');
          setMessage('');
          
          setSuccess({
            ...success,
            email: true,
            fullname: true,
            message: true,
            subject: true,
          });

          Toast.show({
            type: 'success',
            text1: t('success'),
            text2: t('success_message'),
          });


          setTimeout(() => {
            setLoading(false);
          }, 500)
        }
        else {
          Toast.show({
            type: 'error',
            text1: t('error'),
            text2: t('error_file_message'),
          });

          setLoading(false);
        }
      }).catch(error => {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('error_file_message'),
        });

        setLoading(false);
      })
    }
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
      <Header
        title={t('contact_us')}
        renderLeft={() => {
          return <Icon name="angle-left" size={20} color={colors.primary} enableRTL={true} />;
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <ScrollView>
        <View style={styles.contain}>

          <TextInput
            style={[BaseStyle.textInput]}
            onChangeText={(text) => setFullname(text)}
            autoCorrect={false}
            placeholder={t('fullname')}
            placeholderTextColor={success.fullname ? BaseColor.grayColor : colors.primary}
            value={fullname}
          />
          <TextInput
            style={[BaseStyle.textInput, { marginTop: 10 }]}
            onChangeText={(text) => setEmail(text)}
            autoCorrect={false}
            placeholder={t('email')}
            keyboardType="email-address"
            placeholderTextColor={success.email ? BaseColor.grayColor : colors.primary}
            value={email}
          />
          <TextInput
            style={[BaseStyle.textInput, { marginTop: 10 }]}
            onChangeText={(text) => setSubject(text)}
            autoCorrect={false}
            placeholder={t('subject')}
            placeholderTextColor={success.subject ? BaseColor.grayColor : colors.primary}
            value={subject}
          />
          <TextInput
            style={[BaseStyle.textInput, { marginTop: 10, height: 120 }]}
            onChangeText={(text) => setMessage(text)}
            textAlignVertical="top"
            multiline={true}
            autoCorrect={false}
            placeholder={t('message')}
            placeholderTextColor={success.message ? BaseColor.grayColor : colors.primary}
            value={message}
          />
        </View>
      </ScrollView>
      <View style={{ padding: 20 }}>
        <Button
          loading={loading}
          full
          onPress={() => {
            onSubmit();
          }}
        >
          {t('send')}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default ContactUs;
