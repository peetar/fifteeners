const fs = require('fs');
const path = require('path');

console.log('Loading Timeline.json...');
const raw = fs.readFileSync(path.join(__dirname, '../data/Timeline.json'), 'utf8');
const data = JSON.parse(raw);

console.log('Top-level keys:', Object.keys(data));
if (data.semanticSegments) {
  console.log('Total semanticSegments:', data.semanticSegments.length);
  const segTypes = {};
  const semanticTypes = {};
  const activityTypes = {};
  let minTime = '9999', maxTime = '0000';
  for (const seg of data.semanticSegments) {
    if (seg.startTime && seg.startTime < minTime) minTime = seg.startTime;
    if (seg.endTime && seg.endTime > maxTime) maxTime = seg.endTime;
    const keys = Object.keys(seg).filter(k => !['startTime', 'endTime', 'startTimeTimezoneUtcOffsetMinutes', 'endTimeTimezoneUtcOffsetMinutes'].includes(k)).join(',');
    segTypes[keys] = (segTypes[keys] || 0) + 1;
    if (seg.visit && seg.visit.topCandidate) {
      const st = seg.visit.topCandidate.semanticType || 'NONE';
      semanticTypes[st] = (semanticTypes[st] || 0) + 1;
    }
    if (seg.activity && seg.activity.topCandidate) {
      const at = seg.activity.topCandidate.type || 'NONE';
      activityTypes[at] = (activityTypes[at] || 0) + 1;
    }
  }
  console.log('Date range:', minTime, 'to', maxTime);
  console.log('Segment types:', segTypes);
  console.log('Visit semanticTypes:', semanticTypes);
  console.log('Activity types:', activityTypes);
}
if (data.userLocationProfile) {
  console.log('userLocationProfile:', JSON.stringify(data.userLocationProfile, null, 2).slice(0, 1000));
}
