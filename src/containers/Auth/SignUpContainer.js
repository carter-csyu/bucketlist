import React, { Component } from 'react';
import SignUp from 'components/Auth/SignUp';
import { emailRe } from 'utils';

class SignUpContainer extends Component {
  state = {
    email: '',
    password: '',
    password2: ''
  }
  
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.target.name === "password2") {
        this.handleClickSignup();
      }
    }
  }

  handleClickSignin = (sns) => {

    if (sns) {
      switch(sns) {
        case 'facebook':
          window.M.toast({
            html: '페이스북 로그인'
          });
          break;
        default:
          break;
      }
    }
  }

  handleClickSignup = () => {
    const { email, password, password2 } = this.state;

    if (email === null || email === "") {
      window.M.toast({
        html: '이메일을 입력 후 다시 시도 바랍니다.'
      });
      
      return;
    }
    if (!emailRe(email)) {
      window.M.toast({
        html:' 이메일 형식을 확인해주세요'
      });

      return;
    }

    if (password === null || password === "") {
      window.M.toast({
        html: '비밀번호를 입력 후 다시 시도 바랍니다.'
      });

      return;
    }

    if (password2 === null || password2 === "") {
      window.M.toast({
        html: '비밀번호확인을 입력 후 다시 시도 바랍니다.'
      });

      return;
    };

    if (password !== password2) {
      window.M.toast({
        html: '입력한 비밀번호가 서로 일치하지 않습니다.' 
      });

      return;
    }
    
    window.M.toast({
      html: '가입'
    });
  }

  render() {
    const {
      email,
      password,
      password2
    } = this.state;

    const {
      handleChange,
      handleKeyDown,
      handleClickSignin,
      handleClickSignup
    } = this;
    
    return (
      <SignUp 
        email={email}
        password={password}
        password2={password2}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onClickSignin={handleClickSignin}
        onClickSignup={handleClickSignup}
      />
    );
  }
}

export default SignUpContainer;