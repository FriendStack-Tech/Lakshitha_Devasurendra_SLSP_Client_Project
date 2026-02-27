import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { paymentService } from '../services/paymentService';

import {
  FiCheckCircle, FiAlertTriangle, FiClock, FiHome,
  FiShoppingBag, FiRefreshCw, FiMail, FiShield,
  FiPackage, FiArrowRight
} from 'react-icons/fi';

/* ── Status config map ── */
const STATUS_CONFIG = {
  checking: {
    icon:    null,
    color:   '#C8872A',
    bg:      'rgba(200,135,42,0.08)',
    title:   'Verifying Payment…',
    message: 'Please wait while we confirm your payment with PayHere.',
    eyebrow: '✦ Processing',
  },
  Completed: {
    icon:    <FiCheckCircle />,
    color:   '#10B981',
    bg:      'rgba(16,185,129,0.1)',
    border:  'rgba(16,185,129,0.3)',
    title:   'Payment Successful!',
    message: 'Your order has been confirmed and our team is preparing your spices.',
    eyebrow: '✦ Order Confirmed',
  },
  Pending: {
    icon:    <FiClock />,
    color:   '#F59E0B',
    bg:      'rgba(245,158,11,0.1)',
    border:  'rgba(245,158,11,0.3)',
    title:   'Payment Pending',
    message: 'Your payment is being processed. We\'ll notify you once it clears.',
    eyebrow: '✦ Awaiting Confirmation',
  },
  error: {
    icon:    <FiAlertTriangle />,
    color:   '#EF4444',
    bg:      'rgba(239,68,68,0.1)',
    border:  'rgba(239,68,68,0.3)',
    title:   'Something Went Wrong',
    message: 'We couldn\'t verify your payment. If you were charged, please contact support.',
    eyebrow: '✦ Verification Failed',
  },
};

const getConfig = (status) =>
  STATUS_CONFIG[status] || {
    icon:    <FiAlertTriangle />,
    color:   '#F59E0B',
    bg:      'rgba(245,158,11,0.1)',
    border:  'rgba(245,158,11,0.3)',
    title:   `Payment ${status}`,
    message: 'If you were charged and your order wasn\'t confirmed, please contact our support team.',
    eyebrow: `✦ Status: ${status}`,
  };

/* ── Animated ring for checking state ── */
const PulseRing = () => (
  <div className="pr-pulse-wrap">
    <motion.div className="pr-pulse-ring pr-pulse-ring--outer"
      animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0.1, 0.4] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div className="pr-pulse-ring pr-pulse-ring--mid"
      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.15, 0.5] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
    />
    <div className="pr-pulse-ring pr-pulse-ring--inner">
      <div className="pr-spinner" />
    </div>
  </div>
);

/* ── Main component ── */
const PaymentReturn = () => {
  const navigate = useNavigate();
  const [status,   setStatus]   = useState('checking');
  const [orderId,  setOrderId]  = useState(null);
  const [dots,     setDots]     = useState('');

  /* Animated ellipsis for "checking" state */
  useEffect(() => {
    if (status !== 'checking') return;
    const t = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    return () => clearInterval(t);
  }, [status]);

  useEffect(() => {
    const id = localStorage.getItem('pendingOrderId');
    if (!id) { navigate('/'); return; }
    setOrderId(id);

    const checkStatus = async () => {
        try {
        // ✅ Step 1: Update Pending → Completed + Order → Processing
        await paymentService.verifyAndComplete(id);

        // ✅ Step 2: Read the updated status to show correct UI
        const data = await paymentService.getPaymentStatus(id);

        console.log('✅ Payment status after verify:', data);

        setStatus(data.PaymentStatus ?? 'error');
        localStorage.removeItem('pendingOrderId');
        localStorage.removeItem('pendingOrderDisplayId');

        } catch (err) {
        console.error('Payment verification error:', err);
        setStatus('error');
        }
    };

    checkStatus();
}, []);

//   /* Payment status check */
//   useEffect(() => {
//     const id = localStorage.getItem('pendingOrderId');
//     if (!id) { navigate('/'); return; }
//     setOrderId(id);

//     const checkStatus = async () => {
//       try {
//         const data = await paymentService.getPaymentStatus(id);
//         setStatus(data.PaymentStatus ?? 'error');
//         localStorage.removeItem('pendingOrderId');
//       } catch {
//         setStatus('error');
//       }
//     };
//     checkStatus();
//   }, []);

  const cfg = getConfig(status);

  return (
    <div className="pr">
      {/* ── Hero strip — same dark gradient as rest of site ── */}
      <div className="pr__hero">
        <div className="pr__hero-glow" />
        <div className="pr__hero-pattern" />
        <motion.span className="pr__eyebrow"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {cfg.eyebrow}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {status === 'checking' ? <>Verifying{dots}</> : cfg.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {cfg.message}
        </motion.p>
      </div>

      {/* ── Card ── */}
      <div className="pr__body">
        <AnimatePresence mode="wait">
          <motion.div className="pr__card"
            key={status}
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 280, damping: 24 }}
          >

            {/* Status icon / spinner */}
            <div className="pr__icon-area">
              {status === 'checking' ? (
                <PulseRing />
              ) : (
                <motion.div
                  className="pr__icon-ring"
                  style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.color }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                >
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 }}
                  >
                    {cfg.icon}
                  </motion.span>
                </motion.div>
              )}
            </div>

            {/* Checking state content */}
            {status === 'checking' && (
              <motion.div className="pr__checking-body"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              >
                <p className="pr__checking-sub">This usually takes just a moment</p>
                <div className="pr__checking-steps">
                  {['Connecting to PayHere', 'Verifying transaction', 'Confirming order'].map((s, i) => (
                    <motion.div key={i} className="pr__check-step"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.18 }}
                    >
                      <motion.div className="pr__check-step__dot"
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.4, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.4 }}
                      />
                      <span>{s}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Success state */}
            {status === 'Completed' && (
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {orderId && (
                  <div className="pr__order-chip">
                    Order ref: <strong>#{orderId.slice(-8).toUpperCase()}</strong>
                  </div>
                )}

                <div className="pr__detail-grid">
                  {[
                    { icon: <FiPackage />,  label: 'Status',   value: 'Order Confirmed',     color: '#10B981' },
                    { icon: <FiShield />,   label: 'Payment',  value: 'Paid & Secured',       color: '#10B981' },
                    { icon: <FiMail />,     label: 'Receipt',  value: 'Sent to your email'                    },
                  ].map((d, i) => (
                    <motion.div key={i} className="pr__detail-item"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 + i * 0.09 }}
                    >
                      <div className="pr__detail-ico" style={{ color: d.color || '#C8872A' }}>{d.icon}</div>
                      <div>
                        <span className="pr__detail-label">{d.label}</span>
                        <strong className="pr__detail-val" style={{ color: d.color }}>{d.value}</strong>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="pr__actions">
                  <motion.button className="pr__btn pr__btn--primary"
                    onClick={() => navigate('/dashboard')}
                    whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}
                  >
                    <FiShoppingBag /> View My Orders <FiArrowRight />
                  </motion.button>
                  <motion.button className="pr__btn pr__btn--ghost"
                    onClick={() => navigate('/shop')}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  >
                    Continue Shopping
                  </motion.button>
                </div>

                <div className="pr__confetti-note">
                  🌶️ Your spices are on their way — thank you for choosing DevSpices!
                </div>
              </motion.div>
            )}

            {/* Pending state */}
            {status === 'Pending' && (
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="pr__info-box pr__info-box--warning">
                  <FiClock />
                  <div>
                    <strong>Your payment is being processed</strong>
                    <p>Bank payments can take up to 24 hours to confirm. We'll send you an email once complete.</p>
                  </div>
                </div>

                <div className="pr__actions">
                  <motion.button className="pr__btn pr__btn--primary"
                    onClick={() => navigate('/dashboard')}
                    whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}
                  >
                    <FiShoppingBag /> Track My Order
                  </motion.button>
                  <motion.button className="pr__btn pr__btn--ghost"
                    onClick={() => window.location.reload()}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  >
                    <FiRefreshCw /> Refresh Status
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Error / unknown state */}
            {status !== 'checking' && status !== 'Completed' && status !== 'Pending' && (
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="pr__info-box pr__info-box--error">
                  <FiAlertTriangle />
                  <div>
                    <strong>Payment could not be verified</strong>
                    <p>If your card was charged and you didn't receive an order confirmation, please contact our support team with your transaction ID.</p>
                  </div>
                </div>

                <div className="pr__actions">
                  <motion.button className="pr__btn pr__btn--primary"
                    onClick={() => navigate('/')}
                    whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}
                  >
                    <FiHome /> Back to Home
                  </motion.button>
                  <motion.button className="pr__btn pr__btn--ghost"
                    onClick={() => navigate('/contact')}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  >
                    <FiMail /> Contact Support
                  </motion.button>
                </div>
              </motion.div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Trust row */}
        <motion.div className="pr__trust"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {[
            { icon: <FiShield />,   text: 'SSL Encrypted' },
            { icon: <FiCheckCircle />, text: 'PayHere Verified' },
            { icon: <FiMail />,     text: 'Email Receipt' },
          ].map((t, i) => (
            <div key={i} className="pr__trust-item">
              <span className="pr__trust-ico">{t.icon}</span>
              <span>{t.text}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');

        .pr {
          --amber:   #C8872A;
          --amber-d: #A06820;
          --amber-l: #F5A94A;
          --forest:  #2E5A4C;
          --forest-d:#1e3d33;
          --dark:    #1A1208;
          min-height: 100vh;
          background: #f9f4ec;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          flex-direction: column;
        }

        /* ── Hero — exact clone of AdminDashboard hero ── */
        .pr__hero {
          position: relative;
          background: linear-gradient(135deg, #1A1208 0%, #2E5A4C 55%, #3d6b5a 100%);
          padding: 52px 40px 48px;
          overflow: hidden;
          text-align: center;
          display: flex; flex-direction: column; align-items: center;
        }
        .pr__hero-glow {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse at 60% 40%, rgba(200,135,42,0.22) 0%, transparent 65%);
        }
        .pr__hero-pattern {
          position: absolute; inset: 0; pointer-events: none;
          background-image: repeating-linear-gradient(
            45deg, transparent, transparent 28px,
            rgba(255,255,255,0.02) 28px, rgba(255,255,255,0.02) 29px
          );
        }
        .pr__eyebrow {
          position: relative; z-index: 1;
          font-size: 0.72rem; letter-spacing: 3.5px;
          text-transform: uppercase; color: var(--amber-l);
          font-weight: 700; margin-bottom: 12px; display: block;
        }
        .pr__hero h1 {
          position: relative; z-index: 1;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          color: #fff; margin: 0 0 12px; line-height: 1.2;
        }
        .pr__hero p {
          position: relative; z-index: 1;
          color: rgba(255,255,255,0.6); font-size: 1rem;
          max-width: 480px; line-height: 1.6; margin: 0;
        }

        /* ── Body ── */
        .pr__body {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; padding: 40px 24px 64px;
        }

        /* ── Card ── */
        .pr__card {
          background: #fff; border-radius: 24px; padding: 40px 36px;
          width: 100%; max-width: 520px;
          border: 1.5px solid rgba(200,135,42,0.12);
          box-shadow: 0 8px 40px rgba(26,18,8,0.09);
        }

        /* ── Icon area ── */
        .pr__icon-area {
          display: flex; justify-content: center; margin-bottom: 28px;
        }
        .pr__icon-ring {
          width: 88px; height: 88px; border-radius: 50%;
          border: 3px solid; display: flex; align-items: center;
          justify-content: center; font-size: 2.4rem;
        }

        /* ── Pulse / spinner (checking) ── */
        .pr-pulse-wrap {
          position: relative; width: 88px; height: 88px;
          display: flex; align-items: center; justify-content: center;
        }
        .pr-pulse-ring {
          position: absolute; border-radius: 50%;
          background: rgba(200,135,42,0.15);
        }
        .pr-pulse-ring--outer  { inset: -14px; }
        .pr-pulse-ring--mid    { inset: -6px; }
        .pr-pulse-ring--inner  {
          inset: 0; background: rgba(200,135,42,0.08);
          border: 2.5px solid rgba(200,135,42,0.3);
          display: flex; align-items: center; justify-content: center;
        }
        .pr-spinner {
          width: 32px; height: 32px;
          border: 3px solid rgba(200,135,42,0.2);
          border-top-color: #C8872A; border-radius: 50%;
          animation: pr-spin 0.85s linear infinite;
        }
        @keyframes pr-spin { to { transform: rotate(360deg); } }

        /* ── Checking body ── */
        .pr__checking-body { text-align: center; }
        .pr__checking-sub { color: #8a7055; font-size: 0.88rem; margin-bottom: 24px; }
        .pr__checking-steps {
          display: flex; flex-direction: column; gap: 12px; text-align: left;
          background: #fdf8f0; border-radius: 14px; padding: 18px 20px;
          border: 1px solid rgba(200,135,42,0.1);
        }
        .pr__check-step {
          display: flex; align-items: center; gap: 12px;
          font-size: 0.86rem; color: #6b5c44; font-weight: 500;
        }
        .pr__check-step__dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--amber); flex-shrink: 0;
        }

        /* ── Order chip ── */
        .pr__order-chip {
          text-align: center; margin-bottom: 20px;
          display: inline-block; padding: 5px 18px; border-radius: 20px;
          background: rgba(200,135,42,0.1); border: 1px solid rgba(200,135,42,0.25);
          color: var(--amber-d); font-size: 0.82rem; width: 100%;
          box-sizing: border-box;
        }
        .pr__order-chip strong { font-weight: 700; letter-spacing: 0.5px; }

        /* ── Detail grid (success) ── */
        .pr__detail-grid {
          display: flex; flex-direction: column; gap: 1px;
          border-radius: 14px; overflow: hidden;
          border: 1px solid rgba(200,135,42,0.1); margin-bottom: 24px;
        }
        .pr__detail-item {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 18px; background: #fff;
          border-bottom: 1px solid rgba(200,135,42,0.07);
          transition: background 0.15s;
        }
        .pr__detail-item:last-child { border-bottom: none; }
        .pr__detail-item:hover { background: #fdf9f4; }
        .pr__detail-ico {
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(200,135,42,0.08);
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; flex-shrink: 0;
        }
        .pr__detail-label {
          display: block; font-size: 0.68rem; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase; color: #a08060;
          margin-bottom: 2px;
        }
        .pr__detail-val {
          display: block; font-size: 0.9rem; font-weight: 700; color: #1A1208;
        }

        /* ── Info boxes (warning / error) ── */
        .pr__info-box {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 16px 18px; border-radius: 14px;
          margin-bottom: 24px; font-size: 0.86rem; line-height: 1.6;
        }
        .pr__info-box svg { font-size: 1.2rem; flex-shrink: 0; margin-top: 1px; }
        .pr__info-box strong { display: block; font-size: 0.9rem; margin-bottom: 4px; }
        .pr__info-box p { margin: 0; opacity: 0.85; }
        .pr__info-box--warning {
          background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.25);
          color: #92400E;
        }
        .pr__info-box--error {
          background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.2);
          color: #991B1B;
        }

        /* ── Actions ── */
        .pr__actions { display: flex; flex-direction: column; gap: 10px; }
        .pr__btn {
          width: 100%; display: inline-flex; align-items: center;
          justify-content: center; gap: 8px;
          padding: 14px 24px; border-radius: 50px;
          font-size: 0.92rem; font-weight: 700; cursor: pointer;
          font-family: 'DM Sans', sans-serif; border: none; transition: all 0.2s;
        }
        .pr__btn--primary {
          background: linear-gradient(135deg, var(--forest), var(--forest-d));
          color: #fff; box-shadow: 0 5px 18px rgba(46,90,76,0.3);
        }
        .pr__btn--primary:hover { box-shadow: 0 7px 24px rgba(46,90,76,0.42); }
        .pr__btn--ghost {
          background: none; border: 1.5px solid rgba(200,135,42,0.25); color: #6b5c44;
        }
        .pr__btn--ghost:hover { border-color: var(--amber); color: var(--amber-d); background: rgba(200,135,42,0.04); }

        /* ── Confetti note ── */
        .pr__confetti-note {
          text-align: center; margin-top: 20px; padding: 12px 16px;
          border-radius: 12px; background: #fdf8f0;
          font-size: 0.84rem; color: #8a7055;
          border: 1px solid rgba(200,135,42,0.1);
        }

        /* ── Trust row ── */
        .pr__trust {
          display: flex; gap: 0;
          width: 100%; max-width: 520px; margin-top: 20px;
          background: #fff; border-radius: 16px;
          border: 1px solid rgba(200,135,42,0.1);
          overflow: hidden; box-shadow: 0 2px 10px rgba(26,18,8,0.04);
        }
        .pr__trust-item {
          flex: 1; display: flex; flex-direction: column; align-items: center;
          gap: 5px; padding: 14px 8px; font-size: 0.72rem; font-weight: 600;
          color: #8a7055; border-right: 1px solid rgba(200,135,42,0.08);
          text-align: center;
        }
        .pr__trust-item:last-child { border-right: none; }
        .pr__trust-ico { font-size: 1rem; color: var(--amber); }

        /* ── Responsive ── */
        @media (max-width: 560px) {
          .pr__hero { padding: 40px 24px 36px; }
          .pr__card { padding: 28px 20px; border-radius: 20px; }
          .pr__actions { gap: 8px; }
        }
      `}</style>
    </div>
  );
};

export default PaymentReturn;