import Papa from 'papaparse'
import type { ReportRecord } from '../services/firestore'

export function exportToCsv(filename: string, rows: ReportRecord[]) {
  const data = rows.map((r) => {
    const createdAtDate = r.createdAt ? r.createdAt.toDate() : null
    return {
      id: r.id,
      types: Array.isArray(r.types) ? r.types.join('|') : '',
      severity: r.severity,
      lat: r.location.lat,
      lng: r.location.lng,
      createdAt: createdAtDate ? createdAtDate.toISOString() : '',
      reporter: r.createdBy?.displayName || r.createdBy?.email || '',
    }
  })
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


