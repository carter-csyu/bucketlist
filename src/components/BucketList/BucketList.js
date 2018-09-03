import React from 'react';
import PropTypes from 'prop-types';
import './BucketList.css';
import BucketItem from './BucketItem';

const BucketList = ({
  history,

  mode,
  title,
  value,
  items,
  dueDate,
  openRange,
  onChange,
  onKeyDown,
  onClickAdd,
  onRemove,
  onToggle,
  onCreate,
  onChangeOpenRange,
  onSetDatepicker
}) => {
  const itemList = items.map((item) => {
    const { _id, name, done } = item;
    return (
      <BucketItem
        key={_id}
        id={_id}
        name={name}
        done={done}
        onRemove={onRemove}
        onToggle={onToggle}
      />
    )
  }); 

  return (
    <div className="BucketList">
      <header className="page-header">
        <i 
          className="back-btn material-icons indigo-text darken-4"
          onClick={() => {
            history.goBack();
          }}>arrow_back</i>
        <div className="title">버킷리스트 {`${mode === "new" ? "작성하기" : "수정하기"}`}</div>
      </header>
      <div className="content">
        <h5>제목</h5>
        <div className="input-field">
        <input 
            type="text" 
            name="title"
            className="validate" 
            placeholder="제목 입력"
            value={title}
            onChange={onChange}
            onKeyDown={onKeyDown}
          />
        </div>

        {/* 버킷리스트 등록 */}
        <h5>버킷리스트 항목</h5>
        <div className="input-field bucket-field">
          <input 
            type="text" 
            name="value"
            className="validate" 
            placeholder="새로운 항목 입력"
            autoComplete="off"
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
          />
          <button 
            className="waves-effect waves-light btn indigo darken-4"
            onClick={onClickAdd} 
          >추가</button>
        </div>

        <div>
          <ul className="collection bucketlist-collection">
            {itemList}
          </ul>
        </div>

        {/*
        <div className="grey lighten-1 hr"></div>
        */}

        {/* 완료기한 설정 */}
        <h5>완료기한</h5>
        <input 
          type="text" 
          className="datepicker validate" 
          name="dueDate"
          ref={ ref => onSetDatepicker(ref) }
          value={dueDate}
          onChange={() => {}}
        />

        <h5>공개범위</h5>
        <div className="open-range">
          <label>
            <input name="open-range" type="radio" value="1"
              checked={openRange === "1"} 
              onChange={onChangeOpenRange}
            />
            <span className="radio-text black-text">전체공개</span>
          </label>
          <label>
            <input name="open-range" type="radio" value="2" 
              checked={openRange === "2"} 
              onChange={onChangeOpenRange}
            />
            <span className="radio-text black-text">팔로워공개</span>
          </label>
          <label>
            <input name="open-range" type="radio" value="3" 
              checked={openRange === "3"}  
              onChange={onChangeOpenRange}
            />
            <span className="radio-text black-text">나만보기</span>
          </label>
        </div>


        {/* 등록 버튼 */}
        <div className="col s12">
          <button 
            className="waves-effect waves-light btn light-blue darken-1 btn-create"
            onClick={onCreate}
          >
            {
              mode === "new" ? '등록' : '수정'
            }
          </button>
        </div>
      </div>
    </div>

  );
};

BucketList.propTypes = {
  mode: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    done: PropTypes.boolean
  })),
  dueDate: PropTypes.string,
  openRange: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onClickAdd: PropTypes.func,
  onRemove: PropTypes.func,
  onToggle: PropTypes.func,
  onCreate: PropTypes.func,
  onChangeOpenRange: PropTypes.func,
  onSetDatepicker: PropTypes.func
};

BucketList.defaultProps = {
  title: '',
  mode: 'new',
  value: '',
  items: [],
  dueDate: '',
  openRange: '1',
  onChange: () => console.warn('onChange not defined'),
  onKeyDown: () => console.warn('onKeyDown not defined '),
  onClickAdd: () => console.warn('onClickAdd not defined'),
  onRemove: () => console.warn('onRemove not defined'),
  onToggle: () => console.warn('onToggle not defined'),
  onCreate: () => console.warn('onCreate not defined'),
  onChangeOpenRange: () => console.warn('onChangeOpenRange not defined'),
  onSetDatepicker: () => console.warn('onSetDatepicker not defined')
}

export default BucketList;