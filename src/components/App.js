import React, { Component } from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import AuthRoute from 'AuthRoute';
import SignInContainer from 'containers/Auth/SignInContainer';
import SignUpContainer from 'containers/Auth/SignUpContainer';
import MainContainer from 'containers/MainContainer';
import BucketListContainer from 'containers/BucketList/BucketListContainer';
import PostContainer from 'containers/Post/PostContainer';
import ArticleViewContainer from 'containers/Article/ArticleViewContainer';
import ArticleListContainer from 'containers/Article/ArticleListContainer';
import ProfileContainer from 'containers/MyMenu/ProfileContainer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'store/modules/auth';
import storage from 'lib/storage';

class App extends Component {

  componentWillMount() {
    /*
    const userInfo = storage.get('userInfo');
    if (!userInfo) return;

    const { AuthActions } = this.props;
    //AuthActions.setUserinfo(userInfo);
    */

    const { AuthActions } = this.props;
    AuthActions.getUserinfoRequest().then(
      () => {
        const { user } = this.props;

        if ( typeof user.info.email !== "undefined") {
          // 세션 정보 존재
          /*
          window.M.toast({
            html: JSON.stringify(user, undefined, 4)
          })
          */
        }
      }
    );
  } 

  render() {
    return ( 
      <Router>
        <div>
          <Switch>
            <Route exact path="/signin" component={SignInContainer} />
            <Route exact path="/signup" component={SignUpContainer} />
            
            <AuthRoute exact path="/" component={MainContainer} />
            <AuthRoute path="/home" component={MainContainer} />
            <AuthRoute path="/search" component={MainContainer} />
            <AuthRoute path="/status" component={MainContainer} />
            <AuthRoute path="/mentoring" component={MainContainer} />
            <AuthRoute path="/article/:id" component={ArticleViewContainer} />
            <AuthRoute path="/post/edit/:id" component={PostContainer} />
            <AuthRoute path="/post/new" component={PostContainer} />
            <AuthRoute path="/bucketlist/new" component={BucketListContainer} />
            <AuthRoute path="/bucketlist/edit/:id" component={BucketListContainer} />
            <AuthRoute path="/account/edit" component={ProfileContainer} />
            
            <AuthRoute path="/:nickname/:type" component={MainContainer} />
            <AuthRoute path="/:nickname" component={MainContainer} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default connect(
  ({auth}) => ({
    user: auth.user
  }),
  (dispatch) => ({
    AuthActions: bindActionCreators(authActions, dispatch)
  })
)(App);