import { createAction, handleActions } from 'redux-actions';
import axios from 'axios';

// 액션 타입 정의
const GET_NOTIFICATIONS = 'notifications/GET_NOTIFICATIONS';
const GET_NOTIFICATIONS_SUCCESS = 'notifications/GET_NOTIFICATIONS_SUCCESS';
const GET_NOTIFICATIONS_FAILURE = 'notifications/GET_NOTIFICATIONS_FAILURE';

const READ = 'notification/READ';
const READ_SUCCESS = 'notification/READ_SUCCESS';
const READ_FAILURE = 'notification/READ_FAILURE';

// 액션 생성 함수
export const getNotificationsRequest = (options = {}) => {
  return (dispatch) => {
    const { read } = options;
    let query = JSON.stringify(options) !== '{}' ? '?' : '';

    query += read === undefined ? '' : `&read=${read}`;

    dispatch(getNotifications());

    return axios.get(`/api/notifications/${query}`)
    .then(response => {
      dispatch(getNotificationsSuccess(response.data));
    }).catch(error => {
      dispatch(getNotificationsFailure(error.response.data));
    })
  }
};
export const getNotifications = createAction(GET_NOTIFICATIONS);
export const getNotificationsSuccess = createAction(GET_NOTIFICATIONS_SUCCESS);
export const getNotificationsFailure = createAction(GET_NOTIFICATIONS_FAILURE);

export const readRequest = (id) => {
  return (dispatch) => {
    dispatch(read());

    return axios.get(`/api/notifications/${id}`)
    .then(response => {
      dispatch(readSuccess(response.data));
    }).catch(error => {
      dispatch(readFailure(error.response.data));
    })
  }
};
export const read = createAction(READ);
export const readSuccess = createAction(READ_SUCCESS);
export const readFailure = createAction(READ_FAILURE);

const initialState = {
  status: 'INIT',
  error: {},
  notifications: [],
  unread: 0
};

export default handleActions({
  [GET_NOTIFICATIONS]: (state, action) => ({
    ...state,
    status: 'WAITING'
  }),
  [GET_NOTIFICATIONS_SUCCESS]: (state, { payload: notifications }) => {
    const unread = notifications.reduce((acc, current) => {
      if (!current.read) {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);

    return {
      ...state,
      status: 'SUCCESS',
      unread: unread,
      notifications
    };
  },
  [GET_NOTIFICATIONS_FAILURE]: (state, { payload: error }) => ({
    ...state,
    status: 'FAILURE',
    unread: 0,
    error
  }),

  [READ]: (state, action) => ({
    ...state,
    status: 'WAITING'
  }),
  [READ_SUCCESS]: (state, { payload: notification }) => {
    const index = state.notifications.findIndex( item => item._id === notification._id);

    return {
      ...state,
      status: 'SUCCESS',
      unread: state.unread > 0 ? state.unread -1 : 0,
      notifications: [
        ...state.notifications.slice(0, index),
        notification,
        ...state.notifications.slice(index + 1)
      ]
    }
  },
  [READ_FAILURE]: (state, { payload: error }) => ({
    ...state,
    status: 'FAILURE',
    unread: 0,
    error
  })
}, initialState);