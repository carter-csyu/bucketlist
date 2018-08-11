import React, { Component } from 'react';
import Status from 'components/Status';

class StatusContainer extends Component {
  state = {
    activeId: -1,
    folding: true,
    items: [{
      id: 1,
      provider: {
        email: 'chunsang.yu@gmail.com',
        name: 'chunsang.yu',
        nickname: 'chunsang.yu',
        profileImage: 'https://materializecss.com/images/yuna.jpg'
      },
      content: 'chunsang.yu님이 게시글에 댓글을 남겼습니다.',
      alertDate: '2018-07-28 12:15:00'
    }, {
      id: 2,
      provider: {
        email: 'chunsang.yu@gmail.com',
        name: 'chunsang.yu',
        nickname: 'chunsang.yu',
        profileImage: 'https://materializecss.com/images/yuna.jpg'
      },
      content: 'chunsang.yu님이 게시글에 댓글을 남겼습니다.',
      alertDate: '2018-07-28 12:15:00'
    }, {
      id: 3,
      provider: {
        email: 'chunsang.yu@gmail.com',
        name: 'chunsang.yu',
        nickname: 'chunsang.yu',
        profileImage: 'https://materializecss.com/images/yuna.jpg'
      },
      content: 'chunsang.yu님이 게시글에 댓글을 남겼습니다.',
      alertDate: '2018-07-28 12:15:00'
    }, {
      id: 4,
      provider: {
        email: 'chunsang.yu@gmail.com',
        name: 'chunsang.yu',
        nickname: 'chunsang.yu',
        profileImage: 'https://materializecss.com/images/yuna.jpg'
      },
      content: 'chunsang.yu님이 게시글에 댓글을 남겼습니다.',
      alertDate: '2018-07-28 12:15:00'
    },{
      id: 5,
      provider: {
        email: 'chunsang.yu@gmail.com',
        name: 'chunsang.yu',
        nickname: 'chunsang.yu',
        profileImage: 'https://materializecss.com/images/yuna.jpg'
      },
      content: 'chunsang.yu님이 게시글에 댓글을 남겼습니다.',
      alertDate: '2018-07-28 12:15:00'
    },{
      id: 6,
      provider: {
        email: 'chunsang.yu@gmail.com',
        name: 'chunsang.yu',
        nickname: 'chunsang.yu',
        profileImage: 'https://materializecss.com/images/yuna.jpg'
      },
      content: 'chunsang.yu님이 게시글에 댓글을 남겼습니다.',
      alertDate: '2018-07-28 12:15:00'
    }]
  }

  handleClickItem = (id) => {
    const { items } = this.state;
    const index = items.findIndex( item => item.id === id);
    
    this.setState({
      activeId: id
    });

    window.M.Toast.dismissAll();
    window.M.toast({
      html: `${index + 1} 번째 항목이 선택되었습니다.`
    });
  }

  handleClickViewMore = () => {
    const { folding } = this.state;
    this.setState({
      folding: !folding
    });
  }

  render() {
    const { activeId, items, folding } = this.state;
    const {
      handleClickItem,
      handleClickViewMore
    } = this;

    return (
      <Status 
        items={items}
        activeId={activeId}
        folding={folding}
        onClickItem={handleClickItem}
        onClickViewMore={handleClickViewMore}
      />
    )
  }
}

export default StatusContainer;