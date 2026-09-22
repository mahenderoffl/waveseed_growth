import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from './adminApi'
import styles from './AdminLogin.module.css'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(password)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message === 'Invalid password' ? 'Incorrect password.' : 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h1 className={styles.title}>Admin Login</h1>
        <p className={styles.subtitle}>Sign in to view leads.</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <div>
            <label className="field-label" htmlFor="password">Password</label>
            <input
              className="field-input"
              id="password"
              type="password"
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-teal btn-full" disabled={loading || !password}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
