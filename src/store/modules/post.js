import { createAction, handleActions } from 'redux-actions';
import axios from 'axios';

// 액션 타입 정의
const CREATE_POST = 'post/CREATE_POST';
const CREATE_POST_SUCCESS = 'post/CREATE_POST_SUCCESS';
const CREATE_POST_FAILURE = 'post/CREATE_POST_FAILURE';

const EDIT_POST = 'post/EDIT_POST';
const EDIT_POST_SUCCESS = 'post/EDIT_POST_SUCCESS';
const EDIT_POST_FAILURE = 'post/EDIT_POST_FAILURE';

const GET_POST = 'post/GET_POST';
const GET_POST_SUCCESS = 'post/GET_POST_SUCCESS';
const GET_POST_FAILURE = 'post/GET_POST_FAILURE';

// 액션 생성 함수
export const createPostRequest = (title, content, tags, files, openRange) => {
  return (dispatch) => {
    dispatch(createPost());

    let formData = new FormData();

    files.forEach( (file, index) => {
      console.log(file);
      formData.append('files', file, file.name);
    });

    /*
    return axios.post('/api/post/imageUpload',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data'} }
    ).then( response => {
      console.log('imageUpload');
      console.log(response);
    }).catch( error => {
      console.log(error);
    });
    */

    formData.append('title', title);
    formData.append('content', content);
    formData.append('tags', tags);
    formData.append('files', files);
    formData.append('openRange', openRange);

    return axios.post('/api/post/new', formData)
    .then( response => {
      // successed
      console.log(response);
      dispatch(createPostSuccess());
    }).catch( error => {
      // failed
      console.log(error);
      dispatch(createPostFailure(error.response.data));
    });
  }
};
export const createPost = createAction(CREATE_POST);
export const createPostSuccess = createAction(CREATE_POST_SUCCESS);
export const createPostFailure = createAction(CREATE_POST_FAILURE);

export const editPostRequest = (id, title, content, tags, files, openRange) => {
  return (dispatch) => {
    dispatch(editPost());

    return axios.post('/api/post/edit', {
      id, title, content, tags, files, openRange
    }).then( response => {
      // successed
      console.log(response);
      dispatch(editPostSuccess());
    }).catch( error => {
      // failed
      console.log(error);
      dispatch(editPostFailure(error.response.data));
    });
  }
};
export const editPost = createAction(EDIT_POST);
export const editPostSuccess = createAction(EDIT_POST_SUCCESS);
export const editPostFailure = createAction(EDIT_POST_FAILURE);

export const getPostRequest = (id) => {
  return (dispatch) => {
    dispatch(getPost());

    return axios.get(`/api/post/edit/${id}`)
      .then( response => {
        // successed
        console.log(response);
        dispatch(getPostSuccess(response.data));
      }).catch( error => {
        // failed
        console.log(error);
        dispatch(getPostFailure(error.response.data));
      });
  }
};
export const getPost = createAction(GET_POST);
export const getPostSuccess = createAction(GET_POST_SUCCESS);
export const getPostFailure = createAction(GET_POST_FAILURE);

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
    info: {},
    error: {}
  }
};

// 리듀서
// 리듀서
export default handleActions({
  [CREATE_POST]: (state, action) => {
    return {
      ...state,
      create: {
        ...state.create,
        status: 'WAITING'
      }
    }
  },
  [CREATE_POST_SUCCESS]: (state, action) => {
    return {
      ...state,
      create: {
        ...state.create,
        status: 'SUCCESS'
      }
    }
  },
  [CREATE_POST_FAILURE]: (state, { payload: info }) => {
    return {
      ...state,
      create: {
        ...state.create,
        status: 'FAILURE',
        error: info
      }
    }
  },

  [EDIT_POST]: (state, action) => {
    return {
      ...state,
      edit: {
        ...state.edit,
        status: 'WAITING'
      }
    }
  },
  [EDIT_POST_SUCCESS]: (state, action) => {
    return {
      ...state,
      edit: {
        ...state.edit,
        status: 'SUCCESS'
      }
    }
  },
  [EDIT_POST_FAILURE]: (state, { payload: info }) => {
    return {
      ...state,
      edit: {
        ...state.edit,
        status: 'FAILURE',
        error: info
      }
    }
  },

  [GET_POST]: (state, action) => {
    return {
      ...state,
      data: {
        ...state.data,
        status: 'WAITING'
      }
    }
  },
  [GET_POST_SUCCESS]: (state, { payload: info }) => {
    const newInfo = {
      ...info,
      dueDate: info.dueDate.slice(0, 10)
    };

    return {
      ...state,
      data: {
        ...state.data,
        status: 'SUCCESS',
        info: newInfo
      }
    }
  },
  [GET_POST_FAILURE]: (state, { payload: info }) => {
    return {
      ...state,
      data: {
        ...state.data,
        status: 'FAILURE',
        error: info
      }
    }
  },
}, initialState);