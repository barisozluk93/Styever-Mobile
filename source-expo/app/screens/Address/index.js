import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Header,
  Icon,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  CheckBox,
} from '@/components';
import { BaseColor, BaseStyle, useTheme } from '@/config';
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
              text2: t('address_delete_success'),
            });

            navigation.goBack();
          }, 500);
        }
        else {
          Toast.show({
            type: 'error',
            text1: t('error'),
            text2: response?.message || t('address_delete_error'),
          });

        }
      }).catch(error => {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: error?.response?.data?.message || t('address_delete_error'),
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
                  text2: t('registration_success'),
                });

                navigation.navigate('SignIn');
              }, 500);
            }
            else {
              Toast.show({
                type: 'error',
                text1: t('error'),
                text2: response?.message || t('registration_error'),
              });

              setLoading(false);
            }
          }).catch(error => {
            Toast.show({
              type: 'error',
              text1: t('error'),
              text2: error?.response?.data?.message || t('registration_error'),
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
                  text2: t('registration_success'),
                });

                navigation.navigate('SignIn');
              }, 500);
            }
            else {
              Toast.show({
                type: 'error',
                text1: t('error'),
                text2: response?.message || t('registration_error'),
              });

              setLoading(false);
            }
          }).catch(error => {
            Toast.show({
              type: 'error',
              text1: t('error'),
              text2: error?.response?.data?.message || t('registration_error'),
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
                  text2: t('address_update_success'),
                });

                navigation.goBack();
              }, 500);
            }
            else {
              Toast.show({
                type: 'error',
                text1: t('error'),
                text2: response?.message || t('address_update_error'),
              });

              setLoading(false);
            }
          }).catch(error => {
            Toast.show({
              type: 'error',
              text1: t('error'),
              text2: error?.response?.data?.message || t('address_update_error'),
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
                  text2: t('address_add_success'),
                });

                navigation.goBack();
              }, 500);
            }
            else {
              Toast.show({
                type: 'error',
                text1: t('error'),
                text2: response?.message || t('address_add_error'),
              });

              setLoading(false);
            }
          }).catch(error => {
            Toast.show({
              type: 'error',
              text1: t('error'),
              text2: error?.response?.data?.message || t('address_add_error'),
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
    <SafeAreaView style={BaseStyle.safeAreaView} edges={['right','top','left']}>
      <Header title="" renderLeft={()=><Icon name="angle-left" size={20} color={colors.primary} enableRTL/>} onPressLeft={()=>navigation.goBack()} renderRight={()=>route?.params?.item?.id>0?<Text headline primaryColor>{t('remove')}</Text>:null} onPressRight={onDelete}/>
      <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} keyboardVerticalOffset={offsetKeyboard} style={styles.flex}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>
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
              {t('address_info')}
            </Text>

            <Text numberOfLines={0} grayColor style={styles.description}>
              {t('address_page_description')}
            </Text>
          </View>
          <View style={styles.primaryRow}><CheckBox color={colors.primaryLight} title={t('primary')} checked={user?true:isPrimary===true} disabled={!!user} onPress={()=>setIsPrimary(isPrimary!==true)}/></View>
          <Text style={styles.label}>{t('country')}</Text><TextInput style={styles.input} iconLeft={<Icon name="location-dot" size={18} color={BaseColor.grayColor} style={styles.inputIcon}/>} onChangeText={text=>{setCountry(text);if(!isNullOrEmpty(text))setSuccess(prev=>({...prev,country:true}));}} placeholder={t('country')} success={success.country} value={country}/>{!success.country&&<Text style={styles.errorField}>{t('required_field')}</Text>}
          <View style={styles.row}><View style={styles.half}><Text style={styles.label}>{t('city')}</Text><TextInput style={styles.input} iconLeft={<Icon name="map-location-dot" size={18} color={BaseColor.grayColor} style={styles.inputIcon}/>} onChangeText={text=>{setCity(text);if(!isNullOrEmpty(text))setSuccess(prev=>({...prev,city:true}));}} placeholder={t('city')} success={success.city} value={city}/>{!success.city&&<Text style={styles.errorField}>{t('required_field')}</Text>}</View><View style={styles.gap}/><View style={styles.half}><Text style={styles.label}>{t('district')}</Text><TextInput style={styles.input} iconLeft={<Icon name="location-dot" size={18} color={BaseColor.grayColor} style={styles.inputIcon}/>} onChangeText={text=>{setDistrict(text);if(!isNullOrEmpty(text))setSuccess(prev=>({...prev,district:true}));}} placeholder={t('district')} success={success.district} value={district}/>{!success.district&&<Text style={styles.errorField}>{t('required_field')}</Text>}</View></View>
          <Text style={styles.label}>{t('address_header')}</Text><TextInput style={styles.input} iconLeft={<Icon name="house" size={18} color={BaseColor.grayColor} style={styles.inputIcon}/>} onChangeText={text=>{setAddressHeader(text);if(!isNullOrEmpty(text))setSuccess(prev=>({...prev,addressHeader:true}));}} placeholder={t('address_header')} success={success.addressHeader} value={addressHeader}/>{!success.addressHeader&&<Text style={styles.errorField}>{t('required_field')}</Text>}
          <Text style={styles.label}>{t('address')}</Text><TextInput style={styles.addressInput} inputStyle={styles.addressInner} iconLeft={<Icon name="location-dot" size={18} color={BaseColor.grayColor} style={styles.inputIconTop}/>} onChangeText={text=>{setAddress(text);if(!isNullOrEmpty(text))setSuccess(prev=>({...prev,address:true}));}} placeholder={t('address')} multiline textAlignVertical="top" success={success.address} value={address}/>{!success.address&&<Text style={styles.errorField}>{t('required_field')}</Text>}
          <Button full style={styles.saveButton} loading={loading} onPress={continueRegister}>{t('save')}</Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Address;
