import { initializeApp } from 'firebase/app'
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load .env file
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '.env') })

// Firebase config from environment variables
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

async function deleteFakeData() {
  console.log('🔍 Searching for fake reports...')
  
  const reportsRef = collection(db, 'reports')
  const q = query(reportsRef, where('isFake', '==', true))
  
  try {
    const snapshot = await getDocs(q)
    const total = snapshot.size
    
    if (total === 0) {
      console.log('✨ No fake reports found!')
      process.exit(0)
    }
    
    console.log(`Found ${total} fake reports. Deleting...`)
    
    let deleted = 0
    for (const docSnapshot of snapshot.docs) {
      await deleteDoc(doc(db, 'reports', docSnapshot.id))
      deleted++
      console.log(`🗑️  Deleted ${deleted}/${total}`)
    }
    
    console.log('\n🎉 Successfully deleted all fake reports!')
  } catch (error) {
    console.error('❌ Error deleting fake reports:', error)
  }
  
  process.exit(0)
}

deleteFakeData()

