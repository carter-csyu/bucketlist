import React, { Component } from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import AuthRoute from 'AuthRoute';
import SignInContainer from 'containers/Auth/SignInContainer';
import SignUpContainer from 'containers/Auth/SignUpContainer';
import MainContainer from 'containers/MainContainer';
import BucketListContainer from 'containers/BucketList/BucketListContainer';
import PostContainer from 'containers/Post/PostContainer';
import ArticleViewContainer from 'containers/Article/ArticleViewContainer';
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
        console.log(this.props.user);
        const { user } = this.props;

        if ( typeof user.info.email !== "undefined") {
          // 세션 정보 존재
          window.M.toast({
            html: JSON.stringify(user, undefined, 4)
          })
        }
      }
    );
  } 

  render() {
    return (
      <Router>
        <div>
          <Switch>
            <AuthRoute exact path="/" component={MainContainer} />
            <AuthRoute path="/home" component={MainContainer} />
            <AuthRoute path="/search" component={MainContainer} />
            <AuthRoute path="/status" component={MainContainer} />
            <AuthRoute path="/mentoring" component={MainContainer} />
            <AuthRoute path="/mypage" component={MainContainer} />
            <AuthRoute path="/post/edit/:id" component={PostContainer} />
            <AuthRoute path="/post/new" component={PostContainer} />
            <AuthRoute path="/post/:id" component={ArticleViewContainer} />
            <AuthRoute path="/bucketlist/new" component={BucketListContainer} />
            <AuthRoute path="/bucketlist/edit/:id" component={BucketListContainer} />
            
            <Route exact path="/signin" component={SignInContainer} />
            <Route exact path="/signup" component={SignUpContainer} />
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