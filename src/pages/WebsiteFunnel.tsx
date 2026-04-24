import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const CSS = `

  /* ======================== RESET & VARIABLES ======================== */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    color-scheme: dark;
    --gold:        #D4AF37;
    --gold-light:  #E2C860;
    --gold-dark:   #B8962A;
    --gold-dim:    rgba(212,175,55,0.10);
    --gold-glow:   rgba(212,175,55,0.22);
    --gold-border: rgba(212,175,55,0.28);
    --black:       #000000;
    --surface:     #0F0F0F;
    --surface-warm: #130F00;
    --cta-bg:      #0B0800;
    --card:        #161616;
    --card-hover:  #1C1C1C;
    --border:      #222222;
    --border-mid:  #2E2E2E;
    --white:       #FFFFFF;
    --off-white:   #F2F0EB;
    --gray:        #6B7280;
    --gray-light:  #9CA3AF;
    --fh: 'Plus Jakarta Sans', sans-serif;
    --fb: 'Inter', sans-serif;
  }

  html { scroll-behavior: smooth; }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--black); }
  ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--gold-light); }
  * { scrollbar-width: thin; scrollbar-color: var(--gold) var(--black); }

  body {
    background: var(--black);
    color: var(--white);
    font-family: var(--fb);
    line-height: 1.6;
    overflow-x: hidden;
  }

  /* ======================== TYPOGRAPHY ======================== */
  h1, h2, h3, h4 { font-family: var(--fh); line-height: 1.08; letter-spacing: -0.025em; }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: var(--fb);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
  }
  .eline { width: 26px; height: 1.5px; background: var(--gold); flex-shrink: 0; }

  /* ======================== LAYOUT ======================== */
  .container { max-width: 1140px; margin: 0 auto; padding: 0 28px; }
  section { padding: 100px 0; }

  /* ======================== BUTTONS ======================== */
  .btn-gold {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--gold); color: var(--black);
    font-family: var(--fh); font-weight: 700; font-size: 0.86rem; letter-spacing: 0.02em;
    padding: 15px 32px; border: none; border-radius: 2px; cursor: pointer;
    text-decoration: none;
    transition: background 0.22s ease, transform 0.22s ease, box-shadow 0.22s ease;
  }
  .btn-gold:hover { background: var(--gold-light); transform: translateY(-2px); box-shadow: 0 10px 32px var(--gold-glow); }

  .btn-outline {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; color: var(--white);
    font-family: var(--fh); font-weight: 600; font-size: 0.86rem; letter-spacing: 0.02em;
    padding: 15px 32px; border: 1px solid var(--border-mid); border-radius: 2px;
    cursor: pointer; text-decoration: none;
    transition: border-color 0.22s ease, color 0.22s ease;
  }
  .btn-outline:hover { border-color: var(--gold); color: var(--gold); }

  /* ======================== REVEAL ======================== */
  .reveal {
    opacity: 0; transform: translateY(30px);
    transition: opacity 0.7s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94);
  }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .reveal-left  { opacity: 0; transform: translateX(-30px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .reveal-left.visible { opacity: 1; transform: translateX(0); }
  .reveal-right { opacity: 0; transform: translateX(30px);  transition: opacity 0.7s ease, transform 0.7s ease; }
  .reveal-right.visible { opacity: 1; transform: translateX(0); }

  /* ======================== GOLD SHIMMER ======================== */
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  .gold-shimmer {
    background: linear-gradient(90deg, var(--gold) 0%, var(--gold-light) 40%, #fff8d6 55%, var(--gold-light) 70%, var(--gold) 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
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
  .nav-logo img { height: 36px; width: auto; object-fit: contain; }
  .nav-cta-wrap { display: flex; align-items: center; justify-content: flex-end; gap: 12px; }

  .nav-links { display: flex; align-items: center; justify-content: center; gap: 36px; list-style: none; }
  .nav-links a {
    font-family: var(--fb); font-size: 0.82rem; font-weight: 500;
    color: var(--gray-light); text-decoration: none;
    transition: color 0.2s ease;
  }
  .nav-links a:hover { color: var(--white); }
  .nav-links a.active-nav { color: var(--gold); }

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
  .mobile-menu a.active-nav { color: var(--gold); }
  .mobile-menu a:last-child { border-bottom: none; color: var(--gold); padding-top: 18px; }

  @media (max-width: 768px) { .nav-links, .nav-cta { display: none; } .hamburger { display: flex; } }

  /* ======================== PAGE HERO ======================== */
  .page-hero {
    padding: 88px 0 100px;
    background: var(--black);
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .page-hero::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 64px 64px;
    opacity: 0.18;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 10%, transparent 70%);
    pointer-events: none;
  }
  .page-hero-glow {
    position: absolute; top: -20%; left: 50%; transform: translateX(-50%);
    width: 70vw; height: 60vw; max-width: 900px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 65%);
    pointer-events: none;
  }
  .page-hero-inner { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; }
  .page-hero-eyebrow {
    margin-bottom: 20px;
    opacity: 0; animation: fadeUp 0.65s ease 0.1s forwards;
  }
  .page-hero h1 {
    font-size: clamp(2.4rem, 5.5vw, 4.4rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.0;
    max-width: 780px;
    margin: 0 auto 22px;
    opacity: 0; animation: fadeUp 0.7s ease 0.25s forwards;
  }
  .page-hero-sub {
    font-size: 1rem;
    color: var(--gray-light);
    max-width: 540px;
    margin: 0 auto 24px;
    line-height: 1.8;
    opacity: 0; animation: fadeUp 0.7s ease 0.4s forwards;
  }
  .page-hero-back {
    opacity: 0; animation: fadeUp 0.7s ease 0.52s forwards;
  }
  .page-hero-back a {
    font-family: var(--fb); font-size: 0.8rem; font-weight: 500;
    color: var(--gray); text-decoration: none;
    transition: color 0.2s ease;
  }
  .page-hero-back a:hover { color: var(--gold); }

  /* ======================== WHAT IT IS ======================== */
  #what-it-is {
    background: var(--surface);
    padding: 96px 0;
    position: relative;
  }
  .what-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 72px;
    align-items: start;
  }
  .what-left .section-eyebrow { margin-bottom: 18px; }
  .what-left h2 {
    font-size: clamp(1.7rem, 3vw, 2.4rem);
    font-weight: 800;
    margin-bottom: 20px;
    line-height: 1.12;
  }
  .what-left p {
    font-size: 0.95rem;
    color: var(--gray-light);
    line-height: 1.82;
  }
  .info-cards { display: flex; flex-direction: column; gap: 18px; }
  .info-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-left: 3px solid var(--gold-border);
    padding: 24px 26px;
    border-radius: 2px;
    transition: border-left-color 0.25s ease;
  }
  .info-card:hover { border-left-color: var(--gold); }
  .info-card-label {
    font-family: var(--fb);
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 10px;
  }
  .info-card p {
    font-size: 0.88rem;
    color: var(--gray-light);
    line-height: 1.75;
  }

  @media (max-width: 900px) {
    .what-grid { grid-template-columns: 1fr; gap: 44px; }
  }

  /* ======================== TIERS ======================== */
  #tiers {
    background: var(--black);
    padding: 96px 0;
    position: relative;
  }
  .tiers-header {
    text-align: center;
    max-width: 640px;
    margin: 0 auto 56px;
  }
  .tiers-header .tiers-eyebrow { margin-bottom: 16px; display: flex; justify-content: center; }
  .tiers-header h2 {
    font-size: clamp(1.8rem, 3.5vw, 2.8rem);
    font-weight: 800;
    line-height: 1.1;
  }

  /* 3-column tier grid */
  .wf-tier-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
  }
  .wf-tier-card {
    background: var(--black);
    padding: 44px 32px;
    display: flex;
    flex-direction: column;
    position: relative;
    transition: background 0.25s ease;
  }
  .wf-tier-card:hover { background: #030303; }

  /* Featured tier */
  .wf-tier-featured {
    background: #090900;
    padding-top: 58px;
  }
  .wf-tier-featured::before {
    content: '';
    position: absolute; inset: 0;
    border: 1px solid var(--gold-border);
    pointer-events: none;
    transition: border-color 0.3s ease;
  }
  .wf-tier-featured:hover::before { border-color: var(--gold); }

  /* "Most Popular" banner at the very top */
  .wf-popular-badge {
    position: absolute; top: 0; left: 0; right: 0;
    background: var(--gold); color: var(--black);
    font-family: var(--fb); font-size: 0.58rem; font-weight: 800;
    letter-spacing: 0.2em; text-transform: uppercase;
    text-align: center; padding: 6px;
    pointer-events: none;
  }

  /* Price block */
  .wf-price-val {
    font-family: var(--fh);
    font-size: 2.2rem;
    font-weight: 800;
    color: var(--gold);
    letter-spacing: -0.02em;
    line-height: 1;
  }
  .wf-price-mo {
    font-size: 0.85rem;
    color: var(--gray-light);
    margin-top: 5px;
  }
  .wf-tier-name {
    font-family: var(--fh);
    font-size: 1.4rem;
    font-weight: 800;
    color: var(--white);
    margin: 16px 0 8px;
    letter-spacing: -0.01em;
  }
  .wf-tier-desc {
    font-size: 0.84rem;
    color: var(--gray-light);
    line-height: 1.65;
    margin-bottom: 22px;
    padding-bottom: 22px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .wf-tier-featured .wf-tier-desc { border-bottom-color: rgba(212,175,55,0.18); }

  /* Feature list */
  .wf-feature-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 11px;
    margin-bottom: 32px;
    flex: 1;
  }
  .wf-feature-list li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 0.87rem;
    color: var(--off-white);
    line-height: 1.58;
  }
  .wf-feat-check {
    color: var(--gold);
    font-size: 0.7rem;
    flex-shrink: 0;
    margin-top: 3px;
  }

  /* Tier CTA */
  .wf-tier-apply {
    display: block;
    text-align: center;
    margin-top: auto;
    padding: 13px 20px;
    border: 1px solid var(--border-mid);
    background: transparent;
    color: var(--gray-light);
    font-family: var(--fb);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-decoration: none;
    transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
    cursor: pointer;
  }
  .wf-tier-apply:hover { border-color: var(--gold); color: var(--gold); }
  .wf-tier-apply-fill {
    background: var(--gold);
    color: var(--black);
    border-color: var(--gold);
  }
  .wf-tier-apply-fill:hover { background: var(--gold-light); border-color: var(--gold-light); color: var(--black); }

  @media (max-width: 900px) {
    .wf-tier-grid { grid-template-columns: 1fr; background: transparent; border: none; gap: 1px; }
    .wf-tier-card { border: 1px solid var(--border); }
    .wf-tier-featured { border: 1px solid var(--gold-border); }
    .wf-tier-featured::before { display: none; }
  }
  @media (max-width: 600px) {
    .wf-tier-card { padding: 38px 24px 32px; }
    .wf-tier-featured { padding-top: 52px; }
  }

  /* ======================== FINAL CTA ======================== */
  #wf-final-cta {
    background: var(--cta-bg);
    padding: 110px 0;
    text-align: center;
    position: relative;
    overflow: hidden;
    border-top: 1px solid var(--gold-border);
  }
  #wf-final-cta::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 70% 60% at 50% 0%, rgba(212,175,55,0.07) 0%, transparent 65%);
    pointer-events: none;
  }
  .wf-cta-inner { position: relative; z-index: 2; max-width: 620px; margin: 0 auto; }
  .wf-cta-headline {
    font-size: clamp(2.2rem, 5vw, 3.8rem);
    font-weight: 800;
    line-height: 1.08;
    margin-bottom: 22px;
  }
  .wf-cta-body {
    font-size: 0.95rem; color: var(--gray-light); line-height: 1.8;
    margin-bottom: 38px; max-width: 500px; margin-left: auto; margin-right: auto;
  }
  .wf-cta-actions {
    display: flex; align-items: center; justify-content: center;
    gap: 12px; flex-wrap: wrap; margin-bottom: 22px;
  }
  .wf-cta-sub {
    font-size: 0.8rem; color: var(--gray);
  }
  .wf-cta-sub a { color: var(--gold); text-decoration: none; }
  .wf-cta-sub a:hover { color: var(--gold-light); }

  /* ======================== FOOTER ======================== */
  footer { background: var(--black); border-top: 1px solid var(--border); padding: 80px 0 0; position: relative; overflow: hidden; }
  footer::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent 0%, var(--gold-border) 30%, var(--gold-border) 70%, transparent 100%); pointer-events: none; }
  .footer-watermark { position: absolute; right: -40px; bottom: -30px; width: 480px; height: auto; opacity: 0.03; pointer-events: none; user-select: none; filter: grayscale(1) brightness(8); }
  .footer-inner { position: relative; z-index: 2; }
  .footer-top { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 60px; align-items: start; padding-bottom: 56px; border-bottom: 1px solid var(--border); }
  .footer-logo-img { height: 52px; width: auto; margin-bottom: 20px; display: block; }
  .footer-tagline { font-size: 0.82rem; color: var(--gray); max-width: 260px; line-height: 1.75; margin-bottom: 28px; }
  .footer-contact-link { display: inline-flex; align-items: center; gap: 8px; font-family: var(--fb); font-size: 0.78rem; font-weight: 500; color: var(--gray-light); text-decoration: none; transition: color 0.2s; }
  .footer-contact-link:hover { color: var(--gold); }
  .footer-col-label { font-family: var(--fb); font-size: 0.65rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--gold); margin-bottom: 20px; }
  .footer-col-links { display: flex; flex-direction: column; gap: 12px; }
  .footer-col-links a { font-family: var(--fb); font-size: 0.82rem; font-weight: 400; color: var(--gray-light); text-decoration: none; transition: color 0.2s ease; }
  .footer-col-links a:hover { color: var(--white); }
  .footer-bottom { padding: 22px 0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
  .footer-copy { font-size: 0.73rem; color: var(--gray); }
  .footer-built { font-size: 0.73rem; color: var(--gray); font-style: italic; }
  .footer-built span { color: var(--gold); font-style: normal; }

  /* ======================== RESPONSIVE ======================== */
  html, body { overflow-x: hidden; max-width: 100%; }
  img, video, canvas, svg { max-width: 100%; height: auto; }
  h1, h2, h3, h4, h5, p, li, span, a { overflow-wrap: break-word; word-wrap: break-word; }
  .eyebrow { flex-wrap: wrap; }

  @media (max-width: 768px) {
    .nav-inner { grid-template-columns: 1fr auto; }
    .nav-links  { display: none !important; }
    .nav-cta    { display: none !important; }
    .nav-cta-wrap { justify-content: flex-end; }
    .hamburger  { display: flex !important; }
    .mobile-menu { top: 58px; }
    section { padding: 72px 0 !important; }
    .container { padding-left: max(18px, 4vw) !important; padding-right: max(18px, 4vw) !important; }
    .page-hero { padding: 82px 0 60px !important; }
    .page-hero h1 { font-size: clamp(1.9rem, 7vw, 2.8rem) !important; }
    .what-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
    #wf-final-cta { padding: 72px 0 !important; }
    .footer-top { grid-template-columns: 1fr !important; gap: 36px !important; padding-bottom: 40px !important; }
    .footer-bottom { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
  }
  @media (max-width: 480px) {
    section { padding: 52px 0 !important; }
    .container { padding-left: 16px !important; padding-right: 16px !important; }
    .wf-cta-headline { font-size: 1.9rem !important; }
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
<!-- ======================== NAV ======================== -->
<nav id="navbar">
  <div class="container">
    <div class="nav-inner">
      <a class="nav-logo" href="/"><img alt="TriFactor Scaling" height="40" src="./TFS-Logo-Transparent.png"/></a>
      <ul class="nav-links">
        <li><a class="nav-link" href="/">Overview</a></li>
        <li><a class="nav-link active-nav" href="/services">Services</a></li>
        <li><a class="nav-link" href="/results">Results</a></li>
        <li><a class="nav-link" href="/about">About</a></li>
      </ul>
      <div class="nav-cta-wrap">
        <a class="btn-gold nav-cta" href="/apply" style="padding:11px 22px;font-size:0.8rem;">Apply Now →</a>
        <button class="hamburger" onclick="toggleMenu()"><span></span><span></span><span></span></button>
      </div>
    </div>
  </div>
</nav>
<div class="mobile-menu" id="mobileMenu">
  <a href="/">Overview</a>
  <a class="active-nav" href="/services">Services</a>
  <a href="/results">Results</a>
  <a href="/about">About</a>
  <a href="/apply">Apply Now →</a>
</div>

<!-- ======================== PAGE HERO ======================== -->
<section class="page-hero">
  <div class="page-hero-glow"></div>
  <div class="container">
    <div class="page-hero-inner">
      <div class="page-hero-eyebrow">
        <span class="eyebrow"><span class="eline"></span>Pillar 01<span class="eline"></span></span>
      </div>
      <h1>Website &amp; <span class="gold-shimmer">Funnel</span></h1>
      <p class="page-hero-sub">Your online presence, built to capture and convert — not just exist.</p>
      <div class="page-hero-back">
        <a href="/services">← Back to Services</a>
      </div>
    </div>
  </div>
</section>

<!-- ======================== WHAT IT IS ======================== -->
<section id="what-it-is">
  <div class="container">
    <div class="what-grid">

      <!-- Left column -->
      <div class="what-left reveal-left">
        <div class="section-eyebrow">
          <span class="eyebrow"><span class="eline"></span>What It Is</span>
        </div>
        <h2>Before anything else can work, you need a site that converts.</h2>
        <p>A website that looks good but doesn't capture leads isn't an asset — it's a liability. Every Website &amp; Funnel we build is engineered around one outcome: turning visitors into leads.</p>
      </div>

      <!-- Right column: info cards -->
      <div class="info-cards reveal-right">
        <div class="info-card">
          <div class="info-card-label">Setup Fee</div>
          <p>One-time build cost. 50% due upfront, remaining 50% due at launch — once the build is complete to your liking.</p>
        </div>
        <div class="info-card">
          <div class="info-card-label">Monthly Retainer</div>
          <p>Ongoing maintenance &amp; optimization. Charged at launch alongside the final 50% of the setup fee.</p>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- ======================== THREE TIERS ======================== -->
<section id="tiers">
  <div class="container">

    <div class="tiers-header reveal">
      <div class="tiers-eyebrow">
        <span class="eyebrow"><span class="eline"></span>Choose Your Level<span class="eline"></span></span>
      </div>
      <h2>Upgrade as you grow.</h2>
    </div>

    <div class="wf-tier-grid reveal">

      <!-- ── Tier 1: Launch ── -->
      <div class="wf-tier-card">
        <div class="wf-price-val">$2,500</div>
        <div class="wf-price-mo">+ $250 / mo</div>
        <div class="wf-tier-name">Launch</div>
        <div class="wf-tier-desc">A credible, conversion-ready presence — up and running fast.</div>
        <ul class="wf-feature-list">
          <li><span class="wf-feat-check">✦</span>Homepage, services page, about, and contact</li>
          <li><span class="wf-feat-check">✦</span>Lead capture form wired into your CRM</li>
          <li><span class="wf-feat-check">✦</span>Mobile-optimized and fast-loading</li>
          <li><span class="wf-feat-check">✦</span>Basic SEO setup — indexed and findable on Google</li>
          <li><span class="wf-feat-check">✦</span>Domain and hosting configuration</li>
          <li><span class="wf-feat-check">✦</span>Anytime maintenance included upon request</li>
        </ul>
        <a class="wf-tier-apply" href="mailto:contact@trifactorscaling.com?subject=Website%20Funnel%20-%20Launch">Apply for Launch →</a>
      </div>

      <!-- ── Tier 2: Build (FEATURED) ── -->
      <div class="wf-tier-card wf-tier-featured">
        <div class="wf-popular-badge">MOST POPULAR</div>
        <div class="wf-price-val">$5,000</div>
        <div class="wf-price-mo">+ $300 / mo</div>
        <div class="wf-tier-name">Build</div>
        <div class="wf-tier-desc">A full website plus a dedicated lead pipeline.</div>
        <ul class="wf-feature-list">
          <li><span class="wf-feat-check">✦</span>Everything in Launch</li>
          <li><span class="wf-feat-check">✦</span>Up to 8 pages including service-specific landing pages</li>
          <li><span class="wf-feat-check">✦</span>Dedicated lead funnel — opt-in → confirmation → automated follow-up</li>
          <li><span class="wf-feat-check">✦</span>Calendar and booking integration</li>
          <li><span class="wf-feat-check">✦</span>Automated lead notification and first-touch follow-up trigger</li>
          <li><span class="wf-feat-check">✦</span>Google Analytics + conversion tracking setup</li>
          <li><span class="wf-feat-check">✦</span>Quarterly strategy review</li>
        </ul>
        <a class="wf-tier-apply wf-tier-apply-fill" href="mailto:contact@trifactorscaling.com?subject=Website%20Funnel%20-%20Build">Apply for Build →</a>
      </div>

      <!-- ── Tier 3: Full Funnel Op ── -->
      <div class="wf-tier-card">
        <div class="wf-price-val">$8,500</div>
        <div class="wf-price-mo">+ $500 / mo</div>
        <div class="wf-tier-name">Full Funnel Op</div>
        <div class="wf-tier-desc">A complete multi-funnel ecosystem, continuously optimized for revenue.</div>
        <ul class="wf-feature-list">
          <li><span class="wf-feat-check">✦</span>Everything in Build</li>
          <li><span class="wf-feat-check">✦</span>Multiple funnels for different offers or audiences</li>
          <li><span class="wf-feat-check">✦</span>A/B testing on key pages and CTAs</li>
          <li><span class="wf-feat-check">✦</span>Monthly conversion rate optimization (CRO)</li>
          <li><span class="wf-feat-check">✦</span>Full revenue attribution tracking — know exactly what's converting</li>
          <li><span class="wf-feat-check">✦</span>Priority support and monthly strategy review</li>
        </ul>
        <a class="wf-tier-apply" href="mailto:contact@trifactorscaling.com?subject=Website%20Funnel%20-%20Full%20Funnel%20Op">Apply for Full Funnel Op →</a>
      </div>

    </div>
  </div>
</section>

<!-- ======================== FINAL CTA ======================== -->
<section id="wf-final-cta">
  <div class="container">
    <div class="wf-cta-inner">
      <h2 class="wf-cta-headline reveal">
        Ready to build your<br/>
        <span class="gold-shimmer">conversion machine?</span>
      </h2>
      <p class="wf-cta-body reveal">Book a free Growth Audit. We'll show you exactly what tier fits your business — and what it'll take to get you converting.</p>
      <div class="wf-cta-actions reveal">
        <a class="btn-gold" href="/apply">Book Your Free Audit →</a>
      </div>
      <p class="wf-cta-sub reveal">Or email <a href="mailto:contact@trifactorscaling.com">contact@trifactorscaling.com</a></p>
    </div>
  </div>
</section>

<!-- ======================== FOOTER ======================== -->
<footer>
  <img alt="" aria-hidden="true" class="footer-watermark" src="./TFS-Logo-Transparent.png"/>
  <div class="container footer-inner">
    <div class="footer-top">
      <div class="footer-brand">
        <img alt="TriFactor Scaling" class="footer-logo-img" src="./TFS-Logo-Transparent.png"/>
        <p class="footer-tagline">Growth Operations Agency. We install automated revenue systems into local service businesses — built once, running forever.</p>
        <a class="footer-contact-link" href="mailto:contact@trifactorscaling.com">contact@trifactorscaling.com →</a>
      </div>
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
      <div>
        <div class="footer-col-label">Work With Us</div>
        <div class="footer-col-links">
          <a href="/apply">Apply for Growth Ops</a>
          <a href="/results">See Client Results</a>
          <a href="/services">What We Build</a>
          <a href="mailto:contact@trifactorscaling.com">Send Us an Email</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span class="footer-copy">© 2026 TriFactor Scaling. All rights reserved.</span>
      
    </div>
  </div>
</footer>
`;

const WebsiteFunnel = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const prevBg = document.body.style.background;
    const prevColor = document.body.style.color;
    document.body.style.background = "#000000";
    document.body.style.color = "#ffffff";
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";

    const styleEl = document.createElement("style");
    styleEl.setAttribute("data-tri-page", "tri-website-funnel");
    styleEl.innerHTML = CSS;
    document.head.appendChild(styleEl);

    let scriptEl: HTMLScriptElement | null = null;
    const t = window.setTimeout(() => {
      try {
        scriptEl = document.createElement("script");
        scriptEl.text =
          "(function(){try{\n" + SCRIPT + "\n}catch(e){console.error('tri page script error',e);}})();";
        document.body.appendChild(scriptEl);
      } catch (e) {
        console.error("page script error", e);
      }
    }, 0);

    return () => {
      window.clearTimeout(t);
      styleEl.remove();
      scriptEl?.remove();
      if ((window as any).toggleMenu) delete (window as any).toggleMenu;
      document.body.style.background = prevBg;
      document.body.style.color = prevColor;
      document.documentElement.style.overflowX = "";
      document.body.style.overflowX = "";
    };
  }, []);

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = (e.target as HTMLElement).closest("a");
    if (!a) return;
    const href = a.getAttribute("href") || "";
    if (href.startsWith("/") && !href.startsWith("//")) {
      e.preventDefault();
      const menu = document.getElementById("mobileMenu");
      if (menu) menu.classList.remove("open");
      if (href === window.location.pathname) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate(href);
      }
    }
  };

  return (
    <div
      ref={rootRef}
      className="tri-website-funnel tri-page-fade"
      style={{ overflowX: "hidden", maxWidth: "100vw" }}
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: HTML }}
    />
  );
};

export default WebsiteFunnel;
