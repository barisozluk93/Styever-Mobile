import { combineReducers } from 'redux';
import AuthReducer from './auth';
import ApplicationReducer from './application';
import userReducer from './user';

export default combineReducers({
  auth: AuthReducer,
  user: userReducer,
  application: ApplicationReducer,
});
