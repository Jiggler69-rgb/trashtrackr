import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '.env') })

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || '',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.VITE_FIREBASE_APP_ID || '',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const bannedTypes = [
  '20 Rupai Pepsii Nam Shamant Anna Seksii',
  'Happy Birthday Kohli Anna',
  'You have been Pwned bro Sorrryyyyy',
  'Air Pollution',
]

const bannedLookup = new Set(bannedTypes.map((t) => t.toLowerCase().trim()))

function isBannedType(value: unknown): value is string {
  if (typeof value !== 'string') return false
  const normalized = value.trim().toLowerCase()
  if (bannedLookup.has(normalized)) return true
  for (const banned of bannedLookup) {
    if (normalized.includes(banned)) return true
  }
  return false
}

async function removeMaliciousTypes() {
  console.log('🔍 Fetching reports with banned waste types...')
  const reportsRef = collection(db, 'reports')
  const snapshot = await getDocs(reportsRef)

  if (snapshot.empty) {
    console.log('✨ No reports found in the collection.')
    return
  }

  let sanitized = 0
  let deleted = 0

  for (const reportSnap of snapshot.docs) {
    const data = reportSnap.data()
    const types = Array.isArray(data?.types) ? data.types : []

    const cleanTypes = types.filter((t) => !isBannedType(t))

    if (cleanTypes.length === types.length) continue

    const ref = doc(db, 'reports', reportSnap.id)

    if (cleanTypes.length === 0) {
      await deleteDoc(ref)
      deleted += 1
      console.log(`🗑️  Deleted report ${reportSnap.id}`)
    } else {
      await updateDoc(ref, { types: cleanTypes })
      sanitized += 1
      console.log(`🧼 Sanitized report ${reportSnap.id}`)
    }
  }

  if (sanitized === 0 && deleted === 0) {
    console.log('✅ No reports contained the banned waste types.')
  } else {
    console.log(`🎉 Finished. Sanitized: ${sanitized}, Deleted: ${deleted}.`)
  }
}

removeMaliciousTypes().catch((err) => {
  console.error('❌ Failed to remove malicious waste types:', err)
  process.exitCode = 1
})


