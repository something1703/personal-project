const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/database');

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please enter both username and password'
            });
        }

        // Get user from database
        const query = 'SELECT id, username, password FROM admin_users WHERE username = $1';
        const result = await db.query(query, [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid username or password'
            });
        }

        const user = result.rows[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid username or password'
            });
        }

        // Set session
        req.session.adminLoggedIn = true;
        req.session.adminId = user.id;
        req.session.adminUsername = user.username;

        res.json({
            status: 'success',
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred during login'
        });
    }
});

// Logout endpoint
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Failed to logout'
            });
        }
        res.json({
            status: 'success',
            message: 'Logout successful'
        });
    });
});

// Check auth status
router.get('/status', (req, res) => {
    if (req.session.adminLoggedIn) {
        res.json({
            status: 'success',
            authenticated: true,
            user: {
                id: req.session.adminId,
                username: req.session.adminUsername
            }
        });
    } else {
        res.json({
            status: 'success',
            authenticated: false
        });
    }
});

module.exports = router;
