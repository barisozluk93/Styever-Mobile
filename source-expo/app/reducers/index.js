import { combineReducers } from 'redux';
import AuthReducer from './auth';
import ApplicationReducer from './application';
import userReducer from './user';
import MemoryReducer from './memory';
import ArticleReducer from './article';

export default combineReducers({
  auth: AuthReducer,
  user: userReducer,
  memory: MemoryReducer,
  article: ArticleReducer,
  application: ApplicationReducer,
});
