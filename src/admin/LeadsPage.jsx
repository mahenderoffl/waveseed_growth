import { useEffect, useMemo, useState } from 'react'
import { getLeads, deleteLead, updateLeadStatus } from './adminApi'
import { downloadCsv } from './csv'
import AdminLayout from './AdminLayout'
import shared from './AdminShared.module.css'
import styles from './LeadsPage.module.css'

const SERVICE_LABELS = {
  grow: 'Grow (SEO / Marketing)',
  build: 'Build (Website / App)',
  brand: 'Brand (Identity)',
  scale: 'Scale (CRO / Automation)',
  all: 'All of the above',
}

const STATUS_LABELS = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  QUALIFIED: 'Qualified',
  CONVERTED: 'Converted',
}

const STATUS_CLASS = {
  NEW: styles.statusNew,
  CONTACTED: styles.statusContacted,
  QUALIFIED: styles.statusQualified,
  CONVERTED: styles.statusConverted,
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export default function LeadsPage() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    const timer = setTimeout(() => {
      getLeads(search, statusFilter)
        .then(({ leads }) => { if (!cancelled) setLeads(leads) })
        .catch((err) => { if (!cancelled) setError(err.message) })
        .finally(() => { if (!cancelled) setLoading(false) })
    }, search ? 300 : 0)

    return () => { cancelled = true; clearTimeout(timer) }
  }, [search, statusFilter])

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

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id)
    const prevLeads = leads
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
    try {
      await updateLeadStatus(id, status)
    } catch (err) {
      setLeads(prevLeads)
      setError(err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleExport = () => {
    downloadCsv(
      `leads-${new Date().toISOString().slice(0, 10)}.csv`,
      [
        { label: 'Name', value: (l) => l.name },
        { label: 'Email', value: (l) => l.email },
        { label: 'Phone', value: (l) => l.phone },
        { label: 'Company', value: (l) => l.company },
        { label: 'Interested In', value: (l) => SERVICE_LABELS[l.service] ?? l.service },
        { label: 'Status', value: (l) => STATUS_LABELS[l.status] ?? l.status },
        { label: 'Message', value: (l) => l.message },
        { label: 'Received', value: (l) => new Date(l.createdAt).toISOString() },
      ],
      leads,
    )
  }

  return (
    <AdminLayout
      title="Leads"
      actions={
        <button className="btn btn-outline" onClick={handleExport} disabled={leads.length === 0}>
          Export CSV
        </button>
      }
    >
      {error && <p className={shared.errorBanner} role="alert">{error}</p>}

      <div className={shared.toolbar}>
        <div className={shared.stats}>
          <div className={shared.statCard}>
            <div className={shared.statValue}>{stats.total}</div>
            <div className={shared.statLabel}>Total Leads</div>
          </div>
          <div className={shared.statCard}>
            <div className={shared.statValue}>{stats.thisWeek}</div>
            <div className={shared.statLabel}>Last 7 Days</div>
          </div>
        </div>
        <div className={styles.toolbarRight}>
          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <div className={shared.searchBox}>
            <input
              className="field-input"
              type="search"
              placeholder="Search name, email, phone, company…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={shared.tableWrap}>
        {loading ? (
          <p className={shared.loadingState}>Loading leads…</p>
        ) : leads.length === 0 ? (
          <p className={shared.emptyState}>
            {search || statusFilter ? 'No leads match your filters.' : 'No leads yet. They’ll show up here as soon as someone submits the contact form.'}
          </p>
        ) : (
          <table className={shared.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
                <th>Interested In</th>
                <th>Status</th>
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
                      ? <span className={shared.badge}>{SERVICE_LABELS[lead.service] ?? lead.service}</span>
                      : '—'}
                  </td>
                  <td>
                    <select
                      className={`${styles.statusSelect} ${STATUS_CLASS[lead.status] ?? ''}`}
                      value={lead.status ?? 'NEW'}
                      disabled={updatingId === lead.id}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    >
                      {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td className={styles.messageCell}>{lead.message || '—'}</td>
                  <td className={styles.dateCell}>{dateFormatter.format(new Date(lead.createdAt))}</td>
                  <td>
                    <button
                      className={shared.deleteBtn}
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
    </AdminLayout>
  )
}
