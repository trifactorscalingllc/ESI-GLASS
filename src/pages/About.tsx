import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const CSS = `
    /* ======================== RESET & VARIABLES ======================== */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .tri-about {
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
    } .tri-about { scroll-behavior: smooth; }

    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: var(--black); }
    ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--gold-light); }
    * { scrollbar-width: thin; scrollbar-color: var(--gold) var(--black); } .tri-about {
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
      padding: 20px 0; border-bottom: 1px solid transparent;
      transition: background 0.3s ease, border-color 0.3s ease, padding 0.3s ease;
    }
    #navbar.scrolled {
      background: rgba(0,0,0,0.94); backdrop-filter: blur(24px);
      border-color: var(--border); padding: 13px 0;
    }
    .nav-inner { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 0; }
    .nav-logo { display: flex; align-items: center; text-decoration: none; }
    .nav-logo img { height: 56px; width: auto; object-fit: contain; }
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

    /* ======================== STICKY BAR ======================== */
    #stickyBar {
      position: fixed; bottom: 0; left: 0; right: 0;
      background: rgba(10,7,0,0.96); backdrop-filter: blur(20px);
      border-top: 1px solid var(--gold-border);
      padding: 14px 28px;
      display: flex; align-items: center; justify-content: space-between; gap: 16px;
      z-index: 90;
      transform: translateY(100%);
      transition: transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
      flex-wrap: wrap;
    }
    #stickyBar.show { transform: translateY(0); }
    .sticky-text {
      font-size: 0.82rem; color: var(--gray-light);
      display: flex; align-items: center; gap: 10px;
    }
    .sticky-dot {
      width: 7px; height: 7px; background: #3ecf6e; border-radius: 50%; flex-shrink: 0;
      animation: avail-pulse 2s ease-in-out infinite;
    }
    @keyframes avail-pulse {
      0%, 100% { box-shadow: none; }
      50% { box-shadow: 0 0 0 4px rgba(62,207,110,0.2); }
    }
    @media (max-width: 480px) { #stickyBar { justify-content: center; text-align: center; } }

    /* ======================== PAGE HERO ======================== */
    .page-hero {
      padding: 160px 0 100px;
      background: var(--black);
      text-align: center;
      position: relative;
      overflow: hidden;
      border-bottom: 1px solid var(--border);
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
      margin-bottom: 28px;
      opacity: 0; animation: fadeUp 0.65s ease 0.1s forwards;
    }
    .page-hero h1 {
      font-size: clamp(2.2rem, 5.5vw, 5rem);
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
      max-width: 600px;
      margin: 0 auto 0;
      line-height: 1.8;
      opacity: 0; animation: fadeUp 0.7s ease 0.4s forwards;
    }

    /* ======================== SECTION DIVIDERS ======================== */
    .section-divider-top {
      position: relative;
    }
    .section-divider-top::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent 0%, var(--gold-dark) 20%, var(--gold) 50%, var(--gold-dark) 80%, transparent 100%);
      opacity: 0.4;
    }

    .section-header {
      text-align: center;
      margin-bottom: 56px;
    }
    .section-header h2 {
      font-size: clamp(1.7rem, 3vw, 2.4rem);
      font-weight: 800;
      margin-top: 18px;
    }

    /* ======================== ORIGIN STORY ======================== */
    #origin {
      background: var(--surface);
      padding: 96px 0;
    }

    .origin-grid {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 80px;
      align-items: start;
    }

    .origin-eyebrow-row {
      margin-bottom: 32px;
    }
    .origin-paragraphs { display: flex; flex-direction: column; gap: 22px; }
    .origin-paragraphs p {
      font-size: 0.96rem; color: var(--gray-light); line-height: 1.9;
    }
    .origin-paragraphs p strong {
      color: var(--off-white); font-weight: 600;
    }
    /* Drop-cap editorial opening */
    .origin-paragraphs p:first-child::first-letter {
      font-family: var(--fh);
      font-size: 4rem;
      font-weight: 800;
      color: var(--gold);
      float: left;
      line-height: 0.75;
      margin-right: 10px;
      margin-top: 6px;
    }

    .origin-stats { display: flex; flex-direction: column; gap: 16px; }
    .origin-stat-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-left: 3px solid var(--gold-border);
      padding: 28px 28px;
      border-radius: 2px;
      transition: border-color 0.25s ease;
    }
    .origin-stat-card:hover { border-left-color: var(--gold); border-color: var(--gold-border); }
    .origin-stat-val {
      font-family: var(--fh); font-size: 2.2rem; font-weight: 800;
      color: var(--gold); letter-spacing: -0.04em; line-height: 1;
      margin-bottom: 8px;
    }
    .origin-stat-label {
      font-family: var(--fh); font-size: 0.92rem; font-weight: 700;
      color: var(--white); margin-bottom: 4px;
    }
    .origin-stat-sub {
      font-size: 0.78rem; color: var(--gray); line-height: 1.5;
    }

    @media (max-width: 900px) {
      .origin-grid { grid-template-columns: 1fr; gap: 48px; }
    }

    /* ======================== FOUNDERS ======================== */
    #founders {
      background: var(--black);
      padding: 96px 0;
    }

    /* Side-by-side half-panel founder layout */
    .founders-panel {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border: 1px solid var(--border);
      border-radius: 3px;
      overflow: hidden;
    }
    .founder-half {
      padding: 52px 44px;
      position: relative;
    }
    .founder-half:first-child {
      border-right: 1px solid var(--border);
    }
    .founder-half::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, var(--gold-dark), var(--gold));
      opacity: 0.5;
    }
    .founder-placeholder {
      width: 80px; height: 80px;
      background: var(--surface);
      border: 1.5px solid var(--gold-border);
      border-radius: 3px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 28px;
    }
    .founder-initials {
      font-family: var(--fh); font-size: 1.5rem; font-weight: 800;
      color: var(--gold); letter-spacing: 0.05em; line-height: 1;
    }
    .founder-name {
      font-family: var(--fh); font-size: 1.6rem; font-weight: 800;
      color: var(--white); margin-bottom: 6px;
    }
    .founder-title {
      font-size: 0.7rem; font-weight: 700; letter-spacing: 0.14em;
      text-transform: uppercase; color: var(--gold);
      margin-bottom: 20px;
    }
    .founder-quote {
      font-family: var(--fh); font-size: 1.05rem; font-weight: 600;
      color: var(--off-white); line-height: 1.55;
      margin-bottom: 18px;
      font-style: italic;
    }
    .founder-bio {
      font-size: 0.88rem; color: var(--gray-light); line-height: 1.8;
    }
    .founder-photo-note {
      font-size: 0.7rem; color: var(--gray);
      margin-top: 20px;
    }

    @media (max-width: 768px) {
      .founders-panel { grid-template-columns: 1fr; }
      .founder-half:first-child { border-right: none; border-bottom: 1px solid var(--border); }
      .founder-half { padding: 36px 28px; }
    }

    /* ======================== APPROACH ======================== */
    #approach {
      background: var(--surface);
      padding: 96px 0;
    }

    /* Horizontal borderless row with large ghost numbers */
    .approach-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0;
    }
    .approach-pillar {
      padding: 0 40px 0 0;
      border-right: 1px solid var(--border);
      position: relative;
    }
    .approach-pillar:last-child {
      border-right: none;
      padding-right: 0;
    }
    .approach-pillar:first-child {
      padding-left: 0;
    }
    .approach-pillar + .approach-pillar {
      padding-left: 40px;
    }
    .approach-ghost-num {
      font-family: var(--fh);
      font-size: 5rem;
      font-weight: 800;
      color: var(--gold);
      opacity: 0.08;
      line-height: 1;
      margin-bottom: -24px;
      letter-spacing: -0.04em;
      display: block;
    }
    .approach-title {
      font-family: var(--fh); font-size: 1.05rem; font-weight: 800;
      color: var(--white); line-height: 1.25; margin-bottom: 12px;
      position: relative;
    }
    .approach-body {
      font-size: 0.85rem; color: var(--gray-light); line-height: 1.78;
      position: relative;
    }

    @media (max-width: 900px) {
      .approach-row { grid-template-columns: 1fr 1fr; gap: 36px; }
      .approach-pillar { padding: 0; border-right: none; border-bottom: 1px solid var(--border); padding-bottom: 28px; }
      .approach-pillar:nth-child(3), .approach-pillar:nth-child(4) { border-bottom: none; padding-bottom: 0; }
    }
    @media (max-width: 480px) {
      .approach-row { grid-template-columns: 1fr; }
      .approach-pillar:nth-child(3) { border-bottom: 1px solid var(--border); padding-bottom: 28px; }
      .approach-pillar:nth-child(4) { border-bottom: none; }
    }

    /* ======================== WHY GROWTH OPS ======================== */
    #why-growth-ops {
      background: var(--black);
      padding: 0;
      overflow: hidden;
    }

    /* Dramatic full-width split — no container, edge to edge */
    .compare-dramatic {
      display: grid;
      grid-template-columns: 1fr 1fr;
      min-height: 560px;
    }
    .compare-side {
      padding: 80px 64px;
    }
    .compare-side-not {
      background: #0d0000;
      border-right: 1px solid rgba(239,68,68,0.15);
    }
    .compare-side-tfs {
      background: var(--surface-warm);
    }
    .compare-side-label {
      font-family: var(--fb); font-size: 0.62rem; font-weight: 700;
      letter-spacing: 0.2em; text-transform: uppercase;
      padding: 5px 12px; border-radius: 2px;
      display: inline-block; margin-bottom: 28px;
    }
    .compare-side-label.label-not {
      background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25);
      color: #F87171;
    }
    .compare-side-label.label-is {
      background: var(--gold-dim); border: 1px solid var(--gold-border);
      color: var(--gold);
    }
    .compare-side-headline {
      font-family: var(--fh); font-size: clamp(1.4rem, 2.5vw, 2rem);
      font-weight: 800; line-height: 1.1; margin-bottom: 32px;
    }
    .compare-side-not .compare-side-headline { color: rgba(255,255,255,0.5); }
    .compare-side-tfs .compare-side-headline { color: var(--white); }

    .compare-list { list-style: none; display: flex; flex-direction: column; gap: 14px; }
    .compare-list li {
      display: flex; align-items: flex-start; gap: 12px;
      font-size: 0.9rem; line-height: 1.55;
    }
    .compare-list.agency-list li { color: rgba(156,163,175,0.55); }
    .compare-list.tfs-list li { color: var(--off-white); }
    .compare-icon { flex-shrink: 0; margin-top: 1px; font-size: 0.78rem; }
    .icon-x { color: rgba(248,113,113,0.6); }
    .icon-check { color: var(--gold); }

    .compare-side-intro {
      font-size: 0.93rem;
      color: var(--gray-light);
      line-height: 1.82;
      margin-bottom: 36px;
      max-width: 420px;
    }

    @media (max-width: 700px) {
      .compare-dramatic { grid-template-columns: 1fr; }
      .compare-side { padding: 52px 28px; }
      .compare-side-not { border-right: none; border-bottom: 1px solid rgba(239,68,68,0.15); }
    }

    /* ======================== FINAL CTA ======================== */
    #final-cta {
      background: var(--cta-bg);
      padding: 110px 0;
      text-align: center;
      position: relative;
      overflow: hidden;
      border-top: 1px solid var(--gold-border);
    }
    #final-cta::before {
      content: '';
      position: absolute; inset: 0;
      background: radial-gradient(ellipse 70% 60% at 50% 0%, rgba(212,175,55,0.07) 0%, transparent 65%);
      pointer-events: none;
    }
    .cta-inner { position: relative; z-index: 2; max-width: 620px; margin: 0 auto; }
    .cta-availability {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(212,175,55,0.08); border: 1px solid var(--gold-border);
      padding: 6px 14px; border-radius: 100px;
      margin-bottom: 32px;
    }
    .cta-avail-dot {
      width: 6px; height: 6px; background: #3ecf6e; border-radius: 50%;
      animation: avail-pulse 2s ease-in-out infinite;
    }
    .cta-avail-text {
      font-size: 0.68rem; font-weight: 700;
      letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold);
    }
    .cta-headline {
      font-size: clamp(2.2rem, 5vw, 4rem);
      font-weight: 800;
      line-height: 1.06;
      margin-bottom: 22px;
    }
    .cta-body {
      font-size: 0.95rem; color: var(--gray-light); line-height: 1.8;
      margin-bottom: 38px; max-width: 500px; margin-left: auto; margin-right: auto;
    }
    .cta-actions {
      display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap;
      margin-bottom: 22px;
    }
    .cta-sub {
      font-size: 0.8rem; color: var(--gray);
    }
    .cta-sub a { color: var(--gold); text-decoration: none; }
    .cta-sub a:hover { color: var(--gold-light); }

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
    @media (max-width: 768px) { .footer-top { grid-template-columns: 1fr; gap: 36px; padding-bottom: 40px; } .footer-bottom { flex-direction: column; align-items: flex-start; gap: 8px; } }
    .footer-email:hover { color: var(--gold-light); }

    /* ======================== RESPONSIVE ======================== */
    @media (max-width: 900px) {
      section { padding: 72px 0; }
      #origin, #founders, #approach, #why-growth-ops, #final-cta { padding: 72px 0; }
      .page-hero { padding: 130px 0 72px; }
    }
    @media (max-width: 768px) {
      section { padding: 72px 0; }
      .page-hero { padding: 130px 0 72px; }
    }
    @media (max-width: 600px) {
      .container { padding: 0 18px; }
      section { padding: 56px 0; }
      #origin, #founders, #approach, #why-growth-ops, #final-cta { padding: 56px 0; }
      .page-hero h1 { font-size: 2rem; }
      .footer-top { flex-direction: column; gap: 28px; }
      .compare-card { padding: 28px 22px; }
    }
    @media (max-width: 480px) {
      .page-hero { padding: 110px 0 56px; }
      .cta-headline { font-size: 1.9rem; }
      .founder-card { padding: 28px 22px; }
    }
  `;
const HTML = `

<!-- ======================== NAV ======================== -->
<nav id="navbar">
  <div class="container">
    <div class="nav-inner">
      <a href="/" class="nav-logo"><img src="./TFS-Logo-Transparent.png" alt="TriFactor Scaling" height="40"></a>
      <ul class="nav-links">
        <li><a href="/" class="nav-link">Overview</a></li>
        <li><a href="/services" class="nav-link">Services</a></li>
        <li><a href="/results" class="nav-link" id="results-link">Results</a></li>
        <li><a href="/about" class="nav-link active-nav" id="about-link">About</a></li>
      </ul>
      <div class="nav-cta-wrap">
        <a href="/apply" class="btn-gold nav-cta" style="padding:11px 22px;font-size:0.8rem;">Apply Now →</a>
        <button class="hamburger" onclick="toggleMenu()"><span></span><span></span><span></span></button>
      </div>
    </div>
  </div>
</nav>
<div class="mobile-menu" id="mobileMenu">
  <a href="/">Overview</a>
  <a href="/services">Services</a>
  <a href="/results">Results</a>
  <a href="/about" class="active-nav">About</a>
  <a href="/apply">Apply Now →</a>
</div>

<!-- ======================== STICKY BAR ======================== -->
<div id="stickyBar">
  <span class="sticky-text">
    <span class="sticky-dot"></span>
    We open 3 client spots per month. Currently accepting applications.
  </span>
  <a href="/apply" class="btn-gold" style="padding:10px 22px;font-size:0.78rem;flex-shrink:0;">Apply Now →</a>
</div>

<!-- ======================== SECTION 1: PAGE HERO ======================== -->
<section class="page-hero">
  <div class="page-hero-glow"></div>
  <div class="container">
    <div class="page-hero-inner">
      <h1>Three teenagers.<br>No agency playbook.<br><span class="gold-shimmer">Real clients.</span></h1>
      <p class="page-hero-sub">TriFactor Scaling was built from scratch — no courses, no agency templates, no shortcuts. Just a clear-eyed read on what local businesses actually needed, and the willingness to go build it.</p>
    </div>
  </div>
</section>

<!-- ======================== SECTION 2: ORIGIN STORY ======================== -->
<section id="origin" class="section-divider-top">
  <div class="container">
    <div class="origin-grid">

      <div class="reveal-left">
        <div class="origin-eyebrow-row">
          <span class="eyebrow"><span class="eline"></span>How It Started</span>
        </div>
        <div class="origin-paragraphs">
          <p>We started by asking a simple question: why do so many skilled local business owners struggle to grow? <strong>Not because they're bad at their craft — they're excellent.</strong> It's because they have no system. Leads come in through texts and DMs, get followed up on inconsistently, and die quietly in someone's inbox. We decided to fix that.</p>
          <p>TriFactor Scaling started as an experiment — could we take enterprise-grade growth systems and make them work for a barbershop or a restoration company? The answer, as it turned out, was yes. The tools existed. The integrations were possible. <strong>What was missing was someone willing to actually do the work</strong> of building and connecting it all for a small business.</p>
          <p>We taught ourselves GoHighLevel, AppSheet, and automation engineering by building real systems for real clients. We didn't learn from a course — we learned from the client's dashboard numbers. <strong>That education is irreplaceable,</strong> and it's what makes every system we build actually work in the real world.</p>
        </div>
      </div>

      <div class="origin-stats reveal-right">
        <div class="origin-stat-card">
          <div class="origin-stat-val">6+</div>
          <div class="origin-stat-label">Active client systems running</div>
          <div class="origin-stat-sub">Every one of them live and operational right now.</div>
        </div>
        <div class="origin-stat-card">
          <div class="origin-stat-val">100%</div>
          <div class="origin-stat-label">Builds completed on time</div>
          <div class="origin-stat-sub">Every project delivered. Every deadline met.</div>
        </div>
        <div class="origin-stat-card">
          <div class="origin-stat-val">2026</div>
          <div class="origin-stat-label">Year founded</div>
          <div class="origin-stat-sub">We're new. That's the point.</div>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- ======================== SECTION 3: THE FOUNDERS ======================== -->
<section id="founders" class="section-divider-top">
  <div class="container">
    <div class="section-header reveal" style="margin-bottom:44px;">
      <span class="eyebrow"><span class="eline"></span>The Founders<span class="eline"></span></span>
      <h2>The people doing the work</h2>
    </div>

    <!-- Side-by-side half-panel layout -->
    <div class="founders-panel">

      <!-- EVAN — left panel -->
      <div class="founder-half reveal-left">
        <div class="founder-placeholder">
          <span class="founder-initials">EV</span>
        </div>
        <div class="founder-name">Evan</div>
        <div class="founder-title">Co-Founder — Growth Strategy &amp; Client Operations</div>
        <p class="founder-quote">"What does your pipeline actually look like right now?"</p>
        <p class="founder-bio">Evan leads client strategy, system architecture, and new business. He's the one on every intro call asking the question most consultants are afraid to ask — then building the answer. Direct, fast, and allergic to anything that doesn't move a needle.</p>
        <p class="founder-photo-note">Photo coming soon</p>
      </div>

      <!-- GAVIN — right panel -->
      <div class="founder-half reveal-right">
        <div class="founder-placeholder">
          <span class="founder-initials">GV</span>
        </div>
        <div class="founder-name">Gavin</div>
        <div class="founder-title">Co-Founder — Technical Build &amp; Automation Engineering</div>
        <p class="founder-quote">"If it runs inside a client's business, Gavin built it."</p>
        <p class="founder-bio">Gavin builds the systems. GHL configuration, workflow automations, AppSheet dashboards, SMS sequences — every client deployment has Gavin's fingerprints on it. He solves problems by going deeper into the tool than most people know is possible.</p>
        <p class="founder-photo-note">Photo coming soon</p>
      </div>

    </div>
  </div>
</section>

<!-- ======================== SECTION 4: THE APPROACH ======================== -->
<section id="approach" class="section-divider-top">
  <div class="container">
    <div style="margin-bottom:56px;" class="reveal">
      <span class="eyebrow"><span class="eline"></span>Our Philosophy</span>
      <h2 style="font-size:clamp(1.7rem,3vw,2.4rem);font-weight:800;margin-top:18px;">How we think about the work</h2>
    </div>

    <div class="approach-row reveal">

      <div class="approach-pillar">
        <span class="approach-ghost-num">01</span>
        <div class="approach-title">Systems before campaigns</div>
        <p class="approach-body">We build infrastructure, not deliverables. A campaign ends. A system compounds.</p>
      </div>

      <div class="approach-pillar">
        <span class="approach-ghost-num">02</span>
        <div class="approach-title">Radical candor, always</div>
        <p class="approach-body">If your funnel has three problems, we tell you all three. No sugar-coating, no protecting the project scope.</p>
      </div>

      <div class="approach-pillar">
        <span class="approach-ghost-num">03</span>
        <div class="approach-title">Skin in the game</div>
        <p class="approach-body">On our Full Scale plans, we participate in revenue share. We only win when you win.</p>
      </div>

      <div class="approach-pillar">
        <span class="approach-ghost-num">04</span>
        <div class="approach-title">Founders do the work</div>
        <p class="approach-body">You're not getting handed to a junior. Evan and Gavin are on every build, every optimization call, every result.</p>
      </div>

    </div>
  </div>
</section>

<!-- ======================== SECTION 5: WHY GROWTH OPS ======================== -->
<section id="why-growth-ops" class="section-divider-top">

  <!-- No container — full-width dramatic split -->
  <div class="compare-dramatic reveal">

    <!-- Left: dark/red-tinted — "What we're not" -->
    <div class="compare-side compare-side-not">
      <span class="compare-side-label label-not">What we're not</span>
      <h2 class="compare-side-headline">Marketing agencies sell campaigns.<br>Campaigns end.</h2>
      <ul class="compare-list agency-list">
        <li><span class="compare-icon icon-x">✕</span>Campaigns with an expiry date</li>
        <li><span class="compare-icon icon-x">✕</span>Deliverables that stop working the moment the retainer does</li>
        <li><span class="compare-icon icon-x">✕</span>Traffic that hits your homepage and bounces</li>
        <li><span class="compare-icon icon-x">✕</span>Monthly reports that look good but can't explain your revenue</li>
        <li><span class="compare-icon icon-x">✕</span>Junior account managers handling your account</li>
        <li><span class="compare-icon icon-x">✕</span>Unclear ROI because attribution is always "murky"</li>
      </ul>
    </div>

    <!-- Right: warm-gold-tinted — "What we are" -->
    <div class="compare-side compare-side-tfs">
      <span class="compare-side-label label-is">What we are</span>
      <h2 class="compare-side-headline">We build operations.<br>Operations run forever.</h2>
      <p class="compare-side-intro">When we build your CRM, your booking system, and your follow-up automation — it keeps running. Every lead captured, every job booked, every review generated happens without your involvement.</p>
      <ul class="compare-list tfs-list">
        <li><span class="compare-icon icon-check">✦</span>Infrastructure with no expiry date</li>
        <li><span class="compare-icon icon-check">✦</span>Systems that compound in value every month</li>
        <li><span class="compare-icon icon-check">✦</span>Lead-to-revenue pipelines — fully automated</li>
        <li><span class="compare-icon icon-check">✦</span>Dashboards showing exactly what's working</li>
        <li><span class="compare-icon icon-check">✦</span>Both founders on every build and every call</li>
        <li><span class="compare-icon icon-check">✦</span>Revenue you can trace back to a specific system</li>
      </ul>
    </div>

  </div>
</section>

<!-- ======================== SECTION 6: FINAL CTA ======================== -->
<section id="final-cta">
  <div class="container">
    <div class="cta-inner">
      <div class="cta-availability reveal">
        <span class="cta-avail-dot"></span>
        <span class="cta-avail-text">Work with the founders directly</span>
      </div>

      <h2 class="cta-headline reveal">
        Two people. Your business.<br>
        <span class="gold-shimmer">Full attention.</span>
      </h2>

      <p class="cta-body reveal">We take 3 clients per month. Not because of capacity — because of quality. If we take your project, you get both founders on every call and every build.</p>

      <div class="cta-actions reveal">
        <a href="/apply" class="btn-gold">Apply for a Spot →</a>
      </div>

      <p class="cta-sub reveal">Or email <a href="mailto:trifactorscaling@gmail.com">trifactorscaling@gmail.com</a></p>
    </div>
  </div>
</section>

<!-- ======================== FOOTER ======================== -->
<footer>
  <img src="./TFS-Logo-Transparent.png" alt="" class="footer-watermark" aria-hidden="true">
  <div class="container footer-inner">
    <div class="footer-top">
      <div class="footer-brand">
        <img src="./TFS-Logo-Transparent.png" alt="TriFactor Scaling" class="footer-logo-img">
        <p class="footer-tagline">Growth Operations Agency. We install automated revenue systems into local service businesses — built once, running forever.</p>
        <a href="mailto:trifactorscaling@gmail.com" class="footer-contact-link">trifactorscaling@gmail.com →</a>
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
          <a href="mailto:trifactorscaling@gmail.com">Send Us an Email</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span class="footer-copy">© 2026 TriFactor Scaling. All rights reserved.</span>
      <span class="footer-built">Built by <span>teens</span>. Powered by results.</span>
    </div>
  </div>
</footer>

<!-- ======================== SCRIPTS ======================== -->

`;
const SCRIPT = `
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 50));
  function toggleMenu() { document.getElementById('mobileMenu').classList.toggle('open'); }
  document.addEventListener('click', e => {
    const m = document.getElementById('mobileMenu');
    if (m && m.classList.contains('open') && !nav.contains(e.target) && !m.contains(e.target)) m.classList.remove('open');
  });
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revObs.observe(el));
  const stickyBar = document.getElementById('stickyBar');
  if (stickyBar) {
    const pageHero = document.querySelector('.page-hero');
    if (pageHero) {
      window.addEventListener('scroll', () => {
        stickyBar.classList.toggle('show', pageHero.getBoundingClientRect().bottom < 0);
      }, { passive: true });
    }
  }
`;

const About = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Force black body background for full-bleed dark pages
    const prevBg = document.body.style.background;
    const prevColor = document.body.style.color;
    document.body.style.background = "#000000";
    document.body.style.color = "#FFFFFF";

    // Inject scoped CSS once per page
    const styleEl = document.createElement("style");
    styleEl.setAttribute("data-tri-page", "tri-about");
    styleEl.innerHTML = CSS;
    document.head.appendChild(styleEl);

    // Run page scripts after DOM is mounted
    let scriptEl: HTMLScriptElement | null = null;
    const t = window.setTimeout(() => {
      try {
        scriptEl = document.createElement("script");
        // Wrap user script in IIFE+try so a single null deref doesn't blank the page
        scriptEl.text = "(function(){try{\n" + SCRIPT + "\n}catch(e){console.error('tri page script error',e);}})();";
        document.body.appendChild(scriptEl);
      } catch (e) { console.error("page script error", e); }
    }, 0);

    return () => {
      window.clearTimeout(t);
      styleEl.remove();
      scriptEl?.remove();
      document.body.style.background = prevBg;
      document.body.style.color = prevColor;
    };
  }, []);

  // Intercept internal link clicks for smooth SPA routing
  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = (e.target as HTMLElement).closest("a");
    if (!a) return;
    const href = a.getAttribute("href") || "";
    if (href.startsWith("/") && !href.startsWith("//")) {
      e.preventDefault();
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
      className="tri-about tri-page-fade"
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: HTML }}
    />
  );
};

export default About;
