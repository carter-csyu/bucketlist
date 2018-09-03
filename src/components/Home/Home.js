import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Home.css';
import ArticleList from 'components/Article/ArticleList';
import ArticleListContainer from 'containers/Article/ArticleListContainer';

const Home = () => {
  const action = {
    name: 'HOME'
  };
  
  return (
    <div>
      <header className="page-header">
        <div className="logo">Bucket list</div>
        <div className="add-btn">
          <i className="material-icons dropdown-trigger"
            data-target="dropdown-home-header"
            ref={
              (ref) => {
                window.M.Dropdown.init(ref, {
                  contrainWidth: true
                });
              }
            }  
          >add</i>
        </div>
        <ul id='dropdown-home-header' className='dropdown-content'>
          <li><Link to='/bucketlist/new'>버킷리스트 작성하기</Link></li>
          <li><Link to='/post/new'>게시글 작성하기</Link></li>
          <li><a>취소</a></li>
        </ul>
      </header>
      <ArticleListContainer
        action={action}
      />
    </div>
  )
};

Home.propTypes = {
  session: PropTypes.shape({
    email: PropTypes.string,
    nickname: PropTypes.string
  }),
  articles: PropTypes.array,
  onRemoveArticle: PropTypes.func,  
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onAddComment: PropTypes.func,
  onClickLike: PropTypes.func,
  onClickComment: PropTypes.func,
  onClickShare: PropTypes.func,
  onRouteToArticle: PropTypes.func,
  onFollowStatus: PropTypes.func,
  onClickViewMore: PropTypes.func,
};

Home.defaultProps = {
  session: {},
  articles: [],
  onRemoveArticle: () => console.warn('onRemoveArticle not defined'),
  onChange: () => console.warn('onChange not defined'),
  onKeyDown: () => console.warn('onKeyDown not defined'),
  onAddComment: () => console.warn('onAddComment not defined'),
  onClickLike: () => console.warn('onClickLike not defined'),
  onClickComment: () => console.warn('onclickComment not defined'),
  onClickShare: () => console.warn('onClickShare not defined'),
  onRouteToArticle: () => console.warn('onRouteToArticle not defined'),
  onFollowStatus: () => console.warn('onFollowStatus not defined'),
  onClickViewMore: () => console.warn('onClickViewMore not defined')
};

export default Home;