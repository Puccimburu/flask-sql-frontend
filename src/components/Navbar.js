import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/logo.png'; // Update this path to where your logo is stored

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img 
            src={logoImage} 
            alt="Execo Logo" 
            height="30" 
            className="me-2" 
          />
          execo
        </Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/add" className="nav-link">Add Item</Link>
            </li>
            <li className="nav-item">
              <Link to="/tables" className="nav-link">Database Tables</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;