import express from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../database/init';
import { authenticateToken, requireRole } from '../middleware/auth';
const router = express.Router();
// Get all users (Admin only)
router.get('/', authenticateToken, requireRole(['administrator']), (req, res) => {
    db.all('SELECT id, email, name, phone, cck_id, role, created_at FROM users ORDER BY created_at DESC', (err, users) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        res.json(users);
    });
});
// Get user profile
router.get('/profile', authenticateToken, (req, res) => {
    const userId = req.user.userId;
    db.get('SELECT id, email, name, phone, cck_id, role, created_at FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    });
});
// Update user profile
router.put('/profile', authenticateToken, [
    body('name').optional().trim().isLength({ min: 2 }),
    body('phone').optional().trim(),
    body('cck_id').optional().trim(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const userId = req.user.userId;
    const { name, phone, cck_id } = req.body;
    const updates = {};
    if (name !== undefined)
        updates.name = name;
    if (phone !== undefined)
        updates.phone = phone;
    if (cck_id !== undefined)
        updates.cck_id = cck_id;
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: 'No valid fields to update' });
    }
    const fields = Object.keys(updates);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = Object.values(updates);
    db.run(`UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [...values, userId], function (err) {
        if (err) {
            console.error('Update profile error:', err);
            return res.status(500).json({ message: 'Failed to update profile' });
        }
        res.json({ message: 'Profile updated successfully' });
    });
});
// Get user registrations
router.get('/registrations', authenticateToken, (req, res) => {
    const userId = req.user.userId;
    const query = `
    SELECT 
      r.*,
      c.name as competition_name,
      c.date as competition_date,
      c.location as competition_location
    FROM registrations r
    JOIN competitions c ON r.competition_id = c.id
    WHERE r.user_id = ?
    ORDER BY r.registered_at DESC
  `;
    db.all(query, [userId], (err, registrations) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        // Parse events JSON for each registration
        const formattedRegistrations = registrations.map((r) => ({
            ...r,
            events: JSON.parse(r.events || '[]'),
        }));
        res.json(formattedRegistrations);
    });
});
// Update user role (Admin only)
router.put('/:id/role', authenticateToken, requireRole(['administrator']), [body('role').isIn(['administrator', 'organizer', 'member'])], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const { role } = req.body;
    db.run('UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [role, id], function (err) {
        if (err) {
            console.error('Update role error:', err);
            return res.status(500).json({ message: 'Failed to update role' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User role updated successfully' });
    });
});
// Delete user (Admin only)
router.delete('/:id', authenticateToken, requireRole(['administrator']), (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
        if (err) {
            console.error('Delete user error:', err);
            return res.status(500).json({ message: 'Failed to delete user' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    });
});
export default router;
//# sourceMappingURL=users.js.map