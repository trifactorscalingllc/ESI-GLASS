import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
const CSS = `

    /* ======================== VARIABLES ======================== */
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

    /* Golden scrollbar */
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

    .btn-apply {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      width: 100%; background: transparent; color: var(--gold);
      font-family: var(--fh); font-weight: 700; font-size: 0.8rem;
      letter-spacing: 0.08em; text-transform: uppercase;
      padding: 14px 28px; border: 1px solid var(--gold-border); border-radius: 2px;
      cursor: pointer; text-decoration: none;
      transition: background 0.22s ease, color 0.22s ease, box-shadow 0.22s ease;
    }
    .btn-apply:hover { background: var(--gold); color: var(--black); box-shadow: 0 6px 24px var(--gold-glow); }
    .btn-apply-fill { background: var(--gold); color: var(--black); border-color: var(--gold); }
    .btn-apply-fill:hover { background: var(--gold-light); }

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

    /* ======================== STICKY CTA BAR ======================== */
    .sticky-bar {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 95;
      background: rgba(0,0,0,0.95); backdrop-filter: blur(20px);
      border-top: 1px solid var(--gold-border);
      padding: 14px 28px;
      display: flex; align-items: center; justify-content: space-between; gap: 20px;
      transform: translateY(100%);
      transition: transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
    }
    .sticky-bar.show { transform: translateY(0); }
    .sticky-bar-text {
      font-family: var(--fh); font-size: 0.88rem; font-weight: 600; color: var(--off-white);
    }
    .sticky-bar-text span { color: var(--gold); }
    @media (max-width: 600px) { .sticky-bar-text { display: none; } .sticky-bar { justify-content: center; } }

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
      filter: none; /* prevent browser dark-mode inversion */
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

    /* ======================== HERO ======================== */
    #hero {
      min-height: 88vh; display: flex; align-items: center;
      padding-top: 68px; position: relative; overflow: hidden;
    }

    /* Canvas particles */
    #hero-canvas {
      position: absolute; inset: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 0;
    }

    /* Subtle radial glows */
    .hero-glow-a {
      position: absolute; top: -15%; right: -8%; width: 60vw; height: 60vw;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(212,175,55,0.055) 0%, transparent 65%);
      pointer-events: none; z-index: 0;
    }
    .hero-glow-b {
      position: absolute; bottom: -15%; left: -8%; width: 44vw; height: 44vw;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(212,175,55,0.025) 0%, transparent 60%);
      pointer-events: none; z-index: 0;
    }

    /* Horizontal hairlines */
    .hero-lines {
      position: absolute; inset: 0; pointer-events: none; z-index: 0;
      background-image:
        linear-gradient(var(--border) 1px, transparent 1px),
        linear-gradient(90deg, var(--border) 1px, transparent 1px);
      background-size: 80px 80px;
      opacity: 0.35;
      mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 15%, transparent 72%);
    }

    .hero-inner { position: relative; z-index: 2; padding: 10px 0 110px; width: 100%; text-align: center; display: flex; flex-direction: column; align-items: center; }
    #hero .container { max-width: 100%; padding: 0 25vw; text-align: center; }
    @media (max-width: 900px) { #hero .container { padding: 0 8vw; } }
    @media (max-width: 600px) { #hero .container { padding: 0 5vw; } }

    .hero-eyebrow-wrap {
      margin-bottom: 38px;
      opacity: 0; animation: fadeUp 0.7s ease 0.1s forwards;
    }

    /* HEADLINE */
    .hero-headline {
      font-family: var(--fh);
      font-size: clamp(2.6rem, 6.8vw, 6.5rem);
      font-weight: 800;
      line-height: 0.96;
      letter-spacing: -0.03em;
      margin-bottom: 32px;
      opacity: 0;
      animation: fadeUp 0.75s ease 0.25s forwards;
    }

    /* Rotating phrase container */
    .rotate-wrap {
      display: inline-block;
      white-space: nowrap;
      color: var(--gold);
    }
    .rotate-word {
      display: inline;
      white-space: nowrap;
      transition: opacity 0.38s ease;
    }
    .rotate-word.exit  { opacity: 0; }
    .rotate-word.enter { opacity: 0; }
    .rotate-word.show  { opacity: 1; }

    /* Gold shimmer on hero text */
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

    .hero-sub {
      font-size: 0.97rem; color: var(--gray-light);
      max-width: 490px; line-height: 1.78; font-weight: 400; margin: 0 auto 38px;
      opacity: 0; animation: fadeUp 0.75s ease 0.4s forwards;
    }

    .hero-actions {
      display: flex; align-items: center; justify-content: center; gap: 14px; flex-wrap: wrap; margin-bottom: 72px;
      opacity: 0; animation: fadeUp 0.75s ease 0.55s forwards;
    }

    .hero-stats {
      display: flex; align-items: center; justify-content: center; gap: 0; flex-wrap: wrap;
      opacity: 0; animation: fadeUp 0.75s ease 0.7s forwards;
    }
    .hstat {
      display: flex; flex-direction: column; align-items: center; gap: 4px;
      padding: 0 36px;
      border-right: 1px solid var(--border-mid);
      text-align: center;
    }
    .hstat:first-child { padding-left: 0; }
    .hstat:last-child { border-right: none; padding-right: 0; }
    .hstat-val {
      font-family: var(--fh); font-weight: 800; font-size: 1.7rem;
      color: var(--gold); letter-spacing: -0.03em; line-height: 1;
      display: inline-block;
    }
    .hstat-lbl { font-size: 0.74rem; color: var(--gray); font-weight: 400; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(22px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ======================== MARQUEE ======================== */
    .marquee-wrap {
      border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
      background: var(--black); overflow: hidden; padding: 22px 0;
      -webkit-mask-image: linear-gradient(to right, transparent 0%, black 9%, black 91%, transparent 100%);
      mask-image: linear-gradient(to right, transparent 0%, black 9%, black 91%, transparent 100%);
    }
    .marquee-track {
      display: flex; animation: marquee 44s linear infinite; width: max-content;
      will-change: transform; backface-visibility: hidden; transform: translateZ(0);
    }
    .marquee-wrap:hover .marquee-track { animation-play-state: paused; }
    .marquee-item {
      display: flex; align-items: center; gap: 24px; padding: 0 36px;
      font-family: var(--fb); font-size: 0.72rem; font-weight: 600;
      letter-spacing: 0.2em; text-transform: uppercase; color: var(--gray); white-space: nowrap;
    }
    .marquee-item:hover span { color: var(--gold-light); transition: color 0.2s ease; }
    .marquee-gem {
      width: 5px; height: 5px; background: var(--gold); transform: rotate(45deg); flex-shrink: 0; opacity: 0.7;
    }
    @keyframes marquee { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-50%, 0, 0); } }

    /* ======================== SECTION: WHAT WE DO ======================== */
    #what-we-do { background: var(--black); padding: 120px 0; }

    .wwd-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start;
    }
    .wwd-left h2 {
      font-size: clamp(1.9rem, 3.6vw, 2.85rem); font-weight: 800;
      margin: 20px 0 28px;
    }
    .wwd-left p { font-size: 0.95rem; color: var(--gray-light); line-height: 1.85; margin-bottom: 14px; }

    .wwd-pillars { display: flex; flex-direction: column; }
    .pillar { display: flex; gap: 20px; padding: 28px 0; border-bottom: 1px solid var(--border); }
    .pillar:first-child { border-top: 1px solid var(--border); }
    .pillar-num {
      font-family: var(--fh); font-size: 0.67rem; font-weight: 700;
      letter-spacing: 0.14em; color: var(--gold); padding-top: 3px; flex-shrink: 0; width: 26px;
    }
    .pillar-content h4 { font-family: var(--fh); font-weight: 700; font-size: 0.98rem; margin-bottom: 7px; }
    .pillar-content p  { font-size: 0.86rem; color: var(--gray-light); line-height: 1.7; }

    @media (max-width: 900px) { .wwd-grid { grid-template-columns: 1fr; gap: 56px; } }

    /* ======================== SECTION: SYSTEMS DEMO ======================== */
    #systems-demo {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 88px 0;
      position: relative;
      overflow: hidden;
    }
    /* Subtle grid background */
    #systems-demo::before {
      content: '';
      position: absolute; inset: 0;
      background-image:
        linear-gradient(var(--border) 1px, transparent 1px),
        linear-gradient(90deg, var(--border) 1px, transparent 1px);
      background-size: 48px 48px;
      opacity: 0.15;
      pointer-events: none;
    }
    /* Radial vignette to soften grid edges */
    #systems-demo .sdemo-vignette {
      position: absolute; inset: 0; pointer-events: none; z-index: 0;
      background: radial-gradient(ellipse 80% 75% at 50% 45%, transparent 25%, var(--surface) 90%);
    }
    #systems-demo .container { position: relative; z-index: 1; }

    .sdemo-header { text-align: center; margin-bottom: 52px; }
    .sdemo-header h2 { font-size: clamp(1.7rem, 3.2vw, 2.55rem); font-weight: 800; margin-top: 16px; line-height: 1.12; }
    .sdemo-header p { font-size: 0.92rem; color: var(--gray-light); max-width: 400px; margin: 16px auto 0; line-height: 1.72; }

    /* ---- TAB NAVIGATION (centered inline) ---- */
    .demo-nav {
      display: flex; justify-content: center;
      overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch;
      margin-bottom: 0;
    }
    .demo-nav::-webkit-scrollbar { display: none; }
    /* Inner wrap: inline-block so it shrinks to content width — makes tabs truly centered */
    .demo-tabs-wrap {
      display: inline-flex; flex-direction: column; flex-shrink: 0;
      border: 1px solid var(--border); border-bottom: none;
      background: #080808; position: relative; overflow: hidden;
    }
    .demo-tabs { display: flex; }
    /* Sliding gold indicator bar */
    .demo-tab-indicator {
      position: absolute; bottom: 0; left: 0; height: 2px; width: 0;
      background: linear-gradient(90deg, var(--gold-dark) 0%, var(--gold-light) 50%, var(--gold-dark) 100%);
      background-size: 200% 100%;
      animation: indicator-shimmer 2.4s linear infinite;
      transition: left 0.38s cubic-bezier(0.4, 0, 0.2, 1),
                  width 0.38s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 5;
      pointer-events: none;
    }
    @keyframes indicator-shimmer {
      0%   { background-position: 0% 0%; }
      100% { background-position: 200% 0%; }
    }
    .demo-tab {
      flex-shrink: 0; background: none; border: none;
      padding: 20px 30px 18px; cursor: pointer; position: relative;
      display: flex; flex-direction: column; align-items: center; gap: 5px;
      transition: background 0.22s ease; min-width: 0;
    }
    .demo-tab + .demo-tab::before {
      content: ''; position: absolute; left: 0; top: 20%; bottom: 20%;
      width: 1px; background: var(--border);
    }
    .demo-tab-num {
      font-family: var(--fh); font-size: 0.58rem; font-weight: 800;
      letter-spacing: 0.16em; color: var(--border-mid);
      transition: color 0.22s ease; line-height: 1;
    }
    .demo-tab-label {
      font-family: var(--fb); font-size: 0.7rem; font-weight: 600;
      letter-spacing: 0.07em; text-transform: uppercase; color: var(--gray);
      white-space: nowrap; transition: color 0.22s ease;
    }
    .demo-tab:hover { background: rgba(255,255,255,0.025); }
    .demo-tab:hover .demo-tab-num { color: var(--gold); }
    .demo-tab:hover .demo-tab-label { color: var(--off-white); }
    .demo-tab.active .demo-tab-num { color: var(--gold); }
    .demo-tab.active .demo-tab-label { color: var(--white); }

    /* ---- PANEL STATUS BAR ---- */
    .demo-panel-status {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 24px; border-bottom: 1px solid var(--border);
      background: rgba(0,0,0,0.65); backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }
    .demo-status-dot {
      width: 7px; height: 7px; border-radius: 50%; background: var(--gold);
      flex-shrink: 0; animation: status-pulse 2.5s ease-in-out infinite;
    }
    @keyframes status-pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.55); }
      50%       { box-shadow: 0 0 0 5px rgba(212,175,55,0); }
    }
    .demo-status-text { font-family: var(--fb); font-size: 0.62rem; font-weight: 600;
      letter-spacing: 0.12em; text-transform: uppercase; color: var(--gray); flex: 1; min-width: 0; }
    .demo-status-name { color: var(--off-white); }
    .demo-status-live {
      font-family: var(--fb); font-size: 0.58rem; font-weight: 700;
      letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold);
      flex-shrink: 0;
    }

    /* ---- PANEL CONTAINER ---- */
    .demo-panel-wrap {
      border: 1px solid var(--border); border-top: none;
      background: linear-gradient(165deg, #131313 0%, #161616 55%, #111 100%);
      min-height: 360px; overflow: hidden; position: relative;
    }
    /* Animated loop progress bar — thin line at top of panel */
    .demo-loop-bar {
      position: absolute; top: 0; left: 0; height: 2px; width: 0%;
      background: linear-gradient(90deg, rgba(212,175,55,0.25) 0%, var(--gold) 50%, rgba(212,175,55,0.25) 100%);
      z-index: 4; pointer-events: none; transition: none;
    }
    .demo-panel {
      display: none; padding: 44px 40px;
      animation: panel-in 0.35s ease forwards;
    }
    .demo-panel.active { display: block; }
    @keyframes panel-in {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ---- SHARED PHONE FRAME ---- */
    .dp-phone-wrap { display: flex; justify-content: center; flex-shrink: 0; }
    .dp-phone {
      width: 178px; background: #0C0C0C; border: 2px solid #2A2A2A; border-radius: 28px;
      padding: 10px 7px 14px;
      box-shadow: 0 0 0 1px #181818, 0 20px 56px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.04);
      position: relative; flex-shrink: 0;
    }
    .dp-phone::before {
      content: ''; position: absolute; left: 50%; transform: translateX(-50%);
      top: 9px; width: 52px; height: 9px; background: #111; border-radius: 0 0 7px 7px;
    }
    .dp-screen {
      background: #111; border-radius: 18px; min-height: 230px; overflow: hidden;
      padding: 26px 7px 10px; display: flex; flex-direction: column;
    }
    .dp-status {
      display: flex; justify-content: space-between; align-items: center;
      padding: 0 6px 7px; font-size: 0.5rem; color: var(--gray); font-family: var(--fb); font-weight: 600;
    }
    .dp-body { flex: 1; padding: 0 3px; overflow: hidden; }

    /* SMS styles (shared) */
    .sms-in {
      background: #1C1C1E; color: #E5E5EA; border-radius: 10px 10px 10px 2px;
      padding: 8px 10px; font-size: 0.57rem; line-height: 1.55; font-family: var(--fb);
      margin-bottom: 5px; display: block;
    }
    .sms-out {
      background: #0A84FF; color: #fff; border-radius: 10px 10px 2px 10px;
      padding: 8px 10px; font-size: 0.57rem; line-height: 1.55; font-family: var(--fb);
      margin-left: auto; display: block; max-width: 85%;
    }
    .sms-label { font-size: 0.48rem; color: var(--gray); font-family: var(--fb); text-align: center; margin: 4px 0 6px; display: block; }
    .sms-gold { color: var(--gold); font-weight: 700; }

    /* ============================================================
       TAB 1 — LEAD ALERT
    ============================================================ */
    .la-grid {
      display: grid; grid-template-columns: 1fr 70px 1fr;
      align-items: center; max-width: 760px; margin: 0 auto;
    }
    .la-form {
      background: rgba(255,255,255,0.025); border: 1px solid var(--border-mid);
      padding: 22px 20px 16px; border-radius: 3px;
    }
    .la-form-label {
      font-family: var(--fb); font-size: 0.57rem; font-weight: 600;
      letter-spacing: 0.18em; text-transform: uppercase; color: var(--gold);
      margin-bottom: 14px; display: flex; align-items: center; gap: 6px;
    }
    .la-dot { width: 6px; height: 6px; background: var(--gold); border-radius: 50%; animation: la-dot-pulse 6s ease-in-out infinite; }
    @keyframes la-dot-pulse { 0%,34%,100% { box-shadow: none; } 38% { box-shadow: 0 0 0 4px rgba(212,175,55,0.25); } }
    .la-field { margin-bottom: 8px; }
    .la-field-lbl { font-size: 0.55rem; color: var(--gray); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 3px; }
    .la-field-val {
      background: rgba(255,255,255,0.03); border: 1px solid var(--border-mid); border-radius: 2px;
      padding: 7px 10px; font-size: 0.75rem; color: var(--off-white); font-family: var(--fb);
    }
    .la-btn {
      width: 100%; margin-top: 11px; background: var(--gold); color: var(--black);
      font-family: var(--fh); font-weight: 700; font-size: 0.73rem;
      padding: 10px; border: none; border-radius: 2px; cursor: default;
      animation: la-submit 6s ease-in-out infinite;
    }
    @keyframes la-submit {
      0%,32%,100% { background: var(--gold); color: var(--black); box-shadow: none; transform: scale(1); }
      36%          { background: var(--gold-light); transform: scale(0.97); }
      40%,90%      { background: var(--gold-light); color: var(--black); box-shadow: 0 0 22px rgba(212,175,55,0.35), 0 0 6px rgba(212,175,55,0.18); transform: scale(1); }
    }
    .la-connector { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; }
    .la-timing {
      font-family: var(--fh); font-weight: 800; font-size: 0.8rem; color: var(--gold);
      white-space: nowrap; opacity: 0; animation: la-timing-in 6s ease-in-out infinite;
    }
    @keyframes la-timing-in { 0%,38%,100%{opacity:0;} 44%,88%{opacity:1;} }
    .la-arrow { display: flex; flex-direction: row; align-items: center; }
    .la-arrow-line {
      width: 34px; height: 1.5px;
      background: linear-gradient(to right, transparent, var(--gold), transparent);
      opacity: 0; animation: la-arr 6s ease-in-out infinite;
    }
    .la-arrow-head {
      width: 0; height: 0;
      border-top: 5px solid transparent; border-bottom: 5px solid transparent; border-left: 7px solid var(--gold);
      opacity: 0; animation: la-arr 6s ease-in-out infinite;
    }
    @keyframes la-arr { 0%,38%,100%{opacity:0;} 44%,88%{opacity:1;} }
    .la-notif {
      background: #1C1C1E; border-radius: 10px; padding: 10px; margin: 0 2px;
      animation: la-notif-drop 6s ease-in-out infinite; transform: translateY(-100px); opacity: 0;
    }
    @keyframes la-notif-drop {
      0%,42%   { transform: translateY(-100px); opacity: 0; }
      48%      { transform: translateY(0);      opacity: 1; }
      84%      { transform: translateY(0);      opacity: 1; }
      90%,100% { transform: translateY(-100px); opacity: 0; }
    }
    .la-notif-top { display: flex; align-items: center; gap: 5px; margin-bottom: 5px; }
    .la-notif-icon {
      width: 15px; height: 15px; background: var(--gold); border-radius: 3px;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.46rem; font-weight: 800; color: var(--black); font-family: var(--fh); flex-shrink: 0;
    }
    .la-notif-src { font-size: 0.53rem; color: #aaa; font-family: var(--fb); font-weight: 600; }
    .la-notif-ts  { font-size: 0.49rem; color: #666; margin-left: auto; font-family: var(--fb); }
    .la-notif-body { font-size: 0.56rem; color: #E5E5E5; font-family: var(--fb); line-height: 1.5; }
    .la-notif-body .gh { color: var(--gold); font-weight: 600; }
    .la-read {
      text-align: right; margin-top: 4px; font-size: 0.49rem; color: var(--gold); font-family: var(--fb);
      animation: la-read 6s ease-in-out infinite; opacity: 0;
    }
    @keyframes la-read { 0%,54%,88%,100%{opacity:0;} 60%,83%{opacity:1;} }

    /* ============================================================
       TAB 2 — FOLLOW-UP CHAIN
    ============================================================ */
    .fu-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 36px; align-items: start; max-width: 800px; margin: 0 auto; }
    .fu-steps { display: flex; flex-direction: column; }
    .fu-step {
      display: flex; gap: 14px; padding: 14px 0 14px 18px;
      border-left: 2px solid var(--border); margin-left: 8px; position: relative;
      opacity: 0.3; transition: opacity 0.4s ease, border-left-color 0.4s ease;
    }
    .fu-step::before {
      content: ''; position: absolute; left: -7px; top: 17px;
      width: 12px; height: 12px; border-radius: 50%;
      background: var(--card); border: 2px solid var(--border-mid);
      transition: background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
    }
    .fu-step:first-child { padding-top: 4px; }
    .fu-step:first-child::before { top: 8px; }
    .fu-step.lit { opacity: 1; border-left-color: rgba(212,175,55,0.6); }
    .fu-step.lit::before { background: var(--gold); border-color: var(--gold); box-shadow: 0 0 8px rgba(212,175,55,0.45); }
    .fu-step-time { font-family: var(--fh); font-size: 0.64rem; font-weight: 700; color: var(--gold); white-space: nowrap; min-width: 58px; padding-top: 2px; }
    .fu-step-info h4 { font-family: var(--fh); font-size: 0.83rem; font-weight: 700; margin-bottom: 2px; }
    .fu-step-info p  { font-size: 0.75rem; color: var(--gray-light); line-height: 1.5; }
    .fu-msg { opacity: 0; transform: translateY(6px); transition: opacity 0.38s ease, transform 0.38s ease; }
    .fu-msg.vis { opacity: 1; transform: translateY(0); }
    .fu-reply { opacity: 0; transform: translateY(6px); transition: opacity 0.38s ease 0.1s, transform 0.38s ease 0.1s; }
    .fu-reply.vis { opacity: 1; transform: translateY(0); }

    /* ============================================================
       TAB 3 — CRM PIPELINE
    ============================================================ */
    .crm-layout { max-width: 860px; margin: 0 auto; }
    .crm-lead-info { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
    .crm-lead-avatar {
      width: 34px; height: 34px; background: var(--gold-dim); border: 1px solid var(--gold-border);
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      font-family: var(--fh); font-size: 0.76rem; font-weight: 800; color: var(--gold); flex-shrink: 0;
    }
    .crm-lead-name { font-family: var(--fh); font-weight: 700; font-size: 0.9rem; }
    .crm-lead-sub  { font-size: 0.7rem; color: var(--gray-light); }
    .crm-progress  { flex: 1; min-width: 80px; height: 3px; background: var(--border); border-radius: 2px; overflow: hidden; }
    .crm-progress-fill {
      height: 100%; background: linear-gradient(to right, var(--gold-dark), var(--gold)); border-radius: 2px;
      width: 0%; transition: width 0.7s cubic-bezier(0.25,0.46,0.45,0.94);
    }
    .crm-board-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .crm-board {
      display: grid; grid-template-columns: repeat(5, minmax(120px, 1fr));
      gap: 1px; background: var(--border-mid); min-width: 580px;
    }
    .crm-stage { background: var(--black); padding: 14px 11px 52px; transition: background 0.4s ease; position: relative; min-height: 130px; }
    .crm-stage.active-stage { background: rgba(212,175,55,0.04); }
    .crm-stage-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; padding-bottom: 9px; border-bottom: 1px solid var(--border); }
    .crm-stage-name { font-family: var(--fb); font-size: 0.58rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gray); transition: color 0.4s ease; }
    .crm-stage.active-stage .crm-stage-name { color: var(--gold); }
    .crm-stage-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--border-mid); transition: background 0.4s ease, box-shadow 0.4s ease; flex-shrink: 0; }
    .crm-stage.active-stage .crm-stage-dot { background: var(--gold); box-shadow: 0 0 6px rgba(212,175,55,0.5); }
    .crm-card {
      position: absolute; bottom: 10px; left: 8px; right: 8px;
      background: rgba(212,175,55,0.07); border: 1px solid rgba(212,175,55,0.18);
      padding: 9px; border-radius: 3px;
      opacity: 0; transform: translateY(5px); transition: opacity 0.35s ease, transform 0.35s ease;
    }
    .crm-stage.active-stage .crm-card { opacity: 1; transform: translateY(0); }
    .crm-card-name { font-family: var(--fh); font-weight: 700; font-size: 0.7rem; margin-bottom: 2px; }
    .crm-card-sub  { font-size: 0.59rem; color: var(--gray-light); line-height: 1.4; }
    .crm-card-badge { display: inline-block; margin-top: 5px; font-size: 0.5rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--gold); background: rgba(212,175,55,0.1); padding: 2px 6px; border-radius: 2px; }

    /* ============================================================
       TAB 4 — BOOKING SYSTEM
    ============================================================ */
    .bk-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 36px; align-items: center; max-width: 760px; margin: 0 auto; }
    .bk-steps { display: flex; flex-direction: column; gap: 8px; }
    .bk-step {
      display: flex; gap: 14px; align-items: flex-start; padding: 15px 16px;
      border: 1px solid var(--border); border-radius: 2px;
      opacity: 0.3; transition: opacity 0.4s ease, border-color 0.4s ease, background 0.4s ease;
    }
    .bk-step.lit { opacity: 1; border-color: var(--gold-border); background: rgba(212,175,55,0.04); }
    .bk-step-num {
      width: 22px; height: 22px; border-radius: 50%;
      background: var(--border-mid); display: flex; align-items: center; justify-content: center;
      font-family: var(--fh); font-size: 0.6rem; font-weight: 800; color: var(--gray);
      flex-shrink: 0; transition: background 0.4s ease, color 0.4s ease;
    }
    .bk-step.lit .bk-step-num { background: var(--gold); color: var(--black); }
    .bk-step-content h4 { font-family: var(--fh); font-weight: 700; font-size: 0.83rem; margin-bottom: 2px; }
    .bk-step-content p  { font-size: 0.75rem; color: var(--gray-light); line-height: 1.5; }
    .bk-msg { opacity: 0; transform: translateY(5px); transition: opacity 0.35s ease, transform 0.35s ease; }
    .bk-msg.vis { opacity: 1; transform: translateY(0); }

    /* ============================================================
       TAB 5 — REVIEW REQUEST
    ============================================================ */
    .rv-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 36px; align-items: center; max-width: 760px; margin: 0 auto; }
    .rv-left { display: flex; flex-direction: column; gap: 12px; }
    .rv-trigger {
      border: 1px solid var(--border); padding: 13px 15px; border-radius: 3px;
      display: flex; align-items: center; gap: 12px;
      opacity: 0.3; transition: opacity 0.4s ease, border-color 0.4s ease;
    }
    .rv-trigger.lit { opacity: 1; border-color: var(--gold-border); }
    .rv-trigger-icon { width: 30px; height: 30px; background: rgba(62,207,110,0.12); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; flex-shrink: 0; }
    .rv-trigger-text h4 { font-family: var(--fh); font-weight: 700; font-size: 0.8rem; }
    .rv-trigger-text p  { font-size: 0.71rem; color: var(--gray-light); line-height: 1.45; }
    .rv-stars-wrap { padding: 14px; border: 1px solid var(--border); border-radius: 3px; text-align: center; opacity: 0.25; transition: opacity 0.4s ease; }
    .rv-stars-wrap.lit { opacity: 1; }
    .rv-stars-label { font-size: 0.63rem; color: var(--gray); margin-bottom: 10px; font-family: var(--fb); display: block; }
    .rv-stars { display: flex; gap: 5px; justify-content: center; }
    .rv-star { font-size: 1.45rem; color: var(--border-mid); transition: color 0.25s ease, transform 0.25s ease; display: inline-block; }
    .rv-star.lit { color: #F5C518; transform: scale(1.18); }
    .rv-result {
      border: 1px solid rgba(212,175,55,0.22); padding: 13px 15px; border-radius: 3px;
      background: rgba(212,175,55,0.04);
      opacity: 0; transform: translateY(6px); transition: opacity 0.4s ease, transform 0.4s ease;
    }
    .rv-result.vis { opacity: 1; transform: translateY(0); }
    .rv-result-stars { font-size: 0.82rem; color: #F5C518; letter-spacing: 2px; margin-bottom: 5px; }
    .rv-result-quote { font-size: 0.71rem; color: var(--gray-light); line-height: 1.55; font-style: italic; }
    .rv-result-name  { font-family: var(--fh); font-weight: 700; font-size: 0.7rem; margin-top: 6px; color: var(--off-white); }
    .rv-msg { opacity: 0; transform: translateY(5px); transition: opacity 0.35s ease, transform 0.35s ease; }
    .rv-msg.vis { opacity: 1; transform: translateY(0); }

    /* ---- Caption ---- */
    .sdemo-caption { text-align: center; margin-top: 32px; font-size: 0.78rem; color: var(--gray); font-style: italic; }
    .sdemo-caption strong { color: var(--gold); font-style: normal; }

    /* ============================================================
       RESPONSIVE — SYSTEMS DEMO
    ============================================================ */
    @media (max-width: 820px) {
      .la-grid { grid-template-columns: 1fr; gap: 20px; }
      .la-connector { flex-direction: row; justify-content: center; gap: 8px; }
      .la-arrow { flex-direction: column; align-items: center; }
      .la-arrow-line { width: 1.5px; height: 36px; background: linear-gradient(to bottom, transparent, var(--gold), transparent); }
      .la-arrow-head { border-top: none; border-bottom: 7px solid var(--gold); border-left: 5px solid transparent; border-right: 5px solid transparent; }
    }
    @media (max-width: 700px) {
      .demo-panel { padding: 28px 18px; }
      .fu-layout, .bk-layout, .rv-layout { grid-template-columns: 1fr; gap: 24px; }
      .dp-phone-wrap { order: -1; }
    }
    @media (max-width: 580px) {
      .demo-tab { padding: 15px 18px 13px; }
      .demo-tab-label { font-size: 0.64rem; }
    }
    @media (max-width: 420px) {
      .demo-tab { padding: 13px 13px 11px; }
      .demo-tab-num { font-size: 0.54rem; }
      .demo-tab-label { font-size: 0.6rem; }
    }
    @media (max-width: 400px) {
      .dp-phone { width: 155px; }
      .demo-tab { padding: 12px 10px 10px; }
    }

    /* ======================== SECTION: HOW IT WORKS ======================== */
    #how-it-works {
      background: var(--black);
      border-bottom: 1px solid var(--border);
      height: 100vh;
      padding: 0;
      overflow: hidden;
      position: relative;
    }

    /* Full-height flex row: left column + right clipping column */
    .hiw-pin-sticky {
      position: relative;
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: row;
    }

    /* LEFT: static column — eyebrow + H2, fades right into the sliding panels */
    .hiw-head {
      position: relative;
      z-index: 10;
      flex: 0 0 clamp(260px, 42vw, 500px);
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 48px 0 clamp(24px, 6vw, 80px);
      background: linear-gradient(90deg, var(--black) 70%, transparent 100%);
    }
    .hiw-head .eyebrow {
      margin-bottom: 28px;
      align-self: flex-start;
    }
    .hiw-head h2 {
      font-size: clamp(1.9rem, 3vw, 2.6rem);
      font-weight: 800;
      line-height: 1.12;
      text-align: left;
      margin: 0;
      max-width: 380px;
    }

    /* RIGHT: clipping column — overflow:hidden so the 300vw strip stays contained */
    .hiw-right {
      position: relative;
      flex: 1 1 0;
      overflow: hidden;
    }

    /* The 300vw sliding strip, positioned inside .hiw-right */
    .hiw-pin-wrap {
      position: absolute;
      top: 0; left: 0; bottom: 0;
      display: flex;
      width: 300%;          /* 300% of .hiw-right, not 300vw — avoids overflow */
      will-change: transform;
    }

    /* Each panel = 1/3 of the strip = 100% of .hiw-right = the visible right column */
    .hiw-step {
      width: 33.333%;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      overflow: hidden;
      text-align: left;
      padding: 0 clamp(32px, 5vw, 72px);
      box-sizing: border-box;
    }

    /* Ghost step number — absolutely positioned right side of slide */
    .hiw-num-ghost {
      position: absolute;
      right: clamp(16px, 5vw, 56px);
      top: 50%;
      transform: translateY(-50%);
      font-family: var(--fh);
      font-size: clamp(8rem, 20vw, 16rem);
      font-weight: 800;
      color: var(--gold);
      opacity: 0.04;
      line-height: 1;
      letter-spacing: -0.06em;
      user-select: none;
      pointer-events: none;
      z-index: 0;
    }

    /* Ensure text content sits above the ghost number */
    .hiw-step h3,
    .hiw-step-rule,
    .hiw-step p,
    .hiw-step-list { position: relative; z-index: 1; }

    /* Title */
    .hiw-step h3 {
      font-family: var(--fh);
      font-size: clamp(1.6rem, 2.8vw, 2.4rem);
      font-weight: 800;
      line-height: 1.1;
      margin: 0 0 20px;
      letter-spacing: -0.02em;
    }

    /* Gold rule beneath title */
    .hiw-step-rule {
      width: 40px;
      height: 2px;
      background: var(--gold);
      margin-bottom: 24px;
      border-radius: 2px;
    }

    /* Body copy */
    .hiw-step p {
      font-size: clamp(0.88rem, 1.1vw, 0.97rem);
      color: var(--gray-light);
      line-height: 1.8;
      max-width: 420px;
      margin-bottom: 28px;
    }

    /* Bullet list */
    .hiw-step-list {
      list-style: none;
      padding: 0; margin: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .hiw-step-list li {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: clamp(0.82rem, 1vw, 0.92rem);
      color: var(--white);
      line-height: 1.5;
    }
    .hiw-step-list li::before {
      content: '◆';
      font-size: 0.45rem;
      color: var(--gold);
      flex-shrink: 0;
      margin-top: 5px;
    }

    /* Progress dots — bottom center of whole section */
    .hiw-dots {
      position: absolute;
      bottom: 96px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 10px;
      z-index: 20;
    }
    .hiw-dot {
      width: 7px; height: 7px; border-radius: 50%;
      background: var(--border-mid);
      transition: background 0.3s, transform 0.3s;
    }
    .hiw-dot.active { background: var(--gold); transform: scale(1.5); }

    /* Mobile: vertical stack */
    @media (max-width: 768px) {
      #how-it-works { height: auto; overflow: visible; }
      .hiw-pin-sticky { flex-direction: column; height: auto; padding: 72px 0; }
      .hiw-head { flex: none; width: 100%; background: none; padding: 0 24px 40px; }
      .hiw-head h2 { font-size: clamp(1.8rem, 6vw, 2.4rem); max-width: 100%; }
      .hiw-right { flex: none; overflow: visible; }
      .hiw-pin-wrap { position: static; flex-direction: column; width: 100%; transform: none !important; }
      .hiw-step { width: 100%; padding: 40px 24px 0; }
      .hiw-step p { max-width: 100%; }
      .hiw-dots { position: static; margin: 32px 0 0 24px; }
    }

    /* ======================== SECTION: SERVICES ======================== */
    #services {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 120px 0;
      position: relative;
    }
    #services::before {
      content: '';
      display: block;
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent 0%, var(--gold) 30%, var(--gold-light) 50%, var(--gold) 70%, transparent 100%);
      opacity: 0.7;
    }

    .svc-header { text-align: center; margin-bottom: 68px; }
    .svc-header h2 { font-size: clamp(1.9rem, 3.6vw, 2.85rem); font-weight: 800; margin-top: 18px; }
    .svc-header p {
      margin-top: 16px; font-size: 0.94rem; color: var(--gray-light);
      max-width: 440px; margin-left: auto; margin-right: auto; line-height: 1.75;
    }

    .svc-grid {
      display: grid; grid-template-columns: repeat(3,1fr);
      gap: 1px; background: var(--border); border: 1px solid var(--border);
    }

    /* ── Scroll pop-up: cards start hidden, .card-in shows them ── */
    .svc-card {
      background: var(--black); padding: 48px 34px;
      display: flex; flex-direction: column; position: relative;
      opacity: 0;
      transform: translateY(52px) scale(0.97);
      transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1),
                  transform 0.6s cubic-bezier(0.22,1,0.36,1),
                  background 0.25s ease;
    }
    .svc-card.card-in {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    .svc-card:hover { background: #060503; }

    /* All Pillar labels are gold — no exceptions */
    .svc-tier {
      font-family: var(--fb); font-size: 0.67rem; font-weight: 600;
      letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin-bottom: 10px;
    }

    .svc-name {
      font-family: var(--fh); font-size: 1.55rem; font-weight: 800;
      margin-bottom: 8px; letter-spacing: -0.02em;
    }
    .svc-target {
      font-size: 0.83rem; color: var(--gray-light); line-height: 1.6;
      margin-bottom: 28px; padding-bottom: 24px; border-bottom: 1px solid var(--border);
    }
    .svc-features { list-style: none; display: flex; flex-direction: column; gap: 13px; flex: 1; margin-bottom: 36px; }
    .svc-features li {
      display: flex; align-items: flex-start; gap: 10px;
      font-size: 0.86rem; color: var(--gray-light); line-height: 1.45;
    }
    .svc-check {
      color: var(--gold); font-size: 0.65rem; font-weight: 700;
      flex-shrink: 0; margin-top: 3px; letter-spacing: 0;
    }

    .svc-note { text-align: center; margin-top: 44px; font-size: 0.84rem; color: var(--gray); font-style: italic; }
    .svc-note a { color: var(--gold); text-decoration: none; }

    @media (max-width: 900px) {
      .svc-grid { grid-template-columns: 1fr; max-width: 440px; margin: 0 auto; background: transparent; border: none; }
      .svc-card { border: 1px solid var(--border); }
      .svc-card.card-in:nth-child(1),
      .svc-card.card-in:nth-child(2),
      .svc-card.card-in:nth-child(3) { animation: none; }
    }

    /* ======================== SECTION: WHY TRIFACTOR ======================== */
    #why-tfs { background: var(--surface-warm); border-bottom: 1px solid var(--border); padding: 120px 0; }

    /* Centered statement block */
    .why-statement { text-align: center; max-width: 680px; margin: 0 auto 60px; }
    .why-statement h2 { font-size: clamp(2.4rem, 5vw, 4.2rem); font-weight: 800; margin: 20px 0 24px; line-height: 1.0; }
    .why-statement > p { font-size: 0.95rem; color: var(--gray-light); line-height: 1.85; }

    /* Stat row — centered under statement */
    .why-proof { display: flex; justify-content: center; gap: 56px; flex-wrap: wrap; margin-bottom: 72px; }
    .wstat { display: flex; flex-direction: column; gap: 4px; text-align: center; }
    .wstat-val {
      font-family: var(--fh); font-size: 2.9rem; font-weight: 800;
      color: var(--gold); letter-spacing: -0.03em; line-height: 1;
    }
    .wstat-lbl { font-size: 0.76rem; color: var(--gray); }

    /* 5-column horizontal items grid */
    .why-items {
      display: grid; grid-template-columns: repeat(5, 1fr);
      gap: 1px; background: var(--border); border: 1px solid var(--border);
    }
    .why-item {
      background: rgba(0,0,0,0.5);
      padding: 28px 20px; display: flex; flex-direction: column; align-items: flex-start; gap: 14px;
      transition: background 0.3s ease;
      cursor: default;
    }
    .why-item:hover { background: rgba(0,0,0,0.82); }

    /* Icon containers */
    .wi-icon {
      width: 38px; height: 38px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      background: var(--gold-dim); border: 1px solid var(--gold-border); border-radius: 3px;
      position: relative; overflow: hidden;
    }

    /* --- ICON 1: Lightning bolt (We Move Fast) --- */
    .icon-bolt svg { transition: filter 0.3s ease; }
    .why-item:hover .icon-bolt svg { filter: drop-shadow(0 0 6px var(--gold)); }
    @keyframes bolt-zap {
      0%,85%   { opacity: 0.7; }
      88%      { opacity: 1; }
      91%      { opacity: 0.4; }
      94%      { opacity: 1; }
      100%     { opacity: 0.7; }
    }
    .icon-bolt svg { animation: bolt-zap 3.5s ease infinite; }

    /* --- ICON 2: Target rings (Skin in the Game) --- */
    @keyframes ring-pulse {
      0%,100% { r: 6; opacity: 0.3; }
      50%     { r: 9; opacity: 0.8; }
    }
    @keyframes ring-pulse2 {
      0%,100% { r: 10; opacity: 0.15; }
      50%     { r: 13; opacity: 0.5; }
    }
    .icon-target .ring1 { animation: ring-pulse  2s ease-in-out infinite; }
    .icon-target .ring2 { animation: ring-pulse2 2s ease-in-out 0.4s infinite; }

    /* --- ICON 3: Stacked bars (Enterprise Stack) --- */
    @keyframes layer-lift {
      0%,60%,100% { transform: translateY(0); }
      30%         { transform: translateY(-2.5px); }
    }
    .icon-stack .layer1 { animation: layer-lift 2.4s ease-in-out 0s infinite; }
    .icon-stack .layer2 { animation: layer-lift 2.4s ease-in-out 0.2s infinite; }
    .icon-stack .layer3 { animation: layer-lift 2.4s ease-in-out 0.4s infinite; }

    /* --- ICON 4: Bar chart growing (Full Transparency) --- */
    @keyframes bar-grow {
      0%,100% { transform: scaleY(1); }
      50%     { transform: scaleY(1.35); }
    }
    .icon-chart .bar1 { transform-origin: bottom; animation: bar-grow 2s ease-in-out 0s infinite; }
    .icon-chart .bar2 { transform-origin: bottom; animation: bar-grow 2s ease-in-out 0.25s infinite; }
    .icon-chart .bar3 { transform-origin: bottom; animation: bar-grow 2s ease-in-out 0.5s infinite; }

    /* --- ICON 5: Circular arrows (Systems Compound) --- */
    @keyframes spin-cw  { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .icon-cycle .spin-group { transform-origin: 50% 50%; animation: spin-cw 4s linear infinite; }

    .wi-title { font-family: var(--fh); font-weight: 700; font-size: 0.88rem; margin-bottom: 4px; }
    .wi-desc  { font-size: 0.78rem; color: var(--gray-light); line-height: 1.58; }

    @media (max-width: 1000px) { .why-items { grid-template-columns: repeat(3, 1fr); } }
    @media (max-width: 640px)  { .why-items { grid-template-columns: repeat(2, 1fr); } }

    /* ======================== SECTION: CLIENTS ======================== */
    #clients { background: var(--black); border-bottom: 1px solid var(--border); padding: 80px 0; }

    .cl-header { margin-bottom: 52px; text-align: center; }
    .cl-header h2 { font-size: clamp(1.9rem, 3.6vw, 2.85rem); font-weight: 800; margin-top: 18px; }
    .cl-header p  { margin-top: 12px; font-size: 0.92rem; color: var(--gray-light); max-width: 460px; margin-left: auto; margin-right: auto; }

    /* Featured wide card */
    .cl-featured {
      border: 1px solid var(--gold-border);
      background: linear-gradient(135deg, rgba(212,175,55,0.05) 0%, rgba(0,0,0,0) 55%);
      padding: 44px 52px; margin-bottom: 1px;
      display: flex; align-items: flex-start; justify-content: space-between; gap: 52px;
      transition: background 0.3s ease; position: relative; overflow: hidden;
    }
    .cl-featured:hover { background: linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(0,0,0,0) 55%); }
    .clf-tag {
      position: absolute; top: 0; right: 0;
      background: var(--gold); color: var(--black);
      font-family: var(--fb); font-size: 0.55rem; font-weight: 700;
      letter-spacing: 0.2em; text-transform: uppercase; padding: 5px 14px;
    }
    .clf-body { flex: 1; min-width: 0; }
    .clf-name { font-family: var(--fh); font-size: 2.2rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 8px; }
    .clf-type {
      font-size: 0.67rem; color: var(--gold); font-family: var(--fb);
      font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 16px;
    }
    .clf-desc { font-size: 0.93rem; color: var(--gray-light); line-height: 1.74; margin-bottom: 22px; max-width: 560px; }
    .clf-link {
      font-family: var(--fh); font-size: 0.8rem; font-weight: 700;
      color: var(--gold); text-decoration: none; letter-spacing: 0.04em;
      transition: color 0.2s ease;
    }
    .clf-link:hover { color: var(--gold-light); }

    /* 5-col compact row */
    .cl-row {
      display: grid; grid-template-columns: repeat(5, 1fr);
      gap: 1px; background: var(--border); border: 1px solid var(--border); border-top: none;
    }
    .cl-card { background: var(--card); padding: 28px 24px; transition: background 0.25s ease; }
    .cl-card:hover { background: var(--card-hover); }
    .cl-name { font-family: var(--fh); font-weight: 800; font-size: 0.98rem; margin-bottom: 5px; }
    .cl-type {
      font-size: 0.63rem; color: var(--gold); font-family: var(--fb);
      font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 10px;
    }
    .cl-desc { font-size: 0.8rem; color: var(--gray-light); line-height: 1.65; }

    @media (max-width: 900px)  { .cl-row { grid-template-columns: repeat(3, 1fr); } }
    @media (max-width: 600px)  { .cl-row { grid-template-columns: repeat(2, 1fr); } .cl-featured { flex-direction: column; gap: 20px; padding: 32px 28px; } .clf-name { font-size: 1.7rem; } }

    /* ======================== SECTION: QUALIFY ======================== */
    #qualify {
      background: var(--surface-warm); border-bottom: 1px solid var(--border); padding: 100px 0;
      position: relative; overflow: hidden;
    }
    #qualify::before {
      content: ''; position: absolute; top: 50%; left: 50%;
      transform: translate(-50%,-50%);
      width: 600px; height: 400px;
      background: radial-gradient(ellipse, rgba(212,175,55,0.05) 0%, transparent 65%);
      pointer-events: none;
    }

    /* Split layout: criteria left, CTA right */
    .qualify-split {
      display: grid; grid-template-columns: 1fr 360px; gap: 80px; align-items: start;
    }
    .qualify-criteria h2 { font-size: clamp(1.9rem, 3.6vw, 2.85rem); font-weight: 800; margin: 20px 0 14px; }
    .qualify-criteria > p { font-size: 0.93rem; color: var(--gray-light); max-width: 440px; margin-bottom: 40px; line-height: 1.75; }

    /* List items — clean, not cards */
    .qualify-list { display: flex; flex-direction: column; gap: 0; }
    .qualify-item {
      display: flex; align-items: flex-start; gap: 14px;
      padding: 16px 0; border-bottom: 1px solid var(--border);
    }
    .qualify-item:first-child { border-top: 1px solid var(--border); }
    .qualify-check {
      width: 20px; height: 20px; border: 1.5px solid var(--gold); border-radius: 2px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; margin-top: 1px;
    }
    .qualify-check-mark {
      width: 9px; height: 6px; border-left: 2px solid var(--gold); border-bottom: 2px solid var(--gold);
      transform: rotate(-45deg) translateY(-1px);
    }
    .qualify-item p { font-size: 0.88rem; color: var(--gray-light); line-height: 1.6; }

    /* Right-side CTA box */
    .qualify-action { position: sticky; top: 120px; }
    .qa-box {
      background: rgba(0,0,0,0.5); border: 1px solid var(--gold-border);
      padding: 40px 36px; position: relative; overflow: hidden;
    }
    .qa-box::before {
      content: ''; position: absolute; inset: 0;
      background: radial-gradient(ellipse 100% 80% at 50% 0%, rgba(212,175,55,0.06) 0%, transparent 65%);
      pointer-events: none;
    }
    .qa-box h3 { font-family: var(--fh); font-size: 1.35rem; font-weight: 800; margin-bottom: 14px; position: relative; }
    .qa-box > p { font-size: 0.88rem; color: var(--gray-light); line-height: 1.72; margin-bottom: 28px; position: relative; }
    .qa-box .btn-gold { width: 100%; justify-content: center; position: relative; }
    .qa-note { margin-top: 18px; font-size: 0.75rem; color: var(--gray); font-style: italic; line-height: 1.55; }
    .qa-note strong { color: var(--gold-light); font-style: normal; }

    @media (max-width: 900px) { .qualify-split { grid-template-columns: 1fr; gap: 48px; } .qualify-action { position: static; } }
    @media (max-width: 480px) { .qualify-item { padding: 14px 0; } }

    /* ======================== SECTION: FAQ ======================== */
    #faq { background: var(--black); border-bottom: 1px solid var(--border); padding: 100px 0; }

    .faq-grid { display: grid; grid-template-columns: 280px 1fr; gap: 80px; align-items: start; }
    .faq-left h2 { font-size: clamp(1.75rem, 3.2vw, 2.5rem); font-weight: 800; margin: 18px 0 16px; }
    .faq-left > p { font-size: 0.88rem; color: var(--gray-light); line-height: 1.75; margin-bottom: 32px; }

    .faq-list { display: flex; flex-direction: column; }
    .faq-item { border-bottom: 1px solid var(--border); }
    .faq-item:first-child { border-top: 1px solid var(--border); }

    .faq-q {
      width: 100%; background: none; border: none; color: var(--white);
      font-family: var(--fh); font-weight: 600; font-size: 0.93rem; text-align: left;
      padding: 22px 0; cursor: pointer; display: flex; justify-content: space-between;
      align-items: center; gap: 16px; transition: color 0.2s ease; line-height: 1.45;
    }
    .faq-q:hover { color: var(--gold); }
    .faq-icon {
      width: 22px; height: 22px; border: 1px solid var(--border-mid); border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; font-size: 0.78rem; color: var(--gray);
      transition: all 0.28s ease; font-family: var(--fb);
    }
    .faq-item.open .faq-icon { background: var(--gold); border-color: var(--gold); color: var(--black); transform: rotate(45deg); }

    .faq-a { max-height: 0; overflow: hidden; transition: max-height 0.4s ease; }
    .faq-a-inner { padding-bottom: 22px; font-size: 0.88rem; color: var(--gray-light); line-height: 1.82; }

    @media (max-width: 900px) { .faq-grid { grid-template-columns: 1fr; gap: 48px; } }

    /* ======================== SECTION: FINAL CTA ======================== */
    #cta {
      background: var(--cta-bg); padding: 160px 0; text-align: center;
      position: relative; overflow: hidden;
    }
    #cta::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--gold) 30%, var(--gold-light) 50%, var(--gold) 70%, transparent);
    }
    .cta-glow {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
      width: 900px; height: 600px;
      background: radial-gradient(ellipse, rgba(212,175,55,0.13) 0%, rgba(212,175,55,0.04) 45%, transparent 70%);
      pointer-events: none;
    }
    .cta-glow-b {
      position: absolute; bottom: -20%; left: 50%; transform: translateX(-50%);
      width: 500px; height: 300px;
      background: radial-gradient(ellipse, rgba(212,175,55,0.06) 0%, transparent 65%);
      pointer-events: none;
    }
    #cta .eyebrow { justify-content: center; display: flex; }
    #cta h2 {
      font-family: var(--fh); font-size: clamp(3rem, 7.5vw, 7rem); font-weight: 800;
      line-height: 0.97; letter-spacing: -0.035em; margin: 28px 0 36px; position: relative;
    }
    #cta > .container > p {
      font-size: 0.98rem; color: var(--gray-light); max-width: 430px;
      margin: 0 auto 48px; line-height: 1.78;
    }
    .cta-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; position: relative; }
    .cta-sub {
      margin-top: 24px; font-size: 0.8rem; color: var(--gray); position: relative;
    }
    .cta-sub a { color: var(--gold); text-decoration: none; font-weight: 500; }

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
      content: '';
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

    /* Brand column */
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

    /* Nav columns */
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

    /* Bottom bar */
    .footer-bottom {
      padding: 22px 0;
      display: flex; justify-content: space-between; align-items: center;
      flex-wrap: wrap; gap: 12px;
    }
    .footer-copy { font-size: 0.73rem; color: var(--gray); }
    .footer-built {
      font-size: 0.73rem; color: var(--gray);
      font-style: italic;
    }
    .footer-built span { color: var(--gold); font-style: normal; }

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
       GLOBAL RESPONSIVE SYSTEM — All breakpoints consolidated
       Priority: maintain structure first, then scale content
    ============================================================ */

    /* 1. Prevent text from overflowing grid/flex containers everywhere */
    .wwd-grid > *, .hiw-steps > *, .faq-grid > *,
    .svc-grid > *, .cl-row > *, .hiw-step,
    .fu-layout > *, .bk-layout > *, .rv-layout > *,
    .la-grid > *, .qualify-split > *, .testi-row > *,
    .footer-top > *, .crm-board > *, .pillar-content,
    .why-item, .faq-q { min-width: 0; }

    /* 2. Intermediate tablet (901–1100px) — tighten large gaps before breakpoints trigger */
    @media (max-width: 1100px) {
      .wwd-grid { gap: 48px; }
      .faq-grid  { gap: 48px; }
    }

    /* 3. Tablet (≤900px) — reduce section padding, fix layout gaps */
    @media (max-width: 900px) {
      section                          { padding: 72px 0; }
      #what-we-do, #services, #why-tfs { padding: 84px 0; }
      #systems-demo                    { padding: 64px 0; }
      #how-it-works                    { padding: 72px 0; }
      #qualify, #faq                   { padding: 72px 0; }
      #clients, #testimonials          { padding: 64px 0; }
      #cta                             { padding: 100px 0; }
      footer                           { padding: 48px 0 28px; }
    }

    /* 4. Mobile landscape / large phone (≤768px) */
    @media (max-width: 768px) {
      section                          { padding: 60px 0; }
      #what-we-do, #services, #why-tfs { padding: 68px 0; }
      #cta                             { padding: 80px 0; }
      .hero-inner                      { padding: 40px 0 80px; }

      /* Service cards single-column */
      .svc-card { padding: 36px 24px; }
      .svc-card.featured { padding-top: 52px; }

      /* FAQ left col */
      .faq-left { padding-bottom: 0; }
    }

    /* 5. Mobile (≤600px) — significant reductions, container padding */
    @media (max-width: 600px) {
      section                          { padding: 52px 0; }
      #what-we-do, #services, #why-tfs { padding: 60px 0; }
      #systems-demo                    { padding: 52px 0; }
      #cta                             { padding: 72px 0; }
      #qualify, #faq                   { padding: 56px 0; }
      #clients, #testimonials          { padding: 52px 0; }
      footer                           { padding: 40px 0 24px; }
      .hero-inner                      { padding: 32px 0 64px; }

      /* Container: tighten on small phones */
      .container { padding: 0 20px; }

      /* Why TFS stats: reduce big number font */
      .wstat-val { font-size: 2.2rem; }
      .why-proof { gap: 32px; }

      /* Client cards in single col: less padding */
      .cl-card { padding: 22px 18px; }

      /* CTA heading */
      #cta h2 { margin: 18px 0 26px; }
    }

    /* 6. Small mobile (≤480px) — hero stats, testimonials, demo */
    @media (max-width: 480px) {
      section                          { padding: 44px 0; }
      #cta                             { padding: 60px 0; }

      /* Hero: fix stat dividers when they may wrap */
      .hero-stats                      { flex-direction: column; gap: 0; align-items: center; width: 100%; max-width: 260px; }
      .hstat {
        flex-direction: row; align-items: baseline; justify-content: space-between;
        padding: 10px 0; border-right: none; border-left: none;
        border-bottom: 1px solid var(--border-mid);
        gap: 12px; width: 100%; text-align: left;
      }
      .hstat:first-child { padding-left: 0; }
      .hstat:last-child { border-bottom: none; padding-right: 0; }
      .hstat-val { font-size: 1.35rem; }
      .hstat-lbl { font-size: 0.7rem; }

      /* Testimonials: reduce padding */
      .testi-featured { padding: 28px 20px 24px; }
      .testi-card     { padding: 24px 18px; }

      /* Demo panel padding */
      .demo-panel { padding: 22px 16px; }

      /* FAQ button font */
      .faq-q { font-size: 0.87rem; padding: 18px 0; }

      /* Services: even tighter */
      .svc-card { padding: 30px 20px; }
      .svc-card.featured { padding-top: 46px; }

      /* Buttons: don't let them overflow */
      .btn-gold, .btn-outline { padding: 13px 24px; font-size: 0.82rem; }

      /* Nav logo size */
      .nav-logo img { height: 46px; }
    }

    /* 7. Tiny phones (≤360px) */
    @media (max-width: 360px) {
      .container      { padding: 0 16px; }
      .demo-panel     { padding: 16px 12px; }
      .demo-tab       { padding: 10px 9px 8px; }
      .demo-tab-num   { font-size: 0.5rem; }
      .demo-tab-label { font-size: 0.54rem; }
      .dp-phone       { width: 148px; }
      .la-field-val   { font-size: 0.68rem; padding: 6px 8px; }
      .hstat-val      { font-size: 1.2rem; }
      /* Tab indicator: reposition on resize */
      .demo-tab-indicator { transition: none; }
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
      .page-hero { padding: 110px 0 56px !important; }
      .page-hero-inner { padding: 0 !important; }
      .page-hero-inner h1 { font-size: clamp(1.9rem, 7vw, 2.8rem) !important; }
    }

    /* ── Footer ── */
    @media (max-width: 768px) {
      .footer-top { grid-template-columns: 1fr 1fr !important; gap: 36px !important; }
      .footer-brand { grid-column: 1 / -1 !important; }
    }
    @media (max-width: 500px) {
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
    .svc-card, .why-item, .cl-card, .hiw-step,
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
  

    /* ============================================================
       NAV SCROLL
    ============================================================ */
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 50));

    /* ============================================================
       MOBILE MENU
    ============================================================ */
    window.toggleMenu = function() { document.getElementById('mobileMenu').classList.toggle('open'); }
    document.addEventListener('click', e => {
      const m = document.getElementById('mobileMenu');
      if (m.classList.contains('open') && !document.getElementById('navbar').contains(e.target) && !m.contains(e.target)) m.classList.remove('open');
    });

    /* ============================================================
       PROGRESS DOTS — scroll helper
    ============================================================ */
    function scrollTo(id) { document.querySelector(id).scrollIntoView({ behavior: 'smooth' }); }


    /* ============================================================
       SCROLL REVEAL
    ============================================================ */
    const revObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revObs.observe(el));

    /* ── Service card pop-up: staggered per-card scroll reveal ── */
    (function() {
      var cardObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('card-in');
            cardObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });
      document.querySelectorAll('.svc-card').forEach(function(card, i) {
        card.style.transitionDelay = (i * 0.14) + 's';
        cardObs.observe(card);
      });
    })();

    /* ============================================================
       HORIZONTAL PROCESS — bidirectional scroll hijack
       • Scrolling DOWN: hijacks at step 01, drives 01→02→03, releases.
       • Scrolling UP:   hijacks at step 03 (from below), drives 03→02→01, releases.
       Uses capture phase on document so mouse position doesn't matter —
       the event is intercepted before the browser routes it to any element.
    ============================================================ */
    (function() {
      if (window.innerWidth <= 768) return;
      var section = document.getElementById('how-it-works');
      var wrap    = document.getElementById('hiwPinWrap');
      var dots    = document.querySelectorAll('.hiw-dot');
      if (!section || !wrap) return;

      var progress = 0;      // 0 = step 01, 1 = step 03
      var hijacked = false;
      var doneDown = false;  // forward pass completed — don't re-lock scrolling down
      var doneUp   = false;  // reverse pass completed — don't re-lock scrolling up

      function apply(p) {
        progress = Math.max(0, Math.min(1, p));
        /* .hiw-pin-wrap = 300% of .hiw-right; shift 0 → -66.667% to traverse all 3 panels */
        wrap.style.transform = 'translateX(' + (-progress * 66.6667) + '%)';
        var idx = Math.min(2, Math.floor(progress * 3));
        dots.forEach(function(d, i) { d.classList.toggle('active', i === idx); });
      }

      function lock(snapProgress) {
        /* Snap page so section top aligns with viewport top */
        var rect = section.getBoundingClientRect();
        window.scrollTo(0, window.scrollY + rect.top);
        document.documentElement.style.overflow = 'hidden';
        hijacked = true;
        apply(snapProgress);
      }

      function unlock() {
        document.documentElement.style.overflow = '';
        hijacked = false;
      }

      /* ---- Capture-phase listener: fires regardless of which element the mouse is over ---- */
      document.addEventListener('wheel', function(e) {
        var rect  = section.getBoundingClientRect();
        /* Generous ±80px tolerance — catches natural scroll inertia stopping near-top */
        var nearTop = rect.top > -80 && rect.top < 80;

        /* Already hijacked — own every wheel event until we release */
        if (hijacked) {
          e.preventDefault();
          var raw = e.deltaMode === 1 ? e.deltaY * 40
                  : e.deltaMode === 2 ? e.deltaY * window.innerHeight
                  : e.deltaY;
          apply(progress + raw / window.innerWidth);
          if (progress >= 1 && e.deltaY > 0) { doneDown = true;  unlock(); }
          else if (progress <= 0 && e.deltaY < 0) { doneUp = true; unlock(); }
          return;
        }

        /* Forward hijack: section near top, user scrolling DOWN */
        if (!doneDown && nearTop && e.deltaY > 0) {
          e.preventDefault();
          doneUp = false;
          lock(0);
          return;
        }

        /* Reverse hijack: section near top, user scrolling UP */
        if (!doneUp && nearTop && e.deltaY < 0) {
          e.preventDefault();
          doneDown = false;
          lock(1);
          return;
        }
      }, { passive: false, capture: true });

      /* Reset when section scrolls well above the fold */
      window.addEventListener('scroll', function() {
        if (hijacked) return;
        var rect = section.getBoundingClientRect();
        if (rect.top > window.innerHeight * 0.5) {
          apply(0);
          doneDown = false;
          doneUp   = false;
        }
      }, { passive: true });
    })();

    /* ============================================================
       STICKY CTA BAR
    ============================================================ */
    const bar  = document.getElementById('stickyBar');
    const hero = document.getElementById('hero');
    function checkBar() {
      const heroBottom = hero.getBoundingClientRect().bottom;
      bar.classList.toggle('show', heroBottom < 0);
    }
    window.addEventListener('scroll', checkBar, { passive: true });

    /* ============================================================
       ROTATING HERO WORD
    ============================================================ */
    const words   = ['Books You.','Scales You.','Grows You.','Automates You.','Optimizes You.','Compounds You.'];
    let   wordIdx = 0;
    const rotEl   = document.getElementById('rotWord');

    function nextWord() {
      // Exit current word
      rotEl.classList.remove('show');
      rotEl.classList.add('exit');
      setTimeout(() => {
        wordIdx = (wordIdx + 1) % words.length;
        rotEl.textContent = words[wordIdx];
        rotEl.classList.remove('exit');
        rotEl.classList.add('enter');
        requestAnimationFrame(() => requestAnimationFrame(() => {
          rotEl.classList.remove('enter');
          rotEl.classList.add('show');
        }));
      }, 380);
    }
    setInterval(nextWord, 2800);

    /* ============================================================
       COUNTER ANIMATION
    ============================================================ */
    function animateCounter(el) {
      const target = parseInt(el.getAttribute('data-target'));
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      if (!target) return;
      const duration = 1400;
      const start    = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = prefix + Math.round(ease * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && e.target.getAttribute('data-target')) {
          animateCounter(e.target);
          counterObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));

    /* ============================================================
       FAQ ACCORDION
    ============================================================ */
    window.toggleFAQ = function(btn) {
      const item = btn.parentElement;
      const ans  = item.querySelector('.faq-a');
      const open = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-a').style.maxHeight = '0';
      });
      if (!open) {
        item.classList.add('open');
        ans.style.maxHeight = ans.scrollHeight + 40 + 'px';
      }
    };

    /* ============================================================
       SYSTEMS DEMO — Tab controller + animation runners
    ============================================================ */
    let _demoTimers = [];
    function _clearDemo() { _demoTimers.forEach(clearTimeout); _demoTimers = []; }

    const _demoLabels = {
      lead: 'Lead Alert', followup: 'Follow-Up Chain',
      crm: 'CRM Pipeline', booking: 'Booking System', review: 'Review Request'
    };
    const _demoLoopDurations = {
      lead: 6000, followup: 11500, crm: 9200, booking: 8200, review: 9000
    };

    /* Move the gold sliding indicator under the active tab */
    function _updateTabIndicator(btn) {
      const indicator = document.getElementById('demoTabIndicator');
      const wrap = document.getElementById('demoTabsWrap');
      if (!indicator || !wrap || !btn) return;
      const btnRect  = btn.getBoundingClientRect();
      const wrapRect = wrap.getBoundingClientRect();
      indicator.style.left  = (btnRect.left - wrapRect.left) + 'px';
      indicator.style.width = btnRect.width + 'px';
    }

    /* Animate the loop progress bar from 0→100% over durationMs */
    function _startLoopBar(durationMs) {
      const bar = document.getElementById('demoLoopBar');
      if (!bar) return;
      bar.style.transition = 'none';
      bar.style.width = '0%';
      void bar.offsetWidth; // force reflow
      bar.style.transition = 'width ' + durationMs + 'ms linear';
      bar.style.width = '100%';
    }

    function switchDemo(id, btn) {
      _clearDemo();
      document.querySelectorAll('.demo-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      _updateTabIndicator(btn);
      document.querySelectorAll('.demo-panel').forEach(p => p.classList.remove('active'));
      const panel = document.getElementById('panel-' + id);
      // Update status label
      const lbl = document.getElementById('demoStatusLabel');
      if (lbl) lbl.textContent = _demoLabels[id] || id;
      // Reset loop bar immediately
      const bar = document.getElementById('demoLoopBar');
      if (bar) { bar.style.transition = 'none'; bar.style.width = '0%'; }
      // Activate panel (CSS animation handles the fade-in via @keyframes panel-in)
      panel.classList.add('active');
      _demoReset(id);
      void panel.offsetWidth; // force reflow so CSS anims + panel-in restart
      _demoTimers.push(setTimeout(() => {
        _demoRunners[id] && _demoRunners[id]();
        _startLoopBar(_demoLoopDurations[id]);
      }, 80));
    }

    function _demoReset(id) {
      if (id === 'followup') {
        document.querySelectorAll('.fu-step').forEach(s => s.classList.remove('lit'));
        document.querySelectorAll('.fu-msg, .fu-reply').forEach(m => m.classList.remove('vis'));
      } else if (id === 'crm') {
        document.querySelectorAll('.crm-stage').forEach(s => s.classList.remove('active-stage'));
        const pf = document.getElementById('crmProgress');
        if (pf) { pf.style.transition = 'none'; pf.style.width = '0%'; void pf.offsetWidth; pf.style.transition = ''; }
      } else if (id === 'booking') {
        document.querySelectorAll('.bk-step').forEach(s => s.classList.remove('lit'));
        document.querySelectorAll('.bk-msg').forEach(m => m.classList.remove('vis'));
      } else if (id === 'review') {
        const el = id => document.getElementById(id);
        el('rvTrigger').classList.remove('lit');
        el('rvStarsWrap').classList.remove('lit');
        document.querySelectorAll('.rv-star').forEach(s => s.classList.remove('lit'));
        el('rvResult').classList.remove('vis');
        document.querySelectorAll('.rv-msg').forEach(m => m.classList.remove('vis'));
      }
    }

    const _demoRunners = {
      lead: function() { /* CSS keyframe loop — no JS needed */ },

      followup: function() {
        const s = i => document.getElementById('fu' + i);
        const m = i => document.getElementById('fum' + i);
        const r = document.getElementById('fureply');
        _demoTimers.push(setTimeout(() => { s(1).classList.add('lit'); m(0).classList.add('vis'); m(1).classList.add('vis'); }, 0));
        _demoTimers.push(setTimeout(() => { s(2).classList.add('lit'); m(2).classList.add('vis'); }, 1800));
        _demoTimers.push(setTimeout(() => { s(3).classList.add('lit'); m(3).classList.add('vis'); }, 3800));
        _demoTimers.push(setTimeout(() => { s(4).classList.add('lit'); m(4).classList.add('vis'); }, 5800));
        _demoTimers.push(setTimeout(() => { r.classList.add('vis'); }, 7400));
        _demoTimers.push(setTimeout(() => {
          _demoReset('followup');
          void document.getElementById('panel-followup').offsetWidth;
          _demoRunners.followup();
          _startLoopBar(11500);
        }, 11500));
      },

      crm: function() {
        const widths = ['10%', '30%', '55%', '78%', '100%'];
        const pf = document.getElementById('crmProgress');
        for (let i = 0; i < 5; i++) {
          _demoTimers.push(setTimeout(((idx) => () => {
            document.querySelectorAll('.crm-stage').forEach(s => s.classList.remove('active-stage'));
            document.getElementById('crm-' + idx).classList.add('active-stage');
            if (pf) pf.style.width = widths[idx];
          })(i), i * 1400));
        }
        _demoTimers.push(setTimeout(() => {
          _demoReset('crm');
          void document.getElementById('panel-crm').offsetWidth;
          _demoRunners.crm();
          _startLoopBar(9200);
        }, 5 * 1400 + 2200));
      },

      booking: function() {
        const s = i => document.getElementById('bk' + i);
        const m = i => document.getElementById('bkm' + i);
        _demoTimers.push(setTimeout(() => { s(1).classList.add('lit'); m(1).classList.add('vis'); }, 0));
        _demoTimers.push(setTimeout(() => { s(2).classList.add('lit'); m(2).classList.add('vis'); }, 2200));
        _demoTimers.push(setTimeout(() => { s(3).classList.add('lit'); m(3).classList.add('vis'); }, 4400));
        _demoTimers.push(setTimeout(() => {
          _demoReset('booking');
          void document.getElementById('panel-booking').offsetWidth;
          _demoRunners.booking();
          _startLoopBar(8200);
        }, 8200));
      },

      review: function() {
        const trig   = document.getElementById('rvTrigger');
        const sw     = document.getElementById('rvStarsWrap');
        const result = document.getElementById('rvResult');
        const stars  = document.querySelectorAll('.rv-star');
        _demoTimers.push(setTimeout(() => { trig.classList.add('lit'); document.getElementById('rvm1').classList.add('vis'); }, 0));
        _demoTimers.push(setTimeout(() => sw.classList.add('lit'), 2200));
        stars.forEach((s, i) => _demoTimers.push(setTimeout(() => s.classList.add('lit'), 2800 + i * 300)));
        _demoTimers.push(setTimeout(() => { result.classList.add('vis'); document.getElementById('rvm2').classList.add('vis'); }, 4500));
        _demoTimers.push(setTimeout(() => {
          _demoReset('review');
          void document.getElementById('panel-review').offsetWidth;
          _demoRunners.review();
          _startLoopBar(9000);
        }, 9000));
      }
    };

    /* ---- Initialize demo on first load ---- */
    (function _demoInit() {
      const firstTab = document.getElementById('dtab-lead');
      if (firstTab) {
        // Slight delay so layout is complete before measuring tab positions
        setTimeout(() => {
          _updateTabIndicator(firstTab);
          _startLoopBar(6000);
          _demoRunners.lead && _demoRunners.lead();
        }, 180);
      }
    })();

    /* Reposition sliding indicator on window resize */
    window.addEventListener('resize', function() {
      const activeTab = document.querySelector('.demo-tab.active');
      if (activeTab) _updateTabIndicator(activeTab);
    }, { passive: true });

    /* ============================================================
       HERO CANVAS — floating gold particles
    ============================================================ */
    (function() {
      const canvas = document.getElementById('hero-canvas');
      const ctx    = canvas.getContext('2d');
      let W, H, particles = [];

      function resize() {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
      }

      function createParticle() {
        return {
          x:     Math.random() * W,
          y:     Math.random() * H,
          r:     Math.random() * 1.5 + 0.4,
          alpha: Math.random() * 0.35 + 0.05,
          vx:    (Math.random() - 0.5) * 0.18,
          vy:    (Math.random() - 0.5) * 0.18,
          life:  Math.random() * 200 + 100,
          age:   0,
        };
      }

      function init() {
        resize();
        particles = Array.from({ length: 65 }, createParticle);
      }

      function draw() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach((p, i) => {
          p.x   += p.vx;
          p.y   += p.vy;
          p.age += 1;
          // fade in/out
          const t = p.age / p.life;
          const fade = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = \`rgba(212,175,55,\${p.alpha * fade})\`;
          ctx.fill();
          if (p.age >= p.life || p.x < 0 || p.x > W || p.y < 0 || p.y > H) {
            particles[i] = createParticle();
          }
        });
        requestAnimationFrame(draw);
      }

      window.addEventListener('resize', resize, { passive: true });
      init();
      draw();
    })();


`;
const HTML = `
<!-- ======================== STICKY CTA BAR ======================== -->
<div class="sticky-bar" id="stickyBar">
<p class="sticky-bar-text">Not sure if we're the right fit? <span>Let's find out.</span></p>
<a class="btn-gold" href="/apply" style="padding:11px 24px;font-size:0.8rem;white-space:nowrap;">Book Your Free Audit →</a>
</div>
<!-- ======================== NAV ======================== -->
<nav id="navbar">
<div class="container">
<div class="nav-inner">
<a aria-label="TriFactor Scaling" class="nav-logo" href="/">
<img alt="TriFactor Scaling" height="40" src="./TFS-Logo-Transparent.png"/>
</a>
<ul class="nav-links">
<li><a class="nav-link active-nav" href="/">Overview</a></li>
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
<a class="active-nav" href="/" onclick="toggleMenu()">Overview</a>
<a href="/services" onclick="toggleMenu()">Services</a>
<a href="/results" onclick="toggleMenu()">Results</a>
<a href="/about" onclick="toggleMenu()">About</a>
<a href="/apply" onclick="toggleMenu()">Apply Now →</a>
</div>
<!-- ======================== HERO ======================== -->
<section id="hero">
<canvas id="hero-canvas"></canvas>
<div class="hero-glow-a"></div>
<div class="hero-glow-b"></div>
<div class="hero-lines"></div>
<div class="container">
<div class="hero-inner">
<h1 class="hero-headline">
          We Build the<br/>
          System That<br/>
<span class="rotate-wrap">
<span class="rotate-word show gold-shimmer" id="rotWord">Books You.</span>
</span>
</h1>
<p class="hero-sub">
          We find what's blocking your growth.<br/>We build the systems to fix it.
        </p>
<div class="hero-actions">
<a class="btn-gold" href="#cta">Book Your Free Growth Audit →</a>
<a class="btn-outline" href="#how-it-works">See the Process</a>
</div>
<div class="hero-stats">
<div class="hstat">
<span class="hstat-val" data-suffix="+" data-target="12">12+</span>
<span class="hstat-lbl">Businesses Grown</span>
</div>
<div class="hstat">
<span class="hstat-val" data-prefix="$" data-suffix="K+" data-target="250">$250K+</span>
<span class="hstat-lbl">Client Revenue Built</span>
</div>
<div class="hstat">
<span class="hstat-val">100%</span>
<span class="hstat-lbl">Founder-Operated</span>
</div>
</div>
</div>
</div>
</section>
<!-- ======================== MARQUEE ======================== -->
<div aria-hidden="true" class="marquee-wrap">
<div class="marquee-track">
<!-- Set 1 -->
<div class="marquee-item"><span>LeadCompass</span><div class="marquee-gem"></div></div>
<div class="marquee-item"><span>CutByDack</span><div class="marquee-gem"></div></div>
<div class="marquee-item"><span>Profitable Barbers</span><div class="marquee-gem"></div></div>
<div class="marquee-item"><span>Dionet Academy</span><div class="marquee-gem"></div></div>
<div class="marquee-item"><span>Mectrix Media</span><div class="marquee-gem"></div></div>
<div class="marquee-item"><span>Rampal Restores</span><div class="marquee-gem"></div></div>
<!-- Set 2 -->
<div class="marquee-item"><span>LeadCompass</span><div class="marquee-gem"></div></div>
<div class="marquee-item"><span>CutByDack</span><div class="marquee-gem"></div></div>
<div class="marquee-item"><span>Profitable Barbers</span><div class="marquee-gem"></div></div>
<div class="marquee-item"><span>Dionet Academy</span><div class="marquee-gem"></div></div>
<div class="marquee-item"><span>Mectrix Media</span><div class="marquee-gem"></div></div>
<div class="marquee-item"><span>Rampal Restores</span><div class="marquee-gem"></div></div>
<!-- Set 3 -->
<div class="marquee-item"><span>LeadCompass</span><div class="marquee-gem"></div></div>
<div class="marquee-item"><span>CutByDack</span><div class="marquee-gem"></div></div>
<div class="marquee-item"><span>Profitable Barbers</span><div class="marquee-gem"></div></div>
<div class="marquee-item"><span>Dionet Academy</span><div class="marquee-gem"></div></div>
<div class="marquee-item"><span>Mectrix Media</span><div class="marquee-gem"></div></div>
<div class="marquee-item"><span>Rampal Restores</span><div class="marquee-gem"></div></div>
<!-- Set 4 -->
<div class="marquee-item"><span>LeadCompass</span><div class="marquee-gem"></div></div>
<div class="marquee-item"><span>CutByDack</span><div class="marquee-gem"></div></div>
<div class="marquee-item"><span>Profitable Barbers</span><div class="marquee-gem"></div></div>
<div class="marquee-item"><span>Dionet Academy</span><div class="marquee-gem"></div></div>
<div class="marquee-item"><span>Mectrix Media</span><div class="marquee-gem"></div></div>
<div class="marquee-item"><span>Rampal Restores</span><div class="marquee-gem"></div></div>
</div>
</div>
<!-- ======================== WHAT WE DO ======================== -->
<section id="what-we-do">
<div class="container">
<div class="wwd-grid">
<div class="wwd-left reveal-left">
<span class="eyebrow">What We Do</span>
<h2>Your business should be booking clients on autopilot.<br/><span class="gold-shimmer">Most aren't — yet.</span></h2>
<p>If you're manually following up on leads, losing track of inquiries, or unsure where your next client is coming from — that's a systems problem, not a you problem.</p>
<p>We build the fix. TriFactor builds the automated intake, follow-up, and tracking infrastructure that turns your lead flow into a predictable revenue engine — then we run it for you every month.</p>
</div>
<div class="wwd-pillars reveal-right">
<div class="pillar">
<div class="pillar-num">01</div>
<div class="pillar-content">
<h4>Free Growth Audit</h4>
<p>We look at how your business currently captures and follows up on leads. We show you exactly where revenue is slipping — before you spend a dollar.</p>
</div>
</div>
<div class="pillar">
<div class="pillar-num">02</div>
<div class="pillar-content">
<h4>We Build Your System</h4>
<p>We set up your intake forms, automated follow-up sequences, and CRM pipeline. Every lead is captured. Every inquiry gets followed up. Automatically.</p>
</div>
</div>
<div class="pillar">
<div class="pillar-num">03</div>
<div class="pillar-content">
<h4>We Run It Every Month</h4>
<p>We don't hand you off. We actively manage, optimize, and improve your system monthly — so your results compound over time instead of stalling out.</p>
</div>
</div>
<div class="pillar">
<div class="pillar-num">04</div>
<div class="pillar-content">
<h4>You See Every Number</h4>
<p>A live dashboard shows you exactly how many leads came in, how many were followed up, and what your system is generating in revenue. No guessing.</p>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- ======================== HOW IT WORKS ======================== -->
<section id="how-it-works">
<div class="hiw-pin-sticky">
<div class="hiw-head">
<span class="eyebrow">The Process</span>
<h2>From audit to automated revenue<br/>in three moves.</h2>
</div>
<div class="hiw-right">
<div class="hiw-pin-wrap" id="hiwPinWrap">

<div class="hiw-step" id="hiwStep0">
<span class="hiw-num-ghost">01</span>
<h3>Growth Audit</h3>
<div class="hiw-step-rule"></div>
<p>We map your entire business — lead flow, conversion points, revenue leaks, and untapped opportunities — and hand you a custom Growth System Blueprint.</p>
<ul class="hiw-step-list">
<li>Full funnel &amp; lead flow analysis</li>
<li>Revenue leak identification</li>
<li>Custom Growth System Blueprint delivered</li>
</ul>
</div>

<div class="hiw-step" id="hiwStep1">
<span class="hiw-num-ghost">02</span>
<h3>System Integration</h3>
<div class="hiw-step-rule"></div>
<p>We build and install your complete growth stack — funnels, CRM, automations, and a live tracking dashboard — wired directly into your operations from day one.</p>
<ul class="hiw-step-list">
<li>GHL funnel ecosystem &amp; landing pages</li>
<li>Automated lead sequences &amp; CRM pipeline</li>
<li>Live performance dashboard</li>
</ul>
</div>

<div class="hiw-step" id="hiwStep2">
<span class="hiw-num-ghost">03</span>
<h3>Optimize &amp; Scale</h3>
<div class="hiw-step-rule"></div>
<p>We stay in the trenches — monthly strategy calls, performance reviews, and continuous iteration until your system is compounding revenue, month over month.</p>
<ul class="hiw-step-list">
<li>Monthly strategy &amp; performance reviews</li>
<li>Continuous funnel &amp; automation optimization</li>
<li>Ongoing support &amp; iteration</li>
</ul>
</div>

</div>
</div>
</div>
<!-- Dots pinned bottom-center across the whole section -->
<div class="hiw-dots" id="hiwDots">
<div class="hiw-dot active" id="hiwDot0"></div>
<div class="hiw-dot" id="hiwDot1"></div>
<div class="hiw-dot" id="hiwDot2"></div>
</div>
</div>
</section>
<!-- ======================== SERVICES ======================== -->
<section id="services">
<div class="container">
<div class="svc-header reveal">
<span class="eyebrow">Services</span>
<h2>Start where you are.<br/>Scale as you grow.</h2>
</div>

<div class="svc-grid svc-grid-flow">

<!-- Pillar 01: Website & Funnel -->
<div class="svc-card">
<div class="svc-tier">Pillar 01</div>
<div class="svc-name">Website &amp; Funnel</div>
<p class="svc-target">Your online presence, engineered to convert. From first impression to first lead — built and maintained for you.</p>
<ul class="svc-features">
<li><span class="svc-check">◆</span>Homepage, services, about &amp; contact pages</li>
<li><span class="svc-check">◆</span>Lead capture form connected to your CRM</li>
<li><span class="svc-check">◆</span>Campaign landing pages &amp; lead funnels</li>
<li><span class="svc-check">◆</span>Booking and calendar integration</li>
<li><span class="svc-check">◆</span>Analytics, A/B testing &amp; retargeting pixel</li>
<li><span class="svc-check">◆</span>Mobile-optimized, Google-indexed, monthly maintenance</li>
</ul>
<a class="btn-apply" href="mailto:contact@trifactorscaling.com?subject=Website%20%26%20Funnel%20Inquiry">Website &amp; Funnel →</a>
</div>

<!-- Pillar 02: Growth Operations (FEATURED) -->
<div class="svc-card">
<div class="svc-tier">Pillar 02</div>
<div class="svc-name">Growth Operations</div>
<p class="svc-target">The system that turns leads into revenue. CRM, automations, follow-up — built once, running forever.</p>
<ul class="svc-features">
<li><span class="svc-check">◆</span>CRM setup and pipeline management</li>
<li><span class="svc-check">◆</span>Automated follow-up via email and SMS</li>
<li><span class="svc-check">◆</span>Lead nurture sequences</li>
<li><span class="svc-check">◆</span>Booking flows and appointment automation</li>
<li><span class="svc-check">◆</span>Reporting dashboard so nothing falls through</li>
</ul>
<a class="btn-apply btn-apply-fill" href="mailto:contact@trifactorscaling.com?subject=Growth%20Operations%20Inquiry">Growth Ops →</a>
</div>

<!-- Pillar 03: Marketing -->
<div class="svc-card">
<div class="svc-tier">Pillar 03</div>
<div class="svc-name">Marketing</div>
<p class="svc-target">Traffic on demand. Meta and TikTok ads built to perform — strategy, creative, and daily optimization.</p>
<ul class="svc-features">
<li><span class="svc-check">◆</span>Campaign strategy, ad copy &amp; creative direction</li>
<li><span class="svc-check">◆</span>Audience targeting and campaign buildout</li>
<li><span class="svc-check">◆</span>Daily optimization and retargeting</li>
<li><span class="svc-check">◆</span>Organic content strategy</li>
<li><span class="svc-check">◆</span>Monthly ROI reporting</li>
</ul>
<a class="btn-apply" href="mailto:contact@trifactorscaling.com?subject=Marketing%20Inquiry">Marketing →</a>
</div>

</div>

<p class="svc-note reveal" style="transition-delay:0.44s">
        Unsure if we're a fit for you?<br/>Email us directly at <a href="mailto:contact@trifactorscaling.com">contact@trifactorscaling.com</a>
      </p>
</div>
</section>
<!-- ======================== CLIENTS ======================== -->
<section id="clients">
<div class="container">
<div class="cl-header reveal">
<span class="eyebrow">Client Results</span>
<h2>Systems we built for businesses like yours.</h2>
</div>
<!-- Featured wide card: CutByDack -->
<div class="cl-featured reveal">
<div class="clf-tag">Featured Client</div>
<div class="clf-body">
<div class="clf-name">CutByDack</div>
<div class="clf-type">Barbershop · Toronto, ON</div>
<p class="clf-desc">Built a complete booking funnel and automated rebooking SMS system. Repeat clients now get rebooked without a single manual follow-up from Dack — the system runs 24/7 and fires the moment a job is marked complete.</p>
<a class="clf-link" href="/results">See all client results →</a>
</div>
</div>
<p class="reveal" style="transition-delay:0.05s;font-size:0.85rem;color:var(--muted);margin:18px 0 0;letter-spacing:0.02em;">Every client below has a live operation running right now.</p>
<!-- 5-col compact row: remaining clients -->
<div class="cl-row reveal" style="transition-delay:0.1s">
<div class="cl-card">
<div class="cl-name">Rampal Restores</div>
<div class="cl-type">Home Services</div>
<div class="cl-desc">GHL lead capture + 7-touch follow-up. Every inquiry answered in under 2 minutes.</div>
</div>
<div class="cl-card">
<div class="cl-name">Profitable Barbers</div>
<div class="cl-type">Coaching</div>
<div class="cl-desc">Automated enrollment pipeline. Consistent monthly revenue without manual outreach.</div>
</div>
<div class="cl-card">
<div class="cl-name">Dionet Academy</div>
<div class="cl-type">Education</div>
<div class="cl-desc">Traffic-to-enrollment funnel + AppSheet dashboard. Every lead tracked in real time.</div>
</div>
<div class="cl-card">
<div class="cl-name">LeadCompass</div>
<div class="cl-type">Lead Generation</div>
<div class="cl-desc">Full GHL funnel + automated routing. Scales volume without adding headcount.</div>
</div>
<div class="cl-card">
<div class="cl-name">Mectrix Media</div>
<div class="cl-type">Media &amp; Content</div>
<div class="cl-desc">Monetization funnel converting audience into a structured revenue pipeline.</div>
</div>
</div>
</div>
</section>
<!-- ======================== FAQ ======================== -->
<section id="faq">
<div class="container">
<div class="faq-grid">
<div class="faq-left reveal-left">
<span class="eyebrow">FAQ</span>
<h2>Common questions.</h2>
<p>Still have questions? Book a free Growth Audit — we'll walk through everything on the call with zero pressure. Or email us directly at <a href="mailto:contact@trifactorscaling.com" style="color:var(--gold);text-decoration:none;">contact@trifactorscaling.com</a></p>
<a class="btn-gold" href="#cta" style="display:inline-flex;margin-top:4px;">Book a Call →</a>
</div>
<div class="faq-list reveal-right">
<div class="faq-item">
<button class="faq-q" onclick="toggleFAQ(this)">
              What kind of businesses do you work with?
              <span class="faq-icon">+</span>
</button>
<div class="faq-a">
<div class="faq-a-inner">We work with local service businesses — barbershops, restoration companies, trades, coaching programs, and home service operations. Specifically: businesses that have real paying clients but no real system behind how they capture and follow up on leads. If your revenue is inconsistent or you know you're losing leads because of slow follow-up, that's exactly the problem we solve.</div>
</div>
</div>
<div class="faq-item">
<button class="faq-q" onclick="toggleFAQ(this)">
              What happens in the free Growth Audit?
              <span class="faq-icon">+</span>
</button>
<div class="faq-a">
<div class="faq-a-inner">A 45-minute strategy session where we map your current lead flow, identify your top 3 revenue leaks, and outline a custom growth system roadmap. You walk away with real clarity and a concrete plan — whether you hire us or not. No pitch, no pressure.</div>
</div>
</div>
<div class="faq-item">
<button class="faq-q" onclick="toggleFAQ(this)">
              Do I need to know tech to work with you?
              <span class="faq-icon">+</span>
</button>
<div class="faq-a">
<div class="faq-a-inner">Not at all. We handle the entire build, integration, and ongoing management. You show up for strategy calls and review the results. We take care of everything technical end-to-end.</div>
</div>
</div>
<div class="faq-item">
<button class="faq-q" onclick="toggleFAQ(this)">
              How is TriFactor different from a marketing agency?
              <span class="faq-icon">+</span>
</button>
<div class="faq-a">
<div class="faq-a-inner">Marketing agencies sell deliverables. We build infrastructure. Think of us as the operations team running inside your business — we build the funnels, automate the follow-up, track every lead, and optimize monthly. The goal is never a pretty deliverable. It's compounding revenue.</div>
</div>
</div>
<div class="faq-item">
<button class="faq-q" onclick="toggleFAQ(this)">
              How long until I see results?
              <span class="faq-icon">+</span>
</button>
<div class="faq-a">
<div class="faq-a-inner">The initial system build takes 4–6 weeks. Most clients see lead flow improvements within the first 30 days of going live. Compounding results show clearly by month 3. We set specific benchmarks during your Growth Audit so you always know what to expect and when.</div>
</div>
</div>
<div class="faq-item">
<button class="faq-q" onclick="toggleFAQ(this)">
              You're a young team — does that affect the quality of work?
              <span class="faq-icon">+</span>
</button>
<div class="faq-a">
<div class="faq-a-inner">Yes — and in your favor. No account managers. No junior staff running your project while a senior takes the credit. You work directly with the founders on every build. That means faster decisions, tighter feedback loops, and people personally invested in your results because their name is on it. Our clients choose us because of that edge, not despite it.</div>
</div>
</div>
<div class="faq-item">
<button class="faq-q" onclick="toggleFAQ(this)">
              How does the revenue share model work?
              <span class="faq-icon">+</span>
</button>
<div class="faq-a">
<div class="faq-a-inner">On our Full Scale service, we participate in revenue share on leads generated through the systems we build and manage. This aligns our incentives completely with yours — we only win when you win. The exact structure is agreed upfront based on your business model and projections before we begin.</div>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- ======================== FINAL CTA ======================== -->
<section id="cta">
<div class="cta-glow"></div>
<div class="cta-glow-b"></div>
<div class="container">
<!-- Eyebrow centered at the top of the section -->
<div class="reveal" style="text-align:center;margin-bottom:40px;"><span class="eyebrow">Apply Now</span></div>
<div style="display:flex;flex-direction:row;align-items:flex-start;gap:clamp(32px,5vw,80px);flex-wrap:wrap;">
  <!-- Left: text -->
  <div style="flex:1 1 300px;min-width:260px;display:flex;flex-direction:column;justify-content:center;padding-top:8px;">
    <h2 class="reveal" style="transition-delay:0.1s;font-size:clamp(1.8rem,3.2vw,3rem);font-weight:800;line-height:1.15;margin-top:0;text-align:left;">
      Stop running your business.<br/>Start building a <span style="background:linear-gradient(90deg,var(--gold) 0%,var(--gold-light) 50%,var(--gold) 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 3s linear infinite;">system that does.</span>
    </h2>
    <p class="reveal" style="transition-delay:0.2s;margin-top:20px;font-size:1rem;color:var(--muted);line-height:1.7;text-align:left;">
      We take on a limited number of new clients each month. Book your free Growth Audit and we'll map out exactly what's holding your revenue back — no pitch, no pressure.
    </p>
    <p class="cta-sub reveal" style="transition-delay:0.3s;margin-top:16px;text-align:left;">
      Prefer email? <a href="mailto:contact@trifactorscaling.com">contact@trifactorscaling.com</a>
    </p>
  </div>
  <!-- Right: booking calendar -->
  <div class="reveal" style="transition-delay:0.2s;flex:1 1 360px;min-width:300px;border:1px solid var(--border-mid);border-radius:6px;overflow:hidden;">
    <iframe scrolling="yes" src="https://api.leadconnectorhq.com/widget/bookings/tfs-calender" style="width:100%;height:620px;border:none;display:block;background:#0a0a0a;" title="Book Your Free Growth Audit"></iframe>
  </div>
</div>
</div>
</section>
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
<svg class="footer-social-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
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
const Index = () => {
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
    styleEl.setAttribute("data-tri-page", "tri-home");
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
    <div ref={rootRef} className="tri-home tri-page-fade"
      style={{ overflowX: "hidden", maxWidth: "100vw" }}
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: HTML }} />
  );
};
export default Index;
