import React from 'react';
import PropTypes from 'prop-types';
import Article from './Article';

const ArticleView = ({
  history,
  session,
  article,
  onRemoveArticle,
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
  return (
    <div className="ArticleView">
      <header className="page-header">
        <i 
          className="back-btn material-icons indigo-text text-darken-4"
          onClick={() => {
            history.goBack();
          }}
        >arrow_back</i>
        <div className="title">뒤로가기</div>
      </header>
      <Article
        session={session}
        article={article}
        onRemoveArticle={onRemoveArticle}
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
        onClickViewMore={onClickViewMore}
      />
    </div>
  )
};

export default ArticleView;