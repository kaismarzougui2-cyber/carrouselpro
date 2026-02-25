import React, { useState, useRef, useEffect, useCallback, useReducer } from 'react';

// ─── FONTS ───────────────────────────────────────────────────────────────────
const GoogleFonts = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Montserrat:wght@700;900&family=Anton&family=Oswald:wght@600;700&family=Roboto+Condensed:wght@700&family=Playfair+Display:wght@700;900&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #080808;
      --bg2: #111111;
      --bg3: #181818;
      --bg4: #1f1f1f;
      --border: #252525;
      --border2: #333;
      --text: #efefef;
      --text2: #777;
      --text3: #444;
      --accent: #fff;
      --accent-dim: rgba(255,255,255,0.08);
      --red: #ff4444;
      --green: #4ade80;
      --blue: #60a5fa;
      --yellow: #facc15;
    }

    body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; min-height: 100vh; }

    ::-webkit-scrollbar { width: 3px; height: 3px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }

    /* ── NAV ── */
    .nav {
      position: sticky; top: 0; z-index: 200;
      height: 56px; padding: 0 20px;
      display: flex; align-items: center; justify-content: space-between;
      background: rgba(8,8,8,0.92); backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border);
    }
    .nav-logo {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 22px; letter-spacing: 4px; color: var(--text);
      display: flex; align-items: center; gap: 8px;
    }
    .logo-mark {
      width: 26px; height: 26px; background: var(--accent);
      border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
    }
    .logo-mark span { font-size: 13px; color: #000; font-weight: 900; }
    .nav-center {
      display: flex; align-items: center; gap: 2px;
      background: var(--bg3); border: 1px solid var(--border); border-radius: 10px;
      padding: 3px;
    }
    .nav-tab {
      padding: 6px 16px; border-radius: 7px; font-size: 12px; font-weight: 600;
      cursor: pointer; border: none; background: transparent; color: var(--text2);
      transition: all .2s; letter-spacing: .3px;
    }
    .nav-tab.active { background: var(--bg4); color: var(--text); border: 1px solid var(--border2); }
    .nav-right { display: flex; align-items: center; gap: 8px; }

    /* ── BUTTONS ── */
    .btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; border: none; transition: all .2s; letter-spacing: .3px; white-space: nowrap; }
    .btn-ghost { background: transparent; color: var(--text2); border: 1px solid var(--border); }
    .btn-ghost:hover { background: var(--bg3); color: var(--text); border-color: var(--border2); }
    .btn-white { background: var(--accent); color: #000; }
    .btn-white:hover { opacity: .85; transform: translateY(-1px); }
    .btn-white:disabled { opacity: .3; cursor: not-allowed; transform: none; }
    .btn-danger { background: transparent; color: var(--red); border: 1px solid rgba(255,68,68,.25); }
    .btn-danger:hover { background: rgba(255,68,68,.1); }
    .btn-sm { padding: 5px 10px; font-size: 11px; }

    /* ── LAYOUT ── */
    .app-body {
      display: grid;
      grid-template-columns: 300px 1fr 280px;
      height: calc(100vh - 56px);
      overflow: hidden;
    }

    /* ── SIDEBAR LEFT ── */
    .sidebar-left {
      border-right: 1px solid var(--border);
      overflow-y: auto; overflow-x: hidden;
      background: var(--bg2);
      display: flex; flex-direction: column;
    }
    .sidebar-section { padding: 16px; border-bottom: 1px solid var(--border); }
    .sidebar-section-title {
      font-size: 9px; font-weight: 700; letter-spacing: 2.5px;
      text-transform: uppercase; color: var(--text3); margin-bottom: 12px;
      display: flex; align-items: center; justify-content: space-between;
    }

    /* Slide list */
    .slide-list { display: flex; flex-direction: column; gap: 8px; padding: 12px; flex: 1; overflow-y: auto; }
    .slide-list-item {
      position: relative; border-radius: 10px; overflow: hidden;
      border: 2px solid transparent; cursor: pointer;
      transition: all .2s; aspect-ratio: 1;
      background: var(--bg3);
    }
    .slide-list-item:hover { border-color: var(--border2); }
    .slide-list-item.selected { border-color: var(--accent); }
    .slide-list-item canvas { width: 100%; height: 100%; display: block; }
    .slide-list-num {
      position: absolute; top: 6px; left: 6px;
      background: rgba(0,0,0,.75); color: #fff;
      font-size: 9px; font-weight: 800; letter-spacing: 1.5px;
      padding: 2px 7px; border-radius: 3px; backdrop-filter: blur(4px);
    }
    .slide-list-actions {
      position: absolute; top: 6px; right: 6px;
      display: flex; gap: 4px; opacity: 0; transition: opacity .2s;
    }
    .slide-list-item:hover .slide-list-actions { opacity: 1; }
    .slide-list-action-btn {
      width: 22px; height: 22px; border-radius: 5px;
      background: rgba(0,0,0,.8); border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-size: 11px; transition: background .2s;
    }
    .slide-list-action-btn:hover { background: rgba(255,255,255,.2); }
    .add-slide-btn {
      margin: 12px; padding: 10px;
      border: 1px dashed var(--border2); border-radius: 10px;
      background: transparent; color: var(--text2);
      font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
      cursor: pointer; transition: all .2s;
      display: flex; align-items: center; justify-content: center; gap: 6px;
    }
    .add-slide-btn:hover { border-color: var(--accent); color: var(--text); background: var(--accent-dim); }

    /* ── CANVAS AREA ── */
    .canvas-area {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      background: var(--bg); overflow: hidden; position: relative;
      padding: 32px;
    }
    .canvas-wrapper {
      position: relative;
      box-shadow: 0 0 0 1px var(--border), 0 40px 80px rgba(0,0,0,.8);
      border-radius: 4px; overflow: hidden;
    }
    .canvas-wrapper canvas { display: block; }
    .canvas-label {
      position: absolute; bottom: -32px; left: 50%; transform: translateX(-50%);
      font-size: 10px; font-weight: 600; letter-spacing: 2px; color: var(--text3);
      text-transform: uppercase; white-space: nowrap;
    }
    .canvas-nav {
      position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
      display: flex; align-items: center; gap: 12px;
      background: rgba(8,8,8,.9); backdrop-filter: blur(12px);
      border: 1px solid var(--border); border-radius: 20px; padding: 6px 14px;
    }
    .canvas-nav-btn {
      background: transparent; border: none; color: var(--text2);
      cursor: pointer; padding: 2px; transition: color .2s; display: flex; align-items: center;
    }
    .canvas-nav-btn:hover { color: var(--text); }
    .canvas-nav-num { font-size: 12px; font-weight: 600; color: var(--text2); min-width: 40px; text-align: center; }

    /* Platform size badge */
    .platform-badge {
      position: absolute; top: 12px; right: 12px;
      background: rgba(8,8,8,.85); border: 1px solid var(--border);
      border-radius: 6px; padding: 4px 10px;
      font-size: 10px; font-weight: 700; color: var(--text2);
      letter-spacing: 1px; backdrop-filter: blur(8px);
    }

    /* ── SIDEBAR RIGHT ── */
    .sidebar-right {
      border-left: 1px solid var(--border);
      overflow-y: auto; background: var(--bg2);
    }
    .props-header {
      padding: 14px 16px; border-bottom: 1px solid var(--border);
      font-size: 9px; font-weight: 700; letter-spacing: 2.5px;
      text-transform: uppercase; color: var(--text3);
      display: flex; align-items: center; gap: 6px;
    }
    .prop-group { padding: 14px 16px; border-bottom: 1px solid var(--border); }
    .prop-label {
      font-size: 10px; font-weight: 600; letter-spacing: 1px;
      text-transform: uppercase; color: var(--text3); margin-bottom: 8px;
      display: block;
    }
    .prop-row { display: flex; gap: 6px; align-items: center; margin-bottom: 6px; }

    input[type=text], input[type=number], textarea, select {
      width: 100%; background: var(--bg3); border: 1px solid var(--border);
      border-radius: 7px; color: var(--text); font-family: 'DM Sans', sans-serif;
      font-size: 13px; padding: 8px 10px; outline: none;
      transition: border .15s; resize: none;
    }
    input[type=text]:focus, input[type=number]:focus, textarea:focus, select:focus {
      border-color: var(--border2);
    }
    textarea { line-height: 1.5; }
    select { appearance: none; cursor: pointer; }
    input[type=color] {
      width: 32px; height: 32px; padding: 2px; border-radius: 6px;
      border: 1px solid var(--border); background: var(--bg3); cursor: pointer; flex-shrink: 0;
    }

    /* Range slider */
    .range-wrap { display: flex; align-items: center; gap: 8px; }
    .range-val {
      font-size: 11px; font-weight: 600; color: var(--text2);
      background: var(--bg3); padding: 2px 7px; border-radius: 4px;
      min-width: 36px; text-align: center;
    }
    input[type=range] {
      flex: 1; appearance: none; height: 3px; background: var(--border);
      border-radius: 3px; border: none; padding: 0; cursor: pointer; outline: none;
    }
    input[type=range]::-webkit-slider-thumb {
      appearance: none; width: 14px; height: 14px;
      border-radius: 50%; background: var(--accent); cursor: pointer;
    }

    /* Toggle */
    .toggle-row {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 8px;
    }
    .toggle-label { font-size: 12px; font-weight: 500; color: var(--text2); }
    .toggle {
      width: 32px; height: 18px; background: var(--bg3);
      border-radius: 9px; border: 1px solid var(--border);
      cursor: pointer; position: relative; transition: background .2s;
      flex-shrink: 0;
    }
    .toggle.on { background: var(--accent); border-color: var(--accent); }
    .toggle::after {
      content: ''; position: absolute; top: 2px; left: 2px;
      width: 12px; height: 12px; border-radius: 50%; background: var(--text3);
      transition: left .2s, background .2s;
    }
    .toggle.on::after { left: 16px; background: #000; }

    /* Bg type tabs */
    .bg-tabs { display: flex; gap: 4px; margin-bottom: 10px; }
    .bg-tab {
      flex: 1; padding: 6px; border-radius: 6px;
      font-size: 10px; font-weight: 700; letter-spacing: .5px;
      cursor: pointer; border: 1px solid var(--border);
      background: transparent; color: var(--text3);
      transition: all .15s; text-align: center;
    }
    .bg-tab.active { background: var(--bg4); color: var(--text); border-color: var(--border2); }

    /* Gradient stops */
    .grad-stops { display: flex; gap: 6px; align-items: center; }

    /* Template cards */
    .template-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .template-card {
      aspect-ratio: 1; border-radius: 8px; cursor: pointer;
      border: 2px solid transparent; overflow: hidden;
      transition: all .2s; position: relative;
    }
    .template-card:hover { border-color: var(--border2); transform: scale(1.02); }
    .template-card canvas { width: 100%; height: 100%; display: block; }
    .template-name {
      position: absolute; bottom: 0; left: 0; right: 0;
      background: linear-gradient(transparent, rgba(0,0,0,.8));
      color: #fff; font-size: 9px; font-weight: 700;
      letter-spacing: 1px; padding: 12px 6px 5px; text-align: center;
    }

    /* Platform selector */
    .platform-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
    .platform-btn {
      padding: 8px 4px; border-radius: 7px; font-size: 10px; font-weight: 700;
      letter-spacing: .5px; cursor: pointer; border: 1px solid var(--border);
      background: transparent; color: var(--text3); text-align: center;
      transition: all .15s;
    }
    .platform-btn.active { background: var(--bg4); color: var(--text); border-color: var(--border2); }
    .platform-btn .platform-icon { font-size: 16px; display: block; margin-bottom: 3px; }

    /* Tabs in right panel */
    .panel-tabs { display: flex; border-bottom: 1px solid var(--border); }
    .panel-tab {
      flex: 1; padding: 10px; font-size: 11px; font-weight: 600;
      letter-spacing: .5px; cursor: pointer; border: none;
      background: transparent; color: var(--text3); transition: all .15s;
      border-bottom: 2px solid transparent;
    }
    .panel-tab.active { color: var(--text); border-bottom-color: var(--accent); }

    /* History list */
    .history-item {
      display: flex; align-items: center; gap: 8px;
      padding: 7px 16px; font-size: 12px; color: var(--text2);
      border-bottom: 1px solid var(--border); cursor: pointer; transition: background .15s;
    }
    .history-item:hover { background: var(--bg3); color: var(--text); }
    .history-item.current { color: var(--accent); }
    .history-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--border2); flex-shrink: 0; }
    .history-item.current .history-dot { background: var(--accent); }

    /* Notification */
    .notif {
      position: fixed; bottom: 20px; right: 20px; z-index: 999;
      background: var(--bg3); border: 1px solid var(--border2);
      border-radius: 10px; padding: 12px 16px;
      font-size: 12px; font-weight: 600; color: var(--text);
      box-shadow: 0 8px 32px rgba(0,0,0,.5);
      display: flex; align-items: center; gap: 8px;
      animation: slideUp .3s ease;
    }
    @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    /* Divider */
    .divider { height: 1px; background: var(--border); margin: 4px 0; }

    /* Inherited badge */
    .inherited-badge {
      font-size: 9px; font-weight: 700; letter-spacing: 1px;
      background: var(--accent-dim); color: var(--text3);
      padding: 2px 6px; border-radius: 3px;
    }
  `}} />
);

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const PLATFORMS = {
  instagram: { label: 'Instagram', icon: '📸', size: 1080, ratio: '1:1' },
  linkedin:  { label: 'LinkedIn',  icon: '💼', size: 1080, ratio: '1:1' },
  tiktok:    { label: 'TikTok',    icon: '🎵', size: 1080, ratio: '9:16', height: 1920 },
};

const FONTS = [
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Anton', value: 'Anton' },
  { name: 'Oswald', value: 'Oswald' },
  { name: 'Roboto Condensed', value: 'Roboto Condensed' },
  { name: 'Playfair Display', value: 'Playfair Display' },
  { name: 'Bebas Neue', value: 'Bebas Neue' },
];

const TEMPLATES = [
  {
    name: 'DARK PRO',
    bg: { type: 'color', color: '#000000' },
    textColor: '#ffffff', font: 'Montserrat', fontSize: 88,
  },
  {
    name: 'WHITE',
    bg: { type: 'color', color: '#ffffff' },
    textColor: '#000000', font: 'Montserrat', fontSize: 88,
  },
  {
    name: 'GRADIENT',
    bg: { type: 'gradient', stops: ['#0a0a0a', '#1a1a2e'], angle: 135 },
    textColor: '#ffffff', font: 'Anton', fontSize: 95,
  },
  {
    name: 'EDITORIAL',
    bg: { type: 'color', color: '#f5f0e8' },
    textColor: '#1a1a1a', font: 'Playfair Display', fontSize: 80,
  },
  {
    name: 'NIGHT',
    bg: { type: 'gradient', stops: ['#0f0c29', '#302b63'], angle: 160 },
    textColor: '#e0d7ff', font: 'Bebas Neue', fontSize: 100,
  },
  {
    name: 'BOLD RED',
    bg: { type: 'color', color: '#cc0000' },
    textColor: '#ffffff', font: 'Anton', fontSize: 95,
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function createSlide(text = '', overrides = {}) {
  return {
    id: `slide_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
    text,
    bg: { type: 'color', color: '#000000' },
    textColor: '#ffffff',
    font: 'Montserrat',
    fontSize: 88,
    textAlign: 'center',
    // Per-slide overrides (null = use global)
    overrideBg: false,
    overrideText: false,
    ...overrides,
  };
}

function applyTemplate(slide, tpl) {
  return {
    ...slide,
    bg: { ...tpl.bg },
    textColor: tpl.textColor,
    font: tpl.font,
    fontSize: tpl.fontSize,
    overrideBg: true,
    overrideText: true,
  };
}

// ─── CANVAS DRAW ─────────────────────────────────────────────────────────────

function drawSlide(canvas, slide, global, branding, platform, index, total) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  const bg = slide.overrideBg ? slide.bg : global.bg;
  const textColor = slide.overrideText ? slide.textColor : global.textColor;
  const font = slide.overrideText ? slide.font : global.font;
  const fontSize = slide.overrideText ? slide.fontSize : global.fontSize;

  // Background
  if (bg.type === 'color') {
    ctx.fillStyle = bg.color;
    ctx.fillRect(0, 0, W, H);
  } else if (bg.type === 'gradient') {
    const angle = (bg.angle || 135) * Math.PI / 180;
    const x1 = W/2 - Math.cos(angle) * W/2;
    const y1 = H/2 - Math.sin(angle) * H/2;
    const x2 = W/2 + Math.cos(angle) * W/2;
    const y2 = H/2 + Math.sin(angle) * H/2;
    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    (bg.stops || ['#000','#222']).forEach((c, i, a) => grad.addColorStop(i/(a.length-1), c));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  } else if (bg.type === 'image' && bg.imageData) {
    const img = new Image();
    img.src = bg.imageData;
    try {
      ctx.drawImage(img, 0, 0, W, H);
    } catch(e) {
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, W, H);
    }
    if (bg.blur > 0) {
      ctx.filter = `blur(${bg.blur}px)`;
      ctx.drawImage(canvas, 0, 0);
      ctx.filter = 'none';
    }
    if (bg.overlay > 0) {
      ctx.fillStyle = `rgba(0,0,0,${bg.overlay})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  // Subtle inner border
  ctx.strokeStyle = 'rgba(128,128,128,0.08)';
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, W-72, H-72);

  // ── BRANDING ELEMENTS ──
  const sigY = H - 70;

  if (branding.showSignature && branding.signature) {
    ctx.save();
    ctx.globalAlpha = branding.signatureOpacity;
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.font = `600 ${Math.round(H*0.026)}px 'DM Sans', sans-serif`;
    ctx.fillText(branding.signature.toUpperCase(), W/2, sigY + 10);
    ctx.strokeStyle = 'rgba(128,128,128,0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W/2 - 90, sigY - 14);
    ctx.lineTo(W/2 + 90, sigY - 14);
    ctx.stroke();
    ctx.restore();
  }

  if (branding.showSlideNum) {
    const numStr = branding.slideNumFormat
      .replace('{n}', index + 1)
      .replace('{total}', total);
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = textColor;
    ctx.textAlign = 'right';
    ctx.font = `500 ${Math.round(H*0.022)}px 'DM Sans', sans-serif`;
    ctx.fillText(numStr, W - 52, 70);
    ctx.restore();
  }

  // ── MAIN TEXT ──
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${fontSize}px '${font}', sans-serif`;

  const upper = slide.text.toUpperCase();
  const words = upper.split(' ');
  const maxW = W * 0.84;
  const lh = fontSize * 1.18;
  let lines = [], cur = '';

  words.forEach(w => {
    const test = cur + w + ' ';
    if (ctx.measureText(test).width > maxW && cur) { lines.push(cur.trim()); cur = w + ' '; }
    else cur = test;
  });
  if (cur.trim()) lines.push(cur.trim());

  const totalTH = lines.length * lh;
  let startY = (H - totalTH) / 2 + lh / 2;

  lines.forEach((line, i) => {
    ctx.fillText(line, W/2, startY + i * lh);
  });
}

// ─── THUMBNAIL CANVAS ────────────────────────────────────────────────────────

const ThumbnailCanvas = React.memo(({ slide, global, branding, platform, index, total, size = 240 }) => {
  const ref = useRef(null);
  const plt = PLATFORMS[platform] || PLATFORMS.instagram;
  const W = plt.size;
  const H = plt.height || plt.size;

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    c.width = W;
    c.height = H;
    drawSlide(c, slide, global, branding, platform, index, total);
  });

  return <canvas ref={ref} style={{ width: '100%', height: '100%', display: 'block' }} />;
});

// ─── MAIN CANVAS ─────────────────────────────────────────────────────────────

const MainCanvas = React.memo(({ slide, global, branding, platform, index, total, onCanvasReady }) => {
  const ref = useRef(null);
  const plt = PLATFORMS[platform] || PLATFORMS.instagram;
  const W = plt.size;
  const H = plt.height || plt.size;

  const DISPLAY = Math.min(600, window.innerHeight - 180);
  const scale = DISPLAY / Math.max(W, H);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    c.width = W;
    c.height = H;
    drawSlide(c, slide, global, branding, platform, index, total);
    if (onCanvasReady) onCanvasReady(c, index);
  });

  return (
    <canvas
      ref={ref}
      style={{ width: W * scale, height: H * scale, display: 'block' }}
    />
  );
});

// ─── TEMPLATE PREVIEW ────────────────────────────────────────────────────────

const TemplatePrev = ({ tpl }) => {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    c.width = 200; c.height = 200;
    const fakeSlide = createSlide('SAMPLE', { bg: { ...tpl.bg }, textColor: tpl.textColor, font: tpl.font, fontSize: 36, overrideBg: true, overrideText: true });
    const g = { bg: tpl.bg, textColor: tpl.textColor, font: tpl.font, fontSize: 36 };
    drawSlide(c, fakeSlide, g, { showSignature: false, showSlideNum: false }, 'instagram', 0, 1);
  });
  return <canvas ref={ref} style={{ width: '100%', height: '100%' }} />;
};

// ─── HISTORY REDUCER ─────────────────────────────────────────────────────────

function historyReducer(state, action) {
  switch (action.type) {
    case 'PUSH': {
      const past = [...state.past.slice(-19), state.present];
      return { past, present: action.payload, future: [], label: action.label };
    }
    case 'UNDO': {
      if (!state.past.length) return state;
      const present = state.past[state.past.length - 1];
      return { past: state.past.slice(0,-1), present, future: [state.present, ...state.future] };
    }
    case 'REDO': {
      if (!state.future.length) return state;
      const present = state.future[0];
      return { past: [...state.past, state.present], present, future: state.future.slice(1) };
    }
    default: return state;
  }
}

// ─── APP ─────────────────────────────────────────────────────────────────────

const INIT_SLIDES = [
  createSlide("BIENVENUE SUR CARROUSELPRO"),
  createSlide("CRÉE DES CARROUSELS PROFESSIONNELS EN QUELQUES SECONDES."),
  createSlide("PERSONNALISE CHAQUE SLIDE INDÉPENDAMMENT."),
  createSlide("TÉLÉCHARGE AU FORMAT PNG EN 1 CLIC."),
];

const INIT_STATE = {
  slides: INIT_SLIDES,
  global: {
    bg: { type: 'color', color: '#000000' },
    textColor: '#ffffff',
    font: 'Montserrat',
    fontSize: 88,
  },
  branding: {
    showSignature: true,
    signature: '@tonpseudo',
    signatureOpacity: 0.6,
    showSlideNum: true,
    slideNumFormat: '{n}/{total}',
  },
  platform: 'instagram',
};

export default function App() {
  const [history, dispatch] = useReducer(historyReducer, {
    past: [], present: INIT_STATE, future: [], label: 'Initial',
  });
  const state = history.present;
  const setState = useCallback((updater, label = 'Edit') => {
    dispatch({ type: 'PUSH', payload: typeof updater === 'function' ? updater(history.present) : updater, label });
  }, [history.present]);

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [rightTab, setRightTab] = useState('slide'); // 'slide' | 'global' | 'branding' | 'history'
  const [navTab, setNavTab] = useState('editor'); // 'editor' | 'templates'
  const [notif, setNotif] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const canvasMap = useRef({});
  const fileInputRef = useRef(null);

  const { slides, global: gbl, branding, platform } = state;
  const slide = slides[selectedIdx] || slides[0];
  const total = slides.length;

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    document.body.appendChild(script);
  }, []);

  const showNotif = (msg) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 2500);
  };

  // ── Slide mutations ──

  const updateSlide = (idx, changes, label) => {
    setState(s => ({
      ...s,
      slides: s.slides.map((sl, i) => i === idx ? { ...sl, ...changes } : sl),
    }), label || 'Update slide');
  };

  const updateSlideBg = (idx, bgChanges) => {
    updateSlide(idx, { bg: { ...slides[idx].bg, ...bgChanges }, overrideBg: true }, 'Background change');
  };

  const addSlide = () => {
    const newSlide = createSlide('NOUVELLE SLIDE');
    setState(s => ({ ...s, slides: [...s.slides, newSlide] }), 'Add slide');
    setSelectedIdx(slides.length);
  };

  const duplicateSlide = (idx) => {
    const dup = { ...slides[idx], id: `slide_${Date.now()}` };
    setState(s => {
      const newSlides = [...s.slides];
      newSlides.splice(idx + 1, 0, dup);
      return { ...s, slides: newSlides };
    }, 'Duplicate slide');
    setSelectedIdx(idx + 1);
    showNotif('Slide dupliquée ✓');
  };

  const deleteSlide = (idx) => {
    if (slides.length <= 1) { showNotif('Impossible de supprimer la dernière slide'); return; }
    setState(s => ({ ...s, slides: s.slides.filter((_, i) => i !== idx) }), 'Delete slide');
    setSelectedIdx(Math.max(0, idx - 1));
  };

  const updateGlobal = (changes) => {
    setState(s => ({ ...s, global: { ...s.global, ...changes } }), 'Global style');
  };

  const updateBranding = (changes) => {
    setState(s => ({ ...s, branding: { ...s.branding, ...changes } }), 'Branding');
  };

  const applyTemplateToSlide = (idx, tpl) => {
    setState(s => ({
      ...s,
      slides: s.slides.map((sl, i) => i === idx ? applyTemplate(sl, tpl) : sl),
    }), `Template: ${tpl.name}`);
    showNotif(`Template "${tpl.name}" appliqué ✓`);
  };

  const applyTemplateToAll = (tpl) => {
    setState(s => ({
      ...s,
      slides: s.slides.map(sl => applyTemplate(sl, tpl)),
      global: { ...s.global, bg: tpl.bg, textColor: tpl.textColor, font: tpl.font, fontSize: tpl.fontSize },
    }), `Template global: ${tpl.name}`);
    showNotif(`Template "${tpl.name}" appliqué à tout le carrousel ✓`);
  };

  // Smart split from raw text
  const handleSmartSplit = (rawText) => {
    const text = rawText.replace(/\n\n+/g, '\n').replace(/\n/g, ' ').trim();
    const limit = 200;
    let chunks = [], rem = text;
    while (rem.length > 0) {
      if (rem.length <= limit) { chunks.push(rem); break; }
      let si = -1;
      const look = rem.substring(0, limit + 20);
      const pm = look.match(/[.!?](?!.*[.!?])/);
      if (pm && pm.index > limit / 2) si = pm.index + 1;
      else si = rem.lastIndexOf(' ', limit);
      if (si === -1) si = limit;
      chunks.push(rem.substring(0, si).trim());
      rem = rem.substring(si).trim();
    }
    const newSlides = chunks.map(c => createSlide(c));
    setState(s => ({ ...s, slides: newSlides }), 'Smart split');
    setSelectedIdx(0);
    showNotif(`${newSlides.length} slides créées ✓`);
  };

  const [splitText, setSplitText] = useState('');
  const [showSplitModal, setShowSplitModal] = useState(false);

  // Image upload for bg
  const handleBgImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateSlideBg(selectedIdx, { type: 'image', imageData: ev.target.result, blur: 0, overlay: 0.3 });
      showNotif('Image de fond appliquée ✓');
    };
    reader.readAsDataURL(file);
  };

  // Export ZIP
  const downloadZip = async () => {
    if (typeof window.JSZip === 'undefined') { showNotif('JSZip loading…'); return; }
    setIsExporting(true);
    try {
      const zip = new window.JSZip();
      const folder = zip.folder('carrouselpro');
      const plt = PLATFORMS[platform] || PLATFORMS.instagram;
      const promises = slides.map((sl, i) =>
        new Promise(resolve => {
          const c = document.createElement('canvas');
          c.width = plt.size;
          c.height = plt.height || plt.size;
          drawSlide(c, sl, gbl, branding, platform, i, total);
          c.toBlob(b => { folder.file(`slide-${i+1}.png`, b); resolve(); }, 'image/png');
        })
      );
      await Promise.all(promises);
      const content = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(content);
      a.download = `carrousel-${platform}-${Date.now()}.zip`;
      a.click();
      showNotif(`${slides.length} images exportées ✓`);
    } catch(e) { console.error(e); }
    finally { setIsExporting(false); }
  };

  // ── RENDER ──

  const bgType = slide.overrideBg ? slide.bg.type : gbl.bg.type;
  const slideBg = slide.overrideBg ? slide.bg : gbl.bg;
  const isTextOverride = slide.overrideText;

  return (
    <div>
      <GoogleFonts />

      {/* ── NAV ── */}
      <nav className="nav">
        <div className="nav-logo">
          <div className="logo-mark"><span>C</span></div>
          CarrouselPro
        </div>

        <div className="nav-center">
          {['editor','templates'].map(t => (
            <button key={t} className={`nav-tab ${navTab===t?'active':''}`} onClick={() => setNavTab(t)}>
              {t === 'editor' ? '⚡ Éditeur' : '🎨 Templates'}
            </button>
          ))}
        </div>

        <div className="nav-right">
          <button className="btn btn-ghost btn-sm" onClick={() => dispatch({type:'UNDO'})} disabled={!history.past.length} title="Undo (Ctrl+Z)">↩ Undo</button>
          <button className="btn btn-ghost btn-sm" onClick={() => dispatch({type:'REDO'})} disabled={!history.future.length} title="Redo">↪ Redo</button>
          <button className="btn btn-white" onClick={downloadZip} disabled={isExporting}>
            {isExporting ? '⏳ Export…' : `⬇ ZIP (${slides.length})`}
          </button>
        </div>
      </nav>

      {/* ── EDITOR TAB ── */}
      {navTab === 'editor' && (
        <div className="app-body">

          {/* ── LEFT: Slide list ── */}
          <div className="sidebar-left">
            <div className="sidebar-section">
              <div className="sidebar-section-title">
                Slides
                <span style={{color:'var(--text2)',fontSize:10,fontWeight:600}}>{slides.length} slides</span>
              </div>
              {/* Smart split input */}
              {showSplitModal ? (
                <div>
                  <textarea
                    value={splitText}
                    onChange={e => setSplitText(e.target.value)}
                    placeholder="Colle ton long texte ici…"
                    style={{height:100,marginBottom:8,fontSize:12}}
                  />
                  <div style={{display:'flex',gap:6}}>
                    <button className="btn btn-white btn-sm" style={{flex:1}} onClick={() => { handleSmartSplit(splitText); setSplitText(''); setShowSplitModal(false); }}>✂ Découper</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setShowSplitModal(false)}>✕</button>
                  </div>
                </div>
              ) : (
                <button className="btn btn-ghost btn-sm" style={{width:'100%'}} onClick={() => setShowSplitModal(true)}>✂ Smart Split</button>
              )}
            </div>

            <div className="slide-list">
              {slides.map((sl, i) => (
                <div
                  key={sl.id}
                  className={`slide-list-item ${i === selectedIdx ? 'selected' : ''}`}
                  onClick={() => setSelectedIdx(i)}
                >
                  <ThumbnailCanvas slide={sl} global={gbl} branding={branding} platform={platform} index={i} total={total} />
                  <div className="slide-list-num">{String(i+1).padStart(2,'0')}</div>
                  <div className="slide-list-actions">
                    <button className="slide-list-action-btn" title="Dupliquer" onClick={e => { e.stopPropagation(); duplicateSlide(i); }}>⧉</button>
                    <button className="slide-list-action-btn" title="Supprimer" onClick={e => { e.stopPropagation(); deleteSlide(i); }} style={{color:'#ff6666'}}>✕</button>
                  </div>
                </div>
              ))}
            </div>

            <button className="add-slide-btn" onClick={addSlide}>+ Ajouter une slide</button>
          </div>

          {/* ── CENTER: Canvas ── */}
          <div className="canvas-area">
            <div className="platform-badge">{PLATFORMS[platform]?.icon} {PLATFORMS[platform]?.label} · {PLATFORMS[platform]?.size}×{PLATFORMS[platform]?.height || PLATFORMS[platform]?.size}</div>
            <div className="canvas-wrapper">
              <MainCanvas
                slide={slide}
                global={gbl}
                branding={branding}
                platform={platform}
                index={selectedIdx}
                total={total}
                onCanvasReady={(c, i) => canvasMap.current[i] = c}
              />
              <div className="canvas-label">SLIDE {selectedIdx+1} / {total}</div>
            </div>
            <div className="canvas-nav">
              <button className="canvas-nav-btn" onClick={() => setSelectedIdx(Math.max(0, selectedIdx-1))}>◀</button>
              <span className="canvas-nav-num">{selectedIdx+1} / {total}</span>
              <button className="canvas-nav-btn" onClick={() => setSelectedIdx(Math.min(total-1, selectedIdx+1))}>▶</button>
            </div>
          </div>

          {/* ── RIGHT: Properties ── */}
          <div className="sidebar-right">
            <div className="panel-tabs">
              {[['slide','Slide'],['global','Global'],['branding','Branding'],['history','Historique']].map(([k,l]) => (
                <button key={k} className={`panel-tab ${rightTab===k?'active':''}`} onClick={() => setRightTab(k)}>{l}</button>
              ))}
            </div>

            {/* ─ SLIDE TAB ─ */}
            {rightTab === 'slide' && (
              <div>
                {/* Platform */}
                <div className="prop-group">
                  <span className="prop-label">Plateforme</span>
                  <div className="platform-grid">
                    {Object.entries(PLATFORMS).map(([k,v]) => (
                      <button key={k} className={`platform-btn ${platform===k?'active':''}`}
                        onClick={() => setState(s => ({...s, platform:k}),'Platform')}>
                        <span className="platform-icon">{v.icon}</span>{v.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text */}
                <div className="prop-group">
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                    <span className="prop-label" style={{margin:0}}>Texte</span>
                    {isTextOverride && <span className="inherited-badge">CUSTOM</span>}
                  </div>
                  <textarea
                    value={slide.text}
                    onChange={e => updateSlide(selectedIdx, {text: e.target.value}, 'Text edit')}
                    style={{height:90,marginBottom:8}}
                  />
                  <div className="toggle-row">
                    <span className="toggle-label">Style personnalisé</span>
                    <div className={`toggle ${isTextOverride?'on':''}`} onClick={() => updateSlide(selectedIdx,{overrideText:!isTextOverride},'Toggle text override')} />
                  </div>
                  {isTextOverride && (
                    <>
                      <select value={slide.font} onChange={e => updateSlide(selectedIdx,{font:e.target.value,overrideText:true},'Font')} style={{marginBottom:6}}>
                        {FONTS.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                      </select>
                      <div className="range-wrap">
                        <input type="range" min="30" max="160" value={slide.fontSize}
                          onChange={e => updateSlide(selectedIdx,{fontSize:+e.target.value,overrideText:true},'Font size')} />
                        <span className="range-val">{slide.fontSize}</span>
                      </div>
                      <div className="prop-row" style={{marginTop:8}}>
                        <span className="toggle-label" style={{flex:1}}>Couleur</span>
                        <input type="color" value={slide.textColor}
                          onChange={e => updateSlide(selectedIdx,{textColor:e.target.value,overrideText:true},'Text color')} />
                      </div>
                    </>
                  )}
                </div>

                {/* Background */}
                <div className="prop-group">
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                    <span className="prop-label" style={{margin:0}}>Fond</span>
                    {slide.overrideBg && <span className="inherited-badge">CUSTOM</span>}
                  </div>
                  <div className="toggle-row">
                    <span className="toggle-label">Fond personnalisé</span>
                    <div className={`toggle ${slide.overrideBg?'on':''}`} onClick={() => updateSlide(selectedIdx,{overrideBg:!slide.overrideBg},'Toggle bg override')} />
                  </div>
                  {slide.overrideBg && (
                    <>
                      <div className="bg-tabs">
                        {['color','gradient','image'].map(t => (
                          <button key={t} className={`bg-tab ${bgType===t?'active':''}`}
                            onClick={() => updateSlideBg(selectedIdx, {type:t})}>
                            {t === 'color' ? '■ Uni' : t === 'gradient' ? '▦ Dégradé' : '🖼 Image'}
                          </button>
                        ))}
                      </div>
                      {bgType === 'color' && (
                        <div className="prop-row">
                          <span className="toggle-label" style={{flex:1}}>Couleur</span>
                          <input type="color" value={slideBg.color || '#000000'}
                            onChange={e => updateSlideBg(selectedIdx,{color:e.target.value})} />
                        </div>
                      )}
                      {bgType === 'gradient' && (
                        <div>
                          <div className="grad-stops" style={{marginBottom:8}}>
                            <span className="toggle-label">Couleur 1</span>
                            <input type="color" value={(slideBg.stops||['#000','#222'])[0]}
                              onChange={e => { const s=[...(slideBg.stops||['#000','#222'])]; s[0]=e.target.value; updateSlideBg(selectedIdx,{stops:s}); }} />
                            <span className="toggle-label">Couleur 2</span>
                            <input type="color" value={(slideBg.stops||['#000','#222'])[1]}
                              onChange={e => { const s=[...(slideBg.stops||['#000','#222'])]; s[1]=e.target.value; updateSlideBg(selectedIdx,{stops:s}); }} />
                          </div>
                          <span className="prop-label">Angle</span>
                          <div className="range-wrap">
                            <input type="range" min="0" max="360" value={slideBg.angle||135}
                              onChange={e => updateSlideBg(selectedIdx,{angle:+e.target.value})} />
                            <span className="range-val">{slideBg.angle||135}°</span>
                          </div>
                        </div>
                      )}
                      {bgType === 'image' && (
                        <div>
                          <input ref={fileInputRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleBgImageUpload} />
                          <button className="btn btn-ghost btn-sm" style={{width:'100%',marginBottom:8}}
                            onClick={() => fileInputRef.current.click()}>📁 Choisir une image</button>
                          {slideBg.imageData && (
                            <>
                              <span className="prop-label">Flou</span>
                              <div className="range-wrap" style={{marginBottom:6}}>
                                <input type="range" min="0" max="20" value={slideBg.blur||0}
                                  onChange={e => updateSlideBg(selectedIdx,{blur:+e.target.value})} />
                                <span className="range-val">{slideBg.blur||0}px</span>
                              </div>
                              <span className="prop-label">Assombrissement</span>
                              <div className="range-wrap">
                                <input type="range" min="0" max="1" step="0.05" value={slideBg.overlay||0}
                                  onChange={e => updateSlideBg(selectedIdx,{overlay:+e.target.value})} />
                                <span className="range-val">{Math.round((slideBg.overlay||0)*100)}%</span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Templates rapides */}
                <div className="prop-group">
                  <span className="prop-label">Templates rapides</span>
                  <div className="template-grid">
                    {TEMPLATES.map(tpl => (
                      <div key={tpl.name} className="template-card" onClick={() => applyTemplateToSlide(selectedIdx, tpl)}>
                        <TemplatePrev tpl={tpl} />
                        <div className="template-name">{tpl.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─ GLOBAL TAB ─ */}
            {rightTab === 'global' && (
              <div>
                <div className="prop-group">
                  <span className="prop-label">Style global (toutes les slides)</span>
                  <select value={gbl.font} onChange={e => updateGlobal({font:e.target.value})} style={{marginBottom:8}}>
                    {FONTS.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                  </select>
                  <span className="prop-label">Taille de police globale</span>
                  <div className="range-wrap" style={{marginBottom:10}}>
                    <input type="range" min="30" max="160" value={gbl.fontSize}
                      onChange={e => updateGlobal({fontSize:+e.target.value})} />
                    <span className="range-val">{gbl.fontSize}</span>
                  </div>
                  <div className="prop-row">
                    <span className="toggle-label" style={{flex:1}}>Couleur texte</span>
                    <input type="color" value={gbl.textColor}
                      onChange={e => updateGlobal({textColor:e.target.value})} />
                  </div>
                </div>
                <div className="prop-group">
                  <span className="prop-label">Fond global</span>
                  <div className="bg-tabs">
                    {['color','gradient'].map(t => (
                      <button key={t} className={`bg-tab ${gbl.bg.type===t?'active':''}`}
                        onClick={() => updateGlobal({bg:{...gbl.bg,type:t}})}>
                        {t === 'color' ? '■ Uni' : '▦ Dégradé'}
                      </button>
                    ))}
                  </div>
                  {gbl.bg.type === 'color' && (
                    <div className="prop-row">
                      <span className="toggle-label" style={{flex:1}}>Couleur</span>
                      <input type="color" value={gbl.bg.color||'#000'}
                        onChange={e => updateGlobal({bg:{...gbl.bg,color:e.target.value}})} />
                    </div>
                  )}
                  {gbl.bg.type === 'gradient' && (
                    <div>
                      <div className="grad-stops" style={{marginBottom:8}}>
                        <span className="toggle-label">C1</span>
                        <input type="color" value={(gbl.bg.stops||['#000','#222'])[0]}
                          onChange={e => { const s=[...(gbl.bg.stops||['#000','#222'])]; s[0]=e.target.value; updateGlobal({bg:{...gbl.bg,stops:s}}); }} />
                        <span className="toggle-label">C2</span>
                        <input type="color" value={(gbl.bg.stops||['#000','#222'])[1]}
                          onChange={e => { const s=[...(gbl.bg.stops||['#000','#222'])]; s[1]=e.target.value; updateGlobal({bg:{...gbl.bg,stops:s}}); }} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="prop-group">
                  <span className="prop-label">Appliquer un template global</span>
                  <div className="template-grid">
                    {TEMPLATES.map(tpl => (
                      <div key={tpl.name} className="template-card" onClick={() => applyTemplateToAll(tpl)}>
                        <TemplatePrev tpl={tpl} />
                        <div className="template-name">{tpl.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─ BRANDING TAB ─ */}
            {rightTab === 'branding' && (
              <div>
                <div className="prop-group">
                  <span className="prop-label">Signature / Pseudo</span>
                  <div className="toggle-row">
                    <span className="toggle-label">Afficher</span>
                    <div className={`toggle ${branding.showSignature?'on':''}`}
                      onClick={() => updateBranding({showSignature:!branding.showSignature})} />
                  </div>
                  <input type="text" value={branding.signature}
                    onChange={e => updateBranding({signature:e.target.value})}
                    placeholder="@tonpseudo" style={{marginBottom:8}} />
                  <span className="prop-label">Opacité</span>
                  <div className="range-wrap">
                    <input type="range" min="0" max="1" step="0.05" value={branding.signatureOpacity}
                      onChange={e => updateBranding({signatureOpacity:+e.target.value})} />
                    <span className="range-val">{Math.round(branding.signatureOpacity*100)}%</span>
                  </div>
                </div>
                <div className="prop-group">
                  <span className="prop-label">Numérotation des slides</span>
                  <div className="toggle-row">
                    <span className="toggle-label">Afficher</span>
                    <div className={`toggle ${branding.showSlideNum?'on':''}`}
                      onClick={() => updateBranding({showSlideNum:!branding.showSlideNum})} />
                  </div>
                  <span className="prop-label">Format</span>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:8}}>
                    {['{n}/{total}','{n}','Slide {n}','Part {n}'].map(fmt => (
                      <button key={fmt} className={`btn btn-ghost btn-sm ${branding.slideNumFormat===fmt?'btn-white':''}`}
                        onClick={() => updateBranding({slideNumFormat:fmt})}>{fmt}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─ HISTORY TAB ─ */}
            {rightTab === 'history' && (
              <div>
                <div className="history-item" style={{opacity:.5,cursor:'default'}}>
                  <div className="history-dot" />
                  {history.future.length} action(s) annulée(s)
                </div>
                <div className="history-item current">
                  <div className="history-dot" />
                  ● Présent
                </div>
                {[...history.past].reverse().map((s, i) => (
                  <div key={i} className="history-item" onClick={() => {
                    // Undo i+1 times
                    for(let j=0;j<=i;j++) dispatch({type:'UNDO'});
                  }}>
                    <div className="history-dot" />
                    {history.past.length - i}. Action passée
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TEMPLATES TAB ── */}
      {navTab === 'templates' && (
        <div style={{padding:40, maxWidth:1000, margin:'0 auto'}}>
          <div style={{marginBottom:32}}>
            <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,letterSpacing:4,marginBottom:8}}>BIBLIOTHÈQUE DE TEMPLATES</h2>
            <p style={{color:'var(--text2)',fontSize:14}}>Cliquez sur un template pour l'appliquer à toutes vos slides</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:16}}>
            {TEMPLATES.map(tpl => (
              <div key={tpl.name} style={{cursor:'pointer'}} onClick={() => { applyTemplateToAll(tpl); setNavTab('editor'); }}>
                <div style={{aspectRatio:'1',borderRadius:12,overflow:'hidden',border:'1px solid var(--border)',marginBottom:8,transition:'transform .2s'}}>
                  <TemplatePrev tpl={tpl} />
                </div>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,letterSpacing:2,color:'var(--text)'}}>{tpl.name}</div>
                <div style={{fontSize:11,color:'var(--text3)',marginTop:2}}>{tpl.font}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notification */}
      {notif && (
        <div className="notif">
          <span style={{color:'var(--green)'}}>✓</span> {notif}
        </div>
      )}
    </div>
  );
}
