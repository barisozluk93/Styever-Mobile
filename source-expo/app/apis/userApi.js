import authApi from './axiosClient';

export const getById = async (userId) => {
  const response = await authApi.get(`User/${userId}`);

  return response.data;
};


export const getUserAddressesRequest = async (userId) => {
  const response = await authApi.get(`User/UserAddressList/${userId}`);

  return response.data;
};

export const saveUserAddressRequest = async (data) => {
  const response = await authApi.post(`User/UserAddressSave`, data);

  return response.data;
};


export const updateUserAddressRequest = async (data) => {
  const response = await authApi.post(`User/UserAddressUpdate`, data);

  return response.data;
};

export const deleteUserAddressRequest = async (id) => {
  const response = await authApi.delete(`User/UserAddressDelete/${id}`);

  return response.data;
};

export const profileEdit = async (id, email, fileId, name, surname, username, phone, roles, password) => {
  const response = await authApi.post("User/UserProfileEdit", {
    id: id,
    fileId: fileId,
    email: email,
    name: name,
    surname: surname,
    username: username,
    phone: phone,
    roles: roles,
    password: password
  });

  return response.data;
}

