import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPackage, FiShoppingBag, FiUser, FiMapPin, 
  FiClock, FiCheckCircle, FiXCircle, FiEye,
  FiCreditCard, FiTruck, FiEdit2
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      const response = await orderService.getOrders();
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending': return <FiClock />;
      case 'Processing': return <FiPackage />;
      case 'Shipped': return <FiTruck />;
      case 'Delivered': return <FiCheckCircle />;
      case 'Cancelled': return <FiXCircle />;
      default: return <FiPackage />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return '#F59E0B';
      case 'Processing': return '#3B82F6';
      case 'Shipped': return '#2E5A4C';
      case 'Delivered': return '#10B981';
      case 'Cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const tabs = [
    { id: 'orders', name: 'My Orders', icon: <FiShoppingBag /> },
    { id: 'profile', name: 'Profile', icon: <FiUser /> },
    { id: 'addresses', name: 'Addresses', icon: <FiMapPin /> },
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="banner-content">
          <h1>Welcome back, {user?.Name}! 👋</h1>
          <p>Manage your orders and profile from your personal dashboard</p>
        </div>
        <div className="banner-stats">
          <div className="stat">
            <span className="stat-value">{orders.length}</span>
            <span className="stat-label">Total Orders</span>
          </div>
          <div className="stat">
            <span className="stat-value">
              {orders.filter(o => o.OrderStatus === 'Delivered').length}
            </span>
            <span className="stat-label">Delivered</span>
          </div>
          <div className="stat">
            <span className="stat-value">
              {orders.filter(o => o.OrderStatus === 'Pending').length}
            </span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <motion.div 
          className="orders-tab"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {orders.length === 0 ? (
            <div className="empty-state">
              <FiPackage size={64} />
              <h3>No orders yet</h3>
              <p>Start shopping to see your orders here!</p>
              <button className="btn btn-primary" onClick={() => window.location.href = '/shop'}>
                Browse Products
              </button>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map(order => (
                <motion.div 
                  key={order.OrderID}
                  className="order-card"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="order-header">
                    <div className="order-info">
                      <h3>Order #{order.OrderNumber}</h3>
                      <p className="order-date">
                        {new Date(order.OrderDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="order-status" style={{ color: getStatusColor(order.OrderStatus) }}>
                      {getStatusIcon(order.OrderStatus)}
                      <span>{order.OrderStatus}</span>
                    </div>
                  </div>

                  <div className="order-items">
                    {order.items?.slice(0, 2).map(item => (
                      <div key={item.OrderItemID} className="order-item">
                        <div className="item-image">
                          <img src={item.ProductImage || '/default-product.jpg'} alt={item.ProductName} />
                        </div>
                        <div className="item-details">
                          <p className="item-name">{item.ProductName}</p>
                          <p className="item-quantity">Qty: {item.Quantity}</p>
                          <p className="item-price">Rs. {(item.UnitPrice * item.Quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                    {order.items?.length > 2 && (
                      <p className="more-items">+{order.items.length - 2} more items</p>
                    )}
                  </div>

                  <div className="order-footer">
                    <div className="order-total">
                      <span>Total Amount:</span>
                      <strong>Rs. {order.TotalAmount.toLocaleString()}</strong>
                    </div>
                    <div className="order-actions">
                      <button className="btn btn-outline btn-sm">
                        <FiEye /> Track Order
                      </button>
                      <button className="btn btn-primary btn-sm">
                        View Details
                      </button>
                    </div>
                  </div>

                  <div className="order-details">
                    <div className="detail-item">
                      <FiCreditCard />
                      <span>Payment: </span>
                      <span className={`badge badge-${order.payment?.PaymentStatus?.toLowerCase()}`}>
                        {order.payment?.PaymentStatus}
                      </span>
                    </div>
                    <div className="detail-item">
                      <FiTruck />
                      <span>Shipping: </span>
                      <span className={`badge badge-${order.shipping?.ShippingStatus?.toLowerCase()}`}>
                        {order.shipping?.ShippingStatus}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <motion.div 
          className="profile-tab"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {user?.Name?.charAt(0)}
              </div>
              <div className="profile-title">
                <h2>{user?.Name}</h2>
                <p>Member since {new Date(user?.CreatedAt).toLocaleDateString()}</p>
              </div>
              <button className="edit-profile-btn">
                <FiEdit2 /> Edit Profile
              </button>
            </div>

            <div className="profile-details">
              <div className="detail-group">
                <label>Email Address</label>
                <p>{user?.Email}</p>
              </div>
              <div className="detail-group">
                <label>User ID</label>
                <p>{user?.UserID}</p>
              </div>
              <div className="detail-group">
                <label>Account Type</label>
                <p>
                  <span className={`badge badge-${user?.Role?.toLowerCase()}`}>
                    {user?.Role}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Addresses Tab */}
      {activeTab === 'addresses' && (
        <motion.div 
          className="addresses-tab"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="addresses-header">
            <h2>Saved Addresses</h2>
            <button className="btn btn-primary">Add New Address</button>
          </div>

          <div className="addresses-grid">
            <div className="address-card">
              <div className="address-type">
                <span className="badge badge-primary">Home</span>
                <button className="edit-btn">Edit</button>
              </div>
              <p className="address-line">{user?.Name}</p>
              <p className="address-line">123 Main Street</p>
              <p className="address-line">Colombo 03</p>
              <p className="address-line">Western Province</p>
              <p className="address-line">Sri Lanka</p>
              <p className="address-phone">+94 77 123 4567</p>
            </div>
          </div>
        </motion.div>
      )}

      <style jsx>{`
        .user-dashboard {
          padding: var(--spacing-xl) 0;
        }

        .welcome-banner {
          background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-dark) 100%);
          border-radius: var(--radius-xl);
          padding: var(--spacing-xl);
          margin-bottom: var(--spacing-xl);
          color: var(--color-white);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--spacing-lg);
        }

        .banner-content h1 {
          color: var(--color-white);
          margin-bottom: var(--spacing-xs);
        }

        .banner-content p {
          opacity: 0.9;
        }

        .banner-stats {
          display: flex;
          gap: var(--spacing-xl);
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          font-size: var(--font-size-2xl);
          font-weight: 700;
          display: block;
        }

        .stat-label {
          font-size: var(--font-size-sm);
          opacity: 0.9;
        }

        .dashboard-tabs {
          display: flex;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
          border-bottom: 2px solid var(--color-gray-200);
          padding-bottom: var(--spacing-md);
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm) var(--spacing-lg);
          border-radius: var(--radius-md);
          color: var(--color-gray-600);
          font-weight: 500;
          transition: all var(--transition-fast);
        }

        .tab-btn:hover {
          background: var(--color-gray-100);
        }

        .tab-btn.active {
          background: var(--color-secondary);
          color: var(--color-white);
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .order-card {
          background: var(--color-white);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          box-shadow: var(--shadow-md);
          transition: all var(--transition-base);
        }

        .order-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--spacing-md);
          padding-bottom: var(--spacing-md);
          border-bottom: 1px solid var(--color-gray-200);
        }

        .order-info h3 {
          margin-bottom: var(--spacing-xs);
          font-size: var(--font-size-lg);
        }

        .order-date {
          color: var(--color-gray-500);
          font-size: var(--font-size-sm);
        }

        .order-status {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          font-weight: 500;
        }

        .order-items {
          margin-bottom: var(--spacing-md);
        }

        .order-item {
          display: flex;
          gap: var(--spacing-md);
          padding: var(--spacing-sm) 0;
        }

        .item-image {
          width: 60px;
          height: 60px;
          background: var(--color-gray-100);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-details {
          flex: 1;
        }

        .item-name {
          font-weight: 500;
          margin-bottom: var(--spacing-xs);
        }

        .item-quantity {
          color: var(--color-gray-500);
          font-size: var(--font-size-sm);
        }

        .item-price {
          font-weight: 600;
          color: var(--color-secondary);
        }

        .more-items {
          color: var(--color-gray-500);
          font-size: var(--font-size-sm);
          margin-top: var(--spacing-sm);
        }

        .order-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: var(--spacing-md);
          padding-top: var(--spacing-md);
          border-top: 1px solid var(--color-gray-200);
        }

        .order-total {
          font-size: var(--font-size-lg);
        }

        .order-total strong {
          color: var(--color-secondary);
          margin-left: var(--spacing-sm);
        }

        .order-actions {
          display: flex;
          gap: var(--spacing-sm);
        }

        .order-details {
          display: flex;
          gap: var(--spacing-lg);
          margin-top: var(--spacing-md);
          padding-top: var(--spacing-md);
          border-top: 1px dashed var(--color-gray-200);
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: var(--color-gray-600);
          font-size: var(--font-size-sm);
        }

        .empty-state {
          text-align: center;
          padding: var(--spacing-3xl) 0;
          color: var(--color-gray-500);
        }

        .empty-state h3 {
          margin: var(--spacing-md) 0 var(--spacing-sm);
        }

        .profile-card {
          background: var(--color-white);
          border-radius: var(--radius-lg);
          padding: var(--spacing-xl);
          box-shadow: var(--shadow-md);
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
          flex-wrap: wrap;
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          background: var(--color-secondary);
          color: var(--color-white);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-size-3xl);
          font-weight: 600;
        }

        .profile-title {
          flex: 1;
        }

        .profile-title h2 {
          margin-bottom: var(--spacing-xs);
        }

        .profile-title p {
          color: var(--color-gray-500);
        }

        .edit-profile-btn {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm) var(--spacing-lg);
          border: 2px solid var(--color-secondary);
          border-radius: var(--radius-md);
          color: var(--color-secondary);
          font-weight: 500;
          transition: all var(--transition-fast);
        }

        .edit-profile-btn:hover {
          background: var(--color-secondary);
          color: var(--color-white);
        }

        .profile-details {
          margin-bottom: var(--spacing-xl);
        }

        .detail-group {
          margin-bottom: var(--spacing-lg);
        }

        .detail-group label {
          display: block;
          color: var(--color-gray-500);
          font-size: var(--font-size-sm);
          margin-bottom: var(--spacing-xs);
        }

        .detail-group p {
          font-size: var(--font-size-lg);
          font-weight: 500;
        }

        .addresses-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--spacing-lg);
        }

        .addresses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--spacing-lg);
        }

        .address-card {
          background: var(--color-white);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          box-shadow: var(--shadow-md);
        }

        .address-type {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--spacing-md);
        }

        .edit-btn {
          color: var(--color-gray-500);
          font-size: var(--font-size-sm);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .edit-btn:hover {
          background: var(--color-gray-100);
          color: var(--color-secondary);
        }

        .address-line {
          color: var(--color-gray-700);
          margin-bottom: var(--spacing-xs);
        }

        .address-phone {
          margin-top: var(--spacing-md);
          color: var(--color-secondary);
          font-weight: 500;
        }

        .btn-sm {
          padding: var(--spacing-xs) var(--spacing-md);
          font-size: var(--font-size-sm);
        }

        @media (max-width: 768px) {
          .welcome-banner {
            flex-direction: column;
            text-align: center;
          }

          .banner-stats {
            width: 100%;
            justify-content: center;
          }

          .dashboard-tabs {
            flex-wrap: wrap;
          }

          .tab-btn {
            flex: 1;
            justify-content: center;
          }

          .order-footer {
            flex-direction: column;
            gap: var(--spacing-md);
          }

          .order-actions {
            width: 100%;
          }

          .order-actions button {
            flex: 1;
          }

          .order-details {
            flex-direction: column;
            gap: var(--spacing-sm);
          }

          .profile-header {
            flex-direction: column;
            text-align: center;
          }

          .addresses-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;