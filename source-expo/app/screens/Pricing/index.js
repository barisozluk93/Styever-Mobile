import {FlatList,TouchableOpacity,View} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  Button,
  CheckBox,
  Header,
  Icon,
  Image,
  PriceList,
  SafeAreaView,
  Text,
  TextInput,
} from '@/components';
import { BaseColor, BaseStyle, useTheme } from '@/config';
import styles from './styles';
import { useEffect, useState } from 'react';
import { isNullOrEmpty } from '@/utils/utility';
import { voucherControlRequest } from '@/apis/userApi';
import Toast from 'react-native-toast-message';

const Pricing = (props) => {
  const { navigation, route } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [selectedPlanId, setSelectedPlanId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [useVoucher, setUseVoucher] = useState(false);
  const [voucher, setVoucher] = useState('');
  const [voucherSuccess, setVoucherSuccess] = useState(true);

  const data = [
    {
      id: 2,
      name: t('standard'),
      price: "₺499,00/" + t('year'),
      properties: [
        t('standardProperty1'),
        t('standardProperty2'),
        t('standardProperty3'),
        t('standardProperty5'),
      ],
    },
    {
      id: 3,
      name: t('premium'),
      price: "₺699,00/" + t('year'),
      preferred: true,
      properties: [
        t('premiumProperty1'),
        t('premiumProperty2'),
        t('premiumProperty3'),
        t('premiumProperty4'),
        t('premiumProperty5'),
        t('premiumProperty7'),
      ],
    },
    {
      id: 4,
      name: t('ultra'),
      price: "₺1299,00/" + t('year'),
      properties: [
        t('ultraProperty1'),
        t('ultraProperty2'),
        t('ultraProperty3'),
        t('ultraProperty4'),
        t('ultraProperty5'),
        t('ultraProperty7'),
      ],
    },
  ];
  
  useEffect(() => {
    setSelectedPlanId(-1);
    setUseVoucher(false);
    setVoucher('');
    setVoucherSuccess(true);
  }, [route?.params]);

  const searchVoucher=()=>{
    if(isNullOrEmpty(voucher)){
      setSelectedPlanId(-1);
      setVoucherSuccess(false);
      return;
    }

    setVoucherSuccess(true);

    setLoading(true);

    voucherControlRequest(voucher)
      .then(response=>{
        if(response?.isSuccess&&response?.data?.planId>1){
          setSelectedPlanId(response.data.planId);

          Toast.show({
            type:'success',
            text1:t('success'),
            text2:t('voucher_found'),
          });

          if(useVoucher){
            setTimeout(()=>{
              navigation.navigate('SignUp',{
                voucher:voucher,
                selectedPlanId:response.data.planId,
              });
            },500);
          }
        }
        else{
          setSelectedPlanId(-1);

          Toast.show({
            type:'error',
            text1:t('error'),
            text2:response?.message || t('voucher_not_found'),
          });
        }
      })
      .catch((error)=>{
        setSelectedPlanId(-1);

        Toast.show({
          type:'error',
          text1:t('error'),
          text2:error?.response?.data?.message || t('voucher_check_error'),
        });
      })
      .finally(()=>setLoading(false));
  };

  const continueRegister=()=>{
    setLoading(true);

    if(useVoucher){
      if(isNullOrEmpty(voucher)){
        setVoucherSuccess(false);
        setSelectedPlanId(-1);
        setLoading(false);
        return;
      }

      voucherControlRequest(voucher)
        .then(response=>{
          if(response?.isSuccess&&response?.data?.planId>1){
            navigation.navigate('SignUp',{
              voucher,
              selectedPlanId:response.data.planId,
            });
          }
          else{
            setSelectedPlanId(-1);
            Toast.show({
              type:'error',
              text1:t('error'),
              text2:response?.message||t('voucher_check_error'),
            });
          }
        })
        .catch(error=>{
          setSelectedPlanId(-1);
          Toast.show({
            type:'error',
            text1:t('error'),
            text2:error?.response?.data?.message||t('voucher_check_error'),
          });
        })
        .finally(()=>setLoading(false));
      return;
    }

    setLoading(false);
    if(selectedPlanId>1){
      navigation.navigate('SignUp',{selectedPlanId});
    }
  };

  const renderContent = () => {
    return (
      <SafeAreaView style={[BaseStyle.safeAreaView]} edges={['right', 'top', 'left']}>
        <Header title=""
          renderLeft={() => {
            return <Icon name="angle-left" size={20} color={colors.primary} enableRTL={true} />;
          }}
          onPressLeft={() => {
            navigation.goBack();
          }}
        />

        <View style={{ flex: 1 }}>
          <FlatList
            data={!useVoucher?data:[]}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <>
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

                  <Text numberOfLines={0} style={styles.title}>
                    {t('pricing')}
                  </Text>

                  <Text numberOfLines={0} grayColor style={styles.description}>
                    {t('pricing_page_description')}
                  </Text>
                </View>

                <View style={styles.voucherOption}>
            <CheckBox
              color={colors.primary}
              title={t('use_voucher')}
              checked={useVoucher}
              onPress={() => { setUseVoucher(!useVoucher); if(!useVoucher) setVoucher(''); setSelectedPlanId(-1); }}
            />
                  </View>

                {useVoucher&&(
                  <View style={styles.voucherGroup}>
                    <View style={styles.voucherInputWrap}>
                    <TextInput
                      style={styles.voucherInput}
                      iconLeft={
                        <Icon
                          name="ticket"
                          size={18}
                          color={BaseColor.grayColor}
                        />
                      }
                      onChangeText={text=>{
                        setVoucher(text);
                        setVoucherSuccess(!isNullOrEmpty(text));
                        setSelectedPlanId(-1);
                      }}
                      placeholder={t('voucher')}
                      value={voucher}
                      autoCapitalize="characters"
                      success={voucherSuccess}
                    />
                    {!voucherSuccess&&<Text style={styles.error}>{t('required_field')}</Text>}
                    </View>

                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={[
                        styles.voucherSearchButton,
                        {backgroundColor:colors.primary},
                      ]}
                      onPress={searchVoucher}
                      disabled={loading}
                    >
                      <Icon
                        name="magnifying-glass"
                        size={17}
                        color="#FFFFFF"
                      />
                    </TouchableOpacity>
                  </View>                  
                )}
              </>
            }
            renderItem={({item}) => (
              <PriceList
                item={item}
                isStandByPage={false}
                isProfilePage={false}
                selected={item.id === selectedPlanId}
                onSelect={() => setSelectedPlanId(item.id)}
                style={styles.planCard}
              />
            )}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.bottomBar}>
            <Button full loading={loading} onPress={() => continueRegister()}>
              {t('continue')}
            </Button>
          </View>
        </View>
      </SafeAreaView>
    );
  };

  return renderContent();
};

export default Pricing;
