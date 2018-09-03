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
    const { ArticleActions } = this.props;
    
    this.setState({
      keyword: search
    }, () => {
      ArticleActions.getArticlesRequest({keyword: search}).then(
        () => {
          const { status } = this.props;
  
          if (status !== "SUCCESS") {
            window.M.toast({
              html: '등록된 게시글이 없습니다'
            });
          }
        }
      );
    });
  }

  componentDidMount() {
    const { ArticleActions } = this.props;

    ArticleActions.clearArticle();
  }

  render() {
    const { search } = this.state;
    const {
      handleSearchChange,
      handleSearchKeyDown 
    } = this;

    return (
      <Search
        search={search}
        onSearchChange={handleSearchChange}
        onSearchKeyDown={handleSearchKeyDown}
      />
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
)(SearchContainer);