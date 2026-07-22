import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/roster', label: 'Roster', end: false },
  { to: '/teams', label: 'Teams', end: false },
  { to: '/stages', label: 'Stages', end: false },
  { to: '/progress', label: 'Progress', end: false },
]

export function Layout() {
  return (
    <div className="app-shell">
      <div className="ambient" aria-hidden>
        <div className="ambient-horizon" />
        <div className="ambient-beam a" />
        <div className="ambient-beam b" />
        <div className="ambient-glow a" />
        <div className="ambient-glow b" />
        <div className="ambient-glow c" />
        <div className="ambient-grid" />
        <div className="ambient-dust" />
        <div className="ambient-scan" />
        <div className="ambient-scanline" />
        <div className="ambient-vignette" />
        <div className="ambient-burst-ring" />
      </div>

      <div className="hazard-bar" aria-hidden>
        <span>OUTPOST ONLINE</span>
        <span className="hazard-sep">//</span>
        <span>LOCAL DATA ONLY</span>
        <span className="hazard-sep">//</span>
        <span>NO ACCOUNT LINK</span>
        <span className="hazard-sep">//</span>
        <span>COMMANDER TERMINAL</span>
        <span className="hazard-sep">//</span>
        <span>BURST READY</span>
      </div>

      <header className="topbar">
        <NavLink to="/" className="brand">
          <span className="brand-mark-wrap">
            <img className="brand-mark" src="/pwa-192.png" alt="" width={40} height={40} />
            <span className="brand-ring" />
            <span className="brand-crosshair" />
          </span>
          <span className="brand-text">
            <span className="brand-title glitch-text" data-text="NIKKE">
              NIKKE
            </span>
            <span className="brand-sub">
              Companion // Outpost
              <span className="cursor-blink" aria-hidden />
            </span>
          </span>
        </NavLink>
        <nav className="nav" aria-label="Primary">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              <span className="nav-index">{String(links.indexOf(l)).padStart(2, '0')}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <span className="footer-tag">ARK LINK</span>
        Fan-made aide · Not affiliated with Shift Up / Level Infinite
      </footer>
    </div>
  )
}
