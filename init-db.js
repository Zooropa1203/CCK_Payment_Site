const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./database.sqlite');

// 테이블 생성
db.serialize(() => {
  // users 테이블
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'participant' CHECK(role IN ('participant', 'organizer', 'administrator')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // competitions 테이블
  db.run(`CREATE TABLE IF NOT EXISTS competitions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location TEXT NOT NULL,
    max_participants INTEGER DEFAULT 100,
    registration_fee DECIMAL(10,2) DEFAULT 0.00,
    events TEXT,
    status TEXT DEFAULT 'upcoming' CHECK(status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
  )`);

  // registrations 테이블
  db.run(`CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    competition_id INTEGER NOT NULL,
    events TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'cancelled')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (competition_id) REFERENCES competitions(id),
    UNIQUE(user_id, competition_id)
  )`);

  // payments 테이블
  db.run(`CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    registration_id INTEGER NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_key TEXT,
    order_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (registration_id) REFERENCES registrations(id)
  )`);

  // 관리자 계정 생성
  const email = 'admin@test.com';
  const password = 'admin123';
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    'INSERT OR REPLACE INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
    [email, hashedPassword, 'Administrator', 'administrator'],
    function (err) {
      if (err) {
        console.error('Error creating admin:', err);
      } else {
        console.log('Database initialized and admin user created:');
        console.log('Email: admin@test.com');
        console.log('Password: admin123');
      }
      db.close();
    }
  );
});
