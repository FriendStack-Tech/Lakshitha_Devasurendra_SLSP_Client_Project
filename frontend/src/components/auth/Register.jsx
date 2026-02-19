import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await registerUser({
      Name: data.name,
      Email: data.email,
      Password: data.password,
      Role: 'Customer'
    });
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
      className="register-container"
    >
      <div className="register-card">
        <div className="register-header">
          <h2>Create Account</h2>
          <p>Join us to start shopping</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <FiUser style={{
                position: 'absolute',
                left: 'var(--spacing-sm)',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-gray-400)',
              }} />
              <input
                type="text"
                className={`form-input ${errors.name ? 'error' : ''}`}
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Enter your full name"
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters'
                  }
                })}
              />
            </div>
            {errors.name && (
              <span className="error-message">{errors.name.message}</span>
            )}
          </div>

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
                placeholder="Create a password"
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

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
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
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Confirm your password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
              />
            </div>
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword.message}</span>
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
              'Creating account...'
            ) : (
              <>
                <FiUserPlus /> Register
              </>
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-accent)' }}>
              Login here
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .register-container {
          min-height: calc(100vh - 70px - 300px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-xl);
        }

        .register-card {
          background: var(--color-white);
          border-radius: var(--radius-xl);
          padding: var(--spacing-2xl);
          box-shadow: var(--shadow-xl);
          width: 100%;
          max-width: 450px;
        }

        .register-header {
          text-align: center;
          margin-bottom: var(--spacing-xl);
        }

        .register-header h2 {
          color: var(--color-secondary);
          margin-bottom: var(--spacing-sm);
        }

        .register-header p {
          color: var(--color-gray-500);
        }

        .register-footer {
          text-align: center;
          margin-top: var(--spacing-xl);
          color: var(--color-gray-600);
        }

        @media (max-width: 480px) {
          .register-card {
            padding: var(--spacing-xl);
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Register;