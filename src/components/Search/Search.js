import React from 'react';
import PropTypes from 'prop-types';
import './Search.css';
import ArticleListContainer from 'containers/Article/ArticleListContainer';

const Search = ({
  search,
  onSearchChange,
  onSearchKeyDown,
}) => {
  const action = {
    name: 'SEARCH'
  };

  return (
    <div>
      <nav className="search-bar white">
        <div className="nav-wrapper">
          <div className="input-field">
            <input 
              id="search" name="search" type="search" autoComplete="off" className="black-text"
              placeholder="검색"
              value={search}
              onChange={onSearchChange}
              onKeyDown={onSearchKeyDown}
            />
            <label className="label-icon" htmlFor="search">
              <i className="material-icons indigo-text darken-4">search</i>
            </label>
            <i className="material-icons">close</i>
          </div>
        </div>
      </nav>
      <ArticleListContainer action={action}/>
      {
        /*
        articles.length > 0 
        ? (
            <ArticleListContainer
            />
          )
        : (
            <h5>
              검색 결과 없음
            </h5>
          )
        */
      }
      
    </div>
  )
};

Search.propTypes = {
  search: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,

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
  onCopyLink: PropTypes.func,
  onFollowStatus: PropTypes.func,
  onClickViewMore: PropTypes.func,
};

Search.defaultProps = {
  search: '',
  onChange: () => console.warn('onChange not defined'),
  onKeyDown: () => console.warn('onKeyDown not defined'),

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
  onCopyLink: () => console.warn('onCopyLink not defined'),
  onFollowStatus: () => console.warn('onFollowStatus not defined'),
  onClickViewMore: () => console.warn('onClickViewMore not defined')
}

export default Search;