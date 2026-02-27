import React from 'react';
import { motion } from 'framer-motion';

/**
 * Loader — three variants:
 *   "page"    full-screen overlay (default, used in DashboardPage auth check)
 *   "section" centered block that fills its container (used in ShopPage grid area)
 *   "inline"  compact spinner (for buttons, small areas)
 *
 * Usage:
 *   <Loader />                          → page variant, no message
 *   <Loader message="Loading spices…" /> → page variant with message
 *   <Loader variant="section" message="Loading products…" />
 *   <Loader variant="inline" />
 */

const SPICE_ICONS = ['🌶', '🫙', '🌿', '🌰', '🧂'];

const Loader = ({ message, variant = 'page' }) => {
  /* ── Inline ── */
  if (variant === 'inline') {
    return (
      <>
        <span className="ld-inline" aria-label="Loading" />
        <style>{inlineCSS}</style>
      </>
    );
  }

  /* ── Section / Page ── */
  const isPage = variant === 'page';

  return (
    <div className={`ld ld--${variant}`} role="status" aria-live="polite">

      {/* Ambient glow rings */}
      <div className="ld__glow-ring ld__glow-ring--1" />
      <div className="ld__glow-ring ld__glow-ring--2" />

      {/* Central mortar-and-pestle inspired spinner */}
      <div className="ld__core">

        {/* Outer orbit track */}
        <div className="ld__orbit-track" />

        {/* Orbiting spice dots */}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            className="ld__orbit-dot"
            style={{ '--i': i, '--total': 6 }}
          />
        ))}

        {/* Inner pulsing circle */}
        <div className="ld__inner-pulse">
          <div className="ld__inner-pulse-ring" />
          {/* Spice icon cycling */}
          <div className="ld__spice-cycle">
            {SPICE_ICONS.map((icon, i) => (
              <span
                key={i}
                className="ld__spice-icon"
                style={{ '--idx': i, '--total': SPICE_ICONS.length }}
                aria-hidden="true"
              >
                {icon}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Text */}
      <div className="ld__text">
        {message ? (
          <p className="ld__message">{message}</p>
        ) : (
          <p className="ld__message">Loading<span className="ld__dots"><span>.</span><span>.</span><span>.</span></span></p>
        )}
        {isPage && <p className="ld__sub">Preparing your experience</p>}
      </div>

      {/* Shimmer bar */}
      <div className="ld__shimmer-bar">
        <div className="ld__shimmer-fill" />
      </div>

      <style>{css}</style>
    </div>
  );
};

/* ─────────────────────────────────────
   Styles
───────────────────────────────────── */
const css = `
  :root {
    --ld-amber:    #C8872A;
    --ld-amber-d:  #A06820;
    --ld-amber-l:  #F5A94A;
    --ld-amber-xl: #fde8bf;
    --ld-dark:     #1A1208;
    --ld-bg:       #f9f4ec;
  }

  /* ── Wrapper ── */
  .ld {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 28px;
    font-family: Georgia, serif;
    position: relative;
    overflow: hidden;
  }

  .ld--page {
    position: fixed;
    inset: 0;
    background: var(--ld-bg);
    z-index: 9999;
  }

  .ld--section {
    min-height: 320px;
    width: 100%;
    padding: 60px 20px;
  }

  /* ── Glow rings (page only) ── */
  .ld__glow-ring {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    opacity: 0;
    animation: ld-glow-pulse 3s ease-in-out infinite;
  }
  .ld__glow-ring--1 {
    width: 480px; height: 480px;
    background: radial-gradient(circle, rgba(200,135,42,0.12) 0%, transparent 70%);
    animation-delay: 0s;
    opacity: 1;
  }
  .ld__glow-ring--2 {
    width: 320px; height: 320px;
    background: radial-gradient(circle, rgba(245,169,74,0.1) 0%, transparent 70%);
    animation-delay: 1.5s;
    opacity: 1;
  }
  @keyframes ld-glow-pulse {
    0%, 100% { transform: scale(1);   opacity: 0.6; }
    50%       { transform: scale(1.2); opacity: 1;   }
  }

  /* ── Core spinner ── */
  .ld__core {
    position: relative;
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .ld__orbit-track {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1.5px dashed rgba(200,135,42,0.25);
    animation: ld-track-rotate 20s linear infinite;
  }
  @keyframes ld-track-rotate {
    to { transform: rotate(360deg); }
  }

  /* Orbiting dots */
  .ld__orbit-dot {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--ld-amber);
    top: 50%;
    left: 50%;
    margin: -4px 0 0 -4px;
    transform-origin: 0 0;
    animation: ld-orbit var(--duration, 2.4s) linear infinite;
    --angle: calc(360deg / var(--total) * var(--i));
    --duration: 2.4s;
    --radius: 54px;
    opacity: calc(0.35 + 0.65 * (var(--i) / var(--total)));
    transform:
      rotate(calc(var(--angle) + 0deg))
      translateX(var(--radius));
  }

  /* Each dot gets slightly different timing */
  .ld__orbit-dot:nth-child(2)  { --duration: 2.4s; --radius: 54px; width: 10px; height: 10px; background: var(--ld-amber-l); }
  .ld__orbit-dot:nth-child(3)  { --duration: 2.4s; --radius: 54px; }
  .ld__orbit-dot:nth-child(4)  { --duration: 2.4s; --radius: 54px; width: 6px; height: 6px; background: var(--ld-amber-d); }
  .ld__orbit-dot:nth-child(5)  { --duration: 2.4s; --radius: 54px; }
  .ld__orbit-dot:nth-child(6)  { --duration: 2.4s; --radius: 54px; width: 7px; height: 7px; }
  .ld__orbit-dot:nth-child(7)  { --duration: 2.4s; --radius: 54px; width: 5px; height: 5px; background: var(--ld-amber-xl); }

  @keyframes ld-orbit {
    from { transform: rotate(calc(var(--angle)))       translateX(var(--radius)); }
    to   { transform: rotate(calc(var(--angle) + 360deg)) translateX(var(--radius)); }
  }

  /* ── Inner pulse circle ── */
  .ld__inner-pulse {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: linear-gradient(135deg, #fff8ee, #fdf3e3);
    border: 2px solid rgba(200,135,42,0.2);
    box-shadow:
      0 0 0 6px rgba(200,135,42,0.06),
      0 4px 24px rgba(200,135,42,0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    animation: ld-inner-breathe 2s ease-in-out infinite;
    overflow: hidden;
  }
  @keyframes ld-inner-breathe {
    0%, 100% { transform: scale(1);    box-shadow: 0 0 0 6px rgba(200,135,42,0.06), 0 4px 24px rgba(200,135,42,0.18); }
    50%       { transform: scale(1.06); box-shadow: 0 0 0 10px rgba(200,135,42,0.1), 0 8px 32px rgba(200,135,42,0.28); }
  }

  .ld__inner-pulse-ring {
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: var(--ld-amber);
    border-right-color: rgba(200,135,42,0.4);
    animation: ld-ring-spin 1.2s linear infinite;
  }
  @keyframes ld-ring-spin {
    to { transform: rotate(360deg); }
  }

  /* ── Spice icon cycling ── */
  .ld__spice-cycle {
    position: relative;
    width: 32px;
    height: 32px;
  }
  .ld__spice-icon {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    line-height: 1;
    opacity: 0;
    transform: scale(0.6) rotate(-15deg);
    animation: ld-icon-cycle calc(var(--total) * 0.8s) ease-in-out infinite;
    animation-delay: calc(var(--idx) * 0.8s);
  }
  @keyframes ld-icon-cycle {
    0%                             { opacity: 0; transform: scale(0.5) rotate(-20deg); }
    10%                            { opacity: 1; transform: scale(1)   rotate(0deg);   }
    /* hold visible for 1 slot */
    calc(100% / var(--total))      { opacity: 1; transform: scale(1)   rotate(0deg);   }
    calc(100% / var(--total) + 10%){ opacity: 0; transform: scale(0.5) rotate(20deg);  }
    100%                           { opacity: 0; }
  }

  /* ── Text ── */
  .ld__text {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }
  .ld__message {
    font-family: Georgia, serif;
    font-size: 1.05rem;
    color: var(--ld-dark);
    margin: 0;
    letter-spacing: 0.3px;
    display: flex;
    align-items: center;
    gap: 1px;
  }
  .ld__sub {
    font-family: sans-serif;
    font-size: 0.75rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--ld-amber);
    margin: 0;
    font-weight: 600;
  }
  .ld__dots span {
    display: inline-block;
    animation: ld-dot-bounce 1.4s ease-in-out infinite;
    color: var(--ld-amber);
    font-weight: 900;
  }
  .ld__dots span:nth-child(2) { animation-delay: 0.2s; }
  .ld__dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes ld-dot-bounce {
    0%, 80%, 100% { transform: translateY(0);    opacity: 0.4; }
    40%           { transform: translateY(-4px); opacity: 1;   }
  }

  /* ── Shimmer progress bar ── */
  .ld__shimmer-bar {
    width: 160px;
    height: 3px;
    background: rgba(200,135,42,0.15);
    border-radius: 99px;
    overflow: hidden;
  }
  .ld__shimmer-fill {
    height: 100%;
    width: 40%;
    background: linear-gradient(90deg, transparent, var(--ld-amber), var(--ld-amber-l), transparent);
    border-radius: 99px;
    animation: ld-shimmer 1.6s ease-in-out infinite;
  }
  @keyframes ld-shimmer {
    0%   { transform: translateX(-200%); }
    100% { transform: translateX(400%); }
  }

  /* ── Inline variant ── */
  .ld-inline {
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid rgba(200,135,42,0.25);
    border-top-color: var(--ld-amber);
    animation: ld-ring-spin 0.8s linear infinite;
    flex-shrink: 0;
  }
`;

const inlineCSS = `
  .ld-inline {
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid rgba(200,135,42,0.25);
    border-top-color: #C8872A;
    animation: ld-inline-spin 0.8s linear infinite;
    flex-shrink: 0;
  }
  @keyframes ld-inline-spin { to { transform: rotate(360deg); } }
`;

export default Loader;