const fs = require('fs');
const path = require('path');

const raw = fs.readFileSync(path.join(__dirname, '../data/Timeline.json'), 'utf8');
const data = JSON.parse(raw);

function parseLatLng(str) {
  if (!str) return null;
  const parts = str.replace(/°/g, '').split(',').map(s => parseFloat(s.trim()));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return { lat: parts[0], lng: parts[1] };
  }
  return null;
}

function haversineMiles(p1, p2) {
  const R = 3958.8; // Earth radius in miles
  const dLat = (p2.lat - p1.lat) * Math.PI / 180;
  const dLng = (p2.lng - p1.lng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) *
            Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// 1. Inspect timelineMemory segments
const memories = data.semanticSegments.filter(s => s.timelineMemory);
console.log(`=== TIMELINE MEMORIES (${memories.length}) ===`);
console.log(JSON.stringify(memories.slice(0, 5), null, 2));

// 2. Find HOME & INFERRED_HOME clusters over time
const homeVisits = [];
for (const seg of data.semanticSegments) {
  if (seg.visit && seg.visit.topCandidate) {
    const tc = seg.visit.topCandidate;
    if (tc.semanticType === 'HOME' || tc.semanticType === 'INFERRED_HOME') {
      const loc = parseLatLng(tc.placeLocation?.latLng);
      if (loc) {
        homeVisits.push({ start: seg.startTime, end: seg.endTime, type: tc.semanticType, loc, placeId: tc.placeId });
      }
    }
  }
}

// Cluster home locations within 0.3 miles
const homeClusters = [];
for (const hv of homeVisits) {
  let found = homeClusters.find(c => haversineMiles(c.center, hv.loc) < 0.3);
  if (!found) {
    found = { center: hv.loc, count: 0, firstSeen: hv.start, lastSeen: hv.end, placeIds: new Set() };
    homeClusters.push(found);
  }
  found.count++;
  if (hv.start < found.firstSeen) found.firstSeen = hv.start;
  if (hv.end > found.lastSeen) found.lastSeen = hv.end;
  found.placeIds.add(hv.placeId);
}
console.log('\n=== HOME CLUSTERS ===');
for (const c of homeClusters.sort((a, b) => a.firstSeen.localeCompare(b.firstSeen))) {
  console.log(`Center: ${c.center.lat.toFixed(4)}, ${c.center.lng.toFixed(4)} | Visits: ${c.count} | ${c.firstSeen.slice(0, 10)} to ${c.lastSeen.slice(0, 10)}`);
}

// Also cluster ALL overnight visits (starts before midnight or ends after 5am with >5 hours duration) to find earlier homes if not tagged HOME
const overnightClusters = [];
for (const seg of data.semanticSegments) {
  if (seg.visit && seg.visit.topCandidate) {
    const start = new Date(seg.startTime);
    const end = new Date(seg.endTime);
    const durHours = (end - start) / (1000 * 3600);
    if (durHours >= 6) {
      const loc = parseLatLng(seg.visit.topCandidate.placeLocation?.latLng);
      if (loc) {
        let found = overnightClusters.find(c => haversineMiles(c.center, loc) < 0.3);
        if (!found) {
          found = { center: loc, count: 0, totalHours: 0, firstSeen: seg.startTime, lastSeen: seg.endTime, byYear: {} };
          overnightClusters.push(found);
        }
        found.count++;
        found.totalHours += durHours;
        if (seg.startTime < found.firstSeen) found.firstSeen = seg.startTime;
        if (seg.endTime > found.lastSeen) found.lastSeen = seg.endTime;
        const yr = seg.startTime.slice(0, 4);
        found.byYear[yr] = (found.byYear[yr] || 0) + 1;
      }
    }
  }
}
console.log('\n=== TOP RESIDENCE / LONG-STAY CLUSTERS (>=30 long stays) ===');
for (const c of overnightClusters.filter(x => x.count >= 30).sort((a, b) => a.firstSeen.localeCompare(b.firstSeen))) {
  console.log(`Loc: ${c.center.lat.toFixed(5)}, ${c.center.lng.toFixed(5)} | Stays: ${c.count} | ${c.firstSeen.slice(0, 10)} -> ${c.lastSeen.slice(0, 10)} | Years:`, JSON.stringify(c.byYear));
}
