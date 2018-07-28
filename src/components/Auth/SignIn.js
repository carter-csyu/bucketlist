import React from 'react';
import PropTypes from 'prop-types';
import './SignIn.css';

const SignIn = ({
    email, 
    password, 
    onChange, 
    onKeyDown,
    onClickSignin,
    onClickSignup,
    onClickResetPw,
    onLoadPassword
  }) => {
  return (
    <div className="SignIn">
      <div className="header">
        <h3>Bucket list</h3>
      </div>
      <div className="content">
        <div className="row">
          <form className="col s12">
            <div className="input-field">
              <input id="email" text="email" type="email" className="validate" 
                name="email"
                value={email}
                onChange={onChange}
                onKeyDown={onKeyDown} 
              />
              <label htmlFor="email">이메일</label>
            </div>
            <div className="input-field">
              <input id="password" text="password" type="password" className="validate" 
                name="password"
                ref={ ref => {
                  onLoadPassword(ref); 
                }}
                value={password} 
                onChange={onChange}
                onKeyDown={onKeyDown}
              />
              <label htmlFor="password">비밀번호</label>
            </div>
          </form>
          <div className="col s12">
            <button 
              className="waves-effect waves-light btn light-blue darken-3 btn-signin"
              onClick={() => onClickSignin()}
            >
              로그인
            </button>
          </div>
          <div className="col s12">
            <button 
            className="waves-effect waves-light btn indigo darken-1 btn-signin facebook"
            onClick={() => onClickSignin('facebook')}
            >
              Facebook으로 로그인
            </button>
          </div>
          <div className="col s12 center-align reset-password">
            <a 
              className="black-text darken-4"
              onClick={onClickResetPw}
              >비밀번호를 잊으셨나요?</a>
          </div>
          <div className="grey lighten-1 hr"></div>
          <div className="col s12">
            <button 
            className="waves-effect waves-light btn light-blue darken-1 btn-signup"
            onClick={onClickSignup}  
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

SignIn.propTypes = {
  email: PropTypes.string,
  password: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onClickSignin: PropTypes.func,
  onClickSignup: PropTypes.func,
  onClickResetPw: PropTypes.func
};

SignIn.defaultProps = {
  email: '',
  password: '',
  onChange: () => console.warn('onChange not defined'),
  onKeyDown: () => console.warn('onKeyDown not defined'),
  onClickSignin: () => console.warn('onClickSignin not defined'),
  onClickSignup: () => console.warn('onClickSignup not defined'),
  onClickResetPw: () => console.warn('onClickResetPw not defined')
};

export default SignIn;
