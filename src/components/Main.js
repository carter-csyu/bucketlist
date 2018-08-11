import React from 'react';
import PropTypes from 'prop-types';
import './Main.css';
import Bottom from './Bottom';

const Main = ({
  active,
  content
}) => {
  return (
    <div className="main">
      <main>
        {content}
      </main>
      <Bottom 
        active={active}
      />
    </div>
  )
};

Main.propTypes = {
  active: PropTypes.string,
  content: PropTypes.element,
};

Main.defaultProps = {
  active: 1,
  content: (<div>이게뭐야</div>)
};

export default Main;