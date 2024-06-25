// src/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item active">
            <Link className="nav-link" to="/homepage">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/groups">Groups</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/about">About</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/currency">Currency Converter</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/weather">Currency Converter</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;