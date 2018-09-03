import React, { Component } from 'react';
import BucketList from 'components/BucketList';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as bucketlistActions from 'store/modules/bucketlist';

class BucketListcontainer extends Component {
  state = {
    mode: 'new',
    writer: {},  
    title: '',
    value: '',
    id: 1,
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
        _id: id,
        name: value,
        done: false
      }),
      id: id + 1
    });
  }

  handleRemove = (id) => {
    const { items } = this.state;

    this.setState({
      items: items.filter(
        (item) => item._id !== id
      )
    });
  }

  handleToggle = (id) => {
    const { items } = this.state;
    const index = items.findIndex( item => item._id === id);

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
    const { mode, id, title, items, dueDate, openRange } = this.state;
    const { BucketlistActions } = this.props;

    if (title === null || title === "") {
      window.M.toast({
        html: '제목을 입력 후 다시 시도 바랍니다'
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
        html: '완료기한을 입력 후 다시 시도 바랍니다'
      });

      return;
    }

    const dueDateArr = dueDate.split("-");
    const dueDateObj = new Date(dueDateArr[0], Number(dueDateArr[1]) + 1, dueDateArr[2]);
    
    if ( mode === "new") {
      BucketlistActions.createBucketlistRequest(
        title, 
        items, 
        dueDateObj,
        openRange
      ).then(
        () => {
          const { create } = this.props;
          if (create.status === "SUCCESS") {
            window.M.toast({
              html: '성공적으로 등록되었습니다'
            });
            
            this.setState({
              title: '',
              items: [],
              dueDate: '2018-08-09',
              openRange: '1'
            });
            
          } else {
            window.M.toast({
              html: create.error.message
            });
          }
        }
      );
    } else {
      BucketlistActions.editBucketlistRequest(
        id,
        title,
        items,
        dueDateObj,
        openRange
      ).then(
        () => {
          const { edit } = this.props;
          if (edit.status === "SUCCESS") {
            window.M.toast({
              html: '성공적으로 수정되었습니다'
            });
            
            this.setState({
              title: '',
              items: [],
              dueDate: '2018-08-09',
              openRange: '1'
            });
            
          } else {
            window.M.toast({
              html: edit.error.message
            }); 
          }
        }
      );

    }
  }
  
  handleChangeOpenRange = (e) => {
    this.setState({
      openRange: e.target.value
    });
  }
  
  componentDidMount() {
    const { history, match } = this.props;
    const { BucketlistActions } = this.props;
    
    // crate instance Datepicker
    const instance = window.M.Datepicker.init(this.datepicker, {
      autoClose: true,
      format: 'yyyy-mm-dd',
      onSelect:  this.handleDueDateSelect,
      i18n: {
        cancel: '취소',
        clear: '초기화',
        done: '확인',
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


    if (match.path === "/bucketlist/edit/:id") {
      const { id } = match.params;
      
      this.retrieveBucketlist(id);
    }
  }

  retrieveBucketlist = (id) => {
    const { BucketlistActions } = this.props; 

    BucketlistActions.getBucketlistRequest(id).then(
      () => {
        const { data } = this.props;

        if (data.status === "SUCCESS") {
          const { info } = data;

          this.setState({
            mode: 'edit',
            writer: info[0].writer,
            id: info[0]._id,
            title: info[0].title,
            items: info[0].items,
            dueDate: info[0].dueDate,
            openRange: info[0].openRange
          });
        } else {
          window.M.toast({
            html: data.error.message
          });
        }
      }
    );
  }

  render() {
    const { history } = this.props;
    const { mode, title, value, items, dueDate, openRange } = this.state;
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
      <BucketList
        history={history}
        mode={mode}
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
    );
  }
}

export default connect(
  ({bucketlist}) => ({
    create: bucketlist.create,
    edit: bucketlist.edit,
    data: bucketlist.data
  }),
  (dispatch) => ({
    BucketlistActions: bindActionCreators(bucketlistActions, dispatch)
  })
)(BucketListcontainer);