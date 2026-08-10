import authApi from './axiosClient';

export const getById=async(userId)=>{
  const response=await authApi.get(`User/${userId}`);
  return response.data;
};


export const deleteUserRequest=async(userId)=>{
  const response=await authApi.delete(`User/Delete/${userId}`);
  return response.data;
};

export const getUserAddressesRequest=async(userId)=>{
  const response=await authApi.get(`User/UserAddressList/${userId}`);
  return response.data;
};

export const saveUserAddressRequest=async(data)=>{
  const response=await authApi.post(
    'User/UserAddressSave',
    data,
  );

  return response.data;
};

export const updateUserAddressRequest=async(data)=>{
  const response=await authApi.post(
    'User/UserAddressUpdate',
    data,
  );

  return response.data;
};

export const deleteUserAddressRequest=async(id)=>{
  const response=await authApi.delete(
    `User/UserAddressDelete/${id}`,
  );

  return response.data;
};

export const profileEdit=async(
  id,
  email,
  fileId,
  name,
  surname,
  username,
  phone,
  roles,
  password,
)=>{
  const response=await authApi.post(
    'User/UserProfileEdit',
    {
      id,
      fileId,
      email,
      name,
      surname,
      username,
      phone,
      roles,
      password,
    },
  );

  return response.data;
};

/*
 * GIFT
 *
 * Artık kart bilgisi mobil uygulamadan gönderilmiyor.
 * Backend ödeme kaydını oluşturup Shopier redirectUrl/reference döndürüyor.
 */
export const addGiftRequest=async(data)=>{
  const response=await authApi.post(
    'User/BuyGiftPackage',
    data,
  );

  return response.data;
};

/*
 * PACKAGE
 */
export const buyPackageRequest=async(
  userId,
  planId,
  memoryId,
)=>{
  const response=await authApi.get(
    `User/BuyPackage/${userId}/${planId}/${memoryId}`,
  );

  return response.data;
};

/*
 * MEMBERSHIP PAYMENT
 */
export const payRequest=async(userId)=>{
  const response=await authApi.get(
    `User/Pay/${userId}`,
  );

  return response.data;
};

/*
 * SHOPIER - MANUAL CONFIRM
 */
export const confirmShopierPaymentRequest=async(reference)=>{
  const response=await authApi.post(
    `User/ConfirmShopierPayment/${encodeURIComponent(reference)}`,
    {},
  );

  return response.data;
};

/*
 * SHOPIER - PAYMENT STATUS
 *
 * Payment ekranı bunu 3 saniyede bir çağıracak.
 */
export const shopierPaymentStatusRequest=async(reference)=>{
  const response=await authApi.get(
    `User/ShopierPaymentStatus/${encodeURIComponent(reference)}`,
  );

  return response.data;
};

/*
 * SHOPIER - PENDING PAYMENT
 *
 * purchaseType:
 * Pay
 * Gift
 * Package
 */
export const getPendingShopierPaymentRequest=async(
  userId,
  purchaseType,
  planId,
  memoryId,
)=>{
  const response=await authApi.get(
    `User/PendingShopierPayment/${userId}/${encodeURIComponent(purchaseType)}/${planId}/${memoryId}`,
  );

  return response.data;
};

/*
 * AGREEMENTS
 *
 * Angular:
 * POST /Agreement/Accept
 */
export const acceptAgreementsRequest=async(data)=>{
  const response=await authApi.post(
    'Agreement/Accept',
    data,
  );

  return response.data;
};

/*
 * USER AGREEMENTS
 */
export const getUserAgreementsRequest=async(userId)=>{
  const response=await authApi.get(
    `Agreement/User/${userId}`,
  );

  return response.data;
};

/*
 * VOUCHER
 */
export const voucherControlRequest=async(voucher)=>{
  const response=await authApi.get(
    `User/VoucherControl/${encodeURIComponent(voucher)}`,
  );

  return response.data;
};