import { createAction, handleActions } from 'redux-actions';
import axios from 'axios';

// 액션 타입 정의

const SIGNIN = 'auth/SIGNIN';
const SIGNIN_SUCCESS = 'auth/SIGNIN_SUCCESS';
const SIGNIN_FAILURE = 'auth/SIGNIN_FAILURE';

const SIGNUP = 'auth/SIGNUP';
const SIGNUP_SUCCESS = 'auth/SIGNUP_SUCCESS';
const SIGNUP_FAILURE = 'auth/SIGNUP_FAILURE';

const SIGNOUT = 'auth/SIGNOUT';
const SIGNOUT_SUCCESS = 'auth/SIGNOUT_SUCCESS';
const SIGNOUT_FAILURE = 'auth/SIGNOUT_FAILURE';

const CHECK_NICKNAME = 'auth/CHECK_NICKNAME';
const CHECK_NICKNAME_SUCCESS = 'auth/CHECK_NICKNAME_SUCCESS';
const CHECK_NICKNAME_FAILURE = 'auth/CHECK_NICKNAME_FAILURE';

const GET_USERINFO_SUCCESS = 'auth/GET_USERINFO_SUCCESS';
const GET_USERINFO_FAILURE = 'auth/GET_USERINFO_FAILURE';

const GET_PEOPLEINFO = 'auth/GET_PEOPLEINFO';
const GET_PEOPLEINFO_SUCCESS = 'auth/GET_PEOPLEINFO_SUCCESS';
const GET_PEOPLEINFO_FAILURE = 'auth/GET_PEOPLEINFO_FAILURE';

const SET_USERINFO = 'auth/SET_USERINFO';

const EDIT_USERINFO = 'auth/EDIT_USERINFO';
const EDIT_USERINFO_SUCCESS = 'auth/EDIT_USERINFO_SUCCESS';
const EDIT_USERINFO_FAILURE = 'auth/EDIT_USERINFO_FAILURE';

const REPLACE_PROFILE = 'auth/REPLACE_PROFILE';
const REPLACE_PROFILE_SUCCESS = 'auth/REPLACE_PROFILE_SUCCESS';
const REPLACE_PROFILE_FAILURE = 'auth/REPLACE_PROFILE_FAILURE';

// 액션 생성 함수
export const signoutRequest = () => {
  return (dispatch) => {
    dispatch(signout());

    return axios.get('/api/account/signout')
    .then( response => {
      console.log(response);
      dispatch(signoutSuccess());
    }).catch( error => {
      console.log(error);
      dispatch(signoutFailure(error.response.data));
    });
  }
}
export const signout = createAction(SIGNOUT);
export const signoutSuccess = createAction(SIGNOUT_SUCCESS);
export const signoutFailure = createAction(SIGNOUT_FAILURE);

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
    return axios.get(`/api/account/`)
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

export const editUserinfoRequest = (info) => {
  return (dispatch) => {
    const { id, fullname, nickname, bio } = info;

    dispatch(editUserinfo());
    return axios.put(`/api/account/${id}`, {
      fullname, nickname, bio
    }).then( response => {
      console.log(response);
      dispatch(editUserinfoSuccess(response.data));
    }).catch( error => {
      console.log(error);
      dispatch(editUserinfoFailure(error.response.data));
    })
  }
}
export const editUserinfo = createAction(EDIT_USERINFO);
export const editUserinfoSuccess = createAction(EDIT_USERINFO_SUCCESS);
export const editUserinfoFailure = createAction(EDIT_USERINFO_FAILURE);

export const replaceProfileRequest = (file) => {
  return (dispatch) => {
    dispatch(replaceProfile());

    let formData = new FormData();

    formData.append('files', file, file.name);
    
    return axios.post('/api/account/profile', formData)
    .then( response => {
      console.log(response);
      dispatch(replaceProfileSuccess(response.data));
    }).catch( error => {
      console.log(error);
      dispatch(replaceProfileFailure(error.response.data));
    });
  }
}
export const replaceProfile = createAction(REPLACE_PROFILE);
export const replaceProfileSuccess = createAction(REPLACE_PROFILE_SUCCESS);
export const replaceProfileFailure = createAction(REPLACE_PROFILE_FAILURE);

export const setUserinfo = createAction(SET_USERINFO);

export const getPeopleinfoRequest = (nickname) => {
  return (dispatch) => {
    dispatch(getPeopleinfo());

    return axios.get(`/api/account/${nickname}`).then(
      (response) => {
        console.log(response);
        dispatch(getPeopleinfoSuccess(response.data));
      }, (error) => {
        console.log(error);
        dispatch(getPeopleinfoFailure(error.response.data));
      }
    )
  }
};
export const getPeopleinfo = createAction(GET_PEOPLEINFO);
export const getPeopleinfoSuccess = createAction(GET_PEOPLEINFO_SUCCESS);
export const getPeopleinfoFailure = createAction(GET_PEOPLEINFO_FAILURE);


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
  },
  people: {},
  status: 'INIT',
  error: {}
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

  [SIGNOUT]: (state, action) => {
    return {
      ...state,
      status: 'WAITING'
    }
  },
  [SIGNOUT_SUCCESS]: (state, action) => {
    return {
      ...state,
      status: 'SUCCESS',
      user: {
        isSignedIn: false,
        info: {}
      },
    }
  },
  [SIGNOUT_FAILURE]: (state, { payload: info}) => {
    return {
      ...state,
      status: 'FAILURE',
      error: info
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

  [EDIT_USERINFO]: (state, action) => {
    return {
      ...state,
      status: 'WAITING'
    }
  },
  [EDIT_USERINFO_SUCCESS]: (state, { payload: info }) => {
    return {
      ...state,
      status: 'SUCCESS',
      user: {
        ...state.user,
        info
      }
    }
  },
  [EDIT_USERINFO_FAILURE]: (state, { payload: info }) => {
    return {
      ...state,
      status: 'FAILURE',
      error: info
    }
  },

  [REPLACE_PROFILE]: (state, action) => {
    return {
      ...state,
      status: 'WAITING'
    }
  },
  [REPLACE_PROFILE_SUCCESS]: (state, { payload: info }) => {
    return {
      ...state,
      status: 'SUCCESS',
      user: {
        ...state.user,
        info
      }
    }
  },
  [REPLACE_PROFILE_FAILURE]: (state, { payload: info }) => {
    return {
      ...state,
      status: 'FAILURE',
      error: info
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

  [GET_PEOPLEINFO]: (state, action) => {
    return {
      ...state,
      status: 'WAITING'
    };
  },
  [GET_PEOPLEINFO_SUCCESS]: (state, { payload: info }) => {
    return {
      ...state,
      status: 'SUCCESS',
      people: info
    };
  },
  [GET_PEOPLEINFO_FAILURE]: (state, { payload: info }) => {
    return {
      ...state,
      state: 'FAILURE',
      error: info
    };
  }
}, initialState);
