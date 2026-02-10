import { FlatList, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  Button,
  CheckBox,
  Header,
  Icon,
  ModalOption,
  PriceList,
  SafeAreaView,
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
  const { user } = useSelector(state => state.user);
  const [userMemories, setUserMemories] = useState([]);
  const [selectedMemory, setSelectedMemory] = useState(undefined);
  const [showMemoryModal, setShowMemoryModal] = useState(false);

  const data = [
    {
      id: 2,
      name: t('standard'),
      price: "₺359,00/" + t('year'),
      properties: [t('standardProperty1'), t('standardProperty2'), t('standardProperty3'), t('standardProperty4'), t('standardProperty4')]
    },
    {
      id: 3,
      name: t('premium'),
      price: "₺559,00/" + t('year'),
      properties: [t('premiumProperty1'), t('premiumProperty2'), t('premiumProperty3'), t('premiumProperty4'), t('premiumProperty5'), t('premiumProperty6'), t('premiumProperty7')]
    },
    {
      id: 4,
      name: t('ultra'),
      price: "₺959,00/" + t('year'),
      properties: [t('ultraProperty1'), t('ultraProperty2'), t('ultraProperty3'), t('ultraProperty4'), t('ultraProperty5'), t('ultraProperty6'), t('ultraProperty7')]
    }
  ];
  
  useEffect(() => {
    setSelectedPlanId(-1);
    setUseVoucher(false);
    setVoucher('');
    
    if (route?.params?.isStandByPage) {
      setIsStandByPage(route?.params?.isStandByPage);
    }

    if (route?.params?.isProfilePage) {
      setIsProfilePage(route?.params?.isProfilePage);
    }
  }, [route?.params?.isStandByPage, route?.params?.isProfilePage])

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
        <Header title={isStandByPage ? t('purchase_voucher') : t('pricing')}
          renderLeft={() => {
            return <Icon name="angle-left" size={20} color={colors.primary} enableRTL={true} />;
          }}
          onPressLeft={() => {
            navigation.goBack();
          }}
        />

        <View style={{ flex: 1 }}>
          {(!isStandByPage && !isProfilePage) && <View style={{ margin: 10 }}>
            <CheckBox
              color={colors.primary}
              title={t('use_voucher')}
              checked={useVoucher}
              onPress={() => { setUseVoucher(!useVoucher); if(!useVoucher) setVoucher(''); setSelectedPlanId(-1); }}
            />
          </View>}

          {(useVoucher && !isProfilePage && !isStandByPage) && <TextInput
            style={{ margin: 10 }}
            onChangeText={(text) => setVoucher(text)}
            placeholder={t('voucher')}
            value={voucher}
          />}

          {(!useVoucher) && <FlatList
            horizontal={false}
            data={data}
            keyExtractor={(_item, index) => index.toString()}
            renderItem={({ item }) => (
              <PriceList
                item={item}
                isStandByPage={isStandByPage}
                isProfilePage={isProfilePage}
                selected={item.id === selectedPlanId}
                onSelect={() => setSelectedPlanId(item.id)}
                style={{
                  margin: 10,
                }}
              />
            )}
          />}
          <View style={styles.bottomBar}>
            <Button full loading={loading} onPress={() => continueRegister()}>
              {t('continue')}
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
