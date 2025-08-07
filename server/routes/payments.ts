import express from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../database/init';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Register for competition
router.post('/register', authenticateToken, [
  body('competition_id').isInt({ min: 1 }),
  body('events').isArray().isLength({ min: 1 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = (req as any).user.userId;
  const { competition_id, events } = req.body;

  // Check if competition exists and registration is open
  db.get(`
    SELECT *, 
    (SELECT COUNT(*) FROM registrations WHERE competition_id = ? AND status != 'cancelled') as current_participants
    FROM competitions WHERE id = ?
  `, [competition_id, competition_id], (err, competition: any) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (!competition) {
      return res.status(404).json({ message: 'Competition not found' });
    }

    const now = new Date();
    const registrationStart = new Date(competition.registration_start);
    const registrationEnd = new Date(competition.registration_end);

    if (now < registrationStart) {
      return res.status(400).json({ message: 'Registration not yet open' });
    }

    if (now > registrationEnd) {
      return res.status(400).json({ message: 'Registration has closed' });
    }

    // Check if user already registered
    db.get('SELECT id FROM registrations WHERE user_id = ? AND competition_id = ?', 
      [userId, competition_id], (err, existing) => {
        if (err) {
          return res.status(500).json({ message: 'Database error' });
        }

        if (existing) {
          return res.status(400).json({ message: 'Already registered for this competition' });
        }

        // Determine if this should be confirmed or waitlisted
        const status = competition.current_participants >= competition.max_participants ? 'waitlist' : 'pending';

        // Create registration
        db.run(`
          INSERT INTO registrations (user_id, competition_id, events, status)
          VALUES (?, ?, ?, ?)
        `, [userId, competition_id, JSON.stringify(events), status], function(err) {
          if (err) {
            console.error('Registration error:', err);
            return res.status(500).json({ message: 'Failed to register' });
          }

          // If confirmed, initiate payment
          if (status === 'pending') {
            // Create payment record
            db.run(`
              INSERT INTO payments (registration_id, amount, currency)
              VALUES (?, ?, 'KRW')
            `, [this.lastID, competition.entry_fee], function(err) {
              if (err) {
                console.error('Payment creation error:', err);
                return res.status(500).json({ message: 'Failed to create payment' });
              }

              res.status(201).json({
                message: 'Registration successful',
                registration_id: this.lastID,
                payment_id: this.lastID,
                amount: competition.entry_fee,
                status: 'pending'
              });
            });
          } else {
            res.status(201).json({
              message: 'Added to waitlist',
              registration_id: this.lastID,
              status: 'waitlist'
            });
          }
        });
      });
  });
});

// Process payment (Toss Payments webhook)
router.post('/toss/confirm', [
  body('paymentKey').exists(),
  body('orderId').exists(),
  body('amount').isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { paymentKey, orderId, amount } = req.body;

  try {
    // Verify payment with Toss Payments API
    const tossResponse = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(process.env.TOSS_SECRET_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount
      })
    });

    const paymentData = await tossResponse.json();

    if (tossResponse.ok) {
      // Update payment status
      db.run(`
        UPDATE payments 
        SET status = 'completed', toss_payment_id = ?, paid_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [paymentKey, orderId], function(err) {
        if (err) {
          console.error('Payment update error:', err);
          return res.status(500).json({ message: 'Failed to update payment' });
        }

        // Update registration status
        db.run(`
          UPDATE registrations 
          SET payment_status = 'completed', status = 'confirmed'
          WHERE id = (SELECT registration_id FROM payments WHERE id = ?)
        `, [orderId], (err) => {
          if (err) {
            console.error('Registration update error:', err);
            return res.status(500).json({ message: 'Failed to update registration' });
          }

          res.json({
            message: 'Payment confirmed successfully',
            paymentData
          });
        });
      });
    } else {
      // Payment failed
      db.run(`
        UPDATE payments SET status = 'failed' WHERE id = ?
      `, [orderId], (err) => {
        if (err) {
          console.error('Payment update error:', err);
        }
      });

      res.status(400).json({
        message: 'Payment confirmation failed',
        error: paymentData
      });
    }
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get payment status
router.get('/status/:paymentId', authenticateToken, (req, res) => {
  const { paymentId } = req.params;
  const userId = (req as any).user.userId;

  const query = `
    SELECT p.*, r.user_id
    FROM payments p
    JOIN registrations r ON p.registration_id = r.id
    WHERE p.id = ? AND r.user_id = ?
  `;

  db.get(query, [paymentId, userId], (err, payment) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  });
});

// Cancel registration
router.delete('/registration/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const userId = (req as any).user.userId;

  // Check if registration belongs to user
  db.get('SELECT * FROM registrations WHERE id = ? AND user_id = ?', [id, userId], (err, registration: any) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    if (registration.status === 'confirmed' && registration.payment_status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel confirmed registration. Please contact support for refunds.' });
    }

    // Cancel registration
    db.run('UPDATE registrations SET status = "cancelled" WHERE id = ?', [id], function(err) {
      if (err) {
        console.error('Cancel registration error:', err);
        return res.status(500).json({ message: 'Failed to cancel registration' });
      }

      res.json({ message: 'Registration cancelled successfully' });
    });
  });
});

export default router;
