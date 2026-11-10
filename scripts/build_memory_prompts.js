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
  { name: 'Lake Tahoe / South Lake Tahoe, CA/NV', lat: 38.9399, lng: -119.9772, radius: 30 },
  { name: 'Yosemite National Park, CA', lat: 37.7456, lng: -119.5936, radius: 30 },
  { name: 'Pinecrest / Dodge Ridge / Stanislaus NF, CA', lat: 38.186, lng: -119.982, radius: 25 },
  { name: 'Disneyland / Anaheim / Orange County, CA', lat: 33.8121, lng: -117.9190, radius: 25 },
  { name: 'Los Angeles / Pasadena / Burbank, CA', lat: 34.1478, lng: -118.1445, radius: 30 },
  { name: 'San Diego, CA', lat: 32.7157, lng: -117.1611, radius: 30 },
  { name: 'Monterey / Carmel / Pacific Grove, CA', lat: 36.6002, lng: -121.8947, radius: 25 },
  { name: 'Santa Cruz / Scotts Valley / Mt. Hermon, CA', lat: 37.0359, lng: -122.0243, radius: 18 },
  { name: 'Point Reyes / Tomales Bay / Marin Coast, CA', lat: 38.0682, lng: -122.8069, radius: 25 },
  { name: 'Russian River / Guerneville / Sonoma Coast, CA', lat: 38.502, lng: -122.999, radius: 25 },
  { name: 'Napa / Sonoma Wine Country, CA', lat: 38.2975, lng: -122.2869, radius: 22 },
  { name: 'Sacramento / Folsom / Davis, CA', lat: 38.5816, lng: -121.4944, radius: 35 },
  { name: 'Manteca / Great Wolf Lodge / Stockton, CA', lat: 37.7974, lng: -121.2161, radius: 20 },
  { name: 'San Francisco, CA', lat: 37.7749, lng: -122.4194, radius: 10 },
  { name: 'Denver / Aurora, CO', lat: 39.7392, lng: -104.9903, radius: 40 },
  { name: 'Charlotte, NC & Tri-Cities (Kingsport/Bristol), TN', lat: 36.508, lng: -82.567, radius: 150 },
  { name: 'Charlotte, NC', lat: 35.2271, lng: -80.8431, radius: 40 },
  { name: 'Costa Rica (San José / La Fortuna / Guanacaste)', lat: 10.25, lng: -84.75, radius: 120 },
  { name: 'Hong Kong', lat: 22.3193, lng: 114.1694, radius: 40 },
  { name: 'India (Chennai & Pune) via Abu Dhabi', lat: 15.5, lng: 77.0, radius: 400 },
];

function labelLocation(loc) {
  for (const r of REGIONS) {
    if (haversineMiles(r, loc) <= r.radius) {
      return r.name;
    }
  }
  return `Coords (${loc.lat.toFixed(3)}, ${loc.lng.toFixed(3)})`;
}

const HOME_BASE = { lat: 37.336, lng: -122.020 };

const awayPoints = [];
for (const seg of data.semanticSegments) {
  if (seg.visit && seg.visit.topCandidate) {
    const loc = parseLatLng(seg.visit.topCandidate.placeLocation?.latLng);
    if (loc) {
      const dist = haversineMiles(HOME_BASE, loc);
      awayPoints.push({
        start: seg.startTime,
        end: seg.endTime,
        loc,
        dist,
        placeId: seg.visit.topCandidate.placeId
      });
    }
  }
}

const trips = [];
let currentTrip = null;

for (const pt of awayPoints) {
  if (pt.dist > 35) {
    if (!currentTrip) {
      currentTrip = {
        start: pt.start,
        end: pt.end,
        maxDist: pt.dist,
        furthestLoc: pt.loc,
        points: [pt]
      };
    } else {
      const gapHours = (new Date(pt.start) - new Date(currentTrip.end)) / (1000 * 3600);
      if (gapHours <= 48) {
        currentTrip.end = pt.end > currentTrip.end ? pt.end : currentTrip.end;
        if (pt.dist > currentTrip.maxDist) {
          currentTrip.maxDist = pt.dist;
          currentTrip.furthestLoc = pt.loc;
        }
        currentTrip.points.push(pt);
      } else {
        trips.push(currentTrip);
        currentTrip = {
          start: pt.start,
          end: pt.end,
          maxDist: pt.dist,
          furthestLoc: pt.loc,
          points: [pt]
        };
      }
    }
  } else {
    const visitHours = (new Date(pt.end) - new Date(pt.start)) / (1000 * 3600);
    if (currentTrip && visitHours > 8) {
      trips.push(currentTrip);
      currentTrip = null;
    }
  }
}
if (currentTrip) trips.push(currentTrip);

const filteredTrips = trips.filter(t => {
  const durDays = (new Date(t.end) - new Date(t.start)) / (1000 * 3600 * 24);
  return durDays >= 0.35 || t.maxDist > 60;
});

for (const t of filteredTrips) {
  const durDays = ((new Date(t.end) - new Date(t.start)) / (1000 * 3600 * 24)).toFixed(1);
  console.log(`${t.start.slice(0, 10)} -> ${t.end.slice(0, 10)} (${durDays}d) | ${labelLocation(t.furthestLoc)} | MaxDist: ${Math.round(t.maxDist)} mi`);
}
