import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const AdminNav = () => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    // Confirm logout action
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    
    if (confirmLogout) {
      // Clear the token and redirect to the home page
      localStorage.removeItem('access_token'); // Remove token from localStorage
      navigate("/", { replace: true }); // Redirect to the home page
    } else {
      console.log("Logout canceled.");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <NavLink className="navbar-brand" to="/admin-dashboard">
          Admin Panel
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbar"
          aria-controls="adminNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="adminNavbar">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/admin-dashboard"
                style={({ isActive }) => ({
                  fontWeight: isActive ? 'bold' : 'normal', // Styling for active link
                })}
              >
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/admin-dashboard/manage-properties"
                style={({ isActive }) => ({
                  fontWeight: isActive ? 'bold' : 'normal',
                })}
              >
                Manage Properties
              </NavLink>
            </li>
            <li className="nav-item">
              <a
                href="#"
                className="nav-link text-danger"
                onClick={handleLogoutClick}
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;
