import React, { Component } from 'react';
import SignIn from 'components/Auth/SignIn';
import { emailRe } from 'utils';

class SignInContainer extends Component {
  state = {
    email: '',
    password: '',
    passwordRef: null
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.target.name === "email") {
        this.state.passwordRef.focus();
        return;
      }
      this.handleClickSignin();
    }
  }

  handleClickSignin = (sns) => {
    
    if (sns) {
      switch (sns) {
        case 'facebook':
          window.M.toast({
            html: 'Facebook 로그인'
          });
          break;
        default:
          return;
      }
    } else {
      const { email, password } = this.state;

      if (email === null || 
          email === "" || 
          !emailRe(email)) {
        window.M.toast({
          html: '이메일을 확인 후 다시 시도 바랍니다.'
        });

        return;
      }

      if (!password || password === "") {
        window.M.toast({
          html: '비밀번호를 입력 후 다시 시도 바랍니다.'
        });

        return;
      }

      window.M.toast({
        html: '로그인'
      });
    }

  }

  handleClickSignup = () => {
    window.M.toast({
      html: '회원가입'
    });
  }

  handleOnLoadPassword = (ref) => {
    if (this.state.passwordRef != null ) return;
    this.setState({
      passwordRef: ref
    });
  }

  handleClickResetPw = () => {
    window.M.toast({
      html: '비밀번호 찾기'
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state !== nextState;
  }

  render() {
    const { email, password, passwordRef } = this.state;
    const {
      handleChange,
      handleKeyDown,
      handleClickSignin,
      handleClickSignup,
      handleClickResetPw,
      handleOnLoadPassword
    } = this;

    return (
      <SignIn 
        email={email}
        password={password}
        passwordRef={passwordRef}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onClickSignin={handleClickSignin}
        onClickSignup={handleClickSignup}
        onClickResetPw={handleClickResetPw}
        onLoadPassword={handleOnLoadPassword}
      />
    )
  }
}

export default SignInContainer;