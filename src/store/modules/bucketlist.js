import { createAction, handleActions } from 'redux-actions';
import axios from 'axios';

// 액션 타입 정의
const CREATE_BUCKETLIST = 'bucketlist/CREATE_BUCKETLIST';
const CREATE_BUCKETLIST_SUCCESS = 'bucketlist/CREATE_BUCKETLIST_SUCCESS';
const CREATE_BUCKETLIST_FAILURE = 'bucketlist/CREATE_BUCKETLIST_FAILURE';

const EDIT_BUCKETLIST = "bucketlist/EDIT_BUCKETLIST";
const EDIT_BUCKETLIST_SUCCESS = "bucketlist/EDIT_BUCKETLIST_SUCCESS";
const EDIT_BUCKETLIST_FAILURE = "bucketlist/EDIT_BUCKETLIST_FAILURE";

const GET_BUCKETLIST = 'bucketlist/GET_BUCKETLIST';
const GET_BUCKETLIST_SUCCESS = 'bucketlist/GET_BUCKETLIST_SUCCESS';
const GET_BUCKETLIST_FAILURE = 'bucketlist/GET_BUCKETLIST_FAILURE';

const GET_BUCKETLISTS = 'bucketlist/GET_BUCKETLISTS';
const GET_BUCKETLISTS_SUCCESS = 'bucketlist/GET_BUCKETLISTS_SUCCESS';
const GET_BUCKETLISTS_FAILURE = 'bucketlist/GET_BUCKETLISTS_FAILURE';

// 액션 생성 함수
export const createBucketlistRequest = (title, items, dueDate, openRange) => {
  return (dispatch) => {
    dispatch(createBucketlist());

    let formData = new FormData();

    formData.append('files', null, null);
    formData.append('type', 'bucketlist');
    formData.append('title', title);
    formData.append('items', JSON.stringify(items));
    formData.append('dueDate', dueDate);
    formData.append('openRange', openRange);

    return axios.post('/api/articles', formData)
    .then( response => {
      // successed
      console.log(response);
      dispatch(createBucketlistSuccess());
    }).catch( error => {
      // failed
      console.log(error);
      dispatch(createBucketlistFailure(error.response.data));
    })
  }
};
export const createBucketlist = createAction(CREATE_BUCKETLIST);
export const createBucketlistSuccess = createAction(CREATE_BUCKETLIST_SUCCESS);
export const createBucketlistFailure = createAction(CREATE_BUCKETLIST_FAILURE);

export const editBucketlistRequest = (id, title, items, dueDate, openRange) => {
  return (dispatch) => {
    dispatch(createBucketlist());

    let formData = new FormData();

    formData.append('files', null, null);
    formData.append('type', 'bucketlist');
    formData.append('title', title);
    formData.append('items', JSON.stringify(items));
    formData.append('dueDate', dueDate);
    formData.append('openRange', openRange);

    return axios.put(`/api/articles/${id}`, formData)
    .then( response => {
      // successed
      console.log(response);
      dispatch(editBucketlistSuccess());
    }).catch( error => {
      // failed
      console.log(error);
      dispatch(editBucketlistFailure(error.response.data));
    });
  }
}
export const editBucketlist = createAction(EDIT_BUCKETLIST);
export const editBucketlistSuccess = createAction(EDIT_BUCKETLIST_SUCCESS);
export const editBucketlistFailure = createAction(EDIT_BUCKETLIST_FAILURE);

export const getBucketlistRequest = (id) => {
  return (dispatch) => {
    dispatch(getBucketlist());

    return axios.get(`/api/articles/${id}`)
      .then( response => {
        // successed
        console.log(response);
        dispatch(getBucketlistSuccess(response.data));
      }).catch( error => {
        // failed
        console.log(error);
        dispatch(getBucketlistFailure(error.response.data));
      });
  }
};
export const getBucketlist = createAction(GET_BUCKETLIST);
export const getBucketlistSuccess = createAction(GET_BUCKETLIST_SUCCESS);
export const getBucketlistFailure = createAction(GET_BUCKETLIST_FAILURE);

export const getBucketlistsRequest = () => {
  return (dispatch) => {

    dispatch(getBucketlists());

    return axios.get('/api/bucketlists')
      .then( response => {
        dispatch(getBucketlistsSuccess(response.data));
      }). catch( error => {
        dispatch(getBucketlistsFailure(error.response.data));
      });
  }
}
export const getBucketlists = createAction(GET_BUCKETLISTS);
export const getBucketlistsSuccess = createAction(GET_BUCKETLISTS_SUCCESS);
export const getBucketlistsFailure = createAction(GET_BUCKETLISTS_FAILURE);

// 초기 상태 정의
const initialState = {
  create: {
    status: 'INIT',
    error: {}
  },
  edit: {
    status: 'INIT',
    error: {}
  },
  data: {
    status: 'INIT',
    info: [],
    error: {}
  }
};

// 리듀서
export default handleActions({
  [CREATE_BUCKETLIST]: (state, action) => {
    return {
      ...state,
      create: {
        ...state.create,
        status: 'WAITING'
      }
    }
  },
  [CREATE_BUCKETLIST_SUCCESS]: (state, action) => {
    return {
      ...state,
      create: {
        ...state.create,
        status: 'SUCCESS'
      }
    }
  },
  [CREATE_BUCKETLIST_FAILURE]: (state, { payload: info }) => {
    return {
      ...state,
      create: {
        ...state.create,
        status: 'FAILURE',
        error: info
      }
    }
  },

  [EDIT_BUCKETLIST]: (state, action) => {
    return {
      ...state,
      edit: {
        ...state.edit,
        status: 'WAITING'
      }
    }
  },
  [EDIT_BUCKETLIST_SUCCESS]: (state, action) => {
    return {
      ...state,
      edit: {
        ...state.edit,
        status: 'SUCCESS'
      }
    }
  },
  [EDIT_BUCKETLIST_FAILURE]: (state, { payload: info }) => {
    return {
      ...state,
      edit: {
        ...state.edit,
        status: 'FAILURE',
        error: info
      }
    }
  },

  [GET_BUCKETLIST]: (state, action) => {
    return {
      ...state,
      data: {
        ...state.data,
        status: 'WAITING'
      }
    }
  },
  [GET_BUCKETLIST_SUCCESS]: (state, { payload: info }) => {
    const newInfo = {
      ...info,
      dueDate: info.dueDate.slice(0, 10)
    };

    return {
      ...state,
      data: {
        ...state.data,
        status: 'SUCCESS',
        info: [].concat(newInfo)
      }
    }
  },
  [GET_BUCKETLIST_FAILURE]: (state, { payload: info }) => {
    return {
      ...state,
      data: {
        ...state.data,
        status: 'FAILURE',
        error: info
      }
    }
  },

  [GET_BUCKETLISTS]: (state, action) => {
    return {
      ...state,
      data: {
        ...state.data,
        status: 'WAITING'
      }
    }
  },
  [GET_BUCKETLISTS_SUCCESS]: (state, { payload: datas }) => {
    const newInfo = datas.map( data => ({
      ...data,
      dueDate: data.dueDate.slice(0, 10)
    }));
    
    return {
      ...state,
      data: {
        ...state.data,
        status: 'SUCCESS',
        info: [].concat(newInfo)
      }
    }
  },
  [GET_BUCKETLISTS_FAILURE]: (state, { payload: info }) => {
    return {
      ...state,
      data: {
        ...state.data,
        status: 'FAILURE',
        error: info
      }
    }
  }
}, initialState);