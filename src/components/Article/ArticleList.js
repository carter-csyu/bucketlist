import React from 'react';
import PropTypes from 'prop-types';
import Article from './Article';

const ArticleList = ({
  session,
  articles,
  onRemoveArticle,
  onChange,
  onKeyDown,
  onAddComment,
  onClickLike,
  onClickComment,
  onRemoveComment,
  onClickShare,
  onRouteToArticle,
  onFollowStatus,
  onClickViewMore,
  onClickNext
}) => {

  const articleList = articles.map(
    (article) => {
      return (
        <Article
          key={article._id}
          session={session}
          article={article}
          onRemoveArticle={onRemoveArticle}
          onClickLike={onClickLike}
          onClickComment={onClickComment}
          onClickShare={onClickShare}
          onRouteToArticle={onRouteToArticle}
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
      <div className="waves-effect waves-indigo btn btn-flat more-articles"
        onClick={onClickNext}
      >게시글 더 보기</div>
    </div>
  );
}

ArticleList.propTypes = {
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
  onClickNext: PropTypes.func,
};

ArticleList.defaultProps = {
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
  onClickViewMore: () => console.warn('onClickViewMore not defined'),
  onClickNext: () => console.warn('onClickNext not defined')
};

export default ArticleList;