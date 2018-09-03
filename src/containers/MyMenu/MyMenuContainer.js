import React, { Component } from 'react';
import MyMenu from 'components/MyMenu';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'store/modules/auth';
import * as articleActions from 'store/modules/article';

class MyMenuContainer extends Component {
  state = {
    type: 'bucketlist',
    nickname: ''
  }

  handleClickSignout = () => {
    const { AuthActions } = this.props;

    AuthActions.signoutRequest().then(
      () => {
        const { status, error } = this.props;

        if (status !== 'SUCCESS') {
          window.M.toast({
            html: error.message
          });
          return;
        }
      }
    );
  }

  handleClickMenu = (id) => {
    const { ArticleActions } = this.props;
    ArticleActions.clearArticle();

    this.setState({
      active: id
    });

    switch(id) {
      case 1: 
        this.getArticlesByType('bucketlist');
        break;
      case 2: 
        this.getArticlesByType('post');
        break;
      case 3: 
        break;
      case 4: 
        break;
      default:
        break;
    }
  }

  getArticlesByType = (type) => {
    const { ArticleActions, session, page } = this.props;

    ArticleActions.getArticlesRequest({ 
      userId: session._id,
      type: type,
      page
    }).then(
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

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.type !== prevState.type) {
      return {
        type: nextProps.type
      };
    }

    if (nextProps.nickname !== prevState.nickname) {
      return {
        nickanme: nextProps.nickname
      };
    }

    return null;
  }

  componentDidMount() {
    const { AuthActions, nickname } = this.props;

    if (nickname) {
      AuthActions.getPeopleinfoRequest(nickname);
    } else {
      AuthActions.getUserinfoRequest();
    }
  }

  render() {
    const { handleClickMenu, handleClickSignout } = this;
    const { type } = this.state;
    const { session, people } = this.props;

    return (
      <MyMenu
        session={session}
        type={type}
        people={people}
        onClickMenu={handleClickMenu}
        onClickSignout={handleClickSignout}
      />
    )
  }
}

export default connect(
  ({article, auth}) => ({
    articles: article.articles,
    page: article.page,
    status: article.status,
    error: article.error,
    session: auth.user.info,
    user: auth.user,
    people: auth.people
  }),
  (dispatch) => ({
    AuthActions: bindActionCreators(authActions, dispatch),
    ArticleActions: bindActionCreators(articleActions, dispatch)
  })
)(MyMenuContainer);