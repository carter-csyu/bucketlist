import React from 'react';
import PropTypes from 'prop-types';
import './Status.css';
import * as utils from 'utils';
import TimeAgo from 'react-timeago';

const Status = ({
  items,
  notifications,
  activeId,
  folding,
  onClickItem,
  onClickViewMore
}) => {
  const itemList = notifications.map(
    ({_id, from: provider, type, read, created}) => {
      const content = type === 'comment'
        ? `${provider.nickname}님이 게시글에 댓글을 남겼습니다`
        : type === 'like'
        ? `${provider.nickname}님이 회원님의 글을 좋아합니다`
        : '';

      return (
        <li key={_id} 
          className={`collection-item avatar ${activeId === _id ? 'active' : ''} ${!read ? 'read' : ''}`} 
          onClick={() => onClickItem(_id)}>
          <img src={`/images/profiles/${provider.profileImage}`} alt="" className="circle" />
          <p>{content}</p>
          <TimeAgo className="alert-date" date={new Date(created)} />
        </li>
      );
    }
  );

  return (
    <div className="Status">
      <header className="page-header">
        <div className="logo">Bucket list</div>
      </header>

      <header className="page-sub-header">
        <div className="title">알림</div>
      </header>

      <ul className="collection">
        {
          folding
          ? itemList.slice(0, 3)
          : itemList
        }
      </ul>
      <div className="view-more indigo-text text-darken-4" onClick={onClickViewMore}>
        {folding ? '모든 알림 보기' : '접기'}
      </div>
    </div>
  );
};

Status.propTypes = {
  items: PropTypes.array,
  notifications: PropTypes.array,
  activeId: PropTypes.string,
  folding: PropTypes.bool,
  onClickItem: PropTypes.func,
  onClickViewMore: PropTypes.func
};

Status.defaultProps = {
  items: [],
  notifications: [],
  activeId: '',
  folding: true,
  onClickItem: () => console.warn('onClickItem not defined'),
  onClickViewMore: () => console.warn('onClickViewMore not defined')
};

export default Status;