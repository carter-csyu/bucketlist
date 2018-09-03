import React, { Component } from 'react';
import ArticleList from 'components/Article/ArticleList';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as articleActions from 'store/modules/article';

class ArticleListContainer extends Component {
  handleRemoveArticle = (id) => {
    const { ArticleActions } = this.props;

    ArticleActions.removeArticleRequest(id).then(
      () => {
        const { status, error } = this.props;
        
        if (status !== 'SUCCESS') {
          window.M.toast({
            html: error.message
          })
        } else {
          window.M.toast({
            html: '삭제되었습니다'
          });
        }
      }
    );
  }

  handleClickLike = (id) => {
    const { ArticleActions } = this.props;
    
    ArticleActions.handleLikeRequest(id).then(
      () => {
        const { articles, status, error } = this.props;

        if (status !== "SUCCESS") {
          window.M.toast({
            html: error.message
          });
        }
      }
    );
  }

  handleAddComment = (id) => {
    const { ArticleActions, articles } = this.props;
    const index = articles.findIndex(article => article._id === id);

    ArticleActions.addCommentRequest(id, articles[index].comment).then(
      () => {
        const { articles, status, error } = this.props;

        if (status !== "SUCCESS") {
          window.M.toast({
            html: error.message
          });
        }
      }
    );
  }

  handleRemoveComment = (id, commentId) => {
    const { ArticleActions } = this.props;

    ArticleActions.removeCommentRequest(id, commentId).then(
      () => {
        const { articles, status, error } = this.props;

        if (status !== "SUCCESS") {
          window.M.toast({
            html: error.message
          });
        } else {
          window.M.toast({
            html: '삭제되었습니다'
          });
        }
      }
    );
  }
  
  handleClickComment = (id) => {
    const { ArticleActions } = this.props;
    
    ArticleActions.handleComment(id);
  }

  handleFollowStatus = (id) => {
    const { ArticleActions } = this.props;

    ArticleActions.handleFollow(id);

    window.M.toast({
      html: '팔로우 상태 변경'
    });
  }
  
  handleClickShare = (id) => {
    const { ArticleActions } = this.props;

    ArticleActions.share(id);

    window.M.toast({
      html: '공유 버튼 클릭'
    });
  }

  handleRouteToArticle = (id) => {
    const { ArticleActions } = this.props;

    ArticleActions.route(id);

    window.M.toast({
      html: '게시물로 이동되었습니다.'
    });
  }

  handleChange = (e, id) => {
    const { ArticleActions } = this.props;

    ArticleActions.handleChange(id, e.target.value);
  }

  handleKeyDown = (e, id) => {
    if (e.key === "Enter") {
      this.handleAddComment(id);
    }
  }

  handleClickViewMore = (id) => {
    const { ArticleActions } = this.props;

    ArticleActions.viewMore(id);
  }

  handleClickNext = () => {
    this.getArticles();
  }

  componentDidMount() {
    this.getArticles();
  }

  getArticles = () => {
    const { ArticleActions, session, action, page, type, people } = this.props;
    
    if (JSON.stringify(session) === '{}') return;

    switch (action.name) {
      case 'HOME': 
        ArticleActions.getArticlesRequest({page}).then(
          () => {
            const { status } = this.props;
    
            if (status !== "SUCCESS") {
              window.M.toast({
                html: '등록된 게시글이 없습니다'
              });
            }
          } 
        );
        break;
      case 'PROFILE':
        ArticleActions.getArticlesRequest({
          userId: people._id !== undefined ? people._id : session._id,
          type, 
          page})
        .then(
          () => {
            const { status } = this.props;

            if (status !== "SUCCESS") {
              window.M.toast({
                html: '등록된 게시글이 없습니다'
              });
            }
          }
        )
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.type !== this.props.type) {
      this.getArticles();
    }
  }

  render() {
    const { session, articles } = this.props;
    const {
      handleRemoveArticle,
      handleChange,
      handleKeyDown,
      handleAddComment,
      handleRemoveComment,
      handleClickComment,
      handleClickLike,
      handleClickShare,
      handleRouteToArticle,
      handleFollowStatus,
      handleClickViewMore,
      handleClickNext
    } = this;

    return (
      <ArticleList 
        session={session}
        articles={articles}
        onRemoveArticle={handleRemoveArticle}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onAddComment={handleAddComment}
        onRemoveComment={handleRemoveComment}
        onClickComment={handleClickComment}
        onClickLike={handleClickLike}
        onClickShare={handleClickShare}
        onRouteToArticle={handleRouteToArticle}
        onFollowStatus={handleFollowStatus}
        onClickViewMore={handleClickViewMore}
        onClickNext={handleClickNext}
      />
    )
  }
}

ArticleListContainer.defaultProps = {
  action: {
    name: 'HOME',
    type: '',
  }
};

ArticleListContainer.propTypes = {
  action: PropTypes.shape({
    name: PropTypes.string
  }),
  type: PropTypes.string
};

export default connect(
  ({article, auth}) => ({
    articles: article.articles,
    page: article.page,
    status: article.status,
    error: article.error,
    session: auth.user.info
  }),
  (dispatch) => ({
    ArticleActions: bindActionCreators(articleActions, dispatch)
  })
)(ArticleListContainer);