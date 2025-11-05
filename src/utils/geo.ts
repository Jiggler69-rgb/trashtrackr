export type LatLngLike = {
  lat?: number | null
  lng?: number | null
}

export type LatLng = {
  lat: number
  lng: number
}

export const KARNATAKA_BOUNDS = Object.freeze({
  lat: { min: 11.5, max: 18.8 },
  lng: { min: 74.0, max: 78.7 },
})

export function normalizeLatLng(value: LatLngLike | null | undefined): LatLng | null {
  if (!value || value.lat == null || value.lng == null) return null
  const lat = Number(value.lat)
  const lng = Number(value.lng)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return { lat, lng }
}

export function isWithinKarnataka(value: LatLngLike | null | undefined): value is LatLng {
  const coords = normalizeLatLng(value)
  if (!coords) return false
  const { lat, lng } = coords
  return (
    lat >= KARNATAKA_BOUNDS.lat.min &&
    lat <= KARNATAKA_BOUNDS.lat.max &&
    lng >= KARNATAKA_BOUNDS.lng.min &&
    lng <= KARNATAKA_BOUNDS.lng.max
  )
}

