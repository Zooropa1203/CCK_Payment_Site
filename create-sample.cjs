const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

const sampleCompetition = {
  name: '2025 CCK 루빅스큐브 대회',
  description: '연중 최대 규모의 루빅스큐브 대회입니다.',
  date: '2025-09-15',
  location: '서울 올림픽공원',
  address: '서울 송파구 올림픽로 424',
  max_participants: 200,
  registration_start: '2025-08-01 09:00:00',
  registration_end: '2025-09-10 23:59:59',
  events: JSON.stringify([
    '3x3x3',
    '2x2x2',
    '4x4x4',
    '3x3x3 One-Handed',
    'Pyraminx',
    'Megaminx',
  ]),
  entry_fee: 15000,
  status: 'upcoming',
  schedule: JSON.stringify([
    { time: '10:00', event: '등록 및 체크인' },
    { time: '11:00', event: '3x3x3 1라운드' },
    { time: '13:00', event: '점심 시간' },
    { time: '14:00', event: '2x2x2, 4x4x4' },
    { time: '16:00', event: '결승전' },
  ]),
  created_by: 1,
};

db.run(
  `INSERT INTO competitions 
  (name, description, date, location, address, max_participants, registration_start, registration_end, events, entry_fee, status, schedule, created_by) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    sampleCompetition.name,
    sampleCompetition.description,
    sampleCompetition.date,
    sampleCompetition.location,
    sampleCompetition.address,
    sampleCompetition.max_participants,
    sampleCompetition.registration_start,
    sampleCompetition.registration_end,
    sampleCompetition.events,
    sampleCompetition.entry_fee,
    sampleCompetition.status,
    sampleCompetition.schedule,
    sampleCompetition.created_by,
  ],
  function (err) {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('Sample competition created with ID:', this.lastID);
    }
    db.close();
  }
);
