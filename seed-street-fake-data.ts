import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
  ? join(__dirname, process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
  : join(__dirname, 'trashtrackr-24dc3-firebase-adminsdk-fbsvc-a342577111.json')

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'))

initializeApp({
  credential: cert(serviceAccount),
})

const db = getFirestore()

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
] as const

const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'] as const

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
] as const

function pick<T>(list: readonly T[]) {
  return list[Math.floor(Math.random() * list.length)]
}

function jitterLocation(index: number) {
  const anchor = STREET_ANCHORS[index % STREET_ANCHORS.length]
  const jitter = 0.003 // ~300m radius
  return {
    lat: anchor.lat + (Math.random() - 0.5) * jitter,
    lng: anchor.lng + (Math.random() - 0.5) * jitter,
  }
}

async function seedFakeData() {
  const total = 214
  console.log(`Seeding ${total} fake street reports...`)

  const reportsRef = db.collection('reports')

  for (let i = 0; i < total; i += 1) {
    const report = {
      types: pick(WASTE_TYPE_PRESETS),
      severity: pick(SEVERITIES),
      location: jitterLocation(i),
      createdAt: Timestamp.now(),
      createdBy: {
        uid: 'seed-script',
        displayName: 'Seeder',
        email: null,
        photoURL: null,
      },
      isFake: true,
    }

    await reportsRef.add(report)

    if ((i + 1) % 25 === 0 || i === total - 1) {
      console.log(`Inserted ${(i + 1)} / ${total}`)
    }
  }

  console.log('✅ Finished seeding fake data')
}

seedFakeData()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Failed to seed fake data', err)
    process.exit(1)
  })


