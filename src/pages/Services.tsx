import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const CSS = `
    /* ======================== RESET & VARIABLES ======================== */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .tri-services {
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
    } .tri-services { scroll-behavior: smooth; }

    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: var(--black); }
    ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--gold-light); }
    * { scrollbar-width: thin; scrollbar-color: var(--gold) var(--black); } .tri-services {
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
      max-width: 560px;
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

    /* ======================== SERVICE SECTION BASE ======================== */
    .service-section {
      padding: 96px 0;
      position: relative;
    }
    .service-section::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent 0%, var(--gold-dark) 20%, var(--gold) 50%, var(--gold-dark) 80%, transparent 100%);
      opacity: 0.5;
    }
    .service-section:first-of-type::before { display: none; }
    .service-section.bg-black { background: var(--black); }
    .service-section.bg-surface { background: var(--surface); }

    .service-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 72px;
      align-items: start;
    }
    .service-grid.reversed .service-left { order: 2; }
    .service-grid.reversed .service-right { order: 1; }

    .service-eyebrow { margin-bottom: 18px; }
    .service-num {
      font-family: var(--fh); font-size: 0.68rem; font-weight: 800;
      letter-spacing: 0.22em; color: var(--gold-dark); text-transform: uppercase;
    }
    .service-title {
      font-size: clamp(1.7rem, 3vw, 2.4rem);
      font-weight: 800;
      margin-bottom: 18px;
      line-height: 1.1;
    }
    .service-lead {
      font-size: 0.96rem;
      color: var(--gray-light);
      line-height: 1.82;
      margin-bottom: 32px;
    }

    /* Feature list */
    .feature-list { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
    .feature-list li {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      font-size: 0.88rem;
      color: var(--off-white);
      line-height: 1.6;
    }
    .feature-check {
      color: var(--gold);
      font-size: 0.8rem;
      flex-shrink: 0;
      margin-top: 2px;
    }

    /* Info cards */
    .info-cards { display: flex; flex-direction: column; gap: 16px; }
    .info-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-left: 3px solid var(--gold-border);
      padding: 22px 24px;
      border-radius: 2px;
    }
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
      line-height: 1.72;
    }

    /* Timeline badge */
    .timeline-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--gold-dim);
      border: 1px solid var(--gold-border);
      padding: 8px 16px;
      border-radius: 2px;
      margin-top: 8px;
    }
    .timeline-badge-dot {
      width: 6px; height: 6px;
      background: var(--gold);
      border-radius: 50%;
      flex-shrink: 0;
      animation: pulse-dot 2.4s ease-in-out infinite;
    }
    @keyframes pulse-dot {
      0%, 100% { box-shadow: none; opacity: 1; }
      50% { box-shadow: 0 0 0 4px rgba(212,175,55,0.2); opacity: 0.8; }
    }
    .timeline-badge span {
      font-family: var(--fh);
      font-size: 0.74rem;
      font-weight: 700;
      color: var(--gold);
      letter-spacing: 0.04em;
    }
    .timeline-badge-label {
      font-size: 0.7rem;
      color: var(--gray);
      font-family: var(--fb);
    }

    @media (max-width: 900px) {
      .service-grid { grid-template-columns: 1fr; gap: 44px; }
      .service-grid.reversed .service-left { order: 0; }
      .service-grid.reversed .service-right { order: 0; }
    }

    /* ======================== FULL STACK SECTION ======================== */
    #full-stack {
      background: var(--surface);
      padding: 96px 0;
      position: relative;
      overflow: hidden;
    }
    #full-stack::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent 0%, var(--gold-dark) 20%, var(--gold) 50%, var(--gold-dark) 80%, transparent 100%);
      opacity: 0.5;
    }
    .fullstack-header {
      text-align: center;
      max-width: 680px;
      margin: 0 auto 64px;
    }
    .fullstack-header h2 {
      font-size: clamp(1.8rem, 3.5vw, 2.7rem);
      font-weight: 800;
      margin-bottom: 18px;
    }
    .fullstack-header p {
      font-size: 0.95rem;
      color: var(--gray-light);
      line-height: 1.82;
    }

    /* Pipeline flow */
    .pipeline-flow {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0;
      flex-wrap: nowrap;
      overflow-x: auto;
      padding-bottom: 8px;
    }
    .pipeline-stage {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }
    .pipeline-stage-box {
      background: var(--card);
      border: 1px solid var(--border);
      padding: 28px 32px;
      border-radius: 3px;
      text-align: center;
      min-width: 150px;
      position: relative;
      transition: border-color 0.3s ease, background 0.3s ease;
    }
    .pipeline-stage-box:hover {
      border-color: var(--gold-border);
      background: rgba(212,175,55,0.04);
    }
    .pipeline-stage-box::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, var(--gold-dark), var(--gold));
      opacity: 0.5;
    }
    .pipeline-stage-num {
      font-family: var(--fh);
      font-size: 0.58rem;
      font-weight: 800;
      letter-spacing: 0.2em;
      color: var(--gold-dark);
      margin-bottom: 6px;
    }
    .pipeline-stage-name {
      font-family: var(--fh);
      font-size: 0.95rem;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--white);
    }
    .pipeline-stage-sub {
      font-size: 0.7rem;
      color: var(--gray);
      margin-top: 4px;
      line-height: 1.5;
    }
    .pipeline-stage-label {
      font-size: 0.68rem;
      color: var(--gold);
      font-weight: 600;
      font-family: var(--fb);
      letter-spacing: 0.08em;
    }

    .pipeline-connector {
      display: flex;
      align-items: center;
      padding: 0 4px;
      flex-shrink: 0;
    }
    .pipeline-line {
      width: 48px;
      height: 1.5px;
      background: linear-gradient(to right, var(--gold-dark), var(--gold), var(--gold-dark));
      opacity: 0.6;
    }
    .pipeline-arrow {
      width: 0; height: 0;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
      border-left: 8px solid var(--gold);
      opacity: 0.6;
    }

    @media (max-width: 768px) {
      .pipeline-flow { justify-content: flex-start; }
      .pipeline-stage-box { min-width: 120px; padding: 20px 18px; }
      .pipeline-line { width: 28px; }
    }

    /* ======================== TECH STACK SECTION ======================== */
    #tech-stack {
      background: var(--black);
      padding: 96px 0;
      position: relative;
    }
    #tech-stack::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent 0%, var(--gold-dark) 20%, var(--gold) 50%, var(--gold-dark) 80%, transparent 100%);
      opacity: 0.4;
    }

    /* 2-col tech split layout */
    .tech-split {
      display: grid;
      grid-template-columns: 380px 1fr;
      gap: 80px;
      align-items: start;
    }
    .tech-split-left { padding-top: 8px; }
    .tech-split-left h2 {
      font-size: clamp(1.7rem, 2.8vw, 2.4rem);
      font-weight: 800;
      margin-top: 18px;
      margin-bottom: 20px;
      line-height: 1.1;
    }
    .tech-split-left p {
      font-size: 0.94rem;
      color: var(--gray-light);
      line-height: 1.82;
      margin-bottom: 28px;
    }
    .tech-split-note {
      background: var(--card);
      border: 1px solid var(--border);
      border-left: 3px solid var(--gold-border);
      padding: 18px 20px;
      border-radius: 2px;
    }
    .tech-split-note p {
      font-size: 0.82rem;
      color: var(--gray);
      line-height: 1.7;
      margin-bottom: 0;
    }
    .tech-split-note strong { color: var(--gold); font-weight: 600; }

    .tech-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1px;
      background: var(--border);
      border: 1px solid var(--border);
    }
    .tech-card {
      background: var(--card);
      padding: 32px 28px;
      transition: background 0.22s ease;
    }
    .tech-card:hover { background: var(--card-hover); }
    .tech-card-name {
      font-family: var(--fh);
      font-size: 1.05rem;
      font-weight: 800;
      margin-bottom: 6px;
      color: var(--white);
    }
    .tech-card-role {
      font-size: 0.68rem;
      font-weight: 700;
      color: var(--gold);
      letter-spacing: 0.14em;
      text-transform: uppercase;
      margin-bottom: 14px;
    }
    .tech-card p {
      font-size: 0.83rem;
      color: var(--gray-light);
      line-height: 1.7;
    }

    @media (max-width: 900px) {
      .tech-split { grid-template-columns: 1fr; gap: 48px; }
    }
    @media (max-width: 480px) {
      .tech-grid { grid-template-columns: 1fr; }
    }

    /* ======================== FAQ ======================== */
    #faq {
      background: var(--surface);
      padding: 96px 0;
      position: relative;
    }
    #faq::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent 0%, var(--gold-dark) 20%, var(--gold) 50%, var(--gold-dark) 80%, transparent 100%);
      opacity: 0.4;
    }
    /* FAQ 2-col layout */
    .faq-split {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 80px;
      align-items: start;
    }
    .faq-split-left { padding-top: 4px; }
    .faq-split-left h2 {
      font-size: clamp(2rem, 3.5vw, 3rem);
      font-weight: 800;
      margin-top: 18px;
      margin-bottom: 18px;
      line-height: 1.05;
    }
    .faq-split-left p {
      font-size: 0.88rem;
      color: var(--gray-light);
      line-height: 1.75;
      margin-bottom: 28px;
    }
    @media (max-width: 900px) {
      .faq-split { grid-template-columns: 1fr; gap: 44px; }
    }

    .faq-list { max-width: 760px; margin: 0 auto; }
    .faq-item { border-bottom: 1px solid var(--border); }
    .faq-item:first-child { border-top: 1px solid var(--border); }
    .faq-q {
      display: flex; align-items: center; justify-content: space-between; gap: 20px;
      padding: 22px 0; cursor: pointer;
      background: none; border: none; width: 100%; text-align: left;
    }
    .faq-q-text {
      font-family: var(--fh); font-size: 0.97rem; font-weight: 700;
      color: var(--off-white); line-height: 1.4;
    }
    .faq-icon {
      width: 24px; height: 24px; flex-shrink: 0;
      border: 1px solid var(--border-mid); border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: var(--gold); font-size: 1rem; font-weight: 300; line-height: 1;
      transition: transform 0.3s ease, border-color 0.3s ease;
    }
    .faq-item.open .faq-icon { transform: rotate(45deg); border-color: var(--gold-border); }
    .faq-a {
      max-height: 0; overflow: hidden;
      transition: max-height 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
    }
    .faq-a-inner {
      font-size: 0.9rem; color: var(--gray-light); line-height: 1.8;
      padding: 0 0 24px;
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
    @keyframes avail-pulse {
      0%, 100% { box-shadow: none; }
      50% { box-shadow: 0 0 0 4px rgba(62,207,110,0.2); }
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
    @media (max-width: 768px) {
      section { padding: 72px 0; }
      .service-section { padding: 72px 0; }
      #full-stack, #tech-stack, #faq, #final-cta { padding: 72px 0; }
      .page-hero { padding: 130px 0 72px; }
    }
    @media (max-width: 600px) {
      .container { padding: 0 18px; }
      section { padding: 56px 0; }
      .service-section { padding: 56px 0; }
      .page-hero h1 { font-size: 2rem; }
      .service-title { font-size: 1.55rem; }
      .footer-top { flex-direction: column; gap: 28px; }
    }
    @media (max-width: 480px) {
      .page-hero { padding: 110px 0 56px; }
      .cta-headline { font-size: 1.9rem; }
    }
  

.tri-page-hero-canvas {
  position: absolute; inset: 0; width: 100%; height: 100%;
  pointer-events: none; z-index: 0;
}
.page-hero { position: relative; overflow: hidden; }
.page-hero > .container, .page-hero > .page-hero-inner { position: relative; z-index: 2; }
`;
const HTML = `

<!-- ======================== NAV ======================== -->
<nav id="navbar">
  <div class="container">
    <div class="nav-inner">
      <a href="/" class="nav-logo"><img src="/tfs-logo.png" alt="TriFactor Scaling"></a>
      <ul class="nav-links">
        <li><a href="/" class="nav-link">Overview</a></li>
        <li><a href="/services" class="nav-link active-nav">Services</a></li>
        <li><a href="/results" class="nav-link">Results</a></li>
        <li><a href="/about" class="nav-link">About</a></li>
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
  <a href="/services" class="active-nav">Services</a>
  <a href="/results">Results</a>
  <a href="/about">About</a>
  <a href="/apply">Apply Now →</a>
</div>

<!-- ======================== SECTION 1: PAGE HERO ======================== -->
<section class="page-hero">
  <canvas class="tri-page-hero-canvas" aria-hidden="true"></canvas>
  <div class="page-hero-glow"></div>
  <div class="container">
    <div class="page-hero-inner">
      <h1>Four systems. One compounding revenue machine.</h1>
      <p class="page-hero-sub">Every service we offer is a piece of infrastructure — not a campaign, not a deliverable. Built once, runs forever, compounds monthly.</p>
      <div class="hero-stats-row">
        <div class="hstat">
          <span class="hstat-val">4</span>
          <span class="hstat-lbl">Core Systems</span>
        </div>
        <div class="hstat">
          <span class="hstat-val">4–6 wk</span>
          <span class="hstat-lbl">Build Timeline</span>
        </div>
        <div class="hstat">
          <span class="hstat-val">GHL + AS</span>
          <span class="hstat-lbl">GHL + AppSheet Stack</span>
        </div>
        <div class="hstat">
          <span class="hstat-val">6+</span>
          <span class="hstat-lbl">Active Clients</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ======================== SECTION 2: SERVICE 01 — GHL REVENUE SYSTEM ======================== -->
<section class="service-section bg-black">
  <div class="container">
    <div class="service-grid">
      <div class="service-left reveal-left">
        <div class="service-eyebrow">
          <span class="eyebrow"><span class="eline"></span>System 01</span>
        </div>
        <h2 class="service-title">GHL Revenue System</h2>
        <p class="service-lead">Your entire business backend, built on GoHighLevel. CRM, pipeline, automations, notifications — everything configured from scratch and handed to you running. Not a template. A system engineered around how your business actually sells.</p>

        <p style="font-size:0.8rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--gold);margin-bottom:14px;font-family:var(--fb);">What's Included</p>
        <ul class="feature-list">
          <li><span class="feature-check">✦</span> Full GoHighLevel CRM setup and configuration</li>
          <li><span class="feature-check">✦</span> Custom pipeline stages mapped to your sales process</li>
          <li><span class="feature-check">✦</span> Lead tagging, segmentation, and scoring rules</li>
          <li><span class="feature-check">✦</span> Workflow automations — triggers, actions, conditions</li>
          <li><span class="feature-check">✦</span> Team notification system — no lead slips through</li>
          <li><span class="feature-check">✦</span> 7-touch follow-up sequence built and live</li>
          <li><span class="feature-check">✦</span> Monthly optimization reviews</li>
        </ul>

        <div class="timeline-badge">
          <span class="timeline-badge-dot"></span>
          <span>2–3 Weeks</span>
          <span class="timeline-badge-label">to full deployment</span>
        </div>
      </div>

      <div class="service-right reveal-right">
        <div class="info-cards">
          <div class="info-card">
            <div class="info-card-label">Who It's For</div>
            <p>Any service business processing more than 10 leads per month that has no central place to track them. If you're running leads through your personal inbox or a spreadsheet, this is the foundation you're missing.</p>
          </div>
          <div class="info-card">
            <div class="info-card-label">Why It Matters</div>
            <p>Without a CRM, every lead you don't close immediately is a lead you're losing. The average business forgets to follow up after 2 touches. Our systems run 7. This is the foundation everything else is built on — and the single highest-ROI build we do.</p>
          </div>
          <div style="background:var(--card);border:1px solid var(--border);padding:22px 24px;border-radius:2px;">
            <p style="font-size:0.72rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--gray);margin-bottom:12px;font-family:var(--fb);">System Coverage</p>
            <div style="display:flex;flex-wrap:wrap;gap:8px;">
              <span style="background:var(--gold-dim);border:1px solid var(--gold-border);padding:4px 12px;border-radius:2px;font-size:0.72rem;color:var(--gold);font-weight:600;">CRM</span>
              <span style="background:var(--gold-dim);border:1px solid var(--gold-border);padding:4px 12px;border-radius:2px;font-size:0.72rem;color:var(--gold);font-weight:600;">Pipelines</span>
              <span style="background:var(--gold-dim);border:1px solid var(--gold-border);padding:4px 12px;border-radius:2px;font-size:0.72rem;color:var(--gold);font-weight:600;">Automations</span>
              <span style="background:var(--gold-dim);border:1px solid var(--gold-border);padding:4px 12px;border-radius:2px;font-size:0.72rem;color:var(--gold);font-weight:600;">Follow-Up</span>
              <span style="background:var(--gold-dim);border:1px solid var(--gold-border);padding:4px 12px;border-radius:2px;font-size:0.72rem;color:var(--gold);font-weight:600;">SMS/Email</span>
              <span style="background:var(--gold-dim);border:1px solid var(--gold-border);padding:4px 12px;border-radius:2px;font-size:0.72rem;color:var(--gold);font-weight:600;">Reporting</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ======================== SECTION 3: SERVICE 02 — LEAD CAPTURE ======================== -->
<section class="service-section bg-surface">
  <div class="container">
    <div class="service-grid reversed">
      <div class="service-left reveal-left">
        <div class="info-cards">
          <div class="info-card">
            <div class="info-card-label">Who It's For</div>
            <p>Businesses running paid ads or needing a consistent inbound lead source. If you're sending Meta or Google traffic to your homepage, you're burning budget — this funnel gives that spend somewhere to land and convert.</p>
          </div>
          <div class="info-card">
            <div class="info-card-label">Why It Matters</div>
            <p>Your ad spend is wasted without a funnel that converts. A generic homepage converts at 1–2%. A purpose-built landing page converts at 8–15%. This is the difference between a profitable ad account and a money pit.</p>
          </div>
          <div style="background:var(--card);border:1px solid var(--border);padding:22px 24px;border-radius:2px;">
            <p style="font-size:0.72rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--gray);margin-bottom:12px;font-family:var(--fb);">Integrates With</p>
            <div style="display:flex;flex-wrap:wrap;gap:8px;">
              <span style="background:var(--gold-dim);border:1px solid var(--gold-border);padding:4px 12px;border-radius:2px;font-size:0.72rem;color:var(--gold);font-weight:600;">Meta Ads</span>
              <span style="background:var(--gold-dim);border:1px solid var(--gold-border);padding:4px 12px;border-radius:2px;font-size:0.72rem;color:var(--gold);font-weight:600;">Google Ads</span>
              <span style="background:var(--gold-dim);border:1px solid var(--gold-border);padding:4px 12px;border-radius:2px;font-size:0.72rem;color:var(--gold);font-weight:600;">GHL CRM</span>
              <span style="background:var(--gold-dim);border:1px solid var(--gold-border);padding:4px 12px;border-radius:2px;font-size:0.72rem;color:var(--gold);font-weight:600;">Source Tracking</span>
            </div>
          </div>
        </div>
      </div>

      <div class="service-right reveal-right">
        <div class="service-eyebrow">
          <span class="eyebrow"><span class="eline"></span>System 02</span>
        </div>
        <h2 class="service-title">Lead Capture &amp; Funnel System</h2>
        <p class="service-lead">A purpose-built landing page and form system that captures leads, triggers instant follow-up, and pushes everything into your CRM automatically. Every click is tracked, tagged, and followed up — without you lifting a finger.</p>

        <p style="font-size:0.8rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--gold);margin-bottom:14px;font-family:var(--fb);">What's Included</p>
        <ul class="feature-list">
          <li><span class="feature-check">✦</span> Custom landing page designed for conversion</li>
          <li><span class="feature-check">✦</span> Lead capture form with field validation</li>
          <li><span class="feature-check">✦</span> GHL integration — every submission auto-enters your pipeline</li>
          <li><span class="feature-check">✦</span> Instant follow-up trigger fires on submission</li>
          <li><span class="feature-check">✦</span> Source tracking — know exactly where every lead came from</li>
          <li><span class="feature-check">✦</span> A/B testing setup for continuous improvement</li>
          <li><span class="feature-check">✦</span> Ad platform integration (Meta, Google)</li>
        </ul>

        <div class="timeline-badge">
          <span class="timeline-badge-dot"></span>
          <span>1–2 Weeks</span>
          <span class="timeline-badge-label">to full deployment</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ======================== SECTION 4: SERVICE 03 — BOOKING SYSTEM ======================== -->
<section class="service-section bg-black">
  <div class="container">
    <div class="service-grid">
      <div class="service-left reveal-left">
        <div class="service-eyebrow">
          <span class="eyebrow"><span class="eline"></span>System 03</span>
        </div>
        <h2 class="service-title">Automated Booking System</h2>
        <p class="service-lead">A fully automated appointment flow — from booking link to calendar block to 24-hour reminder — that runs without you touching it. Clients book, get confirmed, get reminded, and show up. You focus on the work, not the logistics.</p>

        <p style="font-size:0.8rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--gold);margin-bottom:14px;font-family:var(--fb);">What's Included</p>
        <ul class="feature-list">
          <li><span class="feature-check">✦</span> Custom booking page with your brand and availability</li>
          <li><span class="feature-check">✦</span> Instant confirmation SMS and email on booking</li>
          <li><span class="feature-check">✦</span> 24-hour reminder sequence — reduces no-shows 60%+</li>
          <li><span class="feature-check">✦</span> Staff calendar sync and conflict prevention</li>
          <li><span class="feature-check">✦</span> Post-appointment follow-up trigger</li>
          <li><span class="feature-check">✦</span> Rebooking automation for repeat clients</li>
          <li><span class="feature-check">✦</span> All integrated directly with your GHL pipeline</li>
        </ul>

        <div class="timeline-badge">
          <span class="timeline-badge-dot"></span>
          <span>1–2 Weeks</span>
          <span class="timeline-badge-label">to full deployment</span>
        </div>
      </div>

      <div class="service-right reveal-right">
        <div class="info-cards">
          <div class="info-card">
            <div class="info-card-label">Who It's For</div>
            <p>Any appointment-based service business — barbershops, restoration, coaching, trades, beauty. If you're confirming bookings manually by phone or DM, this system reclaims hours every week and dramatically reduces the no-show rate.</p>
          </div>
          <div class="info-card">
            <div class="info-card-label">Why It Matters</div>
            <p>No-shows kill revenue. A single missed appointment costs you the slot and the client. Manual booking wastes your time before and after. This system handles both — automated confirmations cut no-shows by 60% or more on average across our clients.</p>
          </div>
          <div style="background:var(--card);border:1px solid var(--border);padding:22px 24px;border-radius:2px;">
            <p style="font-size:0.72rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--gray);margin-bottom:8px;font-family:var(--fb);">Proven With</p>
            <p style="font-size:0.83rem;color:var(--gray-light);line-height:1.7;">Barbershops, home restoration companies, coaching practices, Dionet Academy, CutByDack — and every client with a calendar.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ======================== SECTION 5: SERVICE 04 — REVIEW ENGINE ======================== -->
<section class="service-section bg-surface">
  <div class="container">
    <div class="service-grid reversed">
      <div class="service-left reveal-left">
        <div class="info-cards">
          <div class="info-card">
            <div class="info-card-label">Who It's For</div>
            <p>Local service businesses where Google reviews directly drive new business — trades, restoration, barbershops, home services. If your Google rating is under 4.7 or you have fewer than 50 reviews, you're losing business to competitors every single day.</p>
          </div>
          <div class="info-card">
            <div class="info-card-label">Why It Matters</div>
            <p>87% of buyers check Google reviews before contacting a local business. One review system built today compounds for years. The businesses we've seen grow fastest didn't out-advertise their competitors — they out-reputationed them.</p>
          </div>
          <div style="background:var(--card);border:1px solid var(--border);padding:22px 24px;border-radius:2px;">
            <p style="font-size:0.72rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--gray);margin-bottom:8px;font-family:var(--fb);">Stat That Matters</p>
            <p style="font-family:var(--fh);font-size:1.6rem;font-weight:800;color:var(--gold);line-height:1;margin-bottom:6px;">87%</p>
            <p style="font-size:0.82rem;color:var(--gray-light);">of buyers check Google reviews before contacting a local business.</p>
          </div>
        </div>
      </div>

      <div class="service-right reveal-right">
        <div class="service-eyebrow">
          <span class="eyebrow"><span class="eline"></span>System 04</span>
        </div>
        <h2 class="service-title">Review &amp; Reputation Engine</h2>
        <p class="service-lead">Every completed job automatically triggers a Google review request. Your reputation builds on autopilot while you focus on the next job — and negative feedback gets caught before it goes public.</p>

        <p style="font-size:0.8rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--gold);margin-bottom:14px;font-family:var(--fb);">What's Included</p>
        <ul class="feature-list">
          <li><span class="feature-check">✦</span> Post-service review request SMS — triggered by job completion</li>
          <li><span class="feature-check">✦</span> Google Business Profile integration</li>
          <li><span class="feature-check">✦</span> 5-star review routing — 4-star or below goes to private feedback</li>
          <li><span class="feature-check">✦</span> Review response templates for consistent brand voice</li>
          <li><span class="feature-check">✦</span> Monthly reputation report</li>
          <li><span class="feature-check">✦</span> Low-rating alert to catch and address issues fast</li>
        </ul>

        <div class="timeline-badge">
          <span class="timeline-badge-dot"></span>
          <span>1 Week</span>
          <span class="timeline-badge-label">to full deployment</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ======================== SECTION 6: THE FULL STACK ======================== -->
<section id="full-stack">
  <div class="container">
    <div class="fullstack-header reveal">
      <span class="eyebrow"><span class="eline"></span>The Full Picture<span class="eline"></span></span>
      <h2 style="margin-top:18px;">When all four run together</h2>
      <p style="margin-top:16px;">These aren't four separate tools — they're one integrated system. A lead hits your funnel, enters your CRM, books automatically, gets followed up with if they don't, completes the job, and leaves a 5-star review. Without you touching a single step.</p>
    </div>

    <div class="pipeline-flow reveal">
      <div class="pipeline-stage">
        <div class="pipeline-stage-box">
          <div class="pipeline-stage-num">01</div>
          <div class="pipeline-stage-name">CAPTURE</div>
          <div class="pipeline-stage-sub">Funnel &amp; form<br>fires instantly</div>
        </div>
        <div class="pipeline-stage-label">Lead Capture System</div>
      </div>

      <div class="pipeline-connector">
        <div class="pipeline-line"></div>
        <div class="pipeline-arrow"></div>
      </div>

      <div class="pipeline-stage">
        <div class="pipeline-stage-box">
          <div class="pipeline-stage-num">02</div>
          <div class="pipeline-stage-name">QUALIFY</div>
          <div class="pipeline-stage-sub">CRM tags &amp;<br>follow-up runs</div>
        </div>
        <div class="pipeline-stage-label">GHL Revenue System</div>
      </div>

      <div class="pipeline-connector">
        <div class="pipeline-line"></div>
        <div class="pipeline-arrow"></div>
      </div>

      <div class="pipeline-stage">
        <div class="pipeline-stage-box">
          <div class="pipeline-stage-num">03</div>
          <div class="pipeline-stage-name">BOOK</div>
          <div class="pipeline-stage-sub">Auto-confirmed,<br>reminder sent</div>
        </div>
        <div class="pipeline-stage-label">Booking System</div>
      </div>

      <div class="pipeline-connector">
        <div class="pipeline-line"></div>
        <div class="pipeline-arrow"></div>
      </div>

      <div class="pipeline-stage">
        <div class="pipeline-stage-box">
          <div class="pipeline-stage-num">04</div>
          <div class="pipeline-stage-name">REVIEW</div>
          <div class="pipeline-stage-sub">Job done, Google<br>review requested</div>
        </div>
        <div class="pipeline-stage-label">Reputation Engine</div>
      </div>
    </div>

    <div class="reveal" style="text-align:center;margin-top:48px;">
      <p style="font-size:0.85rem;color:var(--gray);max-width:520px;margin:0 auto;line-height:1.8;">Every stage feeds the next. Every system compounds. The whole stack takes 4–6 weeks to build — then it runs on its own, month after month.</p>
    </div>
  </div>
</section>

<!-- ======================== SECTION 7: TECH STACK ======================== -->
<section id="tech-stack">
  <div class="container">
    <div class="tech-split">

      <div class="tech-split-left reveal-left">
        <span class="eyebrow"><span class="eline"></span>The Stack</span>
        <h2>Tools we build with — and why we chose them.</h2>
        <p>Every tool in our stack was chosen because it solves a real problem in a local service business. We're not platform agnostic — we're deliberate. GoHighLevel and AppSheet aren't trendy choices. They're the most capable tools for what we build, at the scale we build it.</p>
        <div class="tech-split-note">
          <p><strong>You don't need to know these tools.</strong> That's our job. Every system we build hands you a running machine — not a platform you have to learn.</p>
        </div>
      </div>

      <div class="tech-grid reveal-right">
        <div class="tech-card">
          <div class="tech-card-name">GoHighLevel</div>
          <div class="tech-card-role">Core Platform</div>
          <p>CRM, pipelines, automations, SMS/email delivery, booking calendar, and workflow builder. The engine that runs everything.</p>
        </div>
        <div class="tech-card">
          <div class="tech-card-name">AppSheet</div>
          <div class="tech-card-role">Custom Dashboards</div>
          <p>Custom reporting views, client-facing dashboards, and data layers that give you a real-time window into your operations.</p>
        </div>
        <div class="tech-card">
          <div class="tech-card-name">Twilio</div>
          <div class="tech-card-role">SMS Infrastructure</div>
          <p>The backbone of every text message your system sends — confirmations, reminders, follow-ups, and review requests.</p>
        </div>
        <div class="tech-card">
          <div class="tech-card-name">Google Business</div>
          <div class="tech-card-role">Reputation Layer</div>
          <p>Direct integration with Google Business Profile for automated review requests, routing, and monthly reputation tracking.</p>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- ======================== SECTION 8: FAQ ======================== -->
<section id="faq">
  <div class="container">
    <div class="faq-split">

      <div class="faq-split-left reveal-left">
        <span class="eyebrow"><span class="eline"></span>FAQ</span>
        <h2>Questions people always ask.</h2>
        <p>The most common concerns before working with us — answered honestly.</p>
        <a href="/apply" class="btn-outline" style="margin-top:8px;">Book the Audit →</a>
      </div>

    <div class="faq-list reveal-right">

      <div class="faq-item">
        <button class="faq-q" onclick="toggleFAQ(this)">
          <span class="faq-q-text">Do I need to already have GHL?</span>
          <span class="faq-icon">+</span>
        </button>
        <div class="faq-a">
          <div class="faq-a-inner">No — we set up and configure everything from scratch. GoHighLevel runs about $97/month, which we factor into the full project plan during your Growth Audit. You don't need to touch a thing before we start.</div>
        </div>
      </div>

      <div class="faq-item">
        <button class="faq-q" onclick="toggleFAQ(this)">
          <span class="faq-q-text">Can you build just one system, or is it all or nothing?</span>
          <span class="faq-icon">+</span>
        </button>
        <div class="faq-a">
          <div class="faq-a-inner">We build individual systems or the full stack depending on your biggest gap. Most clients start with the GHL Revenue System as the foundation — because everything else connects into it. From there, we add layers based on where you're losing the most revenue.</div>
        </div>
      </div>

      <div class="faq-item">
        <button class="faq-q" onclick="toggleFAQ(this)">
          <span class="faq-q-text">Who manages the systems after they're built?</span>
          <span class="faq-icon">+</span>
        </button>
        <div class="faq-a">
          <div class="faq-a-inner">That depends on your engagement type. On our Full Scale plan, we manage, monitor, and optimize monthly — you never touch the backend. On the Build plan, we hand you a fully trained-up system with 30 days of support included so your team is confident running it.</div>
        </div>
      </div>

      <div class="faq-item">
        <button class="faq-q" onclick="toggleFAQ(this)">
          <span class="faq-q-text">How do you integrate with my existing tools?</span>
          <span class="faq-icon">+</span>
        </button>
        <div class="faq-a">
          <div class="faq-a-inner">GHL integrates natively with most calendar, email, and CRM tools. During your free Growth Audit, we map your current stack — what you're using, what's working, and what's costing you leads — then build the new system around what you already have so nothing gets disrupted.</div>
        </div>
      </div>

      <div class="faq-item">
        <button class="faq-q" onclick="toggleFAQ(this)">
          <span class="faq-q-text">What if my business type isn't listed?</span>
          <span class="faq-icon">+</span>
        </button>
        <div class="faq-a">
          <div class="faq-a-inner">Book a Growth Audit. We've built for 6 different business types and counting — barbershops, restoration companies, coaching businesses, academies, media agencies, and more. If there's a lead flow, there's a system we can build for it. The audit is free and you walk away with a blueprint either way.</div>
        </div>
      </div>

    </div><!-- end faq-list -->

    </div><!-- end faq-split -->
  </div>
</section>

<!-- ======================== SECTION 9: FINAL CTA ======================== -->
<section id="final-cta">
  <div class="container">
    <div class="cta-inner">
      <div class="cta-availability reveal">
        <span class="cta-avail-dot"></span>
        <span class="cta-avail-text">3 Spots Open This Month</span>
      </div>

      <h2 class="cta-headline reveal">
        Ready to see<br>
        what gets built<br>
        <span class="gold-shimmer">for your business?</span>
      </h2>

      <p class="cta-body reveal">Book a free 45-minute Growth Audit. We map your gaps, show you exactly what needs to be built, and hand you a full blueprint — whether you hire us or not.</p>

      <div class="cta-actions reveal">
        <a href="/apply" class="btn-gold">Book Your Free Growth Audit →</a>
      </div>

      <p class="cta-sub reveal">Or email us directly at <a href="mailto:trifactorscaling@gmail.com">trifactorscaling@gmail.com</a></p>
    </div>
  </div>
</section>

<!-- ======================== FOOTER ======================== -->
<footer>
  <img src="/tfs-logo.png" alt="" class="footer-watermark" aria-hidden="true">
  <div class="container footer-inner">
    <div class="footer-top">
      <div class="footer-brand">
        <img src="/tfs-logo.png" alt="TriFactor Scaling" class="footer-logo-img">
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
  // FAQ accordion
  function toggleFAQ(btn) {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-a').style.maxHeight = '0';
    });
    if (!isOpen) {
      item.classList.add('open');
      const ans = item.querySelector('.faq-a');
      ans.style.maxHeight = ans.scrollHeight + 40 + 'px';
    }
  }
  // Sticky bar (if hero section exists)
  const stickyBar = document.getElementById('stickyBar');
  if (stickyBar) {
    const pageHero = document.querySelector('.page-hero, #hero');
    if (pageHero) {
      window.addEventListener('scroll', () => {
        stickyBar.classList.toggle('show', pageHero.getBoundingClientRect().bottom < 0);
      }, { passive: true });
    } else {
      setTimeout(() => stickyBar.classList.add('show'), 2000);
    }
  }

;

(function(){
  var canvas = document.querySelector('.tri-page-hero-canvas');
  if (!canvas || !canvas.getContext) return;
  var hero = canvas.closest('.page-hero, #hero'); if (!hero) return;
  var ctx = canvas.getContext('2d');
  var W=0, H=0, particles=[];
  function resize(){ W = canvas.width = hero.offsetWidth; H = canvas.height = hero.offsetHeight; }
  function mk(){ return { x:Math.random()*W, y:Math.random()*H, r:Math.random()*1.5+0.4,
    alpha:Math.random()*0.35+0.05, vx:(Math.random()-0.5)*0.18, vy:(Math.random()-0.5)*0.18,
    life:Math.random()*200+100, age:0 }; }
  function init(){ resize(); particles = Array.from({length:65}, mk); }
  function draw(){
    ctx.clearRect(0,0,W,H);
    particles.forEach(function(p,i){
      p.x+=p.vx; p.y+=p.vy; p.age+=1;
      var t=p.age/p.life, fade = t<0.2 ? t/0.2 : t>0.8 ? (1-t)/0.2 : 1;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle='rgba(212,175,55,'+(p.alpha*fade)+')'; ctx.fill();
      if(p.age>=p.life||p.x<0||p.x>W||p.y<0||p.y>H) particles[i]=mk();
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize, {passive:true});
  init(); draw();
})();
`;

const Services = () => {
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
    styleEl.setAttribute("data-tri-page", "tri-services");
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
      className="tri-services tri-page-fade"
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: HTML }}
    />
  );
};

export default Services;
