import {FlatList,TouchableOpacity,View} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  Button,
  CheckBox,
  Header,
  Icon,
  ModalOption,
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
import { getMemoryCountRequest, listMemoryRequest } from '@/apis/memoryApi';
import { useSelector } from 'react-redux';

const Pricing = (props) => {
  const { navigation, route } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [selectedPlanId, setSelectedPlanId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isStandByPage, setIsStandByPage] = useState();
  const [isProfilePage, setIsProfilePage] = useState();
  const [useVoucher, setUseVoucher] = useState(false);
  const [voucher, setVoucher] = useState('');
  const [voucherSuccess, setVoucherSuccess] = useState(true);
  const { user } = useSelector(state => state.user);
  const [userMemories, setUserMemories] = useState([]);
  const [selectedMemory, setSelectedMemory] = useState(undefined);
  const [showMemoryModal, setShowMemoryModal] = useState(false);

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
    
    if (route?.params?.isStandByPage) {
      setIsStandByPage(route?.params?.isStandByPage);
    }

    if (route?.params?.isProfilePage) {
      setIsProfilePage(route?.params?.isProfilePage);
    }
  }, [route?.params?.isStandByPage, route?.params?.isProfilePage])

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

          if(useVoucher&&!isProfilePage&&!isStandByPage){
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
            text2:t('voucher_not_found'),
          });
        }
      })
      .catch(()=>{
        setSelectedPlanId(-1);

        Toast.show({
          type:'error',
          text1:t('error'),
          text2:t('voucher_not_found'),
        });
      })
      .finally(()=>setLoading(false));
  };

  const continueRegister = () => {
    setLoading(true);
    if (!isStandByPage && !isProfilePage) {
      if (useVoucher) {
        if (!isNullOrEmpty(voucher)) {
          voucherControlRequest(voucher).then(response => {
            if (response.isSuccess) {
              setSelectedPlanId(response.data.planId);

              setTimeout(() => {
                setLoading(false);
                if (response.data.planId > 1) {
                  navigation.navigate('SignUp', { voucher: voucher, selectedPlanId: response.data.planId });
                }
              }, 500);
            }
            else {
              setSelectedPlanId(-1);

              Toast.show({
                type: 'error',
                text1: t('error'),
                text2: t('error_file_message'),
              });

              setLoading(false);
            }
          }).catch(error => {
            setSelectedPlanId(-1);

            Toast.show({
              type: 'error',
              text1: t('error'),
              text2: t('error_file_message'),
            });

            setLoading(false);
          })
        }
        else {
          setSelectedPlanId(-1);

          setTimeout(() => {
            setLoading(false);
          }, 500);
        }
      }
      else {
        setTimeout(() => {
          setLoading(false);
          if (selectedPlanId > 1) {
            navigation.navigate('SignUp', { selectedPlanId: selectedPlanId })
          }
        }, 500);
      }
    }
    else {
      if(isStandByPage) {
        setTimeout(() => {
          setLoading(false);
          if (selectedPlanId > 1) {
            navigation.navigate('Payment', { item: { typeId: 3, selectedPlan: selectedPlanId } })
          }
        }, 500);
      }
      else if(isProfilePage) {
        setTimeout(() => {
          setLoading(false);
          if (selectedPlanId > 1) {
            if(user.roles.includes(4)) {
              if(selectedPlanId === 2 || selectedPlanId === 3) {
                getMemoryCountRequest(user.id).then(response => {
                  if(response.isSuccess) {
                    if(response.data <= 1) {
                      navigation.navigate('Payment', { item: { typeId: 4, selectedPlan: selectedPlanId } })
                    }
                    else{
                      listMemoryRequest(1, 10, undefined, undefined, user.id).then(response => {
                        if(response.isSuccess) {
                          console.log("responsee")

                          let list = [];
                          setUserMemories([]);

                          response.data.items.forEach(element => {
                            list.push({ value: element.id + "", text: element.name });
                          });

                          setUserMemories([...list]);
                          setShowMemoryModal(true);
                        }
                        else{
                          setUserMemories([]);
                        }
                      });
                    }
                  }
                });
              }
              else{
                navigation.navigate('Payment', { item: { typeId: 4, selectedPlan: selectedPlanId } })
              }
            }
            else{
              navigation.navigate('Payment', { item: { typeId: 4, selectedPlan: selectedPlanId } })
            }
          }
        }, 500);
      }
    }
  }

  const memoryOptionSelected = (value) => {
    setSelectedMemory(value);
    setShowMemoryModal(false);

    navigation.navigate('Payment',  { item: { typeId: 4, selectedPlan: selectedPlanId, memoryId: parseInt(value.value) } });
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
            data={!useVoucher ? data : []}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <>
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

                  <Text numberOfLines={0} style={styles.title}>
                    {isStandByPage ? t('purchase_voucher') : t('pricing')}
                  </Text>

                  <Text numberOfLines={0} grayColor style={styles.description}>
                    {isStandByPage
                      ? t('gift_voucher_page_description')
                      : t('pricing_page_description')}
                  </Text>
                </View>

                {(!isStandByPage && !isProfilePage) && (
                  <View style={styles.voucherOption}>
            <CheckBox
              color={colors.primary}
              title={t('use_voucher')}
              checked={useVoucher}
              onPress={() => { setUseVoucher(!useVoucher); if(!useVoucher) setVoucher(''); setSelectedPlanId(-1); }}
            />
                  </View>
                )}

                {(useVoucher&&!isProfilePage&&!isStandByPage)&&(
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
                isStandByPage={isStandByPage}
                isProfilePage={isProfilePage}
                selected={item.id === selectedPlanId}
                onSelect={() => setSelectedPlanId(item.id)}
                style={styles.planCard}
              />
            )}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.bottomBar}>
            <Button full loading={loading} onPress={() => continueRegister()}>
              {isStandByPage ? t('purchase_voucher') : t('continue')}
            </Button>
          </View>
        </View>
        {showMemoryModal && userMemories && userMemories.length > 0 && <ModalOption
        value={selectedMemory}
        options={userMemories}
        isVisible={showMemoryModal}
        onSwipeComplete={() => {
          setShowMemoryModal(false);
        }}
        onPress={(value) => {
          memoryOptionSelected(value)
        }}
        onBackdropPress={() => {
          setShowMemoryModal(false)
        }}
      />}
      </SafeAreaView>
    );
  };

  return renderContent();
};

export default Pricing;
