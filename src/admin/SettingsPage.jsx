import { useEffect, useState } from 'react'
import { getSettings, updateSettings } from './adminApi'
import AdminLayout from './AdminLayout'
import shared from './AdminShared.module.css'
import styles from './SettingsPage.module.css'

export default function SettingsPage() {
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getSettings()
      .then(({ settings }) => {
        setContactEmail(settings.contactEmail)
        setContactPhone(settings.contactPhone)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      await updateSettings({ contactEmail, contactPhone })
      setSaved(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout title="Settings">
      {error && <p className={shared.errorBanner} role="alert">{error}</p>}
      {saved && <p className={styles.successNote}>Saved. The site now shows these values.</p>}

      {loading ? (
        <p className={shared.loadingState}>Loading settings…</p>
      ) : (
        <div className={styles.card}>
          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className="field-label" htmlFor="contactEmail">Contact Email</label>
              <input
                className="field-input"
                id="contactEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => { setContactEmail(e.target.value); setSaved(false) }}
                required
              />
            </div>
            <div className={styles.field}>
              <label className="field-label" htmlFor="contactPhone">Contact Phone</label>
              <input
                className="field-input"
                id="contactPhone"
                type="tel"
                value={contactPhone}
                onChange={(e) => { setContactPhone(e.target.value); setSaved(false) }}
                required
              />
            </div>
            <button type="submit" className="btn btn-teal" disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}
    </AdminLayout>
  )
}
