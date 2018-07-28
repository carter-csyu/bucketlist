import React, { Component } from 'react';
import Main from 'components/Main';

import Home from 'components/Home';
import Search from 'components/Search';
import Status from 'components/Status';
import Mentoring from 'components/Mentoring';
import MyMenu from 'components/MyMenu';

class MainContainer extends Component {
  state = {
    active: 1
  }

  handleClickMenu = (index) => {
    this.setState({
      active: index
    });
  }
  
  render() {
    const { active } = this.state;
    const {
      handleClickMenu
    } = this;

    const content = active === 1
      ? (<Home />)
      : active === 2
      ? (<Search />)
      : active === 3
      ? (<Status />)
      : active === 4
      ? (<Mentoring />)
      : active === 5
      ? (<MyMenu />)
      : (<div>Noting in here</div>);

    return (
      <Main
        active={active}
        onClickMenu={handleClickMenu}
        content={content}
      />
    );
  }
}

export default MainContainer;