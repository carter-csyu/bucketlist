import { createAction, handleActions } from 'redux-actions';
import axios from 'axios';

// 액션 타입 정의
const HANDLE_LIKE = 'article/HANDLE_LIKE';
const HANDLE_COMMENT = 'article/HANDLE_COMMENT';
const HANDLE_FOLLOW = 'article/HANDLE_FOLLOW';
const HANDLE_CHANGE = 'article/HANDLE_CHANGE';
const HANDLE_KEYDOWN = 'article/HANDLE_KEYDOWN';
const SHARE = 'article/SHARE';
const ROUTE = 'article/ROUTE';
const COPY_LINK = 'article/COPY_LINK';
const ADD_COMMENT = 'article/ADD_COMMENT';
const REMOVE_COMMENT = 'article/REMOVE_COMMENT'; 
const VIEW_MORE = 'article/VIEW_MORE';

const GET_ARTICLE = 'article/GET_ARTICLE';
const GET_ARTICLE_SUCCESS = 'article/GET_ARTICLE_SUCCESS';
const GET_ARTICLE_FAILURE = 'article/GET_ARTICLE_FAILURE';

// 액션 생성 함수
export const handleLike = createAction(HANDLE_LIKE, (id, session) => ({id, session}));
export const handleComment = createAction(HANDLE_COMMENT, id => id);
export const handleFollow = createAction(HANDLE_FOLLOW, id => id);
export const handleChange = createAction(HANDLE_CHANGE, (id, value) => ({id, value}));
export const share = createAction(SHARE, id => id);
export const route = createAction(ROUTE, id => id);
export const copyLink = createAction(COPY_LINK, id => id);
export const addComment = createAction(ADD_COMMENT, (id, session) => ({id, session}));
export const removeComment = createAction(REMOVE_COMMENT, (id, commentId) => ({id, commentId}));
export const viewMore = createAction(VIEW_MORE, id => id);

export const getArticleRequest = (type, id) => {
  return (dispatch) => {
    dispatch(getArticle());

    return axios.get(`/api/articles/${type}/${id}`)
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

// 초기 상태 정의
const initialState = {
  status: 'INIT',
  error: {},
  articles: [
    {
      id: 1,
      type: 2,
      writer: {
        name: 'chunsang.yu',
        profileImage: 'https://materializecss.com/images/yuna.jpg'
      },
      title: '어딘가의 호수',
      content: '어딘가의 호수',
      items: [],
      folding: false,
      openRange: '1',
      chips: ['호수'],
      files: [{
        src: 'https://materializecss.com/images/sample-1.jpg'
      },{
        src: 'https://materializecss.com/images/yuna.jpg'
      }],
      likes: [{
        email: "chunsang.yu@gmail.com",
        nickname: "chunsang.yu"
      }, {
        email: "chundol42@github.com",
        nickname: "chundol42"
      }],
      comments: [{
        id: 0,
        email: "chunsang.yu@gmail.com",
        nickname: "chunsang.yu",
        content: "어디에 위치한 호수인가요?"
      }, { 
        id: 1,
        email: "chundol42@github.com",
        nickname: "chundol42",
        content: "저도 궁금해요"
      }],
      comment: '',
      commentActive: false
    }, {
      id: 2,
      type: 1,
      writer: {
        name: 'chunsang.yu',
        profileImage: 'https://materializecss.com/images/yuna.jpg'
      },
      title: '2018년도 버킷리스트',
      content: '',
      items: [{
        id: 0,
        name: '광교산 등산하기',
        done: false
      }, {
        id: 1,
        name: '재취업 성공하기',
        done: false
      }, {
        id: 2,
        name: '혼자 여행가기',
        done: false
      }, {
        id: 3,
        name: '버킷리스트 완성하기',
        done: false
      }],
      folding: false,
      openRange: '1',
      chips: ['버킷리스트'],
      files: [],
      likes: [{
        email: "chunsang.yu@gmail.com",
        nickname: "chunsang.yu"
      }, {
        email: "chundol42@github.com",
        nickname: "chundol42"
      }],
      comments: [{
        id: 0,
        email: "chunsang.yu@gmail.com",
        nickname: "chunsang.yu",
        content: "꼭 성공할거에요 : )"
      }, {
        id: 1,
        email: "chundol42@github.com",
        nickname: "chundol42",
        content: "성공하세요!"
      }],
      comment: '',
      commentActive: false
    }
  ]
}

// 리듀서
export default handleActions({
  [HANDLE_LIKE]: (state, action) => {
    const { id, session } = action.payload;
    const { articles } = state;
    const index = articles.findIndex(article => article.id === id);
    const likeIndex = articles[index].likes.findIndex(like => like.email === session.email);

    if (likeIndex > -1) {
      return {
        articles: [
          ...articles.slice(0, index),
          {
            ...articles[index],
            likes: [
              ...articles[index].likes.slice(0, likeIndex),
              ...articles[index].likes.slice(likeIndex + 1, articles[index].length)
            ]
          },
          ...articles.slice(index + 1, articles.length)
        ]
      }
    } else {
      return {
        articles: [
          ...articles.slice(0, index),
          {
            ...articles[index],
            likes: [
              ...articles[index].likes.slice(0, articles[index].likes.length),
              {
                email: "chunsang.yu@gmail.com",
                nickname: "chunsang.yu"
              }
            ]
          },
          ...articles.slice(index + 1, articles.length)
        ]
      }
    }
  },
  [HANDLE_COMMENT]: (state, { payload: id }) => {
    const { articles } = state;
    const index = articles.findIndex(article => article.id === id);

    return {
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
    const index = articles.findIndex(article => article.id === id);

    return state;
  },
  [HANDLE_CHANGE]: (state, action) => {
    const { id, value } = action.payload;
    const { articles } = state;
    const index = articles.findIndex(article => article.id === id);

    return {
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
    const index = articles.findIndex(article => article.id === id);
    
    return state;
  },
  [ROUTE]: (state, { payload: id }) => {
    const { articles } = state;
    const index = articles.findIndex(article => article.id === id);
    
    return state;
  },
  [COPY_LINK]: (state, { payload: id }) => {
    const { articles } = state;
    const index = articles.findIndex(article => article.id === id);
    
    return state;
  },
  [ADD_COMMENT]: (state, action) => {
    const { id, session } = action.payload;
    const { articles } = state;
    const index = articles.findIndex(article => article.id === id);
    
    return {
      articles: [
        ...articles.slice(0, index),
        {
          ...articles[index],
          comments: [
            ...articles[index].comments,
            {
              id: articles[index].comments[articles[index].comments.length - 1].id + 1,
              email: session.email,
              nickname: session.nickname,
              content: articles[index].comment
            }
          ],
          comment: ''
        },
        ...articles.slice(index + 1, articles.length)
      ]
    };
  },
  [REMOVE_COMMENT]: (state, action) => {
    const { id, commentId } = action.payload;
    const { articles } = state;
    const index = articles.findIndex(article => article.id === id);
    
    return {
      articles: [
        ...articles.slice(0, index),
        {
          ...articles[index],
          comments: [
            ...articles[index].comments.filter(
              comment => comment.id !== commentId
            )
          ]
        },
        ...articles.slice(index + 1, articles.length)
      ]
    };
  },
  [VIEW_MORE]: (state, { payload: id }) => {
    const { articles } = state;
    const index = articles.findIndex(article => article.id === id);
    
    return {
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
      articles: [].concat(article)
    })
  },
  [GET_ARTICLE_FAILURE]: (state, { payload: info }) => {
    return ({
      ...state,
      status: 'FAILURE',
      error: info
    })
  }
}, initialState);