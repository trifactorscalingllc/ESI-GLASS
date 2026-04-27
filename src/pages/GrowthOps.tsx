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

      /* ======================== NAV ======================== */
    #navbar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      padding: 8px 0; border-bottom: 1px solid transparent;
      transition: background 0.3s ease, border-color 0.3s ease, padding 0.3s ease;
    }
    #navbar.scrolled {
      background: rgba(0,0,0,0.94); backdrop-filter: blur(24px);
      border-color: var(--border); padding: 6px 0;
    }
    .nav-inner { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 0; }
    .nav-logo { display: flex; align-items: center; text-decoration: none; }
    .nav-logo img {
      height: 42px; width: auto; object-fit: contain;
      filter: none;
    }
    .nav-links { display: flex; align-items: center; justify-content: center; gap: 36px; list-style: none; }
    .nav-cta-wrap { display: flex; align-items: center; justify-content: flex-end; gap: 12px; }
    .nav-links a {
      font-family: var(--fb); font-size: 0.82rem; font-weight: 500;
      color: var(--gray-light); text-decoration: none;
      transition: color 0.2s ease;
    }
    .nav-links a:hover { color: var(--white); }
    .hamburger {
      display: none; flex-direction: column; gap: 5px;
      background: none; border: none; cursor: pointer; padding: 4px;
    }
    .hamburger span { display: block; width: 22px; height: 1.5px; background: var(--white); transition: all 0.3s; }
    .mobile-menu {
      display: none; position: fixed; top: 61px; left: 0; right: 0;
      background: rgba(0,0,0,0.97); backdrop-filter: blur(24px);
      border-bottom: 1px solid var(--border);
      padding: 20px 28px; z-index: 99; flex-direction: column;
    }
    .mobile-menu.open { display: flex; }
    .mobile-menu a {
      font-family: var(--fb); font-size: 0.95rem; font-weight: 500;
      color: var(--white); text-decoration: none;
      padding: 14px 0; border-bottom: 1px solid var(--border);
    }
    .mobile-menu a:last-child { border-bottom: none; color: var(--gold); padding-top: 18px; }
    @media (max-width: 768px) { .nav-links, .nav-cta { display: none; } .hamburger { display: flex; } }


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

      /* ======================== FOOTER ======================== */
    footer {
      background: var(--black);
      border-top: 1px solid var(--border);
      padding: 80px 0 0;
      position: relative;
      overflow: hidden;
    }

    /* Faded TFS logo watermark */
    .footer-watermark {
      position: absolute;
      right: -40px; bottom: -30px;
      width: 480px; height: auto;
      opacity: 0.03;
      pointer-events: none;
      user-select: none;
      filter: grayscale(1) brightness(8);
    }

    /* Subtle top gradient fade */
    footer::before {
      content: \'\';
      position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent 0%, var(--gold-border) 30%, var(--gold-border) 70%, transparent 100%);
      pointer-events: none;
    }

    .footer-inner { position: relative; z-index: 2; }

    .footer-top {
      display: grid;
      grid-template-columns: 1.4fr 1fr 1fr 1fr;
      gap: 60px;
      align-items: start;
      padding-bottom: 56px;
      border-bottom: 1px solid var(--border);
    }

    .footer-brand {}
    .footer-logo-img { height: 52px; width: auto; margin-bottom: 20px; display: block; }
    .footer-tagline {
      font-size: 0.82rem; color: var(--gray); max-width: 260px;
      line-height: 1.75; margin-bottom: 28px;
    }
    .footer-contact-link {
      display: inline-flex; align-items: center; gap: 8px;
      font-family: var(--fb); font-size: 0.78rem; font-weight: 500;
      color: var(--gray-light); text-decoration: none;
      transition: color 0.2s;
    }
    .footer-contact-link:hover { color: var(--gold); }

    .footer-col-label {
      font-family: var(--fb); font-size: 0.65rem; font-weight: 700;
      letter-spacing: 0.18em; text-transform: uppercase;
      color: var(--gold); margin-bottom: 20px;
    }
    .footer-col-links { display: flex; flex-direction: column; gap: 12px; }
    .footer-col-links a {
      font-family: var(--fb); font-size: 0.82rem; font-weight: 400;
      color: var(--gray-light); text-decoration: none;
      transition: color 0.2s ease;
    }
    .footer-col-links a:hover { color: var(--white); }
    .footer-social-links { display: flex; flex-direction: column; gap: 12px; }
    .footer-social-links a {
      display: flex; align-items: center; gap: 10px;
      font-size: 0.82rem; color: var(--gray); text-decoration: none;
      transition: color 0.2s ease;
    }
    .footer-social-links a:hover { color: var(--gold); }
    .footer-social-icon { width: 16px; height: 16px; flex-shrink: 0; opacity: 0.7; }

    .footer-bottom {
      padding: 22px 0;
      display: flex; justify-content: space-between; align-items: center;
      flex-wrap: wrap; gap: 12px;
    }
    .footer-copy { font-size: 0.73rem; color: var(--gray); }

    @media (max-width: 1024px) {
      .footer-top { grid-template-columns: 1.2fr 1fr 1fr; gap: 40px; }
    }
    @media (max-width: 768px) {
      .footer-top { grid-template-columns: 1fr 1fr; gap: 40px; padding-bottom: 40px; }
      .footer-brand { grid-column: 1 / -1; }
      .footer-bottom { flex-direction: column; align-items: flex-start; gap: 8px; }
    }
    @media (max-width: 600px) {
      .footer-top { grid-template-columns: 1fr; gap: 28px; padding-bottom: 32px; }
      .footer-bottom { flex-direction: column; gap: 8px; align-items: flex-start; }
    }

    
    /* ============================================================
       SMOOTH SCROLL + PERFORMANCE
    ============================================================ */
    html, body {
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;
    }
    #navbar {
      will-change: transform;
      transform: translateZ(0);
    }

    /* ============================================================
       AMBIENT BACKGROUND ANIMATION
       Subtle gold orbs that drift slowly — gives depth without
       being distracting
    ============================================================ */
    @keyframes ambientDrift {
      0%   { transform: translate(0px,   0px)   scale(1);    opacity: 1; }
      33%  { transform: translate(30px, -25px)  scale(1.08); opacity: 0.8; }
      66%  { transform: translate(-20px, 18px)  scale(0.94); opacity: 0.9; }
      100% { transform: translate(0px,   0px)   scale(1);    opacity: 1; }
    }
    @keyframes ambientDriftB {
      0%   { transform: translate(0px,   0px)   scale(1);    opacity: 1; }
      33%  { transform: translate(-25px, 20px)  scale(0.92); opacity: 0.7; }
      66%  { transform: translate(20px, -15px)  scale(1.06); opacity: 0.85; }
      100% { transform: translate(0px,   0px)   scale(1);    opacity: 1; }
    }
    body::before {
      content: '';
      position: fixed;
      top: -20%; left: -10%;
      width: 55vw; height: 55vw;
      background: radial-gradient(ellipse, rgba(212,175,55,0.045) 0%, rgba(212,175,55,0.01) 45%, transparent 70%);
      animation: ambientDrift 18s ease-in-out infinite;
      pointer-events: none;
      z-index: 0;
      will-change: transform;
    }
    body::after {
      content: '';
      position: fixed;
      bottom: -15%; right: -5%;
      width: 45vw; height: 45vw;
      background: radial-gradient(ellipse, rgba(212,175,55,0.03) 0%, rgba(212,175,55,0.008) 45%, transparent 70%);
      animation: ambientDriftB 22s ease-in-out infinite;
      pointer-events: none;
      z-index: 0;
      will-change: transform;
    }

    /* ============================================================
       SECTION FLOW — softer transitions, diagonal breaks
    ============================================================ */
    section {
      position: relative;
      overflow: hidden;
    }
    /* Subtle top fade on every section */
    section::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 120px;
      background: linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%);
      pointer-events: none;
      z-index: 1;
    }
    /* Diagonal bottom-edge divider */
    section::after {
      content: '';
      position: absolute;
      bottom: -1px; left: 0; right: 0;
      height: 60px;
      background: inherit;
      clip-path: polygon(0 100%, 100% 0, 100% 100%);
      pointer-events: none;
      z-index: 2;
    }
    /* Keep content above pseudo-elements */
    section > * { position: relative; z-index: 3; }

    /* Gentle gold shimmer line between sections */
    section + section {
      border-top: none;
    }
    section + section::before {
      background: linear-gradient(to bottom,
        rgba(212,175,55,0.06) 0%,
        rgba(0,0,0,0.45) 30%,
        transparent 100%);
    }

    /* Fade-in stagger for cards/items inside sections */
    @keyframes cardFadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .reveal.visible, .reveal-left.visible, .reveal-right.visible {
      animation: none; /* keep existing transition, don't double-animate */
    }

`;

const SCRIPT = `
  var nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 50), { passive: true });
  window.toggleMenu = function() { document.getElementById('mobileMenu').classList.toggle('open'); }
  document.addEventListener('click', e => {
    const m = document.getElementById('mobileMenu');
    if (m && m.classList.contains('open') && !document.getElementById('navbar').contains(e.target) && !m.contains(e.target)) m.classList.remove('open');
  });
  var revObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); } });
  }, { threshold: 0, rootMargin: "0px 0px 60px 0px" });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revObs.observe(el));

  /* SPA fix: force-reveal elements already in viewport after paint */
  (function(){
    function forceReveal() {
      document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(function(el){
        if (!el.classList.contains('visible')) {
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight + 100) el.classList.add('visible');
        }
      });
    }
    setTimeout(forceReveal, 200);
    setTimeout(forceReveal, 600);
  })();
`;

const HTML = `
  <!-- ======================== NAV ======================== -->
<nav id="navbar">
<div class="container">
<div class="nav-inner">
<a aria-label="TriFactor Scaling" class="nav-logo" href="/">
<img alt="TriFactor Scaling" height="40" src="/TFS-Logo-Transparent.png"/>
</a>
<ul class="nav-links">
<li><a class="nav-link" href="/">Overview</a></li>
<li><a class="nav-link active-nav" href="/services">Services</a></li>
<li><a class="nav-link" href="/results">Results</a></li>
<li><a class="nav-link" href="/about">About</a></li>
</ul>
<div class="nav-cta-wrap">
<a class="btn-gold nav-cta" href="/apply" style="padding:11px 22px;font-size:0.8rem;">Apply Now →</a>
<button aria-label="Menu" class="hamburger" onclick="toggleMenu()">
<span></span><span></span><span></span>
</button>
</div>
</div>
</div>
</nav>
<div class="mobile-menu" id="mobileMenu">
<a href="/" onclick="toggleMenu()">Overview</a>
<a class="active-nav" href="/services" onclick="toggleMenu()">Services</a>
<a href="/results" onclick="toggleMenu()">Results</a>
<a href="/about" onclick="toggleMenu()">About</a>
<a href="/apply" onclick="toggleMenu()">Apply Now →</a>
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

  <!-- ======================== FOOTER ======================== -->
<!-- ======================== FOOTER ======================== -->
<footer>
<img alt="" aria-hidden="true" class="footer-watermark" src="/TFS-Logo-Transparent.png"/>
<div class="container footer-inner">
<div class="footer-top">
<!-- Brand -->
<div class="footer-brand">
<img alt="TriFactor Scaling" class="footer-logo-img" src="/TFS-Logo-Transparent.png"/>
<p class="footer-tagline">We find what's blocking your growth. We build the systems to fix it.</p>
<a class="footer-contact-link" href="mailto:contact@trifactorscaling.com">
            contact@trifactorscaling.com →
          </a>
          <a class="footer-contact-link" href="https://www.linkedin.com/company/trifactor-scaling-llc/" target="_blank" rel="noopener" style="margin-top:6px;">LinkedIn →</a>
</div>
<!-- Pages -->
<div>
<div class="footer-col-label">Pages</div>
<div class="footer-col-links">
<a href="/">Overview</a>
<a href="/services">Services</a>
<a href="/results">Results</a>
<a href="/about">About</a>
<a href="/apply">Apply Now</a>
</div>
</div>
<!-- Work with us -->
<div>
<div class="footer-col-label">Work With Us</div>
<div class="footer-col-links">
<a href="/apply">Apply for Growth Ops</a>
<a href="/results">See Client Results</a>
<a href="/services">What We Build</a>
<a href="mailto:contact@trifactorscaling.com">Send Us an Email</a>
</div>
</div>
<!-- Social -->
<div>
<div class="footer-col-label">Follow Us</div>
<div class="footer-social-links">
<a href="https://www.instagram.com/trifactorscaling" target="_blank" rel="noopener">
<svg class="footer-social-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
Instagram
</a>
<a href="https://www.facebook.com/trifactorscaling" target="_blank" rel="noopener">
<svg class="footer-social-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
Facebook
</a>
<a href="https://www.linkedin.com/company/trifactorscalingllc" target="_blank" rel="noopener">
<svg class="footer-social-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 23.2 24 22.222 0h.003z"/></svg>
LinkedIn
</a>
<a href="https://www.tiktok.com/@trifactorscaling" target="_blank" rel="noopener">
<svg class="footer-social-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
TikTok
</a>
</div>
</div>
</div>
<div class="footer-bottom">
<span class="footer-copy">© 2026 TriFactor Scaling. All rights reserved.</span>

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
    const timer = requestAnimationFrame(() => {
      requestAnimationFrame(() => {

      const scriptEl = document.createElement("script");
      scriptEl.setAttribute("data-tri-page", "tri-growth-ops");
      scriptEl.text = "(function(){try{\n" + SCRIPT + "\n}catch(e){console.error('tri page script error',e);}})();";
      document.body.appendChild(scriptEl);
      scriptRef.current = scriptEl;
    
      });
    });

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
      cancelAnimationFrame(timer);
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
