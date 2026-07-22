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
        <div className="ambient-glow a" />
        <div className="ambient-glow b" />
        <div className="ambient-scan" />
      </div>
      <header className="topbar">
        <NavLink to="/" className="brand">
          <img className="brand-mark" src="/pwa-192.png" alt="" width={36} height={36} />
          <span className="brand-text">
            <span className="brand-title">Nikke</span>
            <span className="brand-sub">Companion</span>
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
              {l.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">Fan-made aide · Not affiliated with Shift Up / Level Infinite</footer>
    </div>
  )
}
