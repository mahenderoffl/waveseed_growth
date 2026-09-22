import { useEffect, useState } from 'react'
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from './adminApi'
import AdminLayout from './AdminLayout'
import shared from './AdminShared.module.css'
import styles from './TestimonialsPage.module.css'

const BLANK = { name: '', description: '', url: '', initials: '', color: '#00a387', order: 0 }

export default function TestimonialsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null) // null | 'new' | id
  const [form, setForm] = useState(BLANK)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const load = () => {
    setLoading(true)
    getTestimonials()
      .then(({ testimonials }) => setItems(testimonials))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const startNew = () => { setForm({ ...BLANK, order: items.length }); setEditingId('new') }
  const startEdit = (t) => { setForm(t); setEditingId(t.id) }
  const cancelEdit = () => { setEditingId(null); setForm(BLANK) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      if (editingId === 'new') {
        const { testimonial } = await createTestimonial(form)
        setItems((prev) => [...prev, testimonial].sort((a, b) => a.order - b.order))
      } else {
        const { testimonial } = await updateTestimonial(editingId, form)
        setItems((prev) => prev.map((t) => (t.id === editingId ? testimonial : t)).sort((a, b) => a.order - b.order))
      }
      cancelEdit()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await deleteTestimonial(id)
      setItems((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminLayout
      title="Testimonials"
      actions={
        editingId === null && (
          <button className="btn btn-teal" onClick={startNew}>Add Project</button>
        )
      }
    >
      {error && <p className={shared.errorBanner} role="alert">{error}</p>}

      {editingId !== null && (
        <div className={shared.formCard}>
          <h2 className={shared.formTitle}>{editingId === 'new' ? 'New Project' : 'Edit Project'}</h2>
          <form onSubmit={handleSubmit}>
            <div className={`${shared.formGrid} ${shared.full}`}>
              <div className={shared.formRow}>
                <label className="field-label" htmlFor="description">Description</label>
                <textarea
                  className="field-input" id="description" rows={3} required
                  placeholder="One honest line about the project — no invented results."
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
            </div>
            <div className={shared.formGrid}>
              <div className={shared.formRow}>
                <label className="field-label" htmlFor="name">Project / Client Name</label>
                <input
                  className="field-input" id="name" required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className={shared.formRow}>
                <label className="field-label" htmlFor="url">Live Site URL</label>
                <input
                  className="field-input" id="url" type="url" required placeholder="https://example.com"
                  value={form.url}
                  onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                />
              </div>
              <div className={shared.formRow}>
                <label className="field-label" htmlFor="initials">Badge Initials</label>
                <input
                  className="field-input" id="initials" required maxLength={3}
                  value={form.initials}
                  onChange={(e) => setForm((f) => ({ ...f, initials: e.target.value.toUpperCase() }))}
                />
              </div>
              <div className={shared.formRow}>
                <label className="field-label" htmlFor="color">Badge Color</label>
                <div className={styles.colorInput}>
                  <input
                    className={styles.colorSwatch} id="color" type="color"
                    value={form.color}
                    onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                  />
                  <input
                    className="field-input"
                    value={form.color}
                    onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                  />
                </div>
              </div>
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
          <p className={shared.loadingState}>Loading projects…</p>
        ) : items.length === 0 ? (
          <p className={shared.emptyState}>No projects yet. The site is showing its built-in defaults until you add some here.</p>
        ) : (
          <table className={shared.table}>
            <thead>
              <tr>
                <th>Project</th>
                <th>Description</th>
                <th>URL</th>
                <th>Order</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t.id}>
                  <td>
                    <div className={styles.avatarCell}>
                      <div className={styles.avatar} style={{ background: t.color }}>{t.initials}</div>
                      <div style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{t.name}</div>
                    </div>
                  </td>
                  <td className={styles.quoteCell}>{t.description}</td>
                  <td><a href={t.url} target="_blank" rel="noopener noreferrer">{t.url}</a></td>
                  <td>{t.order}</td>
                  <td>
                    <div className={shared.rowActions}>
                      <button className={shared.editBtn} onClick={() => startEdit(t)}>Edit</button>
                      <button
                        className={shared.deleteBtn}
                        onClick={() => handleDelete(t.id)}
                        disabled={deletingId === t.id}
                      >
                        {deletingId === t.id ? 'Deleting…' : 'Delete'}
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
