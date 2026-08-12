import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useTranslation } from 'react-i18next';

import {
  AppState,
  KeyboardAvoidingView,
  Linking,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  BaseStyle,
  useTheme,
} from '@/config';

import {
  CardBooking,
  Header,
  Icon,
  Image,
  SafeAreaView,
  Text,
  TextInput,
} from '@/components';

import styles from './styles';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  isNullOrEmpty,
} from '@/utils/utility';

import {
  acceptAgreementsRequest,
  addGiftRequest,
  buyPackageRequest,
  confirmShopierPaymentRequest,
  getPendingShopierPaymentRequest,
  payRequest,
  shopierPaymentStatusRequest,
} from '@/apis/userApi';

import Toast from 'react-native-toast-message';

import {
  logout,
} from '@/actions/auth';

import {
  lightCandleRequest,
  updateCandleRequest,
} from '@/apis/memoryApi';

const FAILED_STATUSES = [
  'failed',
  'cancelled',
  'canceled',
  'rejected',
  'refunded',
  'refund',
  'void',
  'expired',
  'error',
];

const Payment = (props) => {
  const {
    navigation,
    route,
  } = props;

  const {
    t,
    i18n,
  } = useTranslation();

  const {
    colors,
  } = useTheme();

  const [
    senderEmail,
    setSenderEmail,
  ] = useState('');

  const [
    fullname,
    setFullname,
  ] = useState('');

  const [
    receiverEmail,
    setReceiverEmail,
  ] = useState('');

  const [
    message,
    setMessage,
  ] = useState('');

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    price,
    setPrice,
  ] = useState(0);

  const [
    item,
    setItem,
  ] = useState();

  const [
    termsAccepted,
    setTermsAccepted,
  ] = useState(false);

  const [
    termsTouched,
    setTermsTouched,
  ] = useState(false);

  const [
    legalModalVisible,
    setLegalModalVisible,
  ] = useState(false);

  const [
    pendingReference,
    setPendingReference,
  ] = useState(null);

  const [
    pendingRedirectUrl,
    setPendingRedirectUrl,
  ] = useState(null);

  const [
    confirming,
    setConfirming,
  ] = useState(false);

  const dispatch =
    useDispatch();

  const {
    user,
  } = useSelector(
    state => state.user,
  );

  const {
    isPaymentRequired,
  } = useSelector(
    state => state.auth,
  );

  const pollingRef =
    useRef(null);

  const checkingRef =
    useRef(false);

  const completedRef =
    useRef(false);

  const appStateRef =
    useRef(
      AppState.currentState,
    );

  const [
    success,
    setSuccess,
  ] = useState({
    senderEmail: true,
    fullname: true,
    receiverEmail: true,
    message: true,
  });

  useEffect(() => {
    if (!item) {
      return;
    }

    if (item.typeId === 1) {
      if (
        user?.roles?.includes(2)
      ) {
        setPrice(499);
      }
      else if (
        user?.roles?.includes(3)
      ) {
        setPrice(699);
      }
      else if (
        user?.roles?.includes(4)
      ) {
        setPrice(1299);
      }
    }
    else if (
      item.typeId === 2
    ) {
      setPrice(
        item.data.donation,
      );
    }
    else if (
      item.typeId === 3 ||
      item.typeId === 4
    ) {
      if (
        item.selectedPlan === 2
      ) {
        setPrice(499);
      }
      else if (
        item.selectedPlan === 3
      ) {
        setPrice(699);
      }
      else if (
        item.selectedPlan === 4
      ) {
        setPrice(1299);
      }
    }
  }, [
    item,
    user,
  ]);

  useEffect(() => {
    if (
      route?.params?.item
    ) {
      setItem(
        route.params.item,
      );
    }
  }, [
    route?.params?.item,
  ]);

  const showError = (
    message,
  ) => {
    Toast.show({
      type: 'error',
      text1: t('error'),
      text2:
        message ||
        t(
          'payment_error',
        ),
    });
  };

  const showSuccess = (
    message,
  ) => {
    Toast.show({
      type: 'success',
      text1: t('success'),
      text2:
        message ||
        t(
          'payment_success',
        ),
    });
  };

  const getResponseData = (
    response,
  ) => {
    return (
      response?.data ||
      response?.Data ||
      null
    );
  };

  const stopPolling = () => {
    if (
      pollingRef.current
    ) {
      clearInterval(
        pollingRef.current,
      );

      pollingRef.current =
        null;
    }
  };

  const getRoleId = () => {
    if (
      user?.roles?.includes(2)
    ) {
      return 2;
    }

    if (
      user?.roles?.includes(3)
    ) {
      return 3;
    }

    if (
      user?.roles?.includes(4)
    ) {
      return 4;
    }

    return 0;
  };

  const getPurchaseType = () => {
    if (!item) {
      return '';
    }

    if (item.typeId === 1) {
      return 'Pay';
    }

    if (item.typeId === 3) {
      return 'Gift';
    }

    if (item.typeId === 4) {
      return 'Package';
    }

    return '';
  };

  const getPendingPlanId = () => {
    if (!item) {
      return 0;
    }

    if (item.typeId === 1) {
      return getRoleId();
    }

    if (
      item.typeId === 3 ||
      item.typeId === 4
    ) {
      return (
        item.selectedPlan ||
        0
      );
    }

    return 0;
  };

  const getPendingMemoryId = () => {
    if (
      item?.typeId === 4
    ) {
      return (
        item.memoryId ||
        0
      );
    }

    return 0;
  };

  const resetForm = () => {
    setSenderEmail('');
    setFullname('');
    setReceiverEmail('');
    setMessage('');

    setSuccess({
      senderEmail: true,
      fullname: true,
      receiverEmail: true,
      message: true,
    });

    setTermsAccepted(false);
    setTermsTouched(false);
  };

  const completePayment =
    useCallback(() => {
      if (
        completedRef.current
      ) {
        return;
      }

      completedRef.current =
        true;

      stopPolling();

      setLoading(false);
      setConfirming(false);

      setPendingReference(
        null,
      );

      setPendingRedirectUrl(
        null,
      );

      resetForm();

      const successKey =
        item?.typeId === 3
          ? 'SHOPIER.GIFT_PAYMENT_SUCCESS'
          : item?.typeId === 4
            ? 'SHOPIER.PACKAGE_PAYMENT_SUCCESS'
            : 'SHOPIER.MEMBERSHIP_PAYMENT_SUCCESS';

      showSuccess(
        t(successKey),
      );

      setTimeout(() => {
        if (
          item?.typeId === 3
        ) {
          navigation.goBack();
          return;
        }

        if (
          item?.typeId === 1 ||
          item?.typeId === 4
        ) {
          dispatch(
            logout(),
          );

          dispatch({
            type: 'USER_INIT',
          });

          navigation.navigate(
            'NHome',
          );

          return;
        }

        navigation.goBack();
      }, 1200);
    }, [
      dispatch,
      item,
      navigation,
      t,
    ]);

  const handleFailedPayment =
    useCallback(
      message => {
        stopPolling();

        setLoading(false);
        setConfirming(false);

        showError(
          message ||
          t(
            'SHOPIER.PAYMENT_FAILED',
          ),
        );
      },
      [t],
    );

  const checkPaymentStatus =
    useCallback(
      async () => {
        if (
          !pendingReference ||
          checkingRef.current ||
          completedRef.current
        ) {
          return;
        }

        checkingRef.current =
          true;

        try {
          const response =
            await shopierPaymentStatusRequest(
              pendingReference,
            );

          /*
           * Henüz bulunamadıysa polling devam etsin.
           */
          if (
            !response?.isSuccess
          ) {
            return;
          }

          const data =
            getResponseData(
              response,
            );

          const status =
            String(
              data?.status ||
              data?.Status ||
              '',
            ).toLowerCase();

          const orderId =
            data?.shopierOrderId ||
            data?.ShopierOrderId;

          if (
            status === 'completed' &&
            !!orderId
          ) {
            completePayment();
            return;
          }

          if (
            FAILED_STATUSES.includes(
              status,
            )
          ) {
            handleFailedPayment(
              data?.message ||
              data?.Message ||
              response?.message ||
              t(
                'SHOPIER.PAYMENT_FAILED',
              ),
            );
          }
        }
        catch (error) {
          console.log(
            'Shopier status error:',
            error,
          );
        }
        finally {
          checkingRef.current =
            false;
        }
      },
      [
        pendingReference,
        completePayment,
        handleFailedPayment,
        t,
      ],
    );

  useEffect(() => {
    stopPolling();

    if (pendingReference) {
      checkPaymentStatus();

      pollingRef.current =
        setInterval(
          () => {
            checkPaymentStatus();
          },
          3000,
        );
    }

    return () => {
      stopPolling();
    };
  }, [
    pendingReference,
    checkPaymentStatus,
  ]);

  useEffect(() => {
    const subscription =
      AppState.addEventListener(
        'change',
        nextAppState => {
          const previous =
            appStateRef.current;

          appStateRef.current =
            nextAppState;

          if (
            previous.match(
              /inactive|background/,
            ) &&
            nextAppState === 'active'
          ) {
            checkPaymentStatus();
          }
        },
      );

    return () => {
      subscription.remove();
    };
  }, [
    checkPaymentStatus,
  ]);

  /*
   * Pending endpoint userId üzerinden.
   * Bu nedenle guest gift için yeni ekran açıldığında
   * pending lookup yapmıyoruz.
   *
   * Shopier açıldıktan sonraki mevcut ekranda
   * reference state'te tutulduğu için polling çalışır.
   */
  const loadPendingPayment =
    useCallback(
      async () => {
        if (
          !item ||
          item.typeId === 2 ||
          !user?.id
        ) {
          return;
        }

        const purchaseType =
          getPurchaseType();

        if (!purchaseType) {
          return;
        }

        try {
          const response =
            await getPendingShopierPaymentRequest(
              user.id,
              purchaseType,
              getPendingPlanId(),
              getPendingMemoryId(),
            );

          if (
            !response?.isSuccess
          ) {
            return;
          }

          const data =
            getResponseData(
              response,
            );

          if (!data) {
            return;
          }

          const reference =
            data.reference ||
            data.Reference ||
            null;

          const redirectUrl =
            data.redirectUrl ||
            data.RedirectUrl ||
            null;

          if (reference) {
            completedRef.current =
              false;

            setPendingReference(
              reference,
            );

            setPendingRedirectUrl(
              redirectUrl,
            );
          }
        }
        catch (error) {
          console.log(
            'Pending Shopier payment error:',
            error,
          );
        }
      },
      [
        item,
        user?.id,
      ],
    );

  useFocusEffect(
    useCallback(() => {
      loadPendingPayment();

      return () => {
        stopPolling();
      };
    }, [
      loadPendingPayment,
    ]),
  );

  const buildLegalSnapshot = () => {
    const keys = [
      'DISTANCE_SALES.PAGE_TITLE',

      'DISTANCE_SALES.PRE_INFO_TITLE',
      'DISTANCE_SALES.PRE_INFO_SECTION_1_TITLE',
      'DISTANCE_SALES.PRE_INFO_SELLER_1',
      'DISTANCE_SALES.PRE_INFO_SELLER_2',
      'DISTANCE_SALES.PRE_INFO_SELLER_3',
      'DISTANCE_SALES.PRE_INFO_SELLER_4',

      'DISTANCE_SALES.PRE_INFO_SECTION_2_TITLE',
      'DISTANCE_SALES.PRE_INFO_SECTION_2_TEXT',

      'DISTANCE_SALES.PRE_INFO_SECTION_3_TITLE',
      'DISTANCE_SALES.PRE_INFO_SECTION_3_TEXT',

      'DISTANCE_SALES.PRE_INFO_SECTION_4_TITLE',
      'DISTANCE_SALES.PRE_INFO_SECTION_4_TEXT',

      'DISTANCE_SALES.PRE_INFO_SECTION_5_TITLE',
      'DISTANCE_SALES.PRE_INFO_SECTION_5_TEXT',

      'DISTANCE_SALES.CONTRACT_TITLE',
      'DISTANCE_SALES.PARTIES_TITLE',
      'DISTANCE_SALES.PARTIES_TEXT',

      'DISTANCE_SALES.SECTION_1_TITLE',

      'DISTANCE_SALES.SECTION_1_1_TITLE',
      'DISTANCE_SALES.SECTION_1_1_ITEM_1',
      'DISTANCE_SALES.SECTION_1_1_ITEM_2',
      'DISTANCE_SALES.SECTION_1_1_ITEM_3',
      'DISTANCE_SALES.SECTION_1_1_ITEM_4',
      'DISTANCE_SALES.SECTION_1_1_ITEM_5',
      'DISTANCE_SALES.SECTION_1_1_ITEM_6',

      'DISTANCE_SALES.SECTION_1_2_TITLE',
      'DISTANCE_SALES.SECTION_1_2_TEXT',

      'DISTANCE_SALES.SECTION_1_3_TITLE',
      'DISTANCE_SALES.SECTION_1_3_TEXT',
      'DISTANCE_SALES.SECTION_1_3_ITEM_1',
      'DISTANCE_SALES.SECTION_1_3_ITEM_2',
      'DISTANCE_SALES.SECTION_1_3_ITEM_3',
      'DISTANCE_SALES.SECTION_1_3_ITEM_4',

      'DISTANCE_SALES.SECTION_2_TITLE',
      'DISTANCE_SALES.SECTION_2_TEXT',

      'DISTANCE_SALES.SECTION_3_TITLE',
      'DISTANCE_SALES.SECTION_3_TEXT_1',
      'DISTANCE_SALES.SECTION_3_TEXT_2',
      'DISTANCE_SALES.SECTION_3_TEXT_3',
      'DISTANCE_SALES.SECTION_3_TEXT_4',

      'DISTANCE_SALES.SECTION_4_TITLE',
      'DISTANCE_SALES.SECTION_4_TEXT_1',
      'DISTANCE_SALES.SECTION_4_TEXT_2',
      'DISTANCE_SALES.SECTION_4_TEXT_3',
      'DISTANCE_SALES.SECTION_4_TEXT_4',
      'DISTANCE_SALES.SECTION_4_TEXT_5',

      'DISTANCE_SALES.SECTION_5_TITLE',
      'DISTANCE_SALES.SECTION_5_TEXT_1',
      'DISTANCE_SALES.SECTION_5_TEXT_2',
      'DISTANCE_SALES.SECTION_5_TEXT_3',

      'DISTANCE_SALES.SECTION_6_TITLE',
      'DISTANCE_SALES.SECTION_6_TEXT_1',
      'DISTANCE_SALES.SECTION_6_TEXT_2',
      'DISTANCE_SALES.SECTION_6_TEXT_3',
      'DISTANCE_SALES.SECTION_6_TEXT_4',
      'DISTANCE_SALES.SECTION_6_TEXT_5',
      'DISTANCE_SALES.SECTION_6_TEXT_6',

      'DISTANCE_SALES.SECTION_7_TITLE',
      'DISTANCE_SALES.SECTION_7_TEXT_1',
      'DISTANCE_SALES.SECTION_7_TEXT_2',
    ];

    return keys
      .map(
        key => t(key),
      )
      .filter(Boolean)
      .join('\n\n');
  };

  const saveAgreements =
    async reference => {
      /*
       * Guest Gift'te Agreement endpoint'i çağrılmamalı.
       * Yanlışlıkla bu metoda düşülürse auth isteği üretmeden çık.
       */
      if (
        item?.typeId === 3 &&
        !user?.id
      ) {
        return;
      }

      const language =
        String(
          i18n.language ||
          'tr',
        ).split('-')[0];

      const contentSnapshot =
        buildLegalSnapshot();

      /*
       * Bu metod guest gift için çağrılmaz.
       * Login kullanıcıdaki gerçek userId ile agreement kaydı yapılır.
       */
      const userId =
        user?.id || null;
      const response =
        await acceptAgreementsRequest([
          {
            userId,
            agreementType:
              'PreInformationForm',
            title: t(
              'PRE_INFORMATION_FORM',
            ),
            version: '2026.08',
            language,
            context: 'Purchase',
            documentUrl:
              '/distance-sales-agreement',
            contentSnapshot,
            relatedReference:
              reference,
          },
          {
            userId,
            agreementType:
              'DistanceSalesAgreement',
            title: t(
              'DISTANCE_SALES_CONTRACT',
            ),
            version: '2026.08',
            language,
            context: 'Purchase',
            documentUrl:
              '/distance-sales-agreement',
            contentSnapshot,
            relatedReference:
              reference,
          },
        ]);

      if (
        !response?.isSuccess
      ) {
        throw new Error(
          response?.message ||
          response?.Message ||
          t(
            'SHOPIER.AGREEMENT_SAVE_FAILED',
          ),
        );
      }
    };

  const openShopier =
    async url => {
      if (!url) {
        throw new Error(
          t(
            'SHOPIER.LINK_NOT_RECEIVED',
          ),
        );
      }

      /*
       * http / https için direkt openURL yeterli.
       * canOpenURL bazı iOS senaryolarında
       * gereksiz false dönebiliyor.
       */
      await Linking.openURL(
        url,
      );
    };

  const handleShopierResponse = async response => {
    if (!response?.isSuccess) {
      throw new Error(
        response?.message ||
        response?.Message ||
        t('SHOPIER.PAYMENT_START_FAILED'),
      );
    }

    const data = getResponseData(response);

    const reference =
      data?.reference ||
      data?.Reference;

    const redirectUrl =
      data?.redirectUrl ||
      data?.RedirectUrl;

    if (
      !reference ||
      !redirectUrl
    ) {
      throw new Error(
        t('SHOPIER.LINK_NOT_RECEIVED'),
      );
    }

    /*
     * Angular ile aynı akış:
     *
     * - Guest Gift (typeId === 3 && login yok):
     *   Agreement/Accept çağrılmaz.
     *   Checkbox onayı yine zorunludur.
     *
     * - Login kullanıcı:
     *   Agreement kayıtları oluşturulur.
     */
    const isGuestGift =
      item?.typeId === 3 &&
      !user?.id;

    if (!isGuestGift) {
      await saveAgreements(
        reference,
      );
    }

    completedRef.current = false;

    setPendingReference(
      reference,
    );

    setPendingRedirectUrl(
      redirectUrl,
    );

    await openShopier(
      redirectUrl,
    );
  };

  const validateGift = () => {
    if (
      item?.typeId !== 3
    ) {
      return true;
    }

    const giftSuccess = {
      /*
       * Login user'da sender bilgisi
       * user'dan geliyor.
       */
      senderEmail:
        user
          ? true
          : !isNullOrEmpty(
            senderEmail,
          ),

      fullname:
        user
          ? true
          : !isNullOrEmpty(
            fullname,
          ),

      receiverEmail:
        !isNullOrEmpty(
          receiverEmail,
        ),

      message:
        !isNullOrEmpty(
          message,
        ),
    };

    setSuccess(
      giftSuccess,
    );

    return Object
      .values(
        giftSuccess,
      )
      .every(Boolean);
  };

  const handleCandlePayment =
    async () => {
      setLoading(true);

      try {
        let response;

        if (
          item.data.id > 0
        ) {
          response =
            await updateCandleRequest(
              item.data,
            );
        }
        else {
          response =
            await lightCandleRequest(
              item.data,
            );
        }

        if (
          response.isSuccess
        ) {
          resetForm();

          showSuccess(
            t(item.data.id > 0 ? 'candle_update_success' : 'candle_light_success'),
          );

          setTimeout(() => {
            setLoading(false);

            navigation.goBack();
          }, 500);
        }
        else {
          setLoading(false);

          showError(
            response?.message || t(item.data.id > 0 ? 'candle_update_error' : 'candle_light_error'),
          );
        }
      }
      catch (error) {
        setLoading(false);

        showError(
          error?.response?.data?.message || t(item.data.id > 0 ? 'candle_update_error' : 'candle_light_error'),
        );
      }
    };

  const onPay = async () => {
    if (
      !item ||
      loading
    ) {
      return;
    }

    if (
      item.typeId === 2
    ) {
      await handleCandlePayment();
      return;
    }

    setTermsTouched(true);

    const giftValid =
      validateGift();

    if (!termsAccepted) {
      return;
    }

    /*
     * Gift login istemez.
     *
     * Membership / Package login ister.
     */
    if (
      item.typeId !== 3 &&
      !user?.id
    ) {
      showError(
        t(
          'SHOPIER.LOGIN_REQUIRED',
        ),
      );

      return;
    }

    if (!giftValid) {
      return;
    }

    try {
      setLoading(true);

      let response;

      if (
        item.typeId === 1
      ) {
        response =
          await payRequest(
            user.id,
          );
      }
      else if (
        item.typeId === 3
      ) {
        /*
         * Angular GiftModel ile aynı isimler:
         * senderEmail
         * senderFullName
         * receiverEmail
         * message
         * userId
         * planId
         * price
         */
        response =
          await addGiftRequest({
            senderEmail:
              user?.email ||
              senderEmail,

            senderFullName:
              user
                ? `${user?.name || ''} ${user?.surname || ''}`.trim()
                : fullname,

            receiverEmail,

            message,

            /*
             * Guest gift'te backend SenderEmail'i buyer email
             * olarak kullanabilsin diye 0 değil null gönderiyoruz.
             */
            userId:
              user?.id ||
              null,

            planId:
              item.selectedPlan,

            price,
          });
      }
      else if (
        item.typeId === 4
      ) {
        response =
          await buyPackageRequest(
            user.id,
            item.selectedPlan,
            item.memoryId || 0,
          );
      }
      else {
        return;
      }

      await handleShopierResponse(
        response,
      );
    }
    catch (error) {
      console.log(
        'Shopier payment error:',
        error,
      );

      showError(
        error?.message ||
        t(
          'SHOPIER.GENERIC_ERROR',
        ),
      );
    }
    finally {
      setLoading(false);
    }
  };

  const reopenShopier =
    async () => {
      setTermsTouched(true);

      if (!termsAccepted) {
        return;
      }

      try {
        setLoading(true);

        await openShopier(
          pendingRedirectUrl,
        );
      }
      catch (error) {
        showError(
          error?.message ||
          t(
            'SHOPIER.GENERIC_ERROR',
          ),
        );
      }
      finally {
        setLoading(false);
      }
    };

  const confirmPayment =
    async () => {
      if (
        !pendingReference ||
        confirming
      ) {
        return;
      }

      try {
        setConfirming(true);

        const response =
          await confirmShopierPaymentRequest(
            pendingReference,
          );

        if (
          !response?.isSuccess
        ) {
          showError(
            response?.message ||
            t(
              'SHOPIER.PAYMENT_NOT_VERIFIED',
            ),
          );

          return;
        }

        completePayment();
      }
      catch (error) {
        showError(
          error?.message ||
          t(
            'SHOPIER.GENERIC_ERROR',
          ),
        );
      }
      finally {
        setConfirming(false);
      }
    };

  const renderList = keys =>
    keys.map(key => (
      <View
        key={key}
        style={
          styles.legalListRow
        }
      >
        <Text
          style={
            styles.legalBullet
          }
        >
          •
        </Text>

        <Text
          style={
            styles.legalListText
          }
        >
          {t(key)}
        </Text>
      </View>
    ));

  const renderParagraphs =
    keys =>
      keys.map(key => (
        <Text
          key={key}
          style={
            styles.legalParagraph
          }
        >
          {t(key)}
        </Text>
      ));

  return (
    <SafeAreaView
      style={[
        BaseStyle.safeAreaView,
      ]}
      edges={[
        'right',
        'top',
        'left',
      ]}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <Header
          title=""
          renderLeft={() => {
            if (
              !isPaymentRequired
            ) {
              return (
                <Icon
                  name="angle-left"
                  size={20}
                  color={colors.primary}
                  enableRTL
                />
              );
            }

            return null;
          }}
          onPressLeft={() => {
            navigation.goBack();
          }}
        />

        <KeyboardAvoidingView
          behavior="height"
          style={{
            flex: 1,
          }}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={{
                flex: 1,
                padding: 20,
                paddingBottom: 10,
              }}
            >
              <View style={styles.heading}>
                <View style={styles.kickerRow}>
                  <Image
                source={require('../../assets/images/styever-mark.png')}
                style={styles.kickerLogo}
                resizeMode="contain"
              />
                  <Text style={[styles.kicker,{color:colors.primary}]}>STYEVER</Text>
                </View>
                <Text numberOfLines={0} style={styles.pageTitle}>{t('payment')}</Text>
                <Text style={styles.pageDescription}>{t('payment_description')}</Text>
              </View>

              {isPaymentRequired && (
                <View
                  style={
                    styles.trialBadge
                  }
                >
                  <Text
                    headline
                    style={
                      styles.trialText
                    }
                  >
                    {t(
                      'trial_end_message',
                    )}
                  </Text>
                </View>
              )}

              {item?.typeId === 3 &&
                !user && (
                  <>
                  <TextInput
                    style={{
                      marginTop: 10,
                    }}
                    iconLeft={<Icon name="envelope" size={17} color="#8A918D" style={styles.inputIcon}/>}
                    onChangeText={text=>{
                      setSenderEmail(text);
                      if(!isNullOrEmpty(text)){
                        setSuccess(prev=>({
                          ...prev,
                          senderEmail:true,
                        }));
                      }
                    }}
                    placeholder={t(
                      'sender_email',
                    )}
                    success={
                      success.senderEmail
                    }
                    value={
                      senderEmail
                    }
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {!success.senderEmail&&<Text style={styles.errorField}>{t('required_field')}</Text>}
                  </>
                )}

              {item?.typeId === 3 &&
                !user && (
                  <>
                  <TextInput
                    style={{
                      marginTop: 10,
                    }}
                    iconLeft={<Icon name="user" size={17} color="#8A918D" style={styles.inputIcon}/>}
                    onChangeText={text=>{
                      setFullname(text);
                      if(!isNullOrEmpty(text)){
                        setSuccess(prev=>({
                          ...prev,
                          fullname:true,
                        }));
                      }
                    }}
                    placeholder={t(
                      'fullname',
                    )}
                    success={
                      success.fullname
                    }
                    value={
                      fullname
                    }
                  />
                  {!success.fullname&&<Text style={styles.errorField}>{t('required_field')}</Text>}
                  </>
                )}

              {item?.typeId === 3 && (
                <>
                <TextInput
                  style={{
                    marginTop: 10,
                  }}
                  iconLeft={<Icon name="envelope-open-text" size={17} color="#8A918D" style={styles.inputIcon}/>}
                  onChangeText={text=>{
                    setReceiverEmail(text);
                    if(!isNullOrEmpty(text)){
                      setSuccess(prev=>({
                        ...prev,
                        receiverEmail:true,
                      }));
                    }
                  }}
                  placeholder={t(
                    'receiver_email',
                  )}
                  success={
                    success.receiverEmail
                  }
                  value={
                    receiverEmail
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                  {!success.receiverEmail&&<Text style={styles.errorField}>{t('required_field')}</Text>}
                </>
              )}

              {item?.typeId === 3 && (
                <>
                <TextInput
                  style={{
                    marginTop: 10,
                  }}
                  iconLeft={<Icon name="message" size={17} color="#8A918D" style={styles.inputIcon}/>}
                  onChangeText={text=>{
                    setMessage(text);
                    if(!isNullOrEmpty(text)){
                      setSuccess(prev=>({
                        ...prev,
                        message:true,
                      }));
                    }
                  }}
                  placeholder={t(
                    'message',
                  )}
                  success={
                    success.message
                  }
                  value={
                    message
                  }
                />
                  {!success.message&&<Text style={styles.errorField}>{t('required_field')}</Text>}
                </>
              )}

              {item &&
                item.typeId !== 2 && (
                  <View
                    style={
                      styles.shopierInfo
                    }
                  >
                    <Icon
                      name="shield-alt"
                      size={20}
                      color={
                        colors.primary
                      }
                    />

                    <Text
                      style={
                        styles.shopierInfoText
                      }
                    >
                      {t(
                        'SHOPIER.SECURITY_INFO',
                      )}
                    </Text>
                  </View>
                )}

              {pendingReference && (
                <View
                  style={[
                    styles.pendingBox,
                    {
                      borderColor:
                        colors.primary,
                    },
                  ]}
                >
                  <View
                    style={
                      styles.pendingHeader
                    }
                  >
                    <Icon
                      name="clock"
                      size={18}
                      color={
                        colors.primary
                      }
                    />

                    <Text
                      style={
                        styles.pendingTitle
                      }
                    >
                      {t(
                        'SHOPIER.PENDING_TITLE',
                      )}
                    </Text>
                  </View>

                  <Text
                    style={
                      styles.pendingDescription
                    }
                  >
                    {t(
                      'SHOPIER.PENDING_DESCRIPTION',
                    )}
                  </Text>

                  <Text
                    style={
                      styles.reference
                    }
                  >
                    {t(
                      'SHOPIER.REFERENCE',
                    )}
                    {': '}
                    {pendingReference}
                  </Text>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                      styles.checkPaymentButton,
                      {
                        borderColor:
                          colors.primary,
                      },
                    ]}
                    disabled={
                      confirming
                    }
                    onPress={
                      confirmPayment
                    }
                  >
                    <Text
                      style={{
                        color:
                          colors.primary,
                        fontWeight: '700',
                      }}
                    >
                      {confirming
                        ? t(
                          'SHOPIER.CHECKING',
                        )
                        : t(
                          'SHOPIER.CHECK_PAYMENT',
                        )}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {item &&
                item.typeId !== 2 && (
                  <View
                    style={
                      styles.consentRow
                    }
                  >
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[
                        styles.checkbox,

                        termsAccepted && {
                          backgroundColor:
                            colors.primary,

                          borderColor:
                            colors.primary,
                        },

                        termsTouched &&
                        !termsAccepted &&
                        styles.checkboxError,
                      ]}
                      onPress={() => {
                        setTermsTouched(
                          true,
                        );

                        setTermsAccepted(
                          value => !value,
                        );
                      }}
                    >
                      {termsAccepted && (
                        <Text
                          style={
                            styles.checkboxCheck
                          }
                        >
                          ✓
                        </Text>
                      )}
                    </TouchableOpacity>

                    <View
                      style={
                        styles.consentContent
                      }
                    >
                      <View
                        style={
                          styles.inlineText
                        }
                      >
                        <TouchableOpacity
                          onPress={() =>
                            setLegalModalVisible(
                              true,
                            )
                          }
                        >
                          <Text
                            style={[
                              styles.legalLink,
                              {
                                color:
                                  colors.primary,
                              },
                            ]}
                          >
                            {t(
                              'PRE_INFORMATION_FORM',
                            )}
                          </Text>
                        </TouchableOpacity>

                        <Text
                          style={
                            styles.consentText
                          }
                        >
                          {' '}
                          {t('AND')}
                          {' '}
                        </Text>

                        <TouchableOpacity
                          onPress={() =>
                            setLegalModalVisible(
                              true,
                            )
                          }
                        >
                          <Text
                            style={[
                              styles.legalLink,
                              {
                                color:
                                  colors.primary,
                              },
                            ]}
                          >
                            {t(
                              'DISTANCE_SALES_CONTRACT',
                            )}
                          </Text>
                        </TouchableOpacity>

                        <Text
                          style={
                            styles.consentText
                          }
                        >
                          {' '}
                          {t(
                            'I_HAVE_READ_AND_ACCEPTED',
                          )}
                        </Text>
                      </View>

                      {termsTouched &&
                        !termsAccepted && (
                          <Text
                            style={
                              styles.errorText
                            }
                          >
                            {t(
                              'TERMS_ACCEPTANCE_REQUIRED',
                            )}
                          </Text>
                        )}
                    </View>
                  </View>
                )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      <CardBooking
        loading={loading}
        description={t(
          'total_price',
        )}
        price={`${price} ₺`}
        textButton={
          pendingReference
            ? t(
              'SHOPIER.GO_TO_SHOPIER_AGAIN',
            )
            : item?.typeId === 2
              ? t('pay')
              : t(
                'SHOPIER.PAY_WITH_SHOPIER',
              )
        }
        onPress={() => {
          if (
            pendingReference
          ) {
            reopenShopier();
          }
          else {
            onPay();
          }
        }}
      />

      <Modal
        visible={
          legalModalVisible
        }
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() =>
          setLegalModalVisible(
            false,
          )
        }
      >
        <View
          style={
            styles.modalBackdrop
          }
        >
          <View
            style={
              styles.modalContainer
            }
          >
            <View
              style={
                styles.modalHeader
              }
            >
              <Text
                style={
                  styles.modalTitle
                }
              >
                {t(
                  'LEGAL_APPROVAL_TITLE',
                )}
              </Text>

              <TouchableOpacity
                style={
                  styles.modalCloseButton
                }
                onPress={() =>
                  setLegalModalVisible(
                    false,
                  )
                }
              >
                <Text
                  style={
                    styles.modalClose
                  }
                >
                  ×
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={
                styles.modalScroll
              }
              contentContainerStyle={
                styles.modalScrollContent
              }
              showsVerticalScrollIndicator
            >
              <Text
                style={
                  styles.documentTitle
                }
              >
                {t(
                  'DISTANCE_SALES.PAGE_TITLE',
                )}
              </Text>

              <View
                style={
                  styles.legalSection
                }
              >
                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  {t(
                    'DISTANCE_SALES.PRE_INFO_TITLE',
                  )}
                </Text>

                <Text
                  style={
                    styles.subSectionTitle
                  }
                >
                  {t(
                    'DISTANCE_SALES.PRE_INFO_SECTION_1_TITLE',
                  )}
                </Text>

                {renderList([
                  'DISTANCE_SALES.PRE_INFO_SELLER_1',
                  'DISTANCE_SALES.PRE_INFO_SELLER_2',
                  'DISTANCE_SALES.PRE_INFO_SELLER_3',
                  'DISTANCE_SALES.PRE_INFO_SELLER_4',
                ])}

                <Text
                  style={
                    styles.subSectionTitle
                  }
                >
                  {t(
                    'DISTANCE_SALES.PRE_INFO_SECTION_2_TITLE',
                  )}
                </Text>

                {renderParagraphs([
                  'DISTANCE_SALES.PRE_INFO_SECTION_2_TEXT',
                ])}

                <Text
                  style={
                    styles.subSectionTitle
                  }
                >
                  {t(
                    'DISTANCE_SALES.PRE_INFO_SECTION_3_TITLE',
                  )}
                </Text>

                {renderParagraphs([
                  'DISTANCE_SALES.PRE_INFO_SECTION_3_TEXT',
                ])}

                <Text
                  style={
                    styles.subSectionTitle
                  }
                >
                  {t(
                    'DISTANCE_SALES.PRE_INFO_SECTION_4_TITLE',
                  )}
                </Text>

                {renderParagraphs([
                  'DISTANCE_SALES.PRE_INFO_SECTION_4_TEXT',
                ])}

                <Text
                  style={
                    styles.subSectionTitle
                  }
                >
                  {t(
                    'DISTANCE_SALES.PRE_INFO_SECTION_5_TITLE',
                  )}
                </Text>

                {renderParagraphs([
                  'DISTANCE_SALES.PRE_INFO_SECTION_5_TEXT',
                ])}
              </View>

              <View
                style={
                  styles.legalSection
                }
              >
                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  {t(
                    'DISTANCE_SALES.CONTRACT_TITLE',
                  )}
                </Text>

                <Text
                  style={
                    styles.subSectionTitle
                  }
                >
                  {t(
                    'DISTANCE_SALES.PARTIES_TITLE',
                  )}
                </Text>

                {renderParagraphs([
                  'DISTANCE_SALES.PARTIES_TEXT',
                ])}
              </View>

              <View
                style={
                  styles.legalSection
                }
              >
                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  {t(
                    'DISTANCE_SALES.SECTION_1_TITLE',
                  )}
                </Text>

                <Text
                  style={
                    styles.subSectionTitle
                  }
                >
                  {t(
                    'DISTANCE_SALES.SECTION_1_1_TITLE',
                  )}
                </Text>

                {renderList([
                  'DISTANCE_SALES.SECTION_1_1_ITEM_1',
                  'DISTANCE_SALES.SECTION_1_1_ITEM_2',
                  'DISTANCE_SALES.SECTION_1_1_ITEM_3',
                  'DISTANCE_SALES.SECTION_1_1_ITEM_4',
                  'DISTANCE_SALES.SECTION_1_1_ITEM_5',
                  'DISTANCE_SALES.SECTION_1_1_ITEM_6',
                ])}

                <Text
                  style={
                    styles.subSectionTitle
                  }
                >
                  {t(
                    'DISTANCE_SALES.SECTION_1_2_TITLE',
                  )}
                </Text>

                {renderParagraphs([
                  'DISTANCE_SALES.SECTION_1_2_TEXT',
                ])}

                <Text
                  style={
                    styles.subSectionTitle
                  }
                >
                  {t(
                    'DISTANCE_SALES.SECTION_1_3_TITLE',
                  )}
                </Text>

                {renderParagraphs([
                  'DISTANCE_SALES.SECTION_1_3_TEXT',
                ])}

                {renderList([
                  'DISTANCE_SALES.SECTION_1_3_ITEM_1',
                  'DISTANCE_SALES.SECTION_1_3_ITEM_2',
                  'DISTANCE_SALES.SECTION_1_3_ITEM_3',
                  'DISTANCE_SALES.SECTION_1_3_ITEM_4',
                ])}
              </View>

              {[
                {
                  title:
                    'DISTANCE_SALES.SECTION_2_TITLE',
                  texts: [
                    'DISTANCE_SALES.SECTION_2_TEXT',
                  ],
                },
                {
                  title:
                    'DISTANCE_SALES.SECTION_3_TITLE',
                  texts: [
                    'DISTANCE_SALES.SECTION_3_TEXT_1',
                    'DISTANCE_SALES.SECTION_3_TEXT_2',
                    'DISTANCE_SALES.SECTION_3_TEXT_3',
                    'DISTANCE_SALES.SECTION_3_TEXT_4',
                  ],
                },
                {
                  title:
                    'DISTANCE_SALES.SECTION_4_TITLE',
                  texts: [
                    'DISTANCE_SALES.SECTION_4_TEXT_1',
                    'DISTANCE_SALES.SECTION_4_TEXT_2',
                    'DISTANCE_SALES.SECTION_4_TEXT_3',
                    'DISTANCE_SALES.SECTION_4_TEXT_4',
                    'DISTANCE_SALES.SECTION_4_TEXT_5',
                  ],
                },
                {
                  title:
                    'DISTANCE_SALES.SECTION_5_TITLE',
                  texts: [
                    'DISTANCE_SALES.SECTION_5_TEXT_1',
                    'DISTANCE_SALES.SECTION_5_TEXT_2',
                    'DISTANCE_SALES.SECTION_5_TEXT_3',
                  ],
                },
                {
                  title:
                    'DISTANCE_SALES.SECTION_6_TITLE',
                  texts: [
                    'DISTANCE_SALES.SECTION_6_TEXT_1',
                    'DISTANCE_SALES.SECTION_6_TEXT_2',
                    'DISTANCE_SALES.SECTION_6_TEXT_3',
                    'DISTANCE_SALES.SECTION_6_TEXT_4',
                    'DISTANCE_SALES.SECTION_6_TEXT_5',
                    'DISTANCE_SALES.SECTION_6_TEXT_6',
                  ],
                },
                {
                  title:
                    'DISTANCE_SALES.SECTION_7_TITLE',
                  texts: [
                    'DISTANCE_SALES.SECTION_7_TEXT_1',
                    'DISTANCE_SALES.SECTION_7_TEXT_2',
                  ],
                },
              ].map(section => (
                <View
                  key={
                    section.title
                  }
                  style={
                    styles.legalSection
                  }
                >
                  <Text
                    style={
                      styles.sectionTitle
                    }
                  >
                    {t(
                      section.title,
                    )}
                  </Text>

                  {renderParagraphs(
                    section.texts,
                  )}
                </View>
              ))}
            </ScrollView>

            <View
              style={
                styles.modalFooter
              }
            >
              <TouchableOpacity
                activeOpacity={0.8}
                style={
                  styles.cancelButton
                }
                onPress={() =>
                  setLegalModalVisible(
                    false,
                  )
                }
              >
                <Text
                  style={
                    styles.cancelText
                  }
                >
                  {t('cancel')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.acceptButton,
                  {
                    backgroundColor:
                      colors.primary,
                  },
                ]}
                onPress={() => {
                  setTermsAccepted(
                    true,
                  );

                  setTermsTouched(
                    true,
                  );

                  setLegalModalVisible(
                    false,
                  );
                }}
              >
                <Text
                  style={
                    styles.acceptText
                  }
                >
                  {t('ok')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Payment;