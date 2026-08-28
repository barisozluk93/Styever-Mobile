import { FlatList, Platform, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as RNIap from 'react-native-iap';
import {
  Button,
  CheckBox,
  Header,
  Icon,
  Image,
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
import { getPlansRequest } from '@/apis/planApi';

const Pricing = (props) => {
  const { navigation, route } = props;
  const { t, i18n } = useTranslation();
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
  const [plans, setPlans] = useState([]);
  const [applePrices, setApplePrices] = useState({});

  const isIOS = Platform.OS === 'ios';

  const APPLE_PRODUCTS = {
    2: 'com.styever.origin.yearly',
    3: 'com.styever.heart.yearly',
    4: 'com.styever.family.yearly',
  };

  const parseProperties = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean);

    const text = String(value).trim();
    if (!text) return [];

    try {
      const json = JSON.parse(text);
      if (Array.isArray(json)) {
        return json.map(x => String(x).trim()).filter(Boolean);
      }
    } catch (_) { }

    return text
      .split(/\r?\n|\|/)
      .map(x => x.replace(/^[-•✓]+\s*/, '').trim())
      .filter(Boolean);
  };

  const formatDbPrice = (plan) => {
    const isEnglish = String(i18n.language || 'tr').toLowerCase().startsWith('en');
    const amount = Number(plan?.price || 0);
    const currency = String(plan?.currency || 'TRY').toUpperCase();
    const period = isEnglish ? (plan?.periodEn || plan?.period) : (plan?.period || plan?.periodEn);
    const symbol = currency === 'TRY' || currency === 'TL' ? '₺' : currency;
    const locale = isEnglish ? 'en-US' : 'tr-TR';
    const formatted = amount.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return `${symbol}${formatted}${period ? `/${period}` : ''}`;
  };

  const data = plans.map((plan) => {
    const isEnglish = String(i18n.language || 'tr').toLowerCase().startsWith('en');
    const productId = APPLE_PRODUCTS[plan.id];

    return {
      id: plan.id,
      name: isEnglish ? (plan.nameEn || plan.name) : (plan.name || plan.nameEn),
      price: isIOS
        ? (applePrices[productId] || t('APPLE_IAP.PRICE_LOADING'))
        : formatDbPrice(plan),
      preferred: !!plan.isPopular,
      properties: parseProperties(
        isEnglish
          ? (plan.propertiesEn || plan.properties)
          : (plan.properties || plan.propertiesEn),
      ),
    };
  });

  useEffect(() => {
    let mounted = true;

    getPlansRequest()
      .then(response => {
        if (!mounted) return;

        if (!response?.isSuccess) {
          throw new Error(response?.message || t('error'));
        }

        const list = response?.data || response?.Data || [];
        setPlans(
          (Array.isArray(list) ? list : [])
            .filter(plan => !plan?.isDeleted && APPLE_PRODUCTS[plan?.id])
            .sort((a, b) => (a?.sortOrder || 0) - (b?.sortOrder || 0)),
        );
      })
      .catch(error => {
        console.log('Pricing plan load error:', error);
        if (mounted) setPlans([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isIOS) return undefined;

    let mounted = true;

    const loadApplePrices = async () => {
      try {
        const skus = Object.values(APPLE_PRODUCTS);
        await RNIap.initConnection();

        let products = [];

        if (typeof RNIap.fetchProducts === 'function') {
          const subscriptionProducts = await RNIap.fetchProducts({
            skus,
            type: 'subs',
          }).catch(error => {
            console.log('[Pricing Apple IAP] subs fetch error:', error);
            return [];
          });

          products = (Array.isArray(subscriptionProducts)
            ? subscriptionProducts
            : []).map(product => ({
              ...product,
              __iapType: 'subs',
            }));
        }
        else {
          products = await RNIap.getProducts(skus);
        }

        if (!mounted) return;

        const uniqueProducts = Array.from(
          new Map(
            (Array.isArray(products) ? products : []).map(product => [
              product?.id || product?.productId,
              product,
            ]),
          ).values(),
        ).filter(product => product?.id || product?.productId);

        console.log('[Pricing Apple IAP] products:', uniqueProducts.map(product => ({
          id: product?.id || product?.productId,
          displayPrice: product?.displayPrice,
          localizedPrice: product?.localizedPrice,
          price: product?.price,
          currency: product?.currency,
          currencyCode: product?.currencyCode,
          fetchedAs: product?.__iapType,
          nativeType: product?.type,
        })));

        const nextPrices = {};
        uniqueProducts.forEach(product => {
          const id = product?.id || product?.productId;
          const displayPrice = product?.displayPrice || product?.localizedPrice;
          if (id && displayPrice) nextPrices[id] = displayPrice;
        });

        setApplePrices(nextPrices);
      }
      catch (error) {
        console.log('[Pricing Apple IAP] price fetch error:', error);
      }
    };

    loadApplePrices();

    return () => {
      mounted = false;
      RNIap.endConnection().catch(() => { });
    };
  }, [isIOS]);

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

  const searchVoucher = () => {
    if (isNullOrEmpty(voucher)) {
      setSelectedPlanId(-1);
      setVoucherSuccess(false);
      return;
    }

    setVoucherSuccess(true);

    setLoading(true);

    voucherControlRequest(voucher)
      .then(response => {
        if (response?.isSuccess && response?.data?.planId > 1) {
          setSelectedPlanId(response.data.planId);

          Toast.show({
            type: 'success',
            text1: t('success'),
            text2: t('voucher_found'),
          });

          if (useVoucher && !isProfilePage && !isStandByPage) {
            setTimeout(() => {
              navigation.navigate('SignUp', {
                voucher: voucher,
                selectedPlanId: response.data.planId,
              });
            }, 500);
          }
        }
        else {
          setSelectedPlanId(-1);

          Toast.show({
            type: 'error',
            text1: t('error'),
            text2: response?.message || t('voucher_not_found'),
          });
        }
      })
      .catch((error) => {
        setSelectedPlanId(-1);

        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: error?.response?.data?.message || t('voucher_check_error'),
        });
      })
      .finally(() => setLoading(false));
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
                text2: response?.message || t('voucher_check_error'),
              });

              setLoading(false);
            }
          }).catch(error => {
            setSelectedPlanId(-1);

            Toast.show({
              type: 'error',
              text1: t('error'),
              text2: error?.response?.data?.message || t('voucher_check_error'),
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
      if (isStandByPage) {
        setTimeout(() => {
          setLoading(false);
          if (selectedPlanId > 1) {
            navigation.navigate('Payment', { item: { typeId: 3, paymentFlow: 'Gift', selectedPlan: selectedPlanId } })
          }
        }, 500);
      }
      else if (isProfilePage) {
        setTimeout(() => {
          setLoading(false);
          if (selectedPlanId > 1) {
            if (user.roles.includes(4)) {
              if (selectedPlanId === 2 || selectedPlanId === 3) {
                getMemoryCountRequest(user.id).then(response => {
                  if (response.isSuccess) {
                    if (response.data <= 1) {
                      navigation.navigate('Payment', { item: { typeId: 4, paymentFlow: 'Package', selectedPlan: selectedPlanId } })
                    }
                    else {
                      listMemoryRequest(1, 10, undefined, undefined, user.id).then(response => {
                        if (response.isSuccess) {
                          console.log("responsee")

                          let list = [];
                          setUserMemories([]);

                          response.data.items.forEach(element => {
                            list.push({ value: element.id + "", text: element.name });
                          });

                          setUserMemories([...list]);
                          setShowMemoryModal(true);
                        }
                        else {
                          setUserMemories([]);
                        }
                      });
                    }
                  }
                });
              }
              else {
                navigation.navigate('Payment', { item: { typeId: 4, paymentFlow: 'Package', selectedPlan: selectedPlanId } })
              }
            }
            else {
              navigation.navigate('Payment', { item: { typeId: 4, paymentFlow: 'Package', selectedPlan: selectedPlanId } })
            }
          }
        }, 500);
      }
    }
  }

  const memoryOptionSelected = (value) => {
    setSelectedMemory(value);
    setShowMemoryModal(false);

    navigation.navigate('Payment', { item: { typeId: 4, paymentFlow: 'Package', selectedPlan: selectedPlanId, memoryId: parseInt(value.value) } });
  };

  const renderContent = () => {
    return (
      <SafeAreaView style={[BaseStyle.safeAreaView]} edges={['right', 'top', 'left']}>
        <Header title=""
          renderLeft={() => {
            return <Icon name="angle-left" size={20} color={colors.primary} enableRTL={true} />;
          }}
          onPressLeft={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('NewsMenu');
            }
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
                    <Image
                      source={require('../../assets/images/styever-mark.png')}
                      style={styles.kickerLogo}
                      resizeMode="contain"
                    />
                    <Text
                      style={[
                        styles.kicker,
                        { color: colors.primary },
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
                      onPress={() => { setUseVoucher(!useVoucher); if (!useVoucher) setVoucher(''); setSelectedPlanId(-1); }}
                    />
                  </View>
                )}

                {(useVoucher && !isProfilePage && !isStandByPage) && (
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
                        onChangeText={text => {
                          setVoucher(text);
                          setVoucherSuccess(!isNullOrEmpty(text));
                          setSelectedPlanId(-1);
                        }}
                        placeholder={t('voucher')}
                        value={voucher}
                        autoCapitalize="characters"
                        success={voucherSuccess}
                      />
                      {!voucherSuccess && <Text style={styles.error}>{t('required_field')}</Text>}
                    </View>

                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={[
                        styles.voucherSearchButton,
                        { backgroundColor: colors.primary },
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
            renderItem={({ item }) => (
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
