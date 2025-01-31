import React from "react";
import { Route, Routes } from "react-router-dom";
import ClientLogin from "../pages/ClientLogin";
import Signup from "../pages/Signup";
import AdminLogin from "../pages/AdminLogin";

// Admin Components
import AdminDashboard from "../components/Admin/AdminDashboard";
import ManageProperties from "../components/Admin/ManageProperties";
import ManageUsers from "../components/Admin/ManageUsers";
import ManageRequests from "../components/Admin/ManageRequests";
import AddProperty from "../components/Admin/AddProperty";

// User Components
import UserDashboard from "../components/User/UserDashboard";
import ManageProfile from "../components/User/ManageProfile";
import ViewProperty from "../components/User/ViewProperty";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<ClientLogin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* Admin Routes */}
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin-dashboard/manage-properties" element={<ManageProperties />} />
      <Route path="/admin-dashboard/manage-users" element={<ManageUsers />} />
      <Route path="/admin-dashboard/manage-requests" element={<ManageRequests />} />
      <Route path="/admin-dashboard/add-property" element={<AddProperty />} />

      {/* User Routes */}
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/user-dashboard/manage-profile" element={<ManageProfile />} />
      <Route path="/user-dashboard/view-property/:id" element={<ViewProperty />} />
    </Routes>
  );
};

export default AppRoutes;
