import React, { Component } from 'react';
import Search from 'components/Search';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as articleActions from 'store/modules/article';

class SearchContainer extends Component {
  state = {
    search: '',
    keyword: '',
    session: {
      email: 'chunsang.yu@gmail.com',
      nickname: 'chunsang.yu'
    }
  }

  handleSearchChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.setState({
        search: ''
      });

      this.handleSearchArticles();
    }
  }

  handleSearchArticles = () => {
    const { search } = this.state;
    
    this.setState({
      keyword: search
    });
  }
  
  handleClickLike = (id) => {
    const { session } = this.state;
    const { ArticleActions } = this.props;
    
    ArticleActions.handleLike(id, session);
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

  handleAddComment = (id) => {
    const { session } = this.state;
    const { ArticleActions } = this.props;

    ArticleActions.addComment(id, session);
  }

  handleRemoveComment = (id, commentId) => {
    const { ArticleActions } = this.props;

    ArticleActions.removeComment(id, commentId);
  }

  handleClickViewMore = (id) => {
    const { ArticleActions } = this.props;

    ArticleActions.viewMore(id);
  }

  render() {
    const { search, keyword, session } = this.state;
    const { articles } = this.props;
    const {
      handleSearchChange,
      handleSearchKeyDown,
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

    const filteredArticles = articles.filter(
      article => article.chips.findIndex((chip) => {
        if (keyword === "") return -1;
        
        return chip.indexOf(keyword);
      })
    )

    return (
      <Search
        search={search}
        onSearchChange={handleSearchChange}
        onSearchKeyDown={handleSearchKeyDown}

        session={session}
        articles={filteredArticles}
        onClickLike={handleClickLike}
        onClickComment={handleClickComment}
        onClickShare={handleClickShare}
        onRouteToArticle={handleRouteToArticle}
        onCopyLink={handleCopyLink}
        onFollowStatus={handleFollowStatus}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onAddComment={handleAddComment}
        onRemoveComment={handleRemoveComment}
        onClickViewMore={handleClickViewMore}
      />
    )
  }
}

export default connect(
  ({article}) => ({
    articles: article.articles
  }),
  (dispatch) => ({
    ArticleActions: bindActionCreators(articleActions, dispatch)
  })
)(SearchContainer);