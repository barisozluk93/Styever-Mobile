import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
} from 'react-native';
import { BaseStyle, useTheme } from '@/config';
import { CardBooking, Header, Icon, SafeAreaView, Text, TextInput } from '@/components';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { isNullOrEmpty } from '@/utils/utility';
import { addGiftRequest, buyPackageRequest, payRequest } from '@/apis/userApi';
import Toast from 'react-native-toast-message';
import { logout } from '@/actions/auth';
import { updateCandleRequest } from '@/apis/memoryApi';

const Payment = (props) => {
  const { navigation, route } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [cardNo, setCardNo] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [fullname, setFullname] = useState('');
  const [cvv, setCvv] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(0);
  const [item, setItem] = useState();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const { isPaymentRequired } = useSelector(state => state.auth);

  const [success, setSuccess] = useState({
    fullname: true,
    cardNo: true,
    cvv: true,
    expiryDate: true,
    senderEmail: true,
    receiverEmail: true,
    message: true
  });

  useEffect(() => {
    if (item) {
      if (item.typeId === 1) {
        if (user.roles.includes(2)) {
          setPrice(359.00);
        }
        else if (user.roles.includes(3)) {
          setPrice(559.00);
        }
        else if (user.roles.includes(4)) {
          setPrice(959.00);
        }
      }
      else if (item.typeId === 2) {
        setPrice(item.data.donation);
      }
      else if (item.typeId === 3) {
        if (item.selectedPlan === 2) {
          setPrice(359.00);
        }
        else if (item.selectedPlan === 3) {
          setPrice(559.00);
        }
        else if (item.selectedPlan === 4) {
          setPrice(959.00);
        }
      }
      else if (item.typeId === 4) {
        if (item.selectedPlan === 2) {
          setPrice(359.00);
        }
        else if (item.selectedPlan === 3) {
          setPrice(559.00);
        }
        else if (item.selectedPlan === 4) {
          setPrice(959.00);
        }
      }
    }
  }, [item])

  useEffect(() => {
    if (route?.params?.item) {
      setItem(route?.params?.item);
    }
  }, [route?.params?.item])

  const onPay = () => {
    if (item.typeId === 1) {
      if (isNullOrEmpty(fullname) || isNullOrEmpty(cardNo) || isNullOrEmpty(cvv) || isNullOrEmpty(expiryDate)) {
        setSuccess({
          ...success,
          fullname: !isNullOrEmpty(fullname) ? true : false,
          cardNo: !isNullOrEmpty(cardNo) ? true : false,
          cvv: !isNullOrEmpty(cvv) ? true : false,
          expiryDate: !isNullOrEmpty(expiryDate) ? true : false,
          receiverEmail: true,
          message: true,
          senderEmail: true,
        });
      } else {
        setLoading(true);
        payRequest(user.id).then(response => {
          if (response.isSuccess) {
            setFullname('');
            setCardNo('');
            setExpiryDate('');
            setCvv('');
            setSenderEmail('');
            setReceiverEmail('');
            setMessage('');

            setSuccess({
              ...success,
              cardNo: true,
              fullname: true,
              message: true,
              senderEmail: true,
              receiverEmail: true,
              expiryDate: true,
              cvv: true
            });

            Toast.show({
              type: 'success',
              text1: t('success'),
              text2: t('success_message'),
            });


            setTimeout(() => {
              setLoading(false);
              dispatch(logout());
              dispatch({ type: "USER_INIT" });

              navigation.navigate('NHome');
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
    }
    else if (item.typeId === 2) {
      if (isNullOrEmpty(fullname) || isNullOrEmpty(cardNo) || isNullOrEmpty(cvv) || isNullOrEmpty(expiryDate)) {
        setSuccess({
          ...success,
          fullname: !isNullOrEmpty(fullname) ? true : false,
          cardNo: !isNullOrEmpty(cardNo) ? true : false,
          cvv: !isNullOrEmpty(cvv) ? true : false,
          expiryDate: !isNullOrEmpty(expiryDate) ? true : false,
          receiverEmail: true,
          message: true,
          senderEmail: true,
        });
      } else {
        setLoading(true);
        updateCandleRequest(item.data).then(response => {
          if (response.isSuccess) {

            setFullname('');
            setCardNo('');
            setExpiryDate('');
            setCvv('');
            setSenderEmail('');
            setReceiverEmail('');
            setMessage('');

            setSuccess({
              ...success,
              cardNo: true,
              fullname: true,
              message: true,
              senderEmail: true,
              receiverEmail: true,
              expiryDate: true,
              cvv: true
            });

            Toast.show({
              type: 'success',
              text1: t('success'),
              text2: t('success_message'),
            });


            setTimeout(() => {
              setLoading(false);
              navigation.goBack();
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
    }
    else if (item.typeId === 3) {
      if (isNullOrEmpty(fullname) || isNullOrEmpty(cardNo) || isNullOrEmpty(cvv) || isNullOrEmpty(expiryDate) || isNullOrEmpty(receiverEmail) || isNullOrEmpty(message) || (!user && isNullOrEmpty(senderEmail))) {
        setSuccess({
          ...success,
          fullname: !isNullOrEmpty(fullname) ? true : false,
          cardNo: !isNullOrEmpty(cardNo) ? true : false,
          cvv: !isNullOrEmpty(cvv) ? true : false,
          expiryDate: !isNullOrEmpty(expiryDate) ? true : false,
          receiverEmail: !isNullOrEmpty(receiverEmail) ? true : false,
          message: !isNullOrEmpty(message) ? true : false,
          senderEmail: !isNullOrEmpty(senderEmail) ? true : false,
        });
      } else {
        setLoading(true);
        addGiftRequest(fullname, cardNo, expiryDate, cvv, user ? user.id : undefined, senderEmail, receiverEmail, message, item.selectedPlan, price).then(response => {
          if (response.isSuccess) {

            setFullname('');
            setCardNo('');
            setExpiryDate('');
            setCvv('');
            setSenderEmail('');
            setReceiverEmail('');
            setMessage('');

            setSuccess({
              ...success,
              cardNo: true,
              fullname: true,
              message: true,
              senderEmail: true,
              receiverEmail: true,
              expiryDate: true,
              cvv: true
            });

            Toast.show({
              type: 'success',
              text1: t('success'),
              text2: t('success_message'),
            });


            setTimeout(() => {
              setLoading(false);
              navigation.goBack();
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
    }
    else if (item.typeId === 4) {
      if (isNullOrEmpty(fullname) || isNullOrEmpty(cardNo) || isNullOrEmpty(cvv) || isNullOrEmpty(expiryDate)) {
        setSuccess({
          ...success,
          fullname: !isNullOrEmpty(fullname) ? true : false,
          cardNo: !isNullOrEmpty(cardNo) ? true : false,
          cvv: !isNullOrEmpty(cvv) ? true : false,
          expiryDate: !isNullOrEmpty(expiryDate) ? true : false,
          receiverEmail: true,
          message: true,
          senderEmail: true,
        });
      } else {
        setLoading(true);
        buyPackageRequest(user.id, item.selectedPlan, item.memoryId ? item.memoryId : 0).then(response => {
          if (response.isSuccess) {
            setFullname('');
            setCardNo('');
            setExpiryDate('');
            setCvv('');
            setSenderEmail('');
            setReceiverEmail('');
            setMessage('');

            setSuccess({
              ...success,
              cardNo: true,
              fullname: true,
              message: true,
              senderEmail: true,
              receiverEmail: true,
              expiryDate: true,
              cvv: true
            });

            Toast.show({
              type: 'success',
              text1: t('success'),
              text2: t('success_message'),
            });


            setTimeout(() => {
              setLoading(false);
              dispatch(logout());
              dispatch({ type: "USER_INIT" });

              navigation.navigate('NHome');
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
    }
  };

  const handleCardNoChange = (text) => {
    // sadece rakam
    let cleaned = text.replace(/\D/g, "");

    // max 16 (Amex ayrı)
    if (cleaned.startsWith("34") || cleaned.startsWith("37")) {
      cleaned = cleaned.slice(0, 15);
    } else {
      cleaned = cleaned.slice(0, 16);
    }

    // boşluklu format
    if (cleaned.length <= 15 && (cleaned.startsWith("34") || cleaned.startsWith("37"))) {
      // AMEX → 4-6-5
      cleaned = cleaned
        .replace(/^(\d{4})(\d{6})(\d{0,5})/, "$1 $2 $3")
        .trim();
    }

    // Visa / Master → 4-4-4-4
    cleaned = cleaned
      .replace(/(\d{4})/g, "$1 ")
      .trim();

    setCardNo(cleaned);
  };

  const handleExpiryChange = (text) => {
    // Sadece rakam
    let cleaned = text.replace(/\D/g, "");

    // Max 4 hane
    if (cleaned.length > 4) return;

    // Ay kontrolü
    if (cleaned.length >= 2) {
      const month = cleaned.substring(0, 2);
      if (parseInt(month, 10) > 12) return;
    }

    // MM / YY formatı
    if (cleaned.length > 2) {
      cleaned = `${cleaned.substring(0, 2)} / ${cleaned.substring(2)}`;
    }

    setExpiryDate(cleaned);
  };

  const handleCvvChange = (text) => {
    // sadece rakam
    const cleaned = text.replace(/\D/g, "");

    // max 3 (Visa / Master)
    if (cleaned.length <= 3) {
      setCvv(cleaned);
    }
  };

  const renderContent = () => {
    return (
      <SafeAreaView style={[BaseStyle.safeAreaView]} edges={['right', 'top', 'left']}>
        <View style={{ flex: 1 }}>

          <Header title={t('payment')}
            renderLeft={() => {
              if (!isPaymentRequired) {
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

                {item && item.typeId === 3 && !user && <TextInput
                  style={{ marginTop: 10 }}
                  onChangeText={(text) => setSenderEmail(text)}
                  placeholder={t('sender_email')}
                  success={success.senderEmail}
                  value={senderEmail}
                />}
                {item && item.typeId === 3 && <TextInput
                  style={{ marginTop: 10 }}
                  onChangeText={(text) => setReceiverEmail(text)}
                  placeholder={t('receiver_email')}
                  success={success.receiverEmail}
                  value={receiverEmail}
                />}
                {item && item.typeId === 3 && <TextInput
                  style={{ marginTop: 10 }}
                  onChangeText={(text) => setMessage(text)}
                  placeholder={t('message')}
                  success={success.message}
                  value={message}
                />}
                <TextInput
                  style={{ marginTop: 10 }}
                  onChangeText={(text) => setFullname(text)}
                  placeholder={t('name_on_card')}
                  success={success.fullname}
                  value={fullname}
                />
                <TextInput
                  style={{ marginTop: 10 }}
                  onChangeText={handleCardNoChange}
                  placeholder={t('credit_card_number')}
                  success={success.cardNo}
                  keyboardType="numeric"
                  value={cardNo}
                  maxLength={19}
                />
                <TextInput
                  value={expiryDate}
                  onChangeText={handleExpiryChange}
                  placeholder={t('expiry')}
                  keyboardType="number-pad"
                  success={success.expiryDate}
                  maxLength={7}
                  style={{
                    marginTop: 10,
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    alignItems: 'center',
                  }}
                >
                  <View style={{ flex: 3.5 }}>
                    <TextInput
                      onChangeText={handleCvvChange}
                      placeholder={t('digit_num')}
                      success={success.cvv}
                      keyboardType="numeric"
                      value={cvv}
                      secureTextEntry
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
          price={price + ' ₺'}
          textButton={t('pay')}
          onPress={() => onPay()}
        />
      </SafeAreaView>
    );
  };

  return renderContent();
};

export default Payment;
