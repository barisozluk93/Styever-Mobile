import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useTranslation } from 'react-i18next';

import {
  ActivityIndicator,
  AppState,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
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
  getAppleTransactionCompletedRequest,
  payRequest,
  shopierPaymentStatusRequest,
  verifyApplePurchaseRequest,
} from '@/apis/userApi';

import Toast from 'react-native-toast-message';

import AsyncStorage from '@react-native-async-storage/async-storage';

import * as RNIap from 'react-native-iap';

import {
  logout,
} from '@/actions/auth';

import {
  lightCandleRequest,
  updateCandleRequest,
} from '@/apis/memoryApi';

import {
  getPurchaseLegalContents,
} from '@/apis/legalContentApi';

import {
  getLocalizedLegalContent,
  getLocalizedLegalTitle,
} from '@/utils/legalContent';

const APPLE_PRODUCTS = {
  2: 'com.styever.origin.yearly',
  3: 'com.styever.heart.yearly',
  4: 'com.styever.family.yearly',
};

// TEMP: App Store review screenshot fallback.
// StoreKit returns the real localized value as soon as the products become available.
const APPLE_REVIEW_FALLBACK = {
  2: { name: 'Origin', price: '499.00 ₺' },
  3: { name: 'Heart', price: '699.00 ₺' },
  4: { name: 'Family', price: '1299.00 ₺' },
};

const APPLE_PENDING_CONTEXT_KEY = 'styever.apple.pendingPurchase';

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
  ] = useState(() => route?.params?.item || null);

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
  const [
    appleProducts,
    setAppleProducts,
  ] = useState([]);

  const [
    appleStoreReady,
    setAppleStoreReady,
  ] = useState(false);

  const [
    appleStoreError,
    setAppleStoreError,
  ] = useState('');

  const [
    purchaseLegalDocument,
    setPurchaseLegalDocument,
  ] = useState(null);

  const [
    purchaseLegalLoading,
    setPurchaseLegalLoading,
  ] = useState(false);

  const [
    purchaseLegalError,
    setPurchaseLegalError,
  ] = useState('');


  const legalLanguage =
    String(
      i18n.language || 'tr',
    ).split('-')[0] === 'en'
      ? 'en'
      : 'tr';

  const purchaseLegalTitle = () =>
    getLocalizedLegalTitle(
      purchaseLegalDocument,
      legalLanguage,
    );

  const purchaseLegalContent = () =>
    getLocalizedLegalContent(
      purchaseLegalDocument,
      legalLanguage,
    );

  const getPurchaseAgreementSnapshots = () => {
    const content = purchaseLegalContent();

    if (!content) {
      return {
        preInformationTitle:
          t('PRE_INFORMATION_FORM'),
        preInformationContent: '',
        distanceSalesTitle:
          purchaseLegalTitle() ||
          t('DISTANCE_SALES_CONTRACT'),
        distanceSalesContent: '',
      };
    }

    const distanceHeading =
      legalLanguage === 'en'
        ? 'SECTION II: DISTANCE SALES AGREEMENT'
        : 'BÖLÜM II: MESAFELİ SATIŞ SÖZLEŞMESİ';

    const splitIndex =
      content.indexOf(distanceHeading);

    if (splitIndex < 0) {
      return {
        preInformationTitle:
          t('PRE_INFORMATION_FORM'),
        preInformationContent: content,
        distanceSalesTitle:
          purchaseLegalTitle() ||
          t('DISTANCE_SALES_CONTRACT'),
        distanceSalesContent: content,
      };
    }

    const preInformationContent =
      content.slice(0, splitIndex).trim();

    const distanceSalesContent =
      content.slice(splitIndex).trim();

    const firstLine = value =>
      String(value || '')
        .split('\n')
        .map(x => x.trim())
        .find(Boolean) || '';

    return {
      preInformationTitle:
        firstLine(preInformationContent) ||
        t('PRE_INFORMATION_FORM'),
      preInformationContent,
      distanceSalesTitle:
        firstLine(distanceSalesContent) ||
        purchaseLegalTitle() ||
        t('DISTANCE_SALES_CONTRACT'),
      distanceSalesContent,
    };
  };

  useEffect(() => {
    let mounted = true;

    setPurchaseLegalLoading(true);
    setPurchaseLegalError('');

    getPurchaseLegalContents()
      .then(document => {
        if (mounted) {
          setPurchaseLegalDocument(document);
        }
      })
      .catch(error => {
        if (mounted) {
          setPurchaseLegalDocument(null);
          setPurchaseLegalError(
            error?.response?.data?.message ||
            error?.message ||
            t('legal_content_load_error'),
          );
        }
      })
      .finally(() => {
        if (mounted) {
          setPurchaseLegalLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [
    legalLanguage,
    t,
  ]);

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

  const applePurchaseProcessingRef =
    useRef(false);

  const applePurchaseHandlerRef =
    useRef(null);

  // A StoreKit pending transaction may be emitted as soon as the listener is
  // attached. Never fulfill anything until the user has explicitly accepted
  // the agreements and pressed the payment button in this screen session.
  const applePurchaseAuthorizedRef =
    useRef(false);

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

    // Explicit route flow wins. Login/isPaymentRequired must always fulfill
    // through UserService.Pay; expired renewals through BuyPackage; gifts
    // through BuyGiftPackage. typeId remains as the backwards-compatible
    // fallback for existing navigation calls.
    if (item.paymentFlow === 'Pay') {
      return 'Pay';
    }

    if (item.paymentFlow === 'Package') {
      return 'Package';
    }

    if (item.paymentFlow === 'Gift') {
      return 'Gift';
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

    const purchaseType = getPurchaseType();

    if (purchaseType === 'Pay') {
      return getRoleId();
    }

    if (purchaseType === 'Gift' || purchaseType === 'Package') {
      return item.selectedPlan || 0;
    }

    return 0;
  };

  const getPendingMemoryId = () => {
    return getPurchaseType() === 'Package'
      ? item?.memoryId || 0
      : 0;
  };

  const isIOS =
    Platform.OS === 'ios';

  const getAppleProductId = () =>
    APPLE_PRODUCTS[
      getPendingPlanId()
    ] || null;

  const getAppleProduct = () => {
    const productId =
      getAppleProductId();

    return appleProducts.find(product =>
      (product?.id || product?.productId) === productId
    );
  };

  const getSelectedPlanId = () =>
    getPendingPlanId();

  const getDisplayedPlanName = () => {
    if (!item || item.typeId === 2) {
      return null;
    }

    return APPLE_REVIEW_FALLBACK[getSelectedPlanId()]?.name || null;
  };

  const getDisplayedPrice = () => {
    if (isIOS && item?.typeId !== 2) {
      const product = getAppleProduct();

      // StoreKit's localized display price is the source of truth on iOS.
      // Do not format/convert the amount ourselves; the active storefront
      // determines TRY/USD/EUR etc.
      return product?.displayPrice ||
        product?.localizedPrice ||
        t('APPLE_IAP.PRICE_LOADING');
    }

    return `${price} ₺`;
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
    useCallback(async () => {
      if (completedRef.current) {
        return;
      }

      completedRef.current = true;
      stopPolling();
      setLoading(false);
      setConfirming(false);
      setPendingReference(null);
      setPendingRedirectUrl(null);
      resetForm();

      // IMPORTANT: success routing is based on the explicit payment flow,
      // never on typeId or an old persisted Apple context.
      const purchaseType = getPurchaseType();
      const successKey =
        purchaseType === 'Gift'
          ? 'SHOPIER.GIFT_PAYMENT_SUCCESS'
          : purchaseType === 'Package'
            ? 'SHOPIER.PACKAGE_PAYMENT_SUCCESS'
            : 'SHOPIER.MEMBERSHIP_PAYMENT_SUCCESS';

      showSuccess(t(successKey));

      if (purchaseType === 'Gift') {
        await AsyncStorage.removeItem(APPLE_PENDING_CONTEXT_KEY).catch(() => {});
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Pricing',
              params: {
                isStandByPage: true,
                isProfilePage: false,
              },
            },
          ],
        });
        return;
      }

      if (purchaseType === 'Pay' || purchaseType === 'Package') {
        // The backend has already committed the entitlement at this point.
        // Clear the local session first, then replace the whole navigation
        // stack so stale authenticated screens cannot remain visible.
        await AsyncStorage.removeItem(APPLE_PENDING_CONTEXT_KEY).catch(() => {});

        try {
          await dispatch(logout());
        }
        finally {
          dispatch({ type: 'USER_INIT' });
          dispatch({ type: 'MEMORY_INIT' });
          dispatch({ type: 'ARTICLE_INIT' });

          navigation.reset({
            index: 0,
            routes: [{ name: 'SignIn' }],
          });
        }
        return;
      }

      navigation.goBack();
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
      if (!isIOS) {
        loadPendingPayment();
      }

      return () => {
        stopPolling();
      };
    }, [
      isIOS,
      loadPendingPayment,
    ]),
  );

  useEffect(() => {
    if (!isIOS || !item) {
      return undefined;
    }

    let mounted = true;
    let purchaseSubscription;
    let purchaseErrorSubscription;

    const processApplePurchase = async purchase => {
      console.log('[Apple IAP] purchaseUpdated:', {
        productId: purchase?.productId,
        transactionId: purchase?.transactionId,
        id: purchase?.id,
        originalTransactionIdentifierIOS:
          purchase?.originalTransactionIdentifierIOS,
      });

      console.log('[Apple IAP] purchaseUpdated keys:',
        purchase ? Object.keys(purchase) : []
      );

      if (!applePurchaseAuthorizedRef.current) {
        console.log(
          '[Apple IAP] Ignoring pending purchaseUpdated until user accepts agreements and presses Pay.',
        );
        return;
      }

      if (applePurchaseProcessingRef.current) {
        console.log('[Apple IAP] Purchase is already being processed.');
        return;
      }

      applePurchaseProcessingRef.current = true;

      try {
        const rawContext =
          await AsyncStorage.getItem(
            APPLE_PENDING_CONTEXT_KEY,
          );

        if (!rawContext) {
          throw new Error(
            t('APPLE_IAP.PENDING_CONTEXT_MISSING'),
          );
        }

        const context =
          JSON.parse(rawContext);

        const transactionId =
          purchase?.transactionId ||
          purchase?.id ||
          purchase?.originalTransactionIdentifierIOS;

        if (!transactionId) {
          throw new Error(
            t('APPLE_IAP.TRANSACTION_MISSING'),
          );
        }

        // In OpenIAP/RNIAP purchase objects `id` can represent the
        // transaction identifier. Only compare an explicit productId/SKU.
        const purchaseProductId =
          purchase?.productId ||
          purchase?.sku ||
          null;

        if (
          purchaseProductId &&
          purchaseProductId !== context.productId
        ) {
          throw new Error(
            t('APPLE_IAP.PRODUCT_MISMATCH'),
          );
        }

        const isGuestGift =
          context.purchaseType === 'Gift' &&
          !context.userId;

        /*
         * IMPORTANT: Apple fulfillment must never be blocked by the
         * agreement persistence request. Apple has already charged/approved
         * the sandbox/real transaction at this point. First verify the
         * transaction with our backend and apply the purchased entitlement.
         */
        const verifyPayload = {
          transactionId,
          productId: context.productId,
          purchaseType: context.purchaseType,
          memoryId: context.memoryId || 0,
          senderEmail: context.senderEmail || null,
          senderFullName: context.senderFullName || null,
          receiverEmail: context.receiverEmail || null,
          message: context.message || null,
        };

        console.log('[Apple IAP] VERIFY REQUEST:', verifyPayload);

        const response =
          await verifyApplePurchaseRequest(
            verifyPayload,
          );

        console.log('[Apple IAP] VERIFY RESPONSE:', response);

        if (!response?.isSuccess) {
          throw new Error(
            response?.message ||
            response?.Message ||
            t('APPLE_IAP.VERIFICATION_FAILED'),
          );
        }

        /*
         * From this point on the backend has already verified the Apple
         * transaction and applied the entitlement. Nothing below is allowed
         * to block the success UX / logout flow.
         */
        if (!isGuestGift) {
          try {
            if (context?.agreements) {
              await saveAgreementSnapshots(
                transactionId,
                context.agreements,
                context.userId || user?.id,
              );
            }
            else {
              // Backward compatibility for purchases created before agreement
              // snapshots were persisted in APPLE_PENDING_CONTEXT_KEY.
              await saveAgreements(
                transactionId,
              );
            }

            console.log('[Apple IAP] Agreements saved:', transactionId);
          }
          catch (agreementError) {
            console.error(
              '[Apple IAP] AGREEMENT SAVE ERROR (purchase already fulfilled):',
              agreementError,
            );
          }
        }

        let transactionFinished = false;

        try {
          console.log('[Apple IAP] Finishing transaction:', transactionId);

          await RNIap.finishTransaction({
            purchase,
            isConsumable: false,
          });

          transactionFinished = true;
          console.log('[Apple IAP] Transaction finished:', transactionId);
        }
        catch (finishError) {
          // Entitlement is already applied and backend verification is
          // idempotent. Keep the pending context so the transaction can be
          // finished on the next launch, but never strand the user on Payment.
          console.error(
            '[Apple IAP] FINISH TRANSACTION ERROR (entitlement already applied):',
            finishError,
          );
        }

        if (transactionFinished) {
          await AsyncStorage.removeItem(
            APPLE_PENDING_CONTEXT_KEY,
          );
        }

        console.log('[Apple IAP] Fulfillment complete; running success flow.');

        if (mounted) {
          completePayment();
        }
      }
      catch (error) {
        console.log(
          'Apple IAP processing error:',
          error,
        );

        if (mounted) {
          setLoading(false);
          showError(
            error?.message ||
            t('APPLE_IAP.GENERIC_ERROR'),
          );
        }
      }
      finally {
        applePurchaseProcessingRef.current = false;
        applePurchaseAuthorizedRef.current = false;
      }
    };

    applePurchaseHandlerRef.current = processApplePurchase;

    const recoverPendingAppleTransactions = async () => {
      if (typeof RNIap.getPendingTransactionsIOS !== 'function') {
        console.log('[Apple IAP] getPendingTransactionsIOS is unavailable.');
        return;
      }

      try {
        const pendingTransactions = await RNIap.getPendingTransactionsIOS();
        const pendingList = Array.isArray(pendingTransactions)
          ? pendingTransactions
          : [];

        console.log(
          '[Apple IAP] Pending transactions:',
          pendingList.map(purchase => ({
            productId: purchase?.productId || purchase?.sku || null,
            transactionId: purchase?.transactionId || purchase?.id || null,
          })),
        );

        if (pendingList.length === 0 || !item) {
          return;
        }

        const currentPurchaseType = getPurchaseType();
        const currentProductId = getAppleProductId();

        // Never let a stale AsyncStorage context decide the operation for the
        // screen that is currently open. Login -> Pay, renewal -> Package,
        // gift -> Gift are decided only by the current route.
        const matchingPurchase = pendingList.find(purchase => {
          const pendingProductId = purchase?.productId || purchase?.sku || null;
          return pendingProductId === currentProductId;
        });

        if (!matchingPurchase) {
          return;
        }

        // Gift recovery needs sender/receiver fields that may only exist in
        // the persisted gift context. Do not reinterpret a stale Package/Pay
        // transaction as Gift.
        if (currentPurchaseType === 'Gift') {
          const rawContext = await AsyncStorage.getItem(APPLE_PENDING_CONTEXT_KEY);
          if (!rawContext) {
            console.log('[Apple IAP] Gift pending transaction has no recoverable context.');
            return;
          }

          const storedContext = JSON.parse(rawContext);
          if (storedContext?.purchaseType !== 'Gift' ||
              storedContext?.productId !== currentProductId) {
            console.log('[Apple IAP] Ignoring stale non-gift context on Gift screen.');
            return;
          }
        }
        else {
          // For authenticated Pay/Package flows, rebuild the context from the
          // CURRENT route before processing a pending StoreKit transaction.
          // This fixes login Pay being accidentally fulfilled as old Package.
          const recoveryContext = {
            productId: currentProductId,
            purchaseType: currentPurchaseType,
            memoryId: getPendingMemoryId(),
            userId: user?.id || null,
            senderEmail: null,
            senderFullName: null,
            receiverEmail: null,
            message: null,
            agreements: null,
          };

          if (!recoveryContext.userId) {
            console.log('[Apple IAP] Pending recovery skipped until authenticated user is loaded.');
            return;
          }

          await AsyncStorage.setItem(
            APPLE_PENDING_CONTEXT_KEY,
            JSON.stringify(recoveryContext),
          );
        }

        console.log('[Apple IAP] Recovering unfinished transaction for CURRENT flow:', {
          purchaseType: currentPurchaseType,
          productId: currentProductId,
        });

        await processApplePurchase(matchingPurchase);
      }
      catch (error) {
        console.error('[Apple IAP] Pending transaction recovery error:', error);
      }
    };

    const setupAppleStore = async () => {
      const skus = Object.values(
        APPLE_PRODUCTS,
      );

      try {
        setAppleStoreError('');

        console.log('[Apple IAP] Initializing StoreKit...');
        console.log('[Apple IAP] Requested product IDs:', skus);
        console.log('[Apple IAP] API support:', {
          fetchProducts: typeof RNIap.fetchProducts,
          getProducts: typeof RNIap.getProducts,
          requestPurchase: typeof RNIap.requestPurchase,
        });

        const connected =
          await RNIap.initConnection();

        console.log('[Apple IAP] initConnection result:', connected);

        if (!mounted) {
          return;
        }

        setAppleStoreReady(
          connected !== false,
        );

        let products = [];

        if (typeof RNIap.fetchProducts === 'function') {
          // All Styever yearly Apple products are auto-renewable subscriptions.
          // Fetch them only as subscriptions so a duplicate in-app query can
          // never override the StoreKit product type used by requestPurchase.
          const subscriptionProducts = await RNIap.fetchProducts({
            skus,
            type: 'subs',
          });

          products = (Array.isArray(subscriptionProducts)
            ? subscriptionProducts
            : []).map(product => ({
              ...product,
              __iapType: 'subs',
            }));
        }
        else if (typeof RNIap.getProducts === 'function') {
          /* Compatibility with older react-native-iap releases. */
          try {
            products = await RNIap.getProducts({
              skus,
            });
          }
          catch (objectArgumentError) {
            console.log(
              '[Apple IAP] getProducts({ skus }) failed, retrying with array:',
              objectArgumentError,
            );

            products = await RNIap.getProducts(
              skus,
            );
          }
        }
        else {
          throw new Error(
            'react-native-iap product fetch API is unavailable.',
          );
        }

        const normalizedProducts = Array.from(
          new Map(
            (Array.isArray(products) ? products : []).map(product => [
              product?.id || product?.productId,
              product,
            ]),
          ).values(),
        ).filter(product => product?.id || product?.productId);

        console.log(
          '[Apple IAP] Products returned by StoreKit:',
          normalizedProducts.map(product => ({
            id: product?.id,
            productId: product?.productId,
            displayName: product?.displayName,
            title: product?.title,
            displayPrice: product?.displayPrice,
            localizedPrice: product?.localizedPrice,
            price: product?.price,
            currency: product?.currency,
            currencyCode: product?.currencyCode,
            type: product?.type,
            fetchedAs: product?.__iapType,
          })),
        );

        const missingSkus = skus.filter(
          sku => !normalizedProducts.some(product =>
            (product?.id || product?.productId) === sku
          ),
        );

        if (missingSkus.length > 0) {
          console.warn(
            '[Apple IAP] StoreKit did not return these products:',
            missingSkus,
          );
        }

        if (mounted) {
          setAppleProducts(
            normalizedProducts,
          );

          if (normalizedProducts.length === 0) {
            setAppleStoreError(
              `StoreKit returned 0 products. Requested: ${skus.join(', ')}`,
            );
          }
          else if (missingSkus.length > 0) {
            setAppleStoreError(
              `Missing App Store products: ${missingSkus.join(', ')}`,
            );
          }
          else {
            setAppleStoreError('');
          }
        }
      }
      catch (error) {
        console.error(
          '[Apple IAP] Store setup/fetch error:',
          error,
        );

        if (mounted) {
          setAppleStoreReady(false);
          setAppleProducts([]);
          setAppleStoreError(
            `${error?.code ? `${error.code}: ` : ''}${error?.message || String(error)}`,
          );
        }
      }
    };

    purchaseSubscription =
      RNIap.purchaseUpdatedListener(
        processApplePurchase,
      );

    purchaseErrorSubscription =
      RNIap.purchaseErrorListener(error => {
        console.error('[Apple IAP] purchaseError:', {
          code: error?.code,
          message: error?.message,
          responseCode: error?.responseCode,
          debugMessage: error?.debugMessage,
        });

        const code = String(
          error?.code || '',
        ).toLowerCase();

        setLoading(false);
        applePurchaseAuthorizedRef.current = false;

        if (
          code.includes('cancel') ||
          code.includes('user-cancel')
        ) {
          return;
        }

        showError(
          error?.message ||
          t('APPLE_IAP.GENERIC_ERROR'),
        );
      });

    const initializeAppleIap = async () => {
      // Store setup/listeners only. Do NOT auto-recover pending purchases here.
      // Recovery is allowed only after the user accepts the legal agreements
      // and explicitly presses the payment button.
      await setupAppleStore();
    };

    initializeAppleIap();

    return () => {
      mounted = false;

      purchaseSubscription?.remove?.();
      purchaseErrorSubscription?.remove?.();
      applePurchaseHandlerRef.current = null;

      RNIap.endConnection().catch(() => {});
    };
  }, [
    isIOS,
    t,
    completePayment,
    item,
    user?.id,
  ]);

  const saveAgreementSnapshots =
    async (reference, agreementSnapshots, agreementUserId) => {
      if (!agreementSnapshots) {
        throw new Error(
          t('legal_content_load_error'),
        );
      }

      const {
        language,
        preInformationTitle,
        preInformationContent,
        distanceSalesTitle,
        distanceSalesContent,
      } = agreementSnapshots;

      if (
        !preInformationContent ||
        !distanceSalesContent
      ) {
        throw new Error(
          t('legal_content_load_error'),
        );
      }

      const response =
        await acceptAgreementsRequest([
          {
            userId: agreementUserId || 0,
            agreementType: 'PreInformationForm',
            title: preInformationTitle,
            version: '2026.08',
            language: language || 'tr',
            context: 'Purchase',
            documentUrl: '/distance-sales-agreement',
            contentSnapshot: preInformationContent,
            relatedReference: reference,
          },
          {
            userId: agreementUserId || 0,
            agreementType: 'DistanceSalesAgreement',
            title: distanceSalesTitle,
            version: '2026.08',
            language: language || 'tr',
            context: 'Purchase',
            documentUrl: '/distance-sales-agreement',
            contentSnapshot: distanceSalesContent,
            relatedReference: reference,
          },
        ]);

      if (!response?.isSuccess) {
        throw new Error(
          response?.message ||
          response?.Message ||
          t('SHOPIER.AGREEMENT_SAVE_FAILED'),
        );
      }
    };

  const saveAgreements =
    async reference => {
      /*
       * Agreement/Accept requires a real UserId.
       * Guest Gift currently has no UserAgreementAcceptance owner,
       * so it cannot be persisted to that table without a backend/schema change.
       */
      if (
        item?.typeId === 3 &&
        !user?.id
      ) {
        return;
      }

      if (
        purchaseLegalLoading ||
        purchaseLegalError ||
        !purchaseLegalDocument
      ) {
        throw new Error(
          purchaseLegalError ||
          t('legal_content_load_error'),
        );
      }

      const language = legalLanguage;
      const snapshots =
        getPurchaseAgreementSnapshots();

      if (
        !snapshots.preInformationContent ||
        !snapshots.distanceSalesContent
      ) {
        throw new Error(
          t('legal_content_load_error'),
        );
      }

      const userId = user?.id || 0;

      const response =
        await acceptAgreementsRequest([
          {
            userId,
            agreementType:
              'PreInformationForm',
            title:
              snapshots.preInformationTitle,
            version: '2026.08',
            language,
            context: 'Purchase',
            documentUrl:
              '/distance-sales-agreement',
            contentSnapshot:
              snapshots.preInformationContent,
            relatedReference:
              reference,
          },
          {
            userId,
            agreementType:
              'DistanceSalesAgreement',
            title:
              snapshots.distanceSalesTitle,
            version: '2026.08',
            language,
            context: 'Purchase',
            documentUrl:
              '/distance-sales-agreement',
            contentSnapshot:
              snapshots.distanceSalesContent,
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

  const handleApplePayment = async () => {
    const productId =
      getAppleProductId();

    console.log('[Apple IAP] Purchase requested:', {
      productId,
      purchaseType: getPurchaseType(),
      planId: getPendingPlanId(),
      storeReady: appleStoreReady,
      loadedProducts: appleProducts.map(product =>
        product?.id || product?.productId
      ),
    });

    if (!productId) {
      throw new Error(
        t('APPLE_IAP.PRODUCT_NOT_FOUND'),
      );
    }

    if (!appleStoreReady) {
      throw new Error(
        t('APPLE_IAP.STORE_NOT_READY'),
      );
    }

    const product =
      getAppleProduct();

    if (!product) {
      throw new Error(
        t('APPLE_IAP.PRODUCT_NOT_AVAILABLE'),
      );
    }

    const context = {
      productId,
      purchaseType:
        getPurchaseType(),
      memoryId:
        getPendingMemoryId(),
      userId:
        getPurchaseType() === 'Gift'
          ? user?.id || null
          : user?.id,
      senderEmail:
        item.typeId === 3
          ? user?.email || senderEmail
          : null,
      senderFullName:
        item.typeId === 3
          ? user
            ? `${user?.name || ''} ${user?.surname || ''}`.trim()
            : fullname
          : null,
      receiverEmail:
        item.typeId === 3
          ? receiverEmail
          : null,
      message:
        item.typeId === 3
          ? message
          : null,
      agreements:
        item.typeId === 3 && !user?.id
          ? null
          : (() => {
              const snapshots =
                getPurchaseAgreementSnapshots();

              return {
                language: legalLanguage,
                preInformationTitle:
                  snapshots.preInformationTitle,
                preInformationContent:
                  snapshots.preInformationContent,
                distanceSalesTitle:
                  snapshots.distanceSalesTitle,
                distanceSalesContent:
                  snapshots.distanceSalesContent,
              };
            })(),
    };

    await AsyncStorage.setItem(
      APPLE_PENDING_CONTEXT_KEY,
      JSON.stringify(context),
    );

    // From this point the user has explicitly accepted the agreements and
    // pressed Pay. Pending recovery / purchaseUpdated fulfillment is now
    // authorized for this one payment attempt only.
    applePurchaseAuthorizedRef.current = true;

    // Before opening a new StoreKit sheet, clear only orphaned transactions
    // that our backend has already completed. An unfinished transaction can
    // keep StoreKit from starting a fresh subscription purchase.
    if (typeof RNIap.getPendingTransactionsIOS === 'function') {
      const pendingTransactions = await RNIap.getPendingTransactionsIOS();
      const pendingList = Array.isArray(pendingTransactions)
        ? pendingTransactions
        : [];

      for (const pendingPurchase of pendingList) {
        const pendingProductId =
          pendingPurchase?.productId ||
          pendingPurchase?.sku ||
          null;

        const pendingTransactionId =
          pendingPurchase?.transactionId ||
          pendingPurchase?.id ||
          pendingPurchase?.originalTransactionIdentifierIOS ||
          null;

        if (!pendingTransactionId || pendingProductId !== productId) {
          continue;
        }

        console.log('[Apple IAP] Matching unfinished transaction found before purchase:', {
          productId: pendingProductId,
          transactionId: pendingTransactionId,
        });

        try {
          const statusResponse = await getAppleTransactionCompletedRequest(
            pendingTransactionId,
          );

          console.log('[Apple IAP] Existing transaction backend status:', statusResponse);

          if (statusResponse?.isSuccess && statusResponse?.data === true) {
            console.log('[Apple IAP] Clearing already-fulfilled StoreKit transaction:', pendingTransactionId);
            await RNIap.finishTransaction({
              purchase: pendingPurchase,
              isConsumable: false,
            });
          }
          else {
            // StoreKit already has a paid/unfinished transaction for this SKU.
            // Do not try to open another purchase sheet and do not fail the
            // user. Fulfill this transaction using the CURRENT screen flow
            // whose context was persisted immediately above.
            console.log('[Apple IAP] Fulfilling unfinished StoreKit transaction with CURRENT flow:', {
              transactionId: pendingTransactionId,
              purchaseType: context.purchaseType,
              productId,
            });

            if (typeof applePurchaseHandlerRef.current !== 'function') {
              throw new Error('Apple purchase handler is not ready.');
            }

            await applePurchaseHandlerRef.current(pendingPurchase);
            return;
          }
        }
        catch (pendingError) {
          console.error('[Apple IAP] Pending transaction could not be safely cleared:', pendingError);
          throw pendingError;
        }
      }
    }

    console.log('[Apple IAP] Calling requestPurchase for:', productId);

    if (RNIap.fetchProducts) {
      const purchaseType = product?.__iapType || 'subs';

      console.log('[Apple IAP] requestPurchase type:', purchaseType);

      await RNIap.requestPurchase({
        request: {
          apple: {
            sku: productId,
            quantity: 1,
          },
          google: {
            skus: [productId],
          },
        },
        type: purchaseType,
      });
    }
    else {
      await RNIap.requestPurchase({
        sku: productId,
        andDangerouslyFinishTransactionAutomaticallyIOS: false,
      });
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

    if (
      purchaseLegalLoading ||
      purchaseLegalError ||
      !purchaseLegalDocument
    ) {
      showError(
        purchaseLegalError ||
        t('legal_content_load_error'),
      );
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

    if (isIOS) {
      try {
        setLoading(true);
        await handleApplePayment();
      }
      catch (error) {
        setLoading(false);
        applePurchaseAuthorizedRef.current = false;
        showError(
          error?.message ||
          t('APPLE_IAP.GENERIC_ERROR'),
        );
      }

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
            if (
              !isPaymentRequired
            ) {
              navigation.goBack();
            }
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

              {item?.typeId !== 2 && getDisplayedPlanName() ? (
                <View style={styles.selectedPlanCard}>
                  <Text style={styles.selectedPlanLabel}>
                    {i18n.language?.startsWith('en') ? 'Selected Plan' : 'Seçili Paket'}
                  </Text>
                  <Text style={[styles.selectedPlanName, { color: colors.primary }]}>
                    {getDisplayedPlanName()}
                  </Text>
                  <Text style={styles.selectedPlanPeriod}>
                    {i18n.language?.startsWith('en') ? '1 Year Access' : '1 Yıllık Erişim'}
                  </Text>
                </View>
              ) : null}

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
                item.typeId !== 2 &&
                !isIOS && (
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

              {!isIOS && pendingReference && (
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

              {isIOS && item && item.typeId !== 2 && (
                <>
                  <View style={styles.shopierInfo}>
                    <Icon
                      name="apple"
                      size={20}
                      color={colors.primary}
                    />
                    <Text style={styles.shopierInfoText}>
                      {t('APPLE_IAP.SECURITY_INFO')}
                    </Text>
                  </View>

                  {__DEV__ && appleStoreError ? (
                    <Text
                      style={[
                        styles.errorText,
                        { marginTop: 8 },
                      ]}
                    >
                      IAP Debug: {appleStoreError}
                    </Text>
                  ) : null}
                </>
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
        disabled={
          item?.typeId !== 2 &&
          (
            purchaseLegalLoading ||
            !!purchaseLegalError ||
            !purchaseLegalDocument ||
            (
              isIOS &&
              !appleStoreReady
            )
          )
        }
        description={t(
          'total_price',
        )}
        price={getDisplayedPrice()}
        textButton={
          !isIOS && pendingReference
            ? t(
              'SHOPIER.GO_TO_SHOPIER_AGAIN',
            )
            : item?.typeId === 2
              ? t('pay')
              : isIOS
                ? t('APPLE_IAP.PAY_WITH_APP_STORE')
                : t(
                  'SHOPIER.PAY_WITH_SHOPIER',
                )
        }
        onPress={() => {
          if (
            !isIOS &&
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
              {purchaseLegalLoading ? (
                <View
                  style={{
                    paddingVertical: 32,
                    alignItems: 'center',
                  }}
                >
                  <ActivityIndicator
                    size="small"
                    color={colors.primary}
                  />
                </View>
              ) : purchaseLegalError ? (
                <Text
                  style={styles.modalText}
                >
                  {purchaseLegalError}
                </Text>
              ) : (
                <>
                  <Text
                    style={styles.documentTitle}
                  >
                    {purchaseLegalTitle()}
                  </Text>

                  <Text
                    numberOfLines={0}
                    style={styles.modalText}
                  >
                    {purchaseLegalContent()}
                  </Text>
                </>
              )}
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
                disabled={
                  purchaseLegalLoading ||
                  !!purchaseLegalError ||
                  !purchaseLegalDocument
                }
                style={[
                  styles.acceptButton,
                  (
                    purchaseLegalLoading ||
                    !!purchaseLegalError ||
                    !purchaseLegalDocument
                  ) && {
                    opacity: 0.5,
                  },
                  {
                    backgroundColor:
                      colors.primary,
                  },
                ]}
                onPress={() => {
                  if (
                    purchaseLegalLoading ||
                    purchaseLegalError ||
                    !purchaseLegalDocument
                  ) {
                    return;
                  }

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