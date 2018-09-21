import React from 'react';
import { Link } from 'react-router-dom';

const Bottom = ({
  active,
  session,
  unread
}) => {
  const badge = unread > 0 
  ? <span className="red darken-1 badge notification-badge">{unread}</span>
  : <div></div>

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
            {badge}
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
          <Link to={`/${session.nickname}`} className="grey-text text-lighten-2">
            <i className={`material-icons 
              ${active !== "/" && active !== "/home" && 
                active !== "/search" && active !== "/status" && 
                active !== "/mentoring" && "active"}`}>
              person
            </i>
          </Link>
        </div>
      </footer>
  )
};

export default Bottom;