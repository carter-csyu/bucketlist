import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import App from './components/App';
import { hot } from 'react-hot-loader';

class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

export default hot(module)(Root);
