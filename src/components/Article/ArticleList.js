import React from 'react';
import PropTypes from 'prop-types';
import Article from './Article';

const ArticleList = ({
  session,
  articles,
  onChange,
  onKeyDown,
  onAddComment,
  onClickLike,
  onClickComment,
  onRemoveComment,
  onClickShare,
  onRouteToArticle,
  onCopyLink,
  onFollowStatus,
  onClickViewMore
}) => {

  const articleList = articles.map(
    (article) => {
      return (
        <Article
          key={article.id}
          session={session}
          article={article}
          onClickLike={onClickLike}
          onClickComment={onClickComment}
          onClickShare={onClickShare}
          onRouteToArticle={onRouteToArticle}
          onCopyLink={onCopyLink}
          onFollowStatus={onFollowStatus}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onAddComment={onAddComment}
          onRemoveComment={onRemoveComment}
          onClickViewMore={onClickViewMore} />
      )
    }
  );

  return (
    <div>
      {articleList}
    </div>
  );
}

ArticleList.propTypes = {
  session: PropTypes.shape({
    email: PropTypes.string,
    nickname: PropTypes.string
  }),
  articles: PropTypes.array,
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

ArticleList.defaultProps = {
  session: {},
  articles: [],
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
};

export default ArticleList;