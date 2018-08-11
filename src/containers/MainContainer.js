import React, { Component } from 'react';
import Main from 'components/Main';

import HomeContainer from 'containers/Home/HomeContainer';
import SearchContainer from 'containers/Search/SearchContainer';
import StatusContainer from 'containers/Status/StatusContainer';
import Mentoring from 'components/Mentoring';
import MyMenu from 'components/MyMenu';

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
      ? (<StatusContainer />)
      : active === '/mentoring'
      ? (<Mentoring />)
      : active === '/mypage'
      ? (<MyMenu />)
      : (<div>Noting in here</div>);

    return (
      <Main
        active={active}
        content={content}
      />
    );
  }
}

export default MainContainer;