import express from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../database/init.ts';
import { authenticateToken, requireRole } from '../middleware/auth.ts';

const router = express.Router();

// Get all competitions
router.get('/', (req, res) => {
  const { status } = req.query;
  let query = 'SELECT * FROM competitions';
  const params: any[] = [];

  if (status) {
    query += ' WHERE status = ?';
    params.push(status);
  }

  query += ' ORDER BY date ASC';

  db.all(query, params, (err, competitions) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    // Parse JSON fields
    const formattedCompetitions = competitions.map((comp: any) => ({
      ...comp,
      events: JSON.parse(comp.events || '[]'),
      schedule: comp.schedule ? JSON.parse(comp.schedule) : null
    }));

    res.json(formattedCompetitions);
  });
});

// Get competition by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM competitions WHERE id = ?', [id], (err, competition: any) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (!competition) {
      return res.status(404).json({ message: 'Competition not found' });
    }

    // Parse JSON fields
    const formattedCompetition = {
      ...competition,
      events: JSON.parse(competition.events || '[]'),
      schedule: competition.schedule ? JSON.parse(competition.schedule) : null
    };

    res.json(formattedCompetition);
  });
});

// Get competition participants
router.get('/:id/participants', (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT u.name, u.cck_id, r.events, r.status
    FROM registrations r
    JOIN users u ON r.user_id = u.id
    WHERE r.competition_id = ? AND r.payment_status = 'completed'
    ORDER BY r.registered_at ASC
  `;

  db.all(query, [id], (err, participants) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    // Parse events JSON for each participant
    const formattedParticipants = participants.map((p: any) => ({
      ...p,
      events: JSON.parse(p.events || '[]')
    }));

    res.json(formattedParticipants);
  });
});

// Get competition waitlist
router.get('/:id/waitlist', (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT u.name, u.cck_id, r.events, r.registered_at
    FROM registrations r
    JOIN users u ON r.user_id = u.id
    WHERE r.competition_id = ? AND r.status = 'waitlist'
    ORDER BY r.registered_at ASC
  `;

  db.all(query, [id], (err, waitlist) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    // Parse events JSON for each entry
    const formattedWaitlist = waitlist.map((w: any) => ({
      ...w,
      events: JSON.parse(w.events || '[]')
    }));

    res.json(formattedWaitlist);
  });
});

// Create competition (Organizer or Admin only)
router.post('/', authenticateToken, requireRole(['organizer', 'administrator']), [
  body('name').trim().isLength({ min: 1 }),
  body('date').isISO8601(),
  body('location').trim().isLength({ min: 1 }),
  body('address').trim().isLength({ min: 1 }),
  body('registration_start').isISO8601(),
  body('registration_end').isISO8601(),
  body('events').isArray(),
  body('max_participants').optional().isInt({ min: 1 }),
  body('entry_fee').optional().isInt({ min: 0 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name,
    description,
    date,
    location,
    address,
    max_participants = 100,
    registration_start,
    registration_end,
    events,
    entry_fee = 0,
    schedule
  } = req.body;

  const userId = (req as any).user.userId;

  db.run(`
    INSERT INTO competitions (
      name, description, date, location, address, max_participants,
      registration_start, registration_end, events, entry_fee, 
      schedule, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    name, description, date, location, address, max_participants,
    registration_start, registration_end, JSON.stringify(events),
    entry_fee, schedule ? JSON.stringify(schedule) : null, userId
  ], function(err) {
    if (err) {
      console.error('Create competition error:', err);
      return res.status(500).json({ message: 'Failed to create competition' });
    }

    res.status(201).json({
      message: 'Competition created successfully',
      id: this.lastID
    });
  });
});

// Update competition (Organizer or Admin only)
router.put('/:id', authenticateToken, requireRole(['organizer', 'administrator']), [
  body('name').optional().trim().isLength({ min: 1 }),
  body('date').optional().isISO8601(),
  body('location').optional().trim().isLength({ min: 1 }),
  body('address').optional().trim().isLength({ min: 1 }),
  body('registration_start').optional().isISO8601(),
  body('registration_end').optional().isISO8601(),
  body('events').optional().isArray(),
  body('max_participants').optional().isInt({ min: 1 }),
  body('entry_fee').optional().isInt({ min: 0 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const updates = req.body;

  // Convert events and schedule to JSON if provided
  if (updates.events) {
    updates.events = JSON.stringify(updates.events);
  }
  if (updates.schedule) {
    updates.schedule = JSON.stringify(updates.schedule);
  }

  // Build update query dynamically
  const fields = Object.keys(updates);
  const setClause = fields.map(field => `${field} = ?`).join(', ');
  const values = Object.values(updates);

  db.run(
    `UPDATE competitions SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [...values, id],
    function(err) {
      if (err) {
        console.error('Update competition error:', err);
        return res.status(500).json({ message: 'Failed to update competition' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Competition not found' });
      }

      res.json({ message: 'Competition updated successfully' });
    }
  );
});

// Delete competition (Admin only)
router.delete('/:id', authenticateToken, requireRole(['administrator']), (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM competitions WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Delete competition error:', err);
      return res.status(500).json({ message: 'Failed to delete competition' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Competition not found' });
    }

    res.json({ message: 'Competition deleted successfully' });
  });
});

export default router;
