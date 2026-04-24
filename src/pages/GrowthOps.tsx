import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --gold: #D4AF37;
    --gold-light: #E2C860;
    --gold-dark: #B8962A;
    --gold-dim: rgba(212,175,55,0.10);
    --gold-glow: rgba(212,175,55,0.22);
    --gold-border: rgba(212,175,55,0.28);
    --black: #000;
    --surface: #0F0F0F;
    --card: #161616;
    --card-hover: #1C1C1C;
    --border: #222;
    --border-mid: #2E2E2E;
    --white: #FFF;
    --off-white: #F2F0EB;
    --gray: #6B7280;
    --gray-light: #9CA3AF;
    --fh: 'Plus Jakarta Sans', sans-serif;
    --fb: 'Inter', sans-serif;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--black);
    color: var(--off-white);
    font-family: var(--fb);
    font-size: 16px;
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--black); }
  ::-webkit-scrollbar-thumb { background: var(--gold-dark); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--gold); }

  .container {
    max-width: 1140px;
    margin: 0 auto;
    padding: 0 24px;
  }

  /* ── TYPOGRAPHY ── */
  h1, h2, h3, h4 {
    font-family: var(--fh);
    font-weight: 800;
    line-height: 1.15;
    color: var(--white);
  }

  h1 { font-size: clamp(2.4rem, 5vw, 3.8rem); }
  h2 { font-size: clamp(1.8rem, 3.5vw, 2.8rem); }
  h3 { font-size: clamp(1.2rem, 2vw, 1.5rem); }

  p { color: var(--gray-light); line-height: 1.8; }

  a { text-decoration: none; color: inherit; }

  /* ── EYEBROW ── */
  .eyebrow {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--fh);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 16px;
  }

  .eline {
    flex: 1;
    height: 1px;
    background: var(--gold-border);
  }

  /* ── BUTTONS ── */
  .btn-gold {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--gold);
    color: var(--black);
    font-family: var(--fh);
    font-weight: 700;
    font-size: 0.9rem;
    letter-spacing: 0.04em;
    padding: 14px 30px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: background 0.2s, transform 0.18s, box-shadow 0.2s;
    text-decoration: none;
  }

  .btn-gold:hover {
    background: var(--gold-light);
    transform: translateY(-2px);
    box-shadow: 0 8px 28px var(--gold-glow);
  }

  .btn-outline {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    color: var(--gold);
    font-family: var(--fh);
    font-weight: 700;
    font-size: 0.9rem;
    letter-spacing: 0.04em;
    padding: 13px 28px;
    border-radius: 6px;
    border: 1.5px solid var(--gold-border);
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, transform 0.18s;
    text-decoration: none;
  }

  .btn-outline:hover {
    border-color: var(--gold);
    background: var(--gold-dim);
    transform: translateY(-2px);
  }

  /* ── SHIMMER ── */
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  .gold-shimmer {
    background: linear-gradient(90deg, var(--gold-dark) 0%, var(--gold-light) 40%, var(--gold) 60%, var(--gold-dark) 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3.5s linear infinite;
  }

  /* ── FADE UP ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── REVEAL ── */
  .reveal, .reveal-left, .reveal-right {
    opacity: 0;
    transition: opacity 0.7s ease, transform 0.7s ease;
  }

  .reveal        { transform: translateY(32px); }
  .reveal-left   { transform: translateX(-40px); }
  .reveal-right  { transform: translateX(40px); }

  .reveal.visible,
  .reveal-left.visible,
  .reveal-right.visible {
    opacity: 1;
    transform: none;
  }

  /* ── NAVBAR ── */
  #navbar {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 1000;
    padding: 20px 0;
    background: transparent;
    transition: background 0.3s, padding 0.3s, border-bottom 0.3s;
    border-bottom: 1px solid transparent;
  }

  #navbar.scrolled {
    background: rgba(0,0,0,0.92);
    backdrop-filter: blur(14px);
    padding: 14px 0;
    border-bottom: 1px solid var(--border);
  }

  .nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1140px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .nav-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }

  .nav-logo img {
    height: 38px;
    width: auto;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 32px;
    list-style: none;
  }

  .nav-links a {
    font-family: var(--fh);
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--gray-light);
    letter-spacing: 0.02em;
    transition: color 0.2s;
    text-decoration: none;
  }

  .nav-links a:hover,
  .nav-links a.active-nav { color: var(--white); }

  .nav-links a.active-nav {
    border-bottom: 2px solid var(--gold);
    padding-bottom: 2px;
  }

  .nav-cta { margin-left: 16px; }

  .hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    cursor: pointer;
    background: none;
    border: none;
    padding: 4px;
  }

  .hamburger span {
    display: block;
    width: 24px;
    height: 2px;
    background: var(--white);
    border-radius: 2px;
    transition: all 0.3s;
  }

  /* ── MOBILE MENU ── */
  #mobileMenu {
    display: none;
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.97);
    z-index: 999;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 28px;
    opacity: 0;
    transition: opacity 0.3s;
  }

  #mobileMenu.open {
    display: flex;
    opacity: 1;
  }

  #mobileMenu a {
    font-family: var(--fh);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--white);
    text-decoration: none;
    transition: color 0.2s;
  }

  #mobileMenu a:hover { color: var(--gold); }

  #mobileMenu .mob-close {
    position: absolute;
    top: 22px; right: 24px;
    background: none;
    border: none;
    color: var(--white);
    font-size: 2rem;
    cursor: pointer;
    line-height: 1;
  }

  @media (max-width: 768px) {
    .nav-links, .nav-cta { display: none; }
    .hamburger { display: flex; }
  }

  /* ── PAGE HERO ── */
  .page-hero {
    min-height: 60vh;
    display: flex;
    align-items: center;
    background: var(--black);
    padding: 140px 0 90px;
    position: relative;
    overflow: hidden;
  }

  .page-hero::before {
    content: '';
    position: absolute;
    top: -120px; left: 50%;
    transform: translateX(-50%);
    width: 700px;
    height: 700px;
    background: radial-gradient(ellipse at center, rgba(212,175,55,0.07) 0%, transparent 70%);
    pointer-events: none;
  }

  .page-hero-inner {
    position: relative;
    z-index: 1;
    max-width: 760px;
  }

  .page-hero h1 {
    margin-bottom: 22px;
    animation: fadeUp 0.8s ease both;
    animation-delay: 0.1s;
  }

  .page-hero-sub {
    font-size: clamp(1rem, 2vw, 1.2rem);
    color: var(--gray-light);
    max-width: 580px;
    animation: fadeUp 0.8s ease both;
    animation-delay: 0.25s;
    margin-bottom: 28px;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.84rem;
    color: var(--gray);
    font-family: var(--fh);
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s;
    animation: fadeUp 0.8s ease both;
    animation-delay: 0.4s;
  }

  .back-link:hover { color: var(--gold); }

  /* ── WHAT IT IS ── */
  .what-it-is {
    background: var(--surface);
    padding: 80px 0;
  }

  .two-col-60-40 {
    display: grid;
    grid-template-columns: 60fr 40fr;
    gap: 64px;
    align-items: start;
  }

  .what-it-is h2 {
    margin-bottom: 20px;
  }

  .what-it-is p + p {
    margin-top: 14px;
  }

  .pricing-model-card {
    background: var(--card);
    border: 1.5px solid var(--gold-border);
    border-radius: 10px;
    padding: 32px;
  }

  .pricing-model-card .pm-eyebrow {
    font-family: var(--fh);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 24px;
  }

  .pm-row {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 18px 0;
  }

  .pm-row:first-of-type { padding-top: 0; }
  .pm-row:last-of-type { padding-bottom: 0; }

  .pm-row + .pm-row {
    border-top: 1px solid var(--border-mid);
  }

  .pm-label {
    font-family: var(--fh);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--gray);
  }

  .pm-value {
    font-family: var(--fh);
    font-size: 2.4rem;
    font-weight: 800;
    color: var(--gold);
    line-height: 1.1;
  }

  .pm-sub {
    font-size: 0.82rem;
    color: var(--gray);
    font-family: var(--fb);
  }

  .pm-note {
    margin-top: 22px;
    font-size: 0.8rem;
    color: var(--gray);
    font-style: italic;
    line-height: 1.6;
    border-top: 1px solid var(--border);
    padding-top: 18px;
  }

  @media (max-width: 900px) {
    .two-col-60-40 {
      grid-template-columns: 1fr;
      gap: 40px;
    }
  }

  /* ── WHAT'S INCLUDED ── */
  .whats-included {
    background: var(--black);
    padding: 80px 0;
  }

  .section-center-header {
    text-align: center;
    margin-bottom: 52px;
  }

  .section-center-header .eyebrow {
    justify-content: center;
  }

  .section-center-header .eyebrow .eline {
    display: none;
  }

  .section-center-header h2 {
    margin-top: 10px;
  }

  .features-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .feature-item {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 18px 20px;
    transition: background 0.2s, border-color 0.2s;
  }

  .feature-item:hover {
    background: var(--card-hover);
    border-color: var(--gold-border);
  }

  .feature-check {
    flex-shrink: 0;
    color: var(--gold);
    font-size: 1rem;
    margin-top: 2px;
  }

  .feature-text {
    font-family: var(--fb);
    font-size: 0.92rem;
    color: var(--off-white);
    line-height: 1.5;
  }

  @media (max-width: 700px) {
    .features-grid {
      grid-template-columns: 1fr;
    }
  }

  /* ── WHO IT'S FOR ── */
  .who-its-for {
    background: var(--surface);
    padding: 80px 0;
  }

  .two-col-50-50 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: start;
  }

  .who-its-for h2 {
    margin-bottom: 20px;
  }

  .who-its-for p {
    margin-top: 14px;
  }

  .who-its-for p:first-of-type {
    margin-top: 0;
  }

  .quote-card {
    background: var(--card);
    border-left: 4px solid var(--gold);
    border-radius: 0 10px 10px 0;
    padding: 32px;
  }

  .quote-mark {
    font-size: 3rem;
    color: var(--gold);
    font-family: Georgia, serif;
    line-height: 1;
    margin-bottom: 12px;
  }

  .quote-body {
    font-style: italic;
    font-size: 1.05rem;
    color: var(--off-white);
    line-height: 1.75;
    margin-bottom: 18px;
  }

  .quote-attr {
    font-family: var(--fh);
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--gold);
    letter-spacing: 0.06em;
  }

  @media (max-width: 860px) {
    .two-col-50-50 {
      grid-template-columns: 1fr;
      gap: 40px;
    }
  }

  /* ── FINAL CTA ── */
  .final-cta {
    background: #0B0800;
    padding: 100px 0;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .final-cta::before {
    content: '';
    position: absolute;
    bottom: -100px; left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 400px;
    background: radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  .final-cta h2 {
    margin-bottom: 18px;
    position: relative;
    z-index: 1;
  }

  .final-cta p {
    max-width: 520px;
    margin: 0 auto 36px;
    font-size: 1rem;
    position: relative;
    z-index: 1;
  }

  .final-cta-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    position: relative;
    z-index: 1;
  }

  .cta-sub {
    font-size: 0.82rem;
    color: var(--gray);
    font-family: var(--fb);
    margin-bottom: 0 !important;
  }

  .cta-sub a {
    color: var(--gold);
    text-decoration: none;
    transition: color 0.2s;
  }

  .cta-sub a:hover { color: var(--gold-light); }

  /* ── FOOTER ── */
  footer {
    background: #080808;
    border-top: 1px solid var(--border);
    padding: 64px 0 32px;
  }

  .footer-top {
    display: grid;
    grid-template-columns: 1.8fr 1fr 1fr;
    gap: 48px;
    margin-bottom: 48px;
  }

  .footer-brand img {
    height: 36px;
    width: auto;
    margin-bottom: 14px;
  }

  .footer-tagline {
    font-size: 0.85rem;
    color: var(--gray);
    line-height: 1.7;
    max-width: 300px;
    margin-bottom: 14px;
  }

  .footer-email a {
    font-size: 0.85rem;
    color: var(--gold);
    text-decoration: none;
    font-family: var(--fh);
    font-weight: 600;
    transition: color 0.2s;
  }

  .footer-email a:hover { color: var(--gold-light); }

  .footer-col-title {
    font-family: var(--fh);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--white);
    margin-bottom: 18px;
  }

  .footer-col ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .footer-col ul li a {
    font-size: 0.86rem;
    color: var(--gray);
    text-decoration: none;
    transition: color 0.2s;
    font-family: var(--fb);
  }

  .footer-col ul li a:hover { color: var(--gold); }

  .footer-bottom {
    border-top: 1px solid var(--border);
    padding-top: 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }

  .footer-copy {
    font-size: 0.78rem;
    color: var(--gray);
  }

  .footer-built {
    font-size: 0.78rem;
    color: var(--gray);
    font-style: italic;
  }

  @media (max-width: 768px) {
    .footer-top {
      grid-template-columns: 1fr;
      gap: 32px;
    }

    .footer-bottom {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;

const SCRIPT = `
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 50));
  window.toggleMenu = function() { document.getElementById('mobileMenu').classList.toggle('open'); }
  document.addEventListener('click', e => {
    const m = document.getElementById('mobileMenu');
    if (m && m.classList.contains('open') && !document.getElementById('navbar').contains(e.target) && !m.contains(e.target)) m.classList.remove('open');
  });
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revObs.observe(el));
`;

const HTML = `
  <!-- NAV -->
  <nav id="navbar">
    <div class="nav-inner">
      <a href="/" class="nav-logo">
        <img src="./TFS-Logo-Transparent.png" alt="TriFactor Scaling" />
      </a>
      <ul class="nav-links">
        <li><a href="/">Overview</a></li>
        <li><a href="/services" class="active-nav">Services</a></li>
        <li><a href="/results">Results</a></li>
        <li><a href="/about">About</a></li>
      </ul>
      <a href="/apply" class="btn-gold nav-cta">Apply Now</a>
      <button class="hamburger" onclick="toggleMenu()" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <!-- MOBILE MENU -->
  <div id="mobileMenu">
    <button class="mob-close" onclick="toggleMenu()" aria-label="Close menu">&#215;</button>
    <a href="/" onclick="toggleMenu()">Overview</a>
    <a href="/services" onclick="toggleMenu()">Services</a>
    <a href="/results" onclick="toggleMenu()">Results</a>
    <a href="/about" onclick="toggleMenu()">About</a>
    <a href="/apply" onclick="toggleMenu()" class="btn-gold" style="margin-top:12px;">Apply Now</a>
  </div>

  <!-- HERO -->
  <section class="page-hero">
    <div class="container">
      <div class="page-hero-inner">
        <div class="eyebrow"><span class="eline"></span>Pillar 02<span class="eline"></span></div>
        <h1>Growth <span class="gold-shimmer">Operations</span></h1>
        <p class="page-hero-sub">The system that runs between 'lead comes in' and 'deal is closed.' Most businesses don't have one.</p>
        <a href="/services" class="back-link">&#8592; Back to Services</a>
      </div>
    </div>
  </section>

  <!-- WHAT IT IS -->
  <section class="what-it-is">
    <div class="container">
      <div class="two-col-60-40">
        <div class="reveal-left">
          <div class="eyebrow">What It Is</div>
          <h2>Most agencies hand you leads and walk away.</h2>
          <p>Most agencies hand you a website or run your ads and walk away. What happens to the leads? Nothing — unless you're following up manually, which means you're slow, inconsistent, and leaking revenue.</p>
          <p>Growth Operations is the connective tissue. It's the automated backend that captures every lead, follows up immediately, nurtures prospects, and keeps your pipeline clean.</p>
        </div>
        <div class="reveal-right">
          <div class="pricing-model-card">
            <div class="pm-eyebrow">Pricing Model</div>
            <div class="pm-row">
              <div class="pm-label">Setup Fee</div>
              <div class="pm-value">$3,000</div>
              <div class="pm-sub">One-time system build</div>
            </div>
            <div class="pm-row">
              <div class="pm-label">Revenue Share</div>
              <div class="pm-value">30%</div>
              <div class="pm-sub">We get paid when you grow</div>
            </div>
            <div class="pm-note">We only win when you win. Revenue share replaces the monthly retainer — no flat fee on top.</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- WHAT'S INCLUDED -->
  <section class="whats-included">
    <div class="container">
      <div class="section-center-header reveal">
        <div class="eyebrow">Full Scope</div>
        <h2>Everything that gets built.</h2>
      </div>
      <div class="features-grid">
        <div class="feature-item reveal">
          <span class="feature-check">&#10022;</span>
          <span class="feature-text">CRM setup and pipeline configuration</span>
        </div>
        <div class="feature-item reveal">
          <span class="feature-check">&#10022;</span>
          <span class="feature-text">Pipeline reporting dashboard</span>
        </div>
        <div class="feature-item reveal">
          <span class="feature-check">&#10022;</span>
          <span class="feature-text">Lead capture, tagging, and routing automation</span>
        </div>
        <div class="feature-item reveal">
          <span class="feature-check">&#10022;</span>
          <span class="feature-text">Lead qualification and scoring automation</span>
        </div>
        <div class="feature-item reveal">
          <span class="feature-check">&#10022;</span>
          <span class="feature-text">Automated follow-up sequences — email and SMS</span>
        </div>
        <div class="feature-item reveal">
          <span class="feature-check">&#10022;</span>
          <span class="feature-text">Internal notifications for hot leads</span>
        </div>
        <div class="feature-item reveal">
          <span class="feature-check">&#10022;</span>
          <span class="feature-text">Appointment booking and confirmation flows</span>
        </div>
        <div class="feature-item reveal">
          <span class="feature-check">&#10022;</span>
          <span class="feature-text">Ongoing system audits and optimization</span>
        </div>
        <div class="feature-item reveal">
          <span class="feature-check">&#10022;</span>
          <span class="feature-text">Re-engagement sequences for cold or stalled leads</span>
        </div>
        <div class="feature-item reveal">
          <span class="feature-check">&#10022;</span>
          <span class="feature-text">Weekly calls for performance review &amp; strategizing</span>
        </div>
        <div class="feature-item reveal">
          <span class="feature-check">&#10022;</span>
          <span class="feature-text">GHL social media tracking and cross-platform posting</span>
        </div>
      </div>
    </div>
  </section>

  <!-- WHO IT'S FOR -->
  <section class="who-its-for">
    <div class="container">
      <div class="two-col-50-50">
        <div class="reveal-left">
          <div class="eyebrow">Who It's For</div>
          <h2>Any business generating leads but losing them.</h2>
          <p>If you're manually following up, forgetting prospects, or have no clear picture of what's happening in your pipeline — Growth Ops is the fix.</p>
          <p>Speed to lead wins. The business that responds first, follows up automatically, and stays in front of prospects consistently closes more deals. That's what this builds.</p>
        </div>
        <div class="reveal-right">
          <div class="quote-card">
            <div class="quote-mark">&#8220;</div>
            <p class="quote-body">Most agencies build you a website or run ads and leave you to figure out what happens next. Growth Ops is what happens next.</p>
            <div class="quote-attr">— TriFactor Scaling</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FINAL CTA -->
  <section class="final-cta">
    <div class="container">
      <div class="reveal">
        <h2>Ready to stop losing leads?<br /><span class="gold-shimmer">Let's build the system.</span></h2>
        <p>Book a free Growth Audit. We'll map your current pipeline, show you exactly where you're leaking revenue, and tell you how Growth Ops fixes it.</p>
        <div class="final-cta-actions">
          <a href="/apply" class="btn-gold">Book Your Free Audit &#8594;</a>
          <p class="cta-sub">Or email <a href="mailto:contact@trifactorscaling.com">contact@trifactorscaling.com</a></p>
        </div>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer>
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <img src="./TFS-Logo-Transparent.png" alt="TriFactor Scaling" />
          <p class="footer-tagline">Growth Operations Agency. We install automated revenue systems into local service businesses — built once, running forever.</p>
          <div class="footer-email"><a href="mailto:contact@trifactorscaling.com">contact@trifactorscaling.com</a></div>
        </div>
        <div class="footer-col">
          <div class="footer-col-title">Pages</div>
          <ul>
            <li><a href="/">Overview</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/results">Results</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/apply">Apply Now</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <div class="footer-col-title">Work With Us</div>
          <ul>
            <li><a href="/apply">Apply for Growth Ops</a></li>
            <li><a href="/results">See Client Results</a></li>
            <li><a href="/services">What We Build</a></li>
            <li><a href="mailto:contact@trifactorscaling.com">Send Us an Email</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span class="footer-copy">&#169; 2026 TriFactor Scaling. All rights reserved.</span>
        
      </div>
    </div>
  </footer>
`;

export default function GrowthOps() {
  const navigate = useNavigate();
  const styleRef = useRef<HTMLStyleElement | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Inject styles
    const styleEl = document.createElement("style");
    styleEl.setAttribute("data-tri-page", "tri-growth-ops");
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);
    styleRef.current = styleEl;

    // Inject script after paint
    const timer = setTimeout(() => {
      const scriptEl = document.createElement("script");
      scriptEl.setAttribute("data-tri-page", "tri-growth-ops");
      scriptEl.textContent = SCRIPT;
      document.body.appendChild(scriptEl);
      scriptRef.current = scriptEl;
    }, 0);

    // SPA click handler
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      if (
        href.startsWith("/") &&
        !href.startsWith("//") &&
        !anchor.hasAttribute("target") &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        e.preventDefault();
        navigate(href);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClick);
      if (styleRef.current) styleRef.current.remove();
      if (scriptRef.current) scriptRef.current.remove();
    };
  }, [navigate]);

  return (
    <div
      data-tri-page="tri-growth-ops"
      className="tri-growth-ops tri-page-fade"
      dangerouslySetInnerHTML={{ __html: HTML }}
    />
  );
}
