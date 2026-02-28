import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft, FiPackage, FiTruck, FiCheckCircle,
  FiClock, FiXCircle, FiMapPin, FiPhone, FiHome,
  FiCreditCard, FiCalendar, FiHash, FiShoppingCart,
  FiAlertCircle, FiRefreshCw, FiNavigation, FiBox,
  FiUser, FiDollarSign, FiChevronRight, FiStar
} from 'react-icons/fi';
import { orderService } from '../services/orderService';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';

/* ─────────────────────────────────────────
   CONSTANTS & HELPERS
───────────────────────────────────────── */
const ORDER_STEPS = [
  {
    key:   'Pending',
    label: 'Order Placed',
    desc:  'Your order has been received and is awaiting confirmation.',
    icon:  <FiHash />,
    color: '#F59E0B',
  },
  {
    key:   'Processing',
    label: 'Processing',
    desc:  'Our team is carefully preparing and packing your items.',
    icon:  <FiBox />,
    color: '#3B82F6',
  },
  {
    key:   'Shipped',
    label: 'Shipped',
    desc:  'Your order is on its way! Estimated delivery in 2–5 business days.',
    icon:  <FiTruck />,
    color: '#2E5A4C',
  },
  {
    key:   'Delivered',
    label: 'Delivered',
    desc:  'Your order has been delivered. Enjoy your spices!',
    icon:  <FiCheckCircle />,
    color: '#10B981',
  },
];

const CANCELLED_STEP = {
  key:   'Cancelled',
  label: 'Cancelled',
  desc:  'This order has been cancelled.',
  icon:  <FiXCircle />,
  color: '#EF4444',
};

const STATUS_META = {
  Pending:    { color:'#F59E0B', bg:'rgba(245,158,11,0.12)',  text:'#92400E' },
  Processing: { color:'#3B82F6', bg:'rgba(59,130,246,0.12)',  text:'#1D4ED8' },
  Shipped:    { color:'#2E5A4C', bg:'rgba(46,90,76,0.12)',    text:'#2E5A4C' },
  Delivered:  { color:'#10B981', bg:'rgba(16,185,129,0.12)',  text:'#065F46' },
  Cancelled:  { color:'#EF4444', bg:'rgba(239,68,68,0.12)',   text:'#991B1B' },
};
const getMeta     = s => STATUS_META[s] || { color:'#6B7280', bg:'rgba(107,114,128,0.1)', text:'#374151' };
const getStepIdx  = s => ORDER_STEPS.findIndex(x => x.key === s);

const fmt = d => d
  ? new Date(d).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })
  : '—';

const fmtAmt = n => n != null ? `Rs. ${Number(n).toLocaleString()}` : null;

/* ─────────────────────────────────────────
   TRACKING TIMELINE
───────────────────────────────────────── */
const TrackingTimeline = ({ status }) => {
  const isCancelled = status === 'Cancelled';
  const steps       = isCancelled ? [ORDER_STEPS[0], CANCELLED_STEP] : ORDER_STEPS;
  const currentIdx  = isCancelled ? 1 : getStepIdx(status);

  return (
    <div className="ot__timeline">
      {steps.map((step, i) => {
        const done    = i < currentIdx;
        const active  = i === currentIdx;
        const pending = i > currentIdx;
        const isLast  = i === steps.length - 1;

        return (
          <div key={step.key} className="ot__tl-row">
            {/* Left column: dot + line */}
            <div className="ot__tl-left">
              <motion.div
                className="ot__tl-dot"
                style={{
                  borderColor: active || done ? step.color : 'rgba(200,135,42,0.2)',
                  background:  done   ? step.color
                             : active ? '#fff'
                             : 'rgba(200,135,42,0.04)',
                }}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1,   opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                {done ? (
                  <FiCheckCircle style={{ color:'#fff', fontSize:'1rem' }} />
                ) : active ? (
                  <motion.div
                    className="ot__tl-pulse"
                    style={{ background: step.color }}
                    animate={{ scale:[1,1.4,1], opacity:[1,0.4,1] }}
                    transition={{ duration:1.6, repeat:Infinity }}
                  />
                ) : (
                  <span style={{ color:'rgba(200,135,42,0.3)', fontSize:'0.85rem', display:'flex' }}>
                    {React.cloneElement(step.icon)}
                  </span>
                )}
              </motion.div>

              {!isLast && (
                <div className="ot__tl-line-wrap">
                  <div className="ot__tl-line-bg" />
                  <motion.div
                    className="ot__tl-line-fill"
                    style={{ background: done ? step.color : 'transparent' }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: done ? 1 : 0 }}
                    transition={{ delay: i * 0.12 + 0.1, duration: 0.45 }}
                  />
                </div>
              )}
            </div>

            {/* Right column: content */}
            <motion.div
              className={`ot__tl-content ${active ? 'ot__tl-content--active' : ''} ${pending ? 'ot__tl-content--pending' : ''}`}
              initial={{ opacity:0, x:16 }}
              animate={{ opacity:1, x:0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div
                className="ot__tl-ico-wrap"
                style={ active || done
                  ? { background:`${step.color}18`, color:step.color }
                  : {} }
              >
                {step.icon}
              </div>
              <div className="ot__tl-text">
                <div className="ot__tl-title-row">
                  <h4
                    className="ot__tl-title"
                    style={ active ? { color: step.color } : {} }
                  >
                    {step.label}
                  </h4>
                  {active && (
                    <span className="ot__tl-chip ot__tl-chip--active"
                      style={{ background:`${step.color}18`, color:step.color }}>
                      Current
                    </span>
                  )}
                  {done && (
                    <span className="ot__tl-chip ot__tl-chip--done">
                      <FiCheckCircle /> Done
                    </span>
                  )}
                </div>
                <p className={`ot__tl-desc ${pending ? 'ot__tl-desc--muted' : ''}`}>{step.desc}</p>
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};

/* ─────────────────────────────────────────
   INFO ROW
───────────────────────────────────────── */
const InfoRow = ({ icon, label, value }) => (
  <div className="ot__info-row">
    <div className="ot__info-ico">{icon}</div>
    <div className="ot__info-body">
      <label className="ot__info-label">{label}</label>
      <p className="ot__info-val">{value || '—'}</p>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   CARD WRAPPER
───────────────────────────────────────── */
const Card = ({ title, icon, children, delay = 0, accent }) => (
  <motion.div
    className="ot__card"
    style={accent ? { '--card-accent': accent } : {}}
    initial={{ opacity:0, y:18 }}
    animate={{ opacity:1, y:0 }}
    transition={{ delay, duration:0.35 }}
  >
    {accent && <div className="ot__card-accent-bar" />}
    <h2 className="ot__card-title">
      <span className="ot__card-title-ico">{icon}</span>
      {title}
    </h2>
    {children}
  </motion.div>
);

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate    = useNavigate();
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!orderId) { setError('No order ID provided.'); setLoading(false); return; }
    orderService.getOrder(orderId)
      .then(r => {
        const o = r.data?.order || r.data;
        if (!o) throw new Error('Order not found');
        setOrder(o);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to load order details.');
        toast.error('Could not load order tracking info.');
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  /* ── Loading ── */
  if (loading) return (
    <div className="ud-loading">
      <div className="ud-loading__spinner" />
      <Loader message="Loading order details" />
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div className="ot-error">
      <div className="ot-error__icon-wrap"><FiAlertCircle /></div>
      <h2>Oops!</h2>
      <p>{error}</p>
      <motion.button className="ot__back-pill" onClick={() => navigate('/dashboard')}
        whileHover={{ x:-3 }} whileTap={{ scale:0.97 }}
      >
        <FiArrowLeft /> Back to Dashboard
      </motion.button>
    </div>
  );

  const meta        = getMeta(order.OrderStatus);
  const isCancelled = order.OrderStatus === 'Cancelled';
  const isDelivered = order.OrderStatus === 'Delivered';

  return (
    <div className="ot">

      {/* ══ HERO ══ */}
      <div className="ot__hero">
        <div className="ot__hero-glow" />
        <div className="ot__hero-pattern" />

        <div className="ot__hero-inner">
          {/* top bar */}
          <div className="ot__hero-topbar">
            <motion.button className="ot__back-pill"
              onClick={() => navigate('/dashboard')}
              whileHover={{ x:-3 }} whileTap={{ scale:0.96 }}
            >
              <FiArrowLeft /> Dashboard
            </motion.button>
            <motion.button className="ot__icon-pill"
              onClick={() => window.location.reload()}
              whileHover={{ rotate:90 }} whileTap={{ scale:0.92 }}
              title="Refresh"
            >
              <FiRefreshCw />
            </motion.button>
          </div>

          {/* hero body */}
          <div className="ot__hero-body">
            <div className="ot__hero-text">
              <motion.span className="ot__eyebrow"
                initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45 }}
              >
                ✦ Order Tracking
              </motion.span>
              <motion.h1
                initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.08 }}
              >
                Order <span className="ot__hero-id">#{order.OrderID || order.OrderNumber || orderId}</span>
              </motion.h1>
              <motion.p
                initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.16 }}
              >
                Placed on {fmt(order.OrderDate)}
              </motion.p>
            </div>

            <motion.div
              className="ot__status-pill"
              style={{ background:meta.bg, color:meta.text, borderColor:`${meta.color}40` }}
              initial={{ opacity:0, scale:0.88 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.22 }}
            >
              <motion.span
                className="ot__status-dot"
                style={{ background:meta.color }}
                animate={{ scale:[1,1.35,1], opacity:[1,0.45,1] }}
                transition={{ duration:2, repeat:Infinity }}
              />
              {order.OrderStatus}
            </motion.div>
          </div>

          {/* hero stats strip */}
          <motion.div className="ot__hero-strip"
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
          >
            {[
              { label:'Order ID',  value:`#${order.OrderID || order.OrderNumber || orderId}` },
              { label:'Items',     value:`${order.items?.length ?? 0} item${order.items?.length !== 1 ? 's' : ''}` },
              { label:'Total',     value:fmtAmt(order.TotalAmount) || '—' },
              { label:'Payment',   value:order.PaymentMethod || '—' },
            ].map((s, i) => (
              <div key={i} className="ot__hero-stat">
                <span className="ot__hero-stat-label">{s.label}</span>
                <strong className="ot__hero-stat-val">{s.value}</strong>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ══ CONTENT ══ */}
      <div className="ot__wrap">

        {/* Banners */}
        <AnimatePresence>
          {isCancelled && (
            <motion.div className="ot__banner ot__banner--cancel"
              initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            >
              <div className="ot__banner-ico"><FiXCircle /></div>
              <div>
                <strong>Order Cancelled</strong>
                <p>This order was cancelled. If you have questions, please contact our support team.</p>
              </div>
            </motion.div>
          )}
          {isDelivered && (
            <motion.div className="ot__banner ot__banner--success"
              initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            >
              <div className="ot__banner-ico"><FiCheckCircle /></div>
              <div>
                <strong>Order Delivered! 🎉</strong>
                <p>Your order has been delivered successfully. We hope you love your spices!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main grid */}
        <div className="ot__grid">

          {/* ─── LEFT COLUMN ─── */}
          <div className="ot__col-main">

            {/* Timeline */}
            <Card title="Tracking Status" icon={<FiNavigation />} delay={0.1} accent={meta.color}>
              <TrackingTimeline status={order.OrderStatus} />
            </Card>

            {/* Shipping Info */}
            {order.shipping && (
              <Card title="Shipping Information" icon={<FiTruck />} delay={0.2}>
                <div className="ot__ship-grid">
                  {[
                    { label:'Shipping Status', value:order.shipping.ShippingStatus },
                    { label:'Carrier',         value:order.shipping.Carrier },
                    { label:'Tracking No.',    value:order.shipping.TrackingNumber, mono:true },
                    { label:'Est. Delivery',   value:fmt(order.shipping.EstimatedDelivery) },
                    { label:'Shipped Date',    value:fmt(order.shipping.ShippedDate) },
                    { label:'Delivered Date',  value:fmt(order.shipping.DeliveredDate) },
                  ].filter(r => r.value && r.value !== '—').map((r, i) => (
                    <div key={i} className="ot__ship-field">
                      <label>{r.label}</label>
                      <p className={r.mono ? 'ot__mono' : ''}>{r.value}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Order Items */}
            {order.items?.length > 0 && (
              <Card title="Order Items" icon={<FiShoppingCart />} delay={0.3}>
                <div className="ot__items">
                  {order.items.map((item, i) => (
                    <motion.div key={item.OrderItemID || i} className="ot__item"
                      initial={{ opacity:0, x:-12 }}
                      animate={{ opacity:1, x:0 }}
                      transition={{ delay:0.1*i + 0.35 }}
                    >
                      <div className="ot__item-thumb">
                        {item.ProductImage
                          ? <img src={item.ProductImage} alt={item.ProductName} />
                          : <span>🌶️</span>}
                      </div>
                      <div className="ot__item-info">
                        <p className="ot__item-name">{item.ProductName || `Product #${item.ProductID}`}</p>
                        {item.Variant && <span className="ot__item-variant">{item.Variant}</span>}
                        <p className="ot__item-meta">
                          Qty: <strong>{item.Quantity}</strong>
                          {item.UnitPrice != null && <> · {fmtAmt(item.UnitPrice)} each</>}
                        </p>
                      </div>
                      <div className="ot__item-price">
                        {fmtAmt(
                          item.Subtotal != null ? item.Subtotal
                            : item.UnitPrice != null ? item.UnitPrice * item.Quantity
                            : null
                        ) || '—'}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* ─── RIGHT SIDEBAR ─── */}
          <div className="ot__col-side">

            {/* Order Summary */}
            <Card title="Order Summary" icon={<FiDollarSign />} delay={0.15}>
              <div className="ot__summary">
                {[
                  { label:'Subtotal',  value:fmtAmt(order.Subtotal) },
                  { label:'Shipping',  value:fmtAmt(order.ShippingCost) },
                  { label:'Tax',       value:fmtAmt(order.Tax) },
                  { label:'Discount',  value:order.Discount ? `-${fmtAmt(order.Discount)}` : null },
                ].filter(r => r.value).map((r, i) => (
                  <div key={i} className="ot__sum-row">
                    <span>{r.label}</span><span>{r.value}</span>
                  </div>
                ))}
                <div className="ot__sum-row ot__sum-row--total">
                  <span>Total</span>
                  <strong>{fmtAmt(order.TotalAmount) || '—'}</strong>
                </div>
              </div>

              {/* Payment badge */}
              {order.PaymentMethod && (
                <div className="ot__payment-badge">
                  <div className="ot__payment-badge-left">
                    <FiCreditCard />
                    <span>{order.PaymentMethod}</span>
                  </div>
                  {order.PaymentStatus && (
                    <span className={`ot__pay-chip ot__pay-chip--${order.PaymentStatus.toLowerCase()}`}>
                      {order.PaymentStatus}
                    </span>
                  )}
                </div>
              )}
            </Card>

            {/* Delivery Address */}
            {order.address && (
              <Card title="Delivery Address" icon={<FiMapPin />} delay={0.25}>
                <div className="ot__info-stack">
                  {order.address.RecipientName && (
                    <InfoRow icon={<FiUser />}  label="Recipient" value={order.address.RecipientName} />
                  )}
                  <InfoRow
                    icon={<FiHome />}
                    label="Address"
                    value={[
                      order.address.AddressLine1, order.address.AddressLine2,
                      order.address.City, order.address.State,
                      order.address.PostalCode, order.address.Country,
                    ].filter(Boolean).join(', ')}
                  />
                  {order.address.Phone && (
                    <InfoRow icon={<FiPhone />} label="Phone" value={order.address.Phone} />
                  )}
                </div>
              </Card>
            )}

            {/* Also support flat shippingAddress string */}
            {!order.address && order.ShippingAddress && (
              <Card title="Delivery Address" icon={<FiMapPin />} delay={0.25}>
                <div className="ot__info-stack">
                  <InfoRow icon={<FiHome />} label="Address" value={order.ShippingAddress} />
                </div>
              </Card>
            )}

            {/* Customer Info */}
            {order.customer && (
              <Card title="Customer" icon={<FiUser />} delay={0.35}>
                <div className="ot__info-stack">
                  <InfoRow
                    icon={<FiUser />}  label="Name"
                    value={`${order.customer.FirstName ?? ''} ${order.customer.LastName ?? ''}`.trim() || '—'}
                  />
                  {order.customer.Email && (
                    <InfoRow icon={<FiHash />}  label="Email" value={order.customer.Email} />
                  )}
                  {order.customer.Phone && (
                    <InfoRow icon={<FiPhone />} label="Phone" value={order.customer.Phone} />
                  )}
                </div>
              </Card>
            )}

            {/* Dates */}
            <Card title="Timeline" icon={<FiCalendar />} delay={0.4}>
              <div className="ot__info-stack">
                <InfoRow icon={<FiCalendar />} label="Order Placed"  value={fmt(order.OrderDate)} />
                {order.UpdatedAt && (
                  <InfoRow icon={<FiClock />}  label="Last Updated"  value={fmt(order.UpdatedAt)} />
                )}
                {order.shipping?.ShippedDate && (
                  <InfoRow icon={<FiTruck />}  label="Shipped"       value={fmt(order.shipping.ShippedDate)} />
                )}
                {order.shipping?.EstimatedDelivery && (
                  <InfoRow icon={<FiClock />}  label="Est. Delivery" value={fmt(order.shipping.EstimatedDelivery)} />
                )}
                {order.shipping?.DeliveredDate && (
                  <InfoRow icon={<FiCheckCircle />} label="Delivered" value={fmt(order.shipping.DeliveredDate)} />
                )}
              </div>
            </Card>

            {/* Notes */}
            {order.Notes && (
              <Card title="Order Notes" icon={<FiAlertCircle />} delay={0.45}>
                <p className="ot__notes">{order.Notes}</p>
              </Card>
            )}

            {/* Help CTA */}
            <motion.div className="ot__help-card"
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
            >
              <div className="ot__help-ico">🌶️</div>
              <p>Need help with your order?</p>
              <motion.button className="ot__help-btn"
                whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                onClick={() => navigate('/contact')}
              >
                Contact Support <FiChevronRight />
              </motion.button>
            </motion.div>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════
          STYLES
      ══════════════════════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');

        /* ── Root ── */
        .ot {
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
          padding-bottom: 80px;
        }

        /* ── Loading ── */
        .ot-loading {
          min-height: 70vh; display:flex; flex-direction:column;
          align-items:center; justify-content:center; gap:20px;
          color:#8a7055; font-family:'DM Sans',sans-serif;
        }
        .ot-loading__rings {
          position:relative; width:72px; height:72px;
          display:flex; align-items:center; justify-content:center;
        }
        .ot-loading__ring {
          position:absolute; inset:0; border-radius:50%;
          border:3px solid transparent;
          border-top-color:#C8872A;
          animation:ot-spin 1s linear infinite;
        }
        .ot-loading__ring--2 {
          inset:8px;
          border-top-color:#2E5A4C;
          animation-duration:0.7s;
          animation-direction:reverse;
        }
        .ot-loading__spice {
          font-size:1.4rem; position:relative; z-index:1;
        }
        @keyframes ot-spin { to { transform:rotate(360deg); } }
        .ot-loading p { font-size:0.9rem; }

        /* ── Error ── */
        .ot-error {
          min-height:70vh; display:flex; flex-direction:column;
          align-items:center; justify-content:center; gap:14px;
          padding:40px 24px; text-align:center;
          font-family:'DM Sans',sans-serif;
        }
        .ot-error__icon-wrap {
          width:64px; height:64px; border-radius:50%;
          background:rgba(239,68,68,0.1); border:2px solid rgba(239,68,68,0.25);
          display:flex; align-items:center; justify-content:center;
          font-size:1.6rem; color:#EF4444;
        }
        .ot-error h2 {
          font-family:'Playfair Display',Georgia,serif;
          font-size:1.5rem; color:#1A1208;
        }
        .ot-error p { color:#8a7055; max-width:360px; }

        /* ══ HERO ══ */
        .ot__hero {
          position:relative;
          background: linear-gradient(135deg, #1A1208 0%, #2E5A4C 55%, #3d6b5a 100%);
          padding:0;
          overflow:hidden;
        }
        .ot__hero-glow {
          position:absolute; inset:0; pointer-events:none;
          background:radial-gradient(ellipse at 80% 40%, rgba(200,135,42,0.22) 0%, transparent 65%);
        }
        .ot__hero-pattern {
          position:absolute; inset:0; pointer-events:none;
          background-image:repeating-linear-gradient(
            45deg,transparent,transparent 28px,
            rgba(255,255,255,0.02) 28px,rgba(255,255,255,0.02) 29px
          );
        }
        .ot__hero-inner {
          position:relative; z-index:1;
          max-width:1200px; margin:0 auto;
          padding:32px 40px 0;
        }

        /* topbar */
        .ot__hero-topbar {
          display:flex; align-items:center; justify-content:space-between;
          margin-bottom:28px;
        }
        .ot__back-pill {
          display:inline-flex; align-items:center; gap:8px;
          padding:9px 18px; border-radius:50px;
          border:1.5px solid rgba(255,255,255,0.18);
          background:rgba(255,255,255,0.08); color:rgba(255,255,255,0.82);
          font-size:0.85rem; font-weight:600; cursor:pointer;
          backdrop-filter:blur(8px); font-family:'DM Sans',sans-serif;
          transition:all 0.2s;
        }
        .ot__back-pill:hover { background:rgba(200,135,42,0.25); border-color:var(--amber-l); color:#fff; }
        .ot__icon-pill {
          width:38px; height:38px; border-radius:50%;
          border:1.5px solid rgba(255,255,255,0.18);
          background:rgba(255,255,255,0.08); color:rgba(255,255,255,0.8);
          display:flex; align-items:center; justify-content:center;
          font-size:1rem; cursor:pointer; backdrop-filter:blur(8px);
          transition:all 0.2s;
        }
        .ot__icon-pill:hover { background:rgba(200,135,42,0.25); }

        /* hero body */
        .ot__hero-body {
          display:flex; align-items:flex-start; justify-content:space-between;
          flex-wrap:wrap; gap:16px; margin-bottom:28px;
        }
        .ot__hero-text {}
        .ot__eyebrow {
          display:block; font-size:0.7rem; letter-spacing:3.5px;
          text-transform:uppercase; color:var(--amber-l);
          font-weight:700; margin-bottom:10px;
        }
        .ot__hero h1 {
          font-family:'Playfair Display',Georgia,serif;
          font-size:clamp(1.6rem,4vw,2.6rem); color:#fff;
          margin:0 0 8px; line-height:1.2;
        }
        .ot__hero-id { color:var(--amber-l); }
        .ot__hero-body > .ot__hero-text > p { color:rgba(255,255,255,0.55); font-size:0.9rem; margin:0; }
        .ot__status-pill {
          display:inline-flex; align-items:center; gap:8px;
          padding:9px 20px; border-radius:50px; font-size:0.85rem;
          font-weight:700; border:1.5px solid; white-space:nowrap;
          align-self:flex-start; margin-top:4px;
        }
        .ot__status-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }

        /* stats strip */
        .ot__hero-strip {
          display:flex; border-radius:16px 16px 0 0;
          overflow:hidden; background:rgba(255,255,255,0.07);
          border:1px solid rgba(255,255,255,0.1); border-bottom:none;
        }
        .ot__hero-stat {
          flex:1; display:flex; flex-direction:column;
          padding:16px 20px;
          border-right:1px solid rgba(255,255,255,0.08);
        }
        .ot__hero-stat:last-child { border-right:none; }
        .ot__hero-stat-label {
          font-size:0.65rem; letter-spacing:1.5px; text-transform:uppercase;
          color:rgba(255,255,255,0.4); margin-bottom:4px;
        }
        .ot__hero-stat-val {
          font-family:'Playfair Display',Georgia,serif;
          font-size:1rem; color:#fff; font-weight:700;
        }

        /* ══ CONTENT ══ */
        .ot__wrap {
          max-width:1200px; margin:0 auto;
          padding:28px 40px 0;
        }

        /* banners */
        .ot__banner {
          display:flex; align-items:flex-start; gap:16px;
          padding:18px 22px; border-radius:16px; margin-bottom:24px;
          font-size:0.88rem; line-height:1.6;
        }
        .ot__banner strong { display:block; font-size:0.95rem; margin-bottom:3px; }
        .ot__banner p { margin:0; opacity:0.85; }
        .ot__banner-ico { font-size:1.4rem; flex-shrink:0; margin-top:1px; }
        .ot__banner--cancel {
          background:rgba(239,68,68,0.07); border:1px solid rgba(239,68,68,0.2); color:#991B1B;
        }
        .ot__banner--success {
          background:rgba(16,185,129,0.07); border:1px solid rgba(16,185,129,0.2); color:#065F46;
        }

        /* grid */
        .ot__grid {
          display:grid;
          grid-template-columns:1fr 340px;
          gap:24px; align-items:start;
        }
        .ot__col-main { display:flex; flex-direction:column; gap:24px; }
        .ot__col-side { display:flex; flex-direction:column; gap:20px; }

        /* ══ CARD ══ */
        .ot__card {
          background:#fff; border-radius:18px;
          border:1.5px solid rgba(200,135,42,0.1);
          box-shadow:0 2px 14px rgba(26,18,8,0.06);
          overflow:hidden; position:relative;
        }
        .ot__card-accent-bar {
          height:3px; background:var(--card-accent);
          border-radius:18px 18px 0 0;
        }
        .ot__card-title {
          display:flex; align-items:center; gap:10px;
          font-family:'Playfair Display',Georgia,serif;
          font-size:1.05rem; color:var(--dark); margin:0;
          padding:18px 22px;
          border-bottom:1px solid rgba(200,135,42,0.08);
        }
        .ot__card-title-ico {
          width:32px; height:32px; border-radius:9px;
          background:rgba(200,135,42,0.08); color:var(--amber);
          display:flex; align-items:center; justify-content:center;
          font-size:0.9rem; flex-shrink:0;
        }

        /* ══ TIMELINE ══ */
        .ot__timeline { padding:20px 22px; display:flex; flex-direction:column; gap:0; }
        .ot__tl-row {
          display:flex; gap:16px; position:relative;
        }
        .ot__tl-left {
          display:flex; flex-direction:column; align-items:center;
          flex-shrink:0; width:44px;
        }
        .ot__tl-dot {
          width:44px; height:44px; border-radius:50%;
          border:2.5px solid; display:flex; align-items:center; justify-content:center;
          flex-shrink:0; position:relative; z-index:1;
          box-shadow:0 2px 8px rgba(0,0,0,0.06);
        }
        .ot__tl-pulse {
          width:12px; height:12px; border-radius:50%;
        }
        .ot__tl-line-wrap {
          flex:1; display:flex; position:relative;
          width:2px; margin:4px 0; min-height:32px;
        }
        .ot__tl-line-bg {
          position:absolute; inset:0;
          background:rgba(200,135,42,0.12); border-radius:2px;
        }
        .ot__tl-line-fill {
          position:absolute; inset:0; border-radius:2px; transform-origin:top;
        }

        /* content side */
        .ot__tl-content {
          display:flex; align-items:flex-start; gap:13px;
          padding:10px 0 24px; flex:1;
        }
        .ot__tl-content--pending { opacity:0.45; }
        .ot__tl-ico-wrap {
          width:36px; height:36px; border-radius:10px;
          background:rgba(200,135,42,0.06); color:#a08060;
          display:flex; align-items:center; justify-content:center;
          font-size:0.95rem; flex-shrink:0; margin-top:4px;
        }
        .ot__tl-text { flex:1; }
        .ot__tl-title-row {
          display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:4px;
        }
        .ot__tl-title {
          font-family:'Playfair Display',Georgia,serif;
          font-size:1rem; color:var(--dark); margin:0; font-weight:600;
        }
        .ot__tl-chip {
          display:inline-flex; align-items:center; gap:4px;
          padding:2px 9px; border-radius:20px; font-size:0.68rem; font-weight:700;
        }
        .ot__tl-chip--done {
          background:rgba(16,185,129,0.1); color:#065F46;
        }
        .ot__tl-desc { font-size:0.83rem; color:#8a7055; margin:0; line-height:1.55; }
        .ot__tl-desc--muted { color:#c0a890; }

        /* ══ SHIPPING GRID ══ */
        .ot__ship-grid {
          display:grid; grid-template-columns:1fr 1fr; gap:1px;
          background:rgba(200,135,42,0.08); margin:0;
        }
        .ot__ship-field {
          padding:14px 20px; background:#fff;
        }
        .ot__ship-field label {
          display:block; font-size:0.67rem; font-weight:700;
          letter-spacing:1.5px; text-transform:uppercase;
          color:#a08060; margin-bottom:4px;
        }
        .ot__ship-field p { font-size:0.9rem; font-weight:600; color:var(--dark); margin:0; }
        .ot__mono { font-family:'Courier New',monospace !important; font-size:0.85rem !important; }

        /* ══ ITEMS ══ */
        .ot__items { padding:4px 0; }
        .ot__item {
          display:flex; align-items:center; gap:16px;
          padding:14px 22px;
          border-bottom:1px solid rgba(200,135,42,0.07);
          transition:background 0.15s;
        }
        .ot__item:last-child { border-bottom:none; }
        .ot__item:hover { background:#fdf9f4; }
        .ot__item-thumb {
          width:54px; height:54px; border-radius:12px;
          background:linear-gradient(135deg,#fdf3e3,#f5e5cc);
          overflow:hidden; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          font-size:1.4rem;
          border:1px solid rgba(200,135,42,0.12);
        }
        .ot__item-thumb img { width:100%; height:100%; object-fit:cover; }
        .ot__item-info { flex:1; }
        .ot__item-name { font-weight:700; color:var(--dark); font-size:0.9rem; margin-bottom:3px; }
        .ot__item-variant {
          display:inline-block; font-size:0.7rem; font-weight:700;
          letter-spacing:1px; text-transform:uppercase; color:var(--amber);
          margin-bottom:3px;
        }
        .ot__item-meta { font-size:0.78rem; color:#8a7055; margin:0; }
        .ot__item-meta strong { color:var(--dark); }
        .ot__item-price {
          font-weight:800; color:var(--forest);
          font-family:'Playfair Display',Georgia,serif;
          font-size:0.95rem; white-space:nowrap;
        }

        /* ══ ORDER SUMMARY ══ */
        .ot__summary { padding:4px 0 16px; }
        .ot__sum-row {
          display:flex; justify-content:space-between; align-items:center;
          padding:11px 22px; font-size:0.87rem; color:#8a7055;
          border-bottom:1px solid rgba(200,135,42,0.07);
        }
        .ot__sum-row:last-child { border-bottom:none; }
        .ot__sum-row--total {
          background:#fdf8f0; font-size:0.95rem;
          font-weight:700; color:var(--dark);
          padding:14px 22px;
        }
        .ot__sum-row--total strong {
          color:var(--amber-d);
          font-family:'Playfair Display',Georgia,serif; font-size:1.05rem;
        }

        .ot__payment-badge {
          display:flex; align-items:center; justify-content:space-between;
          padding:12px 22px;
          border-top:1px solid rgba(200,135,42,0.08);
          background:#fafaf7;
        }
        .ot__payment-badge-left {
          display:flex; align-items:center; gap:8px;
          font-size:0.84rem; color:#6b5c44; font-weight:600;
        }
        .ot__pay-chip {
          font-size:0.72rem; font-weight:700; padding:3px 10px; border-radius:20px;
        }
        .ot__pay-chip--paid    { background:rgba(16,185,129,0.1);  color:#065F46; }
        .ot__pay-chip--unpaid  { background:rgba(245,158,11,0.12); color:#92400E; }
        .ot__pay-chip--pending { background:rgba(245,158,11,0.12); color:#92400E; }
        .ot__pay-chip--failed  { background:rgba(239,68,68,0.1);   color:#991B1B; }

        /* ══ INFO STACK ══ */
        .ot__info-stack { padding:4px 0; }
        .ot__info-row {
          display:flex; align-items:flex-start; gap:12px;
          padding:13px 22px;
          border-bottom:1px solid rgba(200,135,42,0.07);
          transition:background 0.15s;
        }
        .ot__info-row:last-child { border-bottom:none; }
        .ot__info-row:hover { background:#fdf9f4; }
        .ot__info-ico {
          width:32px; height:32px; border-radius:8px;
          background:rgba(200,135,42,0.08); color:var(--amber);
          display:flex; align-items:center; justify-content:center;
          font-size:0.85rem; flex-shrink:0; margin-top:1px;
        }
        .ot__info-body { flex:1; }
        .ot__info-label {
          display:block; font-size:0.67rem; font-weight:700;
          letter-spacing:1.5px; text-transform:uppercase;
          color:#a08060; margin-bottom:3px;
        }
        .ot__info-val { font-size:0.87rem; font-weight:600; color:var(--dark); margin:0; line-height:1.5; }

        /* ── Notes ── */
        .ot__notes {
          font-size:0.87rem; color:#6b5c44; line-height:1.65;
          margin:0; padding:16px 22px;
        }

        /* ── Help card ── */
        .ot__help-card {
          background:#fff; border-radius:18px; padding:24px;
          border:1.5px dashed rgba(200,135,42,0.25);
          text-align:center; display:flex; flex-direction:column; align-items:center; gap:10px;
        }
        .ot__help-ico { font-size:1.8rem; }
        .ot__help-card p { font-size:0.86rem; color:#8a7055; margin:0; font-weight:600; }
        .ot__help-btn {
          display:inline-flex; align-items:center; gap:6px;
          padding:9px 20px; border-radius:50px; font-size:0.84rem; font-weight:700;
          background:linear-gradient(135deg,var(--forest),var(--forest-d));
          color:#fff; border:none; cursor:pointer;
          font-family:'DM Sans',sans-serif;
          box-shadow:0 4px 14px rgba(46,90,76,0.25); transition:box-shadow 0.2s;
        }
        .ot__help-btn:hover { box-shadow:0 6px 20px rgba(46,90,76,0.38); }

        /* ── Responsive ── */
        @media (max-width:1024px) {
          .ot__grid { grid-template-columns:1fr; }
          .ot__col-side { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
          .ot__hero-inner { padding:28px 28px 0; }
          .ot__wrap { padding:24px 28px 0; }
        }
        @media (max-width:720px) {
          .ot__col-side { grid-template-columns:1fr; }
          .ot__hero-strip { display:grid; grid-template-columns:1fr 1fr; border-radius:14px 14px 0 0; }
          .ot__hero-stat { border-right:none; border-bottom:1px solid rgba(255,255,255,0.08); }
          .ot__hero-inner { padding:24px 20px 0; }
          .ot__wrap { padding:20px 20px 0; }
          .ot__ship-grid { grid-template-columns:1fr; }
        }
        @media (max-width:480px) {
          .ot__hero-body { flex-direction:column; gap:12px; }
          .ot__hero-strip { grid-template-columns:1fr 1fr; }
        }
      `}</style>
    </div>
  );
};

export default OrderTracking;