import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Banner from './components/Banner';
import Footer from './components/Footer';
import ClientLogin from './pages/ClientLogin';
import Signup from './pages/Signup';
import AdminLogin from './pages/AdminLogin';
import Layout from './components/Layout';
import UserDashboard from './components/User/UserDashboard';
import ManageProfile from './components/User/ManageProfile';
import AdminDashboard from './components/Admin/AdminDashboard';
import ManageProperties from './components/Admin/ManageProperties';
import ManageUsers from './components/Admin/ManageUsers';
import ManageRequests from './components/Admin/ManageRequests';
import AddProperty from './components/Admin/AddProperty';

const App = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/properties');
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    fetchProperties();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<ClientLogin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Admin Routes - Now Fully Independent */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-dashboard/manage-properties" element={<ManageProperties />} />
        <Route path="/admin-dashboard/manage-users" element={<ManageUsers />} />
        <Route path="/admin-dashboard/manage-requests" element={<ManageRequests />} />
        <Route path="/admin-dashboard/add-property" element={<AddProperty />} />

        {/* Main app routes wrapped in Layout */}
        <Route path="/*" element={
          <Layout>
            <Banner />
            <div className="container mt-5">
              <AppRoutes properties={properties} />
            </div>
          </Layout>
        } />

        {/* User-specific routes */}
        <Route path="/user-dashboard" element={<UserDashboard properties={properties} />} />
        <Route path="/user-dashboard/manage-profile" element={<ManageProfile />} />
      </Routes>

      <Footer /> {/* Footer is always shown */}
    </Router>
  );
};

export default App;
