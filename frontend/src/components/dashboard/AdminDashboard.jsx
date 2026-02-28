import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPackage, FiShoppingBag, FiUsers, FiDollarSign, 
  FiTrendingUp, FiAlertTriangle, FiRefreshCw, FiPlus,
  FiEdit, FiTrash2, FiEye, FiFilter, FiX, FiChevronRight,
  FiBarChart2, FiActivity, FiEdit2, FiTruck
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { shippingService } from '../../services/shippingService';
import toast from 'react-hot-toast';
import Loader from '../common/Loader';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    lowStock: 0,
    pendingOrders: 0
  });

  // Order status modal
  const [statusModal, setStatusModal] = useState({ open: false, order: null, status: '' });

  // Shipping status modal
  const [shipModal, setShipModal] = useState({
    open: false,
    shipment: null,
    status: '',
    trackingNumber: '',
    courierService: ''
  });

  const [showLowStock, setShowLowStock] = useState(false);
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [lowStockLoading, setLowStockLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const productsRes = await productService.getAllProducts();
      const ordersRes = await orderService.getOrders();
      const shipmentsRes = await shippingService.getAllShipments();
      const productsData = productsRes.data.products || [];
      const ordersData = ordersRes.data.orders || [];
      const shipmentsData = shipmentsRes.data.shipments || [];
      setProducts(productsData);
      setOrders(ordersData);
      setShipments(shipmentsData);
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

  const handleEditProduct = (productId) => {
    navigate(`/admin/products/${productId}/edit`);
  };

  const handleFetchLowStock = async () => {
    if (showLowStock) {
      setShowLowStock(false);
      setLowStockProducts([]);
      return;
    }
    setLowStockLoading(true);
    try {
      const res = await productService.getLowStockProducts(lowStockThreshold);
      setLowStockProducts(res.data.products || []);
      setShowLowStock(true);
    } catch (error) {
      toast.error('Failed to fetch low stock products');
    } finally {
      setLowStockLoading(false);
    }
  };

  // ── Save Order Status ──
  const handleSaveOrderStatus = async () => {
    try {
      await orderService.updateOrderStatus(statusModal.order.OrderID, statusModal.status);
      setOrders(prev =>
        prev.map(o =>
          o.OrderID === statusModal.order.OrderID
            ? { ...o, OrderStatus: statusModal.status }
            : o
        )
      );
      toast.success('Order status updated');
      setStatusModal({ open: false, order: null, status: '' });
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  // ── Save Shipping Status ──
  const handleSaveShipStatus = async () => {
    try {
      await shippingService.updateShippingStatus(shipModal.shipment.ShippingID, {
        status: shipModal.status,
        trackingNumber: shipModal.trackingNumber,
        courierService: shipModal.courierService
      });
      setShipments(prev =>
        prev.map(s =>
          s.ShippingID === shipModal.shipment.ShippingID
            ? {
                ...s,
                ShippingStatus: shipModal.status,
                TrackingNumber: shipModal.trackingNumber || s.TrackingNumber,
                CourierService: shipModal.courierService || s.CourierService
              }
            : s
        )
      );
      toast.success('Shipping status updated');
      setShipModal({ open: false, shipment: null, status: '', trackingNumber: '', courierService: '' });
    } catch (err) {
      toast.error('Failed to update shipping status');
    }
  };

  const openShipModal = (shipment) => {
    setShipModal({
      open: true,
      shipment,
      status: shipment.ShippingStatus,
      trackingNumber: shipment.TrackingNumber || '',
      courierService: shipment.CourierService || 'Sri Lanka Post'
    });
  };

  const displayedProducts = showLowStock ? lowStockProducts : products;

  const tabs = [
    { id: 'overview',  name: 'Overview',  icon: <FiActivity /> },
    { id: 'products',  name: 'Products',  icon: <FiPackage /> },
    { id: 'orders',    name: 'Orders',    icon: <FiShoppingBag /> },
    { id: 'shipping',  name: 'Shipping',  icon: <FiTruck /> },
  ];

  const statCards = [
    { title: 'Total Products', value: stats.totalProducts, icon: <FiPackage />, color: '#2E5A4C', bg: 'rgba(46,90,76,0.08)', trend: '+12%' },
    { title: 'Total Orders', value: stats.totalOrders, icon: <FiShoppingBag />, color: '#C94F3F', bg: 'rgba(201,79,63,0.08)', trend: '+8%' },
    { title: 'Customers', value: stats.totalCustomers, icon: <FiUsers />, color: '#3B82F6', bg: 'rgba(59,130,246,0.08)', trend: '+5%' },
    { title: 'Pending Orders', value: stats.pendingOrders, icon: <FiRefreshCw />, color: '#EF4444', bg: 'rgba(239,68,68,0.08)', trend: '-3%' },
  ];

  if (loading) {
    return (
      <div className="ad-loading">
        <div className="ad-loading-inner">
          <div className="ad-spinner" />
          <Loader message="Loading Admin dashboard" />
        </div>
        <style>{`
          .ad-loading { min-height: 60vh; display: flex; align-items: center; justify-content: center; }
          .ad-loading-inner { text-align: center; color: #6b5c44; }
          .ad-spinner { width: 44px; height: 44px; border: 3px solid rgba(200,135,42,0.2); border-top-color: #C8872A; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="ad">

      {/* ── Hero Header ── */}
      <div className="ad__hero">
        <div className="ad__hero-glow" />
        <div className="ad__hero-pattern" />
        <div className="ad__hero-content">
          <motion.span className="ad__eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            ✦ Admin Control Center
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            Welcome back, <span className="ad__hero-name">{user?.Name}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            Manage your spice empire from one place
          </motion.p>
        </div>
        <motion.button
          className="ad__refresh-btn"
          onClick={fetchDashboardData}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <FiRefreshCw /> Refresh
        </motion.button>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="ad__tabs">
        {tabs.map((tab, i) => (
          <motion.button
            key={tab.id}
            className={`ad__tab ${activeTab === tab.id ? 'ad__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="ad__tab-icon">{tab.icon}</span>
            {tab.name}
            {activeTab === tab.id && (
              <motion.div className="ad__tab-indicator" layoutId="tabIndicator" />
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ══════════════════════════════════════
            Overview Tab
        ══════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            className="ad__tab-content"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {/* Stats Grid */}
            <div className="ad__stats-grid">
              {statCards.map((card, i) => (
                <motion.div
                  key={card.title}
                  className={`ad__stat-card ${card.clickable ? 'ad__stat-card--clickable' : ''}`}
                  style={{ '--card-color': card.color, '--card-bg': card.bg }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -5, boxShadow: `0 12px 32px ${card.bg}` }}
                  onClick={card.onClick}
                >
                  <div className="ad__stat-top">
                    <div className="ad__stat-icon-wrap">{card.icon}</div>
                    {card.trend && (
                      <span className={`ad__stat-trend ${card.trend.startsWith('+') ? 'up' : 'down'}`}>{card.trend}</span>
                    )}
                    {card.clickable && (
                      <span className="ad__stat-action">View <FiChevronRight /></span>
                    )}
                  </div>
                  <p className="ad__stat-value">{card.value}</p>
                  <p className="ad__stat-label">{card.title}</p>
                  <div className="ad__stat-bar" />
                </motion.div>
              ))}
            </div>

            {/* Recent Orders */}
            <motion.div className="ad__section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <div className="ad__section-header">
                <h2><FiBarChart2 /> Recent Orders</h2>
                <button className="ad__section-link" onClick={() => setActiveTab('orders')}>
                  View all <FiChevronRight />
                </button>
              </div>
              <div className="ad__table-wrap">
                <table className="ad__table">
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
                    {orders.slice(0, 5).map((order, i) => (
                      <motion.tr key={order.OrderID} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 + i * 0.05 }}>
                        <td className="ad__td-mono">#{order.OrderNumber}</td>
                        <td>{new Date(order.OrderDate).toLocaleDateString()}</td>
                        <td className="ad__td-amount">Rs. {order.TotalAmount.toLocaleString()}</td>
                        <td><span className={`ad__badge ad__badge--${order.OrderStatus?.toLowerCase()}`}>{order.OrderStatus}</span></td>
                        <td>
                          <button
                            className="ad__action-btn ad__action-btn--view"
                            onClick={() => setStatusModal({ open: true, order, status: order.OrderStatus })}
                            title="Update Status"
                          ><FiEdit2 /></button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Recent Shipments */}
            <motion.div className="ad__section ad__section--mt" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <div className="ad__section-header">
                <h2><FiTruck /> Recent Shipments</h2>
                <button className="ad__section-link" onClick={() => setActiveTab('shipping')}>
                  View all <FiChevronRight />
                </button>
              </div>
              <div className="ad__table-wrap">
                <table className="ad__table">
                  <thead>
                    <tr>
                      <th>Shipping ID</th>
                      <th>Order #</th>
                      <th>Courier</th>
                      <th>Tracking</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipments.slice(0, 5).map((s, i) => (
                      <motion.tr key={s.ShippingID} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.65 + i * 0.05 }}>
                        <td className="ad__td-mono">{s.ShippingID}</td>
                        <td className="ad__td-mono">#{s.OrderNumber || s.OrderID}</td>
                        <td><span className="ad__cat-chip">{s.CourierService}</span></td>
                        <td className="ad__td-tracking">{s.TrackingNumber || <span className="ad__td-empty-val">—</span>}</td>
                        <td><span className={`ad__badge ad__badge--ship-${s.ShippingStatus?.toLowerCase().replace(' ', '-')}`}>{s.ShippingStatus}</span></td>
                        <td>
                          <button className="ad__action-btn ad__action-btn--ship" onClick={() => openShipModal(s)} title="Update Shipping">
                            <FiEdit2 />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════
            Products Tab
        ══════════════════════════════════════ */}
        {activeTab === 'products' && (
          <motion.div
            key="products"
            className="ad__tab-content"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="ad__section-header ad__section-header--top">
              <h2><FiPackage /> Product Management</h2>
              <motion.button className="ad__primary-btn" onClick={() => navigate('/admin/products/add')} whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}>
                <FiPlus /> Add Product
              </motion.button>
            </div>

            <div className="ad__filter-bar">
              <div className="ad__filter-left">
                <FiFilter className="ad__filter-icon" />
                <span className="ad__filter-label">Filter:</span>
                <div className="ad__threshold-wrap">
                  <label htmlFor="threshold">Low Stock ≤</label>
                  <input id="threshold" type="number" min="1" value={lowStockThreshold} onChange={(e) => setLowStockThreshold(Number(e.target.value))} className="ad__threshold-input" />
                </div>
                <motion.button
                  className={`ad__filter-btn ${showLowStock ? 'ad__filter-btn--active' : ''}`}
                  onClick={handleFetchLowStock}
                  disabled={lowStockLoading}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                >
                  {lowStockLoading ? <span className="ad__spinner-sm" /> : <FiAlertTriangle />}
                  {showLowStock ? 'Show All' : 'Low Stock'}
                </motion.button>
                <AnimatePresence>
                  {showLowStock && (
                    <motion.button
                      className="ad__clear-btn"
                      onClick={() => { setShowLowStock(false); setLowStockProducts([]); }}
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiX /> Clear
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
              <AnimatePresence>
                {showLowStock && (
                  <motion.span className="ad__filter-badge" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                    {lowStockProducts.length} product{lowStockProducts.length !== 1 ? 's' : ''} ≤ {lowStockThreshold}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <div className="ad__table-wrap">
              <table className="ad__table">
                <thead>
                  <tr>
                    <th>ID</th><th>Product Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="ad__td-empty">
                        <div className="ad__empty-state">
                          <div className="ad__empty-icon"><FiPackage /></div>
                          <p>{showLowStock ? 'No products below this threshold.' : 'No products found.'}</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    displayedProducts.map((product, i) => (
                      <motion.tr key={product.ProductID} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                        <td className="ad__td-mono">#{product.ProductID}</td>
                        <td className="ad__td-bold">{product.ProductName}</td>
                        <td><span className="ad__cat-chip">{product.Category}</span></td>
                        <td className="ad__td-amount">Rs. {product.Price.toLocaleString()}</td>
                        <td>
                          <span className={`ad__stock-val ${product.StockQuantity <= lowStockThreshold ? 'ad__stock-val--low' : ''}`}>
                            {product.StockQuantity <= lowStockThreshold && <FiAlertTriangle />}
                            {product.StockQuantity}
                          </span>
                        </td>
                        <td>
                          <span className={`ad__badge ad__badge--${product.StockQuantity > 0 ? 'delivered' : 'cancelled'}`}>
                            {product.StockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td>
                          <div className="ad__actions">
                            <motion.button className="ad__action-btn ad__action-btn--edit" title="Edit" onClick={() => handleEditProduct(product.ProductID)} whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}><FiEdit /></motion.button>
                            <motion.button className="ad__action-btn ad__action-btn--delete" title="Delete" onClick={() => handleDeleteProduct(product.ProductID)} whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}><FiTrash2 /></motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════
            Orders Tab
        ══════════════════════════════════════ */}
        {activeTab === 'orders' && (
          <motion.div
            key="orders"
            className="ad__tab-content"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="ad__section-header ad__section-header--top">
              <h2><FiShoppingBag /> Order Management</h2>
              <span className="ad__count-badge">{orders.length} total</span>
            </div>
            <div className="ad__table-wrap">
              <table className="ad__table">
                <thead>
                  <tr>
                    <th>Order #</th><th>Date</th><th>Customer</th><th>Amount</th><th>Payment</th><th>Status</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, i) => (
                    <motion.tr key={order.OrderID} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.04, 0.4) }}>
                      <td className="ad__td-mono">#{order.OrderNumber}</td>
                      <td>{new Date(order.OrderDate).toLocaleDateString()}</td>
                      <td>{order.UserID}</td>
                      <td className="ad__td-amount">Rs. {order.TotalAmount.toLocaleString()}</td>
                      <td>
                        <span className={`ad__badge ad__badge--${order.payment?.PaymentStatus?.toLowerCase()}`}>
                          {order.payment?.PaymentStatus}
                        </span>
                      </td>
                      <td>
                        <span className={`ad__badge ad__badge--${order.OrderStatus?.toLowerCase()}`}>
                          {order.OrderStatus}
                        </span>
                      </td>
                      <td>
                        <motion.button
                          className="ad__action-btn ad__action-btn--view"
                          onClick={() => setStatusModal({ open: true, order, status: order.OrderStatus })}
                          title="Update Status"
                          whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
                        ><FiEdit2 /></motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════
            Shipping Tab
        ══════════════════════════════════════ */}
        {activeTab === 'shipping' && (
          <motion.div
            key="shipping"
            className="ad__tab-content"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="ad__section-header ad__section-header--top">
              <h2><FiTruck /> Shipping Management</h2>
              <span className="ad__count-badge">{shipments.length} total</span>
            </div>
            <div className="ad__table-wrap">
              <table className="ad__table">
                <thead>
                  <tr>
                    <th>Shipping ID</th>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Address</th>
                    <th>Courier</th>
                    <th>Tracking #</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="ad__td-empty">
                        <div className="ad__empty-state">
                          <div className="ad__empty-icon"><FiTruck /></div>
                          <p>No shipments found.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    shipments.map((s, i) => (
                      <motion.tr key={s.ShippingID} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.04, 0.4) }}>
                        <td className="ad__td-mono">{s.ShippingID}</td>
                        <td className="ad__td-mono">#{s.OrderNumber || s.OrderID}</td>
                        <td>{s.UserID || '—'}</td>
                        <td className="ad__td-address" title={s.ShippingAddress}>{s.ShippingAddress}</td>
                        <td><span className="ad__cat-chip">{s.CourierService}</span></td>
                        <td className="ad__td-tracking">{s.TrackingNumber || <span className="ad__td-empty-val">—</span>}</td>
                        <td>
                          <span className={`ad__badge ad__badge--ship-${s.ShippingStatus?.toLowerCase().replace(' ', '-')}`}>
                            {s.ShippingStatus}
                          </span>
                        </td>
                        <td>
                          <motion.button
                            className="ad__action-btn ad__action-btn--ship"
                            onClick={() => openShipModal(s)}
                            title="Update Shipping"
                            whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
                          ><FiEdit2 /></motion.button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════
          Order Status Modal
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {statusModal.open && (
          <motion.div
            className="ad__modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setStatusModal({ open: false, order: null, status: '' })}
          >
            <motion.div
              className="ad__modal"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="ad__modal-header">
                <div className="ad__modal-header-left">
                  <div className="ad__modal-icon ad__modal-icon--order"><FiShoppingBag /></div>
                  <h3>Update Order Status</h3>
                </div>
                <button className="ad__modal-close" onClick={() => setStatusModal({ open: false, order: null, status: '' })}><FiX /></button>
              </div>
              <div className="ad__modal-body">
                <p className="ad__modal-order-ref">Order <span>#{statusModal.order?.OrderNumber}</span></p>
                <div className="ad__modal-current">
                  <span>Current:</span>
                  <span className={`ad__badge ad__badge--${statusModal.order?.OrderStatus?.toLowerCase()}`}>{statusModal.order?.OrderStatus}</span>
                </div>
                <div className="ad__modal-field">
                  <label>New Status</label>
                  <div className="ad__status-options">
                    {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
                      <button
                        key={s}
                        className={`ad__status-option ad__status-option--${s.toLowerCase()} ${statusModal.status === s ? 'active' : ''}`}
                        onClick={() => setStatusModal(prev => ({ ...prev, status: s }))}
                      >{s}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="ad__modal-footer">
                <button className="ad__btn ad__btn--secondary" onClick={() => setStatusModal({ open: false, order: null, status: '' })}>Cancel</button>
                <button
                  className="ad__btn ad__btn--primary"
                  disabled={statusModal.status === statusModal.order?.OrderStatus}
                  onClick={handleSaveOrderStatus}
                >Save Changes</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════
          Shipping Status Modal
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {shipModal.open && (
          <motion.div
            className="ad__modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShipModal({ open: false, shipment: null, status: '', trackingNumber: '', courierService: '' })}
          >
            <motion.div
              className="ad__modal ad__modal--wide"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="ad__modal-header">
                <div className="ad__modal-header-left">
                  <div className="ad__modal-icon ad__modal-icon--ship"><FiTruck /></div>
                  <h3>Update Shipping</h3>
                </div>
                <button className="ad__modal-close" onClick={() => setShipModal({ open: false, shipment: null, status: '', trackingNumber: '', courierService: '' })}><FiX /></button>
              </div>

              <div className="ad__modal-body">
                {/* Meta row */}
                <div className="ad__modal-meta-row">
                  <div className="ad__modal-meta-item">
                    <span className="ad__modal-meta-label">Shipping ID</span>
                    <span className="ad__modal-meta-val ad__td-mono">{shipModal.shipment?.ShippingID}</span>
                  </div>
                  <div className="ad__modal-meta-item">
                    <span className="ad__modal-meta-label">Order</span>
                    <span className="ad__modal-meta-val ad__td-mono">#{shipModal.shipment?.OrderNumber || shipModal.shipment?.OrderID}</span>
                  </div>
                  <div className="ad__modal-meta-item">
                    <span className="ad__modal-meta-label">Current Status</span>
                    <span className={`ad__badge ad__badge--ship-${shipModal.shipment?.ShippingStatus?.toLowerCase().replace(' ', '-')}`}>
                      {shipModal.shipment?.ShippingStatus}
                    </span>
                  </div>
                </div>

                {/* Address */}
                <div className="ad__modal-address">
                  <span className="ad__modal-meta-label">Shipping Address</span>
                  <p>{shipModal.shipment?.ShippingAddress}, {shipModal.shipment?.Country}</p>
                </div>

                {/* Courier Service */}
                <div className="ad__modal-field">
                  <label>Courier Service</label>
                  <div className="ad__courier-options">
                    {['Sri Lanka Post', 'DHL', 'FedEx', 'UPS', 'Other'].map((c) => (
                      <button
                        key={c}
                        className={`ad__courier-option ${shipModal.courierService === c ? 'active' : ''}`}
                        onClick={() => setShipModal(prev => ({ ...prev, courierService: c }))}
                      >{c}</button>
                    ))}
                  </div>
                </div>

                {/* Tracking Number */}
                <div className="ad__modal-field">
                  <label>Tracking Number</label>
                  <input
                    type="text"
                    className="ad__modal-input"
                    placeholder="e.g. LK123456789SL"
                    value={shipModal.trackingNumber}
                    onChange={(e) => setShipModal(prev => ({ ...prev, trackingNumber: e.target.value }))}
                  />
                </div>

                {/* Shipping Status */}
                <div className="ad__modal-field">
                  <label>New Shipping Status</label>
                  <div className="ad__status-options">
                    {['Pending', 'Processing', 'Shipped', 'In Transit', 'Delivered', 'Returned'].map((s) => (
                      <button
                        key={s}
                        className={`ad__status-option ad__status-option--ship-${s.toLowerCase().replace(' ', '-')} ${shipModal.status === s ? 'active' : ''}`}
                        onClick={() => setShipModal(prev => ({ ...prev, status: s }))}
                      >{s}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="ad__modal-footer">
                <button className="ad__btn ad__btn--secondary" onClick={() => setShipModal({ open: false, shipment: null, status: '', trackingNumber: '', courierService: '' })}>Cancel</button>
                <button
                  className="ad__btn ad__btn--primary ad__btn--ship"
                  disabled={
                    shipModal.status === shipModal.shipment?.ShippingStatus &&
                    shipModal.trackingNumber === (shipModal.shipment?.TrackingNumber || '') &&
                    shipModal.courierService === shipModal.shipment?.CourierService
                  }
                  onClick={handleSaveShipStatus}
                >
                  <FiTruck /> Save Shipping
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');

        .ad {
          --amber: #C8872A;
          --amber-d: #A06820;
          --amber-l: #F5A94A;
          --forest: #2E5A4C;
          --forest-d: #1e3d33;
          --dark: #1A1208;
          --cream: #FDF8F0;
          --cream-d: #f5ede0;
          --red: #C94F3F;
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #f9f4ec;
          padding: 0 0 80px;
        }

        /* ── Hero ── */
        .ad__hero {
          position: relative;
          background: linear-gradient(135deg, #1A1208 0%, #2E5A4C 55%, #3d6b5a 100%);
          padding: 52px 40px 44px;
          overflow: hidden;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        .ad__hero-glow {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 80% 40%, rgba(200,135,42,0.22) 0%, transparent 65%);
          pointer-events: none;
        }
        .ad__hero-pattern {
          position: absolute; inset: 0;
          background-image: repeating-linear-gradient(45deg, transparent, transparent 28px, rgba(255,255,255,0.02) 28px, rgba(255,255,255,0.02) 29px);
          pointer-events: none;
        }
        .ad__hero-content { position: relative; z-index: 1; }
        .ad__eyebrow { display: inline-block; font-size: 0.72rem; letter-spacing: 3px; text-transform: uppercase; color: var(--amber-l); font-weight: 600; margin-bottom: 10px; }
        .ad__hero h1 { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(1.7rem, 4vw, 2.6rem); color: #fff; margin: 0 0 8px; line-height: 1.2; }
        .ad__hero-name { color: var(--amber-l); }
        .ad__hero p { color: rgba(255,255,255,0.6); font-size: 1rem; margin: 0; }
        .ad__refresh-btn {
          position: relative; z-index: 1;
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 20px; border-radius: 50px;
          border: 1.5px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.85);
          font-size: 0.88rem; font-weight: 600; cursor: pointer;
          transition: all 0.2s; backdrop-filter: blur(8px);
          align-self: flex-start; font-family: 'DM Sans', sans-serif; margin-top: 4px;
        }
        .ad__refresh-btn:hover { background: rgba(200,135,42,0.25); border-color: var(--amber-l); color: #fff; }

        /* ── Tabs ── */
        .ad__tabs {
          display: flex; gap: 4px;
          padding: 20px 40px 0;
          border-bottom: 2px solid rgba(200,135,42,0.12);
          background: #fff;
        }
        .ad__tab {
          position: relative; display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 24px; font-size: 0.92rem; font-weight: 600;
          color: #8a7055; cursor: pointer; border: none; background: none;
          font-family: 'DM Sans', sans-serif; transition: color 0.2s;
          border-radius: 8px 8px 0 0;
        }
        .ad__tab:hover { color: var(--amber-d); background: rgba(200,135,42,0.05); }
        .ad__tab--active { color: var(--amber-d); }
        .ad__tab-icon { font-size: 1rem; display: flex; align-items: center; }
        .ad__tab-indicator { position: absolute; bottom: -2px; left: 0; right: 0; height: 2.5px; background: linear-gradient(90deg, var(--amber), var(--amber-l)); border-radius: 2px 2px 0 0; }

        /* ── Tab Content ── */
        .ad__tab-content { padding: 36px 40px; max-width: 1400px; margin: 0 auto; }

        /* ── Stats Grid ── */
        .ad__stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 36px; }
        .ad__stat-card {
          background: #fff; border-radius: 16px; padding: 24px;
          cursor: default; transition: all 0.25s;
          border: 1.5px solid rgba(200,135,42,0.1);
          box-shadow: 0 2px 12px rgba(26,18,8,0.05);
          position: relative; overflow: hidden;
        }
        .ad__stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--card-color); border-radius: 16px 16px 0 0; }
        .ad__stat-card--clickable { cursor: pointer; }
        .ad__stat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .ad__stat-icon-wrap { width: 42px; height: 42px; border-radius: 12px; background: var(--card-bg); color: var(--card-color); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
        .ad__stat-trend { font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 50px; }
        .ad__stat-trend.up { background: rgba(16,185,129,0.1); color: #059669; }
        .ad__stat-trend.down { background: rgba(239,68,68,0.1); color: #DC2626; }
        .ad__stat-action { display: inline-flex; align-items: center; gap: 2px; font-size: 0.75rem; font-weight: 600; color: var(--card-color); opacity: 0.8; }
        .ad__stat-value { font-family: 'Playfair Display', Georgia, serif; font-size: 1.8rem; font-weight: 700; color: var(--dark); margin: 0 0 4px; line-height: 1; }
        .ad__stat-label { font-size: 0.82rem; color: #8a7055; margin: 0; font-weight: 500; }
        .ad__stat-bar { height: 3px; background: var(--card-bg); border-radius: 3px; margin-top: 16px; position: relative; overflow: hidden; }
        .ad__stat-bar::after { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 60%; background: var(--card-color); border-radius: 3px; opacity: 0.5; }

        /* ── Section ── */
        .ad__section { background: #fff; border-radius: 16px; border: 1.5px solid rgba(200,135,42,0.1); overflow: hidden; box-shadow: 0 2px 12px rgba(26,18,8,0.05); }
        .ad__section--mt { margin-top: 28px; }
        .ad__section-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid rgba(200,135,42,0.1); }
        .ad__section-header h2 { display: flex; align-items: center; gap: 10px; font-family: 'Playfair Display', Georgia, serif; font-size: 1.2rem; color: var(--dark); margin: 0; padding: 0; }
        .ad__section-header--top { background: #fff; border-radius: 16px 16px 0 0; padding: 20px 24px; border-bottom: none; margin-bottom: 20px; }
        .ad__section-header--top h2 { font-size: 1.35rem; }
        .ad__section-link { display: inline-flex; align-items: center; gap: 4px; font-size: 0.85rem; font-weight: 600; color: var(--amber-d); cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif; transition: gap 0.2s; }
        .ad__section-link:hover { gap: 8px; }

        /* ── Table ── */
        .ad__table-wrap { overflow-x: auto; background: #fff; border-radius: 16px; border: 1.5px solid rgba(200,135,42,0.1); box-shadow: 0 2px 12px rgba(26,18,8,0.05); }
        .ad__section .ad__table-wrap { border-radius: 0; border: none; box-shadow: none; }
        .ad__table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
        .ad__table thead tr { background: #fdf8f0; border-bottom: 1.5px solid rgba(200,135,42,0.12); }
        .ad__table th { padding: 13px 18px; text-align: left; font-size: 0.75rem; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: var(--amber); white-space: nowrap; }
        .ad__table tbody tr { border-bottom: 1px solid rgba(200,135,42,0.07); transition: background 0.15s; }
        .ad__table tbody tr:last-child { border-bottom: none; }
        .ad__table tbody tr:hover { background: rgba(200,135,42,0.03); }
        .ad__table td { padding: 14px 18px; color: #3d2b0f; vertical-align: middle; }
        .ad__td-mono { font-family: 'Courier New', monospace; font-size: 0.82rem; color: #8a7055; font-weight: 600; }
        .ad__td-bold { font-weight: 600; color: var(--dark); }
        .ad__td-amount { font-weight: 700; color: var(--forest); font-variant-numeric: tabular-nums; }
        .ad__td-empty { padding: 60px 20px !important; }
        .ad__td-address { max-width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.85rem; color: #6b5c44; }
        .ad__td-tracking { font-family: 'Courier New', monospace; font-size: 0.82rem; font-weight: 600; color: var(--forest); }
        .ad__td-empty-val { color: #ccc; }

        /* ── Empty State ── */
        .ad__empty-state { text-align: center; color: #8a7055; }
        .ad__empty-icon { width: 56px; height: 56px; margin: 0 auto 12px; background: rgba(200,135,42,0.08); border: 1.5px dashed rgba(200,135,42,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; color: var(--amber); }

        /* ── Badges — Order ── */
        .ad__badge { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 50px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.3px; white-space: nowrap; }
        .ad__badge--pending    { background: rgba(245,158,11,0.15); color: #92400E; }
        .ad__badge--processing { background: rgba(59,130,246,0.12); color: #1D4ED8; }
        .ad__badge--shipped    { background: rgba(46,90,76,0.12);   color: var(--forest); }
        .ad__badge--delivered  { background: rgba(16,185,129,0.12); color: #065F46; }
        .ad__badge--cancelled  { background: rgba(239,68,68,0.12);  color: #991B1B; }
        .ad__badge--completed  { background: rgba(16,185,129,0.12); color: #065F46; }
        .ad__badge--failed     { background: rgba(239,68,68,0.12);  color: #991B1B; }
        .ad__badge--paid       { background: rgba(16,185,129,0.12); color: #065F46; }
        .ad__badge--unpaid     { background: rgba(245,158,11,0.15); color: #92400E; }

        /* ── Badges — Shipping ── */
        .ad__badge--ship-pending    { background: rgba(245,158,11,0.15); color: #92400E; }
        .ad__badge--ship-processing { background: rgba(59,130,246,0.12); color: #1D4ED8; }
        .ad__badge--ship-shipped    { background: rgba(139,92,246,0.12); color: #5B21B6; }
        .ad__badge--ship-in-transit { background: rgba(6,182,212,0.12);  color: #0E7490; }
        .ad__badge--ship-delivered  { background: rgba(16,185,129,0.12); color: #065F46; }
        .ad__badge--ship-returned   { background: rgba(239,68,68,0.12);  color: #991B1B; }

        /* ── Category Chip ── */
        .ad__cat-chip { display: inline-block; padding: 3px 10px; border-radius: 6px; font-size: 0.78rem; font-weight: 600; background: rgba(200,135,42,0.1); color: var(--amber-d); border: 1px solid rgba(200,135,42,0.2); }

        /* ── Stock Value ── */
        .ad__stock-val { display: inline-flex; align-items: center; gap: 5px; font-weight: 600; font-variant-numeric: tabular-nums; }
        .ad__stock-val--low { color: #C94F3F; }

        /* ── Action Buttons ── */
        .ad__actions { display: flex; gap: 8px; }
        .ad__action-btn { width: 34px; height: 34px; border-radius: 8px; border: 1.5px solid transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.95rem; transition: all 0.18s; background: none; }
        .ad__action-btn--view  { color: #3B82F6; border-color: rgba(59,130,246,0.2); background: rgba(59,130,246,0.06); }
        .ad__action-btn--view:hover  { background: rgba(59,130,246,0.12); border-color: #3B82F6; }
        .ad__action-btn--edit  { color: var(--amber-d); border-color: rgba(200,135,42,0.2); background: rgba(200,135,42,0.06); }
        .ad__action-btn--edit:hover  { background: rgba(200,135,42,0.12); border-color: var(--amber); }
        .ad__action-btn--delete { color: #C94F3F; border-color: rgba(201,79,63,0.2); background: rgba(201,79,63,0.06); }
        .ad__action-btn--delete:hover { background: rgba(201,79,63,0.12); border-color: #C94F3F; }
        .ad__action-btn--ship  { color: #0E7490; border-color: rgba(6,182,212,0.2); background: rgba(6,182,212,0.06); }
        .ad__action-btn--ship:hover  { background: rgba(6,182,212,0.12); border-color: #06B6D4; }

        /* ── Primary Button ── */
        .ad__primary-btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 22px; border-radius: 50px; background: linear-gradient(135deg, var(--forest), var(--forest-d)); color: #fff; font-size: 0.9rem; font-weight: 700; cursor: pointer; border: none; font-family: 'DM Sans', sans-serif; box-shadow: 0 4px 14px rgba(46,90,76,0.3); transition: box-shadow 0.2s; }
        .ad__primary-btn:hover { box-shadow: 0 6px 20px rgba(46,90,76,0.4); }

        /* ── Filter Bar ── */
        .ad__filter-bar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; background: #fff; border: 1.5px solid rgba(200,135,42,0.12); border-radius: 14px; padding: 14px 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(26,18,8,0.04); }
        .ad__filter-left { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .ad__filter-icon { color: #a08060; font-size: 1rem; }
        .ad__filter-label { font-size: 0.82rem; font-weight: 700; color: #6b5c44; }
        .ad__threshold-wrap { display: flex; align-items: center; gap: 6px; font-size: 0.82rem; color: #8a7055; }
        .ad__threshold-input { width: 60px; padding: 5px 8px; border: 1.5px solid rgba(200,135,42,0.2); border-radius: 8px; font-size: 0.85rem; text-align: center; background: #fdf8f0; color: var(--dark); outline: none; font-family: 'DM Sans', sans-serif; }
        .ad__threshold-input:focus { border-color: var(--amber); }
        .ad__filter-btn { display: inline-flex; align-items: center; gap: 7px; padding: 8px 16px; border-radius: 50px; border: 1.5px solid rgba(200,135,42,0.25); background: #fff; color: #6b5c44; font-size: 0.85rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .ad__filter-btn:hover:not(:disabled) { border-color: var(--amber); color: var(--amber-d); background: rgba(200,135,42,0.06); }
        .ad__filter-btn--active { background: rgba(245,158,11,0.1); border-color: #F59E0B; color: #92400E; }
        .ad__filter-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .ad__clear-btn { display: inline-flex; align-items: center; gap: 5px; padding: 7px 14px; border-radius: 50px; border: 1.5px solid rgba(239,68,68,0.2); background: rgba(239,68,68,0.06); color: #C94F3F; font-size: 0.82rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .ad__clear-btn:hover { background: rgba(239,68,68,0.12); border-color: #C94F3F; }
        .ad__filter-badge { font-size: 0.8rem; font-weight: 700; color: #92400E; background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.25); padding: 5px 12px; border-radius: 50px; }

        /* ── Count Badge ── */
        .ad__count-badge { font-size: 0.8rem; font-weight: 600; color: #8a7055; background: rgba(200,135,42,0.08); border: 1px solid rgba(200,135,42,0.15); padding: 5px 12px; border-radius: 50px; }

        /* ── Spinner ── */
        .ad__spinner-sm { display: inline-block; width: 13px; height: 13px; border: 2px solid rgba(0,0,0,0.12); border-top-color: currentColor; border-radius: 50%; animation: ad-spin 0.7s linear infinite; }
        @keyframes ad-spin { to { transform: rotate(360deg); } }

        /* ══════════════════════════════
           Modals
        ══════════════════════════════ */
        .ad__modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.48);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 20px;
        }
        .ad__modal {
          background: #fff; border-radius: 18px;
          width: 100%; max-width: 440px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.2);
          overflow: hidden;
        }
        .ad__modal--wide { max-width: 560px; }

        .ad__modal-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 22px;
          border-bottom: 1px solid rgba(200,135,42,0.1);
          background: #fdf8f0;
        }
        .ad__modal-header-left { display: flex; align-items: center; gap: 12px; }
        .ad__modal-icon {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
        }
        .ad__modal-icon--order { background: rgba(201,79,63,0.1); color: #C94F3F; }
        .ad__modal-icon--ship  { background: rgba(6,182,212,0.1);  color: #0E7490; }
        .ad__modal-header h3 { font-size: 1rem; font-weight: 700; color: var(--dark); margin: 0; font-family: 'Playfair Display', Georgia, serif; }
        .ad__modal-close { background: none; border: none; cursor: pointer; color: #aaa; font-size: 1.1rem; display: flex; align-items: center; padding: 6px; border-radius: 8px; transition: all 0.15s; }
        .ad__modal-close:hover { background: rgba(0,0,0,0.06); color: #555; }

        .ad__modal-body { padding: 22px; display: flex; flex-direction: column; gap: 18px; }

        .ad__modal-meta-row { display: flex; gap: 16px; flex-wrap: wrap; }
        .ad__modal-meta-item { display: flex; flex-direction: column; gap: 4px; }
        .ad__modal-meta-label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #a08060; }
        .ad__modal-meta-val { font-size: 0.88rem; font-weight: 600; color: var(--dark); }

        .ad__modal-address p { margin: 4px 0 0; font-size: 0.88rem; color: #5c4a2a; background: #fdf8f0; padding: 10px 14px; border-radius: 10px; border: 1px solid rgba(200,135,42,0.12); line-height: 1.5; }

        .ad__modal-order-ref { font-size: 0.88rem; color: #666; margin: 0; }
        .ad__modal-order-ref span { font-weight: 700; color: var(--dark); }

        .ad__modal-current { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: #777; }

        .ad__modal-field label { display: block; font-size: 0.72rem; font-weight: 700; color: #a08060; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.08em; }

        /* ── Status Pills ── */
        .ad__status-options { display: flex; flex-wrap: wrap; gap: 8px; }
        .ad__status-option {
          padding: 6px 14px; border-radius: 20px;
          border: 2px solid #eee;
          font-size: 0.8rem; font-weight: 600; cursor: pointer;
          transition: all 0.18s; background: #f7f7f7; color: #666;
          font-family: 'DM Sans', sans-serif;
        }
        .ad__status-option:hover:not(.active) { background: #efefef; border-color: #ddd; }

        /* Order status pills */
        .ad__status-option--pending.active    { background: #fef3c7; color: #92400e; border-color: #f59e0b; }
        .ad__status-option--processing.active { background: #dbeafe; color: #1e40af; border-color: #3b82f6; }
        .ad__status-option--shipped.active    { background: #ede9fe; color: #5b21b6; border-color: #8b5cf6; }
        .ad__status-option--delivered.active  { background: #d1fae5; color: #065f46; border-color: #10b981; }
        .ad__status-option--cancelled.active  { background: #fee2e2; color: #991b1b; border-color: #ef4444; }

        /* Shipping status pills */
        .ad__status-option--ship-pending.active    { background: #fef3c7; color: #92400e; border-color: #f59e0b; }
        .ad__status-option--ship-processing.active { background: #dbeafe; color: #1e40af; border-color: #3b82f6; }
        .ad__status-option--ship-shipped.active    { background: #ede9fe; color: #5b21b6; border-color: #8b5cf6; }
        .ad__status-option--ship-in-transit.active { background: #cffafe; color: #0e7490; border-color: #06b6d4; }
        .ad__status-option--ship-delivered.active  { background: #d1fae5; color: #065f46; border-color: #10b981; }
        .ad__status-option--ship-returned.active   { background: #fee2e2; color: #991b1b; border-color: #ef4444; }

        /* ── Courier Pills ── */
        .ad__courier-options { display: flex; flex-wrap: wrap; gap: 8px; }
        .ad__courier-option {
          padding: 6px 13px; border-radius: 8px;
          border: 1.5px solid rgba(200,135,42,0.15);
          font-size: 0.8rem; font-weight: 600; cursor: pointer;
          background: #fdf8f0; color: #8a7055;
          transition: all 0.18s; font-family: 'DM Sans', sans-serif;
        }
        .ad__courier-option:hover:not(.active) { border-color: var(--amber); color: var(--amber-d); }
        .ad__courier-option.active { background: rgba(200,135,42,0.12); color: var(--amber-d); border-color: var(--amber); }

        /* ── Modal Input ── */
        .ad__modal-input {
          width: 100%; padding: 10px 14px;
          border: 1.5px solid rgba(200,135,42,0.2);
          border-radius: 10px; font-size: 0.88rem;
          background: #fdf8f0; color: var(--dark);
          outline: none; font-family: 'DM Sans', sans-serif;
          transition: border-color 0.18s; box-sizing: border-box;
        }
        .ad__modal-input:focus { border-color: var(--amber); background: #fff; }
        .ad__modal-input::placeholder { color: #c4a97a; }

        /* ── Modal Footer ── */
        .ad__modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 22px; border-top: 1px solid rgba(200,135,42,0.1); background: #fdf8f0; }
        .ad__btn { padding: 9px 22px; border-radius: 10px; font-size: 0.875rem; font-weight: 600; cursor: pointer; border: none; transition: all 0.18s; font-family: 'DM Sans', sans-serif; display: inline-flex; align-items: center; gap: 7px; }
        .ad__btn--secondary { background: #efe9df; color: #6b5c44; }
        .ad__btn--secondary:hover { background: #e5ddd0; }
        .ad__btn--primary { background: linear-gradient(135deg, var(--dark), #3d2b0f); color: #fff; box-shadow: 0 4px 12px rgba(26,18,8,0.2); }
        .ad__btn--primary:hover { box-shadow: 0 6px 16px rgba(26,18,8,0.3); }
        .ad__btn--primary:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
        .ad__btn--ship { background: linear-gradient(135deg, #0e7490, #155e75); box-shadow: 0 4px 12px rgba(6,182,212,0.25); }
        .ad__btn--ship:hover:not(:disabled) { box-shadow: 0 6px 16px rgba(6,182,212,0.35); }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .ad__hero { padding: 40px 24px 32px; }
          .ad__tabs { padding: 16px 24px 0; }
          .ad__tab-content { padding: 24px; }
        }
        @media (max-width: 640px) {
          .ad__stats-grid { grid-template-columns: 1fr 1fr; gap: 14px; }
          .ad__tabs { gap: 0; overflow-x: auto; }
          .ad__tab { padding: 10px 16px; font-size: 0.85rem; }
          .ad__hero { flex-direction: column; }
          .ad__refresh-btn { align-self: flex-start; }
          .ad__tab-content { padding: 16px; }
          .ad__filter-bar { flex-direction: column; align-items: flex-start; }
          .ad__modal-meta-row { flex-direction: column; }
        }
        @media (max-width: 400px) {
          .ad__stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;