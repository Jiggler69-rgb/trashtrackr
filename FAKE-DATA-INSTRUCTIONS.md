# Fake Data Management

## Overview
This project includes scripts to upload and delete fake trash reports for testing purposes.

## Scripts

### Upload Fake Data
Uploads 120 fake trash reports to Firebase, distributed across Bangalore:
```bash
npm run upload-fake-data
```

**Features:**
- 120 reports with random locations around Bangalore
- Various trash types (plastic, food waste, cigarettes, etc.)
- Random severity levels (Low, Medium, High, Critical)
- Random dates within the last 30 days
- All marked with `isFake: true` for easy cleanup

### Delete Fake Data
Removes all fake reports from Firebase:
```bash
npm run delete-fake-data
```

This finds all reports where `isFake: true` and deletes them.

## Data Structure
Each fake report includes:
```typescript
{
  types: string[],           // e.g., ['Plastic bottles', 'Food waste']
  severity: string,          // 'Low' | 'Medium' | 'High' | 'Critical'
  location: {
    lat: number,             // Latitude around Bangalore
    lng: number              // Longitude around Bangalore
  },
  createdAt: Timestamp,      // Random date in last 30 days
  isFake: true               // Marker for easy deletion
}
```

## Locations Covered
The fake data spreads across major Bangalore areas:
- City center
- Hebbal
- Whitefield
- Koramangala
- HSR Layout
- Indiranagar
- Jayanagar
- Electronic City
- And more...

## Clean Up
When you're ready to remove all fake data:
```bash
npm run delete-fake-data
```

**Note:** Only reports marked with `isFake: true` will be deleted. Real user reports are safe!

