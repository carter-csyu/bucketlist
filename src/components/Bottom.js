import React from 'react';

const Bottom = ({
  active,
  onClickMenu
}) => {
  return (
    <footer className="page-footer footer white grey-text lighten-2">
        <div className="footer-items">
          <i 
            className={`material-icons ${active === 1 && "active"}`}
            onClick={() => onClickMenu(1)}>
          home</i>
        </div>
        <div className="footer-items">
          <i 
            className={`material-icons ${active === 2 && "active"}`}
            onClick={() => onClickMenu(2)}>
          search
          </i>
        </div>
        <div className="footer-items">
          <i 
            className={`material-icons ${active === 3 && "active"}`}
            onClick={() => onClickMenu(3)}>
          notifications
          </i>
        </div>
        <div className="footer-items">
          <i 
            className={`material-icons ${active === 4 && "active"}`}
            onClick={() => onClickMenu(4)}>
          group_work</i>
        </div>
        <div className="footer-items">
          <i 
            className={`material-icons ${active === 5 && "active"}`}
            onClick={() => onClickMenu(5)}>
          person
          </i>
        </div>
      </footer>
  )
};

export default Bottom;