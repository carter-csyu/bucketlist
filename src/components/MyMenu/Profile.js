import React from 'react';
import PropTypes from 'prop-types';
import './Profile.css';

const Profile = ({
  history,
  email,
  fullname,
  nickname,
  bio,
  imageSrc,
  nicknameChecked,
  
  onChange,
  onChangeImage,
  onRemoveImage,
  onClickSave
}) => {
  return (
    <div className="Profile">
      <header className="page-header">
        <i 
          className="back-btn material-icons indigo-text text-darken-4"
          onClick={() => {
            history.goBack();
          }}>arrow_back</i>
        <div className="title">프로필편집</div>
      </header>
      <article>
        <header className="user-profile">
          <div>
            <img className="profile-image circle responsive-img" alt="use-name"
              src={imageSrc} />
          </div>
          <div>
            <h6>chuuun_s</h6>
            <div className="btns">
              <div>
                <label className="waves-effect btn-flat change-btn"
                  htmlFor="imageUpload">
                  사진 변경
                </label>
                <input 
                  type="file" 
                  name="imageUpload"
                  id="imageUpload"
                  accept="image/*"
                  onChange={onChangeImage}
                
                />
              </div>
              <div>
                <a className="waves-effect btn-flat delete-btn"
                  onClick={onRemoveImage}>사진 제거</a>
              </div>
            </div>
          </div>
        </header>

        <h5>이메일</h5>
        <div className="input-field">
          <input id="email" type="email" className="validate"
            disabled
            placeholder="email"
            name="email"
            value={email}
            onChange={onChange}
          />
        </div>

        <h5>이름</h5>
          <input id="fullname" 
            name="fullname" 
            className="validate"
            type="text"
            placeholder="이름" 
            value={fullname}
            onChange={onChange} />

        <h5>닉네임</h5>
        <input id="nickname" 
          name="nickname" 
          className={`${nickname !== "" && !nicknameChecked ? 'invalid' : 'validate'}`}
          type="text"
          placeholder="이름"
          value={nickname}
          onChange={onChange} />

        <h5>자기소개</h5>
        <textarea
          name="bio"
          className="materialize-textarea validate"
          placeholder="자기소개"
          value={bio}
          style={{height: '130px'}}
          onChange={onChange}
        />
        
        <button 
          className={`waves-effect waves-light btn light-blue darken-1 profile-btn ${nicknameChecked ? '' : 'disabled'}`}
          onClick={onClickSave}
        >
          저장
        </button>
      </article>
    </div>
  );
};

Profile.defaultProps = {
  email: '',
  fullname: '',
  nickname: '',
  bio: '',
  imageSrc: '',
  nicknameChecked: true,
  
  onChange: () => console.warn('onChange is not defined'),
  onChangeImage: () => console.warn('onChangeImage is not defined'),
  onRemoveImage: () => console.warn('onRemoveImage is not defined'),
  onClickSave: () => console.warn('onClickSave is not defined')
};

Profile.propTypes = {
  email: PropTypes.string,
  fullname: PropTypes.string,
  nickname: PropTypes.string,
  bio: PropTypes.string,
  imageSrc: PropTypes.string,
  nicknameChecked: PropTypes.bool,
  
  onChange: PropTypes.func,
  onChangeImage: PropTypes.func,
  onRemoveImage: PropTypes.func,
  onClickSave: PropTypes.func
};

export default Profile;