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

const GET_POSTS = 'post/GET_POSTS';
const GET_POSTS_SUCCESS = 'post/GET_POSTS_SUCCESS';
const GET_POSTS_FAILURE = 'post/GET_POSTS_FAILURE';

const DELETE_POST = 'post/DELETE_POST';
const DELETE_POST_SUCCESS = 'post/DELETE_POST_SUCCESS';
const DELETE_POST_FAILURE = 'post/DELETE_POST_FAILURE';

// 액션 생성 함수
export const createPostRequest = (title, content, tags, files, openRange) => {
  return (dispatch) => {
    dispatch(createPost());

    let formData = new FormData();

    files.forEach( (file, index) => {
      console.log(file);
      formData.append('files', file, file.name);
    });

    formData.append('title', title);
    formData.append('content', content);
    formData.append('tags', tags);
    formData.append('files', files);
    formData.append('openRange', openRange);

    return axios.post('/api/articles/', formData)
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

    return axios.put(`/api/posts/${id}`, {
      title, content, tags, files, openRange
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

    return axios.get(`/api/posts/${id}`)
      .then( response => {
        // successed
        console.log(response);
        dispatch(getPostSuccess(response.data));
      }).catch( error => {
        // failed
        console.log(error);
        //dispatch(getPostFailure(error.response.data));
      });
  }
};
export const getPost = createAction(GET_POST);
export const getPostSuccess = createAction(GET_POST_SUCCESS);
export const getPostFailure = createAction(GET_POST_FAILURE);

export const getPostsRequest = () => {
  return (dispatch) => {
    dispatch(getPosts());

    return axios.get('/api/posts/').then( response => {
      dispatch(getPostsSuccess(response.data));
    }).catch( error => {
      dispatch(getPostsFailure(error.response.data));
    });
  }
}
export const getPosts = createAction(GET_POSTS);
export const getPostsSuccess = createAction(GET_POSTS_SUCCESS);
export const getPostsFailure = createAction(GET_POSTS_FAILURE);

export const deletePostRequest = (id) => {
  return (dispatch) => {
    dispatch(deletePost());

    return axios.delete(`/api/posts/${id}`).then( response => {
      dispatch(deletePostSuccess());
    }).catch( error => {
      dispatch(deletePostFailure(error.response.data));
    });
  }
}
export const deletePost = createAction(DELETE_POST);
export const deletePostSuccess = createAction(DELETE_POST_SUCCESS);
export const deletePostFailure = createAction(DELETE_POST_FAILURE);

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
  delete: {
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
    return {
      ...state,
      data: {
        ...state.data,
        status: 'SUCCESS',
        info: [].concat(info)
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

  [GET_POSTS]: (state, action) => {
    return {
      ...state,
      data: {
        ...state.data,
        status: 'WAITING'
      }
    }
  },
  [GET_POSTS_SUCCESS]: (state, { payload: datas }) => {
    return {
      ...state,
      data: {
        ...state.data,
        status: 'SUCCESS',
        info: datas
      }
    }
  },
  [GET_POSTS_FAILURE]: (state, { payload: info }) => {
    return {
      ...state,
      data: {
        ...state.data,
        status: 'FAILURE',
        error: info
      }
    }
  },

  [DELETE_POST]: (state, action) => {
    return {
      ...state,
      delete: {
        ...state.delete,
        status: 'WAITING'
      }
    };
  },
  [DELETE_POST_SUCCESS]: (state, action) => {
    return {
      ...state,
      delete: {
        ...state.delete,
        status: 'SUCCESS'
      }
    };
  },
  [DELETE_POST_FAILURE]: (state, { payload: info }) => {
    return {
      ...state,
      delete: {
        ...state.delete,
        status: 'FAILURE'
      }
    };
  }
}, initialState);