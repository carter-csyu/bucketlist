import React from 'react';

const BucketItem = ({
  id,
  name,
  done,
  onRemove,
  onToggle
}) => {
  return (
    <li className="collection-item bucketlist-item">
      <a className="left-icon" 
        onClick={() => onRemove(id)}>
        <i className="material-icons">clear</i>
      </a>
      <div className={`item-name ${done ? 'active' : ''}`}>{name}</div>
      <a className={`right-icon ${done ? 'light-blue-text darken-1' : 'grey-text lighten-3'}`}
        onClick={() => onToggle(id)}>
        <i className="material-icons">done</i>
      </a>
    </li>
  );
};

export default BucketItem;