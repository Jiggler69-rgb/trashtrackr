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

// Bangalore coordinates - approximate center
const BANGALORE_CENTER = { lat: 12.9716, lng: 77.5946 }

// Common trash types
const trashTypes = [
  ['Plastic bottles', 'Food waste'],
  ['Cigarette butts', 'Paper'],
  ['Glass bottles'],
  ['Food waste', 'Plastic bags'],
  ['Construction debris'],
  ['Electronics', 'Plastic'],
  ['Plastic bags', 'Wrappers'],
  ['Metal cans', 'Paper'],
  ['Organic waste'],
  ['Mixed waste', 'Plastic'],
]

// Severity levels
const severities = ['Low', 'Medium', 'High', 'Critical']

// Famous areas in Bangalore for more realistic data
const bangaloreAreas = [
  { lat: 12.9716, lng: 77.5946 }, // City center
  { lat: 13.0358, lng: 77.5970 }, // Hebbal
  { lat: 12.9698, lng: 77.7499 }, // Whitefield
  { lat: 12.9352, lng: 77.6245 }, // Koramangala
  { lat: 12.9279, lng: 77.6271 }, // HSR Layout
  { lat: 12.9897, lng: 77.5980 }, // Yeshwanthpur
  { lat: 13.0210, lng: 77.6390 }, // Banaswadi
  { lat: 12.9167, lng: 77.6101 }, // BTM Layout
  { lat: 12.9141, lng: 77.6411 }, // Jayanagar
  { lat: 13.0097, lng: 77.5505 }, // Malleswaram
  { lat: 12.8340, lng: 77.6617 }, // Electronic City
  { lat: 12.9591, lng: 77.7000 }, // Marathahalli
  { lat: 13.0475, lng: 77.5835 }, // Yelahanka
  { lat: 12.9612, lng: 77.6382 }, // Indiranagar
  { lat: 12.9280, lng: 77.5838 }, // JP Nagar
]

function getRandomLocation() {
  // Pick a random area and add some randomness around it (±0.02 degrees ~ 2km)
  const area = bangaloreAreas[Math.floor(Math.random() * bangaloreAreas.length)]
  return {
    lat: area.lat + (Math.random() - 0.5) * 0.04,
    lng: area.lng + (Math.random() - 0.5) * 0.04,
  }
}

function getRandomTypes() {
  return trashTypes[Math.floor(Math.random() * trashTypes.length)]
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
  console.log('Starting to upload 120 fake trash reports to Firebase...')
  
  const reportsRef = collection(db, 'reports')
  
  for (let i = 0; i < 120; i++) {
    const fakeReport = {
      types: getRandomTypes(),
      severity: getRandomSeverity(),
      location: getRandomLocation(),
      createdAt: getRandomDate(),
      isFake: true, // Mark as fake for easy deletion later
    }
    
    try {
      await addDoc(reportsRef, fakeReport)
      console.log(`✅ Uploaded fake report ${i + 1}/120`)
    } catch (error) {
      console.error(`❌ Error uploading report ${i + 1}:`, error)
    }
    
    // Small delay to avoid rate limiting
    if (i % 10 === 0 && i > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  
  console.log('\n🎉 Successfully uploaded 120 fake reports!')
  console.log('💡 To delete them later, filter by isFake: true')
  process.exit(0)
}

uploadFakeData()

