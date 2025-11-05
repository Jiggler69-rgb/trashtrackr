## TrashTrackr

A React (Vite) + Tailwind + Firebase + Leaflet app to report and visualize trash locations.

### Setup
1. Install dependencies

```bash
npm install
```

2. Create a file named `.env` in the project root with your Firebase values:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

3. Run the app

```bash
npm run dev
```

### Firestore
- Collection: `reports`
- Fields: `types: string[]`, `severity: 'Low'|'Medium'|'High'|'Critical'`, `location: { lat, lng }`, `createdAt: timestamp`
