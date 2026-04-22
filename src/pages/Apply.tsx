import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const CSS = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    .tri-apply {
      color-scheme: dark;
      --gold: #D4AF37; --gold-light: #E2C860; --gold-dark: #B8962A;
      --gold-dim: rgba(212,175,55,0.10); --gold-glow: rgba(212,175,55,0.22);
      --gold-border: rgba(212,175,55,0.28);
      --black: #000000; --surface: #0F0F0F; --surface-warm: #130F00; --cta-bg: #0B0800;
      --card: #161616; --card-hover: #1C1C1C; --border: #222222; --border-mid: #2E2E2E;
      --white: #FFFFFF; --off-white: #F2F0EB; --gray: #6B7280; --gray-light: #9CA3AF;
      --fh: 'Plus Jakarta Sans', sans-serif; --fb: 'Inter', sans-serif;
    } .tri-apply { scroll-behavior: smooth; }
    ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: var(--black); }
    ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 3px; }
    * { scrollbar-width: thin; scrollbar-color: var(--gold) var(--black); } .tri-apply { background: var(--black); color: var(--white); font-family: var(--fb); line-height: 1.6; overflow-x: hidden; }
    h1,h2,h3,h4 { font-family: var(--fh); line-height: 1.08; letter-spacing: -0.025em; }
    .container { max-width: 1140px; margin: 0 auto; padding: 0 28px; }
    section { padding: 100px 0; }
    @keyframes shimmer { 0%{background-position:-200% center;} 100%{background-position:200% center;} }
    .gold-shimmer {
      background: linear-gradient(90deg,var(--gold) 0%,var(--gold-light) 40%,#fff8d6 55%,var(--gold-light) 70%,var(--gold) 100%);
      background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text; animation: shimmer 4s linear infinite;
    }
    .eyebrow { display:inline-flex; align-items:center; gap:10px; font-family:var(--fb); font-size:0.7rem; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:var(--gold); }
    .eline { width:26px; height:1.5px; background:var(--gold); flex-shrink:0; }
    .btn-gold { display:inline-flex; align-items:center; gap:8px; background:var(--gold); color:var(--black); font-family:var(--fh); font-weight:700; font-size:0.86rem; letter-spacing:0.02em; padding:15px 32px; border:none; border-radius:2px; cursor:pointer; text-decoration:none; transition:background 0.22s ease,transform 0.22s ease,box-shadow 0.22s ease; }
    .btn-gold:hover { background:var(--gold-light); transform:translateY(-2px); box-shadow:0 10px 32px var(--gold-glow); }
    .btn-outline { display:inline-flex; align-items:center; gap:8px; background:transparent; color:var(--white); font-family:var(--fh); font-weight:600; font-size:0.86rem; letter-spacing:0.02em; padding:15px 32px; border:1px solid var(--border-mid); border-radius:2px; cursor:pointer; text-decoration:none; transition:border-color 0.22s ease,color 0.22s ease; }
    .btn-outline:hover { border-color:var(--gold); color:var(--gold); }
    .reveal { opacity:0; transform:translateY(30px); transition:opacity 0.7s cubic-bezier(0.25,0.46,0.45,0.94),transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94); }
    .reveal.visible { opacity:1; transform:translateY(0); }
    .reveal-left { opacity:0; transform:translateX(-30px); transition:opacity 0.7s ease,transform 0.7s ease; }
    .reveal-left.visible { opacity:1; transform:translateX(0); }
    .reveal-right { opacity:0; transform:translateX(30px); transition:opacity 0.7s ease,transform 0.7s ease; }
    .reveal-right.visible { opacity:1; transform:translateX(0); }
    @keyframes fadeUp { from{opacity:0;transform:translateY(22px);} to{opacity:1;transform:translateY(0);} }

    /* STICKY BAR */
    .sticky-bar { position:fixed; bottom:0; left:0; right:0; z-index:95; background:rgba(0,0,0,0.95); backdrop-filter:blur(20px); border-top:1px solid var(--gold-border); padding:14px 28px; display:flex; align-items:center; justify-content:space-between; gap:20px; transform:translateY(100%); transition:transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94); }
    .sticky-bar.show { transform:translateY(0); }
    .sticky-bar-text { font-family:var(--fh); font-size:0.88rem; font-weight:600; color:var(--off-white); }
    .sticky-bar-text span { color:var(--gold); }
    @media(max-width:600px){.sticky-bar-text{display:none;}.sticky-bar{justify-content:center;}}

    /* NAV */
    #navbar { position:fixed; top:0; left:0; right:0; z-index:100; padding:20px 0; border-bottom:1px solid transparent; transition:background 0.3s ease,border-color 0.3s ease,padding 0.3s ease; }
    #navbar.scrolled { background:rgba(0,0,0,0.94); backdrop-filter:blur(24px); border-color:var(--border); padding:13px 0; }
    .nav-inner { display:grid; grid-template-columns:1fr auto 1fr; align-items:center; gap:0; }
    .nav-logo { display:flex; align-items:center; text-decoration:none; }
    .nav-logo img { height:56px; width:auto; object-fit:contain; }
    .nav-cta-wrap { display:flex; align-items:center; justify-content:flex-end; gap:12px; }
    .nav-links { display:flex; align-items:center; justify-content:center; gap:36px; list-style:none; }
    .nav-links a { font-family:var(--fb); font-size:0.82rem; font-weight:500; color:var(--gray-light); text-decoration:none; transition:color 0.2s ease; }
    .nav-links a:hover { color:var(--white); }
    .nav-links a.active-nav { color:var(--gold); }
    .hamburger { display:none; flex-direction:column; gap:5px; background:none; border:none; cursor:pointer; padding:4px; }
    .hamburger span { display:block; width:22px; height:1.5px; background:var(--white); transition:all 0.3s; }
    .mobile-menu { display:none; position:fixed; top:61px; left:0; right:0; background:rgba(0,0,0,0.97); backdrop-filter:blur(24px); border-bottom:1px solid var(--border); padding:20px 28px; z-index:99; flex-direction:column; }
    .mobile-menu.open { display:flex; }
    .mobile-menu a { font-family:var(--fb); font-size:0.95rem; font-weight:500; color:var(--white); text-decoration:none; padding:14px 0; border-bottom:1px solid var(--border); }
    .mobile-menu a.active-nav { color:var(--gold); }
    .mobile-menu a:last-child { border-bottom:none; color:var(--gold); padding-top:18px; }
    @media(max-width:768px){.nav-links,.nav-cta{display:none;}.hamburger{display:flex;}}

    /* PAGE HERO */
    .page-hero { background:var(--black); border-bottom:1px solid var(--border); padding:140px 0 80px; position:relative; overflow:hidden; }
    .page-hero::before { content:''; position:absolute; inset:0; background-image:linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px); background-size:60px 60px; opacity:0.2; pointer-events:none; }
    .page-hero::after { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 70% 60% at 50% 40%,transparent 25%,var(--black) 85%); pointer-events:none; }
    .page-hero .container { position:relative; z-index:1; }
    .page-hero h1 { font-size:clamp(2.6rem,6vw,5.5rem); font-weight:800; line-height:0.97; letter-spacing:-0.03em; margin:20px 0 24px; }
    .page-hero p { font-size:clamp(0.9rem,1.6vw,1.05rem); color:var(--gray-light); max-width:520px; line-height:1.8; }

    /* APPLY HERO SPECIFIC */
    .apply-hero-grid { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; }
    .apply-hero-right { display:flex; flex-direction:column; gap:16px; }
    .apply-availability {
      display:inline-flex; align-items:center; gap:10px;
      background:rgba(212,175,55,0.07); border:1px solid var(--gold-border);
      padding:10px 18px; border-radius:2px;
    }
    .apply-avail-dot { width:8px; height:8px; border-radius:50%; background:#3ecf6e; animation:avail-pulse 2s ease-in-out infinite; }
    @keyframes avail-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(62,207,110,0.55);} 50%{box-shadow:0 0 0 5px rgba(62,207,110,0);} }
    .apply-avail-text { font-family:var(--fh); font-size:0.75rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--gold); }
    .apply-what-box { background:var(--card); border:1px solid var(--border); padding:28px 24px; }
    .apply-what-title { font-family:var(--fh); font-weight:700; font-size:0.75rem; letter-spacing:0.18em; text-transform:uppercase; color:var(--gold); margin-bottom:16px; }
    .apply-what-item { display:flex; align-items:flex-start; gap:10px; padding:8px 0; border-bottom:1px solid var(--border); font-size:0.86rem; color:var(--gray-light); line-height:1.5; }
    .apply-what-item:last-child { border-bottom:none; }
    .apply-what-check { color:var(--gold); font-size:0.7rem; font-weight:700; flex-shrink:0; margin-top:3px; }

    /* QUALIFY SECTION */
    #qualify { background:var(--surface); border-bottom:1px solid var(--border); padding:100px 0; position:relative; overflow:hidden; }
    #qualify::before { content:''; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:600px; height:400px; background:radial-gradient(ellipse,rgba(212,175,55,0.05) 0%,transparent 65%); pointer-events:none; }

    /* 2-col split: header left, checklist right */
    .qualify-split { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:start; }
    .qualify-left h2 { font-size:clamp(1.9rem,3.2vw,2.6rem); font-weight:800; margin:20px 0 18px; line-height:1.1; }
    .qualify-left p { font-size:0.94rem; color:var(--gray-light); line-height:1.78; margin-bottom:28px; }
    .qualify-left-cta { margin-top:8px; }

    /* Clean left-aligned checklist — no cards */
    .qualify-clean-list { display:flex; flex-direction:column; gap:0; }
    .qualify-clean-item { display:flex; align-items:flex-start; gap:16px; padding:16px 0; border-bottom:1px solid var(--border); }
    .qualify-clean-item:first-child { border-top:1px solid var(--border); }
    .qualify-clean-dot { width:8px; height:8px; background:var(--gold); border-radius:50%; flex-shrink:0; margin-top:5px; }
    .qualify-clean-item p { font-size:0.9rem; color:var(--off-white); line-height:1.6; }
    .qualify-note { font-size:0.86rem; color:var(--gray-light); margin-top:28px; font-style:italic; line-height:1.7; }
    .qualify-note strong { color:var(--gold); font-style:normal; }

    @media(max-width:900px){ .qualify-split{grid-template-columns:1fr;gap:48px;} }

    /* PROCESS SECTION — horizontal numbered timeline */
    #process { background:var(--black); border-bottom:1px solid var(--border); padding:100px 0; }
    .process-header { text-align:center; margin-bottom:72px; }
    .process-header h2 { font-size:clamp(1.9rem,3.6vw,2.85rem); font-weight:800; margin-top:18px; }
    .process-header p { font-size:0.95rem; color:var(--gray-light); max-width:440px; margin:16px auto 0; line-height:1.75; }

    /* Timeline layout */
    .process-timeline { display:grid; grid-template-columns:repeat(4,1fr); position:relative; }
    /* Horizontal connector line */
    .process-timeline::before { content:''; position:absolute; top:44px; left:10%; right:10%; height:1px; background:linear-gradient(to right,transparent,var(--gold-border) 20%,var(--gold-border) 80%,transparent); }
    .process-tl-step { padding:0 24px; position:relative; }
    .process-tl-step:first-child { padding-left:0; }
    .process-tl-step:last-child { padding-right:0; }
    .process-tl-ghost { font-family:var(--fh); font-size:6rem; font-weight:800; color:var(--gold); opacity:0.07; line-height:1; letter-spacing:-0.05em; margin-bottom:-20px; }
    .process-tl-dot { width:10px; height:10px; background:var(--gold); border-radius:50%; margin-bottom:28px; position:relative; }
    .process-tl-dot::before { content:''; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:22px; height:22px; border:1px solid var(--gold-border); border-radius:50%; }
    .process-tl-step h3 { font-family:var(--fh); font-size:1.1rem; font-weight:800; margin-bottom:10px; }
    .process-tl-step p { font-size:0.84rem; color:var(--gray-light); line-height:1.7; }
    .process-time { display:inline-block; margin-top:16px; font-family:var(--fb); font-size:0.62rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:var(--gold); background:var(--gold-dim); padding:4px 10px; border-radius:2px; }

    @media(max-width:900px){ .process-timeline{grid-template-columns:repeat(2,1fr);gap:40px;} .process-timeline::before{display:none;} }
    @media(max-width:600px){ .process-timeline{grid-template-columns:1fr;} }

    /* FORM SECTION */
    #apply-form-section { background:var(--surface); border-bottom:1px solid var(--border); padding:100px 0; }
    /* Left: form. Right: trust context box */
    .form-grid { display:grid; grid-template-columns:1fr 460px; gap:72px; align-items:start; }
    .form-left h2 { font-size:clamp(1.9rem,3.6vw,2.6rem); font-weight:800; margin:18px 0 16px; }
    .form-left p { font-size:0.92rem; color:var(--gray-light); line-height:1.8; margin-bottom:32px; }
    .form-reassure { display:flex; flex-direction:column; gap:14px; }
    .form-reassure-item { display:flex; align-items:flex-start; gap:12px; font-size:0.86rem; color:var(--gray-light); line-height:1.5; }
    .form-reassure-icon { color:var(--gold); font-size:0.8rem; flex-shrink:0; margin-top:2px; }

    /* Right side: trust/context box wrapper */
    .form-right-wrap { display:flex; flex-direction:column; gap:20px; }
    .form-trust-box { background:var(--card); border:1px solid var(--border); border-top:3px solid var(--gold); padding:32px 28px; }
    .form-trust-box-title { font-family:var(--fb); font-size:0.62rem; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:var(--gold); margin-bottom:20px; }
    .form-trust-stat { padding:18px 0; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:16px; }
    .form-trust-stat:last-child { border-bottom:none; padding-bottom:0; }
    .form-trust-stat-val { font-family:var(--fh); font-size:1.6rem; font-weight:800; color:var(--gold); letter-spacing:-0.03em; flex-shrink:0; line-height:1; min-width:64px; }
    .form-trust-stat-label { font-size:0.84rem; color:var(--gray-light); line-height:1.55; }

    /* THE FORM */
    .apply-form { background:var(--card); border:1px solid var(--border); padding:36px 32px; }
    .form-title { font-family:var(--fh); font-weight:800; font-size:1.1rem; margin-bottom:6px; }
    .form-sub { font-size:0.78rem; color:var(--gray); margin-bottom:28px; }
    .form-group { margin-bottom:20px; }
    .form-label { display:block; font-family:var(--fb); font-size:0.68rem; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:var(--gray-light); margin-bottom:7px; }
    .form-input, .form-select, .form-textarea {
      width:100%; background:rgba(255,255,255,0.035); border:1px solid var(--border-mid); border-radius:2px;
      color:var(--white); font-family:var(--fb); font-size:0.88rem; padding:12px 14px;
      transition:border-color 0.2s ease, background 0.2s ease; outline:none;
    }
    .form-input:focus, .form-select:focus, .form-textarea:focus { border-color:var(--gold-border); background:rgba(212,175,55,0.03); }
    .form-select { cursor:pointer; appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 14px center; padding-right:36px; }
    .form-select option { background:var(--card); }
    .form-textarea { resize:vertical; min-height:100px; }
    .form-2col { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
    .form-submit { width:100%; margin-top:8px; }
    .form-note { font-size:0.72rem; color:var(--gray); text-align:center; margin-top:14px; line-height:1.6; }
    .form-note a { color:var(--gold); text-decoration:none; }

    /* OR DIVIDER */
    .apply-or { display:flex; align-items:center; gap:18px; margin:36px 0; }
    .apply-or-line { flex:1; height:1px; background:var(--border); }
    .apply-or-text { font-size:0.72rem; color:var(--gray); font-weight:600; letter-spacing:0.12em; text-transform:uppercase; white-space:nowrap; }

    /* DIRECT CONTACT */
    .apply-direct { background:rgba(0,0,0,0.5); border:1px solid var(--border); padding:24px 28px; text-align:center; }
    .apply-direct h3 { font-family:var(--fh); font-weight:700; font-size:1rem; margin-bottom:8px; }
    .apply-direct p { font-size:0.84rem; color:var(--gray-light); margin-bottom:16px; }
    .apply-direct a.email-link { font-family:var(--fh); font-weight:700; font-size:1rem; color:var(--gold); text-decoration:none; transition:color 0.2s ease; }
    .apply-direct a.email-link:hover { color:var(--gold-light); }

    /* FAQ */
    #apply-faq { background:var(--black); border-bottom:1px solid var(--border); padding:100px 0; }
    .faq-grid { display:grid; grid-template-columns:280px 1fr; gap:80px; align-items:start; }
    .faq-left h2 { font-size:clamp(1.75rem,3.2vw,2.5rem); font-weight:800; margin:18px 0 16px; }
    .faq-left p { font-size:0.88rem; color:var(--gray-light); line-height:1.75; margin-bottom:32px; }
    .faq-list { display:flex; flex-direction:column; }
    .faq-item { border-bottom:1px solid var(--border); }
    .faq-item:first-child { border-top:1px solid var(--border); }
    .faq-q { width:100%; background:none; border:none; color:var(--white); font-family:var(--fh); font-weight:600; font-size:0.93rem; text-align:left; padding:22px 0; cursor:pointer; display:flex; justify-content:space-between; align-items:center; gap:16px; transition:color 0.2s ease; line-height:1.45; }
    .faq-q:hover { color:var(--gold); }
    .faq-icon { width:22px; height:22px; border:1px solid var(--border-mid); border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:0.78rem; color:var(--gray); transition:all 0.28s ease; font-family:var(--fb); }
    .faq-item.open .faq-icon { background:var(--gold); border-color:var(--gold); color:var(--black); transform:rotate(45deg); }
    .faq-a { max-height:0; overflow:hidden; transition:max-height 0.4s ease; }
    .faq-a-inner { padding-bottom:22px; font-size:0.88rem; color:var(--gray-light); line-height:1.82; }

    /* FOOTER */
    footer { background:var(--black); border-top:1px solid var(--border); padding:80px 0 0; position:relative; overflow:hidden; }
    footer::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg, transparent 0%, var(--gold-border) 30%, var(--gold-border) 70%, transparent 100%); pointer-events:none; }
    .footer-watermark { position:absolute; right:-40px; bottom:-30px; width:480px; height:auto; opacity:0.03; pointer-events:none; user-select:none; filter:grayscale(1) brightness(8); }
    .footer-inner { position:relative; z-index:2; }
    .footer-top { display:grid; grid-template-columns:1.4fr 1fr 1fr; gap:60px; align-items:start; padding-bottom:56px; border-bottom:1px solid var(--border); }
    .footer-logo-img { height:52px; width:auto; margin-bottom:20px; display:block; }
    .footer-tagline { font-size:0.82rem; color:var(--gray); max-width:260px; line-height:1.75; margin-bottom:28px; }
    .footer-contact-link { display:inline-flex; align-items:center; gap:8px; font-family:var(--fb); font-size:0.78rem; font-weight:500; color:var(--gray-light); text-decoration:none; transition:color 0.2s; }
    .footer-contact-link:hover { color:var(--gold); }
    .footer-col-label { font-family:var(--fb); font-size:0.65rem; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:var(--gold); margin-bottom:20px; }
    .footer-col-links { display:flex; flex-direction:column; gap:12px; }
    .footer-col-links a { font-family:var(--fb); font-size:0.82rem; font-weight:400; color:var(--gray-light); text-decoration:none; transition:color 0.2s ease; }
    .footer-col-links a:hover { color:var(--white); }
    .footer-bottom { padding:22px 0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; }
    .footer-copy { font-size:0.73rem; color:var(--gray); }
    .footer-built { font-size:0.73rem; color:var(--gray); font-style:italic; }
    .footer-built span { color:var(--gold); font-style:normal; }
    @media(max-width:768px){ .footer-top{grid-template-columns:1fr;gap:36px;padding-bottom:40px;} .footer-bottom{flex-direction:column;align-items:flex-start;gap:8px;} }

    /* RESPONSIVE */
    @media(max-width:900px){
      .apply-hero-grid{grid-template-columns:1fr;gap:48px;}
      .form-grid{grid-template-columns:1fr;gap:52px;}
      .process-steps{grid-template-columns:repeat(2,1fr);}
      .faq-grid{grid-template-columns:1fr;gap:48px;}
    }
    @media(max-width:768px){
      .page-hero{padding:120px 0 60px;}
      .qualify-grid{grid-template-columns:1fr;}
      .form-2col{grid-template-columns:1fr;}
    }
    @media(max-width:600px){
      section{padding:72px 0;}
      .container{padding:0 20px;}
      .process-steps{grid-template-columns:1fr;}
      .footer-top{grid-template-columns:1fr;gap:28px;}
      .footer-nav{align-items:flex-start;}
      .footer-bottom{flex-direction:column;gap:10px;}
      .apply-form{padding:28px 20px;}
    }
    @media(max-width:480px){
      .nav-logo img{height:46px;}
      .page-hero h1{font-size:2.2rem;}
    }
    @media(max-width:360px){.container{padding:0 16px;}}
  

.tri-page-hero-canvas {
  position: absolute; inset: 0; width: 100%; height: 100%;
  pointer-events: none; z-index: 0;
}
.page-hero { position: relative; overflow: hidden; }
.page-hero > .container, .page-hero > .page-hero-inner { position: relative; z-index: 2; }
`;
const HTML = `

  <!-- STICKY BAR -->
  <div class="sticky-bar" id="stickyBar">
    <p class="sticky-bar-text">We open <span>3 client spots per month.</span> Currently accepting applications.</p>
    <a href="#apply-form-section" class="btn-gold" style="padding:11px 24px;font-size:0.8rem;white-space:nowrap;">Apply Below ↓</a>
  </div>

  <!-- NAV -->
  <nav id="navbar">
    <div class="container">
      <div class="nav-inner">
        <a href="/" class="nav-logo" aria-label="TriFactor Scaling">
          <img src="/tfs-logo.png" alt="TriFactor Scaling" height="40">
        </a>
        <ul class="nav-links">
          <li><a href="/" class="nav-link">Overview</a></li>
          <li><a href="/services" class="nav-link">Services</a></li>
          <li><a href="/results" class="nav-link">Results</a></li>
          <li><a href="/about" class="nav-link">About</a></li>
        </ul>
        <div class="nav-cta-wrap">
          <a href="#apply-form-section" class="btn-gold nav-cta active-nav" style="padding:11px 22px;font-size:0.8rem;">Apply Now →</a>
          <button class="hamburger" onclick="toggleMenu()" aria-label="Menu">
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
    <a href="#apply-form-section" onclick="toggleMenu()" class="active-nav">Apply Now →</a>
  </div>

  <!-- PAGE HERO -->
  <section class="page-hero">
  <canvas class="tri-page-hero-canvas" aria-hidden="true"></canvas>
    <div class="container">
      <div class="apply-hero-grid">
        <!-- Left -->
        <div>
          <div style="opacity:0;animation:fadeUp 0.7s ease 0.1s forwards;">
            <span class="eyebrow"><span class="eline"></span>Apply Now</span>
          </div>
          <h1 style="opacity:0;animation:fadeUp 0.75s ease 0.25s forwards;">
            We take<br><span class="gold-shimmer">3 clients</span><br>per month.
          </h1>
          <p style="opacity:0;animation:fadeUp 0.75s ease 0.4s forwards;margin-top:20px;">
            Not because of capacity — because of quality. If we take your project, you get both founders on every call and every build. No account managers, no handoffs.
          </p>
          <div class="apply-availability" style="opacity:0;animation:fadeUp 0.75s ease 0.55s forwards;margin-top:32px;display:inline-flex;">
            <div class="apply-avail-dot"></div>
            <span class="apply-avail-text">Accepting applications for May 2026</span>
          </div>
        </div>
        <!-- Right: what you get -->
        <div class="apply-hero-right" style="opacity:0;animation:fadeUp 0.75s ease 0.45s forwards;">
          <div class="apply-what-box">
            <div class="apply-what-title">What happens when you apply</div>
            <div class="apply-what-item">
              <span class="apply-what-check">01</span>
              <span>Fill out the form below (3 minutes). Tell us about your business and your biggest growth challenge.</span>
            </div>
            <div class="apply-what-item">
              <span class="apply-what-check">02</span>
              <span>We review and respond within 24 hours. If you're a potential fit, we send a calendar link.</span>
            </div>
            <div class="apply-what-item">
              <span class="apply-what-check">03</span>
              <span>Free 45-minute Growth Audit call. We map your gaps, show you exactly what needs building.</span>
            </div>
            <div class="apply-what-item">
              <span class="apply-what-check">04</span>
              <span>If it's a fit, we send a custom proposal. If not, you still walk away with a growth blueprint — no charge.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- WHO WE WORK WITH -->
  <section id="qualify">
    <div class="container">
      <div class="qualify-split">

        <!-- Left: header + context -->
        <div class="qualify-left reveal-left">
          <span class="eyebrow"><span class="eline"></span>Are We a Fit?</span>
          <h2>Built for one type of business.</h2>
          <p>We work with local service businesses that have real clients but no real system. If most of these describe you, the audit will tell you exactly what to build.</p>
          <a href="#apply-form-section" class="btn-gold qualify-left-cta">Apply for the Audit →</a>
        </div>

        <!-- Right: clean checklist (no cards) -->
        <div class="reveal-right" style="transition-delay:0.08s">
          <div class="qualify-clean-list">
            <div class="qualify-clean-item">
              <div class="qualify-clean-dot"></div>
              <p>You run a local service business with existing, paying clients</p>
            </div>
            <div class="qualify-clean-item">
              <div class="qualify-clean-dot"></div>
              <p>You're generating revenue but know you're leaving money on the table</p>
            </div>
            <div class="qualify-clean-item">
              <div class="qualify-clean-dot"></div>
              <p>You don't have time to build and manage systems yourself</p>
            </div>
            <div class="qualify-clean-item">
              <div class="qualify-clean-dot"></div>
              <p>You want your lead flow to be predictable and automated</p>
            </div>
            <div class="qualify-clean-item">
              <div class="qualify-clean-dot"></div>
              <p>You're ready to invest seriously in a proven growth system</p>
            </div>
            <div class="qualify-clean-item">
              <div class="qualify-clean-dot"></div>
              <p>You want full transparency on where your revenue is coming from</p>
            </div>
          </div>
          <p class="qualify-note">If 4 or more apply, <strong>every week without a system is leads going cold.</strong> The audit costs nothing and you keep the blueprint either way.</p>
        </div>

      </div>
    </div>
  </section>

  <!-- PROCESS -->
  <section id="process">
    <div class="container">
      <div class="process-header reveal">
        <span class="eyebrow"><span class="eline"></span>After You Apply</span>
        <h2>What happens next.</h2>
        <p>Four steps from application to system running inside your business.</p>
      </div>

      <!-- Horizontal numbered timeline -->
      <div class="process-timeline">

        <div class="process-tl-step reveal" style="transition-delay:0.05s">
          <div class="process-tl-ghost">01</div>
          <div class="process-tl-dot"></div>
          <h3>You Apply</h3>
          <p>Fill out the form below. Takes 3 minutes. Tell us your business, your challenge, and what you want to fix first.</p>
          <span class="process-time">Today</span>
        </div>

        <div class="process-tl-step reveal" style="transition-delay:0.1s">
          <div class="process-tl-ghost">02</div>
          <div class="process-tl-dot"></div>
          <h3>We Review</h3>
          <p>We look at your application and respond within 24 hours. If you're a fit, we send a calendar link for the audit call.</p>
          <span class="process-time">Within 24 hrs</span>
        </div>

        <div class="process-tl-step reveal" style="transition-delay:0.15s">
          <div class="process-tl-ghost">03</div>
          <div class="process-tl-dot"></div>
          <h3>Growth Audit Call</h3>
          <p>Free 45-minute strategy session. We map your lead flow, identify your top 3 revenue leaks, and build a custom roadmap. No pitch. No pressure.</p>
          <span class="process-time">45 min call</span>
        </div>

        <div class="process-tl-step reveal" style="transition-delay:0.2s">
          <div class="process-tl-ghost">04</div>
          <div class="process-tl-dot"></div>
          <h3>Custom Proposal</h3>
          <p>If it's a mutual fit, we send a scoped proposal with exact deliverables, timeline, and investment. If not, you keep the blueprint from the audit.</p>
          <span class="process-time">Within 48 hrs</span>
        </div>

      </div>
    </div>
  </section>

  <!-- FORM -->
  <section id="apply-form-section">
    <div class="container">
      <div class="form-grid">

        <!-- Left: form fields -->
        <div class="reveal-left">
          <span class="eyebrow"><span class="eline"></span>The Application</span>
          <h2 class="form-left" style="margin-top:18px;margin-bottom:16px;font-size:clamp(1.7rem,3vw,2.2rem);font-weight:800;">Tell us about your business.</h2>

          <div class="apply-form">
            <div class="form-title">Application Form</div>
            <div class="form-sub">Takes 3 minutes. Every field helps us prepare for your call.</div>

            <!-- SUCCESS STATE (hidden until submit) -->
            <div id="form-success" style="display:none; border:1px solid var(--gold-border); border-radius:2px; padding:48px 36px; text-align:center;">
              <div style="font-size:2rem; margin-bottom:16px;">✦</div>
              <h3 style="font-family:var(--fh); font-size:1.5rem; font-weight:800; margin-bottom:12px;">Application received.</h3>
              <p style="font-size:0.92rem; color:var(--gray-light); line-height:1.8; max-width:380px; margin:0 auto 24px;">Evan and Gavin will review it and respond within 24 hours. Check your inbox — including spam.</p>
              <a href="mailto:trifactorscaling@gmail.com" style="font-size:0.8rem; color:var(--gold); text-decoration:none;">trifactorscaling@gmail.com</a>
            </div>

            <!-- ERROR STATE (hidden until needed) -->
            <div id="form-error" style="display:none; border:1px solid rgba(220,50,50,0.3); background:rgba(220,50,50,0.05); border-radius:2px; padding:16px 20px; margin-bottom:20px;">
              <p style="font-size:0.85rem; color:#f87171; margin:0;">Something went wrong. Please try again or email us directly at <a href="mailto:trifactorscaling@gmail.com" style="color:var(--gold);">trifactorscaling@gmail.com</a></p>
            </div>

            <form id="apply-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
              <!-- Formspree config -->
              <input type="hidden" name="_subject" value="New TFS Growth Ops Application">

              <div class="form-2col">
                <div class="form-group">
                  <label class="form-label" for="fname">First Name</label>
                  <input class="form-input" type="text" id="fname" name="First Name" placeholder="Evan" required>
                </div>
                <div class="form-group">
                  <label class="form-label" for="lname">Last Name</label>
                  <input class="form-input" type="text" id="lname" name="Last Name" placeholder="Smith" required>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="email">Email Address</label>
                <input class="form-input" type="email" id="email" name="email" placeholder="you@yourbusiness.com" required>
              </div>

              <div class="form-group">
                <label class="form-label" for="phone">Phone Number</label>
                <input class="form-input" type="tel" id="phone" name="Phone" placeholder="(647) 555-0100">
              </div>

              <div class="form-group">
                <label class="form-label" for="biz">Business Name</label>
                <input class="form-input" type="text" id="biz" name="Business Name" placeholder="CutByDack" required>
              </div>

              <div class="form-group">
                <label class="form-label" for="biztype">Type of Business</label>
                <select class="form-select" id="biztype" name="Business Type" required>
                  <option value="" disabled selected>Select your industry</option>
                  <option>Barbershop / Salon</option>
                  <option>Restoration / Trades</option>
                  <option>Coaching / Education</option>
                  <option>Home Services</option>
                  <option>Real Estate</option>
                  <option>Fitness / Wellness</option>
                  <option>Other Local Service</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="revenue">Monthly Revenue Range</label>
                <select class="form-select" id="revenue" name="Monthly Revenue">
                  <option value="" disabled selected>Approximate monthly revenue</option>
                  <option>Under $5K/month</option>
                  <option>$5K – $15K/month</option>
                  <option>$15K – $30K/month</option>
                  <option>$30K – $60K/month</option>
                  <option>$60K+/month</option>
                  <option>Prefer not to say</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="challenge">Biggest Challenge Right Now</label>
                <textarea class="form-textarea" id="challenge" name="Biggest Challenge" placeholder="e.g. Leads come in but I lose them. Booking is manual and I get no-shows. I have no idea where my revenue is actually coming from..." required></textarea>
              </div>

              <div class="form-group">
                <label class="form-label" for="timeline">When do you want to start?</label>
                <select class="form-select" id="timeline" name="Timeline">
                  <option value="" disabled selected>Select a timeline</option>
                  <option>ASAP — I need this now</option>
                  <option>Within the next 30 days</option>
                  <option>1–3 months out</option>
                  <option>Just exploring for now</option>
                </select>
              </div>

              <button type="submit" id="form-btn" class="btn-gold form-submit" style="font-size:0.9rem;padding:16px 32px;justify-content:center;width:100%;">
                Submit Application →
              </button>
            </form>
            <p class="form-note">
              Your info goes directly to Evan and Gavin. We'll respond within 24 hours.<br>
              Prefer to email? <a href="mailto:trifactorscaling@gmail.com">trifactorscaling@gmail.com</a>
            </p>
          </div>
        </div>

        <!-- Right: trust/context box -->
        <div class="form-right-wrap reveal-right" style="transition-delay:0.1s">

          <!-- Why apply trust box -->
          <div class="form-trust-box">
            <div class="form-trust-box-title">Why this call is worth your time</div>
            <div class="form-trust-stat">
              <div class="form-trust-stat-val">Free</div>
              <div class="form-trust-stat-label">45-minute Growth Audit. No charge. You keep the blueprint whether or not you hire us.</div>
            </div>
            <div class="form-trust-stat">
              <div class="form-trust-stat-val">24h</div>
              <div class="form-trust-stat-label">Response time. We read every application personally and respond within 24 hours.</div>
            </div>
            <div class="form-trust-stat">
              <div class="form-trust-stat-val">6+</div>
              <div class="form-trust-stat-label">Active client systems. Every business below went through this same process.</div>
            </div>
            <div class="form-trust-stat">
              <div class="form-trust-stat-val">0</div>
              <div class="form-trust-stat-label">Account managers. Evan and Gavin are on every call and every build — no middlemen.</div>
            </div>
          </div>

          <!-- Reassure points -->
          <div class="apply-form" style="background:transparent;border-color:var(--border-mid);padding:24px 0 0;border:none;">
            <div class="form-reassure">
              <div class="form-reassure-item">
                <span class="form-reassure-icon">✦</span>
                <span>No hard sell, no pressure. If we're not a fit we say so and you still walk away with clarity.</span>
              </div>
              <div class="form-reassure-item">
                <span class="form-reassure-icon">✦</span>
                <span>The Growth Audit is completely free. No card required, no obligation to hire us afterward.</span>
              </div>
              <div class="form-reassure-item">
                <span class="form-reassure-icon">✦</span>
                <span>We don't ghost applications. You'll hear from us within 24 hours — usually faster.</span>
              </div>
            </div>
          </div>

          <div class="apply-direct">
            <h3>Prefer to email?</h3>
            <p>Send "Growth Audit Request" with your business name and biggest challenge.</p>
            <a href="mailto:trifactorscaling@gmail.com?subject=Growth%20Audit%20Request" class="email-link">trifactorscaling@gmail.com</a>
          </div>

        </div>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section id="apply-faq">
    <div class="container">
      <div class="faq-grid">
        <div class="faq-left reveal-left">
          <span class="eyebrow"><span class="eline"></span>FAQ</span>
          <h2>Questions about applying.</h2>
          <p>Still unsure? Book the call — we'll answer everything in person with zero pressure.</p>
          <a href="mailto:trifactorscaling@gmail.com" class="btn-outline" style="display:inline-flex;margin-top:4px;">Email Us Instead →</a>
        </div>
        <div class="faq-list reveal-right">
          <div class="faq-item">
            <button class="faq-q" onclick="toggleFAQ(this)">
              Is the Growth Audit really free?
              <span class="faq-icon">+</span>
            </button>
            <div class="faq-a"><div class="faq-a-inner">Yes, completely. A 45-minute strategy session where we map your current lead flow, find your top 3 revenue leaks, and outline a custom growth roadmap. You keep the blueprint whether or not you hire us. No card required, no hidden pitch.</div></div>
          </div>
          <div class="faq-item">
            <button class="faq-q" onclick="toggleFAQ(this)">
              What if I'm not sure I'm ready?
              <span class="faq-icon">+</span>
            </button>
            <div class="faq-a"><div class="faq-a-inner">The audit is specifically designed for that situation. If after the call we both agree the timing isn't right, we say so honestly. You walk away with clarity on what you need — and we stay in touch for when the time is right.</div></div>
          </div>
          <div class="faq-item">
            <button class="faq-q" onclick="toggleFAQ(this)">
              How long does the application take?
              <span class="faq-icon">+</span>
            </button>
            <div class="faq-a"><div class="faq-a-inner">About 3 minutes. The more specific you are about your current challenges, the more we can prepare for the audit call. But even a rough answer is enough to start the conversation.</div></div>
          </div>
          <div class="faq-item">
            <button class="faq-q" onclick="toggleFAQ(this)">
              Do you work with businesses outside of Canada?
              <span class="faq-icon">+</span>
            </button>
            <div class="faq-a"><div class="faq-a-inner">Yes. All our work is done remotely. We have clients in Toronto and work with businesses across North America. Location is never a barrier — the systems we build work anywhere GHL is available (which is everywhere).</div></div>
          </div>
          <div class="faq-item">
            <button class="faq-q" onclick="toggleFAQ(this)">
              What if my business is very early stage?
              <span class="faq-icon">+</span>
            </button>
            <div class="faq-a"><div class="faq-a-inner">We work best with businesses that already have paying clients and some revenue — even if it's inconsistent. If you're pre-revenue, we'll be honest on the call about whether the timing is right for the kind of system we build.</div></div>
          </div>
          <div class="faq-item">
            <button class="faq-q" onclick="toggleFAQ(this)">
              You're young — should I be concerned about that?
              <span class="faq-icon">+</span>
            </button>
            <div class="faq-a"><div class="faq-a-inner">The only concern that should matter is whether the work is excellent and the results are real. Both founders work on every project personally, our clients are actively growing, and we stand behind every build. The age question tends to disappear after the first call.</div></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
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
    function toggleFAQ(btn) {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open'); i.querySelector('.faq-a').style.maxHeight = '0';
      });
      if (!isOpen) {
        item.classList.add('open');
        const ans = item.querySelector('.faq-a');
        ans.style.maxHeight = ans.scrollHeight + 40 + 'px';
      }
    }
    // Sticky bar shows after scrolling past hero
    const stickyBar = document.getElementById('stickyBar');
    const pageHero = document.querySelector('.page-hero');
    if (stickyBar && pageHero) {
      window.addEventListener('scroll', () => {
        stickyBar.classList.toggle('show', pageHero.getBoundingClientRect().bottom < 0);
      }, { passive: true });
    }

    // ── FORMSPREE AJAX SUBMISSION ──────────────────────────────
    const applyForm   = document.getElementById('apply-form');
    const formBtn     = document.getElementById('form-btn');
    const formSuccess = document.getElementById('form-success');
    const formError   = document.getElementById('form-error');

    if (applyForm) {
      applyForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Loading state
        formBtn.disabled = true;
        formBtn.textContent = 'Sending…';
        formError.style.display = 'none';

        try {
          const response = await fetch(applyForm.action, {
            method: 'POST',
            body: new FormData(applyForm),
            headers: { 'Accept': 'application/json' }
          });

          if (response.ok) {
            // Show success, hide form
            applyForm.style.display = 'none';
            const note = document.querySelector('.form-note');
            if (note) note.style.display = 'none';
            formSuccess.style.display = 'block';
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            formError.style.display = 'block';
            formBtn.disabled = false;
            formBtn.textContent = 'Submit Application →';
          }
        } catch (err) {
          formError.style.display = 'block';
          formBtn.disabled = false;
          formBtn.textContent = 'Submit Application →';
        }
      });
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

const Apply = () => {
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
    styleEl.setAttribute("data-tri-page", "tri-apply");
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
      className="tri-apply tri-page-fade"
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: HTML }}
    />
  );
};

export default Apply;
