import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './MyMenu.css';
import ArticleListContainer from 'containers/Article/ArticleListContainer';

const MyMenu = ({
  session,
  people,
  type,
  onClickMenu,
  onClickSignout
}) => {
  const action = {
    name: "PROFILE"
  };

  const profile = JSON.stringify(people) !== "{}" ? people : session;

  const { fullname=profile.nickname, nickname, bio=''} = profile;
  const bioElement = bio.split(/\n/g).map((item, idx) => (
    <div key={idx}>
      {item} <br/>
    </div>
  ));

  const btnAction = session.nickname === people.nickname
    ? (<div>
        <Link to='/account/edit' className="waves-effect btn-flat action-btn">프로필 편집</Link>
      </div>)
    : (<div>
        <Link to='/account/message' className="waves-effect btn-flat action-btn">메세지 전송</Link>
      </div>);

  const profileImage = profile.profileImage !== undefined ? profile.profileImage : 'default-profile.png';

  const postCount = profile.posts !== undefined ? profile.posts.length : 0;
  const bucketlistCount = profile.bucketlists !== undefined ? profile.bucketlists.length : 0;
  const followerCount = profile.followers !== undefined ? profile.followers.length : 0;
  const followeeCount = profile.followers !== undefined ? profile.followees.length : 0;

  return (
    <div>
      <div id="signoutModal" className="modal" ref={ ref => {
        window.M.Modal.init(ref, {}); 
      }}>
        <div className="modal-content">
          <p>로그아웃 하시겠습니까?</p>
        </div>
        <div className="modal-footer">
          <a className="modal-close waves-effect btn light-blue darken-3" onClick={onClickSignout}>확인</a>
          <a className="modal-close waves-effect btn-flat">취소</a>
        </div>
      </div>

      <header className="page-header">
        <div className="logo">Bucket list</div>
        <a className="modal-trigger" href="#signoutModal">
          <i className="material-icons indigo-text text-darken-4">
            lock_open
          </i>
        </a>
      </header>
      <main className="mymenu-wrapper">
        <header className="user-profile">
          <div>
            <img className="profile-image circle responsive-img" alt="use-name"
              src={`/images/profiles/${profileImage}`} />
          </div>
          <div>
            <h6>{fullname}</h6>
            {btnAction}
          </div>
        </header>
        <section className="bio">
          <header>{nickname}</header>
          <article>
            {bioElement}
          </article>
        </section>

        <div className="menu-items">
          <Link to={`/${nickname}/bucketlist`}>
            <div className={`${type === 'bucketlist' ? 'active' : '' } item-name`}>버킷리스트</div>
            <div className="item-count">{bucketlistCount}</div>
          </Link>
          <Link to={`/${nickname}/post`}>
            <div className={`${type === 'post' ? 'active' : '' } item-name`}>게시글</div>
            <div className="item-count">{postCount}</div>
          </Link>
          <Link to={`/${nickname}/follower`}>
            <div className={`${type === 'follower' ? 'active' : '' } item-name`}>팔로워</div>
            <div className="item-count">{followerCount}</div>
          </Link>
          <Link to={`/${nickname}/followee`}>
            <div className={`${type === 'followee' ? 'active' : '' } item-name`}>팔로잉</div>
            <div className="item-count">{followeeCount}</div>
          </Link>
        </div>

        <section>
          { type === 'bucketlist' || type === 'post'
            ? <ArticleListContainer action={action} type={type} people={people} />
            : <div>팔로워 / 팔로잉</div>}
        </section>
      </main>
    </div>
  );
};

MyMenu.propTypes = {
  people: PropTypes.object,
  type: PropTypes.string,
  onClickMenu: PropTypes.func,
  onClickSignout: PropTypes.func
};

MyMenu.defaultProps = {
  people: {},
  type: 'bucketlists',
  onClickMenu: () => console.warn('onClickMenu is not defined'),
  onClickSignout: () => console.warn('onClickSignout is not defined')
};

export default MyMenu;