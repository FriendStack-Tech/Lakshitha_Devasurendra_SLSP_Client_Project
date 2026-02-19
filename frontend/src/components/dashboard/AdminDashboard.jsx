import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPackage, FiShoppingBag, FiUsers, FiDollarSign, 
  FiTrendingUp, FiAlertTriangle, FiRefreshCw, FiPlus,
  FiEdit, FiTrash2, FiEye
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    lowStock: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const productsRes = await productService.getAllProducts();
      const ordersRes = await orderService.getOrders();
      
      const productsData = productsRes.data.products || [];
      const ordersData = ordersRes.data.orders || [];
      
      setProducts(productsData);
      setOrders(ordersData);

      const totalRevenue = ordersData
        .filter(order => order.OrderStatus === 'Delivered')
        .reduce((sum, order) => sum + order.TotalAmount, 0);

      setStats({
        totalProducts: productsData.length,
        totalOrders: ordersData.length,
        totalRevenue,
        totalCustomers: new Set(ordersData.map(o => o.UserID)).size,
        lowStock: productsData.filter(p => p.StockQuantity <= 10).length,
        pendingOrders: ordersData.filter(o => o.OrderStatus === 'Pending').length
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(productId);
        setProducts(products.filter(p => p.ProductID !== productId));
        toast.success('Product deleted successfully');
        fetchDashboardData();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <FiTrendingUp /> },
    { id: 'products', name: 'Products', icon: <FiPackage /> },
    { id: 'orders', name: 'Orders', icon: <FiShoppingBag /> },
  ];

  const StatCard = ({ title, value, icon, color }) => (
    <motion.div 
      className="stat-card"
      whileHover={{ y: -4 }}
    >
      <div className="stat-content">
        <div>
          <p className="stat-label">{title}</p>
          <p className="stat-value">{value}</p>
        </div>
        <div className="stat-icon" style={{ color, background: `${color}20` }}>
          {icon}
        </div>
      </div>

      <style jsx>{`
        .stat-card {
          background: var(--color-white);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          box-shadow: var(--shadow-md);
          transition: all var(--transition-base);
          border-left: 4px solid ${color};
        }

        .stat-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .stat-label {
          color: var(--color-gray-600);
          font-size: var(--font-size-sm);
          margin-bottom: var(--spacing-xs);
        }

        .stat-value {
          font-size: var(--font-size-2xl);
          font-weight: 700;
          color: var(--color-gray-900);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-size-xl);
        }
      `}</style>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.Name}!</h1>
        <p>Manage your spice empire from here</p>
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div 
          className="overview-tab"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="stats-grid">
            <StatCard 
              title="Total Products"
              value={stats.totalProducts}
              icon={<FiPackage />}
              color="#2E5A4C"
            />
            <StatCard 
              title="Total Orders"
              value={stats.totalOrders}
              icon={<FiShoppingBag />}
              color="#C94F3F"
            />
            <StatCard 
              title="Revenue"
              value={`Rs. ${stats.totalRevenue.toLocaleString()}`}
              icon={<FiDollarSign />}
              color="#10B981"
            />
            <StatCard 
              title="Customers"
              value={stats.totalCustomers}
              icon={<FiUsers />}
              color="#3B82F6"
            />
            <StatCard 
              title="Low Stock"
              value={stats.lowStock}
              icon={<FiAlertTriangle />}
              color="#F59E0B"
            />
            <StatCard 
              title="Pending Orders"
              value={stats.pendingOrders}
              icon={<FiRefreshCw />}
              color="#EF4444"
            />
          </div>

          {/* Recent Orders */}
          <div className="recent-section">
            <h2>Recent Orders</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map(order => (
                    <tr key={order.OrderID}>
                      <td>{order.OrderNumber}</td>
                      <td>{new Date(order.OrderDate).toLocaleDateString()}</td>
                      <td>Rs. {order.TotalAmount.toLocaleString()}</td>
                      <td>
                        <span className={`badge badge-${order.OrderStatus?.toLowerCase()}`}>
                          {order.OrderStatus}
                        </span>
                      </td>
                      <td>
                        <button className="action-btn view">
                          <FiEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <motion.div 
          className="products-tab"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="tab-header">
            <h2>Product Management</h2>
            <button className="btn btn-primary">
              <FiPlus /> Add Product
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.ProductID}>
                    <td>{product.ProductID}</td>
                    <td>{product.ProductName}</td>
                    <td>{product.Category}</td>
                    <td>Rs. {product.Price.toLocaleString()}</td>
                    <td>
                      <span style={{
                        color: product.StockQuantity <= 10 ? 'var(--color-error)' : 'inherit',
                        fontWeight: product.StockQuantity <= 10 ? 700 : 'normal',
                      }}>
                        {product.StockQuantity}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${product.StockQuantity > 0 ? 'success' : 'danger'}`}>
                        {product.StockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                        <button className="action-btn edit">
                          <FiEdit />
                        </button>
                        <button 
                          className="action-btn delete"
                          onClick={() => handleDeleteProduct(product.ProductID)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <motion.div 
          className="orders-tab"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2>Order Management</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.OrderID}>
                    <td>{order.OrderNumber}</td>
                    <td>{new Date(order.OrderDate).toLocaleDateString()}</td>
                    <td>{order.UserID}</td>
                    <td>Rs. {order.TotalAmount.toLocaleString()}</td>
                    <td>
                      <span className={`badge badge-${order.payment?.PaymentStatus?.toLowerCase()}`}>
                        {order.payment?.PaymentStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${order.OrderStatus?.toLowerCase()}`}>
                        {order.OrderStatus}
                      </span>
                    </td>
                    <td>
                      <button className="action-btn view">
                        <FiEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      <style jsx>{`
        .admin-dashboard {
          padding: var(--spacing-xl) 0;
        }

        .dashboard-header {
          margin-bottom: var(--spacing-2xl);
        }

        .dashboard-header h1 {
          color: var(--color-secondary);
          margin-bottom: var(--spacing-xs);
        }

        .dashboard-header p {
          color: var(--color-gray-600);
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

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }

        .tab-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--spacing-lg);
        }

        .action-btn {
          padding: var(--spacing-sm);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
          color: var(--color-gray-600);
        }

        .action-btn:hover {
          background: var(--color-gray-100);
          transform: scale(1.1);
        }

        .action-btn.edit:hover { color: var(--color-warning); }
        .action-btn.delete:hover { color: var(--color-error); }
        .action-btn.view:hover { color: var(--color-info); }

        .badge-pending { background: var(--color-warning); color: white; }
        .badge-processing { background: var(--color-info); color: white; }
        .badge-shipped { background: var(--color-secondary); color: white; }
        .badge-delivered { background: var(--color-success); color: white; }
        .badge-cancelled { background: var(--color-error); color: white; }
        .badge-completed { background: var(--color-success); color: white; }
        .badge-failed { background: var(--color-error); color: white; }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-tabs {
            flex-wrap: wrap;
          }

          .tab-btn {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;