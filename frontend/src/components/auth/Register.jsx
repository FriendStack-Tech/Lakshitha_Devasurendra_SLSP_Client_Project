import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUser, FiMail, FiLock, FiUserPlus,
  FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle, FiShield
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

/* ── Password strength helper ── */
const getStrength = (pw = '') => {
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0–5
};

const STRENGTH_META = [
  { label: 'Too short',  color: '#EF4444', width: '15%'  },
  { label: 'Weak',       color: '#F59E0B', width: '30%'  },
  { label: 'Fair',       color: '#F59E0B', width: '50%'  },
  { label: 'Good',       color: '#3B82F6', width: '70%'  },
  { label: 'Strong',     color: '#10B981', width: '90%'  },
  { label: 'Very strong',color: '#10B981', width: '100%' },
];

const Register = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading,       setLoading]       = useState(false);
  const [showPass,      setShowPass]      = useState(false);
  const [showConfirm,   setShowConfirm]   = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const password = watch('password', '');
  const strength = getStrength(password);
  const strengthMeta = STRENGTH_META[Math.min(strength, 5)];

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await registerUser({
      Name:     data.name,
      Email:    data.email,
      Password: data.password,
      Role:     'Customer',
    });
    setLoading(false);
    if (result.success) navigate('/dashboard');
  };

  return (
    <div className="rg-root">

      {/* ── Left decorative panel ── */}
      <div className="rg-deco">
        <div className="rg-deco__glow" />
        <div className="rg-deco__pattern" />

        <div className="rg-deco__content">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            <span className="rg-deco__eyebrow">✦ DevSpices</span>
            <h2 className="rg-deco__heading">
              Join the Spice<br />
              <span className="rg-deco__accent">Community</span>
            </h2>
            <p className="rg-deco__sub">
              Create your free account and get access to premium Sri Lankan spices,
              exclusive deals and fast delivery to your doorstep.
            </p>
          </motion.div>

          {/* perks */}
          <motion.div className="rg-deco__perks"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
          >
            {[
              { emoji: '🎁', label: 'Welcome discount on first order'  },
              { emoji: '📦', label: 'Track orders in real-time'         },
              { emoji: '⭐', label: 'Save favourites & wishlists'       },
              { emoji: '🔔', label: 'Exclusive member-only deals'       },
            ].map((p, i) => (
              <motion.div key={i} className="rg-deco__perk"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <span className="rg-deco__perk-ico">{p.emoji}</span>
                <span>{p.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* floating blobs */}
          <div className="rg-deco__blobs" aria-hidden>
            <motion.div className="rg-blob rg-blob--1"
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            >🌿</motion.div>
            <motion.div className="rg-blob rg-blob--2"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            >🌶️</motion.div>
            <motion.div className="rg-blob rg-blob--3"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            >✨</motion.div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="rg-form-panel">
        <motion.div
          className="rg-card"
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 260, damping: 24 }}
        >
          {/* header */}
          <div className="rg-card__head">
            <div className="rg-card__logo">🌶️</div>
            <span className="rg-card__eyebrow">✦ New Account</span>
            <h1 className="rg-card__title">Create your account</h1>
            <p className="rg-card__sub">Free forever · No credit card required</p>
          </div>

          {/* form */}
          <form onSubmit={handleSubmit(onSubmit)} className="rg-form" noValidate>

            {/* Full Name */}
            <div className="rg-field">
              <label className="rg-label">Full Name</label>
              <div className="rg-field__wrap">
                <span className="rg-field__ico"><FiUser /></span>
                <input
                  type="text"
                  placeholder="Kamal Perera"
                  className={`rg-input${errors.name ? ' rg-input--err' : ''}`}
                  autoComplete="name"
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Minimum 2 characters' },
                  })}
                />
              </div>
              <AnimatePresence>
                {errors.name && (
                  <motion.p className="rg-err"
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  >
                    <FiAlertCircle /> {errors.name.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Email */}
            <div className="rg-field">
              <label className="rg-label">Email Address</label>
              <div className="rg-field__wrap">
                <span className="rg-field__ico"><FiMail /></span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`rg-input${errors.email ? ' rg-input--err' : ''}`}
                  autoComplete="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                      message: 'Invalid email address',
                    },
                  })}
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p className="rg-err"
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  >
                    <FiAlertCircle /> {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div className="rg-field">
              <label className="rg-label">Password</label>
              <div className="rg-field__wrap">
                <span className="rg-field__ico"><FiLock /></span>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  className={`rg-input${errors.password ? ' rg-input--err' : ''}`}
                  autoComplete="new-password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' },
                  })}
                />
                <button type="button" className="rg-eye" onClick={() => setShowPass(v => !v)}>
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {/* strength meter — shown when user starts typing */}
              <AnimatePresence>
                {password.length > 0 && (
                  <motion.div className="rg-strength"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="rg-strength__bar-track">
                      <motion.div
                        className="rg-strength__bar-fill"
                        style={{ background: strengthMeta.color }}
                        initial={{ width: '0%' }}
                        animate={{ width: strengthMeta.width }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="rg-strength__label" style={{ color: strengthMeta.color }}>
                      {strengthMeta.label}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {errors.password && (
                  <motion.p className="rg-err"
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  >
                    <FiAlertCircle /> {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Confirm Password */}
            <div className="rg-field">
              <label className="rg-label">Confirm Password</label>
              <div className="rg-field__wrap">
                <span className="rg-field__ico"><FiShield /></span>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  className={`rg-input${errors.confirmPassword ? ' rg-input--err' : ''}`}
                  autoComplete="new-password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: val => val === password || 'Passwords do not match',
                  })}
                />
                <button type="button" className="rg-eye" onClick={() => setShowConfirm(v => !v)}>
                  {showConfirm ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              <AnimatePresence>
                {errors.confirmPassword && (
                  <motion.p className="rg-err"
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  >
                    <FiAlertCircle /> {errors.confirmPassword.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              className="rg-submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02, y: -1 } : {}}
              whileTap={!loading  ? { scale: 0.98 } : {}}
            >
              {loading ? (
                <><span className="rg-spinner" /> Creating account…</>
              ) : (
                <><FiUserPlus /> Create Account</>
              )}
            </motion.button>
          </form>

          {/* divider */}
          <div className="rg-divider"><span>or</span></div>

          {/* login link */}
          <p className="rg-login-link">
            Already have an account? <Link to="/login">Login here</Link>
          </p>

          {/* security note */}
          <div className="rg-secure-note">
            <FiLock /> Your data is protected with 256-bit SSL encryption
          </div>
        </motion.div>
      </div>

      {/* ── Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');

        /* ── Layout ── */
        .rg-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #f9f4ec;
        }

        /* ══ LEFT DECO PANEL ══ */
        .rg-deco {
          flex: 1;
          position: relative;
          background: linear-gradient(135deg, #1A1208 0%, #2E5A4C 55%, #3d6b5a 100%);
          overflow: hidden;
          display: flex;
          align-items: center;
          min-height: 100vh;
        }
        @media (max-width: 860px) { .rg-deco { display: none; } }

        .rg-deco__glow {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse at 30% 50%, rgba(200,135,42,0.25) 0%, transparent 65%);
        }
        .rg-deco__pattern {
          position: absolute; inset: 0; pointer-events: none;
          background-image: repeating-linear-gradient(
            45deg, transparent, transparent 28px,
            rgba(255,255,255,0.025) 28px, rgba(255,255,255,0.025) 29px
          );
        }
        .rg-deco__content {
          position: relative; z-index: 1;
          padding: 60px 52px; width: 100%;
        }
        .rg-deco__eyebrow {
          display: inline-block;
          font-size: 0.7rem; letter-spacing: 3.5px; text-transform: uppercase;
          color: #F5A94A; font-weight: 700; margin-bottom: 18px;
        }
        .rg-deco__heading {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          color: #fff; line-height: 1.2; margin: 0 0 16px;
        }
        .rg-deco__accent { color: #F5A94A; }
        .rg-deco__sub {
          color: rgba(255,255,255,0.5); font-size: 0.93rem;
          line-height: 1.7; max-width: 360px; margin-bottom: 36px;
        }

        /* perks list */
        .rg-deco__perks { display: flex; flex-direction: column; gap: 10px; margin-bottom: 44px; }
        .rg-deco__perk {
          display: inline-flex; align-items: center; gap: 12px;
          background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; padding: 11px 16px; width: fit-content;
          font-size: 0.84rem; color: rgba(255,255,255,0.75); font-weight: 500;
          backdrop-filter: blur(8px);
        }
        .rg-deco__perk-ico { font-size: 1.1rem; flex-shrink: 0; }

        /* floating blobs */
        .rg-deco__blobs { position: absolute; inset: 0; pointer-events: none; }
        .rg-blob { position: absolute; filter: drop-shadow(0 4px 16px rgba(0,0,0,0.25)); opacity: 0.5; }
        .rg-blob--1 { top: 10%;  right: 12%; font-size: 2.6rem; opacity: 0.65; }
        .rg-blob--2 { bottom: 18%; right: 20%; font-size: 2rem; }
        .rg-blob--3 { top: 52%;  right: 7%;  font-size: 1.6rem; }

        /* ══ RIGHT FORM PANEL ══ */
        .rg-form-panel {
          width: 480px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 32px;
          background: #fdf8f0;
          min-height: 100vh;
          overflow-y: auto;
        }
        @media (max-width: 860px) { .rg-form-panel { width: 100%; } }
        @media (max-width: 480px) {
          .rg-form-panel { padding: 28px 18px; align-items: flex-start; padding-top: 40px; }
        }

        /* ── Card ── */
        .rg-card {
          background: #fff; border-radius: 24px; width: 100%;
          padding: 40px 36px;
          border: 1.5px solid rgba(200,135,42,0.12);
          box-shadow: 0 8px 40px rgba(26,18,8,0.09);
        }
        @media (max-width: 480px) { .rg-card { padding: 28px 20px; border-radius: 20px; } }

        /* header */
        .rg-card__head { text-align: center; margin-bottom: 28px; }
        .rg-card__logo {
          font-size: 2.2rem; margin-bottom: 12px; display: block;
          filter: drop-shadow(0 2px 8px rgba(200,135,42,0.28));
        }
        .rg-card__eyebrow {
          display: block; font-size: 0.68rem; letter-spacing: 3px;
          text-transform: uppercase; color: #C8872A; font-weight: 700; margin-bottom: 8px;
        }
        .rg-card__title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.45rem; color: #1A1208; margin: 0 0 5px;
        }
        .rg-card__sub { color: #a08060; font-size: 0.83rem; margin: 0; }

        /* ── Form ── */
        .rg-form { display: flex; flex-direction: column; gap: 18px; }

        .rg-field { display: flex; flex-direction: column; gap: 6px; }
        .rg-label {
          font-size: 0.7rem; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; color: #C8872A;
        }
        .rg-field__wrap { position: relative; display: flex; align-items: center; }
        .rg-field__ico {
          position: absolute; left: 14px; pointer-events: none;
          color: #C8872A; font-size: 0.95rem; display: flex; align-items: center;
        }
        .rg-input {
          width: 100%; box-sizing: border-box;
          padding: 13px 44px 13px 42px;
          border: 1.5px solid rgba(200,135,42,0.2);
          border-radius: 12px; background: #fdf8f0;
          font-size: 0.91rem; color: #1A1208;
          font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color 0.22s, box-shadow 0.22s, background 0.18s;
        }
        .rg-input::placeholder { color: #c0a07a; }
        .rg-input:focus {
          border-color: #C8872A;
          box-shadow: 0 0 0 3.5px rgba(200,135,42,0.12);
          background: #fff;
        }
        .rg-input--err { border-color: #EF4444; background: rgba(239,68,68,0.03); }
        .rg-input--err:focus { border-color: #EF4444; box-shadow: 0 0 0 3px rgba(239,68,68,0.1); }

        .rg-eye {
          position: absolute; right: 13px;
          background: none; border: none; cursor: pointer;
          color: #a08060; font-size: 1rem; padding: 4px;
          display: flex; align-items: center; transition: color 0.2s;
        }
        .rg-eye:hover { color: #C8872A; }

        /* error message */
        .rg-err {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.77rem; color: #EF4444; font-weight: 600; margin: 0;
        }

        /* ── Password strength meter ── */
        .rg-strength {
          display: flex; align-items: center; gap: 10px;
          overflow: hidden;
        }
        .rg-strength__bar-track {
          flex: 1; height: 4px; border-radius: 3px;
          background: rgba(200,135,42,0.12); overflow: hidden;
        }
        .rg-strength__bar-fill { height: 100%; border-radius: 3px; }
        .rg-strength__label {
          font-size: 0.72rem; font-weight: 700; white-space: nowrap;
          min-width: 72px; text-align: right;
        }

        /* ── Submit ── */
        .rg-submit {
          width: 100%; padding: 14px; border-radius: 14px; border: none; cursor: pointer;
          background: linear-gradient(135deg, #2E5A4C, #1e3d33);
          color: #fff; font-size: 0.95rem; font-weight: 800;
          font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 9px;
          box-shadow: 0 6px 22px rgba(46,90,76,0.35);
          letter-spacing: 0.2px; transition: box-shadow 0.2s;
          margin-top: 4px;
        }
        .rg-submit:hover:not(:disabled) { box-shadow: 0 8px 28px rgba(46,90,76,0.5); }
        .rg-submit:disabled { opacity: 0.65; cursor: not-allowed; }

        /* spinner */
        .rg-spinner {
          display: inline-block; width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff;
          border-radius: 50%; animation: rg-spin 0.7s linear infinite;
        }
        @keyframes rg-spin { to { transform: rotate(360deg); } }

        /* ── Divider ── */
        .rg-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 20px 0 14px; color: #c0a07a; font-size: 0.78rem;
        }
        .rg-divider::before, .rg-divider::after {
          content: ''; flex: 1; height: 1px; background: rgba(200,135,42,0.15);
        }

        /* ── Login link ── */
        .rg-login-link {
          text-align: center; font-size: 0.88rem; color: #8a7055; margin: 0;
        }
        .rg-login-link a {
          color: #A06820; font-weight: 700; text-decoration: none; transition: color 0.2s;
        }
        .rg-login-link a:hover { color: #C8872A; text-decoration: underline; }

        /* ── Secure note ── */
        .rg-secure-note {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          font-size: 0.74rem; color: #b0956e; margin-top: 18px;
          padding-top: 16px; border-top: 1px solid rgba(200,135,42,0.1);
        }
      `}</style>
    </div>
  );
};

export default Register;