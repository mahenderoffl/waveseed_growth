import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLeads, deleteLead, logout } from './adminApi'
import styles from './AdminDashboard.module.css'

const SERVICE_LABELS = {
  grow: 'Grow (SEO / Marketing)',
  build: 'Build (Website / App)',
  brand: 'Brand (Identity)',
  scale: 'Scale (CRO / Automation)',
  all: 'All of the above',
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    const timer = setTimeout(() => {
      getLeads(search)
        .then(({ leads }) => { if (!cancelled) setLeads(leads) })
        .catch((err) => { if (!cancelled) setError(err.message) })
        .finally(() => { if (!cancelled) setLoading(false) })
    }, search ? 300 : 0)

    return () => { cancelled = true; clearTimeout(timer) }
  }, [search])

  const stats = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const thisWeek = leads.filter((l) => new Date(l.createdAt).getTime() >= weekAgo).length
    return { total: leads.length, thisWeek }
  }, [leads])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await deleteLead(id)
      setLeads((prev) => prev.filter((l) => l.id !== id))
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  const handleLogout = async () => {
    try { await logout() } finally { navigate('/admin/login', { replace: true }) }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Leads</h1>
        <div className={styles.headerActions}>
          <button className={`btn btn-outline ${styles.logoutBtn}`} onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </header>

      <main className={styles.main}>
        {error && <p className={styles.errorBanner} role="alert">{error}</p>}

        <div className={styles.toolbar}>
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{stats.total}</div>
              <div className={styles.statLabel}>Total Leads</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{stats.thisWeek}</div>
              <div className={styles.statLabel}>Last 7 Days</div>
            </div>
          </div>
          <div className={styles.searchBox}>
            <input
              className="field-input"
              type="search"
              placeholder="Search name, email, phone, company…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.tableWrap}>
          {loading ? (
            <p className={styles.loadingState}>Loading leads…</p>
          ) : leads.length === 0 ? (
            <p className={styles.emptyState}>
              {search ? 'No leads match your search.' : 'No leads yet. They’ll show up here as soon as someone submits the contact form.'}
            </p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Company</th>
                  <th>Interested In</th>
                  <th>Message</th>
                  <th>Received</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td className={styles.nameCell}>{lead.name}</td>
                    <td className={styles.emailCell}>
                      <a href={`mailto:${lead.email}`}>{lead.email}</a>
                    </td>
                    <td className={styles.phoneCell}>
                      {lead.phone ? <a href={`tel:${lead.phone}`}>{lead.phone}</a> : '—'}
                    </td>
                    <td>{lead.company || '—'}</td>
                    <td>
                      {lead.service
                        ? <span className={styles.badge}>{SERVICE_LABELS[lead.service] ?? lead.service}</span>
                        : '—'}
                    </td>
                    <td className={styles.messageCell}>{lead.message || '—'}</td>
                    <td className={styles.dateCell}>{dateFormatter.format(new Date(lead.createdAt))}</td>
                    <td>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(lead.id)}
                        disabled={deletingId === lead.id}
                      >
                        {deletingId === lead.id ? 'Deleting…' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
