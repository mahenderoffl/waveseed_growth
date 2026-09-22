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

export function getLeads(q = '', status = '') {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (status) params.set('status', status)
  const query = params.toString() ? `?${params.toString()}` : ''
  return request(`/api/admin/leads${query}`)
}

export function deleteLead(id) {
  return request(`/api/admin/leads/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export function updateLeadStatus(id, status) {
  return request(`/api/admin/leads/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export function getSettings() {
  // Reading settings needs no auth — they're already public on the site.
  // Only writing them (updateSettings, below) goes through the admin route.
  return request('/api/settings')
}

export function updateSettings(data) {
  return request('/api/admin/settings', { method: 'PUT', body: JSON.stringify(data) })
}

export function getTestimonials() {
  return request('/api/admin/testimonials')
}

export function createTestimonial(data) {
  return request('/api/admin/testimonials', { method: 'POST', body: JSON.stringify(data) })
}

export function updateTestimonial(id, data) {
  return request(`/api/admin/testimonials/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(data) })
}

export function deleteTestimonial(id) {
  return request(`/api/admin/testimonials/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export function getCaseStudies() {
  return request('/api/admin/case-studies')
}

export function createCaseStudy(data) {
  return request('/api/admin/case-studies', { method: 'POST', body: JSON.stringify(data) })
}

export function updateCaseStudy(id, data) {
  return request(`/api/admin/case-studies/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(data) })
}

export function deleteCaseStudy(id) {
  return request(`/api/admin/case-studies/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
