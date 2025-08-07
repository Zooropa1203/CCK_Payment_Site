const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3002;
const JWT_SECRET = 'your-secret-key';

// 미들웨어
app.use(cors());
app.use(express.json());

// 데이터베이스 연결
const db = new sqlite3.Database('./database.sqlite');

// 인증 미들웨어
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// 인증 라우트
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  });
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  db.run('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', 
    [email, hashedPassword, name], 
    function(err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
          return res.status(400).json({ message: 'Email already exists' });
        }
        return res.status(500).json({ message: 'Database error' });
      }
      
      const token = jwt.sign(
        { userId: this.lastID, email, role: 'participant' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({
        token,
        user: {
          id: this.lastID,
          email,
          name,
          role: 'participant'
        }
      });
    }
  );
});

// 토큰 검증 엔드포인트
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  // authenticateToken 미들웨어에서 이미 토큰을 검증했으므로
  // req.user에 사용자 정보가 있습니다
  db.get('SELECT id, email, name, role FROM users WHERE id = ?', [req.user.userId], (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  });
});

// 대회 라우트
app.get('/api/competitions', (req, res) => {
  db.all('SELECT * FROM competitions ORDER BY date ASC', (err, competitions) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    
    // 프론트엔드 형식에 맞게 변환
    const formattedCompetitions = (competitions || []).map(comp => ({
      ...comp,
      events: comp.events ? JSON.parse(comp.events) : [], // JSON 파싱
      schedule: comp.schedule ? JSON.parse(comp.schedule) : []
    }));
    
    console.log('Returning competitions:', formattedCompetitions);
    res.json(formattedCompetitions);
  });
});

app.post('/api/competitions', authenticateToken, (req, res) => {
  const { name, description, date, location, address, max_participants, registration_start, registration_end, events, entry_fee } = req.body;
  
  console.log('Received competition data:', req.body);
  
  db.run(`INSERT INTO competitions 
    (name, description, date, location, address, max_participants, registration_start, registration_end, events, entry_fee, status, created_by) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
    [name, description, date, location || '', address || '', max_participants || 100, 
     registration_start || date, registration_end || date, JSON.stringify(events || []), 
     entry_fee || 0, 'upcoming', req.user.userId],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      console.log('Competition created with ID:', this.lastID);
      res.json({ id: this.lastID, message: 'Competition created successfully' });
    }
  );
});

app.get('/api/competitions/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM competitions WHERE id = ?', [id], (err, competition) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    
    if (!competition) {
      return res.status(404).json({ message: 'Competition not found' });
    }
    
    // 프론트엔드 형식에 맞게 변환
    const formattedCompetition = {
      ...competition,
      events: competition.events ? JSON.parse(competition.events) : [],
      schedule: competition.schedule ? JSON.parse(competition.schedule) : []
    };
    
    console.log('Returning competition:', formattedCompetition);
    res.json(formattedCompetition);
  });
});

// 결제/등록 라우트
app.post('/api/payments/register', authenticateToken, (req, res) => {
  const { competitionId, events } = req.body;
  
  // 먼저 등록 생성
  db.run('INSERT INTO registrations (user_id, competition_id, events, status) VALUES (?, ?, ?, ?)',
    [req.user.userId, competitionId, JSON.stringify(events), 'confirmed'],
    function(err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
          return res.status(400).json({ message: 'Already registered for this competition' });
        }
        return res.status(500).json({ message: 'Database error' });
      }
      
      res.json({ 
        id: this.lastID, 
        message: 'Registration successful',
        status: 'confirmed'
      });
    }
  );
});

// 헬스 체크
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
