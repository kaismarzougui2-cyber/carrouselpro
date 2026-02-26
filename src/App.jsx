import React, { useState, useRef, useEffect, useReducer, useCallback } from 'react';
import { supabase, getProfile } from './lib/supabaseClient'
import { useCarouselSync } from './hooks/useCarouselSync'
import { usePaywall, PaywallModal } from './lib/paywall'
import Navbar from './components/Navbar'

// ─── STYLES ──────────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;500;600;700;800&family=Montserrat:wght@700;900&family=Anton&family=Oswald:wght@600;700&family=Roboto+Condensed:wght@700&family=Playfair+Display:wght@700;900&family=Space+Mono:wght@700&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#0a0a0a;--bg2:#111;--bg3:#181818;--bg4:#222;
      --border:#262626;--border2:#343434;
      --text:#f0f0f0;--text2:#666;--text3:#333;
      --accent:#fff;--dim:rgba(255,255,255,0.06);
      --green:#3ddc84;--red:#ff4d4d;--blue:#60a5fa;
      --sb:env(safe-area-inset-bottom,0px);
      --st:env(safe-area-inset-top,0px);
    }
    html{height:-webkit-fill-available}
    body{background:var(--bg);color:var(--text);font-family:'Syne',sans-serif;
      min-height:100vh;min-height:-webkit-fill-available;
      overflow-x:hidden;-webkit-font-smoothing:antialiased;
      -webkit-tap-highlight-color:transparent}
    input,textarea,select{font-size:16px!important}
    ::-webkit-scrollbar{width:2px;height:2px}
    ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}

    /* NAV */
    .nav{position:sticky;top:0;z-index:200;
      padding:calc(var(--st)) 16px 0;
      background:rgba(10,10,10,.96);backdrop-filter:blur(20px);
      -webkit-backdrop-filter:blur(20px);border-bottom:1px solid var(--border)}
    .nav-inner{height:52px;display:flex;align-items:center;justify-content:space-between;gap:8px}
    .nav-logo{display:flex;align-items:center;gap:8px;
      font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:4px;
      color:var(--text);user-select:none;flex-shrink:0}
    .logo-sq{width:26px;height:26px;background:var(--accent);border-radius:6px;
      display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .logo-sq span{font-size:12px;font-weight:900;color:#000;font-family:'Syne',sans-serif}
    .mode-sw{display:flex;background:var(--bg3);border:1px solid var(--border);
      border-radius:9px;padding:3px;gap:2px;flex-shrink:0}
    .mode-btn{padding:5px 10px;border-radius:6px;font-family:'Syne',sans-serif;
      font-size:11px;font-weight:700;letter-spacing:.3px;cursor:pointer;
      border:none;background:transparent;color:var(--text2);transition:all .2s}
    .mode-btn.on{background:var(--accent);color:#000}
    .nav-r{display:flex;align-items:center;gap:6px;flex-shrink:0}

    /* BUTTONS */
    .btn{display:inline-flex;align-items:center;justify-content:center;gap:5px;
      padding:10px 16px;border-radius:10px;font-family:'Syne',sans-serif;
      font-size:12px;font-weight:700;cursor:pointer;border:1px solid var(--border);
      transition:all .15s;white-space:nowrap;-webkit-tap-highlight-color:transparent;min-height:44px}
    .btn-o{background:transparent;color:var(--text2)}
    .btn-o:active{background:var(--bg3);color:var(--text)}
    .btn-s{background:var(--accent);color:#000;border-color:var(--accent)}
    .btn-s:active{opacity:.8}
    .btn-s:disabled{opacity:.3;cursor:not-allowed}
    .btn-r{background:transparent;color:var(--red);border-color:rgba(255,77,77,.25)}
    .btn-r:active{background:rgba(255,77,77,.1)}
    .btn-sm{padding:6px 10px;font-size:11px;min-height:36px}
    .btn-lg{padding:15px 24px;font-size:14px;border-radius:13px;min-height:52px}
    .btn-full{width:100%}
    .btn-icon{width:36px;height:36px;padding:0;border-radius:8px;font-size:14px}
    .dl-btn{display:flex;align-items:center;gap:5px;background:var(--accent);color:#000;
      border:none;padding:7px 14px;border-radius:8px;font-family:'Syne',sans-serif;
      font-size:11px;font-weight:800;cursor:pointer;transition:opacity .2s;
      white-space:nowrap;min-height:36px}
    .dl-btn:disabled{opacity:.3;cursor:not-allowed}
    .dl-btn:active{opacity:.7}

    /* UNDO/REDO */
    .ur-btn{display:flex;align-items:center;gap:4px;padding:6px 10px;border-radius:7px;
      font-family:'Syne',sans-serif;font-size:11px;font-weight:700;cursor:pointer;
      border:1px solid var(--border);background:transparent;color:var(--text2);
      min-height:32px;transition:all .15s}
    .ur-btn:hover{background:var(--bg3);color:var(--text)}
    .ur-btn:disabled{opacity:.25;cursor:not-allowed}

    /* STEP BAR */
    .step-bar{display:flex;align-items:center;padding:16px 20px 12px}
    .step-item{display:flex;flex-direction:column;align-items:center;gap:5px;
      flex:1;position:relative;cursor:pointer}
    .step-item::after{content:'';position:absolute;top:15px;left:calc(50% + 16px);
      right:calc(-50% + 16px);height:1px;background:var(--border2)}
    .step-item:last-child::after{display:none}
    .step-dot{width:30px;height:30px;border-radius:50%;display:flex;
      align-items:center;justify-content:center;font-size:12px;font-weight:800;
      z-index:1;border:2px solid var(--border2);background:var(--bg);
      color:var(--text3);transition:all .3s}
    .step-item.done .step-dot{background:var(--green);border-color:var(--green);color:#000}
    .step-item.active .step-dot{background:var(--accent);border-color:var(--accent);color:#000}
    .step-lbl{font-size:9px;font-weight:700;letter-spacing:1px;color:var(--text3);text-transform:uppercase}
    .step-item.active .step-lbl,.step-item.done .step-lbl{color:var(--text2)}

    /* CARD */
    .card{margin:0 16px 14px;background:var(--bg2);border:1px solid var(--border);
      border-radius:18px;padding:20px}
    .card-title{font-family:'Bebas Neue',sans-serif;font-size:20px;
      letter-spacing:3px;color:var(--text);margin-bottom:3px}
    .card-sub{font-size:12px;color:var(--text2);margin-bottom:16px;
      font-weight:500;line-height:1.5}

    /* TEXTAREA */
    .big-ta{width:100%;min-height:180px;background:var(--bg3);border:2px solid var(--border);
      border-radius:12px;color:var(--text);font-family:'Syne',sans-serif;font-weight:500;
      padding:14px;outline:none;resize:none;line-height:1.7;transition:border .2s}
    .big-ta:focus{border-color:var(--border2)}
    .big-ta::placeholder{color:var(--text3)}

    /* HINT */
    .hint{display:flex;gap:8px;align-items:flex-start;margin:10px 0 14px;
      padding:11px 13px;border-radius:10px;background:var(--bg3);
      border:1px solid var(--border);font-size:12px;color:var(--text2);line-height:1.6}
    .hint strong{color:var(--text)}

    /* BADGE */
    .badge{display:inline-flex;align-items:center;gap:6px;background:var(--dim);
      border:1px solid var(--border2);padding:5px 12px;border-radius:20px;
      font-size:12px;font-weight:700;color:var(--text2);margin-bottom:10px}
    .badge .n{color:var(--accent);font-family:'Space Mono',monospace;font-size:15px}

    /* CHIPS */
    .chips{display:flex;flex-direction:column;gap:6px}
    .chip{display:flex;align-items:center;gap:10px;background:var(--bg3);
      border:1px solid var(--border);border-radius:10px;padding:10px 12px;transition:border .15s}
    .chip:hover{border-color:var(--border2)}
    .chip-n{font-family:'Space Mono',monospace;font-size:10px;font-weight:700;
      color:var(--text3);min-width:22px}
    .chip-t{font-size:12px;font-weight:600;color:var(--text2);flex:1;
      white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .chip-input{flex:1;background:transparent;border:none;color:var(--text);
      font-family:'Syne',sans-serif;font-size:12px;font-weight:600;outline:none;min-width:0}
    .chip-x{background:none;border:none;color:var(--text3);cursor:pointer;
      font-size:14px;padding:2px 4px;min-height:44px;display:flex;align-items:center}
    .chip-x:active{color:var(--red)}

    /* PRESETS GRID */
    .presets-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
    .preset-card{aspect-ratio:1;border-radius:10px;overflow:hidden;border:2px solid var(--border);
      cursor:pointer;transition:all .15s;position:relative}
    .preset-card:active{transform:scale(.96)}
    .preset-card.sel{border-color:var(--accent)}
    .preset-card canvas{width:100%;height:100%;display:block}
    .preset-name{position:absolute;bottom:0;left:0;right:0;padding:14px 4px 4px;
      text-align:center;font-size:8px;font-weight:800;letter-spacing:1.5px;
      background:linear-gradient(transparent,rgba(0,0,0,.75));color:#fff}
    .sel-check{position:absolute;top:6px;right:6px;width:18px;height:18px;
      border-radius:50%;background:var(--accent);color:#000;
      display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:900}

    /* FORM INPUTS */
    .opt-lbl{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;
      color:var(--text3);margin-bottom:7px;display:block;margin-top:14px}
    select.sty{width:100%;background:var(--bg3);border:1px solid var(--border);
      border-radius:10px;color:var(--text);font-family:'Syne',sans-serif;
      font-weight:600;padding:12px;outline:none;cursor:pointer;appearance:none}
    .color-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .swatch{width:36px;height:36px;border-radius:8px;border:2px solid var(--border);
      cursor:pointer;flex-shrink:0;transition:transform .15s}
    .swatch:active{transform:scale(.9)}
    .swatch.sel{border-color:var(--accent)}
    input[type=color]{width:36px;height:36px;padding:2px;border-radius:8px;
      border:1px solid var(--border2);background:var(--bg3);cursor:pointer;flex-shrink:0}
    input.ti{width:100%;background:var(--bg3);border:1px solid var(--border);
      border-radius:10px;color:var(--text);font-family:'Syne',sans-serif;
      font-weight:600;padding:12px;outline:none;transition:border .15s}
    input.ti::placeholder{color:var(--text3)}
    input.ti:focus{border-color:var(--border2)}

    /* PREVIEW GRID */
    .prev-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;padding:0 16px 16px}
    @media(min-width:480px){.prev-grid{grid-template-columns:repeat(3,1fr)}}
    .prev-card{border-radius:10px;overflow:hidden;border:1px solid var(--border);
      aspect-ratio:1;position:relative}
    .prev-card canvas{width:100%;height:100%;display:block}
    .prev-badge{position:absolute;top:7px;left:7px;background:rgba(0,0,0,.8);color:#fff;
      font-size:7px;font-weight:800;letter-spacing:1.5px;padding:2px 6px;border-radius:3px}

    /* PLATFORM SELECTOR */
    .plat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:12px}
    .plat-btn{padding:8px 4px;border-radius:8px;font-size:10px;font-weight:800;
      letter-spacing:.5px;cursor:pointer;border:1px solid var(--border);
      background:transparent;color:var(--text3);text-align:center;
      font-family:'Syne',sans-serif;transition:all .15s;min-height:44px}
    .plat-btn.on{background:var(--bg4);color:var(--text);border-color:var(--border2)}
    .plat-icon{font-size:16px;display:block;margin-bottom:2px}

    /* BOTTOM BAR */
    .bot-bar{position:fixed;bottom:0;left:0;right:0;z-index:150;
      padding:10px 16px calc(10px + var(--sb));
      background:rgba(10,10,10,.97);backdrop-filter:blur(20px);
      -webkit-backdrop-filter:blur(20px);border-top:1px solid var(--border)}
    .bot-row{display:flex;gap:8px}

    /* ADVANCED MOBILE */
    .adv-root{display:flex;flex-direction:column;
      min-height:calc(100vh - 52px);padding-bottom:calc(60px + var(--sb))}
    .adv-mtabs{display:flex;overflow-x:auto;border-bottom:1px solid var(--border);
      background:var(--bg2);-webkit-overflow-scrolling:touch;scrollbar-width:none}
    .adv-mtabs::-webkit-scrollbar{display:none}
    .adv-mtab{flex-shrink:0;padding:11px 16px;font-family:'Syne',sans-serif;
      font-size:10px;font-weight:800;letter-spacing:.5px;cursor:pointer;border:none;
      background:transparent;color:var(--text3);border-bottom:2px solid transparent;
      transition:all .15s;white-space:nowrap}
    .adv-mtab.on{color:var(--text);border-bottom-color:var(--accent)}

    /* SLIDE SCROLL */
    .slide-scroll{display:flex;gap:9px;overflow-x:auto;padding:12px 16px;
      -webkit-overflow-scrolling:touch;scrollbar-width:none}
    .slide-scroll::-webkit-scrollbar{display:none}
    .sthumb{flex-shrink:0;width:70px;height:70px;border-radius:8px;overflow:hidden;
      border:2px solid var(--border);cursor:pointer;position:relative;transition:border .15s}
    .sthumb.sel{border-color:var(--accent)}
    .sthumb canvas{width:100%;height:100%;display:block}
    .sthumb-n{position:absolute;bottom:3px;left:3px;background:rgba(0,0,0,.75);color:#fff;
      font-size:7px;font-weight:800;padding:1px 5px;border-radius:2px}
    .add-thumb{flex-shrink:0;width:70px;height:70px;border-radius:8px;
      border:1px dashed var(--border2);background:transparent;color:var(--text3);
      display:flex;align-items:center;justify-content:center;font-size:22px;cursor:pointer}
    .add-thumb:active{border-color:var(--accent);color:var(--accent)}

    /* ADV CANVAS */
    .adv-prev{padding:0 16px 8px;display:flex;justify-content:center}
    .adv-cw{border-radius:8px;overflow:hidden;width:100%;max-width:340px;aspect-ratio:1;
      box-shadow:0 0 0 1px var(--border),0 16px 40px rgba(0,0,0,.6)}
    .adv-cw canvas{width:100%;height:100%;display:block}
    .adv-plat-badge{text-align:center;font-size:10px;font-weight:700;color:var(--text3);
      letter-spacing:1px;padding-bottom:8px}

    /* PROPS PANEL */
    .prop-sec{background:var(--bg2);border:1px solid var(--border);border-radius:14px;
      padding:16px;margin-bottom:10px}
    .prop-sec-t{font-size:9px;font-weight:800;letter-spacing:2px;text-transform:uppercase;
      color:var(--text3);margin-bottom:12px}
    .prop-row{display:flex;align-items:center;gap:8px;margin-bottom:8px}
    .prop-lbl{font-size:12px;font-weight:600;color:var(--text2);flex:1}
    .range-row{display:flex;align-items:center;gap:8px;margin-bottom:8px}
    .rv{font-size:10px;font-weight:700;color:var(--text2);background:var(--bg3);
      padding:2px 7px;border-radius:4px;min-width:36px;text-align:center;
      font-family:'Space Mono',monospace}
    input[type=range]{flex:1;appearance:none;height:3px;background:var(--border2);
      border-radius:3px;border:none;padding:0;cursor:pointer;outline:none}
    input[type=range]::-webkit-slider-thumb{appearance:none;width:18px;height:18px;
      border-radius:50%;background:var(--accent);cursor:pointer}

    .tog-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
    .tog-lbl{font-size:13px;font-weight:600;color:var(--text2)}
    .tog{width:36px;height:20px;background:var(--bg3);border-radius:10px;
      border:1px solid var(--border);cursor:pointer;position:relative;
      transition:background .2s;flex-shrink:0}
    .tog.on{background:var(--accent);border-color:var(--accent)}
    .tog::after{content:'';position:absolute;top:3px;left:3px;width:12px;height:12px;
      border-radius:50%;background:var(--text3);transition:left .2s,background .2s}
    .tog.on::after{left:19px;background:#000}

    .bg-tabs{display:flex;gap:4px;margin-bottom:10px}
    .bg-tab{flex:1;padding:8px 4px;border-radius:7px;text-align:center;font-size:9px;
      font-weight:800;cursor:pointer;border:1px solid var(--border);background:transparent;
      color:var(--text3);font-family:'Syne',sans-serif;min-height:36px}
    .bg-tab.on{background:var(--bg4);color:var(--text);border-color:var(--border2)}

    .grad-row{display:flex;gap:8px;align-items:center;margin-bottom:8px;flex-wrap:wrap}
    textarea.ata{width:100%;background:var(--bg3);border:1px solid var(--border);
      border-radius:10px;color:var(--text);font-family:'Syne',sans-serif;font-weight:500;
      padding:11px;outline:none;resize:none;line-height:1.6;margin-bottom:8px}
    textarea.ata:focus{border-color:var(--border2)}
    .up-btn{width:100%;padding:11px;border-radius:9px;border:1px dashed var(--border2);
      background:transparent;color:var(--text2);font-family:'Syne',sans-serif;
      font-size:12px;font-weight:700;cursor:pointer;min-height:44px;margin-bottom:8px}
    .up-btn:active{border-color:var(--accent);color:var(--text);background:var(--dim)}

    /* TEMPLATES */
    .tpl-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}
    .tpl-card{aspect-ratio:1;border-radius:8px;overflow:hidden;border:1px solid var(--border);
      cursor:pointer;position:relative;transition:all .15s}
    .tpl-card:active{transform:scale(.95)}
    .tpl-card canvas{width:100%;height:100%;display:block}
    .tpl-name{position:absolute;bottom:0;left:0;right:0;
      background:linear-gradient(transparent,rgba(0,0,0,.8));color:#fff;
      font-size:7px;font-weight:800;letter-spacing:1px;padding:8px 4px 3px;text-align:center}

    /* HISTORY */
    .hist-item{display:flex;align-items:center;gap:8px;padding:9px 0;
      border-bottom:1px solid var(--border);cursor:pointer}
    .hist-item:active{opacity:.7}
    .hist-dot{width:6px;height:6px;border-radius:50%;background:var(--border2);flex-shrink:0}
    .hist-item.cur .hist-dot{background:var(--accent)}
    .hist-item.cur{color:var(--accent)}
    .hist-lbl{font-size:12px;font-weight:600;color:var(--text2)}
    .hist-item.cur .hist-lbl{color:var(--accent)}

    /* DESKTOP */
    @media(min-width:768px){
      .nav-inner{height:56px}
      .nav{padding:0 24px}
      .mode-btn{padding:6px 16px;font-size:12px}
      .simple-root{max-width:680px;margin:0 auto;padding-bottom:80px}
      .card{margin:0 0 14px;border-radius:20px;padding:26px}
      .big-ta{min-height:220px}
      .bot-bar{position:static;background:transparent;border:none;padding:0;
        backdrop-filter:none;margin-top:8px}
      .bot-row{justify-content:space-between}
      .bot-row .btn{flex:0 0 auto;min-width:140px}
      .prev-grid{grid-template-columns:repeat(3,1fr);padding:0 0 24px}
      .adv-root{display:grid;grid-template-columns:245px 1fr 265px;
        grid-template-rows:auto 1fr;height:calc(100vh - 56px);
        padding-bottom:0;overflow:hidden}
      .adv-mtabs{display:none}
      .adv-left-d{display:flex!important;flex-direction:column;
        grid-column:1;grid-row:1/3;border-right:1px solid var(--border);
        background:var(--bg2);overflow-y:auto}
      .adv-center-d{display:flex!important;flex-direction:column;
        align-items:center;justify-content:center;
        grid-column:2;grid-row:1/3;background:var(--bg);
        padding:24px;overflow:hidden}
      .adv-right-d{display:flex!important;flex-direction:column;
        grid-column:3;grid-row:1/3;border-left:1px solid var(--border);
        background:var(--bg2);overflow-y:auto}
      .mob-only{display:none!important}
      .desk-cw{max-width:460px!important}
      .desk-cw-ratio-916{max-width:280px!important}
    }
    .adv-left-d,.adv-center-d,.adv-right-d{display:none}

    /* ADV DESKTOP INTERNALS */
    .adv-sec{padding:12px 14px;border-bottom:1px solid var(--border)}
    .adv-sec-t{font-size:9px;font-weight:800;letter-spacing:2px;text-transform:uppercase;
      color:var(--text3);margin-bottom:8px;display:flex;align-items:center;justify-content:space-between}
    .adv-slist{padding:8px;display:flex;flex-direction:column;gap:6px;overflow-y:auto;flex:1}
    .adv-si{border-radius:9px;overflow:hidden;border:2px solid transparent;cursor:pointer;
      transition:all .15s;aspect-ratio:1;position:relative;background:var(--bg3)}
    .adv-si:hover{border-color:var(--border2)}
    .adv-si.sel{border-color:var(--accent)}
    .adv-si canvas{width:100%;height:100%;display:block}
    .adv-sin{position:absolute;top:5px;left:5px;background:rgba(0,0,0,.75);color:#fff;
      font-size:8px;font-weight:800;letter-spacing:1.5px;padding:2px 6px;border-radius:3px}
    .adv-sact{position:absolute;top:5px;right:5px;display:flex;gap:3px;
      opacity:0;transition:opacity .15s}
    .adv-si:hover .adv-sact{opacity:1}
    .adv-ab{width:20px;height:20px;border-radius:4px;background:rgba(0,0,0,.8);
      border:none;cursor:pointer;color:#fff;font-size:10px;
      display:flex;align-items:center;justify-content:center}
    .adv-ab:hover{background:rgba(255,255,255,.2)}
    .adv-dtabs{display:flex;border-bottom:1px solid var(--border)}
    .adv-dtab{flex:1;padding:10px 4px;font-size:9px;font-weight:800;letter-spacing:.3px;
      cursor:pointer;border:none;background:transparent;color:var(--text3);
      border-bottom:2px solid transparent;font-family:'Syne',sans-serif;transition:all .15s}
    .adv-dtab.on{color:var(--text);border-bottom-color:var(--accent)}
    .adv-cnav{margin-top:14px;display:flex;align-items:center;gap:12px;
      background:rgba(10,10,10,.9);backdrop-filter:blur(12px);
      border:1px solid var(--border);border-radius:20px;padding:6px 16px}
    .adv-nb{background:none;border:none;color:var(--text2);cursor:pointer;
      font-size:14px;padding:2px 4px;transition:color .15s}
    .adv-nb:hover{color:var(--text)}
    .adv-nn{font-size:11px;font-weight:700;color:var(--text2);min-width:40px;text-align:center}
    .plat-badge-d{font-size:9px;font-weight:700;letter-spacing:1.5px;color:var(--text3);
      text-align:center;margin-top:8px}

    /* PROP GROUP (desktop right) */
    .pg{padding:14px;border-bottom:1px solid var(--border)}
    .pg-t{font-size:9px;font-weight:800;letter-spacing:2px;text-transform:uppercase;
      color:var(--text3);margin-bottom:10px;display:block}

    /* NOTIF */
    .notif{position:fixed;bottom:calc(70px + var(--sb));right:16px;z-index:999;
      background:var(--bg3);border:1px solid var(--border2);border-radius:10px;
      padding:10px 16px;font-size:12px;font-weight:700;color:var(--text);
      box-shadow:0 8px 32px rgba(0,0,0,.6);display:flex;align-items:center;gap:7px;
      animation:nIn .2s ease}
    @keyframes nIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  `}} />
);

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const FONTS = [
  {label:'Montserrat Black', value:'Montserrat'},
  {label:'Anton — Impact',   value:'Anton'},
  {label:'Oswald Compact',   value:'Oswald'},
  {label:'Roboto Condensed', value:'Roboto Condensed'},
  {label:'Playfair Display', value:'Playfair Display'},
  {label:'Bebas Neue',       value:'Bebas Neue'},
];

const PLATFORMS = {
  instagram: {label:'Instagram', icon:'📸', w:1080, h:1080},
  linkedin:  {label:'LinkedIn',  icon:'💼', w:1080, h:1080},
  tiktok:    {label:'TikTok',    icon:'🎵', w:1080, h:1920},
};

const PRESETS = [
  {name:'NOIR',     bg:{type:'color',color:'#000000'},                          textColor:'#ffffff', font:'Montserrat',      fontSize:88},
  {name:'BLANC',    bg:{type:'color',color:'#ffffff'},                          textColor:'#000000', font:'Montserrat',      fontSize:88},
  {name:'GRADIENT', bg:{type:'gradient',stops:['#0a0a0a','#1a1a2e'],angle:135}, textColor:'#ffffff', font:'Anton',           fontSize:95},
  {name:'CRÈME',    bg:{type:'color',color:'#f5f0e8'},                          textColor:'#1a1a1a', font:'Playfair Display',fontSize:82},
  {name:'ROUGE',    bg:{type:'color',color:'#c0392b'},                          textColor:'#ffffff', font:'Anton',           fontSize:95},
  {name:'NUIT',     bg:{type:'gradient',stops:['#0f0c29','#302b63'],angle:160}, textColor:'#e0d7ff', font:'Bebas Neue',      fontSize:100},
];

const QBG   = ['#000000','#ffffff','#1a1a2e','#c0392b','#f5f0e8','#0d3349'];
const QTXT  = ['#ffffff','#000000','#f5f0e8','#ffd700','#e0d7ff','#ff6b6b'];

// ─── DRAW ─────────────────────────────────────────────────────────────────────
function drawSlide(canvas, {text, bg, textColor, font, fontSize, signature, showNum, slideNum, total}) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  if (bg.type==='color') {
    ctx.fillStyle=bg.color; ctx.fillRect(0,0,W,H);
  } else if (bg.type==='gradient') {
    const a=(bg.angle||135)*Math.PI/180;
    const g=ctx.createLinearGradient(W/2-Math.cos(a)*W/2,H/2-Math.sin(a)*H/2,W/2+Math.cos(a)*W/2,H/2+Math.sin(a)*H/2);
    (bg.stops||['#000','#222']).forEach((c,i,ar)=>g.addColorStop(i/(ar.length-1),c));
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  } else if (bg.type==='image'&&bg.imageEl) {
    ctx.drawImage(bg.imageEl,0,0,W,H);
    if(bg.blur){ctx.filter=`blur(${bg.blur}px)`;ctx.drawImage(canvas,0,0);ctx.filter='none';}
    if(bg.overlay){ctx.fillStyle=`rgba(0,0,0,${bg.overlay})`;ctx.fillRect(0,0,W,H);}
  }

  ctx.strokeStyle='rgba(128,128,128,.07)'; ctx.lineWidth=2;
  ctx.strokeRect(38,38,W-76,H-76);

  if(showNum){
    ctx.save(); ctx.globalAlpha=.4; ctx.fillStyle=textColor;
    ctx.textAlign='right'; ctx.font=`500 ${Math.round(H*.02)}px 'Syne',sans-serif`;
    ctx.fillText(`${slideNum}/${total}`,W-52,H*.065); ctx.restore();
  }
  if(signature&&signature.trim()){
    ctx.save(); ctx.globalAlpha=.5; ctx.fillStyle=textColor;
    ctx.textAlign='center'; ctx.font=`700 ${Math.round(H*.024)}px 'Syne',sans-serif`;
    ctx.fillText(signature.toUpperCase(),W/2,H-.054*H);
    ctx.strokeStyle='rgba(128,128,128,.15)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(W/2-80,H-.077*H); ctx.lineTo(W/2+80,H-.077*H); ctx.stroke();
    ctx.restore();
  }

  ctx.fillStyle=textColor; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.font=`bold ${fontSize}px '${font}',sans-serif`;
  const words=(text||' ').toUpperCase().split(' ');
  const maxW=W*.84, lh=fontSize*1.18;
  let lines=[],cur='';
  words.forEach(w=>{const t=cur+w+' ';if(ctx.measureText(t).width>maxW&&cur){lines.push(cur.trim());cur=w+' ';}else cur=t;});
  if(cur.trim())lines.push(cur.trim());
  const totalH=lines.length*lh,sy=(H-totalH)/2+lh/2;
  lines.forEach((l,i)=>ctx.fillText(l,W/2,sy+i*lh));
}

// ─── CANVAS COMPONENTS ───────────────────────────────────────────────────────
const SlideCanvas = React.memo(({data, W=1080, H=1080})=>{
  const ref=useRef(null);
  useEffect(()=>{const c=ref.current;if(!c)return;c.width=W;c.height=H;drawSlide(c,data);});
  return <canvas ref={ref} style={{width:'100%',height:'100%',display:'block'}}/>;
});
const ThumbCanvas = React.memo(({data})=>{
  const ref=useRef(null);
  useEffect(()=>{const c=ref.current;if(!c)return;c.width=200;c.height=200;drawSlide(c,data);});
  return <canvas ref={ref} style={{width:'100%',height:'100%',display:'block'}}/>;
});

// ─── SMART SPLIT ─────────────────────────────────────────────────────────────
function smartSplit(raw){
  const byDouble=raw.split(/\n\n+/).map(s=>s.replace(/\n/g,' ').trim()).filter(Boolean);
  if(byDouble.length>1)return byDouble;
  const text=raw.replace(/\n/g,' ').trim();
  const limit=200;
  let chunks=[],rem=text;
  while(rem.length>0){
    if(rem.length<=limit){chunks.push(rem);break;}
    let si=-1;
    const look=rem.substring(0,limit+30);
    const pm=look.match(/[.!?…](?!.*[.!?…])/);
    if(pm&&pm.index>limit/3)si=pm.index+1;
    else si=rem.lastIndexOf(' ',limit);
    if(si<=0)si=limit;
    chunks.push(rem.substring(0,si).trim());
    rem=rem.substring(si).trim();
  }
  return chunks;
}

// ─── HISTORY REDUCER ─────────────────────────────────────────────────────────
function histReducer(state, action){
  switch(action.type){
    case 'PUSH':{
      const past=[...state.past.slice(-29),{snap:state.present,label:state.label}];
      return{past,present:action.payload,future:[],label:action.label||'Edit'};
    }
    case 'UNDO':{
      if(!state.past.length)return state;
      const prev=state.past[state.past.length-1];
      return{past:state.past.slice(0,-1),present:prev.snap,
        future:[{snap:state.present,label:state.label},...state.future],label:prev.label};
    }
    case 'REDO':{
      if(!state.future.length)return state;
      const next=state.future[0];
      return{past:[...state.past,{snap:state.present,label:state.label}],
        present:next.snap,future:state.future.slice(1),label:next.label};
    }
    default:return state;
  }
}

// ─── INITIAL ADV STATE ───────────────────────────────────────────────────────
const mkSlide=(text='NOUVELLE SLIDE',i=0)=>({
  id:`s${Date.now()}_${i}_${Math.random().toString(36).slice(2,6)}`,
  text,bg:{type:'color',color:'#000000'},textColor:'#ffffff',
  font:'Montserrat',fontSize:88,overrideBg:false,overrideTxt:false,
});

const INIT_ADV={
  slides:[mkSlide('BIENVENUE SUR CARROUSELPRO',0),mkSlide('PERSONNALISE CHAQUE SLIDE.',1),mkSlide('TÉLÉCHARGE EN UN CLIC.',2)],
  global:{bg:{type:'color',color:'#000000'},textColor:'#ffffff',font:'Montserrat',fontSize:88},
  brand:{signature:'@tonpseudo',showSig:true,showNum:true,numFmt:'{n}/{total}'},
  platform:'instagram',
  sel:0,
};

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App(){
  const [user, setUser] = useState(null)
const [profile, setProfile] = useState(null)
  const [mode,setMode]=useState('simple');

  // ── Simple state ──
  const [step,setStep]=useState(1);
  const [raw,setRaw]=useState('');
  const [slides,setSlides]=useState([]);
  const [selPre,setSelPre]=useState(0);
  const [sFont,setSFont]=useState('Montserrat');
  const [sBg,setSBg]=useState('#000000');
  const [sTxt,setSTxt]=useState('#ffffff');
  const [sSig,setSSig]=useState('@tonpseudo');
  const [sPlatform,setSPlatform]=useState('instagram');

  // ── Advanced state with history ──
  const [hist,dispatch]=useReducer(histReducer,{past:[],present:INIT_ADV,future:[],label:'Initial'});
  const adv=hist.present;
  const setAdv=useCallback((updater,label='Edit')=>{
    dispatch({type:'PUSH',payload:typeof updater==='function'?updater(hist.present):updater,label});
  },[hist.present]);

  const [aTab,setATab]=useState('slides');
  const [aImport,setAImport]=useState('');

  const [notif,setNotif]=useState(null);
  const [exporting,setExp]=useState(false);
  const fileRef=useRef(null);
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUser(session?.user ?? null)
    if (session?.user) getProfile(session.user.id).then(setProfile).catch(console.error)
  })
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
    setUser(session?.user ?? null)
    if (session?.user) getProfile(session.user.id).then(setProfile).catch(console.error)
    else setProfile(null)
  })
  return () => subscription.unsubscribe()
}, [])

const { saveStatus } = useCarouselSync(adv, user, profile?.is_premium)
const { gateExport, showPaywall, closePaywall } = usePaywall(profile)
```

---



  useEffect(()=>{
    const s=document.createElement('script');
    s.src='https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    document.body.appendChild(s);
  },[]);

  // ── Simple helpers ──
  const preview=raw.trim()?smartSplit(raw):[];
  const plt=PLATFORMS[sPlatform]||PLATFORMS.instagram;

  const simData=(text,i)=>({
    text:text||' ',
    bg:{type:'color',color:sBg},
    textColor:sTxt,font:sFont,
    fontSize:PRESETS[selPre].fontSize,
    signature:sSig,showNum:true,slideNum:i+1,total:slides.length,
  });

  const handleParse=()=>{const c=smartSplit(raw);setSlides(c);setStep(2);};

  // ── Advanced helpers ──
  const {slides:aSlides,global:aGlobal,brand:aBrand,platform:aPlatform,sel:aSel}=adv;
  const aPlt=PLATFORMS[aPlatform]||PLATFORMS.instagram;
  const aSl=aSlides[aSel]||aSlides[0];

  const aData=(sl,i)=>{
    const g=aGlobal,br=aBrand;
    return{
      text:sl.text||' ',
      bg:sl.overrideBg?sl.bg:g.bg,
      textColor:sl.overrideTxt?sl.textColor:g.textColor,
      font:sl.overrideTxt?sl.font:g.font,
      fontSize:sl.overrideTxt?sl.fontSize:g.fontSize,
      signature:br.showSig?br.signature:'',
      showNum:br.showNum,slideNum:i+1,total:aSlides.length,
    };
  };

  const aUpd=(idx,ch,lbl)=>setAdv(s=>({...s,slides:s.slides.map((sl,i)=>i===idx?{...sl,...ch}:sl)}),lbl||'Slide edit');
  const aUpdBg=(idx,ch)=>setAdv(s=>({...s,slides:s.slides.map((sl,i)=>i===idx?{...sl,bg:{...sl.bg,...ch},overrideBg:true}:sl)}),'BG change');

  const aDup=idx=>{
    const d={...aSlides[idx],id:`s${Date.now()}`};
    setAdv(s=>{const n=[...s.slides];n.splice(idx+1,0,d);return{...s,slides:n,sel:idx+1};},'Duplicate slide');
    toast('Slide dupliquée ✓');
  };
  const aDel=idx=>{
    if(aSlides.length<=1){toast('Impossible de supprimer la seule slide');return;}
    setAdv(s=>({...s,slides:s.slides.filter((_,i)=>i!==idx),sel:Math.max(0,idx-1)}),'Delete slide');
  };
  const aSel_set=idx=>setAdv(s=>({...s,sel:idx}),'Select slide');

  const aApplyTpl=(tpl,all=false)=>{
    if(all){
      setAdv(s=>({
        ...s,
        slides:s.slides.map(sl=>({...sl,bg:{...tpl.bg},textColor:tpl.textColor,font:tpl.font,fontSize:tpl.fontSize,overrideBg:true,overrideTxt:true})),
        global:{...s.global,bg:tpl.bg,textColor:tpl.textColor,font:tpl.font,fontSize:tpl.fontSize},
      }),`Template "${tpl.name}" → tout`);
      toast(`"${tpl.name}" appliqué à tout ✓`);
    } else {
      aUpd(aSel,{bg:{...tpl.bg},textColor:tpl.textColor,font:tpl.font,fontSize:tpl.fontSize,overrideBg:true,overrideTxt:true},`Template "${tpl.name}"`);
      toast(`"${tpl.name}" appliqué ✓`);
    }
  };

  const aImportFn=()=>{
    if(!aImport.trim())return;
    const chunks=smartSplit(aImport);
    setAdv(s=>({...s,slides:chunks.map((t,i)=>mkSlide(t,i)),sel:0}),'Import text');
    setAImport(''); toast(`${chunks.length} slides créées ✓`);
  };

  const aBgImage=e=>{
    const f=e.target.files[0];if(!f)return;
    const r=new FileReader();
    r.onload=ev=>{const img=new Image();img.onload=()=>{aUpdBg(aSel,{type:'image',imageEl:img,blur:0,overlay:0.3});toast('Image appliquée ✓');};img.src=ev.target.result;};
    r.readAsDataURL(f);
  };

  const aSlBg=aSl.overrideBg?aSl.bg:aGlobal.bg;

  // ── Export ──
  const doExport=async(list,dataFn,w,h)=>{
    if(typeof window.JSZip==='undefined'){toast('Chargement…');return;}
    setExp(true);
    try{
      const zip=new window.JSZip(),folder=zip.folder('carrouselpro');
      await Promise.all(list.map((sl,i)=>new Promise(res=>{
        const c=document.createElement('canvas');
        c.width=w||1080;c.height=h||1080;drawSlide(c,dataFn(sl,i));
        c.toBlob(b=>{folder.file(`slide-${i+1}.png`,b);res();},'image/png');
      })));
      const blob=await zip.generateAsync({type:'blob'});
      const a=document.createElement('a');
      a.href=URL.createObjectURL(blob);a.download=`carrousel-${Date.now()}.zip`;a.click();
      toast(`${list.length} images exportées ✓`);
    }catch(e){console.error(e);}finally{setExp(false);}
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return(
    <div>
      <GlobalStyles/>

      {/* NAV */}
     <Navbar user={user} profile={profile} saveStatus={saveStatus}>
  <div className="mode-sw">
    <button className={`mode-btn ${mode==='simple'?'on':''}`} onClick={()=>setMode('simple')}>⚡ Simple</button>
    <button className={`mode-btn ${mode==='advanced'?'on':''}`} onClick={()=>setMode('advanced')}>🔧 Pro</button>
  </div>
</Navbar>

      {/* ════ SIMPLE MODE ════ */}
      {mode==='simple'&&(
        <div className="simple-root">
          {/* Steps */}
          <div className="step-bar">
            {[{n:1,l:'Texte'},{n:2,l:'Style'},{n:3,l:'Aperçu'}].map(s=>(
              <div key={s.n} className={`step-item ${step>s.n?'done':step===s.n?'active':''}`}
                onClick={()=>step>s.n&&setStep(s.n)}>
                <div className="step-dot">{step>s.n?'✓':s.n}</div>
                <div className="step-lbl">{s.l}</div>
              </div>
            ))}
          </div>

          {/* STEP 1 — Découpe */}
          {step===1&&(
            <>
              <div className="card">
                <div className="card-title">DÉCOUPE TON TEXTE</div>
                <div className="card-sub">Saute <strong>deux fois Entrée</strong> entre chaque slide — ou colle n'importe quel texte pour un découpage automatique.</div>
                <textarea className="big-ta" value={raw} onChange={e=>setRaw(e.target.value)}
                  placeholder={"Exemple :\n\nComment gagner du temps le matin.\n\nPremière astuce : prépare ta tenue la veille.\n\nDeuxième astuce : évite les réseaux le matin."}/>
                <div className="hint">
                  <span>💡</span>
                  <div><strong>2 façons :</strong><br/>
                  • <strong>Manuel :</strong> 2× Entrée entre chaque slide<br/>
                  • <strong>Auto :</strong> colle ton texte, on détecte les phrases</div>
                </div>
                {preview.length>0&&(
                  <div>
                    <div className="badge"><span className="n">{preview.length}</span> slides détectées</div>
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
              <div className="bot-bar">
                <button className="btn btn-s btn-full btn-lg" onClick={handleParse} disabled={!raw.trim()}>✂ Découper et continuer →</button>
              </div>
            </>
          )}

          {/* STEP 2 — Style */}
          {step===2&&(
            <>
              <div className="card">
                <div className="card-title">CHOISIS TON STYLE</div>
                <div className="card-sub">Preset, police, couleurs — c'est tout.</div>
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
                <span className="opt-lbl">Plateforme</span>
                <div className="plat-grid">
                  {Object.entries(PLATFORMS).map(([k,v])=>(
                    <button key={k} className={`plat-btn ${sPlatform===k?'on':''}`} onClick={()=>setSPlatform(k)}>
                      <span className="plat-icon">{v.icon}</span>{v.label}
                    </button>
                  ))}
                </div>
                <span className="opt-lbl">Police</span>
                <select className="sty" value={sFont} onChange={e=>setSFont(e.target.value)}>
                  {FONTS.map(f=><option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
                <span className="opt-lbl">Couleur fond</span>
                <div className="color-row">
                  {QBG.map(c=><div key={c} className={`swatch ${sBg===c?'sel':''}`} style={{background:c}} onClick={()=>setSBg(c)}/>)}
                  <input type="color" value={sBg} onChange={e=>setSBg(e.target.value)}/>
                </div>
                <span className="opt-lbl">Couleur texte</span>
                <div className="color-row">
                  {QTXT.map(c=><div key={c} className={`swatch ${sTxt===c?'sel':''}`} style={{background:c}} onClick={()=>setSTxt(c)}/>)}
                  <input type="color" value={sTxt} onChange={e=>setSTxt(e.target.value)}/>
                </div>
                <span className="opt-lbl">Ta signature</span>
                <input className="ti" type="text" value={sSig} onChange={e=>setSSig(e.target.value)} placeholder="@tonpseudo"/>
              </div>
              <div className="bot-bar">
                <div className="bot-row">
                  <button className="btn btn-o" onClick={()=>setStep(1)}>← Retour</button>
                  <button className="btn btn-s" style={{flex:1}} onClick={()=>setStep(3)}>Aperçu →</button>
                </div>
              </div>
            </>
          )}

          {/* STEP 3 — Aperçu + export */}
          {step===3&&(
            <>
              <div style={{padding:'0 16px 12px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:3}}>APERÇU</div>
                  <div style={{fontSize:11,color:'var(--text2)',fontWeight:500,marginTop:1}}>{slides.length} slides · {plt.label} {plt.w}×{plt.h}</div>
                </div>
                <button className="btn btn-o btn-sm" onClick={()=>setStep(2)}>← Style</button>
              </div>
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
                <button className="btn btn-o btn-full btn-sm" style={{marginTop:10}}
                  onClick={()=>setSlides(s=>[...s,'NOUVELLE SLIDE'])}>+ Ajouter</button>
              </div>
              <div className="prev-grid">
                {slides.map((sl,i)=>(
                  <div key={`${i}-${sl}-${sBg}-${sTxt}-${sFont}-${sSig}`} className="prev-card">
                    <SlideCanvas data={simData(sl,i)} W={plt.w} H={plt.h}/>
                    <div className="prev-badge">SLIDE {i+1}</div>
                  </div>
                ))}
              </div>
              <div className="bot-bar">
                <button className="btn btn-s btn-full btn-lg" disabled={exporting} onClick={()=>doExport(slides,simData,plt.w,plt.h)}>
                  {exporting?'⏳ Génération…':`⬇ ZIP (${slides.length} images · ${plt.label})`}
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
          <div className="adv-left-d">
            <div className="adv-sec">
              <div className="adv-sec-t">Importer du texte</div>
              <textarea className="ata" value={aImport} onChange={e=>setAImport(e.target.value)}
                placeholder={"Colle ton texte...\n\nDouble saut = nouvelle slide"} style={{height:80,fontSize:13}}/>
              <button className="btn btn-s btn-full btn-sm" onClick={aImportFn} disabled={!aImport.trim()}>✂ Découper</button>
            </div>
            <div className="adv-sec">
              <div className="adv-sec-t">Slides <span style={{color:'var(--text2)'}}>{aSlides.length}</span></div>
            </div>
            <div className="adv-slist">
              {aSlides.map((sl,i)=>(
                <div key={sl.id} className={`adv-si ${i===aSel?'sel':''}`} onClick={()=>aSel_set(i)}>
                  <ThumbCanvas data={aData(sl,i)}/>
                  <div className="adv-sin">{String(i+1).padStart(2,'0')}</div>
                  <div className="adv-sact">
                    <button className="adv-ab" title="Dupliquer" onClick={e=>{e.stopPropagation();aDup(i);}}>⧉</button>
                    <button className="adv-ab" style={{color:'#ff6666'}} title="Supprimer" onClick={e=>{e.stopPropagation();aDel(i);}}>✕</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{padding:10}}>
              <button className="up-btn" onClick={()=>setAdv(s=>({...s,slides:[...s.slides,mkSlide('NOUVELLE SLIDE',s.slides.length)]}),'Add slide')}>+ Ajouter une slide</button>
            </div>
          </div>

          {/* ── DESKTOP CENTER ── */}
          <div className="adv-center-d">
            <div className={`adv-cw desk-cw ${aPlatform==='tiktok'?'desk-cw-ratio-916':''}`}>
              <SlideCanvas data={aData(aSl,aSel)} W={aPlt.w} H={aPlt.h}/>
            </div>
            <div className="adv-cnav">
              <button className="adv-nb" onClick={()=>setAdv(s=>({...s,sel:Math.max(0,s.sel-1)}))}>◀</button>
              <span className="adv-nn">{aSel+1} / {aSlides.length}</span>
              <button className="adv-nb" onClick={()=>setAdv(s=>({...s,sel:Math.min(s.slides.length-1,s.sel+1)}))}>▶</button>
            </div>
            <div className="plat-badge-d">{aPlt.icon} {aPlt.label} · {aPlt.w}×{aPlt.h}</div>
          </div>

          {/* ── DESKTOP RIGHT ── */}
          <div className="adv-right-d">
            <div className="adv-dtabs">
              {[['slide','Slide'],['global','Global'],['brand','Brand'],['tpl','Templates'],['hist','Historique']].map(([k,l])=>(
                <button key={k} className={`adv-dtab ${aTab===k?'on':''}`} onClick={()=>setATab(k)}>{l}</button>
              ))}
            </div>
            <AdvPanel aTab={aTab} aSl={aSl} aSel={aSel} aSlBg={aSlBg}
              aUpd={aUpd} aUpdBg={aUpdBg} aGlobal={aGlobal} setAdv={setAdv}
              aBrand={aBrand} aApplyTpl={aApplyTpl} fileRef={fileRef}
              aPlatform={aPlatform} hist={hist} dispatch={dispatch}
              aSlides={aSlides} toast={toast}/>
          </div>

          {/* ── MOBILE TAB BAR ── */}
          <div className="adv-mtabs mob-only" style={{gridColumn:'1/-1'}}>
            {[['slides','Slides'],['slide','Cette slide'],['global','Global'],['brand','Branding'],['tpl','Templates'],['hist','Historique']].map(([k,l])=>(
              <button key={k} className={`adv-mtab ${aTab===k?'on':''}`} onClick={()=>setATab(k)}>{l}</button>
            ))}
          </div>

          {/* ── MOBILE SLIDES TAB ── */}
          {aTab==='slides'&&(
            <div className="mob-only" style={{gridColumn:'1/-1',paddingBottom:80}}>
              <div style={{padding:'12px 16px',borderBottom:'1px solid var(--border)'}}>
                <textarea className="ata" value={aImport} onChange={e=>setAImport(e.target.value)}
                  placeholder={"Colle ton texte...\n\nDouble saut = nouvelle slide"} style={{height:80,fontSize:13}}/>
                <button className="btn btn-s btn-full btn-sm" onClick={aImportFn} disabled={!aImport.trim()}>✂ Importer</button>
              </div>
              <div className="slide-scroll">
                {aSlides.map((sl,i)=>(
                  <div key={sl.id} className={`sthumb ${i===aSel?'sel':''}`}
                    onClick={()=>{aSel_set(i);setATab('slide');}}>
                    <ThumbCanvas data={aData(sl,i)}/>
                    <div className="sthumb-n">{i+1}</div>
                  </div>
                ))}
                <button className="add-thumb" onClick={()=>setAdv(s=>({...s,slides:[...s.slides,mkSlide('NOUVELLE SLIDE',s.slides.length)]}),'Add slide')}>+</button>
              </div>
              <div className="adv-prev">
                <div className="adv-cw">
                  <SlideCanvas data={aData(aSl,aSel)} W={aPlt.w} H={aPlt.h}/>
                </div>
              </div>
              <div className="adv-plat-badge">{aPlt.icon} {aPlt.label} · {aPlt.w}×{aPlt.h}</div>
              <div style={{display:'flex',gap:8,padding:'6px 16px',justifyContent:'center',alignItems:'center'}}>
                <button className="btn btn-o btn-sm" style={{flex:1}} onClick={()=>setAdv(s=>({...s,sel:Math.max(0,s.sel-1)}))}>◀ Préc.</button>
                <span style={{fontSize:12,fontWeight:700,color:'var(--text2)',minWidth:56,textAlign:'center'}}>{aSel+1}/{aSlides.length}</span>
                <button className="btn btn-o btn-sm" style={{flex:1}} onClick={()=>setAdv(s=>({...s,sel:Math.min(s.slides.length-1,s.sel+1)}))}>Suiv. ▶</button>
              </div>
              <div style={{display:'flex',gap:8,padding:'8px 16px 0'}}>
                <button className="btn btn-o btn-sm" style={{flex:1}} onClick={()=>aDup(aSel)}>⧉ Dupliquer</button>
                <button className="btn btn-r btn-sm" style={{flex:1}} onClick={()=>aDel(aSel)}>✕ Supprimer</button>
              </div>
            </div>
          )}

          {/* ── MOBILE OTHER TABS ── */}
          {['slide','global','brand','tpl','hist'].includes(aTab)&&(
            <div className="mob-only" style={{gridColumn:'1/-1',overflowY:'auto',paddingBottom:80}}>
              <div style={{padding:'10px 16px 0',display:'flex',gap:10,alignItems:'center',borderBottom:'1px solid var(--border)',paddingBottom:10}}>
                <div style={{width:56,height:56,borderRadius:8,overflow:'hidden',border:'1px solid var(--border)',flexShrink:0}}>
                  <ThumbCanvas data={aData(aSl,aSel)}/>
                </div>
                <div>
                  <div style={{fontSize:11,fontWeight:700,color:'var(--text2)'}}>Slide {aSel+1}/{aSlides.length}</div>
                  <div style={{fontSize:12,fontWeight:600,color:'var(--text)',lineHeight:1.4,marginTop:2}}>{(aSl.text||'').substring(0,50)}{aSl.text.length>50?'…':''}</div>
                </div>
              </div>
              <div style={{padding:'10px 16px'}}>
                <AdvPanel aTab={aTab} aSl={aSl} aSel={aSel} aSlBg={aSlBg}
                  aUpd={aUpd} aUpdBg={aUpdBg} aGlobal={aGlobal} setAdv={setAdv}
                  aBrand={aBrand} aApplyTpl={aApplyTpl} fileRef={fileRef}
                  aPlatform={aPlatform} hist={hist} dispatch={dispatch}
                  aSlides={aSlides} toast={toast}/>
              </div>
            </div>
          )}

          {/* MOBILE BOTTOM BAR */}
          <div className="bot-bar mob-only" style={{gridColumn:'1/-1'}}>
            <button className="btn btn-s btn-full" disabled={exporting}
              onClick={()=>doExport(aSlides,aData,aPlt.w,aPlt.h)}>
              {exporting?'⏳ Export…':`⬇ ZIP (${aSlides.length} slides · ${aPlt.label})`}
            </button>
          </div>

          <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={aBgImage}/>
        </div>
      )}

      {notif&&<div className="notif"><span style={{color:'var(--green)'}}>✓</span> {notif}</div>}
    </div>
  );
}

// ─── ADV PANEL (right panel content, shared mobile + desktop) ────────────────
function AdvPanel({aTab,aSl,aSel,aSlBg,aUpd,aUpdBg,aGlobal,setAdv,aBrand,aApplyTpl,fileRef,aPlatform,hist,dispatch,aSlides,toast}){
  const S=({children,t})=><div className="prop-sec">{t&&<div className="prop-sec-t">{t}</div>}{children}</div>;

  if(aTab==='slide') return(
    <div>
      <S t="Texte">
        <textarea className="ata" value={aSl.text} onChange={e=>aUpd(aSel,{text:e.target.value},'Text edit')} style={{height:80}}/>
        <div className="tog-row">
          <span className="tog-lbl">Style personnalisé</span>
          <div className={`tog ${aSl.overrideTxt?'on':''}`} onClick={()=>aUpd(aSel,{overrideTxt:!aSl.overrideTxt},'Toggle text override')}/>
        </div>
        {aSl.overrideTxt&&(
          <>
            <select className="sty" value={aSl.font} onChange={e=>aUpd(aSel,{font:e.target.value,overrideTxt:true},'Font')} style={{marginBottom:8}}>
              {FONTS.map(f=><option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
            <div className="range-row">
              <input type="range" min="30" max="160" value={aSl.fontSize} onChange={e=>aUpd(aSel,{fontSize:+e.target.value,overrideTxt:true},'Font size')}/>
              <span className="rv">{aSl.fontSize}</span>
            </div>
            <div className="prop-row">
              <span className="prop-lbl">Couleur texte</span>
              <input type="color" value={aSl.textColor} onChange={e=>aUpd(aSel,{textColor:e.target.value,overrideTxt:true},'Text color')}/>
            </div>
          </>
        )}
      </S>
      <S t="Fond">
        <div className="tog-row">
          <span className="tog-lbl">Fond personnalisé</span>
          <div className={`tog ${aSl.overrideBg?'on':''}`} onClick={()=>aUpd(aSel,{overrideBg:!aSl.overrideBg},'Toggle BG')}/>
        </div>
        {aSl.overrideBg&&(
          <>
            <div className="bg-tabs">
              {['color','gradient','image'].map(t=>(
                <button key={t} className={`bg-tab ${aSlBg.type===t?'on':''}`} onClick={()=>aUpdBg(aSel,{type:t})}>
                  {t==='color'?'Uni':t==='gradient'?'Dégradé':'Image'}
                </button>
              ))}
            </div>
            {aSlBg.type==='color'&&<div className="prop-row"><span className="prop-lbl">Couleur</span><input type="color" value={aSlBg.color||'#000'} onChange={e=>aUpdBg(aSel,{color:e.target.value})}/></div>}
            {aSlBg.type==='gradient'&&(
              <div>
                <div className="grad-row">
                  <span className="prop-lbl" style={{minWidth:20}}>C1</span>
                  <input type="color" value={(aSlBg.stops||['#000','#222'])[0]} onChange={e=>{const s=[...(aSlBg.stops||['#000','#222'])];s[0]=e.target.value;aUpdBg(aSel,{stops:s});}}/>
                  <span className="prop-lbl" style={{minWidth:20}}>C2</span>
                  <input type="color" value={(aSlBg.stops||['#000','#222'])[1]} onChange={e=>{const s=[...(aSlBg.stops||['#000','#222'])];s[1]=e.target.value;aUpdBg(aSel,{stops:s});}}/>
                </div>
                <div className="range-row">
                  <input type="range" min="0" max="360" value={aSlBg.angle||135} onChange={e=>aUpdBg(aSel,{angle:+e.target.value})}/>
                  <span className="rv">{aSlBg.angle||135}°</span>
                </div>
              </div>
            )}
            {aSlBg.type==='image'&&(
              <div>
                <button className="up-btn" onClick={()=>fileRef.current?.click()}>📁 Choisir une image</button>
                {aSlBg.imageEl&&(
                  <>
                    <div className="range-row" style={{marginBottom:6}}><span className="prop-lbl" style={{minWidth:36}}>Flou</span><input type="range" min="0" max="20" value={aSlBg.blur||0} onChange={e=>aUpdBg(aSel,{blur:+e.target.value})}/><span className="rv">{aSlBg.blur||0}px</span></div>
                    <div className="range-row"><span className="prop-lbl" style={{minWidth:36}}>Ombre</span><input type="range" min="0" max="1" step="0.05" value={aSlBg.overlay||0} onChange={e=>aUpdBg(aSel,{overlay:+e.target.value})}/><span className="rv">{Math.round((aSlBg.overlay||0)*100)}%</span></div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </S>
      <S t="Actions slide">
        <div style={{display:'flex',gap:6}}>
          <button className="btn btn-o btn-sm" style={{flex:1}} onClick={()=>{const d={...aSl,id:`s${Date.now()}`};setAdv(s=>{const n=[...s.slides];n.splice(aSel+1,0,d);return{...s,slides:n,sel:aSel+1};},'Duplicate slide');toast('Dupliquée ✓');}}>⧉ Dupliquer</button>
          <button className="btn btn-r btn-sm" style={{flex:1}} onClick={()=>{if(aSlides.length<=1){toast('Impossible');return;}setAdv(s=>({...s,slides:s.slides.filter((_,i)=>i!==aSel),sel:Math.max(0,aSel-1)}),'Delete slide');}}>✕ Supprimer</button>
        </div>
      </S>
    </div>
  );

  if(aTab==='global') return(
    <div>
      <S t="Plateforme">
        <div className="plat-grid">
          {Object.entries(PLATFORMS).map(([k,v])=>(
            <button key={k} className={`plat-btn ${aPlatform===k?'on':''}`} onClick={()=>setAdv(s=>({...s,platform:k}),'Platform')}>
              <span className="plat-icon">{v.icon}</span>{v.label}
            </button>
          ))}
        </div>
      </S>
      <S t="Style global">
        <select className="sty" value={aGlobal.font} onChange={e=>setAdv(s=>({...s,global:{...s.global,font:e.target.value}}),'Global font')} style={{marginBottom:8}}>
          {FONTS.map(f=><option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
        <div className="range-row" style={{marginBottom:8}}>
          <input type="range" min="30" max="160" value={aGlobal.fontSize} onChange={e=>setAdv(s=>({...s,global:{...s.global,fontSize:+e.target.value}}),'Global size')}/>
          <span className="rv">{aGlobal.fontSize}</span>
        </div>
        <div className="prop-row"><span className="prop-lbl">Couleur texte</span><input type="color" value={aGlobal.textColor} onChange={e=>setAdv(s=>({...s,global:{...s.global,textColor:e.target.value}}),'Global text color')}/></div>
      </S>
      <S t="Fond global">
        <div className="bg-tabs">
          {['color','gradient'].map(t=>(
            <button key={t} className={`bg-tab ${aGlobal.bg.type===t?'on':''}`} onClick={()=>setAdv(s=>({...s,global:{...s.global,bg:{...s.global.bg,type:t}}}),'Global BG type')}>
              {t==='color'?'Uni':'Dégradé'}
            </button>
          ))}
        </div>
        {aGlobal.bg.type==='color'&&<div className="prop-row"><span className="prop-lbl">Couleur</span><input type="color" value={aGlobal.bg.color||'#000'} onChange={e=>setAdv(s=>({...s,global:{...s.global,bg:{...s.global.bg,color:e.target.value}}}),'Global BG color')}/></div>}
        {aGlobal.bg.type==='gradient'&&(
          <div className="grad-row">
            <span className="prop-lbl">C1</span>
            <input type="color" value={(aGlobal.bg.stops||['#000','#222'])[0]} onChange={e=>{const ss=[...(aGlobal.bg.stops||['#000','#222'])];ss[0]=e.target.value;setAdv(s=>({...s,global:{...s.global,bg:{...s.global.bg,stops:ss}}}),'Global gradient');}}/>
            <span className="prop-lbl">C2</span>
            <input type="color" value={(aGlobal.bg.stops||['#000','#222'])[1]} onChange={e=>{const ss=[...(aGlobal.bg.stops||['#000','#222'])];ss[1]=e.target.value;setAdv(s=>({...s,global:{...s.global,bg:{...s.global.bg,stops:ss}}}),'Global gradient');}}/>
          </div>
        )}
      </S>
      <S>
        <button className="btn btn-o btn-full btn-sm" onClick={()=>{setAdv(s=>({...s,slides:s.slides.map(sl=>({...sl,overrideBg:false,overrideTxt:false}))}),'Reset overrides');toast('Styles réinitialisés ✓');}}>↺ Réinitialiser au global</button>
      </S>
    </div>
  );

  if(aTab==='brand') return(
    <div>
      <S t="Signature">
        <div className="tog-row"><span className="tog-lbl">Afficher</span><div className={`tog ${aBrand.showSig?'on':''}`} onClick={()=>setAdv(s=>({...s,brand:{...s.brand,showSig:!s.brand.showSig}}),'Toggle sig')}/></div>
        <input className="ti" type="text" value={aBrand.signature} onChange={e=>setAdv(s=>({...s,brand:{...s.brand,signature:e.target.value}}),'Signature')} placeholder="@tonpseudo"/>
      </S>
      <S t="Numérotation">
        <div className="tog-row"><span className="tog-lbl">Afficher</span><div className={`tog ${aBrand.showNum?'on':''}`} onClick={()=>setAdv(s=>({...s,brand:{...s.brand,showNum:!s.brand.showNum}}),'Toggle num')}/></div>
        <div style={{display:'flex',gap:4,flexWrap:'wrap',marginTop:4}}>
          {['{n}/{total}','Slide {n}','{n}','Part {n}'].map(fmt=>(
            <button key={fmt} className={`btn btn-sm ${aBrand.numFmt===fmt?'btn-s':'btn-o'}`}
              onClick={()=>setAdv(s=>({...s,brand:{...s.brand,numFmt:fmt}}),'Num format')}>{fmt}</button>
          ))}
        </div>
      </S>
    </div>
  );

  if(aTab==='tpl') return(
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

  if(aTab==='hist') return(
    <div>
      <S t={`Historique · ${hist.past.length} action(s)`}>
        <div className="hist-item cur">
          <div className="hist-dot"/><span className="hist-lbl">● État actuel</span>
        </div>
        {[...hist.past].reverse().map((entry,i)=>(
          <div key={i} className="hist-item" onClick={()=>{for(let j=0;j<=i;j++)dispatch({type:'UNDO'});}}>
            <div className="hist-dot"/>
            <span className="hist-lbl">{hist.past.length-i}. {entry.label}</span>
          </div>
        ))}
        {hist.past.length===0&&<div style={{fontSize:12,color:'var(--text3)',fontWeight:600,paddingTop:4}}>Aucune action encore</div>}
        {hist.future.length>0&&(
          <div style={{marginTop:8,paddingTop:8,borderTop:'1px solid var(--border)'}}>
            <div style={{fontSize:10,fontWeight:700,color:'var(--text3)',letterSpacing:1,marginBottom:6}}>ANNULÉ ({hist.future.length})</div>
            {hist.future.map((entry,i)=>(
              <div key={i} className="hist-item" style={{opacity:.4}} onClick={()=>dispatch({type:'REDO'})}>
                <div className="hist-dot"/><span className="hist-lbl">{entry.label}</span>
              </div>
            ))}
          </div>
        )}
      </S>
      <S>
        <div style={{display:'flex',gap:6}}>
          <button className="btn btn-o btn-sm" style={{flex:1}} onClick={()=>dispatch({type:'UNDO'})} disabled={!hist.past.length}>↩ Annuler</button>
          <button className="btn btn-o btn-sm" style={{flex:1}} onClick={()=>dispatch({type:'REDO'})} disabled={!hist.future.length}>↪ Rétablir</button>
        </div>
      </S>
      {showPaywall && <PaywallModal user={user} onClose={closePaywall}/>}
    </div>
  );

  return null;
}
