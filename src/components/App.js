import React, { Component } from 'react';
import SignInContainer from 'containers/Auth/SignInContainer';
import SignUpContainer from 'containers/Auth/SignUpContainer';
import MainContainer from 'containers/MainContainer';
import BucketListContainer from 'containers/BucketList/BucketListContainer';

class App extends Component {
  render() {
    return (
      <div>
      <SignUpContainer />
      {/*
        <BucketListContainer />
        <MainContainer />
        <SignInContainer />
      */}
      </div>
    );
  }
}

export default App;
