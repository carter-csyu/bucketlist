import React from 'react';
import './Search.css';

const Search = () => {
  return (
    <div>
      <nav className="search-bar white">
        <div className="nav-wrapper">
          <div className="input-field">
            <input id="search" type="search" className="black-text" required />
            <label className="label-icon" htmlFor="search">
              <i className="material-icons indigo-text darken-4">search</i>
            </label>
            <i className="material-icons">close</i>
          </div>
        </div>
      </nav>
      <h1>
        검색
      </h1>
    </div>
  )
};

export default Search;