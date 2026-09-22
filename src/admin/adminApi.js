async function request(path, options = {}) {
  const res = await fetch(path, {
    credentials: 'include',
    headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    ...options,
  })

  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const body = await res.json()
      if (body?.error) message = body.error
    } catch {
      // response had no JSON body
    }
    throw new Error(message)
  }

  if (res.status === 204) return null
  return res.json()
}

export function getSession() {
  return request('/api/admin/session')
}

export function login(password) {
  return request('/api/admin/login', { method: 'POST', body: JSON.stringify({ password }) })
}

export function logout() {
  return request('/api/admin/logout', { method: 'POST' })
}

export function getLeads(q = '') {
  const query = q ? `?q=${encodeURIComponent(q)}` : ''
  return request(`/api/admin/leads${query}`)
}

export function deleteLead(id) {
  return request(`/api/admin/leads/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
