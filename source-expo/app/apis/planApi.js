import authApi from './axiosClient';

export const getPlansRequest = async () => {
  const response = await authApi.get('Plan/GetAll');
  return response.data;
};
