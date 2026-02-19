import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import UserDashboard from '../components/dashboard/UserDashboard';
import Loader from '../components/common/Loader';

const DashboardPage = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        {user?.Role === 'Admin' ? (
          <AdminDashboard />
        ) : (
          <UserDashboard />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;