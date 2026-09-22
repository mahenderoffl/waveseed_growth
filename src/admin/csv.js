function escapeCsvValue(value) {
  const str = value == null ? '' : String(value)
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
}

export function downloadCsv(filename, columns, rows) {
  const header = columns.map((c) => escapeCsvValue(c.label)).join(',')
  const lines = rows.map((row) => columns.map((c) => escapeCsvValue(c.value(row))).join(','))
  const csv = [header, ...lines].join('\r\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
