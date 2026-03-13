// src/components/Navbar.jsx

const css = `
  .nb { position:sticky; top:0; z-index:300;
    background:rgba(10,10,10,.96); backdrop-filter:blur(20px);
    border-bottom:1px solid #262626; }
  .nb-inner { height:52px; max-width:1200px; margin:0 auto; padding:0 16px;
    display:flex; align-items:center; justify-content:space-between; gap:10px; }
  .nb-logo { display:flex; align-items:center; gap:8px;
    font-family:'Bebas Neue',sans-serif; font-size:20px; letter-spacing:4px;
    color:#f0f0f0; user-select:none; flex-shrink:0; }
  .nb-logo-sq { width:26px; height:26px; background:#fff; border-radius:6px;
    display:flex; align-items:center; justify-content:center; }
  .nb-logo-sq span { font-size:12px; font-weight:900; color:#000; }
`

export default function Navbar({ children }) {
  return (
    <>
      <style>{css}</style>
      <nav className="nb">
        <div className="nb-inner">
          <div className="nb-logo">
            <div className="nb-logo-sq"><span>C</span></div>
            CarrouselPro
          </div>
          <div style={{flex:1, display:'flex', justifyContent:'center'}}>
            {children}
          </div>
        </div>
      </nav>
    </>
  )
}
