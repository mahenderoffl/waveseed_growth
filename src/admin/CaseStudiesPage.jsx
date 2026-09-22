import { useEffect, useState } from 'react'
import { getCaseStudies, createCaseStudy, updateCaseStudy, deleteCaseStudy } from './adminApi'
import AdminLayout from './AdminLayout'
import shared from './AdminShared.module.css'
import styles from './CaseStudiesPage.module.css'

const BLANK_METRICS = [{ num: '', label: '' }, { num: '', label: '' }, { num: '', label: '' }]
const BLANK = {
  tag: '', client: '', headline: '', desc: '',
  metrics: BLANK_METRICS, featured: false,
  accentBg: '', accentBorder: '', order: 0,
}

function normalizeMetrics(metrics) {
  const list = Array.isArray(metrics) ? metrics : []
  return [0, 1, 2].map((i) => ({ num: list[i]?.num ?? '', label: list[i]?.label ?? '' }))
}

export default function CaseStudiesPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null) // null | 'new' | id
  const [form, setForm] = useState(BLANK)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const load = () => {
    setLoading(true)
    getCaseStudies()
      .then(({ caseStudies }) => setItems(caseStudies))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const startNew = () => { setForm({ ...BLANK, order: items.length }); setEditingId('new') }
  const startEdit = (c) => { setForm({ ...c, metrics: normalizeMetrics(c.metrics) }); setEditingId(c.id) }
  const cancelEdit = () => { setEditingId(null); setForm(BLANK) }

  const updateMetric = (index, field, value) => {
    setForm((f) => ({
      ...f,
      metrics: f.metrics.map((m, i) => (i === index ? { ...m, [field]: value } : m)),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const payload = { ...form, metrics: form.metrics.filter((m) => m.num || m.label) }
    try {
      if (editingId === 'new') {
        const { caseStudy } = await createCaseStudy(payload)
        setItems((prev) => [...prev, caseStudy].sort((a, b) => a.order - b.order))
      } else {
        const { caseStudy } = await updateCaseStudy(editingId, payload)
        setItems((prev) => prev.map((c) => (c.id === editingId ? caseStudy : c)).sort((a, b) => a.order - b.order))
      }
      cancelEdit()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this case study? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await deleteCaseStudy(id)
      setItems((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminLayout
      title="Case Studies"
      actions={
        editingId === null && (
          <button className="btn btn-teal" onClick={startNew}>Add Case Study</button>
        )
      }
    >
      {error && <p className={shared.errorBanner} role="alert">{error}</p>}

      {editingId !== null && (
        <div className={shared.formCard}>
          <h2 className={shared.formTitle}>{editingId === 'new' ? 'New Case Study' : 'Edit Case Study'}</h2>
          <form onSubmit={handleSubmit}>
            <div className={shared.formGrid}>
              <div className={shared.formRow}>
                <label className="field-label" htmlFor="tag">Tag</label>
                <input
                  className="field-input" id="tag" required placeholder="SEO + Content"
                  value={form.tag}
                  onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
                />
              </div>
              <div className={shared.formRow}>
                <label className="field-label" htmlFor="client">Client</label>
                <input
                  className="field-input" id="client" required
                  value={form.client}
                  onChange={(e) => setForm((f) => ({ ...f, client: e.target.value }))}
                />
              </div>
            </div>
            <div className={`${shared.formGrid} ${shared.full}`}>
              <div className={shared.formRow}>
                <label className="field-label" htmlFor="headline">Headline</label>
                <input
                  className="field-input" id="headline" required placeholder="312% increase in organic traffic in 6 months"
                  value={form.headline}
                  onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))}
                />
              </div>
            </div>
            <div className={`${shared.formGrid} ${shared.full}`}>
              <div className={shared.formRow}>
                <label className="field-label" htmlFor="desc">Description</label>
                <textarea
                  className="field-input" id="desc" rows={3} required
                  value={form.desc}
                  onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
                />
              </div>
            </div>

            <label className="field-label">Metrics (up to 3)</label>
            <div className={styles.metricsRow}>
              {form.metrics.map((m, i) => (
                <div key={i} className={styles.metricPair}>
                  <input
                    className="field-input" placeholder="312%"
                    value={m.num}
                    onChange={(e) => updateMetric(i, 'num', e.target.value)}
                  />
                  <input
                    className="field-input" placeholder="Organic growth"
                    value={m.label}
                    onChange={(e) => updateMetric(i, 'label', e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className={shared.checkboxRow} style={{ marginBottom: 'var(--space-4)' }}>
              <input
                id="featured" type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              />
              <label htmlFor="featured">Featured (larger card, needs accent colors below)</label>
            </div>

            {form.featured && (
              <div className={shared.formGrid}>
                <div className={shared.formRow}>
                  <label className="field-label" htmlFor="accentBg">Accent Background (CSS color)</label>
                  <input
                    className="field-input" id="accentBg" placeholder="var(--teal-50)"
                    value={form.accentBg ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, accentBg: e.target.value }))}
                  />
                </div>
                <div className={shared.formRow}>
                  <label className="field-label" htmlFor="accentBorder">Accent Border (CSS color)</label>
                  <input
                    className="field-input" id="accentBorder" placeholder="var(--teal-200)"
                    value={form.accentBorder ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, accentBorder: e.target.value }))}
                  />
                </div>
              </div>
            )}

            <div className={shared.formGrid}>
              <div className={shared.formRow}>
                <label className="field-label" htmlFor="order">Display Order</label>
                <input
                  className="field-input" id="order" type="number" min={0}
                  value={form.order}
                  onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
                />
              </div>
            </div>

            <div className={shared.formActions}>
              <button type="submit" className="btn btn-teal" disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button type="button" className="btn btn-outline" onClick={cancelEdit} disabled={saving}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={shared.tableWrap}>
        {loading ? (
          <p className={shared.loadingState}>Loading case studies…</p>
        ) : items.length === 0 ? (
          <p className={shared.emptyState}>No case studies yet. The site is showing its built-in defaults until you add some here.</p>
        ) : (
          <table className={shared.table}>
            <thead>
              <tr>
                <th>Client</th>
                <th>Headline</th>
                <th>Featured</th>
                <th>Order</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id}>
                  <td className={styles.clientCell}>
                    {c.client}
                    <div><span className={shared.badge}>{c.tag}</span></div>
                  </td>
                  <td className={styles.headlineCell}>{c.headline}</td>
                  <td>{c.featured ? 'Yes' : '—'}</td>
                  <td>{c.order}</td>
                  <td>
                    <div className={shared.rowActions}>
                      <button className={shared.editBtn} onClick={() => startEdit(c)}>Edit</button>
                      <button
                        className={shared.deleteBtn}
                        onClick={() => handleDelete(c.id)}
                        disabled={deletingId === c.id}
                      >
                        {deletingId === c.id ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
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
