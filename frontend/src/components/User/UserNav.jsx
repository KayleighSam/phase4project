import React from 'react';
import { Link } from 'react-router-dom';

const UserNav = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/user-dashboard">
          User Dashboard
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/user-dashboard">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/user-dashboard/manage-profile">
                Manage Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-danger" to="/logout">
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default UserNav;
