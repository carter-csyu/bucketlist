import React, { Component } from 'react';
import Main from 'components/Main';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ArticleActions from 'store/modules/article';

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
      const { articleActions } = nextProps;
      articleActions.clearArticle();
      
      return {
        active: nextProps.match.url
      }
    }
    
    return null;
  }
  
  componentDidMount() {
    this.handleUpdateLink();
  }

  render() {
    const { active } = this.state;
    const { match, session } = this.props;

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
      />
    );
  }
}

export default connect(
  ({auth}) => ({
    session: auth.user.info
  }),
  (dispatch) => ({
    articleActions: bindActionCreators(ArticleActions, dispatch)
  })
)(MainContainer);