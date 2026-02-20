import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAward, FiHeart, FiGlobe, FiUsers, FiArrowRight, FiCheck } from 'react-icons/fi';
import aboutHero from '../assets/images/4.jpg';
import aboutSecondary from '../assets/images/5.jpg';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

const AboutPage = () => {
  const values = [
    { icon: <FiAward />, title: 'Uncompromising Quality', desc: 'Every batch is hand-selected and tested to ensure only the finest spices reach your kitchen.' },
    { icon: <FiHeart />, title: 'Farmer First', desc: 'We pay fair wages and build long-term relationships with Sri Lankan farming families.' },
    { icon: <FiGlobe />, title: 'Sustainable Sourcing', desc: 'Eco-friendly farming practices that protect the land for future generations.' },
    { icon: <FiUsers />, title: 'Community Driven', desc: 'A portion of every sale supports rural farming communities across the island.' },
  ];

  const milestones = [
    { year: '2018', event: 'Founded in Kadawatha with a vision to share Sri Lanka\'s spice heritage' },
    { year: '2019', event: 'Partnered with 12 farming families across the hill country' },
    { year: '2021', event: 'Expanded to worldwide shipping, reaching 30+ countries' },
    { year: '2023', event: 'Launched our signature spice blend collection' },
    { year: '2024', event: 'Crossed 500+ happy customers globally' },
  ];

  const team = [
    { name: 'Kamal Perera', role: 'Founder & CEO', emoji: '👨‍💼' },
    { name: 'Niluka Fernando', role: 'Head of Sourcing', emoji: '👩‍🌾' },
    { name: 'Ruwan Silva', role: 'Quality Assurance', emoji: '👨‍🔬' },
    { name: 'Priya Jayawardena', role: 'Customer Experience', emoji: '👩‍💻' },
  ];

  const stats = [
    { value: '500+', label: 'Happy Customers' },
    { value: '55+', label: 'Spice Varieties' },
    { value: '30+', label: 'Countries Shipped' },
    { value: '12+', label: 'Farm Partners' },
  ];

  return (
    <div className="ab">

      {/* ══ HERO ══ */}
      <section className="ab__hero">
        <div className="ab__hero-img-wrap">
          <img src={aboutHero} alt="Sri Lankan spice farm" className="ab__hero-img" />
          <div className="ab__hero-overlay" />
        </div>
        <div className="ab__container ab__hero-content">
          <motion.span className="ab__eyebrow" {...fadeUp(0)}>✦ Our Story</motion.span>
          <motion.h1 {...fadeUp(0.12)}>
            Passion for Spices,<br />
            Rooted in <span className="ab__accent">Sri Lanka</span>
          </motion.h1>
          <motion.p {...fadeUp(0.24)}>
            From the misty highlands to your kitchen table — we bring you the purest, most aromatic spices the island has to offer.
          </motion.p>
          <motion.div className="ab__hero-btns" {...fadeUp(0.36)}>
            <Link to="/shop" className="ab-btn ab-btn--primary">Shop Our Spices <FiArrowRight /></Link>
            <Link to="/contact" className="ab-btn ab-btn--ghost">Get in Touch</Link>
          </motion.div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section className="ab__stats">
        <div className="ab__container ab__stats-grid">
          {stats.map((s, i) => (
            <motion.div key={i} className="ab__stat" {...fadeUp(i * 0.1)}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ OUR STORY ══ */}
      <section className="ab__story">
        <div className="ab__container ab__story-grid">
          <motion.div className="ab__story-text" {...fadeUp(0)}>
            <span className="ab__label">Who We Are</span>
            <h2>More Than a Spice Shop —<br />A Heritage Brand</h2>
            <p>
              DevSpices was born from a simple belief: that the world deserves to taste Sri Lanka's spices the way they were meant to be experienced — fresh, pure, and full of life.
            </p>
            <p>
              Founded in Kadawatha in 2018, we began by visiting highland farms and coastal villages, building relationships with families who had been cultivating spices for generations. Today, we work with over a dozen partner farms and ship to more than 30 countries.
            </p>
            <p>
              Every jar that leaves our facility carries not just the rich aroma of the island, but the pride and craftsmanship of the people who grew it.
            </p>
            <ul className="ab__story-list">
              {['Direct farm-to-door supply chain', 'Lab-tested for purity and quality', 'No artificial additives or preservatives', 'Eco-friendly packaging'].map((item, i) => (
                <li key={i}><FiCheck className="ab__check" /> {item}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="ab__story-img-wrap"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <img src={aboutSecondary} alt="Spice processing" className="ab__story-img" />
            <div className="ab__story-badge">
              <span className="ab__story-badge-num">6+</span>
              <span>Years of<br />Excellence</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ VALUES ══ */}
      <section className="ab__values">
        <div className="ab__container">
          <motion.div className="ab__section-head" {...fadeUp(0)}>
            <span className="ab__label">What Drives Us</span>
            <h2>Our Core Values</h2>
            <p>The principles behind every spice we source and every relationship we build</p>
          </motion.div>
          <div className="ab__values-grid">
            {values.map((v, i) => (
              <motion.div key={i} className="ab__value-card" {...fadeUp(i * 0.12)} whileHover={{ y: -6 }}>
                <div className="ab__value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TIMELINE ══ */}
      <section className="ab__timeline-section">
        <div className="ab__container">
          <motion.div className="ab__section-head" {...fadeUp(0)}>
            <span className="ab__label">Our Journey</span>
            <h2>How We Got Here</h2>
          </motion.div>
          <div className="ab__timeline">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                className={`ab__timeline-item ${i % 2 === 0 ? 'ab__timeline-item--left' : 'ab__timeline-item--right'}`}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.55 }}
              >
                <div className="ab__timeline-content">
                  <span className="ab__timeline-year">{m.year}</span>
                  <p>{m.event}</p>
                </div>
                <div className="ab__timeline-dot" />
              </motion.div>
            ))}
            <div className="ab__timeline-line" />
          </div>
        </div>
      </section>

      {/* ══ TEAM ══ */}
      <section className="ab__team">
        <div className="ab__container">
          <motion.div className="ab__section-head" {...fadeUp(0)}>
            <span className="ab__label">The People</span>
            <h2>Meet Our Team</h2>
            <p>Passionate individuals united by a love for Sri Lankan culture and quality</p>
          </motion.div>
          <div className="ab__team-grid">
            {team.map((member, i) => (
              <motion.div key={i} className="ab__team-card" {...fadeUp(i * 0.1)} whileHover={{ y: -5 }}>
                <div className="ab__team-avatar">{member.emoji}</div>
                <h4>{member.name}</h4>
                <span>{member.role}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="ab__cta">
        <div className="ab__container ab__cta-inner">
          <motion.div {...fadeUp(0)}>
            <span className="ab__eyebrow ab__eyebrow--light">✦ Let's Connect</span>
            <h2>Ready to Taste the Difference?</h2>
            <p>Join our growing family of spice lovers and discover flavours that tell a story.</p>
            <div className="ab__cta-btns">
              <Link to="/shop" className="ab-btn ab-btn--primary">Browse Collection <FiArrowRight /></Link>
              <Link to="/contact" className="ab-btn ab-btn--ghost">Contact Us</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        .ab {
          --amber: #C8872A;
          --amber-d: #A06820;
          --amber-l: #F5A94A;
          --dark: #1A1208;
          overflow-x: hidden;
          font-family: sans-serif;
        }
        .ab__container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        .ab__eyebrow { display: inline-block; font-size: 0.75rem; letter-spacing: 3px; text-transform: uppercase; color: var(--amber-l); font-weight: 600; margin-bottom: 12px; }
        .ab__eyebrow--light { color: rgba(255,255,255,0.7); }
        .ab__label { display: inline-block; font-size: 0.72rem; letter-spacing: 2.5px; text-transform: uppercase; color: var(--amber); font-weight: 700; margin-bottom: 10px; }
        .ab__accent { background: linear-gradient(90deg, #F5A94A, #ffcd7a); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .ab__section-head { text-align: center; margin-bottom: 56px; }
        .ab__section-head h2 { font-family: Georgia, serif; font-size: clamp(1.8rem, 3.5vw, 2.6rem); color: var(--dark); margin: 6px 0 12px; }
        .ab__section-head p { color: #7a6548; font-size: 1rem; }

        /* Buttons */
        .ab-btn { display: inline-flex; align-items: center; gap: 8px; padding: 13px 28px; border-radius: 50px; font-size: 0.92rem; font-weight: 700; text-decoration: none; transition: all 0.25s; border: none; cursor: pointer; font-family: sans-serif; }
        .ab-btn--primary { background: linear-gradient(135deg, var(--amber), var(--amber-d)); color: #fff; box-shadow: 0 4px 18px rgba(200,135,42,0.4); }
        .ab-btn--primary:hover { transform: translateY(-2px); box-shadow: 0 8px 26px rgba(200,135,42,0.5); }
        .ab-btn--ghost { background: rgba(255,255,255,0.15); color: #fff; border: 1.5px solid rgba(255,255,255,0.45); backdrop-filter: blur(6px); }
        .ab-btn--ghost:hover { background: rgba(255,255,255,0.26); }

        /* ── Hero ── */
        .ab__hero { min-height: 88vh; display: flex; align-items: center; position: relative; overflow: hidden; }
        .ab__hero-img-wrap { position: absolute; inset: 0; z-index: 0; }
        .ab__hero-img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.5) saturate(1.15); }
        .ab__hero-overlay { position: absolute; inset: 0; background: linear-gradient(160deg, rgba(26,18,8,0.7) 0%, rgba(61,43,15,0.45) 70%, rgba(200,135,42,0.12) 100%); }
        .ab__hero-content { position: relative; z-index: 2; padding: 120px 24px 80px; }
        .ab__hero-content h1 { font-family: Georgia, serif; font-size: clamp(2.2rem, 5.5vw, 4rem); color: #fff; line-height: 1.18; margin: 0 0 18px; max-width: 620px; }
        .ab__hero-content p { color: rgba(255,255,255,0.8); font-size: 1.1rem; max-width: 520px; margin-bottom: 36px; line-height: 1.7; }
        .ab__hero-btns { display: flex; gap: 14px; flex-wrap: wrap; }

        /* ── Stats ── */
        .ab__stats { background: var(--dark); padding: 36px 0; }
        .ab__stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); }
        .ab__stat { text-align: center; padding: 24px 12px; border-right: 1px solid rgba(255,255,255,0.08); }
        .ab__stat:last-child { border-right: none; }
        .ab__stat strong { display: block; font-family: Georgia, serif; font-size: 2.2rem; color: var(--amber-l); }
        .ab__stat span { font-size: 0.8rem; letter-spacing: 1px; text-transform: uppercase; color: rgba(255,255,255,0.45); }

        /* ── Story ── */
        .ab__story { padding: 100px 0; background: #FDF8F0; }
        .ab__story-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center; }
        .ab__story-text h2 { font-family: Georgia, serif; font-size: clamp(1.7rem, 3vw, 2.4rem); color: var(--dark); margin: 8px 0 20px; line-height: 1.25; }
        .ab__story-text p { color: #6b5c44; line-height: 1.8; margin-bottom: 16px; font-size: 0.97rem; }
        .ab__story-list { list-style: none; padding: 0; margin-top: 24px; display: flex; flex-direction: column; gap: 10px; }
        .ab__story-list li { display: flex; align-items: center; gap: 10px; font-size: 0.9rem; color: #5a4a32; font-weight: 500; }
        .ab__check { color: var(--amber); flex-shrink: 0; }
        .ab__story-img-wrap { position: relative; }
        .ab__story-img { width: 100%; height: 500px; object-fit: cover; border-radius: 24px; box-shadow: 0 20px 60px rgba(26,18,8,0.18); }
        .ab__story-badge {
          position: absolute; bottom: -20px; left: -20px;
          background: linear-gradient(135deg, var(--amber), var(--amber-d));
          color: #fff; border-radius: 20px; padding: 20px 24px;
          box-shadow: 0 8px 28px rgba(200,135,42,0.45);
          display: flex; flex-direction: column; align-items: center; text-align: center;
          font-family: sans-serif; font-size: 0.78rem; line-height: 1.4;
        }
        .ab__story-badge-num { font-family: Georgia, serif; font-size: 2rem; font-weight: 800; line-height: 1; }

        /* ── Values ── */
        .ab__values { padding: 100px 0; background: #fff; }
        .ab__values-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; }
        .ab__value-card { background: #FDF8F0; border-radius: 20px; padding: 36px 28px; border: 1px solid rgba(200,135,42,0.1); transition: all 0.3s; cursor: default; }
        .ab__value-card:hover { box-shadow: 0 20px 50px rgba(26,18,8,0.1); }
        .ab__value-icon { width: 60px; height: 60px; background: linear-gradient(135deg, var(--amber), var(--amber-d)); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin-bottom: 20px; box-shadow: 0 6px 20px rgba(200,135,42,0.35); }
        .ab__value-card h3 { font-family: Georgia, serif; font-size: 1.1rem; color: var(--dark); margin-bottom: 10px; }
        .ab__value-card p { font-size: 0.88rem; color: #7a6548; line-height: 1.7; }

        /* ── Timeline ── */
        .ab__timeline-section { padding: 100px 0; background: #FDF8F0; }
        .ab__timeline { position: relative; max-width: 720px; margin: 0 auto; padding: 0 20px; }
        .ab__timeline-line { position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: linear-gradient(180deg, var(--amber), rgba(200,135,42,0.1)); transform: translateX(-50%); }
        .ab__timeline-item { display: flex; align-items: center; margin-bottom: 40px; position: relative; }
        .ab__timeline-item--left { flex-direction: row-reverse; text-align: right; }
        .ab__timeline-item--right { flex-direction: row; text-align: left; }
        .ab__timeline-content { width: calc(50% - 30px); background: #fff; border-radius: 14px; padding: 20px 22px; border: 1px solid rgba(200,135,42,0.12); box-shadow: 0 4px 16px rgba(26,18,8,0.06); }
        .ab__timeline-year { font-family: Georgia, serif; font-size: 1.3rem; font-weight: 800; color: var(--amber); display: block; margin-bottom: 6px; }
        .ab__timeline-content p { font-size: 0.88rem; color: #6b5c44; line-height: 1.6; margin: 0; }
        .ab__timeline-dot { width: 14px; height: 14px; border-radius: 50%; background: var(--amber); border: 3px solid #FDF8F0; box-shadow: 0 0 0 3px rgba(200,135,42,0.3); position: absolute; left: 50%; transform: translateX(-50%); flex-shrink: 0; z-index: 1; }

        /* ── Team ── */
        .ab__team { padding: 100px 0; background: #fff; }
        .ab__team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; }
        .ab__team-card { background: #FDF8F0; border-radius: 20px; padding: 36px 20px; text-align: center; border: 1px solid rgba(200,135,42,0.1); transition: all 0.3s; cursor: default; }
        .ab__team-card:hover { box-shadow: 0 16px 40px rgba(26,18,8,0.1); }
        .ab__team-avatar { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #fdf3e3, #f0d9b0); display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 16px; border: 2px solid rgba(200,135,42,0.2); }
        .ab__team-card h4 { font-family: Georgia, serif; font-size: 1rem; color: var(--dark); margin-bottom: 6px; }
        .ab__team-card span { font-size: 0.78rem; letter-spacing: 1px; text-transform: uppercase; color: var(--amber); font-weight: 600; }

        /* ── CTA ── */
        .ab__cta { background: linear-gradient(135deg, #1A1208 0%, #3D2B0F 60%, #5a3d18 100%); padding: 100px 0; text-align: center; position: relative; overflow: hidden; }
        .ab__cta::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at center, rgba(200,135,42,0.15), transparent 70%); }
        .ab__cta-inner { position: relative; z-index: 1; }
        .ab__cta h2 { font-family: Georgia, serif; font-size: clamp(1.8rem, 4vw, 3rem); color: #fff; margin: 10px 0 16px; }
        .ab__cta p { color: rgba(255,255,255,0.7); font-size: 1rem; margin-bottom: 36px; }
        .ab__cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .ab__story-grid { grid-template-columns: 1fr; gap: 40px; }
          .ab__story-img { height: 340px; }
          .ab__story-badge { left: 12px; bottom: -12px; }
          .ab__stats-grid { grid-template-columns: repeat(2, 1fr); }
          .ab__stat { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.08); }
        }
        @media (max-width: 600px) {
          .ab__timeline-line { left: 16px; }
          .ab__timeline-item, .ab__timeline-item--left { flex-direction: row; text-align: left; }
          .ab__timeline-content { width: calc(100% - 50px); margin-left: 16px; }
          .ab__timeline-dot { left: 16px; }
          .ab__hero-btns { flex-direction: column; }
          .ab__cta-btns { flex-direction: column; align-items: center; }
        }
      `}</style>
    </div>
  );
};

export default AboutPage;