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

const REGIONS = [
  // Far & Flights
  { name: 'India (Chennai & Pune via Abu Dhabi)', lat: 15.5, lng: 77.0, radius: 400 },
  { name: 'Hong Kong', lat: 22.3193, lng: 114.1694, radius: 40 },
  { name: 'Costa Rica (San José / La Fortuna / Guanacaste)', lat: 10.25, lng: -84.75, radius: 120 },
  { name: 'Charlotte, NC & Tri-Cities (Kingsport/Bristol), TN', lat: 36.508, lng: -82.567, radius: 150 },
  { name: 'Charlotte, NC', lat: 35.2271, lng: -80.8431, radius: 40 },
  { name: 'Denver / Aurora, CO', lat: 39.7392, lng: -104.9903, radius: 40 },
  // SoCal
  { name: 'San Diego, CA', lat: 32.7157, lng: -117.1611, radius: 30 },
  { name: 'Disneyland / Anaheim / Orange County, CA', lat: 33.8121, lng: -117.9190, radius: 22 },
  { name: 'Los Angeles / Universal Studios / Pasadena, CA', lat: 34.1478, lng: -118.1445, radius: 25 },
  // NorCal Mountains & Parks
  { name: 'Lake Tahoe / South Lake Tahoe, CA/NV', lat: 38.9399, lng: -119.9772, radius: 30 },
  { name: 'Yosemite National Park, CA', lat: 37.7456, lng: -119.5936, radius: 30 },
  { name: 'Pinecrest / Twain Harte / Stanislaus NF, CA', lat: 38.10, lng: -120.10, radius: 25 },
  { name: 'Russian River / Guerneville / Sonoma Coast, CA', lat: 38.502, lng: -122.999, radius: 25 },
  { name: 'Napa / Sonoma Wine Country, CA', lat: 38.2975, lng: -122.2869, radius: 20 },
  { name: 'Point Reyes / Muir Woods / Marin Coast, CA', lat: 37.98, lng: -122.70, radius: 20 },
  { name: 'Sacramento / Folsom / Davis, CA', lat: 38.5816, lng: -121.4944, radius: 35 },
  { name: 'Great Wolf Lodge / Manteca / Stockton, CA', lat: 37.7974, lng: -121.2161, radius: 20 },
  // Central Coast & Santa Cruz
  { name: 'Monterey / Carmel / Pacific Grove, CA', lat: 36.6002, lng: -121.8947, radius: 22 },
  { name: 'Gilroy Gardens / Morgan Hill / Hollister, CA', lat: 37.0058, lng: -121.5683, radius: 18 },
  { name: 'Scotts Valley / Mount Hermon / Santa Cruz Mountains, CA', lat: 37.050, lng: -122.020, radius: 8 },
  { name: 'Santa Cruz Beach / Capitola / Aptos, CA', lat: 36.965, lng: -121.980, radius: 10 },
  { name: 'Half Moon Bay / Pacifica / San Mateo Coast, CA', lat: 37.4636, lng: -122.4286, radius: 14 },
  // Bay Area Attractions
  { name: 'San Francisco (Golden Gate Park / Cal Academy / Pier), CA', lat: 37.7749, lng: -122.4194, radius: 9 },
  { name: 'Oakland Zoo / East Bay / Berkeley, CA', lat: 37.78, lng: -122.22, radius: 12 },
];

function labelLocation(loc) {
  for (const r of REGIONS) {
    if (haversineMiles(r, loc) <= r.radius) {
      return r.name;
    }
  }
  return null;
}

const HOME_BASE = { lat: 37.336, lng: -122.020 };

// Find all visits in named regions or > 25 miles away
const outings = [];
for (const seg of data.semanticSegments) {
  if (seg.visit && seg.visit.topCandidate) {
    const loc = parseLatLng(seg.visit.topCandidate.placeLocation?.latLng);
    if (!loc) continue;
    const dist = haversineMiles(HOME_BASE, loc);
    const durHours = (new Date(seg.endTime) - new Date(seg.startTime)) / (1000 * 3600);
    const label = labelLocation(loc);
    if (dist > 22 && durHours >= 1.5 && label) {
      outings.push({
        start: seg.startTime,
        end: seg.endTime,
        durHours,
        dist,
        loc,
        label
      });
    }
  }
}

// Group consecutive outings to same/nearby region within 36 hours
const grouped = [];
let curr = null;
for (const o of outings) {
  if (!curr) {
    curr = { start: o.start, end: o.end, maxDist: o.dist, label: o.label, loc: o.loc, totalVisitHours: o.durHours };
  } else {
    const gapHours = (new Date(o.start) - new Date(curr.end)) / (1000 * 3600);
    if (gapHours <= 36 && (o.label === curr.label || o.dist > 50)) {
      curr.end = o.end > curr.end ? o.end : curr.end;
      curr.totalVisitHours += o.durHours;
      if (o.dist > curr.maxDist) {
        curr.maxDist = o.dist;
        curr.label = o.label;
        curr.loc = o.loc;
      }
    } else {
      grouped.push(curr);
      curr = { start: o.start, end: o.end, maxDist: o.dist, label: o.label, loc: o.loc, totalVisitHours: o.durHours };
    }
  }
}
if (curr) grouped.push(curr);

console.log(`Total grouped outings/trips (${grouped.length}):`);
for (const g of grouped) {
  const spanDays = ((new Date(g.end) - new Date(g.start)) / (1000 * 3600 * 24)).toFixed(1);
  // Skip routine San Francisco work/commute unless weekend or multi-day
  const dayOfWeek = new Date(g.start).getDay(); // 0=Sun, 6=Sat
  const isSF = g.label.startsWith('San Francisco');
  if (isSF && spanDays < 0.8 && dayOfWeek !== 0 && dayOfWeek !== 6) continue;
  console.log(`${g.start.slice(0, 10)} to ${g.end.slice(0, 10)} (${spanDays}d, ${g.totalVisitHours.toFixed(1)}h visit) | ${g.label}`);
}
