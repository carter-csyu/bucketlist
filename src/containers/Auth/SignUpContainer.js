import React, { Component } from 'react';
import SignUp from 'components/Auth/SignUp';
import { emailRe } from 'utils';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'store/modules/auth';

class SignUpContainer extends Component {
  state = {
    email: '',
    password: '',
    password2: '',
    nickname: '',
    nicknameChecked: false
  }

  handleChange = (e) => {
    const { nicknameChecked } = this.state;

    this.setState({
      [e.target.name]: e.target.value
    });

    if (e.target.name === "nickname") {
      if (nicknameChecked) {
        this.setState({
          nicknameChecked: false
        });
      } else {
        if (typeof this.nickTimer === "number" ) {
          clearTimeout(this.nickTimer);
          this.nickTimer = undefined
        }
        
        this.nickTimer = setTimeout(() => {
          this.handleCheckNickname();
        }, 1000)
      }
    }
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
    const { email, password, password2, nickname, nicknameChecked } = this.state;
    const { AuthActions } = this.props;

    if (email === null || email === "") {
      window.M.toast({
        html: '이메일을 입력 후 다시 시도 바랍니다'
      });
      
      return;
    }
    if (!emailRe(email)) {
      window.M.toast({
        html:' 이메일 형식을 확인바랍니다'
      });

      return;
    }

    if (password === null || password === "") {
      window.M.toast({
        html: '비밀번호를 입력 후 다시 시도 바랍니다'
      });

      return;
    }

    if (password2 === null || password2 === "") {
      window.M.toast({
        html: '비밀번호확인을 입력 후 다시 시도 바랍니다'
      });

      return;
    };

    if (password !== password2) {
      window.M.toast({
        html: '입력한 비밀번호가 서로 일치하지 않습니다' 
      });

      return;
    }

    if (nickname === null || nickname === "") {
      window.M.toast({
        html: '닉네임을 입력 후 다시 시도 바랍니다'
      });

      return;
    }
    
    if (!nicknameChecked) {
      window.M.toast({
        html: '닉네임 중복검사를 완료 후 다시 시도 바랍니다'
      });

      return;
    }

    AuthActions.signupRequest(email, password, nickname).then(
      () => {
        const { signup } = this.props;

        if (signup.status === "SUCCESS") {
          window.M.toast({
            html: '회원가입이 완료되었습니다'
          });

          this.setState({
            email: '',
            password: '',
            password2: '',
            nickname: ''
          });
        } else {
          window.M.toast({
            html: signup.error.message
          });
        }
      }
    )
  }

  handleCheckNickname = () => {
    const { AuthActions } = this.props;
    const { nickname } = this.state;

    AuthActions.checkNicknameRequest(nickname).then(
      () => {
        const { nickInfo } = this.props;

        if (nickInfo.status === "SUCCESS") {
          this.setState({
            nicknameChecked: true
          });
        } else {
          window.M.toast({
            html: nickInfo.error.message
          });
        }
      }
    );
  }

  render() {
    const {
      email,
      password,
      password2,
      nickname,
      nicknameChecked
    } = this.state;

    const {
      handleChange,
      handleKeyDown,
      handleClickSignin,
      handleClickSignup,
      handleCheckNickname
    } = this;
    
    return (
      <SignUp 
        email={email}
        password={password}
        password2={password2}
        nickname={nickname}
        nicknameChecked={nicknameChecked}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onClickSignin={handleClickSignin}
        onClickSignup={handleClickSignup}
        onCheckNickname={handleCheckNickname}
      />
    );
  }
}

export default connect(
  ({ auth }) => ({
    signup: auth.signup,
    nickInfo: auth.nickname
  }),
  (dispatch) => ({
    AuthActions: bindActionCreators(authActions, dispatch)
  })
)(SignUpContainer);