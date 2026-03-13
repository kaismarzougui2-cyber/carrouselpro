// src/components/Navbar.jsx
// ─────────────────────────────────────────────────────────────
// Utilisation dans App.jsx :
//   import Navbar from './components/Navbar'
//   <Navbar user={user} profile={profile} saveStatus={saveStatus} onUpgrade={handleCheckout} />
// ─────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from 'react'
import { signOut, signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } from '../lib/supabaseClient'
import { handleCheckout } from '../lib/checkout'

// ── Styles ────────────────────────────────────────────────────
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
  .nb-right { display:flex; align-items:center; gap:8px; }

  /* Save status */
  .save-dot { display:flex; align-items:center; gap:5px; font-size:11px; font-weight:700;
    padding:4px 10px; border-radius:6px; transition:all .2s; }
  .save-idle    { color:#333; }
  .save-saving  { color:#888; animation: pulse 1s infinite; }
  .save-saved   { color:#3ddc84; background:rgba(61,220,132,.1); }
  .save-error   { color:#ff4d4d; background:rgba(255,77,77,.1); }
  .save-limit   { color:#f59e0b; background:rgba(245,158,11,.1); cursor:pointer; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }

  /* Premium badge */
  .prem-badge { font-size:9px; font-weight:800; letter-spacing:1.5px;
    background:linear-gradient(135deg,#f59e0b,#ef4444);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text; }

  /* Upgrade button */
  .upg-btn { display:flex; align-items:center; gap:5px; padding:6px 14px;
    border-radius:8px; background:linear-gradient(135deg,#f59e0b,#ef4444);
    color:#000; font-family:'Syne',sans-serif; font-size:11px; font-weight:800;
    border:none; cursor:pointer; transition:opacity .15s; white-space:nowrap; }
  .upg-btn:hover { opacity:.85; }

  /* Auth button */
  .auth-btn { padding:6px 14px; border-radius:8px; font-family:'Syne',sans-serif;
    font-size:11px; font-weight:700; cursor:pointer; border:1px solid #343434;
    background:transparent; color:#888; transition:all .15s; white-space:nowrap; }
  .auth-btn:hover { background:#181818; color:#f0f0f0; }
  .auth-btn.primary { background:#fff; color:#000; border-color:#fff; }
  .auth-btn.primary:hover { opacity:.85; }

  /* Avatar */
  .avatar { width:30px; height:30px; border-radius:50%; cursor:pointer;
    border:1px solid #343434; object-fit:cover; transition:border .15s; }
  .avatar:hover { border-color:#888; }
  .avatar-placeholder { width:30px; height:30px; border-radius:50%; cursor:pointer;
    background:#222; border:1px solid #343434; display:flex; align-items:center;
    justify-content:center; font-size:13px; font-weight:700; color:#888; }

  /* Dropdown menu */
  .dd { position:relative; }
  .dd-menu { position:absolute; top:calc(100% + 8px); right:0; min-width:200px;
    background:#111; border:1px solid #262626; border-radius:12px; padding:8px;
    box-shadow:0 16px 40px rgba(0,0,0,.6); z-index:400; }
  .dd-email { padding:8px 10px 10px; font-size:11px; font-weight:600; color:#555;
    border-bottom:1px solid #262626; margin-bottom:6px; word-break:break-all; }
  .dd-item { display:flex; align-items:center; gap:8px; width:100%; padding:9px 10px;
    border-radius:8px; font-family:'Syne',sans-serif; font-size:12px; font-weight:600;
    cursor:pointer; border:none; background:transparent; color:#888; transition:all .15s; }
  .dd-item:hover { background:#181818; color:#f0f0f0; }
  .dd-item.danger:hover { background:rgba(255,77,77,.1); color:#ff4d4d; }

  /* Account modal extras */
  .acc-stat { display:inline-flex; align-items:center; gap:6px; padding:5px 12px;
    border-radius:20px; font-size:11px; font-weight:700; margin-bottom:18px; }
  .acc-stat.free { background:rgba(255,255,255,.06); border:1px solid #343434; color:#666; }
  .acc-stat.pro  { background:rgba(245,158,11,.12); border:1px solid rgba(245,158,11,.3);
    background-clip:text; }
  .acc-pro-txt { background:linear-gradient(135deg,#f59e0b,#ef4444);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .acc-sep { height:1px; background:#262626; margin:16px 0; }
  .acc-section-lbl { font-size:9px; font-weight:800; letter-spacing:2px; color:#333;
    text-transform:uppercase; margin-bottom:10px; }

  /* Modal auth */
  .modal-overlay { position:fixed; inset:0; z-index:500; background:rgba(0,0,0,.7);
    backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center;
    padding:16px; }
  .modal { background:#111; border:1px solid #262626; border-radius:20px; padding:28px;
    width:100%; max-width:380px; }
  .modal-title { font-family:'Bebas Neue',sans-serif; font-size:26px; letter-spacing:3px;
    color:#f0f0f0; margin-bottom:4px; }
  .modal-sub { font-size:12px; color:#555; font-weight:500; margin-bottom:20px; }
  .modal-input { width:100%; background:#181818; border:1px solid #262626;
    border-radius:10px; color:#f0f0f0; font-family:'Syne',sans-serif; font-size:14px;
    font-weight:500; padding:12px; outline:none; margin-bottom:10px; transition:border .15s; }
  .modal-input:focus { border-color:#343434; }
  .modal-input::placeholder { color:#333; }
  .modal-err { font-size:11px; color:#ff4d4d; font-weight:600; margin-bottom:10px; }
  .modal-or { display:flex; align-items:center; gap:10px; margin:14px 0;
    font-size:11px; font-weight:700; color:#333; }
  .modal-or::before,.modal-or::after { content:''; flex:1; height:1px; background:#262626; }
  .modal-google { display:flex; align-items:center; justify-content:center; gap:8px;
    width:100%; padding:12px; border-radius:10px; border:1px solid #343434;
    background:transparent; color:#888; font-family:'Syne',sans-serif; font-size:13px;
    font-weight:700; cursor:pointer; transition:all .15s; margin-bottom:12px; }
  .modal-google:hover { background:#181818; color:#f0f0f0; border-color:#555; }
  .modal-switch { font-size:12px; color:#555; font-weight:500; text-align:center;
    cursor:pointer; }
  .modal-switch span { color:#f0f0f0; text-decoration:underline; }
`

// ─── SAVE STATUS INDICATOR ────────────────────────────────────
function SaveStatus({ status, onUpgrade }) {
  const map = {
    idle:    { label: '',                  cls: 'save-idle'   },
    saving:  { label: '⟳ Sauvegarde…',    cls: 'save-saving' },
    saved:   { label: '✓ Sauvegardé',      cls: 'save-saved'  },
    error:   { label: '✕ Erreur',          cls: 'save-error'  },
    limit:   { label: '⚠ Limite — Passer Pro', cls: 'save-limit' },
  }
  const { label, cls } = map[status] || map.idle
  if (!label) return null
  return (
    <div className={`save-dot ${cls}`}
      onClick={status === 'limit' ? onUpgrade : undefined}>
      {label}
    </div>
  )
}

// ─── AUTH MODAL ───────────────────────────────────────────────
function AuthModal({ onClose, onSuccess }) {
  const [tab, setTab]     = useState('login')  // login | signup
  const [email, setEmail] = useState('')
  const [pass, setPass]   = useState('')
  const [err, setErr]     = useState('')
  const [loading, setL]   = useState(false)

  const submit = async () => {
    setErr(''); setL(true)
    try {
      const fn = tab === 'login' ? signInWithEmail : signUpWithEmail
      const { error } = await fn(email, pass)
      if (error) throw error
      if (tab === 'signup') {
        setErr('✓ Vérifie ton email pour confirmer ton compte.')
      } else {
        onSuccess?.()
        onClose()
      }
    } catch (e) {
      setErr(e.message)
    } finally {
      setL(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">{tab === 'login' ? 'CONNEXION' : 'INSCRIPTION'}</div>
        <div className="modal-sub">
          {tab === 'login' ? 'Content de te revoir 👋' : 'Crée ton compte gratuitement'}
        </div>
        <button className="modal-google" onClick={() => { signInWithGoogle(); onClose(); }}>
          <svg width="16" height="16" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continuer avec Google
        </button>
        <div className="modal-or">ou</div>
        <input className="modal-input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
        <input className="modal-input" type="password" placeholder="Mot de passe" value={pass} onChange={e => setPass(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}/>
        {err && <div className="modal-err">{err}</div>}
        <button className="auth-btn primary" style={{width:'100%',padding:'12px',fontSize:'13px',marginBottom:'12px'}}
          onClick={submit} disabled={loading}>
          {loading ? '…' : tab === 'login' ? 'Se connecter' : "S'inscrire"}
        </button>
        <div className="modal-switch">
          {tab === 'login' ? <>Pas de compte ? <span onClick={() => { setTab('signup'); setErr('') }}>S'inscrire</span></> :
            <>Déjà un compte ? <span onClick={() => { setTab('login'); setErr('') }}>Se connecter</span></>}
        </div>
      </div>
    </div>
  )
}

// ─── ACCOUNT MODAL ────────────────────────────────────────────
function AccountModal({ user, profile, onClose, onUpgrade }) {
  const [resetSent, setResetSent] = useState(false)
  const [resetErr,  setResetErr]  = useState('')
  const isPremium = profile?.is_premium ?? false

  const handleReset = async () => {
    setResetErr('')
    try {
      const { error } = await resetPassword(user.email)
      if (error) throw error
      setResetSent(true)
    } catch(e) {
      setResetErr(e.message)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
          <div className="modal-title">MON COMPTE</div>
          <button style={{background:'none',border:'none',color:'#555',cursor:'pointer',fontSize:18,padding:'2px 6px'}} onClick={onClose}>✕</button>
        </div>

        {/* Email */}
        <div style={{fontSize:11,fontWeight:600,color:'#555',marginBottom:8}}>Email</div>
        <div style={{fontSize:14,fontWeight:700,color:'#f0f0f0',marginBottom:16,wordBreak:'break-all'}}>{user.email}</div>

        {/* Statut abonnement */}
        <div style={{fontSize:11,fontWeight:600,color:'#555',marginBottom:8}}>Abonnement</div>
        {isPremium ? (
          <div className="acc-stat pro">
            <span className="acc-pro-txt">✦ Plan Pro — actif</span>
          </div>
        ) : (
          <div className="acc-stat free">Plan Gratuit · 3 carrousels max</div>
        )}

        {/* Upgrade si pas premium */}
        {!isPremium && (
          <button className="upg-btn" style={{width:'100%',padding:'12px',fontSize:13,marginBottom:16,borderRadius:10}}
            onClick={() => { onUpgrade(); onClose(); }}>
            ⚡ Passer en Pro — 9€/mois
          </button>
        )}

        <div className="acc-sep"/>

        {/* Réinitialiser mot de passe */}
        <div className="acc-section-lbl">Sécurité</div>
        {resetSent ? (
          <div style={{fontSize:12,color:'#3ddc84',fontWeight:600,padding:'10px 0'}}>
            ✓ Email de réinitialisation envoyé à {user.email}
          </div>
        ) : (
          <>
            <button className="auth-btn" style={{width:'100%',padding:'10px',marginBottom:6}}
              onClick={handleReset}>
              🔑 Réinitialiser le mot de passe
            </button>
            {resetErr && <div className="modal-err">{resetErr}</div>}
          </>
        )}

        <div className="acc-sep"/>

        {/* Déconnexion */}
        <button className="auth-btn" style={{width:'100%',padding:'10px',color:'#ff4d4d',borderColor:'rgba(255,77,77,.25)'}}
          onClick={() => { signOut(); onClose(); }}>
          ↩ Se déconnecter
        </button>
      </div>
    </div>
  )
}

// ─── NAVBAR ───────────────────────────────────────────────────
export default function Navbar({ user, profile, saveStatus, children }) {
  const [showModal,   setShowModal]   = useState(false)
  const [showDd,      setShowDd]      = useState(false)
  const [showAccount, setShowAccount] = useState(false)
  const ddRef                         = useRef(null)
  const isPremium                     = profile?.is_premium ?? false

  // Ferme le dropdown en cliquant ailleurs
  useEffect(() => {
    const handler = e => { if (ddRef.current && !ddRef.current.contains(e.target)) setShowDd(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const onUpgrade = () => handleCheckout(user)

  return (
    <>
      <style>{css}</style>

      <nav className="nb">
        <div className="nb-inner">
          {/* Logo */}
          <div className="nb-logo">
            <div className="nb-logo-sq"><span>C</span></div>
            CarrouselPro
          </div>

          {/* Centre : tabs ou autre contenu passé en enfant */}
          <div style={{flex:1, display:'flex', justifyContent:'center'}}>
            {children}
          </div>

          {/* Droite */}
          <div className="nb-right">
            {/* Indicateur de sauvegarde */}
            {user && <SaveStatus status={saveStatus} onUpgrade={onUpgrade}/>}

            {/* Bouton upgrade si pas premium */}
            {user && !isPremium && (
              <button className="upg-btn" onClick={onUpgrade}>
                ⚡ Passer Pro
              </button>
            )}

            {/* Badge premium */}
            {user && isPremium && (
              <span className="prem-badge">✦ PRO</span>
            )}

            {/* Pas connecté */}
            {!user && (
              <button className="auth-btn primary" onClick={() => setShowModal(true)}>
                Connexion
              </button>
            )}

            {/* Connecté : avatar + dropdown */}
            {user && (
              <div className="dd" ref={ddRef}>
                {profile?.avatar_url
                  ? <img src={profile.avatar_url} alt="" className="avatar" onClick={() => setShowDd(d => !d)}/>
                  : <div className="avatar-placeholder" onClick={() => setShowDd(d => !d)}>
                      {(user.email?.[0] ?? '?').toUpperCase()}
                    </div>
                }
                {showDd && (
                  <div className="dd-menu">
                    <div className="dd-email">{user.email}</div>
                    {!isPremium && (
                      <button className="dd-item" style={{color:'#f59e0b'}}
                        onClick={() => { onUpgrade(); setShowDd(false) }}>
                        ⚡ Passer en Pro
                      </button>
                    )}
                    <button className="dd-item" onClick={() => { setShowAccount(true); setShowDd(false) }}>
                      👤 Mon compte
                    </button>
                    <button className="dd-item danger" onClick={() => { signOut(); setShowDd(false) }}>
                      ↩ Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {showModal && <AuthModal onClose={() => setShowModal(false)}/>}
      {showAccount && user && (
        <AccountModal
          user={user}
          profile={profile}
          onClose={() => setShowAccount(false)}
          onUpgrade={onUpgrade}
        />
      )}
    </>
  )
}
