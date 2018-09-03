import React, { Component } from 'react';
import Home from 'components/Home';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as articleActions from 'store/modules/article';

class HomeContainer extends Component {
  render() {
    return (
      <Home />
    )
  }
}

export default connect(
  ({ article,  auth }) => ({
    articles: article.articles,
    status: article.status,
    error: article.error,
    session: auth.user.info
  }),
  (dispatch) => ({
    ArticleActions: bindActionCreators(articleActions, dispatch)
  })
)(HomeContainer);