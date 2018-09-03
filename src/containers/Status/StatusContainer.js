import React, { Component } from 'react';
import Status from 'components/Status';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as notificationActions from 'store/modules/notification';

class StatusContainer extends Component {
  state = {
    activeId: '',
    folding: true
  }

  handleClickItem = (id) => {
    const { notifications, history, NotificationActions } = this.props;
    const index = notifications.findIndex(notification => notification._id === id);

    this.setState({
      activeId: id
    });

    NotificationActions.readRequest(notifications[index]._id).then(
      () => {
        const { status, error } = this.props;

        if (status === "FAILURE") {
          window.M.toast({
            html: error.message
          });
        } else if (status === "SUCCESS") {
          history.push({
            pathname: `article/${notifications[index].article}`
          });
        }
      }
    )
  }

  handleClickViewMore = () => {
    const { folding } = this.state;
    this.setState({
      folding: !folding
    });
  }

  componentDidMount() {
    const { NotificationActions } = this.props;

    console.log(NotificationActions);

    NotificationActions.getNotificationsRequest()
    .then( () => {
      const { status, error } = this.props;

      if (status === "SUCCESS") {
      } else if (status === "FAILURE") {
        window.M.toast({
          html: error.message
        });
      }
    })
  }

  render() {
    const { activeId, folding } = this.state;
    const {
      handleClickItem,
      handleClickViewMore
    } = this;
    const { notifications } = this.props;

    return (
      <Status 
        notifications={notifications}
        activeId={activeId}
        folding={folding}
        onClickItem={handleClickItem}
        onClickViewMore={handleClickViewMore}
      />
    )
  }
}

export default connect(
  ({notification}) => ({
    status: notification.status,
    error: notification.error,
    notifications: notification.notifications
  }),
  (dispatch) => ({
    NotificationActions: bindActionCreators(notificationActions, dispatch)
  })
)(StatusContainer);