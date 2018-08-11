import React from 'react';
import { Link } from 'react-router-dom';

const Bottom = ({
  active,
}) => {
  return (
    <footer className="page-footer footer white">
        <div className="footer-items">
          <Link to="/home" className="grey-text text-lighten-2">
            <i className={`material-icons ${active === '/home' || active === '/' ? 'active': ''}`}>
              home
            </i>
          </Link>
        </div>
        <div className="footer-items">
          <Link to="/search" className="grey-text text-lighten-2">
            <i className={`material-icons ${active === '/search' && "active"}`}>
              search
            </i>
          </Link>
        </div>
        <div className="footer-items">
          <Link to="/status" className="grey-text text-lighten-2">
            <i className={`material-icons ${active === '/status' && "active"}`}>
              notifications
            </i>
          </Link>
        </div>
        <div className="footer-items">
          <Link to="/mentoring" className="grey-text text-lighten-2">
            <i className={`material-icons ${active === '/mentoring' && "active"}`}>
              group_work
            </i>
          </Link>
        </div>
        <div className="footer-items">
          <Link to="/mypage" className="grey-text text-lighten-2">
            <i className={`material-icons ${active === '/mypage' && "active"}`}>
              person
            </i>
          </Link>
        </div>
      </footer>
  )
};

export default Bottom;