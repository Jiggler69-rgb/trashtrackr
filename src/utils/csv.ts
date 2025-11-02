import Papa from 'papaparse'

export function exportToCsv(filename: string, rows: any[]) {
  const data = rows.map(r => ({
    id: r.id,
    types: Array.isArray(r.types) ? r.types.join('|') : '',
    severity: r.severity,
    lat: r.location?.lat,
    lng: r.location?.lng,
    createdAt: (r.createdAt?.toDate ? r.createdAt.toDate() : new Date(r.createdAt || Date.now())).toISOString(),
  }))
  const csv = Papa.unparse(data)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}


