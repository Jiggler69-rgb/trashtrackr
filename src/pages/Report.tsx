import { useEffect, useMemo, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const WASTE_TYPES = ['Plastic','Organic','E-Waste','Metal','Construction','Paper','Other'] as const
const SEVERITIES = ['Low','Medium','High','Critical'] as const

type LatLng = { lat: number, lng: number }

function LocationSelector({ value, onChange }: { value: LatLng | null, onChange: (v: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng })
    }
  })
  return null
}

function useSeverityIcon(severity: string) {
  return useMemo(() => {
    const color = severity === 'Critical' ? '#ef4444' : severity === 'High' ? '#f97316' : severity === 'Medium' ? '#eab308' : '#22c55e'
    const svg = encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 24 36"><path d="M12 0C5.373 0 0 5.373 0 12c0 8.25 12 24 12 24s12-15.75 12-24C24 5.373 18.627 0 12 0z" fill="${color}"/><circle cx="12" cy="12" r="5" fill="white"/></svg>`
    )
    return L.icon({ iconUrl: `data:image/svg+xml;charset=UTF-8,${svg}`, iconSize: [24,36], iconAnchor: [12,36], popupAnchor: [0,-28] })
  }, [severity])
}

function AutoCenter({ target }: { target: LatLng | null }) {
  const map = useMap()
  useEffect(() => {
    if (!target) return
    const latlng = L.latLng(target.lat, target.lng)
    if (!map.getBounds().contains(latlng)) {
      map.flyTo(latlng, Math.max(map.getZoom(), 14))
    } else {
      map.panTo(latlng)
    }
  }, [target, map])
  return null
}

function clampLatLng(input: LatLng): LatLng {
  const lat = Math.max(-90, Math.min(90, input.lat))
  let lng = input.lng
  if (lng < -180 || lng > 180) {
    lng = ((lng + 180) % 360 + 360) % 360 - 180
  }
  return { lat, lng }
}

export default function Report() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [severity, setSeverity] = useState<string>('Medium')
  const [location, setLocation] = useState<LatLng | null>(null)
  const [loading, setLoading] = useState(false)
  const [latStr, setLatStr] = useState<string>('')
  const [lngStr, setLngStr] = useState<string>('')

  const icon = useSeverityIcon(severity)

  useEffect(() => {
    // Try to center map using geolocation but don't block
    if (!('geolocation' in navigator)) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      },
      () => {},
      { enableHighAccuracy: true, timeout: 5000 }
    )
  }, [])

  const toggleType = (t: string) => {
    setSelectedTypes((prev) => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  useEffect(() => {
    if (location) {
      setLatStr(location.lat.toFixed(6))
      setLngStr(location.lng.toFixed(6))
    }
  }, [location])

  function applyManualLocation() {
    const lat = parseFloat(latStr)
    const lng = parseFloat(lngStr)
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      toast.error('Enter valid latitude and longitude')
      return
    }
    const clamped = clampLatLng({ lat, lng })
    setLocation(clamped)
    toast.success('Location set')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (selectedTypes.length === 0) return toast.error('Select at least one waste type')
    if (!SEVERITIES.includes(severity as any)) return toast.error('Select a severity')
    if (!location) return toast.error('Select a location')

    try {
      setLoading(true)
      const { addReport } = await import('../services/firestore')
      await addReport({ types: selectedTypes, severity, location })
      toast.success('Report submitted')
      setSelectedTypes([])
      setSeverity('Medium')
    } catch (err) {
      toast.error('Failed to submit')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Toaster />
      <h1 className="text-2xl font-semibold">Report Trash</h1>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-xl border shadow-sm p-4">
            <label className="block text-sm font-medium mb-3">Waste Types</label>
            <div className="flex flex-wrap gap-2">
              {WASTE_TYPES.map(t => (
                <button
                  type="button"
                  key={t}
                  onClick={() => toggleType(t)}
                  className={`px-3 py-1.5 rounded-full text-sm border ${selectedTypes.includes(t) ? 'bg-black text-white border-black' : 'bg-white hover:bg-gray-50'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border shadow-sm p-4">
            <label className="block text-sm font-medium mb-3">Severity</label>
            <div className="grid grid-cols-4 gap-2">
              {SEVERITIES.map(s => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSeverity(s)}
                  className={`px-3 py-2 rounded-md border text-sm ${severity===s ? 'bg-black text-white border-black' : 'bg-white hover:bg-gray-50'}`}
                >{s}</button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border shadow-sm p-4">
            <label className="block text-sm font-medium mb-3">Coordinates (optional)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                value={latStr}
                onChange={(e)=>setLatStr(e.target.value)}
                inputMode="decimal"
                placeholder="Latitude (e.g. 12.9716)"
                className="w-full border rounded px-3 py-2"
              />
              <input
                value={lngStr}
                onChange={(e)=>setLngStr(e.target.value)}
                inputMode="decimal"
                placeholder="Longitude (e.g. 77.5946)"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <button type="button" onClick={applyManualLocation} className="mt-3 px-3 py-2 border rounded-md">Set location</button>
            <p className="mt-2 text-xs text-gray-500">Tip: You can also click on the map to pick a location.</p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2">
            <button type="button" className="px-3 py-2 border rounded-md" onClick={() => {
              if (!('geolocation' in navigator)) return toast.error('Geolocation not available')
              navigator.geolocation.getCurrentPosition(
                (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () => toast.error('Failed to get location'),
                { enableHighAccuracy: true, timeout: 7000 }
              )
            }}>Use my location</button>
            <button type="button" className="px-3 py-2 border rounded-md" onClick={() => setLocation(null)}>Clear location</button>
          </div>

          <button disabled={loading} type="submit" className="w-full sm:w-auto px-4 py-2 rounded-md bg-black text-white disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>

        <div className="h-[360px] sm:h-[420px] md:h-[520px] rounded-xl border shadow-sm overflow-hidden">
          <MapContainer center={location ? [location.lat, location.lng] : [12.9716, 77.5946]} zoom={location ? 14 : 12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationSelector value={location} onChange={setLocation} />
            <AutoCenter target={location} />
            {location && (
              <Marker position={[location.lat, location.lng]} icon={icon} />
            )}
          </MapContainer>
        </div>
      </form>
    </div>
  )
}


