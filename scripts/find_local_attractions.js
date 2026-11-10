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

const ATTRACTIONS = [
  { name: 'California\'s Great America (Santa Clara)', lat: 37.3979, lng: -121.9743, r: 0.6 },
  { name: 'Levi\'s Stadium (Santa Clara)', lat: 37.4033, lng: -121.9694, r: 0.5 },
  { name: 'Happy Hollow Park & Zoo / Kelley Park (San Jose)', lat: 37.3259, lng: -121.8617, r: 0.5 },
  { name: 'Children\'s Discovery Museum (San Jose)', lat: 37.3266, lng: -121.8923, r: 0.3 },
  { name: 'The Tech Interactive / Downtown San Jose', lat: 37.3316, lng: -121.8901, r: 0.3 },
  { name: 'SAP Center / Shark Tank (San Jose)', lat: 37.3328, lng: -121.9012, r: 0.3 },
  { name: 'Winchester Mystery House / Santana Row', lat: 37.3184, lng: -121.9511, r: 0.4 },
  { name: 'Raging Waters / Lake Cunningham (San Jose)', lat: 37.3358, lng: -121.8122, r: 0.5 },
  { name: 'Shoreline Amphitheatre / Shoreline Lake (Mountain View)', lat: 37.4267, lng: -122.0806, r: 0.6 },
  { name: 'Computer History Museum (Mountain View)', lat: 37.4143, lng: -122.0768, r: 0.3 },
  { name: 'CuriOdyssey / Coyote Point (San Mateo)', lat: 37.5898, lng: -122.3182, r: 0.5 },
  { name: 'Hiller Aviation Museum (San Carlos)', lat: 37.5134, lng: -122.2526, r: 0.3 },
  { name: 'Filoli Historic House & Garden (Woodside)', lat: 37.4705, lng: -122.3106, r: 0.6 },
  { name: 'Palo Alto Junior Museum & Zoo / Rinconada', lat: 37.4451, lng: -122.1387, r: 0.3 },
  { name: 'Stanford Stadium / Campus', lat: 37.4346, lng: -122.1611, r: 0.6 },
  { name: 'Roaring Camp Railroads / Henry Cowell (Felton)', lat: 37.0405, lng: -122.0628, r: 0.7 },
  { name: 'Santa Cruz Beach Boardwalk', lat: 36.9641, lng: -122.0178, r: 0.6 },
  { name: 'Mystery Spot (Santa Cruz)', lat: 37.0169, lng: -122.0024, r: 0.5 },
  { name: 'Monterey Bay Aquarium / Cannery Row', lat: 36.6183, lng: -121.9015, r: 0.5 },
  { name: 'Gilroy Gardens Family Theme Park', lat: 37.0058, lng: -121.6295, r: 0.8 },
  { name: 'Casa de Fruta (Hollister)', lat: 36.9816, lng: -121.3852, r: 0.6 },
  { name: 'San Francisco Zoo', lat: 37.7329, lng: -122.5030, r: 0.6 },
  { name: 'California Academy of Sciences / Golden Gate Park', lat: 37.7699, lng: -122.4661, r: 0.6 },
  { name: 'Exploratorium / Pier 15 (SF)', lat: 37.8017, lng: -122.3973, r: 0.4 },
  { name: 'PIER 39 / Fisherman\'s Wharf (SF)', lat: 37.8087, lng: -122.4098, r: 0.5 },
  { name: 'Oakland Zoo', lat: 37.7524, lng: -122.1426, r: 0.7 },
  { name: 'Six Flags Discovery Kingdom (Vallejo)', lat: 38.1381, lng: -122.2333, r: 0.7 },
  { name: 'Spina Farms Pumpkin Patch / Coyote Valley', lat: 37.185, lng: -121.745, r: 1.5 },
  { name: 'Lemos Farm / Half Moon Bay Pumpkin Patches', lat: 37.4682, lng: -122.3854, r: 1.2 },
  { name: 'Castle Rock / Big Basin Redwoods', lat: 37.2267, lng: -122.0958, r: 2.0 },
  { name: 'Vasona Lake County Park / Oak Meadow (Los Gatos)', lat: 37.2383, lng: -121.9691, r: 0.6 },
  { name: 'Villa Montalvo / Hakone Estate (Saratoga)', lat: 37.2478, lng: -122.0306, r: 0.8 },
];

for (const seg of data.semanticSegments) {
  if (seg.visit && seg.visit.topCandidate) {
    const loc = parseLatLng(seg.visit.topCandidate.placeLocation?.latLng);
    if (!loc) continue;
    const durHours = (new Date(seg.endTime) - new Date(seg.startTime)) / (1000 * 3600);
    if (durHours >= 1.2) {
      for (const a of ATTRACTIONS) {
        if (haversineMiles(a, loc) <= a.r) {
          console.log(`${seg.startTime.slice(0, 10)} (${durHours.toFixed(1)}h) | ${a.name}`);
        }
      }
    }
  }
}
