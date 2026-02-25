import React, { useState, useRef, useEffect, useCallback } from 'react';

// ─── GOOGLE FONTS ────────────────────────────────────────────────────────────
const GoogleFonts = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=Montserrat:wght@700;900&family=Anton&family=Oswald:wght@600;700&family=Roboto+Condensed:wght@700&family=Playfair+Display:wght@700;900&family=Space+Mono:wght@400;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:       #0c0c0c;
      --bg2:      #131313;
      --bg3:      #1a1a1a;
      --bg4:      #222222;
      --border:   #282828;
      --border2:  #383838;
      --text:     #f2f2f2;
      --text2:    #6a6a6a;
      --text3:    #3a3a3a;
      --accent:   #ffffff;
      --accent-r: rgba(255,255,255,0.06);
      --green:    #3ddc84;
      --red:      #ff5252;
    }

    html, body { height: 100%; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Syne', sans-serif;
      min-height: 100vh;
      overflow-x: hidden;
    }

    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }

    .nav {
      height: 58px;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 24px;
      border-bottom: 1px solid var(--border);
      background: var(--bg);
      position: sticky; top: 0; z-index: 100;
    }
    .nav-logo {
      display: flex; align-items: center; gap: 10px;
      font-family: 'Bebas Neue', sans-serif;
      font-size: 24px; letter-spacing: 4px; color: var(--text);
      user-select: none;
    }
    .logo-sq {
      width: 30px; height: 30px; background: var(--accent);
      border-radius: 7px; display: flex; align-items: center; justify-content: center;
    }
    .logo-sq span { font-size: 14px; font-weight: 900; color: #000; font-family: 'Syne', sans-serif; }

    .mode-switch {
      display: flex; align-items: center;
      background: var(--bg3); border: 1px solid var(--border);
      border-radius: 10px; padding: 3px; gap: 2px;
    }
    .mode-btn {
      padding: 6px 18px; border-radius: 7px;
      font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700;
      letter-spacing: .5px; cursor: pointer; border: none;
      background: transparent; color: var(--text2);
      transition: all .2s;
    }
    .mode-btn.active { background: var(--accent); color: #000; }

    .nav-right { display: flex; align-items: center; gap: 8px; }

    .btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 9px 18px; border-radius: 8px;
      font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700;
      cursor: pointer; border: 1px solid var(--border); transition: all .18s;
      letter-spacing: .3px; white-space: nowrap;
    }
    .btn-outline { background: transparent; color: var(--text2); }
    .btn-outline:hover { background: var(--bg3); color: var(--text); border-color: var(--border2); }
    .btn-solid { background: var(--accent); color: #000; border-color: var(--accent); }
    .btn-solid:hover { opacity: .85; transform: translateY(-1px); }
    .btn-solid:disabled { opacity: .3; cursor: not-allowed; transform: none; }
    .btn-sm { padding: 6px 12px; font-size: 11px; }

    /* ── STEPS ── */
    .steps {
      display: flex; align-items: center;
      max-width: 500px; margin: 0 auto 40px;
    }
    .step { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; position: relative; }
    .step::after { content: ''; position: absolute; top: 16px; left: 50%; width: 100%; height: 1px; background: var(--border2); }
    .step:last-child::after { display: none; }
    .step-circle {
      width: 32px; height: 32px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 800; z-index: 1;
      border: 2px solid var(--border2); background: var(--bg);
      color: var(--text3); transition: all .3s;
    }
    .step.done .step-circle { background: var(--green); border-color: var(--green); color: #000; }
    .step.active .step-circle { background: var(--accent); border-color: var(--accent); color: #000; }
    .step-label { font-size: 10px; font-weight: 700; letter-spacing: 1px; color: var(--text3); text-transform: uppercase; }
    .step.active .step-label, .step.done .step-label { color: var(--text2); }

    /* ── SIMPLE MODE ── */
    .simple-wrapper { max-width: 760px; margin: 0 auto; padding: 40px 24px 80px; }
    .simple-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 20px; padding: 32px; margin-bottom: 20px; }
    .card-title { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 3px; color: var(--text); margin-bottom: 4px; }
    .card-subtitle { font-size: 13px; color: var(--text2); margin-bottom: 24px; font-weight: 500; }

    .big-textarea {
      width: 100%; min-height: 220px;
      background: var(--bg3); border: 2px solid var(--border);
      border-radius: 14px; color: var(--text);
      font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 500;
      padding: 18px; outline: none; resize: vertical; line-height: 1.7;
      transition: border .2s;
    }
    .big-textarea:focus { border-color: var(--border2); }
    .big-textarea::placeholder { color: var(--text3); }

    .splitter-hint {
      display: flex; align-items: flex-start; gap: 8px;
      margin: 10px 0 16px; padding: 12px 14px; border-radius: 10px;
      background: var(--bg3); border: 1px solid var(--border);
      font-size: 12px; color: var(--text2); font-weight: 500; line-height: 1.6;
    }
    .splitter-hint strong { color: var(--text); }

    .slides-count-badge {
      display: inline-flex; align-items: center; gap: 6px;
      background: var(--accent-r); border: 1px solid var(--border2);
      padding: 6px 14px; border-radius: 20px;
      font-size: 12px; font-weight: 700; color: var(--text2);
    }
    .slides-count-badge .count { color: var(--accent); font-size: 16px; font-family: 'Space Mono', monospace; }

    .slides-chips { display: flex; flex-direction: column; gap: 7px; margin-top: 14px; }
    .slide-chip {
      display: flex; align-items: center; gap: 10px;
      background: var(--bg3); border: 1px solid var(--border);
      border-radius: 10px; padding: 10px 14px;
      transition: all .15s;
    }
    .slide-chip:hover { border-color: var(--border2); }
    .chip-num { font-family: 'Space Mono', monospace; font-size: 10px; font-weight: 700; color: var(--text3); min-width: 24px; }
    .chip-text { font-size: 13px; font-weight: 600; color: var(--text2); flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .chip-del { background: transparent; border: none; color: var(--text3); cursor: pointer; font-size: 15px; padding: 0 2px; transition: color .15s; line-height: 1; }
    .chip-del:hover { color: var(--red); }

    /* Style grid */
    .style-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .style-card {
      aspect-ratio: 1; border-radius: 12px; overflow: hidden;
      border: 2px solid var(--border); cursor: pointer; transition: all .2s; position: relative;
    }
    .style-card:hover { border-color: var(--border2); transform: scale(1.03); }
    .style-card.selected { border-color: var(--accent); }
    .style-card canvas { width: 100%; height: 100%; display: block; }
    .style-card-name {
      position: absolute; bottom: 0; left: 0; right: 0;
      padding: 16px 8px 6px; text-align: center;
      font-size: 9px; font-weight: 800; letter-spacing: 1.5px;
      background: linear-gradient(transparent, rgba(0,0,0,.75));
      color: #fff;
    }
    .selected-check {
      position: absolute; top: 8px; right: 8px;
      width: 20px; height: 20px; border-radius: 50%;
      background: var(--accent); color: #000;
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 900;
    }

    .style-options { display: flex; gap: 10px; margin-top: 16px; flex-wrap: wrap; }
    .style-opt { flex: 1; min-width: 140px; }
    .opt-label { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text3); margin-bottom: 7px; display: block; }
    select {
      width: 100%; background: var(--bg3); border: 1px solid var(--border);
      border-radius: 8px; color: var(--text); font-family: 'Syne', sans-serif;
      font-size: 13px; font-weight: 600; padding: 9px 10px; outline: none;
      cursor: pointer; appearance: none; transition: border .15s;
    }
    select:focus { border-color: var(--border2); }
    .color-row { display: flex; gap: 7px; align-items: center; flex-wrap: wrap; }
    .color-swatch {
      width: 32px; height: 32px; border-radius: 7px;
      border: 2px solid var(--border); cursor: pointer;
      transition: transform .15s, border-color .15s; flex-shrink: 0;
    }
    .color-swatch:hover { transform: scale(1.12); }
    .color-swatch.selected { border-color: var(--accent); }
    input[type=color] {
      width: 32px; height: 32px; padding: 2px 3px;
      border-radius: 7px; border: 1px solid var(--border2);
      background: var(--bg3); cursor: pointer; flex-shrink: 0;
    }
    input[type=text] {
      width: 100%; background: var(--bg3); border: 1px solid var(--border);
      border-radius: 8px; color: var(--text); font-family: 'Syne', sans-serif;
      font-size: 13px; font-weight: 600; padding: 9px 12px; outline: none; transition: border .15s;
    }
    input[type=text]:focus { border-color: var(--border2); }
    input[type=text]::placeholder { color: var(--text3); }

    /* Preview grid */
    .preview-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
    .preview-card { border-radius: 12px; overflow: hidden; border: 1px solid var(--border); aspect-ratio: 1; position: relative; transition: all .2s; }
    .preview-card:hover { border-color: var(--border2); transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,.5); }
    .preview-card canvas { width: 100%; height: 100%; display: block; }
    .preview-badge {
      position: absolute; top: 9px; left: 9px;
      background: rgba(0,0,0,.8); backdrop-filter: blur(8px);
      color: #fff; font-size: 8px; font-weight: 800; letter-spacing: 2px;
      padding: 3px 8px; border-radius: 4px;
    }

    /* ── ADVANCED MODE ── */
    .adv-body { display: grid; grid-template-columns: 255px 1fr 265px; height: calc(100vh - 58px); overflow: hidden; }
    .adv-left, .adv-right { overflow-y: auto; background: var(--bg2); }
    .adv-left { border-right: 1px solid var(--border); display: flex; flex-direction: column; }
    .adv-right { border-left: 1px solid var(--border); }

    .adv-section { padding: 12px 14px; border-bottom: 1px solid var(--border); }
    .adv-section-title { font-size: 9px; font-weight: 800; letter-spacing: 2.5px; text-transform: uppercase; color: var(--text3); margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; }

    .adv-slide-list { padding: 8px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 6px; }
    .adv-slide-item { border-radius: 9px; overflow: hidden; border: 2px solid transparent; cursor: pointer; transition: all .15s; aspect-ratio: 1; position: relative; background: var(--bg3); }
    .adv-slide-item:hover { border-color: var(--border2); }
    .adv-slide-item.sel { border-color: var(--accent); }
    .adv-slide-item canvas { width: 100%; height: 100%; display: block; }
    .adv-slide-num { position: absolute; top: 5px; left: 5px; background: rgba(0,0,0,.75); color: #fff; font-size: 8px; font-weight: 800; letter-spacing: 1.5px; padding: 2px 6px; border-radius: 3px; }
    .adv-slide-actions { position: absolute; top: 5px; right: 5px; display: flex; gap: 3px; opacity: 0; transition: opacity .15s; }
    .adv-slide-item:hover .adv-slide-actions { opacity: 1; }
    .adv-action-btn { width: 20px; height: 20px; border-radius: 4px; background: rgba(0,0,0,.8); border: none; cursor: pointer; color: #fff; font-size: 10px; display: flex; align-items: center; justify-content: center; transition: background .15s; }
    .adv-action-btn:hover { background: rgba(255,255,255,.2); }

    .adv-center { background: var(--bg); display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; overflow: hidden; padding: 20px; }
    .adv-canvas-wrap { box-shadow: 0 0 0 1px var(--border), 0 32px 64px rgba(0,0,0,.7); border-radius: 3px; overflow: hidden; }
    .adv-canvas-nav {
      position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%);
      display: flex; align-items: center; gap: 10px;
      background: rgba(12,12,12,.92); backdrop-filter: blur(12px);
      border: 1px solid var(--border); border-radius: 20px; padding: 5px 14px;
    }
    .adv-nav-btn { background: none; border: none; color: var(--text2); cursor: pointer; font-size: 14px; padding: 2px 4px; transition: color .15s; }
    .adv-nav-btn:hover { color: var(--text); }
    .adv-nav-num { font-size: 11px; font-weight: 700; color: var(--text2); min-width: 36px; text-align: center; }

    .adv-tabs { display: flex; border-bottom: 1px solid var(--border); }
    .adv-tab { flex: 1; padding: 10px 4px; font-size: 10px; font-weight: 800; letter-spacing: .5px; cursor: pointer; border: none; background: transparent; color: var(--text3); transition: all .15s; border-bottom: 2px solid transparent; font-family: 'Syne', sans-serif; }
    .adv-tab.active { color: var(--text); border-bottom-color: var(--accent); }

    .prop-group { padding: 14px; border-bottom: 1px solid var(--border); }
    .prop-label { font-size: 9px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: var(--text3); margin-bottom: 8px; display: block; }
    .prop-row { display: flex; align-items: center; gap: 8px; }
    .range-row { display: flex; align-items: center; gap: 8px; }
    .range-val { font-size: 10px; font-weight: 700; color: var(--text2); background: var(--bg3); padding: 2px 7px; border-radius: 4px; min-width: 34px; text-align: center; font-family: 'Space Mono', monospace; }
    input[type=range] { flex: 1; appearance: none; height: 2px; background: var(--border2); border-radius: 2px; border: none; padding: 0; cursor: pointer; outline: none; }
    input[type=range]::-webkit-slider-thumb { appearance: none; width: 14px; height: 14px; border-radius: 50%; background: var(--accent); cursor: pointer; }

    .bg-type-row { display: flex; gap: 4px; margin-bottom: 10px; }
    .bg-type-btn { flex: 1; padding: 6px 4px; border-radius: 6px; text-align: center; font-size: 9px; font-weight: 800; letter-spacing: .5px; cursor: pointer; border: 1px solid var(--border); background: transparent; color: var(--text3); transition: all .15s; font-family: 'Syne', sans-serif; }
    .bg-type-btn.active { background: var(--bg4); color: var(--text); border-color: var(--border2); }

    .toggle-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
    .toggle-lbl { font-size: 12px; font-weight: 600; color: var(--text2); }
    .toggle { width: 30px; height: 17px; background: var(--bg3); border-radius: 9px; border: 1px solid var(--border); cursor: pointer; position: relative; transition: background .2s; flex-shrink: 0; }
    .toggle.on { background: var(--accent); border-color: var(--accent); }
    .toggle::after { content: ''; position: absolute; top: 2px; left: 2px; width: 11px; height: 11px; border-radius: 50%; background: var(--text3); transition: left .2s, background .2s; }
    .toggle.on::after { left: 15px; background: #000; }

    .tpl-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
    .tpl-card { aspect-ratio: 1; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); cursor: pointer; position: relative; transition: all .15s; }
    .tpl-card:hover { border-color: var(--border2); transform: scale(1.03); }
    .tpl-card canvas { width: 100%; height: 100%; display: block; }
    .tpl-name { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,.8)); color: #fff; font-size: 8px; font-weight: 800; letter-spacing: 1px; padding: 10px 5px 4px; text-align: center; }

    .grad-pair { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; margin-bottom: 8px; }

    .upload-btn { width: 100%; padding: 9px; border-radius: 8px; border: 1px dashed var(--border2); background: transparent; color: var(--text2); font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; transition: all .15s; margin-bottom: 8px; }
    .upload-btn:hover { border-color: var(--accent); color: var(--text); background: var(--accent-r); }

    textarea { width: 100%; background: var(--bg3); border: 1px solid var(--border); border-radius: 8px; color: var(--text); font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 500; padding: 9px 12px; outline: none; resize: none; line-height: 1.6; transition: border .15s; }
    textarea:focus { border-color: var(--border2); }

    .notif {
      position: fixed; bottom: 24px; right: 24px; z-index: 999;
      background: var(--bg3); border: 1px solid var(--border2); border-radius: 10px;
      padding: 11px 18px; font-size: 12px; font-weight: 700; color: var(--text);
      box-shadow: 0 8px 32px rgba(0,0,0,.5);
      display: flex; align-items: center; gap: 8px;
      animation: notifIn .25s ease;
    }
    @keyframes notifIn { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform:translateY(0); } }
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
  { name: 'NOIR', bg: { type:'color', color:'#000000' }, textColor:'#ffffff', font:'Montserrat', fontSize:88 },
  { name: 'BLANC', bg: { type:'color', color:'#ffffff' }, textColor:'#000000', font:'Montserrat', fontSize:88 },
  { name: 'GRADIENT', bg: { type:'gradient', stops:['#0a0a0a','#1a1a2e'], angle:135 }, textColor:'#ffffff', font:'Anton', fontSize:95 },
  { name: 'CRÈME', bg: { type:'color', color:'#f5f0e8' }, textColor:'#1a1a1a', font:'Playfair Display', fontSize:82 },
  { name: 'ROUGE', bg: { type:'color', color:'#c0392b' }, textColor:'#ffffff', font:'Anton', fontSize:95 },
  { name: 'NUIT', bg: { type:'gradient', stops:['#0f0c29','#302b63'], angle:160 }, textColor:'#e0d7ff', font:'Bebas Neue', fontSize:100 },
];

const QUICK_BG = ['#000000','#ffffff','#1a1a2e','#c0392b','#f5f0e8','#0d3349'];
const QUICK_TEXT = ['#ffffff','#000000','#f5f0e8','#ffd700','#e0d7ff','#ff6b6b'];

// ─── DRAW ────────────────────────────────────────────────────────────────────

function drawSlide(canvas, data) {
  const { text, bg, textColor, font, fontSize, signature, showNum, slideNum, total } = data;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  // BG
  if (bg.type === 'color') {
    ctx.fillStyle = bg.color; ctx.fillRect(0,0,W,H);
  } else if (bg.type === 'gradient') {
    const a = (bg.angle||135)*Math.PI/180;
    const g = ctx.createLinearGradient(W/2-Math.cos(a)*W/2,H/2-Math.sin(a)*H/2,W/2+Math.cos(a)*W/2,H/2+Math.sin(a)*H/2);
    (bg.stops||['#000','#222']).forEach((c,i,ar) => g.addColorStop(i/(ar.length-1),c));
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  } else if (bg.type==='image' && bg.imageEl) {
    ctx.drawImage(bg.imageEl,0,0,W,H);
    if(bg.blur){ctx.filter=`blur(${bg.blur}px)`;ctx.drawImage(canvas,0,0);ctx.filter='none';}
    if(bg.overlay){ctx.fillStyle=`rgba(0,0,0,${bg.overlay})`;ctx.fillRect(0,0,W,H);}
  }

  // Border
  ctx.strokeStyle='rgba(128,128,128,0.07)'; ctx.lineWidth=2;
  ctx.strokeRect(38,38,W-76,H-76);

  // Slide num
  if(showNum){
    ctx.save(); ctx.globalAlpha=.4; ctx.fillStyle=textColor;
    ctx.textAlign='right'; ctx.font=`500 22px 'Syne',sans-serif`;
    ctx.fillText(`${slideNum}/${total}`,W-52,70); ctx.restore();
  }

  // Signature
  if(signature&&signature.trim()){
    ctx.save(); ctx.globalAlpha=.5; ctx.fillStyle=textColor;
    ctx.textAlign='center'; ctx.font=`700 26px 'Syne',sans-serif`;
    ctx.fillText(signature.toUpperCase(),W/2,H-58);
    ctx.strokeStyle='rgba(128,128,128,0.15)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(W/2-80,H-82); ctx.lineTo(W/2+80,H-82); ctx.stroke();
    ctx.restore();
  }

  // Text
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

const SlideCanvas = React.memo(({ slideData }) => {
  const ref = useRef(null);
  useEffect(() => {
    const c=ref.current; if(!c) return;
    c.width=1080; c.height=1080; drawSlide(c,slideData);
  });
  return <canvas ref={ref} style={{width:'100%',height:'100%',display:'block'}} />;
});

const ThumbCanvas = React.memo(({ slideData }) => {
  const ref = useRef(null);
  useEffect(() => {
    const c=ref.current; if(!c) return;
    c.width=200; c.height=200; drawSlide(c,slideData);
  });
  return <canvas ref={ref} style={{width:'100%',height:'100%',display:'block'}} />;
});

// ─── SMART SPLIT ─────────────────────────────────────────────────────────────

function smartSplit(raw) {
  // Double newline = manual split (user intent)
  const byDouble = raw.split(/\n\n+/).map(s=>s.replace(/\n/g,' ').trim()).filter(Boolean);
  if (byDouble.length > 1) return byDouble;
  // Auto split by sentences ~200 chars
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

  // Simple mode
  const [step, setStep] = useState(1);
  const [rawText, setRawText] = useState('');
  const [slides, setSlides] = useState([]);
  const [selPreset, setSelPreset] = useState(0);
  const [simpleFont, setSimpleFont] = useState('Montserrat');
  const [simpleBg, setSimpleBg] = useState('#000000');
  const [simpleTxt, setSimpleTxt] = useState('#ffffff');
  const [simpleSig, setSimpleSig] = useState('@tonpseudo');

  // Advanced mode
  const newAdvSlide = (text='NOUVELLE SLIDE', i=0) => ({
    id:`s${Date.now()}_${i}`, text,
    bg:{type:'color',color:'#000000'}, textColor:'#ffffff',
    font:'Montserrat', fontSize:88,
    overrideBg:false, overrideTxt:false,
  });
  const [advSlides, setAdvSlides] = useState([
    newAdvSlide('BIENVENUE SUR CARROUSELPRO',0),
    newAdvSlide('CRÉE DES CARROUSELS PRO EN QUELQUES SECONDES.',1),
    newAdvSlide('PERSONNALISE CHAQUE SLIDE INDÉPENDAMMENT.',2),
  ]);
  const [advGlobal, setAdvGlobal] = useState({bg:{type:'color',color:'#000000'},textColor:'#ffffff',font:'Montserrat',fontSize:88});
  const [advBrand, setAdvBrand] = useState({signature:'@tonpseudo',showSig:true,showNum:true,numFmt:'{n}/{total}'});
  const [advSel, setAdvSel] = useState(0);
  const [advTab, setAdvTab] = useState('slide');
  const [advImport, setAdvImport] = useState('');

  const [notif, setNotif] = useState(null);
  const [exporting, setExporting] = useState(false);
  const fileRef = useRef(null);

  const toast = msg => { setNotif(msg); setTimeout(()=>setNotif(null),2500); };

  useEffect(()=>{
    const s=document.createElement('script');
    s.src='https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    document.body.appendChild(s);
  },[]);

  // ── Simple helpers ──

  const preview = rawText.trim() ? smartSplit(rawText) : [];

  const handleParse = () => {
    const chunks = smartSplit(rawText);
    setSlides(chunks); setStep(2);
  };

  function simpleData(text, i) {
    return {
      text: text||' ',
      bg: {type:'color', color: simpleBg},
      textColor: simpleTxt,
      font: simpleFont,
      fontSize: PRESETS[selPreset].fontSize,
      signature: simpleSig,
      showNum: true, slideNum: i+1, total: slides.length,
    };
  }

  // ── Advanced helpers ──

  const advSl = advSlides[advSel] || advSlides[0];

  function advData(sl, i) {
    const g=advGlobal, br=advBrand;
    return {
      text: sl.text||' ',
      bg: sl.overrideBg ? sl.bg : g.bg,
      textColor: sl.overrideTxt ? sl.textColor : g.textColor,
      font: sl.overrideTxt ? sl.font : g.font,
      fontSize: sl.overrideTxt ? sl.fontSize : g.fontSize,
      signature: br.showSig ? br.signature : '',
      showNum: br.showNum,
      slideNum: i+1,
      total: advSlides.length,
    };
  }

  const advUpd = (idx,ch) => setAdvSlides(p=>p.map((s,i)=>i===idx?{...s,...ch}:s));
  const advUpdBg = (idx,ch) => setAdvSlides(p=>p.map((s,i)=>i===idx?{...s,bg:{...s.bg,...ch},overrideBg:true}:s));

  const advDup = idx => {
    const d={...advSlides[idx],id:`s${Date.now()}`};
    setAdvSlides(p=>{const n=[...p];n.splice(idx+1,0,d);return n;});
    setAdvSel(idx+1); toast('Slide dupliquée ✓');
  };
  const advDel = idx => {
    if(advSlides.length<=1){toast('Impossible de supprimer la seule slide');return;}
    setAdvSlides(p=>p.filter((_,i)=>i!==idx));
    setAdvSel(Math.max(0,idx-1));
  };
  const advApplyTpl = (tpl, all=false) => {
    if(all){
      setAdvSlides(p=>p.map(s=>({...s,bg:{...tpl.bg},textColor:tpl.textColor,font:tpl.font,fontSize:tpl.fontSize,overrideBg:true,overrideTxt:true})));
      setAdvGlobal(g=>({...g,bg:tpl.bg,textColor:tpl.textColor,font:tpl.font,fontSize:tpl.fontSize}));
      toast(`Template "${tpl.name}" appliqué à tout le carrousel ✓`);
    } else {
      advUpd(advSel,{bg:{...tpl.bg},textColor:tpl.textColor,font:tpl.font,fontSize:tpl.fontSize,overrideBg:true,overrideTxt:true});
      toast(`Template "${tpl.name}" appliqué ✓`);
    }
  };
  const advImportFn = () => {
    if(!advImport.trim()) return;
    const chunks=smartSplit(advImport);
    setAdvSlides(chunks.map((t,i)=>newAdvSlide(t,i)));
    setAdvSel(0); setAdvImport(''); toast(`${chunks.length} slides créées ✓`);
  };
  const advBgImage = e => {
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader();
    r.onload=ev=>{
      const img=new Image();
      img.onload=()=>{advUpdBg(advSel,{type:'image',imageEl:img,blur:0,overlay:0.3});toast('Image appliquée ✓');};
      img.src=ev.target.result;
    };
    r.readAsDataURL(f);
  };

  // ── Export ──
  const doExport = async (list, dataFn) => {
    if(typeof window.JSZip==='undefined'){toast('Chargement…');return;}
    setExporting(true);
    try {
      const zip=new window.JSZip(), folder=zip.folder('carrouselpro');
      await Promise.all(list.map((sl,i)=>new Promise(res=>{
        const c=document.createElement('canvas');
        c.width=1080; c.height=1080; drawSlide(c,dataFn(sl,i));
        c.toBlob(b=>{folder.file(`slide-${i+1}.png`,b);res();},'image/png');
      })));
      const blob=await zip.generateAsync({type:'blob'});
      const a=document.createElement('a');
      a.href=URL.createObjectURL(blob);
      a.download=`carrousel-${Date.now()}.zip`; a.click();
      toast(`${list.length} images exportées ✓`);
    }catch(e){console.error(e);}
    finally{setExporting(false);}
  };

  const advSlBg = advSl.overrideBg ? advSl.bg : advGlobal.bg;
  const advSlBgType = advSlBg.type;

  return (
    <div>
      <GoogleFonts />

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo">
          <div className="logo-sq"><span>C</span></div>
          CarrouselPro
        </div>
        <div className="mode-switch">
          <button className={`mode-btn ${mode==='simple'?'active':''}`} onClick={()=>setMode('simple')}>⚡ Simple</button>
          <button className={`mode-btn ${mode==='advanced'?'active':''}`} onClick={()=>setMode('advanced')}>🔧 Avancé</button>
        </div>
        <div className="nav-right">
          {mode==='simple'&&step===3&&(
            <button className="btn btn-solid" disabled={exporting} onClick={()=>doExport(slides,simpleData)}>
              {exporting?'⏳…':`⬇ Télécharger (${slides.length})`}
            </button>
          )}
          {mode==='advanced'&&(
            <button className="btn btn-solid" disabled={exporting} onClick={()=>doExport(advSlides,advData)}>
              {exporting?'⏳…':`⬇ ZIP (${advSlides.length})`}
            </button>
          )}
        </div>
      </nav>

      {/* ════ SIMPLE MODE ════ */}
      {mode==='simple'&&(
        <div className="simple-wrapper">
          <div className="steps">
            {[{n:1,l:'Texte'},{n:2,l:'Style'},{n:3,l:'Export'}].map(s=>(
              <div key={s.n} className={`step ${step>s.n?'done':step===s.n?'active':''}`}
                style={{cursor:step>s.n?'pointer':'default'}} onClick={()=>step>s.n&&setStep(s.n)}>
                <div className="step-circle">{step>s.n?'✓':s.n}</div>
                <div className="step-label">{s.l}</div>
              </div>
            ))}
          </div>

          {/* STEP 1 */}
          {step===1&&(
            <div className="simple-card">
              <div className="card-title">DÉCOUPE TON TEXTE</div>
              <div className="card-subtitle">Colle ton texte. Saute <strong>deux fois Entrée</strong> entre chaque slide pour les séparer manuellement — sinon on le fait automatiquement.</div>

              <textarea
                className="big-textarea"
                value={rawText}
                onChange={e=>setRawText(e.target.value)}
                placeholder={"Exemple :\n\nComment gagner du temps chaque matin.\n\nPremière astuce : prépare ta tenue la veille.\n\nDeuxième astuce : évite les réseaux sociaux au réveil.\n\n← Double saut de ligne entre chaque slide"}
              />

              <div className="splitter-hint">
                <span>💡</span>
                <div>
                  <strong>2 façons de découper :</strong><br/>
                  • <strong>Manuel :</strong> appuie 2 fois sur Entrée entre chaque slide<br/>
                  • <strong>Auto :</strong> colle n'importe quel texte, on détecte les phrases
                </div>
              </div>

              {preview.length>0&&(
                <div style={{marginBottom:20}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
                    <div className="slides-count-badge">
                      <span className="count">{preview.length}</span> slides détectées
                    </div>
                  </div>
                  <div className="slides-chips">
                    {preview.slice(0,6).map((chunk,i)=>(
                      <div key={i} className="slide-chip">
                        <span className="chip-num">#{i+1}</span>
                        <span className="chip-text">{chunk}</span>
                      </div>
                    ))}
                    {preview.length>6&&<div style={{padding:'6px 14px',fontSize:12,color:'var(--text3)',fontWeight:600}}>+ {preview.length-6} autres…</div>}
                  </div>
                </div>
              )}

              <button className="btn btn-solid" onClick={handleParse} disabled={!rawText.trim()}>
                ✂ Découper et continuer →
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step===2&&(
            <div>
              <div className="simple-card">
                <div className="card-title">CHOISIS TON STYLE</div>
                <div className="card-subtitle">Un preset, une police, deux couleurs — c'est tout ce qu'il faut.</div>

                <div className="style-grid">
                  {PRESETS.map((p,i)=>{
                    const fd={text:slides[0]||'TEXTE',bg:p.bg,textColor:p.textColor,font:p.font,fontSize:36,signature:'',showNum:false,slideNum:1,total:1};
                    return(
                      <div key={p.name} className={`style-card ${selPreset===i?'selected':''}`}
                        onClick={()=>{setSelPreset(i);setSimpleBg(p.bg.color||'#000000');setSimpleTxt(p.textColor);setSimpleFont(p.font);}}>
                        <ThumbCanvas slideData={fd}/>
                        <div className="style-card-name">{p.name}</div>
                        {selPreset===i&&<div className="selected-check">✓</div>}
                      </div>
                    );
                  })}
                </div>

                <div className="style-options">
                  <div className="style-opt">
                    <span className="opt-label">Police</span>
                    <select value={simpleFont} onChange={e=>setSimpleFont(e.target.value)}>
                      {FONTS.map(f=><option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                  </div>
                  <div className="style-opt">
                    <span className="opt-label">Couleur fond</span>
                    <div className="color-row">
                      {QUICK_BG.map(c=><div key={c} className={`color-swatch ${simpleBg===c?'selected':''}`} style={{background:c}} onClick={()=>setSimpleBg(c)}/>)}
                      <input type="color" value={simpleBg} onChange={e=>setSimpleBg(e.target.value)}/>
                    </div>
                  </div>
                  <div className="style-opt">
                    <span className="opt-label">Couleur texte</span>
                    <div className="color-row">
                      {QUICK_TEXT.map(c=><div key={c} className={`color-swatch ${simpleTxt===c?'selected':''}`} style={{background:c}} onClick={()=>setSimpleTxt(c)}/>)}
                      <input type="color" value={simpleTxt} onChange={e=>setSimpleTxt(e.target.value)}/>
                    </div>
                  </div>
                  <div className="style-opt">
                    <span className="opt-label">Ta signature</span>
                    <input type="text" value={simpleSig} onChange={e=>setSimpleSig(e.target.value)} placeholder="@tonpseudo"/>
                  </div>
                </div>
              </div>
              <div style={{display:'flex',gap:10,justifyContent:'space-between'}}>
                <button className="btn btn-outline" onClick={()=>setStep(1)}>← Retour</button>
                <button className="btn btn-solid" onClick={()=>setStep(3)}>Aperçu →</button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step===3&&(
            <div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
                <div>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:4}}>APERÇU DU CARROUSEL</div>
                  <div style={{fontSize:13,color:'var(--text2)',marginTop:2,fontWeight:500}}>{slides.length} slides prêtes</div>
                </div>
                <button className="btn btn-outline btn-sm" onClick={()=>setStep(2)}>← Modifier le style</button>
              </div>

              <div className="simple-card" style={{marginBottom:20}}>
                <div className="card-title" style={{marginBottom:4}}>MODIFIER LES SLIDES</div>
                <div className="card-subtitle">Modifie le texte de chaque slide directement ici</div>
                <div className="slides-chips">
                  {slides.map((sl,i)=>(
                    <div key={i} className="slide-chip">
                      <span className="chip-num">#{i+1}</span>
                      <input type="text" value={sl}
                        onChange={e=>{const n=[...slides];n[i]=e.target.value;setSlides(n);}}
                        style={{flex:1,background:'transparent',border:'none',color:'var(--text)',fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:600,outline:'none'}}
                      />
                      <button className="chip-del" onClick={()=>setSlides(s=>s.filter((_,idx)=>idx!==i))}>✕</button>
                    </div>
                  ))}
                </div>
                <button className="btn btn-outline btn-sm" style={{marginTop:10}} onClick={()=>setSlides(s=>[...s,'NOUVELLE SLIDE'])}>+ Ajouter une slide</button>
              </div>

              <div className="preview-grid">
                {slides.map((sl,i)=>(
                  <div key={`${i}-${sl}-${simpleBg}-${simpleTxt}-${simpleFont}-${simpleSig}`} className="preview-card">
                    <SlideCanvas slideData={simpleData(sl,i)}/>
                    <div className="preview-badge">SLIDE {i+1}</div>
                  </div>
                ))}
              </div>

              <div style={{marginTop:28,display:'flex',justifyContent:'center'}}>
                <button className="btn btn-solid" style={{fontSize:14,padding:'12px 32px'}}
                  disabled={exporting} onClick={()=>doExport(slides,simpleData)}>
                  {exporting?'⏳ Génération en cours…':`⬇ Télécharger le ZIP (${slides.length} images)`}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════ ADVANCED MODE ════ */}
      {mode==='advanced'&&(
        <div className="adv-body">

          {/* LEFT */}
          <div className="adv-left">
            <div className="adv-section">
              <div className="adv-section-title">Importer du texte</div>
              <textarea value={advImport} onChange={e=>setAdvImport(e.target.value)}
                placeholder={"Colle ton texte ici...\n\nDouble saut de ligne = nouvelle slide"}
                style={{height:80,fontSize:12,marginBottom:6}}
              />
              <button className="btn btn-solid btn-sm" style={{width:'100%'}} onClick={advImportFn} disabled={!advImport.trim()}>
                ✂ Importer et découper
              </button>
            </div>
            <div className="adv-section">
              <div className="adv-section-title">Slides <span style={{color:'var(--text2)',fontSize:9}}>{advSlides.length}</span></div>
            </div>
            <div className="adv-slide-list">
              {advSlides.map((sl,i)=>(
                <div key={sl.id} className={`adv-slide-item ${i===advSel?'sel':''}`} onClick={()=>setAdvSel(i)}>
                  <ThumbCanvas slideData={advData(sl,i)}/>
                  <div className="adv-slide-num">{String(i+1).padStart(2,'0')}</div>
                  <div className="adv-slide-actions">
                    <button className="adv-action-btn" onClick={e=>{e.stopPropagation();advDup(i);}}>⧉</button>
                    <button className="adv-action-btn" style={{color:'#ff6666'}} onClick={e=>{e.stopPropagation();advDel(i);}}>✕</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{padding:10}}>
              <button className="upload-btn" onClick={()=>setAdvSlides(p=>[...p,newAdvSlide('NOUVELLE SLIDE',p.length)])}>
                + Ajouter une slide
              </button>
            </div>
          </div>

          {/* CENTER */}
          <div className="adv-center">
            <div className="adv-canvas-wrap">
              <SlideCanvas slideData={advData(advSl,advSel)}/>
            </div>
            <div className="adv-canvas-nav">
              <button className="adv-nav-btn" onClick={()=>setAdvSel(Math.max(0,advSel-1))}>◀</button>
              <span className="adv-nav-num">{advSel+1} / {advSlides.length}</span>
              <button className="adv-nav-btn" onClick={()=>setAdvSel(Math.min(advSlides.length-1,advSel+1))}>▶</button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="adv-right">
            <div className="adv-tabs">
              {[['slide','Slide'],['global','Global'],['brand','Branding'],['tpl','Templates']].map(([k,l])=>(
                <button key={k} className={`adv-tab ${advTab===k?'active':''}`} onClick={()=>setAdvTab(k)}>{l}</button>
              ))}
            </div>

            {/* SLIDE TAB */}
            {advTab==='slide'&&(
              <div>
                <div className="prop-group">
                  <span className="prop-label">Texte</span>
                  <textarea value={advSl.text} onChange={e=>advUpd(advSel,{text:e.target.value})} style={{height:80,marginBottom:8}}/>
                  <div className="toggle-row">
                    <span className="toggle-lbl">Style personnalisé</span>
                    <div className={`toggle ${advSl.overrideTxt?'on':''}`} onClick={()=>advUpd(advSel,{overrideTxt:!advSl.overrideTxt})}/>
                  </div>
                  {advSl.overrideTxt&&(
                    <>
                      <select value={advSl.font} onChange={e=>advUpd(advSel,{font:e.target.value,overrideTxt:true})} style={{marginBottom:6}}>
                        {FONTS.map(f=><option key={f.value} value={f.value}>{f.label}</option>)}
                      </select>
                      <div className="range-row" style={{marginBottom:8}}>
                        <input type="range" min="30" max="160" value={advSl.fontSize} onChange={e=>advUpd(advSel,{fontSize:+e.target.value,overrideTxt:true})}/>
                        <span className="range-val">{advSl.fontSize}</span>
                      </div>
                      <div className="prop-row">
                        <span className="toggle-lbl" style={{flex:1}}>Couleur texte</span>
                        <input type="color" value={advSl.textColor} onChange={e=>advUpd(advSel,{textColor:e.target.value,overrideTxt:true})}/>
                      </div>
                    </>
                  )}
                </div>
                <div className="prop-group">
                  <div className="toggle-row">
                    <span className="prop-label" style={{margin:0}}>Fond personnalisé</span>
                    <div className={`toggle ${advSl.overrideBg?'on':''}`} onClick={()=>advUpd(advSel,{overrideBg:!advSl.overrideBg})}/>
                  </div>
                  {advSl.overrideBg&&(
                    <>
                      <div className="bg-type-row">
                        {['color','gradient','image'].map(t=>(
                          <button key={t} className={`bg-type-btn ${advSlBgType===t?'active':''}`} onClick={()=>advUpdBg(advSel,{type:t})}>
                            {t==='color'?'Uni':t==='gradient'?'Dégradé':'Image'}
                          </button>
                        ))}
                      </div>
                      {advSlBgType==='color'&&(
                        <div className="prop-row">
                          <span className="toggle-lbl" style={{flex:1}}>Couleur</span>
                          <input type="color" value={advSlBg.color||'#000'} onChange={e=>advUpdBg(advSel,{color:e.target.value})}/>
                        </div>
                      )}
                      {advSlBgType==='gradient'&&(
                        <div>
                          <div className="grad-pair">
                            <span className="toggle-lbl">C1</span>
                            <input type="color" value={(advSlBg.stops||['#000','#222'])[0]}
                              onChange={e=>{const s=[...(advSlBg.stops||['#000','#222'])];s[0]=e.target.value;advUpdBg(advSel,{stops:s});}}/>
                            <span className="toggle-lbl">C2</span>
                            <input type="color" value={(advSlBg.stops||['#000','#222'])[1]}
                              onChange={e=>{const s=[...(advSlBg.stops||['#000','#222'])];s[1]=e.target.value;advUpdBg(advSel,{stops:s});}}/>
                          </div>
                          <div className="range-row">
                            <input type="range" min="0" max="360" value={advSlBg.angle||135} onChange={e=>advUpdBg(advSel,{angle:+e.target.value})}/>
                            <span className="range-val">{advSlBg.angle||135}°</span>
                          </div>
                        </div>
                      )}
                      {advSlBgType==='image'&&(
                        <div>
                          <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={advBgImage}/>
                          <button className="upload-btn" onClick={()=>fileRef.current?.click()}>📁 Choisir une image</button>
                          {advSlBg.imageEl&&(
                            <>
                              <div className="range-row" style={{marginBottom:6}}>
                                <span className="toggle-lbl" style={{minWidth:38}}>Flou</span>
                                <input type="range" min="0" max="20" value={advSlBg.blur||0} onChange={e=>advUpdBg(advSel,{blur:+e.target.value})}/>
                                <span className="range-val">{advSlBg.blur||0}px</span>
                              </div>
                              <div className="range-row">
                                <span className="toggle-lbl" style={{minWidth:38}}>Ombre</span>
                                <input type="range" min="0" max="1" step="0.05" value={advSlBg.overlay||0} onChange={e=>advUpdBg(advSel,{overlay:+e.target.value})}/>
                                <span className="range-val">{Math.round((advSlBg.overlay||0)*100)}%</span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* GLOBAL TAB */}
            {advTab==='global'&&(
              <div>
                <div className="prop-group">
                  <span className="prop-label">Police globale</span>
                  <select value={advGlobal.font} onChange={e=>setAdvGlobal(g=>({...g,font:e.target.value}))} style={{marginBottom:8}}>
                    {FONTS.map(f=><option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                  <span className="prop-label">Taille</span>
                  <div className="range-row" style={{marginBottom:8}}>
                    <input type="range" min="30" max="160" value={advGlobal.fontSize} onChange={e=>setAdvGlobal(g=>({...g,fontSize:+e.target.value}))}/>
                    <span className="range-val">{advGlobal.fontSize}</span>
                  </div>
                  <div className="prop-row">
                    <span className="toggle-lbl" style={{flex:1}}>Couleur texte</span>
                    <input type="color" value={advGlobal.textColor} onChange={e=>setAdvGlobal(g=>({...g,textColor:e.target.value}))}/>
                  </div>
                </div>
                <div className="prop-group">
                  <span className="prop-label">Fond global</span>
                  <div className="bg-type-row">
                    {['color','gradient'].map(t=>(
                      <button key={t} className={`bg-type-btn ${advGlobal.bg.type===t?'active':''}`} onClick={()=>setAdvGlobal(g=>({...g,bg:{...g.bg,type:t}}))}>
                        {t==='color'?'Uni':'Dégradé'}
                      </button>
                    ))}
                  </div>
                  {advGlobal.bg.type==='color'&&(
                    <div className="prop-row">
                      <span className="toggle-lbl" style={{flex:1}}>Couleur</span>
                      <input type="color" value={advGlobal.bg.color||'#000'} onChange={e=>setAdvGlobal(g=>({...g,bg:{...g.bg,color:e.target.value}}))}/>
                    </div>
                  )}
                  {advGlobal.bg.type==='gradient'&&(
                    <div>
                      <div className="grad-pair">
                        <span className="toggle-lbl">C1</span>
                        <input type="color" value={(advGlobal.bg.stops||['#000','#222'])[0]}
                          onChange={e=>{const s=[...(advGlobal.bg.stops||['#000','#222'])];s[0]=e.target.value;setAdvGlobal(g=>({...g,bg:{...g.bg,stops:s}}));}}/>
                        <span className="toggle-lbl">C2</span>
                        <input type="color" value={(advGlobal.bg.stops||['#000','#222'])[1]}
                          onChange={e=>{const s=[...(advGlobal.bg.stops||['#000','#222'])];s[1]=e.target.value;setAdvGlobal(g=>({...g,bg:{...g.bg,stops:s}}));}}/>
                      </div>
                    </div>
                  )}
                </div>
                <div className="prop-group">
                  <span className="prop-label" style={{marginBottom:6,display:'block'}}>Réinitialiser</span>
                  <button className="btn btn-outline btn-sm" style={{width:'100%'}}
                    onClick={()=>{setAdvSlides(p=>p.map(s=>({...s,overrideBg:false,overrideTxt:false})));toast('Styles réinitialisés ✓');}}>
                    ↺ Tout réinitialiser au global
                  </button>
                </div>
              </div>
            )}

            {/* BRANDING TAB */}
            {advTab==='brand'&&(
              <div>
                <div className="prop-group">
                  <span className="prop-label">Signature</span>
                  <div className="toggle-row">
                    <span className="toggle-lbl">Afficher</span>
                    <div className={`toggle ${advBrand.showSig?'on':''}`} onClick={()=>setAdvBrand(b=>({...b,showSig:!b.showSig}))}/>
                  </div>
                  <input type="text" value={advBrand.signature} onChange={e=>setAdvBrand(b=>({...b,signature:e.target.value}))} placeholder="@tonpseudo" style={{marginBottom:0}}/>
                </div>
                <div className="prop-group">
                  <span className="prop-label">Numérotation</span>
                  <div className="toggle-row">
                    <span className="toggle-lbl">Afficher</span>
                    <div className={`toggle ${advBrand.showNum?'on':''}`} onClick={()=>setAdvBrand(b=>({...b,showNum:!b.showNum}))}/>
                  </div>
                  <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                    {['{n}/{total}','Slide {n}','{n}','Part {n}'].map(fmt=>(
                      <button key={fmt} className={`btn btn-sm ${advBrand.numFmt===fmt?'btn-solid':'btn-outline'}`}
                        onClick={()=>setAdvBrand(b=>({...b,numFmt:fmt}))}>{fmt}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATES TAB */}
            {advTab==='tpl'&&(
              <div>
                <div className="prop-group">
                  <span className="prop-label" style={{marginBottom:8,display:'block'}}>→ Cette slide seulement</span>
                  <div className="tpl-grid">
                    {PRESETS.map(tpl=>{
                      const fd={text:'SAMPLE',bg:tpl.bg,textColor:tpl.textColor,font:tpl.font,fontSize:36,signature:'',showNum:false,slideNum:1,total:1};
                      return(
                        <div key={tpl.name} className="tpl-card" onClick={()=>advApplyTpl(tpl,false)}>
                          <ThumbCanvas slideData={fd}/>
                          <div className="tpl-name">{tpl.name}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="prop-group">
                  <span className="prop-label" style={{marginBottom:8,display:'block'}}>→ Tout le carrousel</span>
                  <div className="tpl-grid">
                    {PRESETS.map(tpl=>{
                      const fd={text:'SAMPLE',bg:tpl.bg,textColor:tpl.textColor,font:tpl.font,fontSize:36,signature:'',showNum:false,slideNum:1,total:1};
                      return(
                        <div key={tpl.name} className="tpl-card" onClick={()=>advApplyTpl(tpl,true)}>
                          <ThumbCanvas slideData={fd}/>
                          <div className="tpl-name">{tpl.name}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {notif&&(
        <div className="notif">
          <span style={{color:'var(--green)'}}>✓</span> {notif}
        </div>
      )}
    </div>
  );
}
