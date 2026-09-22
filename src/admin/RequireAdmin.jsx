import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getSession } from './adminApi'

export default function RequireAdmin({ children }) {
  const [status, setStatus] = useState('checking') // checking | in | out

  useEffect(() => {
    let cancelled = false
    getSession()
      .then(({ authenticated }) => {
        if (!cancelled) setStatus(authenticated ? 'in' : 'out')
      })
      .catch(() => {
        if (!cancelled) setStatus('out')
      })
    return () => { cancelled = true }
  }, [])

  if (status === 'checking') return null
  if (status === 'out') return <Navigate to="/admin/login" replace />
  return children
}
