import express from 'express';
import pool from '../db.js';

const router = express.Router();

// === GET ALL PROVINCES ===
router.get('/provinces', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT DISTINCT Province FROM schools ORDER BY Province'
        );
        res.json(rows.map(r => r.Province));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch provinces' });
    }
});

// === GET DISTRICTS BY PROVINCE ===
router.get('/districts/:province', async (req, res) => {
    const { province } = req.params;
    try {
        const [rows] = await pool.query(
            'SELECT DISTINCT EIDistrict FROM schools WHERE Province = ? ORDER BY EIDistrict',
            [province]
        );
        res.json(rows.map(r => r.EIDistrict));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch districts' });
    }
});

// === GET SCHOOLS BY DISTRICT ===
router.get('/schools/:district', async (req, res) => {
    const { district } = req.params;
    try {
        const [rows] = await pool.query(
            'SELECT NatEmis, Institution_Name, towncity FROM schools WHERE EIDistrict = ? ORDER BY Institution_Name',
            [district]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch schools' });
    }
});

// === SEARCH SCHOOLS BY NAME (wildcard) ===
router.get('/school-search', async (req, res) => {
    const { name } = req.query;

    if (!name || name.trim().length < 2) {
        return res.status(400).json({ error: 'Search term too short or missing' });
    }

    try {
        const [rows] = await pool.query(
            `SELECT NatEmis, Institution_Name, towncity, Province, EIDistrict 
       FROM schools 
       WHERE Institution_Name LIKE ? 
       ORDER BY Institution_Name 
       LIMIT 50`,
            [`%${name}%`]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search schools' });
    }
});

// === GET ALL SCHOOLS ===
router.get('/schools', async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT *
       FROM schools
       ORDER BY school_name`
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching schools:', error);
        res.status(500).json({ error: 'Failed to fetch schools' });
    }
});

export default router;
