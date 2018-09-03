import { createAction, handleActions } from 'redux-actions';
import axios from 'axios';

// 액션 타입 정의
const HANDLE_COMMENT = 'article/HANDLE_COMMENT';
const HANDLE_FOLLOW = 'article/HANDLE_FOLLOW';
const HANDLE_CHANGE = 'article/HANDLE_CHANGE';
const SHARE = 'article/SHARE';
const ROUTE = 'article/ROUTE';
const COPY_LINK = 'article/COPY_LINK';
const VIEW_MORE = 'article/VIEW_MORE';

const CLEAR_ARTICLE = 'article/CLEAR_ARTICLE';

const GET_ARTICLE = 'article/GET_ARTICLE';
const GET_ARTICLE_SUCCESS = 'article/GET_ARTICLE_SUCCESS';
const GET_ARTICLE_FAILURE = 'article/GET_ARTICLE_FAILURE';

const GET_ARTICLES = 'article/GET_ARTICLES';
const GET_ARTICLES_SUCCESS = 'article/GET_ARTICLES_SUCCESS';
const GET_ARTICLES_FAILURE = 'article/GET_ARTICLES_FAILURE';
``
const REMOVE_ARTICLE = 'article/REMOVE_ARTICLE';
const REMOVE_ARTICLE_SUCCESS = 'article/REMOVE_ARTICLE_SUCCESS';
const REMOVE_ARTICLE_FAILURE = 'article/REMOVE_ARTICLE_FAILURE';

const HANDLE_LIKE = 'article/HANDLE_LIKE';
const HANDLE_LIKE_SUCCESS = 'article/HANDLE_LIKE_SUCCESS';
const HANDLE_LIKE_FAILURE = 'article/HANDLE_LIKE_FAILURE';

const ADD_COMMENT = 'article/ADD_COMMENT';
const ADD_COMMENT_SUCCESS = 'article/ADD_COMMENT_SUCCESS';
const ADD_COMMENT_FAILURE = 'article/ADD_COMMENT_FAILURE';

const REMOVE_COMMENT = 'article/REMOVE_COMMENT';
const REMOVE_COMMENT_SUCCESS = 'article/REMOVE_COMMENT_SUCCESS';
const REMOVE_COMMENT_FAILURE = 'article/REMOVE_COMMENT_FAILURE';

// 액션 생성 함수
export const handleComment = createAction(HANDLE_COMMENT, id => id);
export const handleFollow = createAction(HANDLE_FOLLOW, id => id);
export const handleChange = createAction(HANDLE_CHANGE, (id, value) => ({id, value}));
export const share = createAction(SHARE, id => id);
export const route = createAction(ROUTE, id => id);
export const copyLink = createAction(COPY_LINK, id => id);
export const viewMore = createAction(VIEW_MORE, id => id);
export const clearArticle = createAction(CLEAR_ARTICLE);

export const removeArticleRequest = (id) => {
  return (dispatch) => {
    dispatch(removeArticle());

    return axios.delete(`/api/articles/${id}`)
    .then( response => {
      console.log(response);
      dispatch(removeArticleSuccess(response.data));
    }).catch( error => {
      console.log(error);
      dispatch(removeArticleFailure(error.response.data));
    });
  }
}
export const removeArticle = createAction(REMOVE_ARTICLE);
export const removeArticleSuccess = createAction(REMOVE_ARTICLE_SUCCESS);
export const removeArticleFailure = createAction(REMOVE_ARTICLE_FAILURE);

export const addCommentRequest = (id, comment) => {
  return (dispatch) => {
    dispatch(addComment(id));

    return axios.post(`/api/articles/${id}/comments`, {
      content: comment
    }).then( response => {
      console.log(response);
      dispatch(addCommentSuccess(response.data));
    }).catch( error => {
      console.log(error);
      dispatch(addCommentFailure(error.response.data));
    })
  }
}
export const addComment = createAction(ADD_COMMENT);
export const addCommentSuccess = createAction(ADD_COMMENT_SUCCESS);
export const addCommentFailure = createAction(ADD_COMMENT_FAILURE);

export const removeCommentRequest = (id, commentId) => {
  return (dispatch) => {
    dispatch(removeComment());

    return axios.delete(`/api/articles/${id}/comments/${commentId}`).then( response => {
      console.log(response);
      dispatch(removeCommentSuccess(response.data));
    }).catch( error => { 
      console.log(error);
      dispatch(removeCommentFailure(error.response.data));
    });
  }
};
export const removeComment = createAction(REMOVE_COMMENT);
export const removeCommentSuccess = createAction(REMOVE_COMMENT_SUCCESS);
export const removeCommentFailure = createAction(REMOVE_COMMENT_FAILURE);


export const handleLikeRequest = (id) => {
  return (dispatch) => {
    dispatch(handleLike());

    return axios.post(`/api/articles/${id}/likes`)
    .then( response => {
      console.log(response);
      dispatch(handleLikeSuccess(response.data));
    }).catch( error => {
      console.log(error);
      dispatch(handleLikeFailure(error.response.data));
    });
  }
};
export const handleLike = createAction(HANDLE_LIKE);
export const handleLikeSuccess = createAction(HANDLE_LIKE_SUCCESS);
export const handleLikeFailure = createAction(HANDLE_LIKE_FAILURE);

export const getArticleRequest = (id) => {
  return (dispatch) => {
    dispatch(getArticle());

    return axios.get(`/api/articles/${id}`)
      .then( response => {
        console.log(response);
        dispatch(getArticleSuccess(response.data));
      }).catch( error => { 
        console.log(error);
        dispatch(getArticleFailure(error.response.data));
      });
  }
}
export const getArticle = createAction(GET_ARTICLE);
export const getArticleSuccess = createAction(GET_ARTICLE_SUCCESS);
export const getArticleFailure = createAction(GET_ARTICLE_FAILURE);

export const getArticlesRequest = (req = {}) => {
  return (dispatch) => {
    // 사용자, 키워드, 열람범위, 버킷리스트, 포스트 등
    const { userId, keyword, openRange, type, page } = req;
    let query = JSON.stringify(req) !== '{}' ? '?' : '';

    query += userId === undefined ? '' : `&user=${userId}`;
    query += page === undefined ? '&page=1' : `&page=${page}`
    query += keyword === undefined ? '' : `&search=${keyword}`;
    query += openRange === undefined ? '' : `&openRange=${openRange}`;
    query += type === undefined ? '' : `&type=${type}`;

    dispatch(getArticles());
    return axios.get(`/api/articles${query}`)
      .then( response => {
        let articles = [].concat(response.data);
        console.log(articles);

        dispatch(getArticlesSuccess(response.data));
      }).catch( error => {
        dispatch(getArticlesFailure(error.response.data));
      });
  }
};
export const getArticles = createAction(GET_ARTICLES);
export const getArticlesSuccess = createAction(GET_ARTICLES_SUCCESS);
export const getArticlesFailure = createAction(GET_ARTICLES_FAILURE);

// 초기 상태 정의
const initialState = {
  status: 'INIT',
  error: {},
  page: 1,
  articles: []
}

// 리듀서
export default handleActions({
  [CLEAR_ARTICLE]: (state, action) => {
    return {
      ...state,
      page: 1,
      articles: []
    }
  },

  [REMOVE_ARTICLE]: (state, action) => {
    return {
      ...state,
      status: 'WAITING'
    };
  },
  [REMOVE_ARTICLE_SUCCESS]: (state, { payload: result }) => {
    const { articles } = state;
    
    return {
      ...state,
      articles: articles.filter(article => article._id !== result._id),
      status: 'SUCCESS'
    }
  },
  [REMOVE_ARTICLE_FAILURE]: (state, { payload: info }) => {
    return {
      ...state,
      status: 'FAILURE',
      error: info
    }
  },
  [HANDLE_LIKE]: (state, action) => ({
    ...state,
    status: 'WAITING'
  }),
  [HANDLE_LIKE_SUCCESS]: (state, { payload: result}) => {
    const { articles } = state;
    const index = articles.findIndex(article => article._id === result._id);

    return {
      ...state,
      articles: [
        ...articles.slice(0, index),
        {
          ...result,
          comment: ''
        },
        ...articles.slice(index + 1)
      ],
      status: 'SUCCESS'
    };
  },
  [HANDLE_LIKE_FAILURE]: (state, { payload: info }) => ({
    ...state,
    status: 'FAILURE',
    error: info
  }),
  [HANDLE_COMMENT]: (state, { payload: id }) => {
    const { articles } = state;
    const index = articles.findIndex(article => article._id === id);

    return {
      ...state,
      articles: [
        ...articles.slice(0, index),
        {
          ...articles[index],
          commentActive: !articles[index].commentActive
        },
        ...articles.slice(index + 1, articles.length)
      ]
    };
  },
  [HANDLE_FOLLOW]: (state, { payload: id }) => {
    const { articles } = state;
    const index = articles.findIndex(article => article._id === id);

    return state;
  },
  [HANDLE_CHANGE]: (state, action) => {
    const { id, value } = action.payload;
    const { articles } = state;
    const index = articles.findIndex(article => article._id === id);

    return {
      ...state,
      articles: [
        ...articles.slice(0, index),
        {
          ...articles[index],
          comment: value
        },
        ...articles.slice(index + 1, articles.length)
      ]
    };
  },
  [SHARE]: (state, { payload: id }) => {
    const { articles } = state;
    const index = articles.findIndex(article => article._id === id);
    
    return state;
  },
  [ROUTE]: (state, { payload: id }) => {
    const { articles } = state;
    const index = articles.findIndex(article => article._id === id);
    
    return state;
  },
  [COPY_LINK]: (state, { payload: id }) => {
    const { articles } = state;
    const index = articles.findIndex(article => article._id === id);
    
    return state;
  },
  [ADD_COMMENT]: (state, action) => ({
    ...state, 
    status: 'WAITING'
  }),
  [ADD_COMMENT_SUCCESS]: (state, { payload: result }) => {
    const { articles } = state;
    const index = articles.findIndex(article => article._id === result._id);
    
    return {
      ...state,
      status: 'SUCCESS',
      articles: [
        ...articles.slice(0, index),
        {
          ...result,
          comment: ''
        },
        ...articles.slice(index + 1, articles.length)
      ]
    }
  },
  [ADD_COMMENT_FAILURE]: (state, { payload: info}) => ({
    ...state,
    status: 'FAILURE',
    error: info
  }),
  [REMOVE_COMMENT]: (state, action) => ({
    ...state,
    status: 'WAITING'
  }),
  [REMOVE_COMMENT_SUCCESS]: (state, { payload: result }) => {
    const { articles } = state;
    const index = articles.findIndex(article => article._id === result._id);
    
    return {
      ...state,
      status: 'SUCCESS',
      articles: [
        ...articles.slice(0, index),
        {
          ...result,
          comment: ''
        },
        ...articles.slice(index + 1, articles.length)
      ]
    }
  },
  [REMOVE_COMMENT_FAILURE]: (state, { payload: info }) => ({
    ...state,
    status: 'FAILURE',
    error: info
  }),
  [VIEW_MORE]: (state, { payload: id }) => {
    const { articles } = state;
    const index = articles.findIndex(article => article._id === id);
    
    return {
      ...state,
      articles: [
        ...articles.slice(0, index),
        {
          ...articles[index],
          folding: !articles[index].folding
        },
        ...articles.slice(index + 1, articles.length)
      ]
    };
  },
  [GET_ARTICLE]: (state, action) => {
    return ({
      ...state,
      status: 'WAITING'
    });
  },
  [GET_ARTICLE_SUCCESS]: (state, { payload: article }) => {
    return ({
      ...state,
      status: 'SUCCESS',
      articles: [{
        ...article,
        comment: ''
      }]
    })
  },
  [GET_ARTICLE_FAILURE]: (state, { payload: info }) => {
    return ({
      ...state,
      status: 'FAILURE',
      error: info
    })
  },
  [GET_ARTICLES]: (state, action) => {
    return ({
      ...state,
      status: 'WAITING'
    });
  },
  [GET_ARTICLES_SUCCESS]: (state, { payload: articles }) => {
    console.log(state);

    return ({
      ...state,
      page: state.page + 1,
      status: 'SUCCESS',
      articles: state.page === 1 ? articles : state.articles.concat(articles)
    })
  },
  [GET_ARTICLES_FAILURE]: (state, { payload: info }) => {
    return ({
      ...state,
      articles: state.page === 1 ? [] : state.articles,
      status: 'FAILURE',
      error: info
    })
  }
}, initialState);