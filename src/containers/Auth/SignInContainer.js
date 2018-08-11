import React, { Component } from 'react';
import SignIn from 'components/Auth/SignIn';
import { emailRe } from 'utils';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'store/modules/auth';
import storage from 'lib/storage';

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
      // 일반로그인
      const { email, password } = this.state;
      const { AuthActions } = this.props;

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

      AuthActions.signinRequest(email, password).then(
        () => {
          const { signin, user, history } = this.props;

          if (signin.status === "SUCCESS") {
            window.M.toast({
              html: `안녕하세요 ${user.info.nickname}님`
            });
            history.push('/home');
          } else {
            this.setState({
              password: ''
            });

            window.M.toast({
              html: signin.error.message
            });
          }
        }
      );
    }

  }

  handleOnLoadPassword = (ref) => {
    if (this.state.passwordRef != null ) return;
    this.setState({
      passwordRef: ref
    });
  }

  handleClickResetPw = () => {
    const { AuthActions } = this.props;

    AuthActions.getUserinfoRequest().then(
      () => {
        console.log(this.props.user);
        const { user } = this.props;

        if ( typeof user.info.email !== "undefined") {
          // 세션 정보 존재
          window.M.toast({
            html: JSON.stringify(user, undefined, 4)
          })
        } else {
          // 세션 정보 없음
          window.M.toast({
            html: '로그인 후 다시 시도 바랍니다'
          });
        }
      }
    );

    window.M.toast({
      html: '비밀번호 찾기 기능은 현재 준비중 입니다'
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

export default connect(
  ({auth}) => ({
    signin: auth.signin,
    user: auth.user
  }),
  (dispatch) => ({
    AuthActions: bindActionCreators(authActions, dispatch)
  })
)(SignInContainer);