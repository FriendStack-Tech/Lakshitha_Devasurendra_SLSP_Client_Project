import React from 'react';

const Loader = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      gap: 'var(--spacing-md)',
    }}>
      <div className="spinner"></div>
      <p style={{ color: 'var(--color-gray-500)' }}>Loading...</p>
    </div>
  );
};

export default Loader;