import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Register a user
router.post('/register', async (req, res) => {
    const { uid, firstName, lastName, email, role = 'parent' } = req.body;

    if (!uid || !firstName || !lastName || !email) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const [existing] = await pool.query(
            'SELECT * FROM users WHERE firebase_uid = ? OR email = ?',
            [uid, email]
        );

        if (existing.length > 0) {
            return res.status(409).json({ message: 'User already exists' });
        }

        await pool.query(
            `INSERT INTO users (firebase_uid, first_name, last_name, email, role)
       VALUES (?, ?, ?, ?, ?)`,
            [uid, firstName, lastName, email, role]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('DB Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
