import { combineReducers } from 'redux';
import article from './article';
import auth from './auth';
import bucketlist from './bucketlist';
import post from './post';
import notification from './notification';

export default combineReducers({
  article,
  auth,
  bucketlist,
  post,
  notification
});