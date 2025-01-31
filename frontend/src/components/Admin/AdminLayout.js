import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminNav from './AdminNav';

const AdminLayout = ({ handleLogout }) => {
  return (
    <div>
      <AdminHeader />
      <AdminNav handleLogout={handleLogout} />
      <div className="container mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
