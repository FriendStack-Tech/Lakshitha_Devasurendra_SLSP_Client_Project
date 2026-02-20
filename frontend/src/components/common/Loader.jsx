import React from 'react';

const Loader = ({ fullScreen = false, message = 'Loading...' }) => {
  return (
    <div className={`ld ${fullScreen ? 'ld--fullscreen' : ''}`}>

      {/* Spice ring animation */}
      <div className="ld__ring-wrap">
        <div className="ld__ring ld__ring--outer" />
        <div className="ld__ring ld__ring--middle" />
        <div className="ld__ring ld__ring--inner" />
        <div className="ld__icon">🌶️</div>
      </div>

      {/* Animated dots */}
      <div className="ld__text">
        <span>{message}</span>
        <span className="ld__dots">
          <span className="ld__dot" />
          <span className="ld__dot" />
          <span className="ld__dot" />
        </span>
      </div>

      <style>{`
        .ld {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: 28px;
          font-family: sans-serif;
        }

        .ld--fullscreen {
          position: fixed;
          inset: 0;
          min-height: 100vh;
          background: rgba(253, 248, 240, 0.92);
          backdrop-filter: blur(8px);
          z-index: 9999;
        }

        /* ── Rings ── */
        .ld__ring-wrap {
          position: relative;
          width: 90px;
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ld__ring {
          position: absolute;
          border-radius: 50%;
          border: 3px solid transparent;
        }

        .ld__ring--outer {
          width: 90px;
          height: 90px;
          border-top-color: #C8872A;
          border-right-color: rgba(200,135,42,0.2);
          border-bottom-color: rgba(200,135,42,0.2);
          border-left-color: rgba(200,135,42,0.2);
          animation: ld-spin 1.1s linear infinite;
        }

        .ld__ring--middle {
          width: 64px;
          height: 64px;
          border-top-color: transparent;
          border-right-color: #F5A94A;
          border-bottom-color: rgba(245,169,74,0.15);
          border-left-color: rgba(245,169,74,0.15);
          animation: ld-spin 0.8s linear infinite reverse;
        }

        .ld__ring--inner {
          width: 40px;
          height: 40px;
          border-bottom-color: #A06820;
          border-top-color: transparent;
          border-left-color: transparent;
          border-right-color: transparent;
          animation: ld-spin 1.4s linear infinite;
        }

        @keyframes ld-spin {
          to { transform: rotate(360deg); }
        }

        .ld__icon {
          font-size: 1.2rem;
          animation: ld-pulse 1.4s ease-in-out infinite;
          position: relative;
          z-index: 1;
        }

        @keyframes ld-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.82); opacity: 0.6; }
        }

        /* ── Text ── */
        .ld__text {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #8a7055;
          letter-spacing: 0.5px;
        }

        .ld__dots {
          display: flex;
          gap: 3px;
          align-items: center;
          margin-left: 2px;
        }

        .ld__dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #C8872A;
          animation: ld-bounce 1.2s ease-in-out infinite;
        }

        .ld__dot:nth-child(1) { animation-delay: 0s; }
        .ld__dot:nth-child(2) { animation-delay: 0.2s; }
        .ld__dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes ld-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Loader;