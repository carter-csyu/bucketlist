import React, { Component } from 'react';
import Article from 'components/Article/Article';
import ArticleView from 'components/Article/ArticleView';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as articleActions from 'store/modules/article';

class ArticleViewContainer extends Component {

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
    )
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

  handleCopyLink = (id) => {
    const { ArticleActions } = this.props;

    ArticleActions.copyLink(id);

    window.M.toast({
      html: '링크 복사하기'
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

  handleRemoveArticle = (id) => {
    const { ArticleActions, history } = this.props;

    ArticleActions.removeArticleRequest(id).then(
      () => {
        const { status, error } = this.props;

        if (status !== 'SUCCESS') {
          window.M.toast({
            html: error.message
          });
        } else {
          window.M.toast({
            html: '삭제되었습니다'
          });

          history.goBack();
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

  handleClickViewMore = (id) => {
    const { ArticleActions } = this.props;

    ArticleActions.viewMore(id);
  } 

  componentDidMount() {
    const { ArticleActions, match } = this.props;

    ArticleActions.getArticleRequest(match.params.id).then(
      () => {
        const { status } = this.props;

        if (status === "SUCCESS") {
             
        } else {
          window.M.toast({
            html: '해당 게시글을 찾을 수 없습니다'
          });
        }
      }
    );
  }
  
  render() {
    const { history, articles, session } = this.props;
    const {
      handleRemoveArticle,
      handleClickLike,
      handleClickComment,
      handleClickShare,
      handleRouteToArticle,
      handleCopyLink,
      handleFollowStatus,
      handleChange,
      handleKeyDown,
      handleAddComment,
      handleRemoveComment,
      handleClickViewMore
    } = this;

    return (
      <ArticleView
        history={history}
        session={session}
        article={articles[0]}
        onRemoveArticle={handleRemoveArticle}
        onClickLike={handleClickLike}
        onClickComment={handleClickComment}
        onClickShare={handleClickShare}
        onRouteToPost={handleRouteToArticle}
        onCopyLink={handleCopyLink}
        onFollowStatus={handleFollowStatus}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onAddComment={handleAddComment}
        onRemoveComment={handleRemoveComment}
        onClickViewMore={handleClickViewMore} />
    )
  }
}

export default connect(
  ({article, auth}) => ({
    articles: article.articles,
    status: article.status,
    error: article.error,
    session: auth.user.info
  }),
  (dispatch) => ({
    ArticleActions: bindActionCreators(articleActions, dispatch)
  })
)(ArticleViewContainer);