import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { isWithinKarnataka, normalizeLatLng } from './src/utils/geo'

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

async function purgeOutsideKarnataka() {
  console.log('🔍 Checking reports outside Karnataka bounds...')

  const reportsRef = collection(db, 'reports')
  const snapshot = await getDocs(reportsRef)

  if (snapshot.empty) {
    console.log('✨ No reports found.')
    return
  }

  const candidates = snapshot.docs.filter((docSnap) => {
    const data = docSnap.data()
    const coords = normalizeLatLng(data?.location)
    return !isWithinKarnataka(coords || undefined)
  })

  if (candidates.length === 0) {
    console.log('✅ All reports are within Karnataka.')
    return
  }

  console.log(`Found ${candidates.length} reports outside Karnataka. Deleting...`)
  let deleted = 0
  for (const docSnap of candidates) {
    await deleteDoc(doc(db, 'reports', docSnap.id))
    deleted += 1
    console.log(`🗑️  Deleted ${deleted}/${candidates.length} (${docSnap.id})`)
  }

  console.log('🎉 Finished removing out-of-state reports.')
}

purgeOutsideKarnataka().catch((err) => {
  console.error('❌ Failed to purge reports:', err)
  process.exitCode = 1
})

