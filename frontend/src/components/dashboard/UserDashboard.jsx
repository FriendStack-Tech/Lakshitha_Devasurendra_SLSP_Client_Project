import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPackage, FiShoppingBag, FiUser, FiMapPin,
  FiClock, FiCheckCircle, FiXCircle, FiEye,
  FiCreditCard, FiTruck, FiEdit2, FiPlus, FiTrash2,
  FiStar, FiX, FiCheck, FiChevronRight, FiHome,
  FiPhone, FiRefreshCw, FiBarChart2, FiActivity,
  FiAlertCircle, FiDollarSign
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';
import Loader from '../common/Loader';

const EMPTY_FORM = {
  FullName: '', PhoneNumber: '', AddressLine1: '', AddressLine2: '',
  City: '', District: '', Province: '', PostalCode: '', Country: 'Sri Lanka',
};

const STATUS_META = {
  Pending:    { icon:<FiClock />,       color:'#F59E0B', bg:'rgba(245,158,11,0.12)',  text:'#92400E' },
  Processing: { icon:<FiPackage />,     color:'#3B82F6', bg:'rgba(59,130,246,0.12)',  text:'#1D4ED8' },
  Shipped:    { icon:<FiTruck />,       color:'#2E5A4C', bg:'rgba(46,90,76,0.12)',    text:'#2E5A4C' },
  Delivered:  { icon:<FiCheckCircle />, color:'#10B981', bg:'rgba(16,185,129,0.12)',  text:'#065F46' },
  Cancelled:  { icon:<FiXCircle />,     color:'#EF4444', bg:'rgba(239,68,68,0.12)',   text:'#991B1B' },
};
const getMeta = s => STATUS_META[s] || { icon:<FiPackage />, color:'#6B7280', bg:'rgba(107,114,128,0.1)', text:'#374151' };

/* ─────────────────────────────────────────
   ADDRESS FORM MODAL
───────────────────────────────────────── */
const AddressModal = ({ open, onClose, onSave, initial = null, saving = false }) => {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (initial) {
      setForm({
        ...EMPTY_FORM,
        ...initial,
        PhoneNumber: initial.PhoneNumber ?? initial.Phone ?? '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [initial, open]);

  const set = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = e => {
    e.preventDefault();
    if (!form.FullName || !form.PhoneNumber || !form.AddressLine1 || !form.City || !form.District || !form.Province) {
      toast.error('Please fill all required fields'); return;
    }
    onSave(form);
  };

  if (!open) return null;

  const rows = [
    [{ name:'FullName',     label:'Full Name *',      ph:'Kamal Perera',          full:true  }],
    [{ name:'PhoneNumber',  label:'Phone Number *',   ph:'+94 77 123 4567',       full:true  }],
    [{ name:'AddressLine1', label:'Address Line 1 *', ph:'123, Galle Road',       full:true  }],
    [{ name:'AddressLine2', label:'Address Line 2',   ph:'Apt / Unit (optional)', full:true  }],
    [
      { name:'City',     label:'City *',     ph:'Colombo',         full:false },
      { name:'District', label:'District *', ph:'Colombo',         full:false },
    ],
    [
      { name:'Province',   label:'Province *',  ph:'Western Province', full:false },
      { name:'PostalCode', label:'Postal Code', ph:'00300',            full:false },
    ],
    [{ name:'Country', label:'Country', ph:'Sri Lanka', full:true }],
  ];

  return (
    <motion.div className="ud-overlay"
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      onClick={onClose}
    >
      <motion.div className="ud-modal"
        initial={{ opacity:0, scale:0.93, y:24 }}
        animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:0.93, y:24 }}
        transition={{ type:'spring', stiffness:320, damping:28 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="ud-modal__head">
          <div>
            <span className="ud-modal__eyebrow">✦ Delivery Address</span>
            <h3>{initial ? 'Edit Address' : 'Add New Address'}</h3>
          </div>
          <button className="ud-modal__close" onClick={onClose}><FiX /></button>
        </div>

        <form onSubmit={submit} className="ud-modal__form">
          {rows.map((row, ri) => (
            <div key={ri} className={`ud-modal__row ${row[0].full ? 'ud-modal__row--full' : 'ud-modal__row--half'}`}>
              {row.map(f => (
                <div key={f.name} className="ud-modal__field">
                  <label>{f.label}</label>
                  <input
                    name={f.name} value={form[f.name] || ''}
                    onChange={set} placeholder={f.ph}
                    className="ud-modal__input"
                  />
                </div>
              ))}
            </div>
          ))}

          <div className="ud-modal__footer">
            <button type="button" className="ud-btn ud-btn--ghost" onClick={onClose}>Cancel</button>
            <motion.button type="submit" className="ud-btn ud-btn--primary"
              disabled={saving} whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
            >
              {saving ? <span className="ud-spinner" /> : <FiCheck />}
              {initial ? 'Save Changes' : 'Add Address'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   MAIN DASHBOARD
───────────────────────────────────────── */
const UserDashboard = () => {
  const { user } = useAuth();

  const [orders,          setOrders]          = useState([]);
  const [ordersLoading,   setOrdersLoading]   = useState(true);
  const [activeTab,       setActiveTab]       = useState('orders');

  const [addresses,       setAddresses]       = useState([]);
  const [addrLoading,     setAddrLoading]     = useState(false);
  const [addrSaving,      setAddrSaving]      = useState(false);
  const [modalOpen,       setModalOpen]       = useState(false);
  const [editTarget,      setEditTarget]      = useState(null);
  const [deletingId,      setDeletingId]      = useState(null);
  const [defaultingId,    setDefaultingId]    = useState(null);

  useEffect(() => {
    orderService.getOrders()
      .then(r => setOrders(r.data?.orders || []))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setOrdersLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === 'addresses') loadAddresses();
  }, [activeTab]);

  const loadAddresses = async () => {
    setAddrLoading(true);
    try {
      const list = await userService.getAddresses();
      setAddresses(Array.isArray(list) ? list : []);
    } catch (e) {
      toast.error('Failed to load addresses');
    } finally {
      setAddrLoading(false);
    }
  };

  const handleAdd = async (form) => {
    setAddrSaving(true);
    try {
      await userService.addAddress(form);
      toast.success('Address added!');
      setModalOpen(false);
      loadAddresses();
    } catch {
      toast.error('Failed to add address');
    } finally {
      setAddrSaving(false);
    }
  };

  const handleUpdate = async (form) => {
    setAddrSaving(true);
    const id = editTarget?._id ?? editTarget?.AddressID ?? editTarget?.id;
    try {
      await userService.updateAddress(id, form);
      toast.success('Address updated!');
      setModalOpen(false);
      setEditTarget(null);
      loadAddresses();
    } catch {
      toast.error('Failed to update address');
    } finally {
      setAddrSaving(false);
    }
  };

  const handleSetDefault = async (id) => {
    setDefaultingId(id);
    try {
      await userService.setDefaultAddress(id);
      toast.success('Default address changed!');
      loadAddresses();
    } catch {
      toast.error('Failed to set default');
    } finally {
      setDefaultingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this address?')) return;
    setDeletingId(id);
    try {
      await userService.deleteAddress(id);
      toast.success('Address removed');
      setAddresses(prev => prev.filter(a => (a._id ?? a.AddressID ?? a.id) !== id));
    } catch {
      toast.error('Failed to delete address');
    } finally {
      setDeletingId(null);
    }
  };

  const openAdd  = ()     => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (addr) => { setEditTarget(addr); setModalOpen(true); };

  const totalSpent = orders.filter(o => o.OrderStatus === 'Delivered').reduce((s,o) => s + o.TotalAmount, 0);

  const tabs = [
    { id:'orders',    name:'My Orders',  icon:<FiShoppingBag /> },
    { id:'profile',   name:'Profile',    icon:<FiUser />        },
    { id:'addresses', name:'Addresses',  icon:<FiMapPin />      },
  ];

  if (ordersLoading) return (
    <div className="ud-loading">
      <div className="ud-loading__spinner" />
      <Loader message="Loading your dashboard" />;
    </div>
  );

  return (
    <div className="ud">

      {/* ══ HERO ══ */}
      <div className="ud__hero">
        <div className="ud__hero-glow" />
        <div className="ud__hero-pattern" />
        <div className="ud__hero-content">
          <motion.span className="ud__eyebrow"
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
          >✦ My Account</motion.span>
          <motion.h1
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.1 }}
          >
            Welcome back, <span className="ud__hero-name">{user?.Name?.split(' ')[0]}</span>! 👋
          </motion.h1>
          <motion.p
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.2 }}
          >
            Manage your orders, profile and delivery addresses
          </motion.p>
        </div>

        <motion.div className="ud__hero-stats"
          initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.55, delay:0.28 }}
        >
          {[
            { v:orders.length,                                                l:'Total Orders', icon:<FiShoppingBag />, c:'#C8872A' },
            { v:orders.filter(o=>o.OrderStatus==='Delivered').length,         l:'Delivered',    icon:<FiCheckCircle />, c:'#10B981' },
            { v:orders.filter(o=>o.OrderStatus==='Pending').length,           l:'Pending',      icon:<FiClock />,       c:'#F59E0B' },
            { v:`Rs. ${totalSpent.toLocaleString()}`,                         l:'Total Spent',  icon:<FiDollarSign />,  c:'#3B82F6' },
          ].map((s,i) => (
            <div key={i} className="ud__hero-stat">
              <div className="ud__hero-stat-ico" style={{ color:s.c }}>{s.icon}</div>
              <strong>{s.v}</strong>
              <span>{s.l}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ══ TABS ══ */}
      <div className="ud__tabs">
        {tabs.map((tab, i) => (
          <motion.button key={tab.id}
            className={`ud__tab ${activeTab === tab.id ? 'ud__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
            whileHover={{ y:-1 }} whileTap={{ scale:0.97 }}
          >
            <span className="ud__tab-icon">{tab.icon}</span>
            {tab.name}
            {activeTab === tab.id && (
              <motion.div className="ud__tab-indicator" layoutId="udTabInd" />
            )}
          </motion.button>
        ))}
      </div>

      {/* ══ TAB CONTENT ══ */}
      <AnimatePresence mode="wait">

        {/* ─── ORDERS ─── */}
        {activeTab === 'orders' && (
          <motion.div key="orders" className="ud__tab-content"
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-8 }} transition={{ duration:0.3 }}
          >
            <div className="ud__sec-header ud__sec-header--top">
              <h2><FiBarChart2 /> My Orders</h2>
              <span className="ud__count-badge">{orders.length} total</span>
            </div>

            {orders.length === 0 ? (
              <div className="ud__empty">
                <div className="ud__empty-icon"><FiPackage /></div>
                <h3>No orders yet</h3>
                <p>Start shopping to see your orders here!</p>
                <motion.button className="ud__primary-btn"
                  onClick={() => window.location.href='/shop'}
                  whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                >Browse Spices <FiChevronRight /></motion.button>
              </div>
            ) : (
              <div className="ud__orders-list">
                {orders.map((order, i) => {
                  const meta = getMeta(order.OrderStatus);
                  return (
                    <motion.div key={order.OrderID} className="ud__order-card"
                      initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                      transition={{ delay:i*0.06 }}
                      whileHover={{ y:-2, boxShadow:'0 10px 32px rgba(26,18,8,0.1)' }}
                    >
                      <div style={{ height:3, background:meta.color, borderRadius:'16px 16px 0 0' }} />
                      <div className="ud__order-head">
                        <div>
                          <h3 className="ud__order-num">Order <span className="ud__mono">#{order.OrderNumber}</span></h3>
                          <p className="ud__order-date">
                            {new Date(order.OrderDate).toLocaleDateString('en-US',{ year:'numeric', month:'long', day:'numeric' })}
                          </p>
                        </div>
                        <span className="ud__status-pill" style={{ background:meta.bg, color:meta.text }}>
                          <span style={{ width:6,height:6,borderRadius:'50%',background:meta.color,display:'inline-block',flexShrink:0 }} />
                          {order.OrderStatus}
                        </span>
                      </div>

                      {order.items?.length > 0 && (
                        <div className="ud__order-items">
                          {order.items.slice(0,2).map(item => (
                            <div key={item.OrderItemID} className="ud__order-item">
                              <div className="ud__item-thumb">
                                {item.ProductImage
                                  ? <img src={item.ProductImage} alt={item.ProductName} />
                                  : <span>🌶️</span>}
                              </div>
                              <div style={{ flex:1 }}>
                                <p className="ud__item-name">{item.ProductName}</p>
                                <p className="ud__item-qty">Qty: {item.Quantity}</p>
                              </div>
                              <strong className="ud__item-price">
                                Rs. {(item.UnitPrice * item.Quantity).toLocaleString()}
                              </strong>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <p className="ud__items-more">+{order.items.length-2} more items</p>
                          )}
                        </div>
                      )}

                      <div className="ud__order-foot">
                        <div className="ud__order-meta">
                          <span className="ud__order-meta-item">
                            <FiCreditCard />
                            <span className={`ud__badge ud__badge--${order.payment?.PaymentStatus?.toLowerCase()}`}>
                              {order.payment?.PaymentStatus || '—'}
                            </span>
                          </span>
                          <span className="ud__order-meta-item">
                            <FiTruck />
                            <span className="ud__badge ud__badge--shipped">
                              {order.shipping?.ShippingStatus || '—'}
                            </span>
                          </span>
                        </div>
                        <div className="ud__order-right">
                          <p className="ud__order-total">Total: <strong>Rs. {order.TotalAmount.toLocaleString()}</strong></p>
                          <div className="ud__order-actions">
                            <motion.button className="ud__action-btn ud__action-btn--view"
                              whileHover={{ scale:1.12 }} whileTap={{ scale:0.9 }}
                            ><FiEye /> Track</motion.button>
                            <motion.button className="ud__action-btn ud__action-btn--primary"
                              whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                            ><FiPackage /> Details</motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* ─── PROFILE ─── */}
        {activeTab === 'profile' && (
          <motion.div key="profile" className="ud__tab-content"
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-8 }} transition={{ duration:0.3 }}
          >
            <div className="ud__profile-card">
              <div className="ud__profile-hero">
                <div className="ud__profile-hero-glow" />
                <div className="ud__profile-hero-pattern" />
                <div className="ud__avatar-wrap">
                  <div className="ud__avatar">{user?.Name?.charAt(0)?.toUpperCase()}</div>
                </div>
                <div className="ud__profile-hero-text">
                  <h2>{user?.Name}</h2>
                  <p>Member since {new Date(user?.CreatedAt||Date.now()).toLocaleDateString('en-US',{year:'numeric',month:'long'})}</p>
                  <span className="ud__role-chip">{user?.Role || 'Customer'}</span>
                </div>
                <motion.button className="ud__refresh-btn" whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}>
                  <FiEdit2 /> Edit Profile
                </motion.button>
              </div>

              <div className="ud__profile-fields">
                {[
                  { label:'Full Name',     value:user?.Name,         icon:<FiUser />        },
                  { label:'Email Address', value:user?.Email,        icon:<FiAlertCircle /> },
                  { label:'User ID',       value:`#${user?.UserID}`, icon:<FiBarChart2 />   },
                  { label:'Account Role',  value:user?.Role,         icon:<FiStar />        },
                ].map((f,i) => (
                  <motion.div key={i} className="ud__profile-field"
                    initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
                    transition={{ delay:i*0.08 }}
                  >
                    <div className="ud__profile-field-ico">{f.icon}</div>
                    <div>
                      <label>{f.label}</label>
                      <p>{f.value || '—'}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="ud__profile-summary">
                {[
                  { label:'Orders Placed', v:orders.length, color:'#C8872A' },
                  { label:'Delivered',     v:orders.filter(o=>o.OrderStatus==='Delivered').length, color:'#10B981' },
                  { label:'In Progress',   v:orders.filter(o=>['Pending','Processing','Shipped'].includes(o.OrderStatus)).length, color:'#3B82F6' },
                  { label:'Cancelled',     v:orders.filter(o=>o.OrderStatus==='Cancelled').length, color:'#EF4444' },
                ].map((s,i) => (
                  <motion.div key={i} className="ud__summary-chip"
                    style={{ '--cc':s.color }}
                    initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                    transition={{ delay:0.32+i*0.07 }}
                    whileHover={{ y:-3, boxShadow:'0 8px 24px rgba(26,18,8,0.08)' }}
                  >
                    <strong>{s.v}</strong>
                    <span>{s.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── ADDRESSES ─── */}
        {activeTab === 'addresses' && (
          <motion.div key="addresses" className="ud__tab-content"
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-8 }} transition={{ duration:0.3 }}
          >
            <div className="ud__sec-header ud__sec-header--top">
              <h2><FiMapPin /> Saved Addresses
                {addresses.length > 0 && (
                  <span className="ud__count-badge">{addresses.length} saved</span>
                )}
              </h2>
              <motion.button className="ud__primary-btn"
                onClick={openAdd}
                whileHover={{ scale:1.03, y:-1 }} whileTap={{ scale:0.97 }}
              >
                <FiPlus /> Add Address
              </motion.button>
            </div>

            {addrLoading && (
              <div className="ud__addr-grid">
                {[1,2,3].map(k => (
                  <div key={k} className="ud__addr-skeleton">
                    <div className="ud__skel ud__skel--title" />
                    <div className="ud__skel" />
                    <div className="ud__skel ud__skel--sm" />
                    <div className="ud__skel" />
                    <div className="ud__skel ud__skel--sm" />
                  </div>
                ))}
              </div>
            )}

            {!addrLoading && addresses.length === 0 && (
              <div className="ud__empty">
                <div className="ud__empty-icon"><FiMapPin /></div>
                <h3>No addresses saved</h3>
                <p>Add a delivery address to speed up your checkout experience.</p>
                <motion.button className="ud__primary-btn"
                  onClick={openAdd} whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                >
                  <FiPlus /> Add First Address
                </motion.button>
              </div>
            )}

            {!addrLoading && addresses.length > 0 && (
              <div className="ud__addr-grid">
                <AnimatePresence>
                  {addresses.map((addr, i) => {
                    const id        = addr._id ?? addr.AddressID ?? addr.id;
                    const isDefault = addr.IsDefault ?? addr.isDefault ?? false;
                    return (
                      <motion.div key={id}
                        className={`ud__addr-card ${isDefault ? 'ud__addr-card--default' : ''}`}
                        initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
                        exit={{ opacity:0, scale:0.9 }}
                        transition={{ delay:i*0.07 }}
                        whileHover={{ y:-4, boxShadow:'0 12px 36px rgba(26,18,8,0.1)' }}
                        layout
                      >
                        {isDefault && <div className="ud__addr-default-bar" />}

                        <div className="ud__addr-card-head">
                          <div className="ud__addr-icon-wrap"><FiHome /></div>
                          {isDefault && (
                            <span className="ud__addr-default-chip"><FiStar /> Default</span>
                          )}
                        </div>

                        <div className="ud__addr-body">
                          <p className="ud__addr-name">{addr.FullName}</p>
                          <p className="ud__addr-line">
                            {[addr.AddressLine1, addr.AddressLine2].filter(Boolean).join(', ')}
                          </p>
                          <p className="ud__addr-line">
                            {[addr.City, addr.District, addr.Province, addr.PostalCode].filter(Boolean).join(', ')}
                          </p>
                          <p className="ud__addr-line">{addr.Country}</p>
                          {addr.PhoneNumber && (
                            <p className="ud__addr-phone"><FiPhone /> {addr.PhoneNumber}</p>
                          )}
                        </div>

                        <div className="ud__addr-foot">
                          {!isDefault && (
                            <motion.button
                              className="ud__addr-set-btn"
                              onClick={() => handleSetDefault(id)}
                              disabled={defaultingId === id}
                              whileHover={{ scale:1.03 }} whileTap={{ scale:0.96 }}
                            >
                              {defaultingId === id ? <span className="ud__spinner" /> : <FiStar />}
                              Set Default
                            </motion.button>
                          )}
                          <div className="ud__addr-actions">
                            <motion.button className="ud__action-btn ud__action-btn--edit"
                              title="Edit address" onClick={() => openEdit(addr)}
                              whileHover={{ scale:1.12 }} whileTap={{ scale:0.9 }}
                            ><FiEdit2 /></motion.button>
                            <motion.button className="ud__action-btn ud__action-btn--delete"
                              title="Delete address" onClick={() => handleDelete(id)}
                              disabled={deletingId === id}
                              whileHover={{ scale:1.12 }} whileTap={{ scale:0.9 }}
                            >
                              {deletingId === id ? <span className="ud__spinner" /> : <FiTrash2 />}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/*
                  FIX: Removed background & borderColor from whileHover.
                  Framer Motion cannot interpolate from CSS keyword "transparent"
                  to an rgba() value — it resolves "transparent" to the full
                  computed shorthand string which is not a valid colour.
                  The hover tint is now handled entirely by the CSS :hover rule.
                */}
                <motion.div
                  className="ud__addr-add-card"
                  whileHover={{ y:-4 }}
                  whileTap={{ scale:0.98 }}
                  onClick={openAdd}
                >
                  <div className="ud__addr-add-icon"><FiPlus /></div>
                  <p>Add New Address</p>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ ADDRESS MODAL ══ */}
      <AnimatePresence>
        {modalOpen && (
          <AddressModal
            open={modalOpen}
            onClose={() => { setModalOpen(false); setEditTarget(null); }}
            onSave={editTarget ? handleUpdate : handleAdd}
            initial={editTarget}
            saving={addrSaving}
          />
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');

        .ud {
          --amber:   #C8872A;
          --amber-d: #A06820;
          --amber-l: #F5A94A;
          --forest:  #2E5A4C;
          --forest-d:#1e3d33;
          --dark:    #1A1208;
          --cream:   #FDF8F0;
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #f9f4ec;
          padding: 0 0 80px;
        }

        .ud-loading {
          min-height: 60vh; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 16px;
          color: #6b5c44; font-family: 'DM Sans', sans-serif;
        }
        .ud-loading__spinner {
          width: 44px; height: 44px;
          border: 3px solid rgba(200,135,42,0.2); border-top-color: #C8872A;
          border-radius: 50%; animation: ud-spin 0.8s linear infinite;
        }

        .ud__hero {
          position: relative;
          background: linear-gradient(135deg, #1A1208 0%, #2E5A4C 55%, #3d6b5a 100%);
          padding: 52px 40px 44px; overflow: hidden;
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 24px; flex-wrap: wrap;
        }
        .ud__hero-glow {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse at 80% 40%, rgba(200,135,42,0.22) 0%, transparent 65%);
        }
        .ud__hero-pattern {
          position: absolute; inset: 0; pointer-events: none;
          background-image: repeating-linear-gradient(
            45deg, transparent, transparent 28px,
            rgba(255,255,255,0.02) 28px, rgba(255,255,255,0.02) 29px
          );
        }
        .ud__hero-content { position: relative; z-index: 1; }
        .ud__eyebrow {
          display: inline-block; font-size: 0.72rem;
          letter-spacing: 3px; text-transform: uppercase;
          color: var(--amber-l); font-weight: 600; margin-bottom: 10px;
        }
        .ud__hero h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.7rem, 4vw, 2.6rem); color: #fff;
          margin: 0 0 8px; line-height: 1.2;
        }
        .ud__hero-name { color: var(--amber-l); }
        .ud__hero-content > p { color: rgba(255,255,255,0.6); font-size: 1rem; margin: 0; }

        .ud__hero-stats {
          position: relative; z-index: 1;
          display: flex; background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12); border-radius: 16px;
          overflow: hidden; align-self: center;
        }
        .ud__hero-stat {
          display: flex; flex-direction: column; align-items: center;
          padding: 18px 22px; text-align: center;
          border-right: 1px solid rgba(255,255,255,0.1);
        }
        .ud__hero-stat:last-child { border-right: none; }
        .ud__hero-stat-ico { font-size: 1.1rem; margin-bottom: 6px; }
        .ud__hero-stat strong {
          display: block; font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.4rem; color: #fff; line-height: 1;
        }
        .ud__hero-stat span {
          font-size: 0.64rem; letter-spacing: 1.5px; text-transform: uppercase;
          color: rgba(255,255,255,0.42); margin-top: 3px; display: block;
        }

        .ud__tabs {
          display: flex; gap: 4px; padding: 20px 40px 0;
          border-bottom: 2px solid rgba(200,135,42,0.12); background: #fff;
        }
        .ud__tab {
          position: relative; display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 24px; font-size: 0.92rem; font-weight: 600;
          color: #8a7055; cursor: pointer; border: none; background: none;
          font-family: 'DM Sans', sans-serif; transition: color 0.2s;
          border-radius: 8px 8px 0 0;
        }
        .ud__tab:hover { color: var(--amber-d); background: rgba(200,135,42,0.05); }
        .ud__tab--active { color: var(--amber-d); }
        .ud__tab-icon { font-size: 1rem; display: flex; align-items: center; }
        .ud__tab-indicator {
          position: absolute; bottom: -2px; left: 0; right: 0; height: 2.5px;
          background: linear-gradient(90deg, var(--amber), var(--amber-l));
          border-radius: 2px 2px 0 0;
        }

        .ud__tab-content { padding: 36px 40px; max-width: 1400px; margin: 0 auto; }

        .ud__sec-header {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
        }
        .ud__sec-header h2 {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.35rem; color: var(--dark); margin: 0;
        }
        .ud__sec-header--top { margin-bottom: 24px; }

        .ud__count-badge {
          font-size: 0.8rem; font-weight: 600; color: #8a7055;
          background: rgba(200,135,42,0.08); border: 1px solid rgba(200,135,42,0.15);
          padding: 5px 12px; border-radius: 50px; font-family: 'DM Sans', sans-serif;
        }

        .ud__empty { text-align: center; padding: 60px 20px; color: #8a7055; }
        .ud__empty-icon {
          width: 64px; height: 64px; margin: 0 auto 20px;
          background: rgba(200,135,42,0.08); border: 1.5px dashed rgba(200,135,42,0.3);
          border-radius: 50%; display: flex; align-items: center;
          justify-content: center; font-size: 1.6rem; color: var(--amber);
        }
        .ud__empty h3 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.3rem; color: var(--dark); margin-bottom: 8px;
        }
        .ud__empty p { margin-bottom: 24px; font-size: 0.95rem; }

        .ud__primary-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 22px; border-radius: 50px;
          background: linear-gradient(135deg, var(--forest), var(--forest-d));
          color: #fff; font-size: 0.9rem; font-weight: 700;
          cursor: pointer; border: none; font-family: 'DM Sans', sans-serif;
          box-shadow: 0 4px 14px rgba(46,90,76,0.3); transition: box-shadow 0.2s;
        }
        .ud__primary-btn:hover { box-shadow: 0 6px 20px rgba(46,90,76,0.4); }

        .ud__refresh-btn {
          position: relative; z-index: 1;
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 20px; border-radius: 50px;
          border: 1.5px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.85); font-size: 0.88rem; font-weight: 600;
          cursor: pointer; backdrop-filter: blur(8px);
          font-family: 'DM Sans', sans-serif; transition: all 0.2s; align-self: flex-start;
        }
        .ud__refresh-btn:hover { background: rgba(200,135,42,0.25); border-color: var(--amber-l); color: #fff; }

        .ud__action-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 50px;
          font-size: 0.8rem; font-weight: 600; cursor: pointer;
          transition: all 0.18s; font-family: 'DM Sans', sans-serif; border: 1.5px solid transparent;
        }
        .ud__action-btn--view { color: #3B82F6; border-color: rgba(59,130,246,0.2); background: rgba(59,130,246,0.06); }
        .ud__action-btn--view:hover { background: rgba(59,130,246,0.12); border-color: #3B82F6; }
        .ud__action-btn--primary {
          background: linear-gradient(135deg, var(--forest), var(--forest-d));
          color: #fff; border: none; box-shadow: 0 3px 10px rgba(46,90,76,0.25);
        }
        .ud__action-btn--edit { color: var(--amber-d); border-color: rgba(200,135,42,0.2); background: rgba(200,135,42,0.06); width:34px; height:34px; padding:0; justify-content:center; border-radius:8px; }
        .ud__action-btn--edit:hover { background: rgba(200,135,42,0.12); border-color: var(--amber); }
        .ud__action-btn--delete { color: #C94F3F; border-color: rgba(201,79,63,0.2); background: rgba(201,79,63,0.06); width:34px; height:34px; padding:0; justify-content:center; border-radius:8px; }
        .ud__action-btn--delete:hover { background: rgba(201,79,63,0.12); border-color: #C94F3F; }
        .ud__action-btn--delete:disabled { opacity:0.6; cursor:not-allowed; }

        .ud__orders-list { display: flex; flex-direction: column; gap: 20px; }
        .ud__order-card {
          background: #fff; border-radius: 16px;
          border: 1.5px solid rgba(200,135,42,0.1);
          box-shadow: 0 2px 12px rgba(26,18,8,0.05);
          overflow: hidden; transition: all 0.25s;
        }
        .ud__order-head {
          display: flex; align-items: flex-start; justify-content: space-between;
          padding: 20px 24px 14px; flex-wrap: wrap; gap: 10px;
        }
        .ud__order-num {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.1rem; color: var(--dark); margin-bottom: 4px;
        }
        .ud__mono { font-family: 'Courier New', monospace; color: #8a7055; font-size: 0.9em; }
        .ud__order-date { color: #8a7055; font-size: 0.82rem; }
        .ud__status-pill {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 5px 14px; border-radius: 50px; font-size: 0.78rem; font-weight: 700;
        }

        .ud__order-items { padding: 0 24px 14px; border-bottom: 1px solid rgba(200,135,42,0.08); }
        .ud__order-item {
          display: flex; align-items: center; gap: 14px;
          padding: 8px 0; border-bottom: 1px dashed rgba(200,135,42,0.07);
        }
        .ud__order-item:last-child { border-bottom: none; }
        .ud__item-thumb {
          width: 52px; height: 52px; border-radius: 10px;
          background: #fdf3e3; overflow: hidden; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem; border: 1px solid rgba(200,135,42,0.12);
        }
        .ud__item-thumb img { width:100%; height:100%; object-fit:cover; }
        .ud__item-name { font-weight:600; color:var(--dark); font-size:0.9rem; margin-bottom:2px; }
        .ud__item-qty  { font-size:0.78rem; color:#8a7055; }
        .ud__item-price { font-weight:700; color:var(--forest); font-size:0.9rem; white-space:nowrap; }
        .ud__items-more { font-size:0.8rem; color:#a08060; padding-top:6px; }

        .ud__order-foot {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 24px; flex-wrap: wrap; gap: 12px;
        }
        .ud__order-meta { display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
        .ud__order-meta-item { display:flex; align-items:center; gap:6px; color:#8a7055; font-size:0.82rem; }
        .ud__order-right { display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
        .ud__order-total { font-size:0.88rem; color:#6b5c44; }
        .ud__order-total strong { color:var(--forest); font-size:1rem; }
        .ud__order-actions { display:flex; gap:8px; }

        .ud__badge {
          display: inline-flex; align-items: center;
          padding: 4px 12px; border-radius: 50px;
          font-size: 0.75rem; font-weight: 700; letter-spacing: 0.3px; white-space: nowrap;
        }
        .ud__badge--pending    { background:rgba(245,158,11,0.15);  color:#92400E; }
        .ud__badge--processing { background:rgba(59,130,246,0.12);  color:#1D4ED8; }
        .ud__badge--shipped    { background:rgba(46,90,76,0.12);    color:var(--forest); }
        .ud__badge--delivered  { background:rgba(16,185,129,0.12);  color:#065F46; }
        .ud__badge--cancelled  { background:rgba(239,68,68,0.12);   color:#991B1B; }
        .ud__badge--paid       { background:rgba(16,185,129,0.12);  color:#065F46; }
        .ud__badge--unpaid     { background:rgba(245,158,11,0.15);  color:#92400E; }
        .ud__badge--failed     { background:rgba(239,68,68,0.12);   color:#991B1B; }

        .ud__profile-card {
          background: #fff; border-radius: 20px;
          border: 1.5px solid rgba(200,135,42,0.1);
          box-shadow: 0 2px 12px rgba(26,18,8,0.05); overflow: hidden;
        }
        .ud__profile-hero {
          position: relative; display: flex; align-items: center; gap: 24px;
          padding: 36px 36px 32px; flex-wrap: wrap;
          background: linear-gradient(135deg, #1A1208 0%, #2E5A4C 55%, #3d6b5a 100%);
          overflow: hidden;
        }
        .ud__profile-hero-glow {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse at 70% 50%, rgba(200,135,42,0.18) 0%, transparent 60%);
        }
        .ud__profile-hero-pattern {
          position: absolute; inset: 0; pointer-events: none;
          background-image: repeating-linear-gradient(45deg,transparent,transparent 28px,rgba(255,255,255,0.02) 28px,rgba(255,255,255,0.02) 29px);
        }
        .ud__avatar-wrap {
          position: relative; z-index: 1; flex-shrink: 0;
          width: 80px; height: 80px; border-radius: 50%;
          border: 3px solid rgba(200,135,42,0.55); padding: 3px;
        }
        .ud__avatar {
          width: 100%; height: 100%; border-radius: 50%;
          background: linear-gradient(135deg, var(--amber), var(--amber-d));
          color: #fff; display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', Georgia, serif; font-size: 2rem; font-weight: 700;
        }
        .ud__profile-hero-text { position: relative; z-index: 1; flex: 1; }
        .ud__profile-hero-text h2 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.5rem; color: #fff; margin-bottom: 4px;
        }
        .ud__profile-hero-text > p { color: rgba(255,255,255,0.55); font-size: 0.85rem; margin-bottom: 0; }
        .ud__role-chip {
          display: inline-block; margin-top: 8px;
          background: rgba(200,135,42,0.2); color: var(--amber-l);
          border: 1px solid rgba(200,135,42,0.35);
          padding: 3px 12px; border-radius: 20px;
          font-size: 0.72rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
        }

        .ud__profile-fields {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1px; background: rgba(200,135,42,0.08);
        }
        .ud__profile-field {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 20px 24px; background: #fff;
        }
        .ud__profile-field-ico {
          width: 38px; height: 38px; border-radius: 10px;
          background: rgba(200,135,42,0.08); color: var(--amber);
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; flex-shrink: 0;
        }
        .ud__profile-field label {
          display: block; font-size: 0.7rem; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase;
          color: #a08060; margin-bottom: 4px;
        }
        .ud__profile-field p { font-size: 0.95rem; font-weight: 600; color: var(--dark); margin: 0; }

        .ud__profile-summary {
          display: flex; padding: 20px 24px; gap: 14px;
          flex-wrap: wrap; border-top: 1px solid rgba(200,135,42,0.1);
          background: #fdf8f0;
        }
        .ud__summary-chip {
          flex: 1; min-width: 100px; text-align: center;
          background: #fff; border-radius: 14px; padding: 16px 12px;
          border: 1.5px solid rgba(200,135,42,0.1);
          box-shadow: 0 2px 8px rgba(26,18,8,0.04);
          border-top: 3px solid var(--cc); cursor: default; transition: all 0.25s;
        }
        .ud__summary-chip strong {
          display: block; font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.6rem; color: var(--dark); line-height: 1;
        }
        .ud__summary-chip span {
          font-size: 0.7rem; letter-spacing: 1px; text-transform: uppercase;
          color: #8a7055; margin-top: 4px; display: block;
        }

        .ud__addr-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;
        }
        .ud__addr-card {
          background: #fff; border-radius: 16px;
          border: 1.5px solid rgba(200,135,42,0.12);
          box-shadow: 0 2px 12px rgba(26,18,8,0.05);
          transition: all 0.25s; overflow: hidden; position: relative;
        }
        .ud__addr-card--default { border-color: rgba(200,135,42,0.4); }
        .ud__addr-default-bar {
          height: 3px;
          background: linear-gradient(90deg, var(--amber), var(--amber-l));
          border-radius: 16px 16px 0 0;
        }
        .ud__addr-card-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px 8px;
        }
        .ud__addr-icon-wrap {
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(200,135,42,0.08); color: var(--amber);
          display: flex; align-items: center; justify-content: center; font-size: 1rem;
        }
        .ud__addr-default-chip {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(200,135,42,0.1); color: var(--amber-d);
          border: 1px solid rgba(200,135,42,0.25);
          padding: 3px 10px; border-radius: 20px;
          font-size: 0.72rem; font-weight: 700;
        }
        .ud__addr-body { padding: 4px 20px 16px; }
        .ud__addr-name { font-weight: 700; color: var(--dark); margin-bottom: 8px; font-size: 0.95rem; }
        .ud__addr-line { color: #6b5c44; font-size: 0.84rem; margin-bottom: 3px; line-height: 1.5; }
        .ud__addr-phone {
          display: flex; align-items: center; gap: 6px;
          color: var(--forest); font-size: 0.84rem; font-weight: 600; margin-top: 8px;
        }
        .ud__addr-foot {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 20px; border-top: 1px solid rgba(200,135,42,0.08);
          background: #fdf9f5; flex-wrap: wrap; gap: 8px;
        }
        .ud__addr-set-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 50px;
          font-size: 0.78rem; font-weight: 600; cursor: pointer;
          border: 1.5px solid rgba(200,135,42,0.25); background: none; color: #8a7055;
          font-family: 'DM Sans', sans-serif; transition: all 0.18s;
        }
        .ud__addr-set-btn:hover:not(:disabled) {
          border-color: var(--amber); color: var(--amber-d); background: rgba(200,135,42,0.06);
        }
        .ud__addr-set-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .ud__addr-actions { display: flex; gap: 8px; }

        /*
          FIX: "transparent" resolves to the full CSS computed shorthand which
          Framer Motion cannot parse as a colour for animation. We use
          rgba(0,0,0,0) instead so it stays as a proper colour value, and
          the amber tint on hover is handled by pure CSS :hover (no Framer).
        */
        .ud__addr-add-card {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 12px; border-radius: 16px; padding: 40px 20px; cursor: pointer;
          border: 2px dashed rgba(200,135,42,0.25);
          background: rgba(0,0,0,0);
          color: #a08060; font-size: 0.9rem; font-weight: 600;
          transition: border-color 0.25s, background 0.25s;
          min-height: 180px; font-family: 'DM Sans', sans-serif;
        }
        .ud__addr-add-card:hover {
          border-color: #C8872A;
          background: rgba(200,135,42,0.04);
        }
        .ud__addr-add-icon {
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(200,135,42,0.08); color: var(--amber);
          display: flex; align-items: center; justify-content: center; font-size: 1.3rem;
        }

        .ud__addr-skeleton {
          background: #fff; border-radius: 16px; padding: 20px;
          border: 1.5px solid rgba(200,135,42,0.08);
        }
        .ud__skel {
          height: 14px; border-radius: 6px; margin-bottom: 10px;
          background: linear-gradient(90deg,#f0e8d8 25%,#fdf3e3 50%,#f0e8d8 75%);
          background-size: 200% 100%; animation: ud-shimmer 1.4s infinite;
        }
        .ud__skel--title { height:18px; width:60%; margin-bottom:14px; }
        .ud__skel--sm    { width:40%; }
        @keyframes ud-shimmer { to { background-position:-200% 0; } }

        .ud-overlay {
          position: fixed; inset: 0; background: rgba(26,18,8,0.6);
          backdrop-filter: blur(6px); z-index: 9000;
          display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .ud-modal {
          background: #fff; border-radius: 20px;
          width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto;
          box-shadow: 0 24px 80px rgba(26,18,8,0.28);
          border: 1.5px solid rgba(200,135,42,0.15);
        }
        .ud-modal__head {
          display: flex; align-items: flex-start; justify-content: space-between;
          padding: 24px 24px 0;
        }
        .ud-modal__eyebrow {
          display: block; font-size: 0.68rem; letter-spacing: 2.5px;
          text-transform: uppercase; color: var(--amber); font-weight: 700; margin-bottom: 4px;
        }
        .ud-modal__head h3 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.3rem; color: var(--dark); margin: 0;
        }
        .ud-modal__close {
          width: 34px; height: 34px; border-radius: 10px;
          border: 1.5px solid rgba(200,135,42,0.2); background: rgba(200,135,42,0.05);
          color: #8a7055; display: flex; align-items: center;
          justify-content: center; cursor: pointer; font-size: 1rem; transition: all 0.18s;
        }
        .ud-modal__close:hover { background: rgba(239,68,68,0.08); border-color: #EF4444; color: #EF4444; }
        .ud-modal__form { padding: 20px 24px 24px; }

        .ud-modal__row { display: flex; gap: 14px; margin-bottom: 14px; }
        .ud-modal__row--full  { flex-direction: column; }
        .ud-modal__row--half  { flex-direction: row; }
        .ud-modal__field { display: flex; flex-direction: column; gap: 6px; flex: 1; }
        .ud-modal__field label {
          font-size: 0.7rem; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; color: var(--amber);
        }
        .ud-modal__input {
          padding: 11px 14px;
          border: 1.5px solid rgba(200,135,42,0.2);
          border-radius: 10px; font-size: 0.9rem; color: var(--dark);
          background: #fdf8f0; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: 'DM Sans', sans-serif; width: 100%; box-sizing: border-box;
        }
        .ud-modal__input:focus { border-color: var(--amber); box-shadow: 0 0 0 3px rgba(200,135,42,0.1); }
        .ud-modal__input::placeholder { color: #b5956a; }

        .ud-modal__footer {
          display: flex; justify-content: flex-end; gap: 10px;
          padding-top: 16px; border-top: 1px solid rgba(200,135,42,0.1);
        }
        .ud-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 10px 20px; border-radius: 50px; font-size: 0.88rem;
          font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.2s; border: none;
        }
        .ud-btn--primary {
          background: linear-gradient(135deg, var(--forest), var(--forest-d));
          color: #fff; box-shadow: 0 4px 14px rgba(46,90,76,0.3);
        }
        .ud-btn--primary:hover:not(:disabled) { box-shadow: 0 6px 20px rgba(46,90,76,0.4); }
        .ud-btn--primary:disabled { opacity: 0.7; cursor: not-allowed; }
        .ud-btn--ghost {
          background: none; border: 1.5px solid rgba(200,135,42,0.25); color: #6b5c44;
        }
        .ud-btn--ghost:hover { border-color: var(--amber); color: var(--amber-d); background: rgba(200,135,42,0.05); }

        .ud__spinner, .ud-spinner {
          display: inline-block; width: 13px; height: 13px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: currentColor;
          border-radius: 50%; animation: ud-spin 0.7s linear infinite;
        }
        @keyframes ud-spin { to { transform: rotate(360deg); } }

        @media (max-width: 900px) {
          .ud__hero { padding: 40px 24px 32px; }
          .ud__tabs { padding: 16px 24px 0; }
          .ud__tab-content { padding: 24px; }
        }
        @media (max-width: 640px) {
          .ud__hero { flex-direction: column; gap: 20px; }
          .ud__hero-stats { width: 100%; display: grid; grid-template-columns: 1fr 1fr; }
          .ud__hero-stat { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.1); }
          .ud__tabs { gap: 0; overflow-x: auto; }
          .ud__tab  { padding: 10px 16px; font-size: 0.85rem; }
          .ud__tab-content { padding: 16px; }
          .ud__addr-grid { grid-template-columns: 1fr; }
          .ud-modal__row--half { flex-direction: column; }
          .ud__order-foot { flex-direction: column; align-items: flex-start; }
          .ud__profile-hero { flex-direction: column; text-align: center; align-items: center; }
          .ud__refresh-btn { align-self: center; }
          .ud__profile-fields { grid-template-columns: 1fr; }
          .ud__profile-summary { justify-content: center; }
        }
        @media (max-width: 400px) {
          .ud__summary-chip { min-width: 80px; }
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;