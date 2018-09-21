import React, { Component } from 'react';
import Main from 'components/Main';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as articleActions from 'store/modules/article';
import * as notificationActions from 'store/modules/notification';

import HomeContainer from 'containers/Home/HomeContainer';
import SearchContainer from 'containers/Search/SearchContainer';
import StatusContainer from 'containers/Status/StatusContainer';
import Mentoring from 'components/Mentoring';
import MyMenuContainer from 'containers/MyMenu/MyMenuContainer';

class MainContainer extends Component {
  state = {
    active: '/home'
  }

  handleClickMenu = (url) => {
    this.setState({
      active: url
    });
  }

  handleUpdateLink = () => {
    const { match } = this.props;

    this.handleClickMenu(match.url);
  }
  
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.match.url !== prevState.active) {
      const { ArticleActions } = nextProps;
      ArticleActions.clearArticle();
      
      return {
        active: nextProps.match.url
      }
    }
    
    return null;
  }
  
  componentDidMount() {
    const { NotificationActions } = this.props;
    this.handleUpdateLink();

    NotificationActions.getNotificationsRequest().then(() => {
      const { status, error } = this.props;

      if ( status === "FAILURE") {
        window.M.toast({
          html: error.message !== undefined ? error.message : '오류가 발생하였습니다'
        });

        return;
      }
    });
  }

  render() {
    const { active } = this.state;
    const { match, session, unread } = this.props;

    const {
      handleClickMenu
    } = this;

    const content = active === "/"
      ? (<HomeContainer />)
      : active === '/home'
      ? (<HomeContainer />)
      : active === '/search'
      ? (<SearchContainer />)
      : active === '/status'
      ? (<StatusContainer history={this.props.history} />)
      : active === '/mentoring'
      ? (<Mentoring />)
      : (<MyMenuContainer type={match.params.type} nickname={match.params.nickname} />)

    return (
      <Main
        active={active}
        session={session}
        content={content}
        unread={unread}
      />
    );
  }
}

export default connect(
  ({auth, notification}) => ({
    session: auth.user.info,
    unread: notification.unread,
    status: notification.status,
    error: notification.error
  }),
  (dispatch) => ({
    ArticleActions: bindActionCreators(articleActions, dispatch),
    NotificationActions: bindActionCreators(notificationActions, dispatch)
  })
)(MainContainer);