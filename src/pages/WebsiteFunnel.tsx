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
<img alt="TriFactor Scaling" height="40" src="./TFS-Logo-Transparent.png"/>
</a>
<ul class="nav-links">
<li><a class="nav-link" href="/">Overview</a></li>
<li><a class="nav-link" href="/services">Services</a></li>
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
<a href="/services" onclick="toggleMenu()">Services</a>
<a href="/results" onclick="toggleMenu()">Results</a>
<a href="/about" onclick="toggleMenu()">About</a>
<a href="/apply" onclick="toggleMenu()">Apply Now →</a>
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
<!-- ======================== FOOTER ======================== -->
<footer>
<img alt="" aria-hidden="true" class="footer-watermark" src="./TFS-Logo-Transparent.png"/>
<div class="container footer-inner">
<div class="footer-top">
<!-- Brand -->
<div class="footer-brand">
<img alt="TriFactor Scaling" class="footer-logo-img" src="./TFS-Logo-Transparent.png"/>
<p class="footer-tagline">We find what's blocking your growth. We build the systems to fix it.</p>
<a class="footer-contact-link" href="mailto:contact@trifactorscaling.com">
            contact@trifactorscaling.com →
          </a>
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
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => {

      try {
        scriptEl = document.createElement("script");
        scriptEl.text =
          "(function(){try{\n" + SCRIPT + "\n}catch(e){console.error('tri page script error',e);}})();";
        document.body.appendChild(scriptEl);
      } catch (e) {
        console.error("page script error", e);
      }
    
      });
    });

    return () => {
      cancelAnimationFrame(t);
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
