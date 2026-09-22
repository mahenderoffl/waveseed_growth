import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from './adminApi'
import styles from './AdminLayout.module.css'

const TABS = [
  { to: '/admin', label: 'Leads', end: true },
  { to: '/admin/testimonials', label: 'Testimonials' },
  { to: '/admin/case-studies', label: 'Case Studies' },
  { to: '/admin/settings', label: 'Settings' },
]

export default function AdminLayout({ title, actions, children }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try { await logout() } finally { navigate('/admin/login', { replace: true }) }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.headerActions}>
            {actions}
            <button className={`btn btn-outline ${styles.logoutBtn}`} onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </div>
        <nav className={styles.tabs}>
          {TABS.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) => `${styles.tab} ${isActive ? styles.tabActive : ''}`}
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
