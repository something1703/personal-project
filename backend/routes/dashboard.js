const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { requireAuth, requireRole } = require('../middleware/auth');
const { cacheMiddleware, statsCache, dashboardCache } = require('../config/cache');

// Get all tracking records with filters and pagination
// Only admin and viewer roles can access
router.get('/records', requireRole('admin', 'viewer'), cacheMiddleware(120, dashboardCache), async (req, res) => {
    try {
        const { pid, status, search, page = 1, limit = 20 } = req.query;
        
        let query = 'SELECT * FROM tracking WHERE 1=1';
        let countQuery = 'SELECT COUNT(*) as total FROM tracking WHERE 1=1';
        const params = [];
        const countParams = [];
        let paramIndex = 1;
        let countParamIndex = 1;

        // Filter by Project ID
        if (pid) {
            query += ` AND pid = $${paramIndex++}`;
            countQuery += ` AND pid = $${countParamIndex++}`;
            params.push(pid);
            countParams.push(pid);
        }

        // Filter by Status
        if (status) {
            query += ` AND status = $${paramIndex++}`;
            countQuery += ` AND status = $${countParamIndex++}`;
            params.push(status);
            countParams.push(status);
        }

        // Search in UID or PID
        if (search) {
            query += ` AND (uid ILIKE $${paramIndex++} OR pid ILIKE $${paramIndex++})`;
            countQuery += ` AND (uid ILIKE $${countParamIndex++} OR pid ILIKE $${countParamIndex++})`;
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm);
            countParams.push(searchTerm, searchTerm);
        }

        // Get total count
        const countResult = await db.query(countQuery, countParams);
        const total = parseInt(countResult.rows[0].total);

        // Add ordering and pagination
        query += ` ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        params.push(parseInt(limit), offset);

        // Get records
        const result = await db.query(query, params);

        res.json({
            status: 'success',
            data: result.rows,
            pagination: {
                total: total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch records'
        });
    }
});

// Get statistics
router.get('/stats', requireRole('admin', 'viewer'), cacheMiddleware(300, statsCache), async (req, res) => {
    try {
        const query = `
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Complete' THEN 1 ELSE 0 END) as complete,
                SUM(CASE WHEN status = 'Terminate' THEN 1 ELSE 0 END) as terminate,
                SUM(CASE WHEN status = 'Quotafull' THEN 1 ELSE 0 END) as quotafull
            FROM tracking
        `;
        
        const result = await db.query(query);
        
        res.json({
            status: 'success',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch statistics'
        });
    }
});

// Trigger callback (hit URL with UID)
// Temporarily removed requireAuth for testing
router.post('/callback', async (req, res) => {
    try {
        const { baseUrl, uid } = req.body;

        if (!baseUrl || !uid) {
            return res.status(400).json({
                status: 'error',
                message: 'Base URL and UID are required'
            });
        }

        // Generate final URL
        const finalUrl = baseUrl.includes('uid=') 
            ? baseUrl.replace(/uid=([^&]*)/, `uid=${uid}`)
            : `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}uid=${uid}`;

        // Optional: Actually trigger the URL using fetch or axios
        // const response = await fetch(finalUrl);

        res.json({
            status: 'success',
            message: 'Callback URL generated',
            data: {
                generatedUrl: finalUrl,
                uid: uid
            }
        });

    } catch (error) {
        console.error('Error generating callback:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to generate callback'
        });
    }
});

module.exports = router;
