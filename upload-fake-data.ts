import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore'
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

const WASTE_TYPE_PRESETS = [
  ['Plastic'],
  ['Organic'],
  ['Mixed'],
  ['Construction'],
  ['E-Waste'],
  ['Metal'],
  ['Paper'],
  ['Other'],
  ['Plastic', 'Organic'],
  ['Metal', 'Plastic'],
]

const STREET_ANCHORS = [
  { lat: 12.9716, lng: 77.5946 }, // MG Road
  { lat: 12.9791, lng: 77.5913 }, // Cubbon Park Rd
  { lat: 12.9738, lng: 77.6090 }, // Church Street
  { lat: 12.9770, lng: 77.6200 }, // Richmond Rd
  { lat: 12.9782, lng: 77.6409 }, // CMH Road
  { lat: 12.9260, lng: 77.6300 }, // HSR 27th Main
  { lat: 12.9345, lng: 77.6240 }, // Koramangala 80ft Rd
  { lat: 12.9141, lng: 77.6411 }, // Jayanagar 4th block
  { lat: 12.9167, lng: 77.6101 }, // BTM 2nd Stage
  { lat: 13.0097, lng: 77.5505 }, // Malleswaram Sampige Rd
  { lat: 13.0210, lng: 77.6390 }, // Banaswadi Main Rd
  { lat: 12.9909, lng: 77.5697 }, // Rajajinagar Dr Rajkumar Rd
  { lat: 12.9897, lng: 77.5980 }, // Yeshwanthpur Tumkur Rd
  { lat: 13.0358, lng: 77.5970 }, // Hebbal ORR
  { lat: 12.9981, lng: 77.7008 }, // ITPL Main Rd
  { lat: 12.8414, lng: 77.6633 }, // Electronic City Phase 1
  { lat: 12.8654, lng: 77.5849 }, // Bannerghatta Rd
  { lat: 12.9606, lng: 77.6386 }, // 100 Ft Rd Indiranagar
  { lat: 12.9920, lng: 77.6890 }, // Marathahalli Bridge
  { lat: 12.9576, lng: 77.5666 }, // Vijayanagar
]

function pick<T>(list: readonly T[]) {
  return list[Math.floor(Math.random() * list.length)]
}

function getStreetLocation(index: number) {
  const anchor = STREET_ANCHORS[index % STREET_ANCHORS.length]
  const jitter = 0.003 // ~300m radius
  return {
    lat: anchor.lat + (Math.random() - 0.5) * jitter,
    lng: anchor.lng + (Math.random() - 0.5) * jitter,
  }
}

function getRandomSeverity() {
  // Weight towards Medium and High
  const rand = Math.random()
  if (rand < 0.15) return 'Low'
  if (rand < 0.5) return 'Medium'
  if (rand < 0.85) return 'High'
  return 'Critical'
}

function getRandomDate() {
  // Random date within last 30 days
  const now = Date.now()
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000
  const randomTime = thirtyDaysAgo + Math.random() * (now - thirtyDaysAgo)
  return Timestamp.fromDate(new Date(randomTime))
}

async function uploadFakeData() {
  const total = 214
  console.log(`Starting to upload ${total} fake trash reports to Firebase...`)
  
  const reportsRef = collection(db, 'reports')
  
  for (let i = 0; i < total; i++) {
    const fakeReport = {
      types: pick(WASTE_TYPE_PRESETS),
      severity: getRandomSeverity(),
      location: getStreetLocation(i),
      createdAt: getRandomDate(),
      isFake: true, // Mark as fake for easy deletion later
      createdBy: {
        uid: 'seed-script',
        displayName: 'Seeder',
        email: null,
        photoURL: null,
      },
    }
    
    try {
      await addDoc(reportsRef, fakeReport)
      if ((i + 1) % 25 === 0 || i === total - 1) {
        console.log(`✅ Uploaded fake report ${i + 1}/${total}`)
      }
    } catch (error) {
      console.error(`❌ Error uploading report ${i + 1}:`, error)
    }
    
    // Small delay to avoid rate limiting
    if (i % 10 === 0 && i > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  
  console.log(`\n🎉 Successfully uploaded ${total} fake reports!`)
  console.log('💡 To delete them later, filter by isFake: true')
  process.exit(0)
}

uploadFakeData()

