import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiFacebook, FiInstagram, FiTwitter, FiCheck } from 'react-icons/fi';
import contactHero from '../assets/images/6.jpg';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay },
});

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim()) e.message = 'Message is required';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400)); // simulate request
    setLoading(false);
    setSubmitted(true);
  };

  const contactInfo = [
    {
      icon: <FiMapPin />,
      title: 'Visit Us',
      lines: ['No 686/B, Vihara Mawatha,', 'Ihala Biyanwila, Kadawatha,', 'Western Province, Sri Lanka'],
    },
    {
      icon: <FiPhone />,
      title: 'Call Us',
      lines: ['+94 77 123 4567', '+94 11 234 5678'],
      href: 'tel:+94771234567',
    },
    {
      icon: <FiMail />,
      title: 'Email Us',
      lines: ['Devspices@gmail.com', 'support@devspices.lk'],
      href: 'mailto:Devspices@gmail.com',
    },
    {
      icon: <FiClock />,
      title: 'Business Hours',
      lines: ['Mon – Fri: 9 AM – 6 PM', 'Saturday: 10 AM – 4 PM', 'Sunday: Closed'],
    },
  ];

  const faqs = [
    { q: 'Do you ship internationally?', a: 'Yes! We ship to over 30 countries worldwide. Shipping times vary by destination, typically 7–14 business days.' },
    { q: 'Are your spices organic?', a: 'Our spices are naturally grown using traditional methods with minimal chemical intervention, though not all carry formal organic certification.' },
    { q: 'What is your return policy?', a: 'We offer a 30-day money-back guarantee. If you\'re not satisfied, contact us and we\'ll make it right.' },
    { q: 'How should I store my spices?', a: 'Store in a cool, dry place away from direct sunlight. Airtight containers extend shelf life and preserve aroma.' },
  ];

  return (
    <div className="co">

      {/* ══ HERO ══ */}
      <section className="co__hero">
        <div className="co__hero-img-wrap">
          <img src={contactHero} alt="Contact DevSpices" className="co__hero-img" />
          <div className="co__hero-overlay" />
        </div>
        <div className="co__container co__hero-content">
          <motion.span className="co__eyebrow" {...fadeUp(0)}>✦ We'd Love to Hear From You</motion.span>
          <motion.h1 {...fadeUp(0.12)}>
            Get in <span className="co__accent">Touch</span>
          </motion.h1>
          <motion.p {...fadeUp(0.24)}>
            Whether you have a question about our spices, need help with an order, or simply want to say hello — our team is ready to help.
          </motion.p>
        </div>
      </section>

      {/* ══ CONTACT INFO CARDS ══ */}
      <section className="co__info-section">
        <div className="co__container co__info-grid">
          {contactInfo.map((item, i) => (
            <motion.div key={i} className="co__info-card" {...fadeUp(i * 0.1)} whileHover={{ y: -5 }}>
              <div className="co__info-icon">{item.icon}</div>
              <h4>{item.title}</h4>
              {item.href ? (
                item.lines.map((line, j) => (
                  <a key={j} href={item.href} className="co__info-line co__info-link">{line}</a>
                ))
              ) : (
                item.lines.map((line, j) => <p key={j} className="co__info-line">{line}</p>)
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ FORM + MAP ══ */}
      <section className="co__main">
        <div className="co__container co__main-grid">

          {/* Form */}
          <motion.div
            className="co__form-card"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {submitted ? (
              <div className="co__success">
                <motion.div
                  className="co__success-icon"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <FiCheck />
                </motion.div>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                <button className="co-btn co-btn--primary" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>
                  Send Another
                </button>
              </div>
            ) : (
              <>
                <div className="co__form-head">
                  <span className="co__label">Send a Message</span>
                  <h2>We Reply Within 24 Hours</h2>
                  <p>Fill out the form below and we'll get back to you as soon as possible.</p>
                </div>

                <form className="co__form" onSubmit={handleSubmit} noValidate>
                  <div className="co__form-row">
                    <div className="co__field">
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Kamal Perera"
                        value={form.name}
                        onChange={handleChange}
                        className={errors.name ? 'co__input co__input--err' : 'co__input'}
                      />
                      {errors.name && <span className="co__err">{errors.name}</span>}
                    </div>
                    <div className="co__field">
                      <label>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        className={errors.email ? 'co__input co__input--err' : 'co__input'}
                      />
                      {errors.email && <span className="co__err">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="co__field">
                    <label>Subject</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className={errors.subject ? 'co__input co__input--err' : 'co__input'}
                    >
                      <option value="">Select a topic...</option>
                      <option>Order Inquiry</option>
                      <option>Product Question</option>
                      <option>Shipping & Delivery</option>
                      <option>Returns & Refunds</option>
                      <option>Wholesale / Bulk Order</option>
                      <option>Partnership</option>
                      <option>Other</option>
                    </select>
                    {errors.subject && <span className="co__err">{errors.subject}</span>}
                  </div>

                  <div className="co__field">
                    <label>Your Message</label>
                    <textarea
                      name="message"
                      placeholder="Tell us how we can help..."
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      className={errors.message ? 'co__input co__textarea co__input--err' : 'co__input co__textarea'}
                    />
                    {errors.message && <span className="co__err">{errors.message}</span>}
                  </div>

                  <motion.button
                    type="submit"
                    className="co-btn co-btn--primary co-btn--full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="co__spinner" />
                    ) : (
                      <><FiSend /> Send Message</>
                    )}
                  </motion.button>
                </form>
              </>
            )}
          </motion.div>

          {/* Side panel */}
          <div className="co__side">
            {/* Map embed */}
            <motion.div
              className="co__map-wrap"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <iframe
                title="DevSpices Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.5!2d79.9!3d7.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMDMnMDAuMCJOIDc5wrA1NCcwMC4wIkU!5e0!3m2!1sen!2slk!4v1234567890"
                className="co__map"
                allowFullScreen=""
                loading="lazy"
              />
              <div className="co__map-badge">
                <span>📍</span>
                <div>
                  <strong>DevSpices HQ</strong>
                  <span>Kadawatha, Sri Lanka</span>
                </div>
              </div>
            </motion.div>

            {/* Social links */}
            <motion.div className="co__social-card" {...fadeUp(0.2)}>
              <h4>Follow Us</h4>
              <p>Stay updated with new arrivals and spice tips</p>
              <div className="co__socials">
                {[
                  { icon: <FiFacebook />, label: 'Facebook', color: '#1877f2' },
                  { icon: <FiInstagram />, label: 'Instagram', color: '#e4405f' },
                  { icon: <FiTwitter />, label: 'Twitter', color: '#1da1f2' },
                ].map((s, i) => (
                  <a key={i} href="#" className="co__social-btn" aria-label={s.label}>
                    <span>{s.icon}</span>
                    {s.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="co__faq">
        <div className="co__container">
          <motion.div className="co__section-head" {...fadeUp(0)}>
            <span className="co__label">Quick Answers</span>
            <h2>Frequently Asked Questions</h2>
            <p>Can't find your answer here? Send us a message above.</p>
          </motion.div>
          <div className="co__faq-grid">
            {faqs.map((faq, i) => (
              <motion.div key={i} className="co__faq-card" {...fadeUp(i * 0.1)}>
                <h4>Q: {faq.q}</h4>
                <p>{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .co {
          --amber: #C8872A;
          --amber-d: #A06820;
          --amber-l: #F5A94A;
          --dark: #1A1208;
          --cream: #FDF8F0;
          overflow-x: hidden;
          font-family: sans-serif;
          background: #f9f4ec;
        }
        .co__container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        .co__eyebrow { display: inline-block; font-size: 0.72rem; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.7); font-weight: 600; margin-bottom: 12px; }
        .co__label { display: inline-block; font-size: 0.72rem; letter-spacing: 2.5px; text-transform: uppercase; color: var(--amber); font-weight: 700; margin-bottom: 10px; }
        .co__accent { background: linear-gradient(90deg, #F5A94A, #ffcd7a); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .co__section-head { text-align: center; margin-bottom: 52px; }
        .co__section-head h2 { font-family: Georgia, serif; font-size: clamp(1.7rem, 3.5vw, 2.5rem); color: var(--dark); margin: 6px 0 12px; }
        .co__section-head p { color: #7a6548; font-size: 0.97rem; }

        /* Buttons */
        .co-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 28px; border-radius: 50px; font-size: 0.92rem; font-weight: 700; border: none; cursor: pointer; transition: all 0.22s; font-family: sans-serif; }
        .co-btn--primary { background: linear-gradient(135deg, var(--amber), var(--amber-d)); color: #fff; box-shadow: 0 4px 18px rgba(200,135,42,0.38); }
        .co-btn--primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 26px rgba(200,135,42,0.48); }
        .co-btn--primary:disabled { opacity: 0.8; cursor: not-allowed; }
        .co-btn--full { width: 100%; }

        /* ── Hero ── */
        .co__hero { min-height: 70vh; display: flex; align-items: center; position: relative; overflow: hidden; }
        .co__hero-img-wrap { position: absolute; inset: 0; z-index: 0; }
        .co__hero-img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.48) saturate(1.1); }
        .co__hero-overlay { position: absolute; inset: 0; background: linear-gradient(160deg, rgba(26,18,8,0.72) 0%, rgba(61,43,15,0.42) 70%, rgba(200,135,42,0.1) 100%); }
        .co__hero-content { position: relative; z-index: 2; padding: 100px 24px 70px; }
        .co__hero-content h1 { font-family: Georgia, serif; font-size: clamp(2.2rem, 5.5vw, 4rem); color: #fff; margin: 0 0 18px; max-width: 560px; line-height: 1.15; }
        .co__hero-content p { color: rgba(255,255,255,0.78); font-size: 1.05rem; max-width: 500px; line-height: 1.75; }

        /* ── Info Cards ── */
        .co__info-section { padding: 0; margin-top: -48px; position: relative; z-index: 10; margin-bottom: 0; }
        .co__info-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; padding-bottom: 0; }
        .co__info-card { background: #fff; border-radius: 18px; padding: 28px 20px; text-align: center; border: 1px solid rgba(200,135,42,0.1); box-shadow: 0 8px 30px rgba(26,18,8,0.1); transition: all 0.3s; cursor: default; }
        .co__info-card:hover { box-shadow: 0 16px 44px rgba(26,18,8,0.14); }
        .co__info-icon { width: 52px; height: 52px; background: linear-gradient(135deg, var(--amber), var(--amber-d)); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; margin: 0 auto 14px; box-shadow: 0 6px 18px rgba(200,135,42,0.35); }
        .co__info-card h4 { font-family: Georgia, serif; font-size: 0.95rem; color: var(--dark); margin-bottom: 10px; }
        .co__info-line { display: block; font-size: 0.82rem; color: #7a6548; line-height: 1.65; margin: 0; }
        .co__info-link { text-decoration: none; transition: color 0.2s; }
        .co__info-link:hover { color: var(--amber); }

        /* ── Main Section ── */
        .co__main { padding: 72px 0 80px; }
        .co__main-grid { display: grid; grid-template-columns: 1fr 420px; gap: 32px; align-items: start; }

        /* Form Card */
        .co__form-card { background: #fff; border-radius: 24px; padding: 40px; border: 1px solid rgba(200,135,42,0.1); box-shadow: 0 6px 28px rgba(26,18,8,0.07); }
        .co__form-head { margin-bottom: 28px; }
        .co__form-head h2 { font-family: Georgia, serif; font-size: 1.7rem; color: var(--dark); margin: 6px 0 10px; }
        .co__form-head p { color: #7a6548; font-size: 0.9rem; }
        .co__form { display: flex; flex-direction: column; gap: 18px; }
        .co__form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .co__field { display: flex; flex-direction: column; gap: 6px; }
        .co__field label { font-size: 0.8rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--amber-d); }
        .co__input {
          padding: 12px 16px;
          border: 1.5px solid rgba(200,135,42,0.2);
          border-radius: 12px;
          font-size: 0.92rem;
          color: var(--dark);
          background: #fdf8f0;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: sans-serif;
          width: 100%;
          box-sizing: border-box;
        }
        .co__input:focus { border-color: var(--amber); box-shadow: 0 0 0 3px rgba(200,135,42,0.12); }
        .co__input::placeholder { color: #b5956a; }
        .co__input--err { border-color: #e74c3c; }
        .co__input--err:focus { box-shadow: 0 0 0 3px rgba(231,76,60,0.1); }
        .co__textarea { resize: vertical; min-height: 130px; }
        .co__err { font-size: 0.75rem; color: #e74c3c; font-weight: 600; }

        /* Loading spinner */
        .co__spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: co-spin 0.7s linear infinite; }
        @keyframes co-spin { to { transform: rotate(360deg); } }

        /* Success */
        .co__success { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 40px 20px; gap: 14px; }
        .co__success-icon { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #4caf7d, #3a9468); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; box-shadow: 0 8px 28px rgba(76,175,125,0.4); }
        .co__success h3 { font-family: Georgia, serif; font-size: 1.6rem; color: var(--dark); }
        .co__success p { color: #7a6548; font-size: 0.95rem; line-height: 1.7; max-width: 340px; }

        /* Side panel */
        .co__side { display: flex; flex-direction: column; gap: 20px; }
        .co__map-wrap { position: relative; border-radius: 20px; overflow: hidden; border: 1px solid rgba(200,135,42,0.12); box-shadow: 0 6px 24px rgba(26,18,8,0.1); }
        .co__map { width: 100%; height: 280px; border: none; display: block; filter: saturate(0.85); }
        .co__map-badge { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(26,18,8,0.85); backdrop-filter: blur(8px); padding: 12px 16px; display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: #fff; }
        .co__map-badge strong { display: block; font-weight: 700; font-size: 0.88rem; }
        .co__map-badge span:last-child { color: rgba(255,255,255,0.6); font-size: 0.78rem; }

        .co__social-card { background: #fff; border-radius: 20px; padding: 24px; border: 1px solid rgba(200,135,42,0.1); box-shadow: 0 4px 16px rgba(26,18,8,0.06); }
        .co__social-card h4 { font-family: Georgia, serif; font-size: 1rem; color: var(--dark); margin-bottom: 6px; }
        .co__social-card > p { font-size: 0.83rem; color: #8a7055; margin-bottom: 16px; }
        .co__socials { display: flex; gap: 10px; }
        .co__social-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px; border-radius: 12px; background: #fdf8f0; border: 1px solid rgba(200,135,42,0.15); color: #6b5c44; text-decoration: none; font-size: 0.82rem; font-weight: 600; transition: all 0.2s; }
        .co__social-btn:hover { background: var(--amber); color: #fff; border-color: var(--amber); }

        /* ── FAQ ── */
        .co__faq { padding: 80px 0 100px; background: #fff; }
        .co__faq-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .co__faq-card { background: #fdf8f0; border-radius: 18px; padding: 28px; border: 1px solid rgba(200,135,42,0.1); transition: box-shadow 0.25s; }
        .co__faq-card:hover { box-shadow: 0 10px 30px rgba(26,18,8,0.08); }
        .co__faq-card h4 { font-family: Georgia, serif; font-size: 0.97rem; color: var(--dark); margin-bottom: 10px; line-height: 1.4; }
        .co__faq-card p { font-size: 0.87rem; color: #7a6548; line-height: 1.75; margin: 0; }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .co__info-grid { grid-template-columns: repeat(2, 1fr); }
          .co__main-grid { grid-template-columns: 1fr; }
          .co__side { flex-direction: row; }
          .co__map-wrap { flex: 1; }
          .co__social-card { flex: 1; }
        }
        @media (max-width: 700px) {
          .co__info-grid { grid-template-columns: 1fr 1fr; }
          .co__form-row { grid-template-columns: 1fr; }
          .co__faq-grid { grid-template-columns: 1fr; }
          .co__side { flex-direction: column; }
          .co__info-section { margin-top: -24px; }
          .co__socials { flex-direction: column; }
        }
        @media (max-width: 480px) {
          .co__info-grid { grid-template-columns: 1fr; }
          .co__form-card { padding: 24px 18px; }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;