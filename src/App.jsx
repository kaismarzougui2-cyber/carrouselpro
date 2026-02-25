import React, { useState, useRef, useEffect } from 'react';

// ─── FONTS & GLOBAL STYLES ───────────────────────────────────────────────────
const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;500;600;700;800&family=Montserrat:wght@700;900&family=Anton&family=Oswald:wght@600;700&family=Roboto+Condensed:wght@700&family=Playfair+Display:wght@700;900&family=Space+Mono:wght@700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:      #0a0a0a;
      --bg2:     #111111;
      --bg3:     #181818;
      --bg4:     #222222;
      --border:  #262626;
      --border2: #343434;
      --text:    #f0f0f0;
      --text2:   #666666;
      --text3:   #333333;
      --accent:  #ffffff;
      --dim:     rgba(255,255,255,0.06);
      --green:   #3ddc84;
      --red:     #ff4d4d;
      --safe-bottom: env(safe-area-inset-bottom, 0px);
      --safe-top:    env(safe-area-inset-top, 0px);
    }

    html { height: -webkit-fill-available; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Syne', sans-serif;
      min-height: 100vh;
      min-height: -webkit-fill-available;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
      -webkit-tap-highlight-color: transparent;
    }

    /* Prevent zoom on input focus iOS */
    input, textarea, select {
      font-size: 16px !important;
    }

    ::-webkit-scrollbar { width: 2px; height: 2px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

    /* ── NAV ── */
    .nav {
      position: sticky; top: 0; z-index: 200;
      padding: calc(var(--safe-top) + 0px) 16px 0;
      background: rgba(10,10,10,0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
    }
    .nav-inner {
      height: 52px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .nav-logo {
      display: flex; align-items: center; gap: 8px;
      font-family: 'Bebas Neue', sans-serif;
      font-size: 20px; letter-spacing: 4px; color: var(--text);
      user-select: none;
    }
    .logo-sq {
      width: 26px; height: 26px; background: var(--accent);
      border-radius: 6px; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .logo-sq span { font-size: 12px; font-weight: 900; color: #000; font-family:'Syne',sans-serif; }

    /* Mode switch */
    .mode-switch {
      display: flex;
      background: var(--bg3); border: 1px solid var(--border);
      border-radius: 9px; padding: 3px; gap: 2px;
    }
    .mode-btn {
      padding: 5px 12px; border-radius: 6px;
      font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700;
      letter-spacing: .3px; cursor: pointer; border: none;
      background: transparent; color: var(--text2); transition: all .2s;
    }
    .mode-btn.active { background: var(--accent); color: #000; }

    /* Download btn */
    .dl-btn {
      display: flex; align-items: center; gap: 5px;
      background: var(--accent); color: #000; border: none;
      padding: 7px 14px; border-radius: 8px;
      font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 800;
      cursor: pointer; transition: opacity .2s; white-space: nowrap;
    }
    .dl-btn:disabled { opacity: .3; cursor: not-allowed; }
    .dl-btn:active { opacity: .7; }

    /* ── BUTTONS ── */
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      padding: 12px 20px; border-radius: 10px;
      font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
      cursor: pointer; border: 1px solid var(--border); transition: all .15s;
      letter-spacing: .3px; white-space: nowrap; -webkit-tap-highlight-color: transparent;
      min-height: 44px; /* iOS minimum touch target */
    }
    .btn-outline { background: transparent; color: var(--text2); }
    .btn-outline:active { background: var(--bg3); color: var(--text); }
    .btn-solid { background: var(--accent); color: #000; border-color: var(--accent); }
    .btn-solid:active { opacity: .8; }
    .btn-solid:disabled { opacity: .3; cursor: not-allowed; }
    .btn-full { width: 100%; }
    .btn-lg { padding: 16px 24px; font-size: 15px; border-radius: 14px; min-height: 52px; }

    /* ── SIMPLE MODE — MOBILE FIRST ── */
    .simple-root {
      display: flex; flex-direction: column;
      min-height: calc(100vh - 52px);
      padding-bottom: calc(72px + var(--safe-bottom));
    }

    /* Step bar */
    .step-bar {
      display: flex; align-items: center;
      padding: 16px 20px 12px;
      gap: 0;
    }
    .step-item {
      display: flex; flex-direction: column; align-items: center;
      gap: 5px; flex: 1; position: relative; cursor: pointer;
    }
    .step-item::after {
      content: ''; position: absolute;
      top: 15px; left: calc(50% + 16px); right: calc(-50% + 16px);
      height: 1px; background: var(--border2);
    }
    .step-item:last-child::after { display: none; }
    .step-dot {
      width: 30px; height: 30px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 800; z-index: 1;
      border: 2px solid var(--border2); background: var(--bg);
      color: var(--text3); transition: all .3s; flex-shrink: 0;
    }
    .step-item.done .step-dot { background: var(--green); border-color: var(--green); color: #000; }
    .step-item.active .step-dot { background: var(--accent); border-color: var(--accent); color: #000; }
    .step-lbl { font-size: 9px; font-weight: 700; letter-spacing: 1px; color: var(--text3); text-transform: uppercase; }
    .step-item.active .step-lbl, .step-item.done .step-lbl { color: var(--text2); }

    /* Card */
    .card {
      margin: 0 16px 16px;
      background: var(--bg2); border: 1px solid var(--border);
      border-radius: 18px; padding: 20px;
    }
    .card-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 20px; letter-spacing: 3px; color: var(--text); margin-bottom: 3px;
    }
    .card-sub {
      font-size: 12px; color: var(--text2); margin-bottom: 18px;
      font-weight: 500; line-height: 1.5;
    }

    /* Big textarea */
    .big-ta {
      width: 100%; min-height: 180px;
      background: var(--bg3); border: 2px solid var(--border);
      border-radius: 12px; color: var(--text);
      font-family: 'Syne', sans-serif; font-weight: 500;
      padding: 14px; outline: none; resize: none; line-height: 1.7;
      transition: border .2s;
    }
    .big-ta:focus { border-color: var(--border2); }
    .big-ta::placeholder { color: var(--text3); }

    /* Hint box */
    .hint {
      display: flex; gap: 8px; align-items: flex-start;
      margin: 10px 0 16px; padding: 11px 13px; border-radius: 10px;
      background: var(--bg3); border: 1px solid var(--border);
      font-size: 12px; color: var(--text2); line-height: 1.6;
    }
    .hint strong { color: var(--text); }

    /* Slide count badge */
    .count-badge {
      display: inline-flex; align-items: center; gap: 6px;
      background: var(--dim); border: 1px solid var(--border2);
      padding: 5px 12px; border-radius: 20px;
      font-size: 12px; font-weight: 700; color: var(--text2);
      margin-bottom: 10px;
    }
    .count-badge .n { color: var(--accent); font-family:'Space Mono',monospace; font-size: 15px; }

    /* Slide chips */
    .chips { display: flex; flex-direction: column; gap: 6px; }
    .chip {
      display: flex; align-items: center; gap: 10px;
      background: var(--bg3); border: 1px solid var(--border);
      border-radius: 10px; padding: 10px 12px;
    }
    .chip-n { font-family:'Space Mono',monospace; font-size: 10px; font-weight: 700; color: var(--text3); min-width: 22px; }
    .chip-t { font-size: 12px; font-weight: 600; color: var(--text2); flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .chip-x { background: none; border: none; color: var(--text3); cursor: pointer; font-size: 14px; padding: 2px 4px; min-height: 44px; display: flex; align-items: center; }
    .chip-x:active { color: var(--red); }

    /* Style presets grid */
    .presets-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .preset-card {
      aspect-ratio: 1; border-radius: 10px; overflow: hidden;
      border: 2px solid var(--border); cursor: pointer;
      transition: all .15s; position: relative;
    }
    .preset-card:active { transform: scale(.96); }
    .preset-card.sel { border-color: var(--accent); }
    .preset-card canvas { width: 100%; height: 100%; display: block; }
    .preset-name {
      position: absolute; bottom: 0; left: 0; right: 0;
      padding: 14px 4px 4px; text-align: center;
      font-size: 8px; font-weight: 800; letter-spacing: 1.5px;
      background: linear-gradient(transparent, rgba(0,0,0,.75)); color: #fff;
    }
    .sel-check {
      position: absolute; top: 6px; right: 6px;
      width: 18px; height: 18px; border-radius: 50%;
      background: var(--accent); color: #000;
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 900;
    }

    /* Style options */
    .opt-label { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text3); margin-bottom: 7px; display: block; margin-top: 16px; }
    select.styled {
      width: 100%; background: var(--bg3); border: 1px solid var(--border);
      border-radius: 10px; color: var(--text); font-family: 'Syne', sans-serif;
      font-weight: 600; padding: 12px; outline: none; cursor: pointer; appearance: none;
    }
    .color-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    .swatch {
      width: 36px; height: 36px; border-radius: 8px;
      border: 2px solid var(--border); cursor: pointer; flex-shrink: 0;
      transition: transform .15s;
    }
    .swatch:active { transform: scale(.9); }
    .swatch.sel { border-color: var(--accent); }
    input[type=color] {
      width: 36px; height: 36px; padding: 2px;
      border-radius: 8px; border: 1px solid var(--border2);
      background: var(--bg3); cursor: pointer; flex-shrink: 0;
    }
    input.txt-input {
      width: 100%; background: var(--bg3); border: 1px solid var(--border);
      border-radius: 10px; color: var(--text); font-family: 'Syne', sans-serif;
      font-weight: 600; padding: 12px; outline: none;
    }
    input.txt-input::placeholder { color: var(--text3); }
    input.txt-input:focus { border-color: var(--border2); }

    /* Editable chip input */
    .chip-input {
      flex: 1; background: transparent; border: none;
      color: var(--text); font-family: 'Syne', sans-serif;
      font-size: 12px; font-weight: 600; outline: none; min-width: 0;
    }

    /* Preview grid */
    .preview-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; padding: 0 16px 16px; }

    @media (min-width: 480px) {
      .preview-grid { grid-template-columns: repeat(3, 1fr); }
    }

    .prev-card { border-radius: 10px; overflow: hidden; border: 1px solid var(--border); aspect-ratio: 1; position: relative; }
    .prev-card canvas { width: 100%; height: 100%; display: block; }
    .prev-badge {
      position: absolute; top: 7px; left: 7px;
      background: rgba(0,0,0,.8); color: #fff;
      font-size: 7px; font-weight: 800; letter-spacing: 1.5px;
      padding: 2px 6px; border-radius: 3px;
    }

    /* Fixed bottom bar (mobile CTA) */
    .bottom-bar {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 150;
      padding: 12px 16px calc(12px + var(--safe-bottom));
      background: rgba(10,10,10,0.97);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-top: 1px solid var(--border);
    }

    /* Nav bar for step navigation */
    .step-nav { display: flex; gap: 10px; }
    .step-nav .btn { flex: 1; }

    /* ── ADVANCED MODE — MOBILE LAYOUT ── */
    .adv-root {
      display: flex; flex-direction: column;
      min-height: calc(100vh - 52px);
      padding-bottom: calc(60px + var(--safe-bottom));
    }

    /* Mobile tab bar (advanced) */
    .adv-mobile-tabs {
      display: flex; overflow-x: auto;
      border-bottom: 1px solid var(--border);
      background: var(--bg2);
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .adv-mobile-tabs::-webkit-scrollbar { display: none; }
    .adv-mtab {
      flex-shrink: 0; padding: 12px 18px;
      font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 800;
      letter-spacing: .5px; cursor: pointer; border: none;
      background: transparent; color: var(--text3);
      border-bottom: 2px solid transparent; transition: all .15s;
      white-space: nowrap;
    }
    .adv-mtab.active { color: var(--text); border-bottom-color: var(--accent); }

    /* Slide thumbnails horizontal scroll */
    .slide-scroll {
      display: flex; gap: 10px;
      overflow-x: auto; padding: 12px 16px;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .slide-scroll::-webkit-scrollbar { display: none; }
    .slide-thumb {
      flex-shrink: 0; width: 72px; height: 72px;
      border-radius: 8px; overflow: hidden;
      border: 2px solid var(--border); cursor: pointer;
      position: relative; transition: border-color .15s;
    }
    .slide-thumb:active { opacity: .8; }
    .slide-thumb.sel { border-color: var(--accent); }
    .slide-thumb canvas { width: 100%; height: 100%; display: block; }
    .thumb-num {
      position: absolute; bottom: 3px; left: 3px;
      background: rgba(0,0,0,.75); color: #fff;
      font-size: 7px; font-weight: 800; padding: 1px 5px; border-radius: 2px;
    }
    .add-thumb {
      flex-shrink: 0; width: 72px; height: 72px;
      border-radius: 8px; border: 1px dashed var(--border2);
      background: transparent; color: var(--text3);
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; cursor: pointer; transition: all .15s;
    }
    .add-thumb:active { border-color: var(--accent); color: var(--accent); }

    /* Canvas preview (advanced mobile) */
    .adv-preview {
      padding: 0 16px 8px;
      display: flex; justify-content: center;
    }
    .adv-canvas-wrap {
      border-radius: 8px; overflow: hidden;
      box-shadow: 0 0 0 1px var(--border), 0 16px 40px rgba(0,0,0,.6);
      width: 100%; max-width: 360px; aspect-ratio: 1;
    }
    .adv-canvas-wrap canvas { width: 100%; height: 100%; display: block; }

    /* Props panel */
    .props-panel { padding: 0 16px; }
    .prop-section { background: var(--bg2); border: 1px solid var(--border); border-radius: 14px; padding: 16px; margin-bottom: 12px; }
    .prop-sec-title { font-size: 9px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: var(--text3); margin-bottom: 12px; }
    .prop-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .prop-lbl { font-size: 12px; font-weight: 600; color: var(--text2); flex: 1; }
    .range-row { display: flex; align-items: center; gap: 8px; }
    .range-val { font-size: 10px; font-weight: 700; color: var(--text2); background: var(--bg3); padding: 2px 7px; border-radius: 4px; min-width: 36px; text-align: center; font-family:'Space Mono',monospace; }
    input[type=range] { flex: 1; appearance: none; height: 3px; background: var(--border2); border-radius: 3px; border: none; padding: 0; cursor: pointer; outline: none; }
    input[type=range]::-webkit-slider-thumb { appearance: none; width: 18px; height: 18px; border-radius: 50%; background: var(--accent); cursor: pointer; }

    .toggle-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
    .toggle-lbl { font-size: 13px; font-weight: 600; color: var(--text2); }
    .toggle { width: 36px; height: 20px; background: var(--bg3); border-radius: 10px; border: 1px solid var(--border); cursor: pointer; position: relative; transition: background .2s; flex-shrink: 0; }
    .toggle.on { background: var(--accent); border-color: var(--accent); }
    .toggle::after { content: ''; position: absolute; top: 3px; left: 3px; width: 12px; height: 12px; border-radius: 50%; background: var(--text3); transition: left .2s, background .2s; }
    .toggle.on::after { left: 19px; background: #000; }

    .bg-tabs { display: flex; gap: 4px; margin-bottom: 10px; }
    .bg-tab { flex: 1; padding: 8px 4px; border-radius: 7px; text-align: center; font-size: 10px; font-weight: 800; cursor: pointer; border: 1px solid var(--border); background: transparent; color: var(--text3); transition: all .15s; font-family:'Syne',sans-serif; min-height: 36px; }
    .bg-tab.active { background: var(--bg4); color: var(--text); border-color: var(--border2); }

    .grad-row { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; flex-wrap: wrap; }

    textarea.adv-ta { width: 100%; background: var(--bg3); border: 1px solid var(--border); border-radius: 10px; color: var(--text); font-family:'Syne',sans-serif; font-weight: 500; padding: 11px; outline: none; resize: none; line-height: 1.6; margin-bottom: 10px; }
    textarea.adv-ta:focus { border-color: var(--border2); }

    .upload-btn { width: 100%; padding: 11px; border-radius: 9px; border: 1px dashed var(--border2); background: transparent; color: var(--text2); font-family:'Syne',sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; min-height: 44px; }
    .upload-btn:active { border-color: var(--accent); color: var(--text); background: var(--dim); }

    .tpl-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; }
    .tpl-card { aspect-ratio: 1; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); cursor: pointer; position: relative; transition: all .15s; }
    .tpl-card:active { transform: scale(.95); }
    .tpl-card canvas { width: 100%; height: 100%; display: block; }
    .tpl-name { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,.8)); color: #fff; font-size: 7px; font-weight: 800; letter-spacing: 1px; padding: 8px 4px 3px; text-align: center; }

    /* Notif */
    .notif {
      position: fixed; bottom: calc(70px + var(--safe-bottom)); right: 16px; z-index: 999;
      background: var(--bg3); border: 1px solid var(--border2); border-radius: 10px;
      padding: 10px 16px; font-size: 12px; font-weight: 700; color: var(--text);
      box-shadow: 0 8px 32px rgba(0,0,0,.6);
      display: flex; align-items: center; gap: 7px;
      animation: notifIn .2s ease;
    }
    @keyframes notifIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }

    /* ── DESKTOP ENHANCEMENTS ── */
    @media (min-width: 768px) {
      .nav-inner { height: 56px; }
      .nav { padding: 0 24px; }
      .mode-btn { padding: 6px 18px; font-size: 12px; }

      .simple-root { max-width: 680px; margin: 0 auto; padding-bottom: 80px; }
      .card { margin: 0 0 16px; border-radius: 20px; padding: 28px; }
      .step-bar { padding: 24px 0 18px; }
      .big-ta { min-height: 220px; }
      .bottom-bar { position: static; background: transparent; border: none; padding: 0; backdrop-filter: none; margin-top: 8px; }
      .step-nav { justify-content: space-between; }
      .step-nav .btn { flex: 0 0 auto; min-width: 140px; }
      .preview-grid { grid-template-columns: repeat(3, 1fr); padding: 0 0 24px; }

      /* Advanced: 3-column layout on desktop */
      .adv-root {
        display: grid;
        grid-template-columns: 240px 1fr 260px;
        grid-template-rows: auto 1fr;
        height: calc(100vh - 56px);
        padding-bottom: 0;
        overflow: hidden;
      }
      .adv-mobile-tabs { display: none; }
      .adv-left-desktop {
        display: flex !important;
        flex-direction: column;
        grid-column: 1;
        grid-row: 1 / 3;
        border-right: 1px solid var(--border);
        background: var(--bg2);
        overflow-y: auto;
      }
      .adv-center-desktop {
        display: flex !important;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        grid-column: 2;
        grid-row: 1 / 3;
        background: var(--bg);
        padding: 24px;
        overflow: hidden;
      }
      .adv-right-desktop {
        display: flex !important;
        flex-direction: column;
        grid-column: 3;
        grid-row: 1 / 3;
        border-left: 1px solid var(--border);
        background: var(--bg2);
        overflow-y: auto;
      }
      /* Hide mobile-only elements on desktop */
      .mobile-only { display: none !important; }
      .desktop-canvas { max-width: 480px !important; }
    }

    /* Hide desktop-only on mobile */
    .adv-left-desktop, .adv-center-desktop, .adv-right-desktop { display: none; }

    .adv-section { padding: 12px 14px; border-bottom: 1px solid var(--border); }
    .adv-sec-title { font-size: 9px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: var(--text3); margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; }
    .adv-slide-list { padding: 8px; display: flex; flex-direction: column; gap: 6px; overflow-y: auto; flex: 1; }
    .adv-slide-item { border-radius: 9px; overflow: hidden; border: 2px solid transparent; cursor: pointer; transition: all .15s; aspect-ratio: 1; position: relative; background: var(--bg3); }
    .adv-slide-item:hover { border-color: var(--border2); }
    .adv-slide-item.sel { border-color: var(--accent); }
    .adv-slide-item canvas { width: 100%; height: 100%; display: block; }
    .adv-slide-num { position: absolute; top: 5px; left: 5px; background: rgba(0,0,0,.75); color: #fff; font-size: 8px; font-weight: 800; letter-spacing: 1.5px; padding: 2px 6px; border-radius: 3px; }
    .adv-actions { position: absolute; top: 5px; right: 5px; display: flex; gap: 3px; opacity: 0; transition: opacity .15s; }
    .adv-slide-item:hover .adv-actions { opacity: 1; }
    .adv-act-btn { width: 20px; height: 20px; border-radius: 4px; background: rgba(0,0,0,.8); border: none; cursor: pointer; color: #fff; font-size: 10px; display: flex; align-items: center; justify-content: center; }
    .adv-act-btn:hover { background: rgba(255,255,255,.2); }

    .adv-tabs-desktop { display: flex; border-bottom: 1px solid var(--border); }
    .adv-tab-d { flex: 1; padding: 10px 4px; font-size: 10px; font-weight: 800; letter-spacing: .3px; cursor: pointer; border: none; background: transparent; color: var(--text3); border-bottom: 2px solid transparent; font-family:'Syne',sans-serif; transition: all .15s; }
    .adv-tab-d.active { color: var(--text); border-bottom-color: var(--accent); }

    .adv-canvas-nav-desktop {
      margin-top: 14px;
      display: flex; align-items: center; gap: 12px;
      background: rgba(10,10,10,.9); backdrop-filter: blur(12px);
      border: 1px solid var(--border); border-radius: 20px; padding: 6px 16px;
    }
    .adv-nav-btn { background: none; border: none; color: var(--text2); cursor: pointer; font-size: 14px; padding: 2px 4px; transition: color .15s; }
    .adv-nav-btn:hover { color: var(--text); }
    .adv-nav-num { font-size: 11px; font-weight: 700; color: var(--text2); min-width: 36px; text-align: center; }
  `}} />
);

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const FONTS = [
  { label: 'Montserrat Black', value: 'Montserrat' },
  { label: 'Anton — Impact', value: 'Anton' },
  { label: 'Oswald Compact', value: 'Oswald' },
  { label: 'Roboto Condensed', value: 'Roboto Condensed' },
  { label: 'Playfair Display', value: 'Playfair Display' },
  { label: 'Bebas Neue', value: 'Bebas Neue' },
];

const PRESETS = [
  { name: 'NOIR',     bg: { type:'color', color:'#000000' },                         textColor:'#ffffff', font:'Montserrat',      fontSize:88 },
  { name: 'BLANC',    bg: { type:'color', color:'#ffffff' },                         textColor:'#000000', font:'Montserrat',      fontSize:88 },
  { name: 'GRADIENT', bg: { type:'gradient', stops:['#0a0a0a','#1a1a2e'], angle:135 }, textColor:'#ffffff', font:'Anton',         fontSize:95 },
  { name: 'CRÈME',    bg: { type:'color', color:'#f5f0e8' },                         textColor:'#1a1a1a', font:'Playfair Display', fontSize:82 },
  { name: 'ROUGE',    bg: { type:'color', color:'#c0392b' },                         textColor:'#ffffff', font:'Anton',           fontSize:95 },
  { name: 'NUIT',     bg: { type:'gradient', stops:['#0f0c29','#302b63'], angle:160 }, textColor:'#e0d7ff', font:'Bebas Neue',    fontSize:100 },
];

const QUICK_BG   = ['#000000','#ffffff','#1a1a2e','#c0392b','#f5f0e8','#0d3349'];
const QUICK_TEXT = ['#ffffff','#000000','#f5f0e8','#ffd700','#e0d7ff','#ff6b6b'];

// ─── DRAW ────────────────────────────────────────────────────────────────────

function drawSlide(canvas, { text, bg, textColor, font, fontSize, signature, showNum, slideNum, total }) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  if (bg.type === 'color') {
    ctx.fillStyle = bg.color; ctx.fillRect(0,0,W,H);
  } else if (bg.type === 'gradient') {
    const a = (bg.angle||135)*Math.PI/180;
    const g = ctx.createLinearGradient(W/2-Math.cos(a)*W/2,H/2-Math.sin(a)*H/2,W/2+Math.cos(a)*W/2,H/2+Math.sin(a)*H/2);
    (bg.stops||['#000','#222']).forEach((c,i,ar) => g.addColorStop(i/(ar.length-1),c));
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
  } else if (bg.type==='image' && bg.imageEl) {
    ctx.drawImage(bg.imageEl,0,0,W,H);
    if(bg.blur){ctx.filter=`blur(${bg.blur}px)`;ctx.drawImage(canvas,0,0);ctx.filter='none';}
    if(bg.overlay){ctx.fillStyle=`rgba(0,0,0,${bg.overlay})`;ctx.fillRect(0,0,W,H);}
  }

  ctx.strokeStyle='rgba(128,128,128,0.07)'; ctx.lineWidth=2;
  ctx.strokeRect(38,38,W-76,H-76);

  if(showNum){
    ctx.save(); ctx.globalAlpha=.4; ctx.fillStyle=textColor;
    ctx.textAlign='right'; ctx.font=`500 22px 'Syne',sans-serif`;
    ctx.fillText(`${slideNum}/${total}`,W-52,70); ctx.restore();
  }
  if(signature&&signature.trim()){
    ctx.save(); ctx.globalAlpha=.5; ctx.fillStyle=textColor;
    ctx.textAlign='center'; ctx.font=`700 26px 'Syne',sans-serif`;
    ctx.fillText(signature.toUpperCase(),W/2,H-58);
    ctx.strokeStyle='rgba(128,128,128,0.15)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(W/2-80,H-82); ctx.lineTo(W/2+80,H-82); ctx.stroke();
    ctx.restore();
  }

  ctx.fillStyle=textColor; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.font=`bold ${fontSize}px '${font}',sans-serif`;
  const words=(text||' ').toUpperCase().split(' ');
  const maxW=W*0.84, lh=fontSize*1.18;
  let lines=[],cur='';
  words.forEach(w=>{const t=cur+w+' '; if(ctx.measureText(t).width>maxW&&cur){lines.push(cur.trim());cur=w+' ';}else cur=t;});
  if(cur.trim()) lines.push(cur.trim());
  const totalH=lines.length*lh, sy=(H-totalH)/2+lh/2;
  lines.forEach((l,i)=>ctx.fillText(l,W/2,sy+i*lh));
}

// ─── CANVAS COMPONENTS ───────────────────────────────────────────────────────

const SlideCanvas = React.memo(({ data }) => {
  const ref = useRef(null);
  useEffect(() => { const c=ref.current; if(!c)return; c.width=1080;c.height=1080; drawSlide(c,data); });
  return <canvas ref={ref} style={{width:'100%',height:'100%',display:'block'}} />;
});

const ThumbCanvas = React.memo(({ data }) => {
  const ref = useRef(null);
  useEffect(() => { const c=ref.current; if(!c)return; c.width=200;c.height=200; drawSlide(c,data); });
  return <canvas ref={ref} style={{width:'100%',height:'100%',display:'block'}} />;
});

// ─── SMART SPLIT ─────────────────────────────────────────────────────────────

function smartSplit(raw) {
  const byDouble = raw.split(/\n\n+/).map(s=>s.replace(/\n/g,' ').trim()).filter(Boolean);
  if(byDouble.length > 1) return byDouble;
  const text = raw.replace(/\n/g,' ').trim();
  const limit = 200;
  let chunks=[], rem=text;
  while(rem.length>0){
    if(rem.length<=limit){chunks.push(rem);break;}
    let si=-1;
    const look=rem.substring(0,limit+30);
    const pm=look.match(/[.!?…](?!.*[.!?…])/);
    if(pm&&pm.index>limit/3) si=pm.index+1;
    else si=rem.lastIndexOf(' ',limit);
    if(si<=0) si=limit;
    chunks.push(rem.substring(0,si).trim());
    rem=rem.substring(si).trim();
  }
  return chunks;
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [mode, setMode] = useState('simple');

  // Simple
  const [step, setStep]       = useState(1);
  const [rawText, setRaw]     = useState('');
  const [slides, setSlides]   = useState([]);
  const [selPre, setSelPre]   = useState(0);
  const [sFont, setSFont]     = useState('Montserrat');
  const [sBg, setSBg]         = useState('#000000');
  const [sTxt, setSTxt]       = useState('#ffffff');
  const [sSig, setSSig]       = useState('@tonpseudo');

  // Advanced
  const mkSlide = (text='NOUVELLE SLIDE', i=0) => ({
    id:`s${Date.now()}_${i}`, text,
    bg:{type:'color',color:'#000000'}, textColor:'#ffffff',
    font:'Montserrat', fontSize:88, overrideBg:false, overrideTxt:false,
  });
  const [aSlides, setASlides] = useState([
    mkSlide('BIENVENUE SUR CARROUSELPRO',0),
    mkSlide('PERSONNALISE CHAQUE SLIDE.',1),
    mkSlide('TÉLÉCHARGE EN UN CLIC.',2),
  ]);
  const [aGlobal, setAGlobal] = useState({bg:{type:'color',color:'#000000'},textColor:'#ffffff',font:'Montserrat',fontSize:88});
  const [aBrand, setABrand]   = useState({signature:'@tonpseudo',showSig:true,showNum:true,numFmt:'{n}/{total}'});
  const [aSel, setASel]       = useState(0);
  const [aTab, setATab]       = useState('slides'); // slides | slide | global | brand | tpl
  const [aImport, setAImport] = useState('');

  const [notif, setNotif]     = useState(null);
  const [exporting, setExp]   = useState(false);
  const fileRef = useRef(null);

  const toast = msg => { setNotif(msg); setTimeout(()=>setNotif(null),2500); };

  useEffect(()=>{
    const s=document.createElement('script');
    s.src='https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    document.body.appendChild(s);
  },[]);

  // ── Simple data ──

  const preview = rawText.trim() ? smartSplit(rawText) : [];

  const simData = (text, i) => ({
    text:text||' ',
    bg:{type:'color',color:sBg},
    textColor:sTxt, font:sFont,
    fontSize:PRESETS[selPre].fontSize,
    signature:sSig, showNum:true, slideNum:i+1, total:slides.length,
  });

  const handleParse = () => {
    const chunks = smartSplit(rawText);
    setSlides(chunks); setStep(2);
  };

  // ── Advanced data ──

  const aSl = aSlides[aSel] || aSlides[0];

  const aData = (sl, i) => {
    const g=aGlobal, br=aBrand;
    return {
      text:sl.text||' ',
      bg: sl.overrideBg ? sl.bg : g.bg,
      textColor: sl.overrideTxt ? sl.textColor : g.textColor,
      font: sl.overrideTxt ? sl.font : g.font,
      fontSize: sl.overrideTxt ? sl.fontSize : g.fontSize,
      signature: br.showSig ? br.signature : '',
      showNum: br.showNum, slideNum:i+1, total:aSlides.length,
    };
  };

  const aUpd  = (idx,ch) => setASlides(p=>p.map((s,i)=>i===idx?{...s,...ch}:s));
  const aUpdBg= (idx,ch) => setASlides(p=>p.map((s,i)=>i===idx?{...s,bg:{...s.bg,...ch},overrideBg:true}:s));
  const aDup  = idx => { const d={...aSlides[idx],id:`s${Date.now()}`}; setASlides(p=>{const n=[...p];n.splice(idx+1,0,d);return n;}); setASel(idx+1); toast('Dupliquée ✓'); };
  const aDel  = idx => { if(aSlides.length<=1){toast('Impossible');return;} setASlides(p=>p.filter((_,i)=>i!==idx)); setASel(Math.max(0,idx-1)); };

  const aApplyTpl = (tpl, all=false) => {
    if(all){ setASlides(p=>p.map(s=>({...s,bg:{...tpl.bg},textColor:tpl.textColor,font:tpl.font,fontSize:tpl.fontSize,overrideBg:true,overrideTxt:true}))); setAGlobal(g=>({...g,...tpl,bg:tpl.bg})); toast(`"${tpl.name}" → tout le carrousel ✓`); }
    else { aUpd(aSel,{bg:{...tpl.bg},textColor:tpl.textColor,font:tpl.font,fontSize:tpl.fontSize,overrideBg:true,overrideTxt:true}); toast(`"${tpl.name}" appliqué ✓`); }
  };

  const aImportFn = () => {
    if(!aImport.trim()) return;
    const chunks = smartSplit(aImport);
    setASlides(chunks.map((t,i)=>mkSlide(t,i)));
    setASel(0); setAImport(''); toast(`${chunks.length} slides créées ✓`);
  };

  const aBgImage = e => {
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader();
    r.onload=ev=>{ const img=new Image(); img.onload=()=>{aUpdBg(aSel,{type:'image',imageEl:img,blur:0,overlay:0.3});toast('Image appliquée ✓');}; img.src=ev.target.result; };
    r.readAsDataURL(f);
  };

  const aSlBg = aSl.overrideBg ? aSl.bg : aGlobal.bg;
  const aSlBgType = aSlBg.type;

  // ── Export ──

  const doExport = async (list, dataFn) => {
    if(typeof window.JSZip==='undefined'){toast('Chargement…');return;}
    setExp(true);
    try {
      const zip=new window.JSZip(), folder=zip.folder('carrouselpro');
      await Promise.all(list.map((sl,i)=>new Promise(res=>{
        const c=document.createElement('canvas');
        c.width=1080; c.height=1080; drawSlide(c,dataFn(sl,i));
        c.toBlob(b=>{folder.file(`slide-${i+1}.png`,b);res();},'image/png');
      })));
      const blob=await zip.generateAsync({type:'blob'});
      const a=document.createElement('a');
      a.href=URL.createObjectURL(blob); a.download=`carrousel-${Date.now()}.zip`; a.click();
      toast(`${list.length} images exportées ✓`);
    }catch(e){console.error(e);}
    finally{setExp(false);}
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────

  return (
    <div>
      <GlobalStyles />

      {/* NAV */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="nav-logo">
            <div className="logo-sq"><span>C</span></div>
            CarrouselPro
          </div>
          <div className="mode-switch">
            <button className={`mode-btn ${mode==='simple'?'active':''}`} onClick={()=>setMode('simple')}>⚡ Simple</button>
            <button className={`mode-btn ${mode==='advanced'?'active':''}`} onClick={()=>setMode('advanced')}>🔧 Pro</button>
          </div>
          {/* Desktop download btn */}
          <div className="mobile-only" style={{display:'none'}}>
            {mode==='simple'&&step===3&&<button className="dl-btn" disabled={exporting} onClick={()=>doExport(slides,simData)}>{exporting?'⏳':` ZIP (${slides.length})`}</button>}
            {mode==='advanced'&&<button className="dl-btn" disabled={exporting} onClick={()=>doExport(aSlides,aData)}>{exporting?'⏳':`⬇ ZIP (${aSlides.length})`}</button>}
          </div>
        </div>
      </nav>

      {/* ════ SIMPLE MODE ════ */}
      {mode==='simple'&&(
        <div className="simple-root">
          {/* Step bar */}
          <div className="step-bar">
            {[{n:1,l:'Texte'},{n:2,l:'Style'},{n:3,l:'Aperçu'}].map(s=>(
              <div key={s.n} className={`step-item ${step>s.n?'done':step===s.n?'active':''}`}
                onClick={()=>step>s.n&&setStep(s.n)}>
                <div className="step-dot">{step>s.n?'✓':s.n}</div>
                <div className="step-lbl">{s.l}</div>
              </div>
            ))}
          </div>

          {/* ── STEP 1 ── */}
          {step===1&&(
            <>
              <div className="card">
                <div className="card-title">DÉCOUPE TON TEXTE</div>
                <div className="card-sub">Saute <strong>deux fois Entrée</strong> entre chaque slide — ou colle n'importe quel texte pour un découpage automatique.</div>

                <textarea className="big-ta" value={rawText} onChange={e=>setRaw(e.target.value)}
                  placeholder={"Exemple :\n\nComment gagner du temps le matin.\n\nPremière astuce : prépare ta tenue la veille.\n\nDeuxième astuce : évite les réseaux sociaux au réveil."} />

                <div className="hint">
                  <span>💡</span>
                  <div><strong>2 façons de découper :</strong><br/>
                  • <strong>Manuel :</strong> appuie 2× Entrée entre chaque slide<br/>
                  • <strong>Auto :</strong> colle ton texte, on détecte les phrases</div>
                </div>

                {preview.length>0&&(
                  <div>
                    <div className="count-badge"><span className="n">{preview.length}</span> slides détectées</div>
                    <div className="chips">
                      {preview.slice(0,5).map((c,i)=>(
                        <div key={i} className="chip">
                          <span className="chip-n">#{i+1}</span>
                          <span className="chip-t">{c}</span>
                        </div>
                      ))}
                      {preview.length>5&&<div style={{padding:'6px 12px',fontSize:11,color:'var(--text3)',fontWeight:600}}>+{preview.length-5} autres…</div>}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom bar */}
              <div className="bottom-bar">
                <div className="step-nav">
                  <button className="btn btn-solid btn-full btn-lg" onClick={handleParse} disabled={!rawText.trim()}>
                    ✂ Découper et continuer →
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ── STEP 2 ── */}
          {step===2&&(
            <>
              <div className="card">
                <div className="card-title">CHOISIS TON STYLE</div>
                <div className="card-sub">Un preset, une police, deux couleurs — c'est tout.</div>

                <div className="presets-grid">
                  {PRESETS.map((p,i)=>{
                    const fd={text:slides[0]||'TEXTE',bg:p.bg,textColor:p.textColor,font:p.font,fontSize:36,signature:'',showNum:false,slideNum:1,total:1};
                    return(
                      <div key={p.name} className={`preset-card ${selPre===i?'sel':''}`}
                        onClick={()=>{setSelPre(i);setSBg(p.bg.color||'#000000');setSTxt(p.textColor);setSFont(p.font);}}>
                        <ThumbCanvas data={fd}/>
                        <div className="preset-name">{p.name}</div>
                        {selPre===i&&<div className="sel-check">✓</div>}
                      </div>
                    );
                  })}
                </div>

                <span className="opt-label">Police</span>
                <select className="styled" value={sFont} onChange={e=>setSFont(e.target.value)}>
                  {FONTS.map(f=><option key={f.value} value={f.value}>{f.label}</option>)}
                </select>

                <span className="opt-label">Couleur de fond</span>
                <div className="color-row">
                  {QUICK_BG.map(c=><div key={c} className={`swatch ${sBg===c?'sel':''}`} style={{background:c}} onClick={()=>setSBg(c)}/>)}
                  <input type="color" value={sBg} onChange={e=>setSBg(e.target.value)}/>
                </div>

                <span className="opt-label">Couleur du texte</span>
                <div className="color-row">
                  {QUICK_TEXT.map(c=><div key={c} className={`swatch ${sTxt===c?'sel':''}`} style={{background:c}} onClick={()=>setSTxt(c)}/>)}
                  <input type="color" value={sTxt} onChange={e=>setSTxt(e.target.value)}/>
                </div>

                <span className="opt-label">Ta signature</span>
                <input className="txt-input" type="text" value={sSig} onChange={e=>setSSig(e.target.value)} placeholder="@tonpseudo"/>
              </div>

              <div className="bottom-bar">
                <div className="step-nav">
                  <button className="btn btn-outline" onClick={()=>setStep(1)}>← Retour</button>
                  <button className="btn btn-solid" style={{flex:1}} onClick={()=>setStep(3)}>Voir l'aperçu →</button>
                </div>
              </div>
            </>
          )}

          {/* ── STEP 3 ── */}
          {step===3&&(
            <>
              <div style={{padding:'0 16px 12px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:3}}>APERÇU</div>
                  <div style={{fontSize:11,color:'var(--text2)',fontWeight:500,marginTop:1}}>{slides.length} slides prêtes</div>
                </div>
                <button className="btn btn-outline" style={{padding:'7px 12px',fontSize:11}} onClick={()=>setStep(2)}>← Style</button>
              </div>

              {/* Editable slide list */}
              <div className="card" style={{marginBottom:12}}>
                <div className="card-title" style={{marginBottom:3,fontSize:16}}>MODIFIER LES TEXTES</div>
                <div className="card-sub">Tape directement dans chaque slide</div>
                <div className="chips">
                  {slides.map((sl,i)=>(
                    <div key={i} className="chip">
                      <span className="chip-n">#{i+1}</span>
                      <input className="chip-input" type="text" value={sl}
                        onChange={e=>{const n=[...slides];n[i]=e.target.value;setSlides(n);}}/>
                      <button className="chip-x" onClick={()=>setSlides(s=>s.filter((_,idx)=>idx!==i))}>✕</button>
                    </div>
                  ))}
                </div>
                <button className="btn btn-outline btn-full" style={{marginTop:10,fontSize:12,minHeight:40}}
                  onClick={()=>setSlides(s=>[...s,'NOUVELLE SLIDE'])}>+ Ajouter</button>
              </div>

              {/* Preview */}
              <div className="preview-grid">
                {slides.map((sl,i)=>(
                  <div key={`${i}-${sl}-${sBg}-${sTxt}-${sFont}-${sSig}`} className="prev-card">
                    <SlideCanvas data={simData(sl,i)}/>
                    <div className="prev-badge">SLIDE {i+1}</div>
                  </div>
                ))}
              </div>

              <div className="bottom-bar">
                <button className="btn btn-solid btn-full btn-lg" disabled={exporting} onClick={()=>doExport(slides,simData)}>
                  {exporting?'⏳ Génération…':`⬇ Télécharger le ZIP (${slides.length} images)`}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ════ ADVANCED MODE ════ */}
      {mode==='advanced'&&(
        <div className="adv-root">

          {/* ── DESKTOP LEFT ── */}
          <div className="adv-left-desktop">
            <div className="adv-section">
              <div className="adv-sec-title">Importer</div>
              <textarea className="adv-ta" value={aImport} onChange={e=>setAImport(e.target.value)}
                placeholder={"Colle du texte...\n\nDouble saut = nouvelle slide"} style={{height:80,fontSize:13}}/>
              <button className="btn btn-solid" style={{width:'100%',fontSize:12,minHeight:40}} onClick={aImportFn} disabled={!aImport.trim()}>✂ Découper</button>
            </div>
            <div className="adv-section">
              <div className="adv-sec-title">Slides <span style={{color:'var(--text2)'}}>{aSlides.length}</span></div>
            </div>
            <div className="adv-slide-list">
              {aSlides.map((sl,i)=>(
                <div key={sl.id} className={`adv-slide-item ${i===aSel?'sel':''}`} onClick={()=>setASel(i)}>
                  <ThumbCanvas data={aData(sl,i)}/>
                  <div className="adv-slide-num">{String(i+1).padStart(2,'0')}</div>
                  <div className="adv-actions">
                    <button className="adv-act-btn" onClick={e=>{e.stopPropagation();aDup(i);}}>⧉</button>
                    <button className="adv-act-btn" style={{color:'#ff6666'}} onClick={e=>{e.stopPropagation();aDel(i);}}>✕</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{padding:10}}>
              <button className="upload-btn" onClick={()=>setASlides(p=>[...p,mkSlide('NOUVELLE SLIDE',p.length)])}>+ Ajouter</button>
            </div>
          </div>

          {/* ── DESKTOP CENTER ── */}
          <div className="adv-center-desktop">
            <div className="adv-canvas-wrap desktop-canvas">
              <SlideCanvas data={aData(aSl,aSel)}/>
            </div>
            <div className="adv-canvas-nav-desktop">
              <button className="adv-nav-btn" onClick={()=>setASel(Math.max(0,aSel-1))}>◀</button>
              <span className="adv-nav-num">{aSel+1} / {aSlides.length}</span>
              <button className="adv-nav-btn" onClick={()=>setASel(Math.min(aSlides.length-1,aSel+1))}>▶</button>
            </div>
            <div style={{marginTop:16}}>
              <button className="dl-btn" disabled={exporting} onClick={()=>doExport(aSlides,aData)}>
                {exporting?'⏳ Export…':`⬇ ZIP (${aSlides.length} slides)`}
              </button>
            </div>
          </div>

          {/* ── DESKTOP RIGHT ── */}
          <div className="adv-right-desktop">
            <AdvRightPanel aSl={aSl} aSel={aSel} aTab={aTab} setATab={setATab}
              aUpd={aUpd} aUpdBg={aUpdBg} aGlobal={aGlobal} setAGlobal={setAGlobal}
              aBrand={aBrand} setABrand={setABrand} aSlBg={aSlBg} aSlBgType={aSlBgType}
              aApplyTpl={aApplyTpl} fileRef={fileRef} FONTS={FONTS} PRESETS={PRESETS}
              aData={aData} aSlides={aSlides} setASlides={setASlides} toast={toast}
              isDesktop={true}
            />
          </div>

          {/* ── MOBILE LAYOUT ── */}
          {/* Tab bar */}
          <div className="adv-mobile-tabs mobile-only" style={{gridColumn:'1/-1'}}>
            {[['slides','Slides'],['slide','Cette slide'],['global','Global'],['brand','Branding'],['tpl','Templates']].map(([k,l])=>(
              <button key={k} className={`adv-mtab ${aTab===k?'active':''}`} onClick={()=>setATab(k)}>{l}</button>
            ))}
          </div>

          {/* Slides tab (mobile) */}
          {aTab==='slides'&&(
            <div className="mobile-only" style={{gridColumn:'1/-1',paddingBottom:80}}>
              {/* Import */}
              <div style={{padding:'12px 16px',borderBottom:'1px solid var(--border)'}}>
                <textarea className="adv-ta" value={aImport} onChange={e=>setAImport(e.target.value)}
                  placeholder={"Colle ton texte ici...\n\nDouble saut de ligne = nouvelle slide"} style={{height:80,fontSize:13,marginBottom:8}}/>
                <button className="btn btn-solid btn-full" onClick={aImportFn} disabled={!aImport.trim()}>✂ Importer et découper</button>
              </div>
              {/* Horizontal scroll thumbnails */}
              <div className="slide-scroll">
                {aSlides.map((sl,i)=>(
                  <div key={sl.id} className={`slide-thumb ${i===aSel?'sel':''}`} onClick={()=>{setASel(i);setATab('slide');}}>
                    <ThumbCanvas data={aData(sl,i)}/>
                    <div className="thumb-num">{i+1}</div>
                  </div>
                ))}
                <button className="add-thumb" onClick={()=>setASlides(p=>[...p,mkSlide('NOUVELLE SLIDE',p.length)])}>+</button>
              </div>
              {/* Canvas preview */}
              <div className="adv-preview">
                <div className="adv-canvas-wrap">
                  <SlideCanvas data={aData(aSl,aSel)}/>
                </div>
              </div>
              {/* Nav */}
              <div style={{display:'flex',gap:8,padding:'0 16px',justifyContent:'center',alignItems:'center'}}>
                <button className="btn btn-outline" style={{flex:1}} onClick={()=>setASel(Math.max(0,aSel-1))}>◀ Préc.</button>
                <span style={{fontSize:12,fontWeight:700,color:'var(--text2)',minWidth:60,textAlign:'center'}}>{aSel+1}/{aSlides.length}</span>
                <button className="btn btn-outline" style={{flex:1}} onClick={()=>setASel(Math.min(aSlides.length-1,aSel+1))}>Suiv. ▶</button>
              </div>
              {/* Dup/del actions */}
              <div style={{display:'flex',gap:8,padding:'8px 16px 0'}}>
                <button className="btn btn-outline" style={{flex:1,fontSize:12}} onClick={()=>aDup(aSel)}>⧉ Dupliquer</button>
                <button className="btn btn-outline" style={{flex:1,fontSize:12,color:'var(--red)',borderColor:'rgba(255,77,77,.3)'}} onClick={()=>aDel(aSel)}>✕ Supprimer</button>
              </div>
            </div>
          )}

          {/* Slide/Global/Brand/Tpl tabs (mobile) */}
          {['slide','global','brand','tpl'].includes(aTab)&&(
            <div className="mobile-only" style={{gridColumn:'1/-1',paddingBottom:80,overflowY:'auto'}}>
              {/* Mini preview */}
              <div style={{padding:'10px 16px 0',display:'flex',gap:10,alignItems:'center'}}>
                <div style={{width:64,height:64,borderRadius:8,overflow:'hidden',border:'1px solid var(--border)',flexShrink:0}}>
                  <ThumbCanvas data={aData(aSl,aSel)}/>
                </div>
                <div>
                  <div style={{fontSize:11,fontWeight:700,color:'var(--text2)'}}>Slide {aSel+1}/{aSlides.length}</div>
                  <div style={{fontSize:12,fontWeight:600,color:'var(--text)',lineHeight:1.4,marginTop:2}}>{(aSl.text||'').substring(0,50)}{aSl.text.length>50?'…':''}</div>
                </div>
              </div>
              <div className="props-panel" style={{paddingTop:10}}>
                <AdvRightPanel aSl={aSl} aSel={aSel} aTab={aTab} setATab={setATab}
                  aUpd={aUpd} aUpdBg={aUpdBg} aGlobal={aGlobal} setAGlobal={setAGlobal}
                  aBrand={aBrand} setABrand={setABrand} aSlBg={aSlBg} aSlBgType={aSlBgType}
                  aApplyTpl={aApplyTpl} fileRef={fileRef} FONTS={FONTS} PRESETS={PRESETS}
                  aData={aData} aSlides={aSlides} setASlides={setASlides} toast={toast}
                  isDesktop={false}
                />
              </div>
            </div>
          )}

          {/* Bottom bar (mobile advanced) */}
          <div className="bottom-bar mobile-only" style={{gridColumn:'1/-1'}}>
            <button className="btn btn-solid btn-full" disabled={exporting} onClick={()=>doExport(aSlides,aData)}>
              {exporting?'⏳ Export…':`⬇ ZIP (${aSlides.length} slides)`}
            </button>
          </div>

          <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={aBgImage}/>
        </div>
      )}

      {notif&&<div className="notif"><span style={{color:'var(--green)'}}>✓</span> {notif}</div>}
    </div>
  );
}

// ─── ADV RIGHT PANEL (shared mobile+desktop) ─────────────────────────────────

function AdvRightPanel({ aSl, aSel, aTab, setATab, aUpd, aUpdBg, aGlobal, setAGlobal, aBrand, setABrand, aSlBg, aSlBgType, aApplyTpl, fileRef, FONTS, PRESETS, aData, aSlides, setASlides, toast, isDesktop }) {

  const Wrap = ({ children }) => isDesktop ? <div>{children}</div> : <>{children}</>;
  const Section = ({ children, title }) => isDesktop
    ? <div className="prop-group" style={{padding:14,borderBottom:'1px solid var(--border)'}}>{title&&<span className="prop-label">{title}</span>}{children}</div>
    : <div className="prop-section">{title&&<div className="prop-sec-title">{title}</div>}{children}</div>;

  if(isDesktop) return (
    <div>
      <div className="adv-tabs-desktop">
        {[['slide','Slide'],['global','Global'],['brand','Brand'],['tpl','Tpl']].map(([k,l])=>(
          <button key={k} className={`adv-tab-d ${aTab===k?'active':''}`} onClick={()=>setATab(k)}>{l}</button>
        ))}
      </div>
      <PanelContent aSl={aSl} aSel={aSel} aTab={aTab} aUpd={aUpd} aUpdBg={aUpdBg}
        aGlobal={aGlobal} setAGlobal={setAGlobal} aBrand={aBrand} setABrand={setABrand}
        aSlBg={aSlBg} aSlBgType={aSlBgType} aApplyTpl={aApplyTpl} fileRef={fileRef}
        FONTS={FONTS} PRESETS={PRESETS} aData={aData} aSlides={aSlides} setASlides={setASlides} toast={toast}
      />
    </div>
  );

  return (
    <PanelContent aSl={aSl} aSel={aSel} aTab={aTab} aUpd={aUpd} aUpdBg={aUpdBg}
      aGlobal={aGlobal} setAGlobal={setAGlobal} aBrand={aBrand} setABrand={setABrand}
      aSlBg={aSlBg} aSlBgType={aSlBgType} aApplyTpl={aApplyTpl} fileRef={fileRef}
      FONTS={FONTS} PRESETS={PRESETS} aData={aData} aSlides={aSlides} setASlides={setASlides} toast={toast}
    />
  );
}

function PanelContent({ aSl, aSel, aTab, aUpd, aUpdBg, aGlobal, setAGlobal, aBrand, setABrand, aSlBg, aSlBgType, aApplyTpl, fileRef, FONTS, PRESETS, aData, aSlides, setASlides, toast }) {
  const S = ({children, t}) => <div className="prop-section">{t&&<div className="prop-sec-title">{t}</div>}{children}</div>;

  if(aTab==='slide') return (
    <div>
      <S t="Texte">
        <textarea className="adv-ta" value={aSl.text} onChange={e=>aUpd(aSel,{text:e.target.value})} style={{height:80}}/>
        <div className="toggle-row">
          <span className="toggle-lbl">Style personnalisé</span>
          <div className={`toggle ${aSl.overrideTxt?'on':''}`} onClick={()=>aUpd(aSel,{overrideTxt:!aSl.overrideTxt})}/>
        </div>
        {aSl.overrideTxt&&(
          <>
            <select className="styled" value={aSl.font} onChange={e=>aUpd(aSel,{font:e.target.value,overrideTxt:true})} style={{marginBottom:8}}>
              {FONTS.map(f=><option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
            <div className="range-row" style={{marginBottom:8}}>
              <input type="range" min="30" max="160" value={aSl.fontSize} onChange={e=>aUpd(aSel,{fontSize:+e.target.value,overrideTxt:true})}/>
              <span className="range-val">{aSl.fontSize}</span>
            </div>
            <div className="prop-row">
              <span className="prop-lbl">Couleur texte</span>
              <input type="color" value={aSl.textColor} onChange={e=>aUpd(aSel,{textColor:e.target.value,overrideTxt:true})}/>
            </div>
          </>
        )}
      </S>
      <S t="Fond">
        <div className="toggle-row">
          <span className="toggle-lbl">Fond personnalisé</span>
          <div className={`toggle ${aSl.overrideBg?'on':''}`} onClick={()=>aUpd(aSel,{overrideBg:!aSl.overrideBg})}/>
        </div>
        {aSl.overrideBg&&(
          <>
            <div className="bg-tabs">
              {['color','gradient','image'].map(t=>(
                <button key={t} className={`bg-tab ${aSlBgType===t?'active':''}`} onClick={()=>aUpdBg(aSel,{type:t})}>
                  {t==='color'?'Uni':t==='gradient'?'Dégradé':'Image'}
                </button>
              ))}
            </div>
            {aSlBgType==='color'&&<div className="prop-row"><span className="prop-lbl">Couleur</span><input type="color" value={aSlBg.color||'#000'} onChange={e=>aUpdBg(aSel,{color:e.target.value})}/></div>}
            {aSlBgType==='gradient'&&(
              <div>
                <div className="grad-row">
                  <span className="prop-lbl" style={{minWidth:20}}>C1</span>
                  <input type="color" value={(aSlBg.stops||['#000','#222'])[0]} onChange={e=>{const s=[...(aSlBg.stops||['#000','#222'])];s[0]=e.target.value;aUpdBg(aSel,{stops:s});}}/>
                  <span className="prop-lbl" style={{minWidth:20}}>C2</span>
                  <input type="color" value={(aSlBg.stops||['#000','#222'])[1]} onChange={e=>{const s=[...(aSlBg.stops||['#000','#222'])];s[1]=e.target.value;aUpdBg(aSel,{stops:s});}}/>
                </div>
                <div className="range-row">
                  <input type="range" min="0" max="360" value={aSlBg.angle||135} onChange={e=>aUpdBg(aSel,{angle:+e.target.value})}/>
                  <span className="range-val">{aSlBg.angle||135}°</span>
                </div>
              </div>
            )}
            {aSlBgType==='image'&&(
              <div>
                <button className="upload-btn" onClick={()=>fileRef.current?.click()}>📁 Choisir une image</button>
                {aSlBg.imageEl&&(
                  <>
                    <div className="range-row" style={{marginBottom:8}}><span className="prop-lbl" style={{minWidth:36}}>Flou</span><input type="range" min="0" max="20" value={aSlBg.blur||0} onChange={e=>aUpdBg(aSel,{blur:+e.target.value})}/><span className="range-val">{aSlBg.blur||0}px</span></div>
                    <div className="range-row"><span className="prop-lbl" style={{minWidth:36}}>Ombre</span><input type="range" min="0" max="1" step="0.05" value={aSlBg.overlay||0} onChange={e=>aUpdBg(aSel,{overlay:+e.target.value})}/><span className="range-val">{Math.round((aSlBg.overlay||0)*100)}%</span></div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </S>
    </div>
  );

  if(aTab==='global') return (
    <div>
      <S t="Style global">
        <select className="styled" value={aGlobal.font} onChange={e=>setAGlobal(g=>({...g,font:e.target.value}))} style={{marginBottom:8}}>
          {FONTS.map(f=><option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
        <div className="range-row" style={{marginBottom:8}}>
          <input type="range" min="30" max="160" value={aGlobal.fontSize} onChange={e=>setAGlobal(g=>({...g,fontSize:+e.target.value}))}/>
          <span className="range-val">{aGlobal.fontSize}</span>
        </div>
        <div className="prop-row"><span className="prop-lbl">Couleur texte</span><input type="color" value={aGlobal.textColor} onChange={e=>setAGlobal(g=>({...g,textColor:e.target.value}))}/></div>
      </S>
      <S t="Fond global">
        <div className="bg-tabs">
          {['color','gradient'].map(t=><button key={t} className={`bg-tab ${aGlobal.bg.type===t?'active':''}`} onClick={()=>setAGlobal(g=>({...g,bg:{...g.bg,type:t}}))}>{t==='color'?'Uni':'Dégradé'}</button>)}
        </div>
        {aGlobal.bg.type==='color'&&<div className="prop-row"><span className="prop-lbl">Couleur</span><input type="color" value={aGlobal.bg.color||'#000'} onChange={e=>setAGlobal(g=>({...g,bg:{...g.bg,color:e.target.value}}))}/></div>}
        {aGlobal.bg.type==='gradient'&&(
          <div className="grad-row">
            <span className="prop-lbl">C1</span>
            <input type="color" value={(aGlobal.bg.stops||['#000','#222'])[0]} onChange={e=>{const s=[...(aGlobal.bg.stops||['#000','#222'])];s[0]=e.target.value;setAGlobal(g=>({...g,bg:{...g.bg,stops:s}}));}}/>
            <span className="prop-lbl">C2</span>
            <input type="color" value={(aGlobal.bg.stops||['#000','#222'])[1]} onChange={e=>{const s=[...(aGlobal.bg.stops||['#000','#222'])];s[1]=e.target.value;setAGlobal(g=>({...g,bg:{...g.bg,stops:s}}));}}/>
          </div>
        )}
      </S>
      <S>
        <button className="btn btn-outline btn-full" style={{fontSize:12}}
          onClick={()=>{setASlides(p=>p.map(s=>({...s,overrideBg:false,overrideTxt:false})));toast('Styles réinitialisés ✓');}}>
          ↺ Réinitialiser au global
        </button>
      </S>
    </div>
  );

  if(aTab==='brand') return (
    <div>
      <S t="Signature">
        <div className="toggle-row"><span className="toggle-lbl">Afficher</span><div className={`toggle ${aBrand.showSig?'on':''}`} onClick={()=>setABrand(b=>({...b,showSig:!b.showSig}))}/></div>
        <input className="txt-input" type="text" value={aBrand.signature} onChange={e=>setABrand(b=>({...b,signature:e.target.value}))} placeholder="@tonpseudo"/>
      </S>
      <S t="Numérotation">
        <div className="toggle-row"><span className="toggle-lbl">Afficher</span><div className={`toggle ${aBrand.showNum?'on':''}`} onClick={()=>setABrand(b=>({...b,showNum:!b.showNum}))}/></div>
        <div style={{display:'flex',gap:4,flexWrap:'wrap',marginTop:4}}>
          {['{n}/{total}','Slide {n}','{n}','Part {n}'].map(fmt=>(
            <button key={fmt} className={`btn btn-sm ${aBrand.numFmt===fmt?'btn-solid':'btn-outline'}`} style={{fontSize:11,minHeight:36}}
              onClick={()=>setABrand(b=>({...b,numFmt:fmt}))}>{fmt}</button>
          ))}
        </div>
      </S>
    </div>
  );

  if(aTab==='tpl') return (
    <div>
      <S t="→ Cette slide seulement">
        <div className="tpl-grid">
          {PRESETS.map(tpl=>{
            const fd={text:'SAMPLE',bg:tpl.bg,textColor:tpl.textColor,font:tpl.font,fontSize:36,signature:'',showNum:false,slideNum:1,total:1};
            return <div key={tpl.name} className="tpl-card" onClick={()=>aApplyTpl(tpl,false)}><ThumbCanvas data={fd}/><div className="tpl-name">{tpl.name}</div></div>;
          })}
        </div>
      </S>
      <S t="→ Tout le carrousel">
        <div className="tpl-grid">
          {PRESETS.map(tpl=>{
            const fd={text:'SAMPLE',bg:tpl.bg,textColor:tpl.textColor,font:tpl.font,fontSize:36,signature:'',showNum:false,slideNum:1,total:1};
            return <div key={tpl.name} className="tpl-card" onClick={()=>aApplyTpl(tpl,true)}><ThumbCanvas data={fd}/><div className="tpl-name">{tpl.name}</div></div>;
          })}
        </div>
      </S>
    </div>
  );

  return null;
}
