import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import UserDashboard from '../components/dashboard/UserDashboard';
import Loader from '../components/common/Loader';

const DashboardPage = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // fetch data
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <Loader message="Loading your dashboard" />;
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