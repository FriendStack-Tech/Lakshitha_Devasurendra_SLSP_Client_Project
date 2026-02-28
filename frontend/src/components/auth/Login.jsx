import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await login(data.email, data.password);
    setLoading(false);
    if (result.success) navigate('/dashboard');
  };

  return (
    <div className="lg-root">

      {/* ── Left panel — decorative ── */}
      <div className="lg-deco">
        <div className="lg-deco__glow" />
        <div className="lg-deco__pattern" />

        <div className="lg-deco__content">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            <span className="lg-deco__eyebrow">✦ DevSpices</span>
            <h2 className="lg-deco__heading">
              Flavours from<br />
              <span className="lg-deco__accent">Ceylon to the World</span>
            </h2>
            <p className="lg-deco__sub">
              Login to explore premium Sri Lankan spices, track your orders and manage your account.
            </p>
          </motion.div>

          {/* trust badges */}
          <motion.div className="lg-deco__badges"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            {[
              { emoji: '🌿', label: '100% Organic' },
              { emoji: '🚚', label: 'Fast Shipping' },
              { emoji: '🔐', label: 'Secure Account' },
            ].map((b, i) => (
              <div key={i} className="lg-deco__badge">
                <span>{b.emoji}</span>
                <span>{b.label}</span>
              </div>
            ))}
          </motion.div>

          {/* spice blobs */}
          <div className="lg-deco__blobs" aria-hidden>
            <motion.div className="lg-blob lg-blob--1"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >🌶️</motion.div>
            <motion.div className="lg-blob lg-blob--2"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            >🧄</motion.div>
            <motion.div className="lg-blob lg-blob--3"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            >🫚</motion.div>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="lg-form-panel">
        <motion.div
          className="lg-card"
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 260, damping: 24 }}
        >
          {/* card header */}
          <div className="lg-card__head">
            <div className="lg-card__logo">🌶️</div>
            <span className="lg-card__eyebrow">✦ Welcome Back</span>
            <h1 className="lg-card__title">Login to your account</h1>
            <p className="lg-card__sub">Good to see you again</p>
          </div>

          {/* form */}
          <form onSubmit={handleSubmit(onSubmit)} className="lg-form" noValidate>

            {/* Email */}
            <div className="lg-field">
              <label className="lg-field__label">Email Address</label>
              <div className="lg-field__wrap">
                <span className="lg-field__ico"><FiMail /></span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`lg-field__input${errors.email ? ' lg-field__input--err' : ''}`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                      message: 'Invalid email address',
                    },
                  })}
                  autoComplete="email"
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p className="lg-field__err"
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  >
                    <FiAlertCircle /> {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div className="lg-field">
              <div className="lg-field__label-row">
                <label className="lg-field__label">Password</label>
                <Link to="/forgot-password" className="lg-forgot">Forgot password?</Link>
              </div>
              <div className="lg-field__wrap">
                <span className="lg-field__ico"><FiLock /></span>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`lg-field__input${errors.password ? ' lg-field__input--err' : ''}`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' },
                  })}
                  autoComplete="current-password"
                />
                <button type="button" className="lg-field__eye" onClick={() => setShowPass(v => !v)}>
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p className="lg-field__err"
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  >
                    <FiAlertCircle /> {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              className="lg-submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02, y: -1 } : {}}
              whileTap={!loading  ? { scale: 0.98 } : {}}
            >
              {loading ? (
                <><span className="lg-spinner" /> Logging in…</>
              ) : (
                <><FiLogIn /> Login to Account</>
              )}
            </motion.button>
          </form>

          {/* divider */}
          <div className="lg-divider"><span>or</span></div>

          {/* register link */}
          <p className="lg-register-link">
            Don't have an account?{' '}
            <Link to="/register">Create one now</Link>
          </p>

          {/* security note */}
          <div className="lg-secure-note">
            <FiLock /> Your data is protected with 256-bit SSL encryption
          </div>
        </motion.div>
      </div>

      {/* ── Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');

        /* ── Layout ── */
        .lg-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #f9f4ec;
        }

        /* ══ LEFT DECORATIVE PANEL ══ */
        .lg-deco {
          flex: 1;
          position: relative;
          background: linear-gradient(135deg, #1A1208 0%, #2E5A4C 55%, #3d6b5a 100%);
          overflow: hidden;
          display: flex;
          align-items: center;
          min-height: 100vh;
        }
        @media (max-width: 860px) { .lg-deco { display: none; } }

        .lg-deco__glow {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse at 30% 50%, rgba(200,135,42,0.25) 0%, transparent 65%);
        }
        .lg-deco__pattern {
          position: absolute; inset: 0; pointer-events: none;
          background-image: repeating-linear-gradient(
            45deg, transparent, transparent 28px,
            rgba(255,255,255,0.025) 28px, rgba(255,255,255,0.025) 29px
          );
        }
        .lg-deco__content {
          position: relative; z-index: 1;
          padding: 60px 52px;
          width: 100%;
        }
        .lg-deco__eyebrow {
          display: inline-block;
          font-size: 0.7rem; letter-spacing: 3.5px; text-transform: uppercase;
          color: #F5A94A; font-weight: 700; margin-bottom: 18px;
        }
        .lg-deco__heading {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          color: #fff; line-height: 1.2; margin: 0 0 16px;
        }
        .lg-deco__accent { color: #F5A94A; }
        .lg-deco__sub {
          color: rgba(255,255,255,0.5); font-size: 0.95rem;
          line-height: 1.7; max-width: 360px; margin-bottom: 40px;
        }

        /* trust badges */
        .lg-deco__badges {
          display: flex; flex-direction: column; gap: 10px; margin-bottom: 48px;
        }
        .lg-deco__badge {
          display: inline-flex; align-items: center; gap: 10px;
          background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
          border-radius: 50px; padding: 9px 18px; width: fit-content;
          font-size: 0.82rem; color: rgba(255,255,255,0.7); font-weight: 600;
          backdrop-filter: blur(8px);
        }

        /* floating spice blobs */
        .lg-deco__blobs { position: absolute; inset: 0; pointer-events: none; }
        .lg-blob {
          position: absolute; font-size: 2.2rem; filter: drop-shadow(0 4px 16px rgba(0,0,0,0.3));
          opacity: 0.55;
        }
        .lg-blob--1 { top: 12%;  right: 14%; font-size: 2.8rem; opacity: 0.7; }
        .lg-blob--2 { bottom: 22%; right: 22%; font-size: 1.8rem; }
        .lg-blob--3 { top: 55%;  right: 8%;  font-size: 2rem; }

        /* ══ RIGHT FORM PANEL ══ */
        .lg-form-panel {
          width: 460px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 32px;
          background: #fdf8f0;
          min-height: 100vh;
        }
        @media (max-width: 860px) {
          .lg-form-panel { width: 100%; }
        }
        @media (max-width: 480px) {
          .lg-form-panel { padding: 28px 20px; align-items: flex-start; padding-top: 48px; }
        }

        /* ── Card ── */
        .lg-card {
          background: #fff; border-radius: 24px; width: 100%;
          padding: 40px 36px;
          border: 1.5px solid rgba(200,135,42,0.12);
          box-shadow: 0 8px 40px rgba(26,18,8,0.09);
        }
        @media (max-width: 480px) {
          .lg-card { padding: 28px 22px; border-radius: 20px; }
        }

        /* card header */
        .lg-card__head { text-align: center; margin-bottom: 32px; }
        .lg-card__logo {
          font-size: 2.2rem; margin-bottom: 12px; display: block;
          filter: drop-shadow(0 2px 8px rgba(200,135,42,0.3));
        }
        .lg-card__eyebrow {
          display: block; font-size: 0.68rem; letter-spacing: 3px;
          text-transform: uppercase; color: #C8872A; font-weight: 700; margin-bottom: 8px;
        }
        .lg-card__title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.5rem; color: #1A1208; margin: 0 0 6px;
        }
        .lg-card__sub { color: #a08060; font-size: 0.88rem; margin: 0; }

        /* ── Form fields ── */
        .lg-form { display: flex; flex-direction: column; gap: 20px; }

        .lg-field { display: flex; flex-direction: column; gap: 6px; }
        .lg-field__label-row {
          display: flex; align-items: center; justify-content: space-between;
        }
        .lg-field__label {
          font-size: 0.72rem; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; color: #C8872A;
        }
        .lg-forgot {
          font-size: 0.78rem; color: #a08060; text-decoration: none; font-weight: 600;
          transition: color 0.2s;
        }
        .lg-forgot:hover { color: #C8872A; }

        .lg-field__wrap {
          position: relative; display: flex; align-items: center;
        }
        .lg-field__ico {
          position: absolute; left: 14px;
          color: #C8872A; font-size: 0.95rem; pointer-events: none;
          display: flex; align-items: center;
        }
        .lg-field__input {
          width: 100%; box-sizing: border-box;
          padding: 13px 44px 13px 42px;
          border: 1.5px solid rgba(200,135,42,0.2);
          border-radius: 12px; background: #fdf8f0;
          font-size: 0.92rem; color: #1A1208;
          font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color 0.22s, box-shadow 0.22s;
        }
        .lg-field__input::placeholder { color: #c0a07a; }
        .lg-field__input:focus {
          border-color: #C8872A;
          box-shadow: 0 0 0 3.5px rgba(200,135,42,0.12);
          background: #fff;
        }
        .lg-field__input--err {
          border-color: #EF4444;
          background: rgba(239,68,68,0.03);
        }
        .lg-field__input--err:focus {
          border-color: #EF4444;
          box-shadow: 0 0 0 3px rgba(239,68,68,0.1);
        }
        .lg-field__eye {
          position: absolute; right: 13px;
          background: none; border: none; cursor: pointer;
          color: #a08060; font-size: 1rem; padding: 4px;
          display: flex; align-items: center; transition: color 0.2s;
        }
        .lg-field__eye:hover { color: #C8872A; }
        .lg-field__err {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.78rem; color: #EF4444; font-weight: 600; margin: 0;
        }

        /* ── Submit button ── */
        .lg-submit {
          width: 100%; padding: 14px;
          border-radius: 14px; border: none; cursor: pointer;
          background: linear-gradient(135deg, #C8872A, #A06820);
          color: #fff; font-size: 0.95rem; font-weight: 800;
          font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 9px;
          box-shadow: 0 6px 22px rgba(200,135,42,0.38);
          letter-spacing: 0.2px; transition: box-shadow 0.2s, opacity 0.2s;
          margin-top: 4px;
        }
        .lg-submit:hover:not(:disabled) { box-shadow: 0 8px 28px rgba(200,135,42,0.5); }
        .lg-submit:disabled { opacity: 0.65; cursor: not-allowed; }

        /* spinner */
        .lg-spinner {
          display: inline-block; width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff;
          border-radius: 50%; animation: lg-spin 0.7s linear infinite;
        }
        @keyframes lg-spin { to { transform: rotate(360deg); } }

        /* ── Divider ── */
        .lg-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 22px 0 16px; color: #c0a07a; font-size: 0.78rem;
        }
        .lg-divider::before, .lg-divider::after {
          content: ''; flex: 1; height: 1px; background: rgba(200,135,42,0.15);
        }

        /* ── Register link ── */
        .lg-register-link {
          text-align: center; font-size: 0.88rem; color: #8a7055; margin: 0;
        }
        .lg-register-link a {
          color: #A06820; font-weight: 700; text-decoration: none; transition: color 0.2s;
        }
        .lg-register-link a:hover { color: #C8872A; text-decoration: underline; }

        /* ── Secure note ── */
        .lg-secure-note {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          font-size: 0.74rem; color: #b0956e; margin-top: 18px;
          padding-top: 16px; border-top: 1px solid rgba(200,135,42,0.1);
        }
      `}</style>
    </div>
  );
};

export default Login;