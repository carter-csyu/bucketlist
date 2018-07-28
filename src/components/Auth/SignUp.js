import React from 'react';
import PropTypes from 'prop-types';
import './SignUp.css';
 
const SignUp = ({
    email, 
    password,
    password2,
    onChange, 
    onKeyDown,
    onClickSignin,
    onClickSignup
  }) => {
  return (
    <div>
      <div className="SignUp">
        <div className="header">
          <h3>Bucket list</h3>
        </div>
        <div className="content">
          <div className="row">
            <div className="col s12">
              <button 
              className="waves-effect waves-light btn indigo darken-1 btn-signin facebook"
              onClick={() => onClickSignin('facebook')}
              >
                Facebook으로 로그인
              </button>
            </div>

            <div className="grey lighten-1 hr"></div>

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
                  value={password} 
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                />
                <label htmlFor="password">비밀번호</label>
              </div>
              <div className="input-field">
                <input id="password2" text="password2" type="password" className="validate" 
                  name="password2"
                  value={password2} 
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                />
                <label htmlFor="password2">비밀번호 재입력</label>
              </div>
            </form>
            <div className="col s12">
              <button 
              className="waves-effect waves-light btn light-blue darken-1 btn-signup"
              onClick={onClickSignup}  
              >
                가입
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="LogIn center-align">
                  계정이 있으신가요? <a>로그인</a>
      </div>
    </div>
  );
};

SignUp.propTypes = {
  email: PropTypes.string,
  password: PropTypes.string,
  password2: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onClickSignin: PropTypes.func,
  onClickSignup: PropTypes.func
};

SignUp.defaultProps = {
  email: '',
  password: '',
  password2: '',
  onChange: () => console.warn('onChange not defined'),
  onKeyDown: () => console.warn('onKeyDown not defined'),
  onClickSignin: () => console.warn('onClickSignin not defined'),
  onClickSignup: () => console.warn('onClickSignup not defined')
};

export default SignUp;
