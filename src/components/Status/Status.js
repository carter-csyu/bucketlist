import React from 'react';
import PropTypes from 'prop-types';
import './Status.css';

const Status = ({
  items,
  activeId,
  folding,
  onClickItem,
  onClickViewMore
}) => {
  const itemList = items.map(
    ({id, provider, content, alertDate}) => {
      return (
        <li key={id} className={`collection-item avatar ${activeId === id ? 'active' : ''}`} onClick={() => onClickItem(id)}>
          <img src={provider.profileImage} alt="" className="circle" />
          <p>{content}</p>
          <p className="alert-date">
            {alertDate}
          </p>
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
  activeId: PropTypes.number,
  folding: PropTypes.bool,
  onClickItem: PropTypes.func,
  onClickViewMore: PropTypes.func
};

Status.defaultProps = {
  items: [],
  activeId: -1,
  folding: true,
  onClickItem: () => console.warn('onClickItem not defined'),
  onClickViewMore: () => console.warn('onClickViewMore not defined')
};

export default Status;