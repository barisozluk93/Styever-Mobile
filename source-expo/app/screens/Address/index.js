import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Header, Icon, Image, SafeAreaView, Text, TextInput, CheckBox } from '@/components';
import { BaseColor, BaseStyle, Images, useTheme } from '@/config';
import styles from './styles';
import { isNullOrEmpty } from '@/utils/utility';
import Toast from 'react-native-toast-message';
import { registerRequest, registerWithVoucherRequest } from '@/apis/authApi';
import { deleteUserAddressRequest, saveUserAddressRequest, updateUserAddressRequest } from '@/apis/userApi';

const successInit = {
  country: true,
  city: true,
  district: true,
  address: true,
  addressHeader: true,
};

const Address = (props) => {
  const { navigation, route } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [success, setSuccess] = useState(successInit);
  const [isPrimary, setIsPrimary] = useState();
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [addressHeader, setAddressHeader] = useState('');
  const [user, setUser] = useState();
  const [item, setItem] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route?.params?.user) {
      setUser(route?.params?.user);
    }
    else if (route?.params?.item) {
      setItem(route?.params?.item);

      setIsPrimary(route?.params?.item.isPrimary)
      setCountry(route?.params?.item.country)
      setCity(route?.params?.item.city)
      setDistrict(route?.params?.item.district)
      setAddress(route?.params?.item.address)
      setAddressHeader(route?.params?.item.addressHeader)
    }
  }, [route?.params?.user, route?.params?.item])

  const onDelete = () => {
    if (item.id > 0) {

      deleteUserAddressRequest(item.id).then(response => {
        if (response.isSuccess) {
          setTimeout(() => {
            Toast.show({
              type: 'success',
              text1: t('success'),
              text2: t('success_message'),
            });

            navigation.goBack();
          }, 500);
        }
        else {
          Toast.show({
            type: 'error',
            text1: t('error'),
            text2: t('error_message'),
          });

        }
      }).catch(error => {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('error_message'),
        });
      })
    }
  }

  const continueRegister = () => {
    if (isNullOrEmpty(country) || isNullOrEmpty(city) || isNullOrEmpty(district) || isNullOrEmpty(address) || isNullOrEmpty(addressHeader)) {
      setSuccess({
        ...success,
        country: !isNullOrEmpty(country) ? true : false,
        city: !isNullOrEmpty(city) ? true : false,
        district: !isNullOrEmpty(district) ? true : false,
        address: !isNullOrEmpty(address) ? true : false,
        addressHeader: !isNullOrEmpty(addressHeader) ? true : false,
      });
    } else {
      setLoading(true);

      if (user) {
        var userAddress = { id: 0, isDeleted: false, city: city, country: country, district: district, address: address, addressHeader: addressHeader, isPrimary: isPrimary };
        user.userAddress = userAddress;

        console.log(user.voucher)
        if (user.voucher) {
          registerWithVoucherRequest(user).then(response => {
            if (response.isSuccess) {
              setTimeout(() => {
                setLoading(false);
                Toast.show({
                  type: 'success',
                  text1: t('success'),
                  text2: t('success_message'),
                });

                navigation.navigate('SignIn');
              }, 500);
            }
            else {
              Toast.show({
                type: 'error',
                text1: t('error'),
                text2: t('error_message'),
              });

              setLoading(false);
            }
          }).catch(error => {
            Toast.show({
              type: 'error',
              text1: t('error'),
              text2: t('error_message'),
            });

            setLoading(false);
          })
        }
        else {
          registerRequest(user).then(response => {
            if (response.isSuccess) {
              setTimeout(() => {
                setLoading(false);
                Toast.show({
                  type: 'success',
                  text1: t('success'),
                  text2: t('success_message'),
                });

                navigation.navigate('SignIn');
              }, 500);
            }
            else {
              Toast.show({
                type: 'error',
                text1: t('error'),
                text2: t('error_message'),
              });

              setLoading(false);
            }
          }).catch(error => {
            Toast.show({
              type: 'error',
              text1: t('error'),
              text2: t('error_message'),
            });

            setLoading(false);
          })
        }
      }
      else {
        if (item.id > 0) {
          item.country = country;
          item.district = district;
          item.city = city;
          item.address = address;
          item.addressHeader = addressHeader;
          item.isPrimary = isPrimary;

          updateUserAddressRequest(item).then(response => {
            if (response.isSuccess) {
              setTimeout(() => {
                setLoading(false);
                Toast.show({
                  type: 'success',
                  text1: t('success'),
                  text2: t('success_message'),
                });

                navigation.goBack();
              }, 500);
            }
            else {
              Toast.show({
                type: 'error',
                text1: t('error'),
                text2: t('error_message'),
              });

              setLoading(false);
            }
          }).catch(error => {
            Toast.show({
              type: 'error',
              text1: t('error'),
              text2: t('error_message'),
            });

            setLoading(false);
          })
        }
        else {
          item.country = country;
          item.district = district;
          item.city = city;
          item.address = address;
          item.addressHeader = addressHeader;

          saveUserAddressRequest(item).then(response => {
            if (response.isSuccess) {
              setTimeout(() => {
                setLoading(false);
                Toast.show({
                  type: 'success',
                  text1: t('success'),
                  text2: t('success_message'),
                });

                navigation.goBack();
              }, 500);
            }
            else {
              Toast.show({
                type: 'error',
                text1: t('error'),
                text2: t('error_message'),
              });

              setLoading(false);
            }
          }).catch(error => {
            Toast.show({
              type: 'error',
              text1: t('error'),
              text2: t('error_message'),
            });

            setLoading(false);
          })
        }
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
        title={t('address_info')}
        renderLeft={() => {
          return <Icon name="angle-left" size={20} color={colors.primary} enableRTL={true} />;
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        renderRight={() => {
          if (route?.params?.item && route?.params?.item.id > 0) {
            return <Text headline primaryColor>{t('remove')}</Text>;
          }
        }}
        onPressRight={() => {
          onDelete();
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
            <CheckBox
              color={colors.primaryLight}
              title={t('primary')}
              checked={user ? true : (isPrimary === true)}
              disabled={user ? true : false}
              onPress={() => setIsPrimary(isPrimary === true ? false : true)}
            />

            <TextInput
              style={[styles.textInput, { marginTop: 10 }]}
              onChangeText={(text) => setCountry(text)}
              autoCorrect={false}
              placeholder={t('country')}
              placeholderTextColor={success.country ? BaseColor.grayColor : colors.primary}
              value={country}
            />
            <TextInput
              style={[styles.textInput, { marginTop: 10 }]}
              onChangeText={(text) => setCity(text)}
              autoCorrect={false}
              placeholder={t('city')}
              placeholderTextColor={success.city ? BaseColor.grayColor : colors.primary}
              value={city}
            />
            <TextInput
              style={[styles.textInput, { marginTop: 10 }]}
              onChangeText={(text) => setDistrict(text)}
              autoCorrect={false}
              placeholder={t('district')}
              placeholderTextColor={success.district ? BaseColor.grayColor : colors.primary}
              value={district}
            />
            <TextInput
              style={[styles.textInput, { marginTop: 10, height: 100 }]}
              onChangeText={(text) => setAddress(text)}
              autoCorrect={false}
              placeholder={t('address')}
              multiline
              scrollEnabled
              placeholderTextColor={success.address ? BaseColor.grayColor : colors.primary}
              value={address}
            />
            <TextInput
              style={[BaseStyle.textInput, { marginTop: 10 }]}
              onChangeText={(text) => setAddressHeader(text)}
              autoCorrect={false}
              placeholder={t('address_header')}
              placeholderTextColor={success.addressHeader ? BaseColor.grayColor : colors.primary}
              value={addressHeader}
            />
            <View style={{ width: '100%' }}>
              <Button full style={{ marginTop: 20 }} loading={loading} onPress={() => continueRegister()}>
                {t('save')}
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
};

export default Address;
