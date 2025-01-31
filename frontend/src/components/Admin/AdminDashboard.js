import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar">
          <div className="sidebar-sticky">
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link to="/admin-dashboard" className="nav-link active">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin-dashboard/manage-properties" className="nav-link">
                  Manage Properties
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin-dashboard/manage-requests" className="nav-link">
                  Manage Requests
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin-dashboard/add-property" className="nav-link">
                  Add Property
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Admin Dashboard</h1>
          </div>

          {/* Dashboard Overview */}
          <div className="card mb-4 shadow-lg">
            <div className="card-header bg-primary text-white">
              <h5>Overview</h5>
            </div>
            <div className="card-body">
              <p className="card-text">Welcome to the admin dashboard. From here, you can manage properties, users, and more. Use the sidebar to navigate through different sections.</p>
            </div>
          </div>

          {/* Manage Properties Section */}
          <div className="row">
            <div className="col-12 col-md-6 mb-4">
              <div className="card shadow-lg">
                <div className="card-body">
                  <h5 className="card-title">Manage Properties</h5>
                  <p className="card-text">Easily add, edit, or delete properties listed on the platform.</p>
                  <Link to="/admin-dashboard/manage-properties" className="btn btn-success w-100">Go to Manage Properties</Link>
                </div>
              </div>
            </div>

            {/* Manage Requests Section */}
            <div className="col-12 col-md-6 mb-4">
              <div className="card shadow-lg">
                <div className="card-body">
                  <h5 className="card-title">Manage Requests</h5>
                  <p className="card-text">View and manage incoming requests from users and admins.</p>
                  <Link to="/admin-dashboard/manage-requests" className="btn btn-warning w-100">Go to Manage Requests</Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
