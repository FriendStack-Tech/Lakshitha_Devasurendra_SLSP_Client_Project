import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await login(data.email, data.password);
    setLoading(false);
    
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="login-container"
    >
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Please login to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{
                position: 'absolute',
                left: 'var(--spacing-sm)',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-gray-400)',
              }} />
              <input
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                    message: 'Invalid email address'
                  }
                })}
              />
            </div>
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{
                position: 'absolute',
                left: 'var(--spacing-sm)',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-gray-400)',
              }} />
              <input
                type="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Enter your password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
              />
            </div>
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              padding: 'var(--spacing-md)',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              'Logging in...'
            ) : (
              <>
                <FiLogIn /> Login
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--color-accent)' }}>
              Register here
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: calc(100vh - 70px - 300px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-xl);
        }

        .login-card {
          background: var(--color-white);
          border-radius: var(--radius-xl);
          padding: var(--spacing-2xl);
          box-shadow: var(--shadow-xl);
          width: 100%;
          max-width: 400px;
        }

        .login-header {
          text-align: center;
          margin-bottom: var(--spacing-xl);
        }

        .login-header h2 {
          color: var(--color-secondary);
          margin-bottom: var(--spacing-sm);
        }

        .login-header p {
          color: var(--color-gray-500);
        }

        .login-footer {
          text-align: center;
          margin-top: var(--spacing-xl);
          color: var(--color-gray-600);
        }

        @media (max-width: 480px) {
          .login-card {
            padding: var(--spacing-xl);
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Login;