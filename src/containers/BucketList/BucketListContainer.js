import React, { Component } from 'react';
import BucketList from 'components/BucketList';

class BucketListcontainer extends Component {
  state = {
    title: '',
    value: '',
    id: 3,
    /*
    items: [{
      id: 1,
      name: "광교산 등교하기",
      done: false
    }, {
      id: 2,
      name: "영화 10편 이상 보기",
      done: true
    }],
    */
    items: [],
    dueDate: '2018-12-31',
    openRange: '1'
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      this.handleClickAdd();
    }
  }

  handleClickAdd = () => {
    const { items, value, id } = this.state;
    
    if (value === null || value === "") return;

    this.setState({
      value: '',
      items: items.concat({
        id: id,
        name: value,
        done: false
      }),
      id: id + 1
    });

    window.M.toast({
      html: '등록 완료'
    });
  }

  handleRemove = (id) => {
    const { items } = this.state;

    this.setState({
      items: items.filter(
        (item) => item.id !== id
      )
    });
  }

  handleToggle = (id) => {
    const { items } = this.state;
    const index = items.findIndex( item => item.id === id);

    this.setState({
      items: [
        ...items.slice(0, index),
        {
          ...items[index],
          done: !items[index].done
        },
        ...items.slice(index + 1, items.length)
      ]
    });
  }

  handleSetDatepicker = (ref) => {
    if (this.datepicker !== null) {
      this.datepicker = ref;
      console.log('called handleSetDatepicker');
    }

  }

  handleDueDateSelect = (newDate) => {
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const date = newDate.getDate();

    console.log( year, month, date );
  }

  handleCreate = () => {
    const { title, items, dueDate } = this.state;

    if (title === null || title === "") {
      window.M.toast({
        html: '제목을 입력 후 다시 시도 바랍니다.'
      });
      return;
    }

    if (items.length < 1) {
      window.M.toast({
        html: '버킷리스트 항목을 등록 후 다시 시도 바랍니다'
      });
      
      return;
    }

    if (dueDate === null || dueDate === "") {
      window.M.toast({
        html: '완료기한을 입력 후 다시 시도 바랍니다.'
      });

      return;
    }

    window.M.toast({
      html: '등록처리'
    });
  }

  handleChangeOpenRange = (e) => {
    this.setState({
      openRange: e.target.value
    });
  }

  componentDidMount() {
    // crate instance Datepicker
    const instance = window.M.Datepicker.init(this.datepicker, {
      autoClose: true,
      format: 'yyyy-mm-dd',
      onSelect: this.handleDueDateSelect,
      i18n: {
        months: [
          '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'
        ],
        monthsShort: [
          '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'
        ],
        weekdays: [
          '일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'
        ],
        weekdaysShort: [
          '일', '월', '화', '수', '목', '금', '토'
        ],
        weekdaysAbbrev: [
          '일', '월', '화', '수', '목', '금', '토'
        ]
      }
    });
  }

  render() {
    const { title, value, items, dueDate, openRange } = this.state;
    const {
      handleChange,
      handleKeyDown,
      handleClickAdd,
      handleRemove,
      handleToggle,
      handleCreate,
      handleChangeOpenRange,
      handleSetDatepicker
    } = this;

    return (
      <div>
        <BucketList 
          title={title}
          value={value}
          items={items}
          dueDate={dueDate}
          openRange={openRange}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onClickAdd={handleClickAdd}
          onRemove={handleRemove}
          onToggle={handleToggle}
          onCreate={handleCreate}
          onChangeOpenRange={handleChangeOpenRange}
          onSetDatepicker={handleSetDatepicker}
        /> 
      </div>
    );
  }
}

export default BucketListcontainer;