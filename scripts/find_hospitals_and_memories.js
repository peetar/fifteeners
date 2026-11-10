const fs = require('fs');
const path = require('path');

const raw = fs.readFileSync(path.join(__dirname, '../data/Timeline.json'), 'utf8');
const data = JSON.parse(raw);

function parseLatLng(str) {
  if (!str) return null;
  const parts = str.replace(/°/g, '').replace(/[^\d.,-]/g, '').split(',').map(s => parseFloat(s.trim()));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return { lat: parts[0], lng: parts[1] };
  }
  return null;
}

function haversineMiles(p1, p2) {
  const R = 3958.8;
  const dLat = (p2.lat - p1.lat) * Math.PI / 180;
  const dLng = (p2.lng - p1.lng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) *
            Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const HOSPITALS = [
  { name: 'El Camino Hospital (Mountain View)', lat: 37.3688, lng: -122.0796 },
  { name: 'Kaiser Santa Clara', lat: 37.3340, lng: -121.9995 },
  { name: 'Lucile Packard / Stanford Hospital', lat: 37.4337, lng: -122.1751 },
  { name: 'Sequoia Hospital (Redwood City)', lat: 37.4842, lng: -122.2512 },
  { name: 'Mills-Peninsula Medical Center', lat: 37.5947, lng: -122.3827 },
  { name: 'Good Samaritan Hospital (San Jose)', lat: 37.2517, lng: -121.9467 },
  { name: 'O\'Connor Hospital (San Jose)', lat: 37.3292, lng: -121.9333 },
  { name: 'Kaiser San Jose', lat: 37.2393, lng: -121.8051 },
  { name: 'Kaiser Redwood City', lat: 37.4882, lng: -122.2226 },
  { name: 'PAMF Sunnyvale / Mountain View', lat: 37.3712, lng: -122.0816 }
];

console.log('=== HOSPITAL / MEDICAL CENTER VISITS (>= 2 hours) ===');
for (const seg of data.semanticSegments) {
  if (seg.visit && seg.visit.topCandidate) {
    const loc = parseLatLng(seg.visit.topCandidate.placeLocation?.latLng);
    if (loc) {
      const durHours = (new Date(seg.endTime) - new Date(seg.startTime)) / (1000 * 3600);
      if (durHours >= 2) {
        for (const h of HOSPITALS) {
          if (haversineMiles(h, loc) < 0.35) {
            console.log(`${seg.startTime.slice(0, 16)} to ${seg.endTime.slice(0, 16)} (${durHours.toFixed(1)}h) | ${h.name} | PlaceId: ${seg.visit.topCandidate.placeId}`);
          }
        }
      }
    }
  }
}

console.log('\n=== ALL 48 TIMELINE MEMORIES ===');
for (const seg of data.semanticSegments) {
  if (seg.timelineMemory) {
    const trip = seg.timelineMemory.trip;
    console.log(`${seg.startTime.slice(0, 10)} to ${seg.endTime.slice(0, 10)} | Dist: ${trip?.distanceFromOriginKms} km | Dests: ${(trip?.destinations || []).map(d => d.identifier?.placeId).join(', ')}`);
  }
}
