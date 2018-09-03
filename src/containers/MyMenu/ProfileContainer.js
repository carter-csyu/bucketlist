import React, { Component } from 'react';
import Profile from 'components/MyMenu/Profile';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'store/modules/auth';

class ProfileContainer extends Component {
  state = {
    email: '',
    fullname: '',
    nickname: '',
    bio: '',
    image: null,
    nicknameChecked: true,

    imageSrc: '/images/profiles/default-profile.png'
  }
  
  handleChange = (e) => {
    const { nicknameChecked } = this.state;

    this.setState({
      [e.target.name]: e.target.value
    });

    if (e.target.name === 'nickname') {
      if (nicknameChecked) {
        this.setState({
          nicknameChecked: false
        });
      }

      if (typeof this.nickTimer === 'number') {
        clearTimeout(this.nickTimer);
        this.nickTimer = undefined;
      }

      this.nickTimer = setTimeout(() => {
        this.handleCheckNickname();
      }, 1000);
    }
  }

  handleCheckNickname = () => {
    const { AuthActions, session } = this.props;
    const { nickname } = this.state;

    /*
    if (session.nickname === nickname) {
      this.setState({
        nicknameChecked: true
      });

      return;
    }
    */

    AuthActions.checkNicknameRequest(nickname).then(
      () => {
        const { nickInfo } = this.props;
        console.log(nickInfo);

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
  
  handleClickSave = () => {
    const { AuthActions, session } = this.props;
    const { fullname, nickname, bio } = this.state;
    
    const info = {
      id: session._id,
      fullname,
      nickname,
      bio
    };

    AuthActions.editUserinfoRequest(info).then(
      () => {
        const { status, error } = this.props;

        if (status !== 'SUCCESS') {
          window.M.toast({
            html: error.message
          });
        }

        window.M.toast({
          html: '저장되었습니다'
        });
      }
    )
  }

  handleChangeImage = (e) => {
    const { files } = e.target;
    const { AuthActions } = this.props;

    AuthActions.replaceProfileRequest(files[0]).then(
      () => {
        const { status, error, session } = this.props;

        if (status !== 'SUCCESS') {
          window.M.toast({
            html: error.message
          });

          return;
        }

        this.setState({
          image: files[0],
          imageSrc: window.URL.createObjectURL(files[0])
        });
      }
    )

  }

  handleRemoveImage = () => {
    this.setState({
      image: null,
      imageSrc: '/images/profiles/default-profile.png'
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.email === '' && JSON.stringify(nextProps.session) !== '{}') {
      return {
        email: nextProps.session.email,
        fullname: nextProps.session.fullname !== undefined ? nextProps.session.fullname : '',
        nickname: nextProps.session.nickname !== undefined ? nextProps.session.nickname : '',
        bio: nextProps.session.bio !== undefined ? nextProps.session.bio : '',
        imageSrc: nextProps.session.profileImage !== undefined 
        ? `/images/profiles/${nextProps.session.profileImage}`
        : `/images/profiles/default-profile.png`
      };
    }

    return null;
  }

  render() {
    const { history, session } = this.props;
    const {
      fullname, nickname, bio, imageSrc, nicknameChecked
    } = this.state;
    const {
      handleChange,
      handleClickSave,
      handleChangeImage,
      handleRemoveImage
    } = this;

    return (
      <Profile 
        history={history}
        email={session.email}
        fullname={fullname}
        nickname={nickname}
        bio={bio}
        imageSrc={imageSrc}
        nicknameChecked={nicknameChecked}

        onChange={handleChange}
        onChangeImage={handleChangeImage}
        onRemoveImage={handleRemoveImage}
        onClickSave={handleClickSave}
      />
    )
  }
}

export default connect(
  ({auth}) => ({
    session: auth.user.info,
    status: auth.status,
    error: auth.error,
    nickInfo: auth.nickname
  }),
  (dispatch) => ({
    AuthActions: bindActionCreators(authActions, dispatch)
  })
)(ProfileContainer);