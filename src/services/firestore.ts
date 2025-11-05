import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore'
import type { Timestamp } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { isWithinBangaloreRadius } from '../utils/geo'
import { app } from './firebase'

const db = getFirestore(app)
const auth = getAuth(app)

export type Severity = 'Low' | 'Medium' | 'High' | 'Critical'

export type NewReport = {
  types: string[]
  severity: Severity
  location: { lat: number, lng: number }
}

export type ReportRecord = {
  id: string
  types: string[]
  severity: Severity
  location: { lat: number, lng: number }
  createdAt: Timestamp | null
  createdBy?: {
    uid: string
    displayName?: string | null
    email?: string | null
    photoURL?: string | null
  }
}

const ALLOWED_SEVERITIES: Severity[] = ['Low', 'Medium', 'High', 'Critical']

export async function addReport(data: NewReport) {
  const user = auth.currentUser
  if (!user) {
    throw new Error('You must be signed in to submit a report')
  }
  const ref = collection(db, 'reports')
  if (!isWithinBangaloreRadius(data.location)) {
    throw new Error('Location must be within 20 km of Bengaluru')
  }
  await addDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
    createdBy: {
      uid: user.uid,
      displayName: user.displayName ?? null,
      email: user.email ?? null,
      photoURL: user.photoURL ?? null,
    },
  })
}

export function listenToReports(cb: (docs: ReportRecord[]) => void) {
  const ref = collection(db, 'reports')
  const q = query(ref, orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => {
    const docs = snap.docs
      .map((doc) => {
        const data = doc.data()
        const location = data.location ?? {}
        if (typeof location.lat !== 'number' || typeof location.lng !== 'number') {
          return null
        }
        const severity = ALLOWED_SEVERITIES.includes(data.severity as Severity)
          ? (data.severity as Severity)
          : 'Medium'
        const types = Array.isArray(data.types)
          ? data.types.filter((t): t is string => typeof t === 'string')
          : []
        return {
          id: doc.id,
          types,
          severity,
          location: { lat: location.lat, lng: location.lng },
          createdAt: (data.createdAt ?? null) as Timestamp | null,
          createdBy: typeof data.createdBy === 'object' ? data.createdBy : undefined,
        }
      })
      .filter((item): item is ReportRecord => item !== null)
    cb(docs)
  })
}


