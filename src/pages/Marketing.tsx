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

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

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

  .nav-logo img { height: 38px; width: auto; }

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

  #mobileMenu.open { display: flex; opacity: 1; }

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

  .what-it-is h2 { margin-bottom: 20px; }
  .what-it-is p + p { margin-top: 14px; }

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
  .pm-row + .pm-row { border-top: 1px solid var(--border-mid); }

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
    .two-col-60-40 { grid-template-columns: 1fr; gap: 40px; }
  }

  .platforms {
    background: var(--black);
    padding: 80px 0;
  }

  .section-center-header {
    text-align: center;
    margin-bottom: 52px;
  }

  .section-center-header .eyebrow { justify-content: center; }
  .section-center-header .eyebrow .eline { display: none; }
  .section-center-header h2 { margin-top: 10px; }

  .platform-card-wrap {
    display: flex;
    justify-content: center;
  }

  .platform-card {
    background: var(--card);
    border: 1.5px solid var(--gold-border);
    border-radius: 10px;
    padding: 40px 44px;
    max-width: 500px;
    width: 100%;
  }

  .platform-card h3 {
    font-family: var(--fh);
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--white);
    margin-bottom: 14px;
  }

  .platform-card p {
    font-size: 0.95rem;
    color: var(--gray-light);
    line-height: 1.75;
  }

  .whats-included {
    background: var(--surface);
    padding: 80px 0;
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
    .features-grid { grid-template-columns: 1fr; }
  }

  .why-revenue-share {
    background: var(--black);
    padding: 80px 0;
  }

  .centered-content {
    max-width: 720px;
    margin: 0 auto;
    text-align: center;
  }

  .centered-content h2 { margin-bottom: 20px; }

  .centered-content p {
    font-size: 1rem;
    line-height: 1.8;
    color: var(--gray-light);
  }

  .stat-cards-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    margin-top: 52px;
  }

  .stat-card {
    background: var(--card);
    border-top: 2px solid var(--gold);
    border-radius: 8px;
    padding: 28px 24px;
    text-align: center;
    transition: background 0.2s;
  }

  .stat-card:hover { background: var(--card-hover); }

  .stat-card-value {
    font-family: var(--fh);
    font-size: 2.6rem;
    font-weight: 800;
    color: var(--gold);
    line-height: 1.1;
    margin-bottom: 8px;
  }

  .stat-card-label {
    font-family: var(--fb);
    font-size: 0.88rem;
    color: var(--gray-light);
    line-height: 1.5;
  }

  @media (max-width: 680px) {
    .stat-cards-row { grid-template-columns: 1fr; }
  }

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

  .final-cta h2 { margin-bottom: 18px; position: relative; z-index: 1; }

  .final-cta p {
    max-width: 560px;
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

  .cta-sub a { color: var(--gold); text-decoration: none; transition: color 0.2s; }
  .cta-sub a:hover { color: var(--gold-light); }

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

  .footer-brand img { height: 36px; width: auto; margin-bottom: 14px; }

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

  .footer-copy { font-size: 0.78rem; color: var(--gray); }

  @media (max-width: 768px) {
    .footer-top { grid-template-columns: 1fr; gap: 32px; }
    .footer-bottom { flex-direction: column; align-items: flex-start; }
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
        <div class="eyebrow"><span class="eline"></span>Pillar 03<span class="eline"></span></div>
        <h1><span class="gold-shimmer">Marketing</span></h1>
        <p class="page-hero-sub">Traffic on demand. Poured into a system that's already built and ready for it.</p>
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
          <h2>We only run ads when your infrastructure is ready.</h2>
          <p>Once your website converts and your backend captures leads, Marketing pours fuel on the system. We run paid advertising on Meta (Facebook and Instagram) and TikTok, supported by an organic content strategy that builds presence between campaigns.</p>
          <p>We only run ads when your infrastructure is ready — because ads into a broken system waste your money and our reputation.</p>
        </div>
        <div class="reveal-right">
          <div class="pricing-model-card">
            <div class="pm-eyebrow">Pricing Model</div>
            <div class="pm-row">
              <div class="pm-label">Setup Fee</div>
              <div class="pm-value">$1,500</div>
              <div class="pm-sub">Campaign buildout &amp; launch</div>
            </div>
            <div class="pm-row">
              <div class="pm-label">Revenue Share</div>
              <div class="pm-value">10%</div>
              <div class="pm-sub">From profit generated from ads</div>
            </div>
            <div class="pm-note">Our incentive is your result. We don't get paid unless your marketing performs.</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- PLATFORMS -->
  <section class="platforms">
    <div class="container">
      <div class="section-center-header reveal">
        <div class="eyebrow">Platforms</div>
        <h2>Where we run your ads.</h2>
      </div>
      <div class="platform-card-wrap reveal">
        <div class="platform-card">
          <h3>Social Media Ads</h3>
          <p>Ads will be placed on each social media platform that you specify — Meta (Facebook &amp; Instagram), TikTok, and others as your strategy grows.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- WHAT'S INCLUDED -->
  <section class="whats-included">
    <div class="container">
      <div class="section-center-header reveal">
        <div class="eyebrow">Full Scope</div>
        <h2>Everything that gets managed.</h2>
      </div>
      <div class="features-grid">
        <div class="feature-item reveal">
          <span class="feature-check">&#10022;</span>
          <span class="feature-text">Creative strategy and ad copy development</span>
        </div>
        <div class="feature-item reveal">
          <span class="feature-check">&#10022;</span>
          <span class="feature-text">Retargeting sequence setup</span>
        </div>
        <div class="feature-item reveal">
          <span class="feature-check">&#10022;</span>
          <span class="feature-text">Audience research and targeting buildout</span>
        </div>
        <div class="feature-item reveal">
          <span class="feature-check">&#10022;</span>
          <span class="feature-text">Organic content strategy and posting cadence</span>
        </div>
        <div class="feature-item reveal">
          <span class="feature-check">&#10022;</span>
          <span class="feature-text">Full campaign setup and launch</span>
        </div>
        <div class="feature-item reveal">
          <span class="feature-check">&#10022;</span>
          <span class="feature-text">Monthly reporting — spend, leads, cost per lead, ROI</span>
        </div>
        <div class="feature-item reveal">
          <span class="feature-check">&#10022;</span>
          <span class="feature-text">Weekly performance monitoring and optimization</span>
        </div>
        <div class="feature-item reveal">
          <span class="feature-check">&#10022;</span>
          <span class="feature-text">Creative refresh and A/B testing as campaigns mature</span>
        </div>
      </div>
    </div>
  </section>

  <!-- WHY REVENUE SHARE -->
  <section class="why-revenue-share">
    <div class="container">
      <div class="centered-content reveal">
        <div class="eyebrow" style="justify-content:center;">Why Revenue Share</div>
        <h2>We don't get paid unless your marketing performs.</h2>
        <p>That alignment means every decision we make — every audience we test, every creative we run, every dollar of your ad budget — is optimized for your revenue. Not impressions. Not clicks. Revenue.</p>
      </div>
      <div class="stat-cards-row">
        <div class="stat-card reveal">
          <div class="stat-card-value">$1,500</div>
          <div class="stat-card-label">One-time setup fee</div>
        </div>
        <div class="stat-card reveal">
          <div class="stat-card-value">10%</div>
          <div class="stat-card-label">Revenue share from ad profit</div>
        </div>
        <div class="stat-card reveal">
          <div class="stat-card-value">0</div>
          <div class="stat-card-label">Flat monthly retainer</div>
        </div>
      </div>
    </div>
  </section>

  <!-- FINAL CTA -->
  <section class="final-cta">
    <div class="container">
      <div class="reveal">
        <h2>Ready to pour fuel<br /><span class="gold-shimmer">on your pipeline?</span></h2>
        <p>Book a free Growth Audit. We'll confirm your infrastructure is ready, then build campaigns that send qualified leads directly into your system.</p>
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

export default function Marketing() {
  const navigate = useNavigate();
  const styleRef = useRef<HTMLStyleElement | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.setAttribute("data-tri-page", "tri-marketing");
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);
    styleRef.current = styleEl;

    const timer = setTimeout(() => {
      const scriptEl = document.createElement("script");
      scriptEl.setAttribute("data-tri-page", "tri-marketing");
      scriptEl.textContent = SCRIPT;
      document.body.appendChild(scriptEl);
      scriptRef.current = scriptEl;
    }, 0);

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
      delete (window as any).toggleMenu;
      document.body.style.overflow = "";
    };
  }, [navigate]);

  return (
    <div
      data-tri-page="tri-marketing"
      className="tri-marketing tri-page-fade"
      dangerouslySetInnerHTML={{ __html: HTML }}
    />
  );
}
