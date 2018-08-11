import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './SignUp.css';
 
const SignUp = ({
    email, 
    password,
    password2,
    nickname,
    nicknameChecked,
    onChange, 
    onKeyDown,
    onClickSignin,
    onClickSignup,
    onCheckNickname
  }) => {
  return (
    <div className="SignUp">
      <header className="page-header center-align">
        <div className="logo">Bucket list</div>
      </header>
      <div className="content">
        <div className="col s12">
          <button 
          className="waves-effect waves-light btn indigo darken-1 facebook-btn"
          onClick={() => onClickSignin('facebook')}>
          Facebook으로 로그인
          </button>
        </div>

        <div className="grey lighten-1 hr"></div>
        
        <div className="input-field">
          <input id="email" type="email" className="validate" 
            name="email"
            value={email}
            onChange={onChange}
            onKeyDown={onKeyDown} 
          />
          <label htmlFor="email">이메일</label>
        </div>
        <div className="input-field">
          <input id="password" type="password" className="validate" 
            name="password"
            value={password} 
            onChange={onChange}
            onKeyDown={onKeyDown}
          />
          <label htmlFor="password">비밀번호</label>
        </div>
        <div className="input-field">
          <input id="password2" type="password" className="validate" 
            name="password2"
            value={password2} 
            onChange={onChange}
            onKeyDown={onKeyDown}
          />
          <label htmlFor="password2">비밀번호 재입력</label>
        </div>

        <div className="input-field additional-inputs">
          <input id="nickname" type="text" className={`${nickname !== "" && !nicknameChecked ? 'invalid' : 'valid'}`} 
            name="nickname"
            value={nickname}
            onChange={onChange}
            onKeyDown={onKeyDown} 
          />
          <label htmlFor="nickname">닉네임</label>
          <button
            className={`waves-effect waves-light btn indigo darken-4 dup-btn ${nicknameChecked ? 'disabled' : ''}`}
            onClick={onCheckNickname}
          >
            {
              nicknameChecked ? '확인완료' : '중복검사'
            }
          </button>
        </div>
        
        <div className="col s12">
          <button 
          className="waves-effect waves-light btn light-blue darken-1 signup-btn"
          onClick={onClickSignup}  
          >
            가입
          </button>
        </div>
      </div>

      <div className="center-align exist-account">
        계정이 있으신가요? <Link to="/signin">로그인</Link>
      </div>
    </div>
  );
};

SignUp.propTypes = {
  email: PropTypes.string,
  password: PropTypes.string,
  password2: PropTypes.string,
  nickname: PropTypes.string,
  nicknameChecked: PropTypes.bool,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onClickSignin: PropTypes.func,
  onClickSignup: PropTypes.func,
  onCheckNickname: PropTypes.func,
};

SignUp.defaultProps = {
  email: '',
  password: '',
  password2: '',
  nickname: '',
  nicknameChecked: false,
  onChange: () => console.warn('onChange not defined'),
  onKeyDown: () => console.warn('onKeyDown not defined'),
  onClickSignin: () => console.warn('onClickSignin not defined'),
  onClickSignup: () => console.warn('onClickSignup not defined'),
  onCheckNickname: () => console.warn('onCheckNickname not defined')
};

export default SignUp;
