import { useEffect, useMemo, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { isWithinBangaloreRadius, BANGALORE_CENTER } from '../utils/geo'

const WASTE_TYPES = ['Plastic','Organic','E-Waste','Metal','Construction','Paper','Other'] as const
const SEVERITIES = ['Low','Medium','High','Critical'] as const

type LatLng = { lat: number, lng: number }

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

export default function Report() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [severity, setSeverity] = useState<string>('Medium')
  const [location, setLocation] = useState<LatLng | null>(null)
  const [loading, setLoading] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  const icon = useSeverityIcon(severity)

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setLocationError('Geolocation is not supported by your browser.')
      return
    }

    const geo = navigator.geolocation

    const applyPosition = (pos: GeolocationPosition) => {
      const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
      if (!isWithinBangaloreRadius(coords)) {
        setLocation(null)
        setLocationError('Reports are limited to a 20 km radius around Bengaluru. Move closer to continue.')
        return
      }
      setLocation(coords)
      setLocationError(null)
    }

    const handleError = () => {
      setLocation(null)
      setLocationError('Enable location services to submit a report.')
    }

    const watchId = geo.watchPosition(applyPosition, handleError, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000,
    })

    return () => {
      geo.clearWatch(watchId)
    }
  }, [])

  const requestLocation = () => {
    if (!('geolocation' in navigator)) {
      setLocationError('Geolocation is not supported by your browser.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        if (!isWithinBangaloreRadius(coords)) {
          setLocation(null)
          setLocationError('Reports are limited to a 20 km radius around Bengaluru. Move closer to continue.')
          return
        }
        setLocation(coords)
        setLocationError(null)
      },
      () => {
        setLocationError('Enable location services to submit a report.')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const toggleType = (t: string) => {
    setSelectedTypes((prev) => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (selectedTypes.length === 0) return toast.error('Select at least one waste type')
    if (!SEVERITIES.includes(severity as any)) return toast.error('Select a severity')
    if (!location || !isWithinBangaloreRadius(location)) return toast.error('Enable location services within 20 km of Bengaluru to submit a report')

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
            <div className="flex items-center justify-between">
              <span className="block text-sm font-medium">Location</span>
              <button
                type="button"
                className="px-3 py-2 border rounded-md text-xs"
                onClick={requestLocation}
              >Refresh location</button>
            </div>
            <p className="mt-2 text-xs text-gray-500">Allow location access so we can map the trash spot automatically (within 20 km of Bengaluru).</p>
            {location ? (
              <p className="mt-3 text-sm text-gray-600">Lat {location.lat.toFixed(5)}, Lng {location.lng.toFixed(5)}</p>
            ) : (
              <p className="mt-3 text-sm text-red-500">{locationError ?? 'Requesting location...'}</p>
            )}
          </div>

          <button disabled={loading || !location || !!locationError} type="submit" className="w-full sm:w-auto px-4 py-2 rounded-md bg-black text-white disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>

        <div className="h-[360px] sm:h-[420px] md:h-[520px] rounded-xl border shadow-sm overflow-hidden">
          <MapContainer center={location ? [location.lat, location.lng] : [BANGALORE_CENTER.lat, BANGALORE_CENTER.lng]} zoom={location ? 14 : 12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
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


