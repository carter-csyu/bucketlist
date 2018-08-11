import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const AuthRoute = ({component: Component, user, isSignedIn, ...rest}) => {
  return (
    <Route 
      {...rest} 
      render={
        (props) => isSignedIn === true
        ? <Component {...props} /> 
        : <Redirect to={{pathname: '/signin'}} /> 
      } 
    />
  );
}

export default connect(
  ({auth}) => ({
    user: auth.user,
    isSignedIn: auth.user.isSignedIn
  }),
  undefined
)(AuthRoute);
