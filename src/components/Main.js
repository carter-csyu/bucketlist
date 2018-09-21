import React from 'react';
import PropTypes from 'prop-types';
import './Main.css';
import Bottom from './Bottom';

const Main = ({
  active,
  content,
  session,
  unread
}) => {
  return (
    <div className="main">
      <main>
        {content}
      </main>
      <Bottom 
        active={active}
        session={session}
        unread={unread}
      />
    </div>
  )
};

Main.propTypes = {
  active: PropTypes.string,
  content: PropTypes.element,
  unread: PropTypes.number
};

Main.defaultProps = {
  unread: 0,
  active: 1,
  content: (<div>Bucket List</div>)
};

export default Main;