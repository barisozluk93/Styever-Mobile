import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  ScrollView,
  Switch,
  View,
} from 'react-native';
import { BaseStyle, useTheme } from '@/config';
import { Button, CardBooking, Header, Icon, MonthYearPicker, SafeAreaView, Text, TextInput } from '@/components';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { authentication } from '@/actions/auth';

const Payment = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [card, setCard] = useState('');
  const [digit, setDigit] = useState('');
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const { isPaymentRequired } = useSelector(state => state.auth);

  const [success, setSuccess] = useState({
    name: true,
    card: true,
    digit: true,
  });

  const onPay = () => {
    if (name === '' || card === '' || digit === '') {
      setSuccess({
        ...success,
        name: name !== '' ? true : false,
        card: card !== '' ? true : false,
        digit: digit !== '' ? true : false,
      });
    } else {
      setLoading(true);
      setTimeout(() => {
        navigation.navigate('NHome');
        setLoading(false);
      }, 500)
    }
  };

  const renderContent = () => {
    return (
      <SafeAreaView style={[BaseStyle.safeAreaView]} edges={['right', 'top', 'left']}>
        <View style={{ flex: 1 }}>

          <Header title={t('payment')}
            renderLeft={() => {
              if(!isPaymentRequired) {
                return <Icon name="angle-left" size={20} color={colors.primary} enableRTL={true} />;
              }
            }}
            onPressLeft={() => {
              navigation.goBack();
            }}
          />

          <KeyboardAvoidingView behavior={'height'}>
            <ScrollView>
              <View style={{ flex: 1, padding: 20, paddingBottom: 10 }}>

                {isPaymentRequired && <View style={styles.trialBadge}>
                  <Text headline style={styles.trialText}>{t('trial_end_message')}</Text>
                </View>}

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
                <MonthYearPicker style={{ marginTop: 10 }} onChange={(value) => { }} />
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
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>

        <CardBooking
          loading={loading}
          description={t('total_price')}
          price={user.roles.includes(2) ? '₺359,00' : user.roles.includes(3) ? '₺559,00' : '₺959,00'}
          textButton={t('pay')}
          onPress={() => onPay()}
        />
      </SafeAreaView>
    );
  };

  return renderContent();
};

export default Payment;
