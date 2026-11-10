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

const HOME_BASE = { lat: 37.336, lng: -122.020 }; // Sunnyvale / Cupertino center

// 1. Extract all trips (>35 miles from Home Base)
// Group consecutive away visits/points into discrete trips
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
        placeId: seg.visit.topCandidate.placeId,
        semanticType: seg.visit.topCandidate.semanticType
      });
    }
  } else if (seg.activity && seg.activity.topCandidate?.type === 'FLYING') {
    const startLoc = parseLatLng(seg.activity.start?.latLng);
    const endLoc = parseLatLng(seg.activity.end?.latLng);
    console.log(`FLIGHT: ${seg.startTime.slice(0, 16)} -> ${seg.endTime.slice(0, 16)} | ${JSON.stringify(startLoc)} to ${JSON.stringify(endLoc)}`);
  }
}

// Group into trips where dist > 40 miles
const trips = [];
let currentTrip = null;

for (const pt of awayPoints) {
  if (pt.dist > 40) {
    if (!currentTrip) {
      currentTrip = {
        start: pt.start,
        end: pt.end,
        maxDist: pt.dist,
        furthestLoc: pt.loc,
        points: [pt]
      };
    } else {
      // Check time gap from previous away point; if > 36 hours back home, close trip
      const gapHours = (new Date(pt.start) - new Date(currentTrip.end)) / (1000 * 3600);
      if (gapHours <= 36) {
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
    // Back near home for a visit > 6 hours closes current trip
    const visitHours = (new Date(pt.end) - new Date(pt.start)) / (1000 * 3600);
    if (currentTrip && visitHours > 6) {
      trips.push(currentTrip);
      currentTrip = null;
    }
  }
}
if (currentTrip) trips.push(currentTrip);

console.log(`\n=== DETECTED TRIPS > 40 MILES (${trips.length}) ===`);
for (const t of trips) {
  const durDays = ((new Date(t.end) - new Date(t.start)) / (1000 * 3600 * 24)).toFixed(1);
  if (durDays >= 0.4 || t.maxDist > 100) {
    console.log(`${t.start.slice(0, 10)} to ${t.end.slice(0, 10)} (${durDays}d) | MaxDist: ${Math.round(t.maxDist)} mi | Furthest: ${t.furthestLoc.lat.toFixed(3)}, ${t.furthestLoc.lng.toFixed(3)} | Stops: ${t.points.length}`);
  }
}

// 2. Check for multi-day non-home, non-work local stays (e.g. Hospitals in Bay Area!)
console.log('\n=== UNUSUAL LOCAL OVERNIGHT / LONG STAYS (12h+ within 35 mi of home, not Home/Work) ===');
const knownResidences = [
  { lat: 37.35703, lng: -122.01615 },
  { lat: 37.31688, lng: -122.02563 },
  { lat: 37.56605, lng: -122.32289 },
  { lat: 37.55396, lng: -122.30001 },
  { lat: 37.46425, lng: -122.25119 },
  { lat: 37.55833, lng: -122.27654 },
  { lat: 37.46693, lng: -122.25398 }
];

for (const pt of awayPoints) {
  if (pt.dist <= 35) {
    const nearKnown = knownResidences.some(r => haversineMiles(r, pt.loc) < 0.5);
    if (!nearKnown) {
      const durHours = (new Date(pt.end) - new Date(pt.start)) / (1000 * 3600);
      if (durHours >= 14) {
        console.log(`${pt.start.slice(0, 16)} to ${pt.end.slice(0, 16)} (${durHours.toFixed(1)}h) | Loc: ${pt.loc.lat.toFixed(4)}, ${pt.loc.lng.toFixed(4)} | PlaceId: ${pt.placeId}`);
      }
    }
  }
}
