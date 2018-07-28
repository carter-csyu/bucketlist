import React from 'react';
import PropTypes from 'prop-types';
import './Main.css';
import Bottom from './Bottom';

const Main = ({
  active,
  content,
  onClickMenu
}) => {
  return (
    <div className="main">
      <main>
        {content}
      </main>
      <Bottom 
        active={active}
        onClickMenu={onClickMenu}
      />
    </div>
  )
};

Main.propTypes = {
  active: PropTypes.number,
  content: PropTypes.element,
  onClickMenu: PropTypes.func
};

Main.defaultProps = {
  active: 1,
  content: (<div>이게뭐야</div>),
  onClickMenu: () => console.warn('onClickMenu not defined')
};

export default Main;