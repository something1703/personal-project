const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get user IP address
function getUserIP(req) {
    return req.headers['x-forwarded-for'] || 
           req.headers['x-real-ip'] || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           req.ip;
}

// Track endpoint - handles ?pid=XXX&uid=XXX&action=Complete/Terminate/Quotafull
router.get('/', async (req, res) => {
    try {
        const { uid, pid, action } = req.query;

        // Validate action
        const validActions = ['Complete', 'Terminate', 'Quotafull'];
        if (!validActions.includes(action)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid action. Allowed: Complete, Terminate, Quotafull'
            });
        }

        // Validate required parameters
        if (!uid || !pid) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required parameters: uid and pid'
            });
        }

        // Get user IP
        const ip = getUserIP(req);

        // Insert into database
        const query = 'INSERT INTO tracking (uid, pid, status, ip) VALUES ($1, $2, $3, $4) RETURNING *';
        const result = await db.query(query, [uid, pid, action, ip]);

        // Success response
        res.json({
            status: 'success',
            message: 'Tracking data saved successfully',
            data: {
                uid: uid,
                pid: pid,
                status: action,
                ip: ip,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error saving tracking data:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to save tracking data',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;
