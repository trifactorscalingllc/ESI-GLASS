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
    .service-section::before { display: none; }
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

    /* ── Pillar tier cards (Pillar 01) ── */
    .tier-grid {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 1px; background: var(--border); border: 1px solid var(--border);
    }
    .tier-card {
      background: var(--black); padding: 44px 32px;
      display: flex; flex-direction: column; position: relative;
      transition: background 0.25s ease;
    }
    .tier-card:hover { background: #030303; }
    .tier-card-featured { background: #090900; padding-top: 54px; }
    .tier-card-featured::before {
      content: ''; position: absolute; inset: 0;
      border: 1px solid var(--gold-border); pointer-events: none;
      transition: border-color 0.3s ease;
    }
    .tier-card-featured:hover::before { border-color: var(--gold); }
    .tier-badge {
      position: absolute; top: 0; left: 0; right: 0;
      background: var(--gold); color: var(--black);
      font-family: var(--fb); font-size: 0.58rem; font-weight: 700;
      letter-spacing: 0.2em; text-align: center; padding: 6px;
    }
    .tier-eyebrow {
      font-family: var(--fb); font-size: 0.62rem; font-weight: 700;
      letter-spacing: 0.2em; text-transform: uppercase; color: var(--gray); margin-bottom: 8px;
    }
    .tier-card-featured .tier-eyebrow { color: var(--gold); }
    .tier-name {
      font-family: var(--fh); font-size: 1.45rem; font-weight: 800;
      letter-spacing: -0.01em; color: var(--white); margin-bottom: 8px;
    }
    .tier-desc {
      font-size: 0.83rem; color: var(--gray-light); line-height: 1.6;
      margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid var(--border); flex-shrink: 0;
    }
    .tier-apply {
      display: inline-block; margin-top: auto; padding: 12px 20px;
      border: 1px solid var(--border); background: transparent;
      color: var(--gray-light); font-family: var(--fb); font-size: 0.75rem;
      font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
      text-decoration: none; transition: all 0.2s ease; cursor: pointer;
    }
    .tier-apply:hover { border-color: var(--gold); color: var(--gold); }
    .tier-apply-fill { background: var(--gold); color: var(--black); border-color: var(--gold); }
    .tier-apply-fill:hover { background: #e8c840; border-color: #e8c840; color: var(--black); }

    /* ── Pillar flow animation (same as homepage) ── */
    @keyframes pillarFlowStrip {
      0%   { transform: translateX(0%);   opacity: 0; }
      6%   { opacity: 1; }
      27%  { opacity: 1; }
      33%  { transform: translateX(0%);   opacity: 0; }
      39%  { transform: translateX(100%); opacity: 0; }
      45%  { opacity: 1; }
      61%  { opacity: 1; }
      66%  { transform: translateX(100%); opacity: 0; }
      72%  { transform: translateX(200%); opacity: 0; }
      78%  { opacity: 1; }
      92%  { opacity: 1; }
      100% { transform: translateX(200%); opacity: 0; }
    }
    @keyframes pillarCardPulse {
      0%, 100% { background: var(--black); }
      50%      { background: rgba(212,175,55,0.035); }
    }
    @keyframes pillarFeaturedPulse {
      0%, 100% { box-shadow: none; }
      50%      { box-shadow: 0 0 48px rgba(212,175,55,0.13); }
    }
    .svc-grid-flow { position: relative; overflow: hidden; }
    .svc-grid-flow::before {
      content: ''; position: absolute; top: 0; left: 0;
      width: 33.34%; height: 2px; z-index: 2; pointer-events: none;
      background: linear-gradient(90deg, transparent 0%, var(--gold) 35%, var(--gold) 65%, transparent 100%);
      animation: pillarFlowStrip 4.5s ease-in-out infinite;
    }
    .svc-grid-flow .tier-card:nth-child(1) {
      animation: pillarCardPulse 4.5s ease-in-out infinite; animation-delay: 0s;
    }
    .svc-grid-flow .tier-card-featured {
      animation: pillarFeaturedPulse 4.5s ease-in-out infinite !important; animation-delay: 1.5s !important;
    }
    .svc-grid-flow .tier-card:nth-child(3) {
      animation: pillarCardPulse 4.5s ease-in-out infinite; animation-delay: 3s;
    }

    @media (max-width: 900px) {
      .tier-grid { grid-template-columns: 1fr; background: transparent; border: none; }
      .tier-card { border: 1px solid var(--border); }
      .tier-card-featured { border: 1px solid var(--gold-border); }
      .tier-card-featured::before { display: none; }
      .svc-grid-flow::before { display: none; }
      .svc-grid-flow .tier-card:nth-child(1),
      .svc-grid-flow .tier-card-featured,
      .svc-grid-flow .tier-card:nth-child(3) { animation: none !important; }
    }

    /* ======================== FULL STACK SECTION ======================== */
    #full-stack {
      background: var(--surface);
      padding: 96px 0;
      position: relative;
      overflow: hidden;
    }
    #full-stack::before { display: none; }
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
    #tech-stack::before { display: none; }

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
    @media (max-width: 768px) {
      section { padding: 72px 0; }
      .service-section { padding: 72px 0; }
      #full-stack, #tech-stack, #faq, #final-cta { padding: 72px 0; }
      .page-hero { padding: 68px 0 72px; }
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
      .page-hero { padding: 82px 0 56px; }
      .cta-headline { font-size: 1.9rem; }
    }

    /* ============================================================
       MOBILE RESPONSIVE OVERHAUL — injected fix
       Ensures nothing overflows or overlaps on any device width
    ============================================================ */

    html, body { overflow-x: hidden; max-width: 100%; }
    *, *::before, *::after { box-sizing: border-box; }

    img, video, canvas, svg { max-width: 100%; height: auto; }

    /* Nav: hide CTA button, keep hamburger visible on mobile */
    @media (max-width: 768px) {
      .nav-inner { grid-template-columns: 1fr auto; }
      .nav-links  { display: none !important; }
      .nav-cta    { display: none !important; }
      .nav-cta-wrap { justify-content: flex-end; }
      .hamburger  { display: flex !important; }
      .mobile-menu { top: 58px; }
    }

    /* ── HERO fluid sizing ── */
    @media (max-width: 768px) {
      #hero { min-height: 80vh; padding-top: 76px; }
      .hero-inner { padding: 32px 0 72px; }
      .hero-headline { font-size: clamp(2rem, 9vw, 3rem) !important; line-height: 1.06 !important; }
      .hero-sub { font-size: 0.92rem; max-width: 100%; }
      .hero-actions { gap: 10px; }
      .btn-gold, .btn-outline { padding: 12px 22px; font-size: 0.82rem; }
    }

    /* ── Hero stats: wrap cleanly on mobile ── */
    @media (max-width: 540px) {
      .hero-stats { flex-direction: column; align-items: center; gap: 0; width: 100%; }
      .hstat {
        flex-direction: row !important; justify-content: space-between !important;
        width: 100% !important; padding: 10px 0 !important;
        border-right: none !important; border-bottom: 1px solid var(--border-mid, rgba(255,255,255,0.1));
        text-align: left !important; gap: 12px !important;
      }
      .hstat:last-child { border-bottom: none !important; }
      .hstat-val, .stat-val { font-size: 1.4rem !important; }
    }

    /* ── Section padding scale ── */
    @media (max-width: 768px) {
      section { padding: 60px 0 !important; }
      .container { padding-left: max(18px, 4vw) !important; padding-right: max(18px, 4vw) !important; }
    }
    @media (max-width: 480px) {
      section { padding: 44px 0 !important; }
      .container { padding-left: 16px !important; padding-right: 16px !important; }
    }

    /* ── All 2-col grids → 1 col on mobile ── */
    @media (max-width: 768px) {
      .wwd-grid,
      .la-grid,
      .hiw-steps,
      .qualify-split,
      .faq-grid,
      .tech-split,
      .faq-split,
      .service-grid,
      .apply-hero-grid,
      .origin-grid,
      .founders-panel,
      .compare-dramatic,
      .featured-case-split,
      .svc-grid,
      .crm-board
      { grid-template-columns: 1fr !important; gap: 32px !important; }
    }

    /* ── Client card grids ── */
    @media (max-width: 640px) {
      .cl-row { grid-template-columns: repeat(2, 1fr) !important; }
      .why-items { grid-template-columns: repeat(2, 1fr) !important; }
    }
    @media (max-width: 400px) {
      .cl-row { grid-template-columns: 1fr !important; }
      .why-items { grid-template-columns: 1fr !important; }
    }

    /* ── Testimonials ── */
    @media (max-width: 560px) {
      .testi-row { grid-template-columns: 1fr !important; }
    }

    /* ── Demo section ── */
    @media (max-width: 768px) {
      .demo-panel { width: 100%; padding: 24px 16px !important; }
      .dp-phone { max-width: 140px; width: 100%; }
      .demo-tabs { flex-wrap: wrap; }
      .demo-tab { flex: 1 1 45%; min-width: 0; text-align: center; }
    }

    /* ── Approach row (about page) ── */
    @media (max-width: 480px) {
      .approach-row { grid-template-columns: 1fr !important; }
      .client-cards-row-2,
      .client-cards-row-3 { grid-template-columns: 1fr !important; }
    }

    /* ── Process timeline (apply) ── */
    @media (max-width: 600px) {
      .process-timeline { grid-template-columns: 1fr !important; }
    }

    /* ── Pipeline flow (services) ── */
    @media (max-width: 600px) {
      .pipeline-flow { flex-wrap: wrap; gap: 8px; }
      .pipeline-step { flex: 1 1 calc(50% - 8px); min-width: 120px; }
      .pipeline-arrow { display: none; }
    }

    /* ── Page hero inner pages ── */
    @media (max-width: 768px) {
      .page-hero { padding: 82px 0 56px !important; }
      .page-hero-inner { padding: 0 !important; }
      .page-hero-inner h1 { font-size: clamp(1.9rem, 7vw, 2.8rem) !important; }
    }

    /* ── Footer ── */
    @media (max-width: 768px) {
      .footer-top { grid-template-columns: 1fr !important; gap: 36px !important; }
      .footer-bottom { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; }
    }

    /* ── Sticky bar ── */
    @media (max-width: 540px) {
      .sticky-bar { gap: 10px; padding: 9px 16px; }
      .sticky-bar-text { display: none; }
      .sticky-bar { justify-content: center; }
    }

    /* ── Featured client card ── */
    @media (max-width: 600px) {
      .cl-featured { flex-direction: column !important; gap: 20px !important; padding: 28px 20px !important; }
    }

    /* ── Text overflow guard ── */
    h1, h2, h3, h4, h5, p, li, span, a {
      overflow-wrap: break-word;
      word-wrap: break-word;
    }

    /* ── Eyebrow pills: prevent wrapping oddly ── */
    .eyebrow { flex-wrap: wrap; }

    /* ── Why TFS proof stats ── */
    @media (max-width: 600px) {
      .why-proof { gap: 20px; flex-wrap: wrap; justify-content: center; }
      .wstat-val { font-size: 2rem !important; }
    }

    /* ── Cards: prevent horizontal overflow ── */
    .svc-card, .why-item, .cl-card, .testi-card, .hiw-step,
    .approach-item, .founder-card, .feat-case-card, .step-card {
      max-width: 100%;
      overflow: hidden;
    }

  
`;
const SCRIPT = `

    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "vwvpjcliya");
  

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
<!-- ======================== SECTION 1: PAGE HERO ======================== -->
<section class="page-hero">
<div class="page-hero-glow"></div>
<div class="container">
<div class="page-hero-inner">
<div class="page-hero-eyebrow">
<span class="eyebrow"><span class="eline"></span>TriFactor Scaling<span class="eline"></span></span>
</div>
<h1>Our <span class="gold-shimmer">Services</span></h1>
<p class="page-hero-sub">Infrastructure built once. Revenue that compounds forever.</p>
<div class="hero-stats-row">
<div class="hstat">
<span class="hstat-val">4–6 wk</span>
<span class="hstat-lbl">Build Timeline</span>
</div>
<div class="hstat">
<span class="hstat-val">6+</span>
<span class="hstat-lbl">Active Clients</span>
</div>
</div>
</div>
</div>
</section>
<!-- ======================== SECTION 2–4: THREE PILLARS ======================== -->
<section class="service-section bg-black">
<div class="container">
<div class="tier-grid svc-grid-flow reveal" style="transition-delay:0.1s">

<!-- Pillar 01: Website & Funnel -->
<div class="tier-card">
<div class="tier-eyebrow">Pillar 01</div>
<div class="tier-name">Website &amp; Funnel</div>
<p class="tier-desc">Your website should be the hardest-working salesperson you have. We design and build every page with one goal: turning visitors into booked leads — then connect it directly to your CRM so nothing slips through the cracks. Not a template. Built from scratch around your business, your market, and the leads you're trying to close.</p>
<ul class="feature-list" style="flex:1">
<li><span class="feature-check">✦</span> Custom-designed homepage, services, about &amp; contact pages</li>
<li><span class="feature-check">✦</span> Campaign landing pages &amp; lead funnels built for paid traffic</li>
<li><span class="feature-check">✦</span> Lead capture forms wired directly into your CRM pipeline</li>
<li><span class="feature-check">✦</span> Booking calendar embedded &amp; synced with appointment automation</li>
<li><span class="feature-check">✦</span> Mobile-first build, fast load times, Google Search Console setup</li>
<li><span class="feature-check">✦</span> Analytics installation, heatmap tracking &amp; A/B testing capability</li>
<li><span class="feature-check">✦</span> Retargeting pixel setup ready for paid media</li>
<li><span class="feature-check">✦</span> Monthly maintenance, copy updates &amp; performance reviews</li>
</ul>
<a class="tier-apply" href="mailto:contact@trifactorscaling.com?subject=Website%20%26%20Funnel%20Inquiry">Apply for Website &amp; Funnel →</a>
<a href="/services/website-funnel" style="display:inline-block;margin-top:10px;font-size:0.78rem;color:var(--gray);text-decoration:none;letter-spacing:0.04em;transition:color 0.2s;" onmouseover="this.style.color='var(--gold)'" onmouseout="this.style.color='var(--gray)'">View pricing &amp; details →</a>
</div>

<!-- Pillar 02: Growth Operations (FEATURED) -->
<div class="tier-card tier-card-featured">
<div class="tier-badge">CORE SYSTEM</div>
<div class="tier-eyebrow">Pillar 02</div>
<div class="tier-name">Growth Operations</div>
<p class="tier-desc">This is the engine. GoHighLevel configured around your exact business type — custom CRM pipelines, SMS and email automations, booking flows, review requests — all built from scratch and handed to you running. Every lead that comes in gets followed up with, booked, reminded, and asked for a review. Automatically. While you stay focused on the work.</p>
<ul class="feature-list" style="flex:1">
<li><span class="feature-check">✦</span> Full GoHighLevel sub-account setup &amp; configuration</li>
<li><span class="feature-check">✦</span> Custom CRM pipeline built around your exact sales process</li>
<li><span class="feature-check">✦</span> Multi-step SMS &amp; email follow-up sequences</li>
<li><span class="feature-check">✦</span> Lead nurture flows that run 24/7 — no manual input required</li>
<li><span class="feature-check">✦</span> Appointment booking automation with confirmations &amp; reminders</li>
<li><span class="feature-check">✦</span> No-show reduction sequences</li>
<li><span class="feature-check">✦</span> Automated Google review requests triggered on job completion</li>
<li><span class="feature-check">✦</span> AppSheet reporting dashboard for real-time operations visibility</li>
<li><span class="feature-check">✦</span> Monthly system monitoring &amp; optimization</li>
</ul>
<a class="tier-apply tier-apply-fill" href="mailto:contact@trifactorscaling.com?subject=Growth%20Operations%20Inquiry">Apply for Growth Ops →</a>
<a href="/services/growth-operations" style="display:inline-block;margin-top:10px;font-size:0.78rem;color:var(--gray);text-decoration:none;letter-spacing:0.04em;transition:color 0.2s;" onmouseover="this.style.color='var(--gold)'" onmouseout="this.style.color='var(--gray)'">View pricing &amp; details →</a>
</div>

<!-- Pillar 03: Marketing -->
<div class="tier-card">
<div class="tier-eyebrow">Pillar 03</div>
<div class="tier-name">Marketing</div>
<p class="tier-desc">Meta and TikTok campaigns built to send qualified traffic directly into your pipeline — not just clicks, actual leads. We handle the strategy, the creative direction, and day-to-day optimization. Every campaign ties back to your CRM so you can see exactly which ad produced which booked job and which revenue.</p>
<ul class="feature-list" style="flex:1">
<li><span class="feature-check">✦</span> Meta (Facebook &amp; Instagram) &amp; TikTok campaign strategy &amp; setup</li>
<li><span class="feature-check">✦</span> Ad creative direction, copywriting &amp; visual brief development</li>
<li><span class="feature-check">✦</span> Audience research, targeting &amp; lookalike audience buildout</li>
<li><span class="feature-check">✦</span> Retargeting campaigns tied to website visitors &amp; CRM contacts</li>
<li><span class="feature-check">✦</span> Daily budget optimization &amp; bid management</li>
<li><span class="feature-check">✦</span> A/B testing of creative, copy &amp; landing pages</li>
<li><span class="feature-check">✦</span> Organic content strategy &amp; posting cadence</li>
<li><span class="feature-check">✦</span> Monthly ROI reporting mapped directly to pipeline revenue</li>
</ul>
<a class="tier-apply" href="mailto:contact@trifactorscaling.com?subject=Marketing%20Inquiry">Apply for Marketing →</a>
<a href="/services/marketing" style="display:inline-block;margin-top:10px;font-size:0.78rem;color:var(--gray);text-decoration:none;letter-spacing:0.04em;transition:color 0.2s;" onmouseover="this.style.color='var(--gold)'" onmouseout="this.style.color='var(--gray)'">View pricing &amp; details →</a>
</div>

</div>
</div>
</section>
<!-- ======================== SECTION 9: FINAL CTA ======================== -->
<section id="final-cta">
<div class="container">
<div class="cta-inner">
<h2 class="cta-headline reveal">
        Ready to see<br/>
        what gets built<br/>
<span class="gold-shimmer">for your business?</span>
</h2>
<p class="cta-body reveal">Book a free 45-minute Growth Audit. We map your gaps, show you exactly what needs to be built, and hand you a full blueprint — whether you hire us or not.</p>
<div class="cta-actions reveal">
<a class="btn-gold" href="/apply">Book Your Free Growth Audit →</a>
</div>
<p class="cta-sub reveal">Or email us directly at <a href="mailto:contact@trifactorscaling.com">contact@trifactorscaling.com</a></p>
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
<!-- ======================== SCRIPTS ======================== -->
`;
const Services = () => {
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
    styleEl.setAttribute("data-tri-page", "tri-services");
    styleEl.innerHTML = CSS;
    document.head.appendChild(styleEl);

    // Clarity
    if (!document.querySelector('script[data-clarity]')) {
      const cl = document.createElement("script");
      cl.setAttribute("data-clarity","vwvpjcliya");
      cl.text = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","vwvpjcliya");`;
      document.head.appendChild(cl);
    }

    let scriptEl: HTMLScriptElement | null = null;
    const t = window.setTimeout(() => {
      try {
        scriptEl = document.createElement("script");
        // Wrapped in IIFE but window.toggleMenu is set inside the page SCRIPT
        scriptEl.text = "(function(){try{\n" + SCRIPT + "\n}catch(e){console.error('tri page script error',e);}})();";
        document.body.appendChild(scriptEl);
      } catch (e) { console.error("page script error", e); }
    }, 0);

    return () => {
      window.clearTimeout(t);
      styleEl.remove();
      scriptEl?.remove();
      // Clean up global nav fn to avoid stale refs
      if ((window as any).toggleMenu) delete (window as any).toggleMenu;
      document.body.style.background = prevBg;
      document.body.style.color = prevColor;
      document.documentElement.style.overflowX = "";
      document.body.style.overflowX = "";
    };
  }, []);

  // SPA routing — intercept all internal anchor clicks
  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = (e.target as HTMLElement).closest("a");
    if (!a) return;
    const href = a.getAttribute("href") || "";
    if (href.startsWith("/") && !href.startsWith("//")) {
      e.preventDefault();
      // Also close mobile menu if open
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
    <div ref={rootRef} className="tri-services tri-page-fade"
      style={{ overflowX: "hidden", maxWidth: "100vw" }}
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: HTML }} />
  );
};
export default Services;
