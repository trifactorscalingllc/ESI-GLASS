import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const CSS = `
    /* ======================== RESET & VARIABLES ======================== */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .tri-results {
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
    } .tri-results { scroll-behavior: smooth; }

    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: var(--black); }
    ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--gold-light); }
    * { scrollbar-width: thin; scrollbar-color: var(--gold) var(--black); } .tri-results {
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
      margin: 0 auto 52px;
      line-height: 1.8;
      opacity: 0; animation: fadeUp 0.7s ease 0.4s forwards;
    }
    .hero-stats-row {
      display: flex; align-items: center; justify-content: center;
      gap: 0; flex-wrap: wrap;
      opacity: 0; animation: fadeUp 0.7s ease 0.55s forwards;
    }
    .hstat {
      display: flex; flex-direction: column; gap: 4px;
      padding: 0 32px;
      border-right: 1px solid var(--border-mid);
    }
    .hstat:last-child { border-right: none; }
    .hstat-val {
      font-family: var(--fh); font-weight: 800; font-size: 1.5rem;
      color: var(--gold); letter-spacing: -0.03em; line-height: 1;
    }
    .hstat-lbl { font-size: 0.74rem; color: var(--gray); font-weight: 400; }
    @media (max-width: 600px) {
      .hstat { padding: 10px 20px; border-right: none; border-bottom: 1px solid var(--border-mid); }
      .hstat:last-child { border-bottom: none; }
      .hero-stats-row { flex-direction: column; align-items: center; }
    }

    /* ======================== FEATURED CASE ======================== */
    #featured-case {
      background: var(--surface);
      padding: 96px 0;
      position: relative;
    }
    #featured-case::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent 0%, var(--gold-dark) 20%, var(--gold) 50%, var(--gold-dark) 80%, transparent 100%);
      opacity: 0.5;
    }

    /* Left-aligned section header variant */
    .section-header {
      text-align: center;
      margin-bottom: 56px;
    }
    .section-header h2 {
      font-size: clamp(1.7rem, 3vw, 2.4rem);
      font-weight: 800;
      margin-top: 18px;
    }
    .section-header-left {
      margin-bottom: 48px;
    }
    .section-header-left h2 {
      font-size: clamp(1.7rem, 3vw, 2.4rem);
      font-weight: 800;
      margin-top: 18px;
    }

    /* Featured case SPLIT layout */
    .featured-case-split {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 52px;
      align-items: start;
      background: #111007;
      border: 1px solid var(--gold-border);
      border-left: 4px solid var(--gold);
      border-radius: 3px;
      overflow: hidden;
      position: relative;
    }
    .featured-case-split::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      background: radial-gradient(ellipse 50% 60% at 100% 0%, rgba(212,175,55,0.05) 0%, transparent 65%);
      pointer-events: none;
    }
    .featured-story {
      padding: 48px 40px 48px 48px;
      position: relative; z-index: 2;
    }
    .featured-metrics {
      background: rgba(212,175,55,0.04);
      border-left: 1px solid var(--gold-border);
      padding: 48px 36px;
      display: flex;
      flex-direction: column;
      gap: 32px;
      position: relative; z-index: 2;
    }
    .featured-meta {
      display: flex; align-items: center; gap: 12px;
      margin-bottom: 28px; flex-wrap: wrap;
    }
    .featured-badge {
      font-family: var(--fb); font-size: 0.62rem; font-weight: 700;
      letter-spacing: 0.18em; text-transform: uppercase;
      background: var(--gold-dim); border: 1px solid var(--gold-border);
      color: var(--gold); padding: 5px 12px; border-radius: 2px;
    }
    .featured-business-name {
      font-family: var(--fh); font-size: 1.05rem; font-weight: 800;
      color: var(--white);
    }
    .featured-business-type {
      font-size: 0.78rem; color: var(--gray);
    }
    .featured-separator { width: 1px; height: 18px; background: var(--border-mid); }

    .case-block-label {
      font-family: var(--fb); font-size: 0.62rem; font-weight: 700;
      letter-spacing: 0.16em; text-transform: uppercase;
      color: var(--gray); margin-bottom: 12px;
    }
    .case-block-text {
      font-size: 0.9rem; color: var(--gray-light); line-height: 1.78;
    }
    .case-story-block { margin-bottom: 28px; }
    .case-story-block:last-child { margin-bottom: 0; }

    .built-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
    .built-list li {
      display: flex; align-items: flex-start; gap: 10px;
      font-size: 0.87rem; color: var(--off-white); line-height: 1.5;
    }
    .built-check { color: var(--gold); font-size: 0.75rem; flex-shrink: 0; margin-top: 2px; }

    .tag-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 28px; }
    .tag-badge {
      font-family: var(--fb); font-size: 0.7rem; font-weight: 600;
      background: rgba(255,255,255,0.04); border: 1px solid var(--border-mid);
      color: var(--gray-light); padding: 5px 12px; border-radius: 2px;
    }

    /* Outcome metric blocks */
    .outcome-metric {
      padding-bottom: 28px;
      border-bottom: 1px solid var(--gold-border);
    }
    .outcome-metric:last-of-type { border-bottom: none; padding-bottom: 0; }
    .outcome-metric-val {
      font-family: var(--fh); font-size: 2.4rem; font-weight: 800;
      color: var(--gold); letter-spacing: -0.04em; line-height: 1;
      margin-bottom: 6px;
    }
    .outcome-metric-label {
      font-family: var(--fh); font-size: 0.88rem; font-weight: 700;
      color: var(--white); margin-bottom: 4px;
    }
    .outcome-metric-sub {
      font-size: 0.78rem; color: var(--gray); line-height: 1.5;
    }
    .outcome-summary {
      font-size: 0.88rem; color: var(--gold);
      line-height: 1.75; font-style: italic;
      padding-top: 8px;
      border-top: 1px solid var(--gold-border);
    }

    @media (max-width: 900px) {
      .featured-case-split { grid-template-columns: 1fr; }
      .featured-metrics { border-left: none; border-top: 1px solid var(--gold-border); padding: 36px 40px; flex-direction: row; flex-wrap: wrap; gap: 20px; }
      .outcome-metric { padding-bottom: 0; border-bottom: none; flex: 1; min-width: 140px; }
    }
    @media (max-width: 600px) {
      .featured-story { padding: 28px 24px; }
      .featured-metrics { padding: 28px 24px; }
    }

    /* ======================== CLIENT GRID ======================== */
    #client-grid {
      background: var(--black);
      padding: 96px 0;
      position: relative;
    }
    #client-grid::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent 0%, var(--gold-dark) 20%, var(--gold) 50%, var(--gold-dark) 80%, transparent 100%);
      opacity: 0.4;
    }

    /* 2+3 masonry client grid */
    .client-cards-row-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    .client-cards-row-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 20px;
    }
    /* Legacy selector kept for mobile fallback */
    .client-cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    .client-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 2px;
      padding: 32px 28px;
      display: flex; flex-direction: column; gap: 0;
      transition: border-color 0.25s ease, background 0.25s ease;
    }
    .client-card:hover {
      border-color: var(--gold-border);
      background: var(--card-hover);
    }

    .client-card-top {
      margin-bottom: 22px;
      padding-bottom: 18px;
      border-bottom: 1px solid var(--border);
    }
    .client-type-label {
      font-family: var(--fb); font-size: 0.6rem; font-weight: 700;
      letter-spacing: 0.2em; text-transform: uppercase;
      color: var(--gold); margin-bottom: 8px;
    }
    .client-name {
      font-family: var(--fh); font-size: 1.15rem; font-weight: 800;
      color: var(--white); margin-bottom: 4px; line-height: 1.2;
    }
    .client-industry {
      font-size: 0.76rem; color: var(--gray);
    }

    .client-problem-label {
      font-size: 0.62rem; font-weight: 700; letter-spacing: 0.14em;
      text-transform: uppercase; color: var(--gray); margin-bottom: 8px;
      margin-top: 18px; font-family: var(--fb);
    }
    .client-problem-text {
      font-size: 0.86rem; color: var(--gray-light); line-height: 1.72;
    }

    .client-built-label {
      font-size: 0.62rem; font-weight: 700; letter-spacing: 0.14em;
      text-transform: uppercase; color: var(--gray); margin-bottom: 10px;
      margin-top: 18px; font-family: var(--fb);
    }
    .client-built-list { list-style: none; display: flex; flex-direction: column; gap: 6px; }
    .client-built-list li {
      display: flex; align-items: flex-start; gap: 8px;
      font-size: 0.82rem; color: var(--off-white); line-height: 1.5;
    }
    .client-built-list li::before {
      content: '✦';
      color: var(--gold); font-size: 0.65rem; flex-shrink: 0; margin-top: 3px;
    }

    .client-outcome {
      margin-top: 20px;
      padding-top: 18px;
      border-top: 1px solid var(--border);
    }
    .client-outcome-label {
      font-size: 0.62rem; font-weight: 700; letter-spacing: 0.14em;
      text-transform: uppercase; color: var(--gold-dark); margin-bottom: 8px;
      font-family: var(--fb);
    }
    .client-outcome-text {
      font-size: 0.85rem; color: var(--gold); line-height: 1.7;
      font-style: italic;
    }

    @media (max-width: 900px) {
      .client-cards-row-2 { grid-template-columns: 1fr; }
      .client-cards-row-3 { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 480px) {
      .client-cards-row-3 { grid-template-columns: 1fr; }
    }

    /* ======================== TESTIMONIALS ======================== */
    #testimonials {
      background: var(--surface);
      padding: 96px 0;
      position: relative;
    }
    #testimonials::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent 0%, var(--gold-dark) 20%, var(--gold) 50%, var(--gold-dark) 80%, transparent 100%);
      opacity: 0.4;
    }

    /* Large standalone quote — leads the section with no header */
    .testi-lead-quote {
      margin-bottom: 48px;
      position: relative;
    }
    .testi-lead-quote::before {
      content: '\\201C';
      position: absolute; top: -32px; left: -8px;
      font-family: var(--fh); font-size: 12rem; font-weight: 800;
      color: var(--gold); opacity: 0.06; line-height: 1;
      pointer-events: none;
    }
    .testi-lead-text {
      font-family: var(--fh);
      font-size: clamp(1.4rem, 2.8vw, 2rem);
      font-weight: 600;
      color: var(--off-white);
      line-height: 1.5;
      max-width: 860px;
      margin-bottom: 28px;
      position: relative;
      z-index: 2;
    }
    .testi-featured {
      background: var(--card);
      border: 1px solid var(--gold-border);
      border-radius: 3px;
      padding: 48px 52px;
      margin-bottom: 28px;
      position: relative;
      overflow: hidden;
    }
    .testi-featured::before {
      content: '\\201C';
      position: absolute; top: -10px; left: 32px;
      font-family: var(--fh); font-size: 8rem; font-weight: 800;
      color: var(--gold); opacity: 0.08; line-height: 1;
      pointer-events: none;
    }
    .testi-featured-inner { position: relative; z-index: 2; }
    .testi-featured-quote {
      font-family: var(--fh); font-size: clamp(1.1rem, 2.2vw, 1.4rem);
      font-weight: 600; color: var(--off-white);
      line-height: 1.65; margin-bottom: 32px;
    }
    .testi-author {
      display: flex; align-items: center; gap: 14px;
    }
    .testi-avatar {
      width: 44px; height: 44px; border-radius: 50%;
      background: var(--gold-dim); border: 1.5px solid var(--gold-border);
      display: flex; align-items: center; justify-content: center;
      font-family: var(--fh); font-size: 0.8rem; font-weight: 800;
      color: var(--gold); flex-shrink: 0;
    }
    .testi-author-name {
      font-family: var(--fh); font-size: 0.9rem; font-weight: 700;
      color: var(--white);
    }
    .testi-author-biz {
      font-size: 0.75rem; color: var(--gray);
    }
    .testi-stars { color: var(--gold); font-size: 0.72rem; letter-spacing: 2px; margin-bottom: 3px; }

    .testi-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .testi-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 2px;
      padding: 32px 28px;
      transition: border-color 0.25s ease;
    }
    .testi-card:hover { border-color: var(--gold-border); }
    .testi-card-quote {
      font-size: 0.92rem; color: var(--gray-light); line-height: 1.8;
      margin-bottom: 24px;
    }

    @media (max-width: 768px) {
      .testi-featured { padding: 32px 28px; }
      .testi-row { grid-template-columns: 1fr; }
    }
    @media (max-width: 480px) {
      .testi-featured { padding: 24px 20px; }
      .testi-lead-text { font-size: 1.25rem; }
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

    /* ======================== RESPONSIVE ======================== */
    @media (max-width: 900px) {
      section { padding: 72px 0; }
      #featured-case, #client-grid, #testimonials, #final-cta { padding: 72px 0; }
      .page-hero { padding: 130px 0 72px; }
    }
    @media (max-width: 768px) {
      section { padding: 72px 0; }
      .page-hero { padding: 130px 0 72px; }
    }
    @media (max-width: 600px) {
      .container { padding: 0 18px; }
      section { padding: 56px 0; }
      #featured-case, #client-grid, #testimonials, #final-cta { padding: 56px 0; }
      .page-hero h1 { font-size: 2rem; }
      .footer-top { flex-direction: column; gap: 28px; }
    }
    @media (max-width: 480px) {
      .page-hero { padding: 110px 0 56px; }
      .cta-headline { font-size: 1.9rem; }
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
        <li><a href="/results" class="nav-link active-nav" id="results-link">Results</a></li>
        <li><a href="/about" class="nav-link" id="about-link">About</a></li>
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
  <a href="/results" class="active-nav">Results</a>
  <a href="/about">About</a>
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
<section class="page-hero" style="text-align:left;padding:160px 0 80px;">
  <div class="page-hero-glow"></div>
  <div class="container">
    <div class="page-hero-inner">
      <h1 style="max-width:780px;margin:0 0 22px;text-align:center;">Built for real businesses.<br><span class="gold-shimmer">Running right now.</span></h1>
      <p class="page-hero-sub" style="margin:0 0 52px;">Every system below is live and operational inside a client's business. These are the problems we walked into, the systems we built, and what happened after.</p>

      <!-- Left-aligned horizontal stats strip -->
      <div style="display:flex;gap:0;border:1px solid var(--border);border-radius:2px;overflow:hidden;max-width:700px;opacity:0;animation:fadeUp 0.7s ease 0.55s forwards;">
        <div style="padding:20px 32px;border-right:1px solid var(--border);flex:1;">
          <div style="font-family:var(--fh);font-size:1.9rem;font-weight:800;color:var(--gold);letter-spacing:-0.03em;line-height:1;">6</div>
          <div style="font-size:0.72rem;color:var(--gray);margin-top:4px;font-weight:500;">Active Clients</div>
        </div>
        <div style="padding:20px 32px;border-right:1px solid var(--border);flex:1;">
          <div style="font-family:var(--fh);font-size:1.9rem;font-weight:800;color:var(--gold);letter-spacing:-0.03em;line-height:1;">4</div>
          <div style="font-size:0.72rem;color:var(--gray);margin-top:4px;font-weight:500;">Industries</div>
        </div>
        <div style="padding:20px 32px;border-right:1px solid var(--border);flex:1;">
          <div style="font-family:var(--fh);font-size:1.9rem;font-weight:800;color:var(--gold);letter-spacing:-0.03em;line-height:1;">100%</div>
          <div style="font-size:0.72rem;color:var(--gray);margin-top:4px;font-weight:500;">Systems Live</div>
        </div>
        <div style="padding:20px 32px;flex:1;">
          <div style="font-family:var(--fh);font-size:1.1rem;font-weight:800;color:var(--gold);letter-spacing:-0.02em;line-height:1.2;">From<br>scratch</div>
          <div style="font-size:0.72rem;color:var(--gray);margin-top:4px;font-weight:500;">No templates</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ======================== SECTION 2: FEATURED CASE — CUTBYDACK ======================== -->
<section id="featured-case">
  <div class="container">
    <div class="section-header-left reveal">
      <span class="eyebrow"><span class="eline"></span>Featured Case Study</span>
      <h2>The deep dive: CutByDack</h2>
    </div>

    <div class="featured-case-split reveal">

      <!-- Left: story + context -->
      <div class="featured-story">
        <div class="featured-meta">
          <span class="featured-badge">Featured Client</span>
          <span class="featured-separator"></span>
          <span class="featured-business-name">CutByDack</span>
          <span class="featured-separator"></span>
          <span class="featured-business-type">Barbershop · Toronto, ON</span>
        </div>

        <div class="case-story-block">
          <div class="case-block-label">The Problem</div>
          <p class="case-block-text">Bookings were managed through Instagram DMs and phone calls. Leads from social media went cold within hours. No reminder system, constant no-shows, and the owner was spending 2+ hours per day on manual scheduling — time that should have been spent behind the chair.</p>
        </div>

        <div class="case-story-block">
          <div class="case-block-label">What We Built</div>
          <ul class="built-list">
            <li><span class="built-check">✦</span>Automated booking system built on GHL</li>
            <li><span class="built-check">✦</span>Instagram DM trigger — booking link sent instantly on inquiry</li>
            <li><span class="built-check">✦</span>Instant confirmation SMS fires on every booking</li>
            <li><span class="built-check">✦</span>24-hour reminder sequence — cuts no-show rate significantly</li>
            <li><span class="built-check">✦</span>Full appointment pipeline tracked in GHL</li>
          </ul>
        </div>

        <div class="tag-row">
          <span class="tag-badge">GHL CRM</span>
          <span class="tag-badge">Booking System</span>
          <span class="tag-badge">SMS Automation</span>
          <span class="tag-badge">Instagram Integration</span>
        </div>
      </div>

      <!-- Right: outcomes/metrics box -->
      <div class="featured-metrics">
        <div style="font-family:var(--fb);font-size:0.62rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--gold);margin-bottom:8px;">Outcomes</div>

        <div class="outcome-metric">
          <div class="outcome-metric-val">~0</div>
          <div class="outcome-metric-label">Manual booking effort</div>
          <div class="outcome-metric-sub">From 2+ hours/day to near-zero. System handles every step automatically.</div>
        </div>

        <div class="outcome-metric">
          <div class="outcome-metric-val">60%+</div>
          <div class="outcome-metric-label">No-show reduction</div>
          <div class="outcome-metric-sub">Automated reminder sequence fires 24 hours before every appointment.</div>
        </div>

        <div class="outcome-metric">
          <div class="outcome-metric-val">Instant</div>
          <div class="outcome-metric-label">Lead response time</div>
          <div class="outcome-metric-sub">Every Instagram DM triggers a booking link within seconds — not hours.</div>
        </div>

        <div class="outcome-summary">
          "Consistent chair utilization. Every appointment tracked in one place. The system runs without me touching it."
        </div>
      </div>

    </div>
  </div>
</section>

<!-- ======================== SECTION 3: CLIENT GRID ======================== -->
<section id="client-grid">
  <div class="container">
    <div class="section-header reveal">
      <span class="eyebrow"><span class="eline"></span>All Active Clients<span class="eline"></span></span>
      <h2>Five more systems. Five more businesses.</h2>
    </div>

    <!-- Row 1: 2 wider cards -->
    <div class="client-cards-row-2">

      <!-- RAMPAL RESTORES -->
      <div class="client-card reveal">
        <div class="client-card-top">
          <div class="client-type-label">Home Restoration · Toronto, ON</div>
          <div class="client-name">Rampal Restores</div>
        </div>
        <div class="client-problem-label">The Problem</div>
        <p class="client-problem-text">Leads came in at all hours. By morning, cold. Manual follow-up inconsistent — owner was doing everything himself, missing jobs he'd already paid to acquire.</p>
        <div class="client-built-label">What We Built</div>
        <ul class="client-built-list">
          <li>24/7 lead capture form + GHL CRM</li>
          <li>7-touch automated SMS follow-up sequence</li>
          <li>Full pipeline tracking</li>
        </ul>
        <div class="client-outcome">
          <div class="client-outcome-label">Outcome</div>
          <p class="client-outcome-text">"Every lead gets a response in under 2 minutes. Pipeline visible for the first time. No more lost jobs from slow follow-up."</p>
        </div>
      </div>

      <!-- PROFITABLE BARBERS -->
      <div class="client-card reveal" style="transition-delay:0.07s">
        <div class="client-card-top">
          <div class="client-type-label">Barber Business Coaching</div>
          <div class="client-name">Profitable Barbers</div>
        </div>
        <div class="client-problem-label">The Problem</div>
        <p class="client-problem-text">Student enrollment was fully manual — direct DMs, back-and-forth, no system. Revenue was unpredictable month-to-month.</p>
        <div class="client-built-label">What We Built</div>
        <ul class="client-built-list">
          <li>Automated enrollment funnel</li>
          <li>Email/SMS nurture sequence</li>
          <li>GHL pipeline for student tracking</li>
        </ul>
        <div class="client-outcome">
          <div class="client-outcome-label">Outcome</div>
          <p class="client-outcome-text">"Consistent monthly enrollment. Owner pitches less, the funnel does the qualifying."</p>
        </div>
      </div>

    </div>

    <!-- Row 2: 3 normal cards -->
    <div class="client-cards-row-3">

      <!-- DIONET ACADEMY -->
      <div class="client-card reveal">
        <div class="client-card-top">
          <div class="client-type-label">Online Education</div>
          <div class="client-name">Dionet Academy</div>
        </div>
        <div class="client-problem-label">The Problem</div>
        <p class="client-problem-text">Traffic existed but there was no real conversion system. Visitors arrived and left with no follow-up. No visibility into what was working.</p>
        <div class="client-built-label">What We Built</div>
        <ul class="client-built-list">
          <li>Traffic-to-enrollment funnel</li>
          <li>AppSheet dashboard for lead tracking</li>
          <li>Automated nurture sequence</li>
        </ul>
        <div class="client-outcome">
          <div class="client-outcome-label">Outcome</div>
          <p class="client-outcome-text">"Every lead tracked from first click to enrollment. Conversion data visible in real time."</p>
        </div>
      </div>

      <!-- LEADCOMPASS -->
      <div class="client-card reveal" style="transition-delay:0.07s">
        <div class="client-card-top">
          <div class="client-type-label">Lead Generation Agency</div>
          <div class="client-name">LeadCompass</div>
        </div>
        <div class="client-problem-label">The Problem</div>
        <p class="client-problem-text">As lead volume grew, the manual routing process couldn't keep up. Scaling meant hiring, which ate into margin.</p>
        <div class="client-built-label">What We Built</div>
        <ul class="client-built-list">
          <li>Full GHL funnel ecosystem</li>
          <li>Automated lead routing + distribution</li>
          <li>Pipeline management system</li>
        </ul>
        <div class="client-outcome">
          <div class="client-outcome-label">Outcome</div>
          <p class="client-outcome-text">"Higher volume processed without adding headcount. Every lead routed and tracked automatically."</p>
        </div>
      </div>

      <!-- MECTRIX MEDIA -->
      <div class="client-card reveal" style="transition-delay:0.14s">
        <div class="client-card-top">
          <div class="client-type-label">Media &amp; Content</div>
          <div class="client-name">Mectrix Media</div>
        </div>
        <div class="client-problem-label">The Problem</div>
        <p class="client-problem-text">Large, engaged audience with no monetization system. Content was driving attention but not revenue.</p>
        <div class="client-built-label">What We Built</div>
        <ul class="client-built-list">
          <li>Monetization funnel</li>
          <li>Lead capture system</li>
          <li>GHL pipeline: audience → paying clients</li>
        </ul>
        <div class="client-outcome">
          <div class="client-outcome-label">Outcome</div>
          <p class="client-outcome-text">"Revenue pipeline built on top of existing audience. Structured conversion where none existed."</p>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- ======================== SECTION 4: TESTIMONIALS ======================== -->
<section id="testimonials">
  <div class="container">

    <!-- Large quote leads — no separate section header -->
    <div class="testi-lead-quote reveal">
      <p class="testi-lead-text">"I was very impressed with the pricing and the simple process of working with him and his team. The website is absolutely amazing — we will be using their services again."</p>
      <div class="testi-author">
        <div class="testi-avatar">JD</div>
        <div>
          <div class="testi-stars">★★★★★</div>
          <div class="testi-author-name">Jordan — Mectrix Media</div>
          <div class="testi-author-biz">Media &amp; Content</div>
        </div>
      </div>
    </div>

    <!-- 2 supporting cards -->
    <div class="testi-row reveal">
      <div class="testi-card">
        <p class="testi-card-quote">"Evan and Gavin helped me scale my product into a brand. I can't thank them enough for the help they gave!"</p>
        <div class="testi-author">
          <div class="testi-avatar">AA</div>
          <div>
            <div class="testi-stars">★★★★★</div>
            <div class="testi-author-name">Aiden A.</div>
            <div class="testi-author-biz">Lumina Sphere</div>
          </div>
        </div>
      </div>
      <div class="testi-card">
        <p class="testi-card-quote">"Good service, scaled my brand up from nothing."</p>
        <div class="testi-author">
          <div class="testi-avatar">VW</div>
          <div>
            <div class="testi-stars">★★★★★</div>
            <div class="testi-author-name">Vultus Worldwide</div>
            <div class="testi-author-biz">Brand &amp; Identity</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</section>

<!-- ======================== SECTION 5: FINAL CTA ======================== -->
<section id="final-cta">
  <div class="container">
    <div class="cta-inner">
      <h2 class="cta-headline reveal">
        Every client above<br>
        started with one<br>
        <span class="gold-shimmer">free call.</span>
      </h2>

      <p class="cta-body reveal">45 minutes. No pitch. No pressure. We show you exactly what system you need and hand you a blueprint — whether you hire us or not.</p>

      <div class="cta-actions reveal">
        <a href="/apply" class="btn-gold">Book Your Free Growth Audit →</a>
      </div>

      <p class="cta-sub reveal">Or email us at <a href="mailto:trifactorscaling@gmail.com">trifactorscaling@gmail.com</a></p>
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

const Results = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top on page mount
    window.scrollTo(0, 0);

    // Force black body background for full-bleed dark pages
    const prevBg = document.body.style.background;
    const prevColor = document.body.style.color;
    document.body.style.background = "#000000";
    document.body.style.color = "#FFFFFF";

    // Inject scoped CSS once per page
    const styleEl = document.createElement("style");
    styleEl.setAttribute("data-tri-page", "tri-results");
    styleEl.innerHTML = CSS;
    document.head.appendChild(styleEl);

    // Run page scripts after DOM is mounted
    let scriptEl: HTMLScriptElement | null = null;
    const t = window.setTimeout(() => {
      try {
        scriptEl = document.createElement("script");
        scriptEl.text = SCRIPT;
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
      className="tri-results tri-page-fade"
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: HTML }}
    />
  );
};

export default Results;
