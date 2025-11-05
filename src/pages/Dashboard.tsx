import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import L from 'leaflet'
import type { LatLngExpression } from 'leaflet'
import { isWithinBangaloreRadius, BANGALORE_CENTER } from '../utils/geo'
import 'leaflet.markercluster'
import toast, { Toaster } from 'react-hot-toast'
import type { ReportRecord } from '../services/firestore'

type ReportDoc = ReportRecord

function createSeverityIcon(severity: string) {
  const color = severity === 'Critical' ? '#ef4444' : severity === 'High' ? '#f97316' : severity === 'Medium' ? '#eab308' : '#22c55e'
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 24 36"><path d="M12 0C5.373 0 0 5.373 0 12c0 8.25 12 24 12 24s12-15.75 12-24C24 5.373 18.627 0 12 0z" fill="${color}"/><circle cx="12" cy="12" r="5" fill="white"/></svg>`
  )
  return L.icon({ iconUrl: `data:image/svg+xml;charset=UTF-8,${svg}`, iconSize: [24,36], iconAnchor: [12,36], popupAnchor: [0,-28] })
}

export default function Dashboard() {
  const [reports, setReports] = useState<ReportDoc[]>([])
  const [severityFilter, setSeverityFilter] = useState<string>('All')
  const [typeFilter, setTypeFilter] = useState<string[]>([])

  useEffect(() => {
    async function sub() {
      try {
        const { listenToReports } = await import('../services/firestore')
        return listenToReports((docs) => {
          const filteredDocs = docs.filter((doc) => isWithinBangaloreRadius(doc.location))
          setReports(filteredDocs)
        })
      } catch (error) {
        console.error(error)
        toast.error('Failed to load reports')
      }
    }
    const unsubPromise = sub()
    return () => {
      Promise.resolve(unsubPromise).then((unsubscribe) => {
        if (typeof unsubscribe === 'function') {
          unsubscribe()
        }
      })
    }
  }, [])

  const allTypes = useMemo(() => Array.from(new Set(reports.flatMap(r => r.types))).sort(), [reports])

  const filtered = useMemo(() => {
    return reports.filter(r => {
      const sevOk = severityFilter === 'All' || r.severity === severityFilter
      const typesOk = typeFilter.length === 0 || typeFilter.every(t => r.types.includes(t))
      return sevOk && typesOk
    })
  }, [reports, severityFilter, typeFilter])

  // Build marker cluster using the map instance from React-Leaflet
  function ClusterLayer({ points }: { points: ReportDoc[] }) {
    const map = useMap()
    const [layer] = useState(() => L.markerClusterGroup())

    useEffect(() => {
      map.addLayer(layer)
      return () => {
        try {
          map.removeLayer(layer)
        } catch (error) {
          console.error('Failed to remove marker layer', error)
        }
      }
    }, [map, layer])

    useEffect(() => {
      layer.clearLayers()
      points.forEach((r) => {
        const icon = createSeverityIcon(r.severity)
        const marker = L.marker([r.location.lat, r.location.lng] as LatLngExpression, { icon })
        const time = r.createdAt ? r.createdAt.toDate() : new Date()
        marker.bindPopup(`<div><div class="text-sm font-medium">${r.types.join(', ')}</div><div class="text-xs mt-1">Severity: ${r.severity}</div><div class="text-xs text-gray-500 mt-1">${time.toLocaleString()}</div></div>`)
        layer.addLayer(marker)
      })
    }, [points, layer])
    return null
  }

  return (
    <div className="flex">
      <Toaster />
      <aside className="w-80 border-r bg-gray-50/60 p-5 space-y-4 hidden md:block">
        <div>
          <div className="text-sm font-medium mb-2">Severity</div>
          <select value={severityFilter} onChange={(e)=>setSeverityFilter(e.target.value)} className="w-full border rounded px-3 py-2">
            {['All','Low','Medium','High','Critical'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <div className="text-sm font-medium mb-2">Waste Types</div>
          <div className="space-y-2 max-h-64 overflow-auto pr-2">
            {allTypes.map(t => (
              <label key={t} className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="accent-black" checked={typeFilter.includes(t)} onChange={() => setTypeFilter(prev => prev.includes(t) ? prev.filter(x=>x!==t) : [...prev, t])} />
                {t}
              </label>
            ))}
          </div>
          <button className="mt-3 text-xs underline" onClick={()=>setTypeFilter([])}>Clear</button>
        </div>
        <button
          className="w-full mt-4 px-3 py-2 border rounded"
          onClick={async ()=>{
            const { exportToCsv } = await import('../utils/csv')
            exportToCsv('trashtrackr_reports.csv', filtered)
          }}
        >Export CSV</button>
      </aside>
      <div className="flex-1 h-[calc(100vh-64px)]">
        <MapContainer center={[BANGALORE_CENTER.lat, BANGALORE_CENTER.lng]} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClusterLayer points={filtered} />
        </MapContainer>
      </div>
    </div>
  )
}


