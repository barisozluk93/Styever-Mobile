import { changePasswordRequest, loginRequest } from '@/apis/authApi';
import { getById } from '@/apis/userApi';
import { saveToken, removeToken, loadToken } from '@/utils/storage';

const decodeJwtPayload = (token) => {
  if (!token) return null;
  try {
    const payloadPart = token.split('.')[1];
    if (!payloadPart) return null;
    const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4);
    return JSON.parse(atob(padded));
  } catch (error) {
    return null;
  }
};

export const login = (username, password) => async (dispatch) => {
  try {
    dispatch({ type: 'AUTH_LOGIN_REQUEST' });
    const response = await loginRequest(username, password);
    await saveToken(response.data);


    dispatch({ type: 'AUTH_LOGIN_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'AUTH_LOGIN_FAIL', payload: error.response?.data?.message || error.message });
  }
};

export const logout = () => async (dispatch) => {
  await removeToken();
  dispatch({ type: 'AUTH_LOGOUT' });
};

export const getUserByToken = () => async (dispatch) => {
  try {
    dispatch({ type: 'USER_GET_REQUEST' });
    var accessToken = await loadToken();

    const tokenUser = decodeJwtPayload(accessToken);
    const userId = tokenUser?.id ?? tokenUser?.userId ?? tokenUser?.nameid ?? tokenUser?.sub;
    if (!userId) throw new Error('User id could not be resolved from token');
    const response = await getById(userId)
    const currentUser = response?.data ?? response;

    dispatch({ type: 'USER_GET_SUCCESS', payload: currentUser });
  } catch (error) {
    dispatch({ type: 'USER_GET_FAIL', payload: error.response?.data?.message || error.message });
  }
}

export const getUserById = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'USER_GET_REQUEST' });
    const response = await getById(id)
    const currentUser = response?.data ?? response;

    dispatch({ type: 'USER_GET_SUCCESS', payload: currentUser });
  } catch (error) {
    dispatch({ type: 'USER_GET_FAIL', payload: error.response?.data?.message || error.message });
  }
}