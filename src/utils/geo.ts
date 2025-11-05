export type LatLngLike = {
  lat?: number | null
  lng?: number | null
}

export type LatLng = {
  lat: number
  lng: number
}

export const BANGALORE_CENTER = Object.freeze({
  lat: 12.9715987,
  lng: 77.5945627,
})

export const BANGALORE_RADIUS_KM = 20

export function normalizeLatLng(value: LatLngLike | null | undefined): LatLng | null {
  if (!value || value.lat == null || value.lng == null) return null
  const lat = Number(value.lat)
  const lng = Number(value.lng)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return { lat, lng }
}

function toRadians(deg: number) {
  return (deg * Math.PI) / 180
}

export function distanceInKm(a: LatLng, b: LatLng): number {
  const R = 6371 // Earth radius in km
  const dLat = toRadians(b.lat - a.lat)
  const dLng = toRadians(b.lng - a.lng)
  const lat1 = toRadians(a.lat)
  const lat2 = toRadians(b.lat)

  const sinDLat = Math.sin(dLat / 2)
  const sinDLng = Math.sin(dLng / 2)

  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
  return R * c
}

export function isWithinBangaloreRadius(value: LatLngLike | null | undefined): value is LatLng {
  const coords = normalizeLatLng(value)
  if (!coords) return false
  return distanceInKm(coords, BANGALORE_CENTER) <= BANGALORE_RADIUS_KM
}

