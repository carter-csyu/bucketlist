import { createAction, handleActions } from 'redux-actions';
import axios from 'axios';

// 액션 타입 정의

const SIGNIN = 'auth/SIGNIN';
const SIGNIN_SUCCESS = 'auth/SIGNIN_SUCCESS';
const SIGNIN_FAILURE = 'auth/SIGNIN_FAILURE';

const SIGNUP = 'auth/SIGNUP';
const SIGNUP_SUCCESS = 'auth/SIGNUP_SUCCESS';
const SIGNUP_FAILURE = 'auth/SIGNUP_FAILURE';

const CHECK_NICKNAME = 'auth/CHECK_NICKNAME';
const CHECK_NICKNAME_SUCCESS = 'auth/CHECK_NICKNAME_SUCCESS';
const CHECK_NICKNAME_FAILURE = 'auth/CHECK_NICKNAME_FAILURE';

const GET_USERINFO_SUCCESS = 'auth/GET_USERINFO_SUCCESS';
const GET_USERINFO_FAILURE = 'auth/GET_USERINFO_FAILURE';

const SET_USERINFO = 'auth/SET_USERINFO';

// 액션 생성 함수
export const signinRequest = (email, password) => {
  return (dispatch) =>  {
    dispatch(signin());

    return axios.post(`/api/account/signin`, {
      email, password
    }).then( response => {
      // successed
      dispatch(signinSuccess(response.data.info));
    }).catch( error => {
      // failed
      dispatch(signinFailure(error.response.data));
    })
  };
};
export const signin = createAction(SIGNIN);
export const signinSuccess = createAction(SIGNIN_SUCCESS);
export const signinFailure = createAction(SIGNIN_FAILURE);

export const signupRequest = (email, password, nickname) => {
  return (dispatch) => {
    dispatch(signup());

    return axios.post(`/api/account/signup`, {
      email, password, nickname
    }).then( response => {
      // successed
      dispatch(signupSuccess());
    }).catch( error => {
      // failed
      dispatch(signupFailure(error.response.data));
    }); 
  };
};
export const signup = createAction(SIGNUP);
export const signupSuccess = createAction(SIGNUP_SUCCESS);
export const signupFailure = createAction(SIGNUP_FAILURE);

export const checkNicknameRequest = (nickname) => {
  return (dispatch) => {
    dispatch(checkNickname());

    return axios.post(`/api/account/checkNickname`, {
      nickname
    }).then( response => {
      // successed
      dispatch(checkNicknameSuccess());
    }).catch( error => {
      // failled
      dispatch(checkNicknameFailure(error.response.data));
    });
  } 
};
export const checkNickname = createAction(CHECK_NICKNAME);
export const checkNicknameSuccess = createAction(CHECK_NICKNAME_SUCCESS);
export const checkNicknameFailure = createAction(CHECK_NICKNAME_FAILURE);

export const getUserinfoRequest = () => {
  return (dispatch) => {
    return axios.get(`/api/account/getUserinfo`)
    .then( response => {
      // successed
      console.log(response);
      dispatch(getUserinfoSuccess(response.data.user)); 
    }).catch( error => {
      // failed
      console.log(error);
      dispatch(getUserinfoFailure());
    });
  }
};
export const getUserinfoSuccess = createAction(GET_USERINFO_SUCCESS);
export const getUserinfoFailure = createAction(GET_USERINFO_FAILURE);

export const setUserinfo = createAction(SET_USERINFO);


const initialState = {
  signin: {
    status: 'INIT',
    error: {}
  },
  signup: {
    status: 'INIT',
    error: {}
  },
  nickname: {
    status: 'INIT',
    error: {}
  },
  user: {
    isSignedIn: true,
    info: {}
  }
};

export default handleActions({
  [SIGNIN]: (state, action) => {
    return {
      ...state,
      signin: {
        status: 'WAITING'
      }
    };
  },
  [SIGNIN_SUCCESS]: (state, { payload: info }) => {
    return {
      ...state,
      signin: {
        status: 'SUCCESS'
      },
      user: {
        isSignedIn: true,
        info
      }
    };
  },
  [SIGNIN_FAILURE]: (state, { payload: info }) => {
    return {
      ...state,
      signin: {
        status: 'FAILURE',
        error: info
      }
    }
  },

  [SIGNUP]: (state, action) => {
    return {
      ...state,
      signup: {
        ...state.signup,
        status: 'WAITING'
      }
    };
  },
  [SIGNUP_SUCCESS]: (state, action) => {
    return {
      ...state,
      signup: {
        ...state.signup,
        status: 'SUCCESS'
      }
    }
  },
  [SIGNUP_FAILURE]: (state, { payload: info }) => {
    return {
      ...state,
      signup: {
        ...state.signup,
        status: 'FAILURE',
        error: info
      }
    }
  },
  
  [CHECK_NICKNAME]: (state, action) => {
    return {
      ...state,
      nickname: {
        ...state.nickname,
        status: 'WAITING'
      }
    };
  },
  [CHECK_NICKNAME_SUCCESS]: (state, action) => {
    return {
      ...state,
      nickname: {
        ...state.nickname,
        status: 'SUCCESS'
      }
    };
  },
  [CHECK_NICKNAME_FAILURE]: (state, { payload: info }) => {
    return {
      ...state,
      nickname: {
        ...state.nickname,
        status: 'FAILURE',
        error: info
      }
    }
  },

  [GET_USERINFO_SUCCESS]: (state, { payload: info }) => {
    return {
      ...state,
      user: {
        isSignedIn: true,
        info
      }
    }
  },
  [GET_USERINFO_FAILURE]: (state, action) => {
    return {
      ...state,
      user: {
        isSignedIn: false,
        info: {}
      }
    }
  },

  [SET_USERINFO]: (state, { payload: info }) => {
    return {
      ...state,
      user: {
        isSignedIn: true,
        info
      }
    }
  },
}, initialState);
