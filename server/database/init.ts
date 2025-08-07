import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../database.sqlite');

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

export async function initDatabase() {
  return new Promise<void>((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name TEXT NOT NULL,
          phone TEXT,
          cck_id TEXT UNIQUE,
          role TEXT DEFAULT 'member' CHECK(role IN ('administrator', 'organizer', 'member')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Competitions table
      db.run(`
        CREATE TABLE IF NOT EXISTS competitions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          date DATE NOT NULL,
          location TEXT NOT NULL,
          address TEXT NOT NULL,
          max_participants INTEGER DEFAULT 100,
          registration_start DATETIME NOT NULL,
          registration_end DATETIME NOT NULL,
          events TEXT NOT NULL, -- JSON array of events
          entry_fee INTEGER DEFAULT 0, -- in KRW
          status TEXT DEFAULT 'upcoming' CHECK(status IN ('upcoming', 'registration_open', 'registration_closed', 'completed', 'cancelled')),
          schedule TEXT, -- JSON for time table
          created_by INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES users (id)
        )
      `);

      // Registrations table
      db.run(`
        CREATE TABLE IF NOT EXISTS registrations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          competition_id INTEGER NOT NULL,
          events TEXT NOT NULL, -- JSON array of selected events
          status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'waitlist', 'cancelled')),
          payment_status TEXT DEFAULT 'pending' CHECK(payment_status IN ('pending', 'completed', 'failed', 'refunded')),
          payment_id TEXT,
          registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (competition_id) REFERENCES competitions (id),
          UNIQUE(user_id, competition_id)
        )
      `);

      // Payments table
      db.run(`
        CREATE TABLE IF NOT EXISTS payments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          registration_id INTEGER NOT NULL,
          amount INTEGER NOT NULL,
          currency TEXT DEFAULT 'KRW',
          payment_method TEXT,
          toss_payment_id TEXT UNIQUE,
          status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'failed', 'cancelled', 'refunded')),
          paid_at DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (registration_id) REFERENCES registrations (id)
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Database tables created successfully');
          resolve();
        }
      });
    });
  });
}
