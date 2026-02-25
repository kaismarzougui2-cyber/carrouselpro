import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Download, Layers, Type, Trash2, Scissors, User, FileArchive, Moon, Sun, ChevronRight, Sparkles, Check } from 'lucide-react';

const GoogleFonts = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=Montserrat:wght@900&family=Anton&family=Oswald:wght@700&family=Roboto+Condensed:wght@700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0a0a0a;
      --bg2: #111111;
      --bg3: #1a1a1a;
      --border: #2a2a2a;
      --border2: #333333;
      --text: #f0f0f0;
      --text2: #888888;
      --text3: #555555;
      --accent: #ffffff;
      --accent2: #e0e0e0;
      --glow: rgba(255,255,255,0.06);
    }

    .light-mode {
      --bg: #f8f8f6;
      --bg2: #ffffff;
      --bg3: #f0f0ee;
      --border: #e0e0de;
      --border2: #d0d0ce;
      --text: #0a0a0a;
      --text2: #666666;
      --text3: #aaaaaa;
      --accent: #0a0a0a;
      --accent2: #333333;
      --glow: rgba(0,0,0,0.04);
    }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'DM Sans', sans-serif;
      transition: background 0.4s ease, color 0.4s ease;
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }

    /* Nav */
    .nav {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--bg);
      border-bottom: 1px solid var(--border);
      padding: 0 32px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      backdrop-filter: blur(12px);
    }

    .nav-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: 'Bebas Neue', sans-serif;
      font-size: 26px;
      letter-spacing: 3px;
      color: var(--text);
    }

    .logo-dot {
      width: 8px;
      height: 8px;
      background: var(--accent);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.8); }
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: var(--bg2);
      color: var(--text2);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-icon:hover {
      border-color: var(--border2);
      color: var(--text);
      background: var(--bg3);
    }

    .btn-primary {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--accent);
      color: var(--bg);
      border: none;
      padding: 10px 20px;
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s;
      letter-spacing: 0.3px;
    }
    .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
    .btn-primary:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }

    /* Layout */
    .main-layout {
      max-width: 1280px;
      margin: 0 auto;
      padding: 32px 32px 80px;
      display: grid;
      grid-template-columns: 380px 1fr;
      gap: 32px;
    }

    @media (max-width: 900px) {
      .main-layout { grid-template-columns: 1fr; }
    }

    /* Panel */
    .panel {
      background: var(--bg2);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 28px;
      margin-bottom: 16px;
      transition: background 0.4s, border 0.4s;
    }

    .panel-label {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: var(--text3);
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .smart-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      background: var(--glow);
      border: 1px solid var(--border2);
      color: var(--text2);
      padding: 6px 12px;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .smart-btn:hover {
      background: var(--accent);
      color: var(--bg);
      border-color: var(--accent);
    }

    textarea, input, select {
      width: 100%;
      background: var(--bg3);
      border: 1px solid var(--border);
      border-radius: 12px;
      color: var(--text);
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      padding: 14px 16px;
      outline: none;
      transition: border 0.2s, background 0.2s;
      resize: none;
    }
    textarea { height: 220px; line-height: 1.6; }
    textarea:focus, input:focus, select:focus {
      border-color: var(--border2);
      background: var(--bg2);
    }

    .input-label {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 1px;
      color: var(--text3);
      text-transform: uppercase;
      margin-bottom: 8px;
      margin-top: 16px;
      display: block;
    }

    /* Slider */
    .slider-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .slider-val {
      font-size: 12px;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      color: var(--text2);
      background: var(--bg3);
      padding: 3px 10px;
      border-radius: 6px;
    }

    input[type=range] {
      padding: 0;
      background: transparent;
      border: none;
      cursor: pointer;
      accent-color: var(--accent);
      height: 4px;
    }
    input[type=range]::-webkit-slider-runnable-track {
      background: var(--border);
      height: 3px;
      border-radius: 3px;
    }
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--accent);
      margin-top: -6px;
      cursor: pointer;
    }

    select {
      appearance: none;
      cursor: pointer;
    }

    /* Progress Bar */
    .progress-container {
      margin-bottom: 28px;
    }
    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .progress-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 22px;
      letter-spacing: 2px;
      color: var(--text);
    }
    .progress-count {
      font-size: 12px;
      font-weight: 600;
      color: var(--text3);
      letter-spacing: 1px;
    }
    .progress-bar-bg {
      height: 3px;
      background: var(--border);
      border-radius: 3px;
      overflow: hidden;
    }
    .progress-bar-fill {
      height: 100%;
      background: var(--accent);
      border-radius: 3px;
      transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .progress-dots {
      display: flex;
      gap: 6px;
      margin-top: 12px;
      flex-wrap: wrap;
    }
    .progress-dot {
      width: 24px;
      height: 4px;
      border-radius: 2px;
      background: var(--border);
      transition: all 0.3s;
      cursor: pointer;
    }
    .progress-dot.active {
      background: var(--accent);
      width: 32px;
    }
    .progress-dot.done {
      background: var(--text3);
    }

    /* Slides grid */
    .slides-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .slide-wrapper {
      position: relative;
      background: var(--bg2);
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
      transition: border-color 0.2s, transform 0.2s;
      cursor: pointer;
    }
    .slide-wrapper:hover {
      border-color: var(--border2);
      transform: translateY(-2px);
    }

    .slide-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      background: rgba(0,0,0,0.85);
      color: #fff;
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 2px;
      padding: 4px 10px;
      border-radius: 4px;
      z-index: 2;
      backdrop-filter: blur(4px);
    }

    .light-mode .slide-badge {
      background: rgba(255,255,255,0.9);
      color: #000;
    }

    canvas { width: 100%; aspect-ratio: 1; display: block; }

    /* Empty state */
    .empty-state {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 400px;
      border: 1px dashed var(--border2);
      border-radius: 20px;
      color: var(--text3);
      gap: 16px;
    }
    .empty-state p {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 20px;
      letter-spacing: 3px;
    }

    /* Slide number indicator */
    .slide-num {
      position: absolute;
      bottom: 12px;
      right: 14px;
      font-size: 10px;
      font-weight: 700;
      color: var(--text3);
      letter-spacing: 1px;
    }

    .status-dot {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 600;
      color: var(--text3);
      letter-spacing: 1px;
    }
    .status-dot::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #4ade80;
      animation: pulse 2s infinite;
    }
  `}} />
);

const SlideCanvas = ({ text, index, fontSize, fontFamily, signature, darkSlide, onCanvasReady }) => {
  const canvasRef = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = 1080;
    canvas.height = 1080;

    const bg = darkSlide ? '#0a0a0a' : '#ffffff';
    const fg = darkSlide ? '#ffffff' : '#000000';
    const sub = darkSlide ? '#444444' : '#bbbbbb';
    const sigColor = darkSlide ? '#555555' : '#aaaaaa';

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1080, 1080);

    // Subtle corner accent
    ctx.strokeStyle = darkSlide ? '#1f1f1f' : '#f0f0f0';
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, 1000, 1000);

    // Slide number (top right, small)
    ctx.font = `500 22px 'DM Sans', sans-serif`;
    ctx.fillStyle = sub;
    ctx.textAlign = 'right';
    ctx.fillText(`${String(index + 1).padStart(2, '0')}`, 1040, 80);

    // Signature
    if (signature && signature.trim() !== '') {
      ctx.fillStyle = sigColor;
      ctx.textAlign = 'center';
      ctx.font = `600 28px 'DM Sans', sans-serif`;
      ctx.fillText(signature.toUpperCase(), 540, 1010);

      ctx.strokeStyle = darkSlide ? '#1f1f1f' : '#eeeeee';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(390, 978);
      ctx.lineTo(690, 978);
      ctx.stroke();
    }

    // Main text
    ctx.fillStyle = fg;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${fontSize}px ${fontFamily}`;

    const upper = text.toUpperCase();
    const words = upper.split(' ');
    const maxW = 900;
    const lh = fontSize * 1.18;
    let lines = [], cur = '';

    words.forEach(w => {
      const test = cur + w + ' ';
      if (ctx.measureText(test).width > maxW) {
        lines.push(cur);
        cur = w + ' ';
      } else {
        cur = test;
      }
    });
    lines.push(cur);

    const totalH = lines.length * lh;
    let startY = (1080 - totalH) / 2 + lh / 2;

    lines.forEach((line, i) => {
      ctx.fillText(line.trim(), 540, startY + i * lh);
    });

    if (onCanvasReady) onCanvasReady(canvas, index);
  }, [text, fontSize, fontFamily, signature, darkSlide, index, onCanvasReady]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div className="slide-wrapper">
      <div className="slide-badge">SLIDE {index + 1}</div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [rawText, setRawText] = useState("BIENVENUE SUR CARROUSELPRO\n\nL'OUTIL QUI TRANSFORME TON TEXTE EN CARROUSEL INSTAGRAM PROFESSIONNEL.\n\nCOLLE TON TEXTE, CHOISIS TON STYLE, TÉLÉCHARGE EN UN CLIC.\n\nFAIT POUR LES CRÉATEURS DE CONTENU EXIGEANTS.");
  const [signature, setSignature] = useState("@tonpseudo");
  const [fontSize, setFontSize] = useState(88);
  const [fontFamily, setFontFamily] = useState("'Montserrat', sans-serif");
  const [darkSlides, setDarkSlides] = useState(true);
  const [slides, setSlides] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const canvasMap = useRef({});

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const chunks = rawText.split(/\n\n+/).map(s => s.trim()).filter(s => s.length > 0);
    setSlides(chunks);
    setActiveSlide(0);
  }, [rawText]);

  const handleSmartSplit = () => {
    const text = rawText.replace(/\n/g, ' ').trim();
    const limit = 220;
    let chunks = [], remaining = text;
    while (remaining.length > 0) {
      if (remaining.length <= limit) { chunks.push(remaining); break; }
      let splitIdx = -1;
      const look = remaining.substring(0, limit + 20);
      const pMatch = look.match(/[.!?](?!.*[.!?])/);
      if (pMatch && pMatch.index > limit / 2) splitIdx = pMatch.index + 1;
      else splitIdx = remaining.lastIndexOf(' ', limit);
      if (splitIdx === -1) splitIdx = limit;
      chunks.push(remaining.substring(0, splitIdx).trim());
      remaining = remaining.substring(splitIdx).trim();
    }
    setRawText(chunks.join('\n\n'));
  };

  const downloadAsZip = async () => {
    if (typeof window.JSZip === 'undefined') {
      alert("Chargement en cours, réessaie dans 1 seconde.");
      return;
    }
    setIsExporting(true);
    try {
      const zip = new window.JSZip();
      const folder = zip.folder("carrouselpro");
      const promises = Object.entries(canvasMap.current).map(([i, canvas]) =>
        new Promise(resolve => {
          canvas.toBlob(blob => { folder.file(`slide-${parseInt(i)+1}.png`, blob); resolve(); }, 'image/png');
        })
      );
      await Promise.all(promises);
      const content = await zip.generateAsync({ type: "blob" });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(content);
      a.download = `carrousel-${Date.now()}.zip`;
      a.click();
    } catch (e) { console.error(e); }
    finally { setIsExporting(false); }
  };

  const fonts = [
    { name: 'Montserrat Black', value: "'Montserrat', sans-serif" },
    { name: 'Anton — Impact Style', value: "'Anton', sans-serif" },
    { name: 'Oswald Compact', value: "'Oswald', sans-serif" },
    { name: 'Roboto Condensed', value: "'Roboto Condensed', sans-serif" },
  ];

  const progress = slides.length > 0 ? ((activeSlide + 1) / slides.length) * 100 : 0;

  return (
    <div className={darkMode ? '' : 'light-mode'}>
      <GoogleFonts />

      <nav className="nav">
        <div className="nav-logo">
          <div className="logo-dot" />
          CarrouselPro
        </div>
        <div className="nav-right">
          <button className="btn-icon" onClick={() => setDarkMode(!darkMode)} title="Toggle mode">
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="btn-primary" onClick={downloadAsZip} disabled={slides.length === 0 || isExporting}>
            {isExporting
              ? <span style={{animation:'pulse 1s infinite'}}>Génération…</span>
              : <><FileArchive size={15} /> Télécharger ZIP ({slides.length})</>
            }
          </button>
        </div>
      </nav>

      <div className="main-layout">

        {/* Left panel */}
        <div>
          <div className="panel">
            <div className="panel-label">
              Contenu
              <button className="smart-btn" onClick={handleSmartSplit}>
                <Scissors size={11} /> Smart Split
              </button>
            </div>

            <textarea
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              placeholder="Colle ton texte ici…"
            />

            <label className="input-label"><User size={11} style={{display:'inline',marginRight:4}} />Signature</label>
            <input
              type="text"
              value={signature}
              onChange={e => setSignature(e.target.value)}
              placeholder="@tonpseudo ou Ton Nom"
            />
          </div>

          <div className="panel">
            <div className="panel-label">Apparence</div>

            <div className="slider-row">
              <label className="input-label" style={{margin:0}}>Taille du texte</label>
              <span className="slider-val">{fontSize}px</span>
            </div>
            <input type="range" min="40" max="160" value={fontSize} onChange={e => setFontSize(+e.target.value)} style={{width:'100%', marginBottom:20}} />

            <label className="input-label">Police</label>
            <select value={fontFamily} onChange={e => setFontFamily(e.target.value)} style={{marginBottom:16}}>
              {fonts.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
            </select>

            <label className="input-label">Style des slides</label>
            <div style={{display:'flex', gap:10, marginTop:4}}>
              {[{label:'⬛ Sombre', val:true},{label:'⬜ Clair', val:false}].map(opt => (
                <button key={opt.label} onClick={() => setDarkSlides(opt.val)} style={{
                  flex:1, padding:'10px 0', borderRadius:10,
                  border: `1px solid ${darkSlides === opt.val ? 'var(--accent)' : 'var(--border)'}`,
                  background: darkSlides === opt.val ? 'var(--accent)' : 'var(--bg3)',
                  color: darkSlides === opt.val ? 'var(--bg)' : 'var(--text2)',
                  fontFamily:"'DM Sans', sans-serif", fontWeight:600, fontSize:12,
                  cursor:'pointer', transition:'all 0.2s',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:6
                }}>
                  {darkSlides === opt.val && <Check size={12} />}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div>
          {/* Progress bar */}
          <div className="progress-container">
            <div className="progress-header">
              <span className="progress-title">Aperçu Carrousel</span>
              <span className="status-dot">{slides.length} slides prêtes</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{width: `${slides.length > 0 ? 100 : 0}%`}} />
            </div>
            <div className="progress-dots">
              {slides.map((_, i) => (
                <div
                  key={i}
                  className={`progress-dot ${i === activeSlide ? 'active' : 'done'}`}
                  onClick={() => setActiveSlide(i)}
                  title={`Slide ${i+1}`}
                />
              ))}
            </div>
          </div>

          <div className="slides-grid">
            {slides.map((slide, index) => (
              <div key={`${index}-${fontFamily}-${fontSize}-${signature}-${darkSlides}`} onClick={() => setActiveSlide(index)}>
                <SlideCanvas
                  text={slide}
                  index={index}
                  fontSize={fontSize}
                  fontFamily={fontFamily}
                  signature={signature}
                  darkSlide={darkSlides}
                  onCanvasReady={(canvas, idx) => { canvasMap.current[idx] = canvas; }}
                />
              </div>
            ))}
            {slides.length === 0 && (
              <div className="empty-state">
                <Type size={48} strokeWidth={1} />
                <p>En attente de texte…</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
