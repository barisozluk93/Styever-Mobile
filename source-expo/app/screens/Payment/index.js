import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  ScrollView,
  Switch,
  View,
} from 'react-native';
import { BaseStyle, useTheme } from '@/config';
import { Button, Header, Icon, MonthYearPicker, SafeAreaView, Text, TextInput } from '@/components';
import styles from './styles';
import { useDispatch } from 'react-redux';
import { authentication } from '@/actions/auth';

const Payment = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [card, setCard] = useState('');
  const [isSave, setIsSave] = useState(false);
  const [digit, setDigit] = useState('');
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [success, setSuccess] = useState({
    name: true,
    card: true,
    digit: true,
  });

  const onLogin = () => {
    if (name === '' || card === '' || digit === '') {
      setSuccess({
        ...success,
        name: name !== '' ? true : false,
        card: card !== '' ? true : false,
        digit: digit !== '' ? true : false,
      });
    } else {
      setLoading(true);
      dispatch(
        authentication(true, (response) => {
          if (response.success) {
            navigation.navigate('Profile');
          } else {
            setLoading(false);
          }
        })
      );
    }
  };

  const renderContent = () => {
    return (
      <SafeAreaView style={[BaseStyle.safeAreaView]} edges={['right', 'top', 'left']}>
        <Header title={t('payment')}
          renderLeft={() => {
            return <Icon name="angle-left" size={20} color={colors.primary} enableRTL={true} />;
          }}
          onPressLeft={() => {
            navigation.goBack();
          }}
        />

        <View style={{ flex: 1 }}>
          <KeyboardAvoidingView behavior={'height'}>
            <ScrollView>
              <View style={{ padding: 20, paddingTop: 0 }}>
                <TextInput
                  style={{ marginTop: 10 }}
                  onChangeText={(text) => setName(text)}
                  placeholder={t('name_on_card')}
                  success={success.name}
                  value={name}
                />
                <TextInput
                  style={{ marginTop: 10 }}
                  onChangeText={(text) => setCard(text)}
                  placeholder={t('credit_card_number')}
                  success={success.card}
                  keyboardType="numeric"
                  value={card}
                />
                <MonthYearPicker style={{ marginTop: 10 }} onChange={() => { }} />
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    alignItems: 'center',
                  }}
                >
                  <View style={{ flex: 3.5 }}>
                    <TextInput
                      onChangeText={(text) => setDigit(text)}
                      placeholder={t('digit_num')}
                      success={success.digit}
                      keyboardType="numeric"
                      value={digit}
                    />
                  </View>
                  <View style={styles.digiNumber}>
                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                      <Switch onValueChange={() => setIsSave((isSaveInline) => !isSaveInline)} value={isSave} />
                      <Text style={{ marginLeft: 8 }} body1>
                        {t('save')}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{ width: '100%' }}>
                    <Button full style={{ marginTop: 20 }} loading={loading} onPress={() => onLogin()}>
                      {t('pay')}
                    </Button>
                  </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    );
  };

  return renderContent();
};

export default Payment;
