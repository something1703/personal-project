const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { validateRegistration, validateLogin, checkValidation } = require('../middleware/auth');
const { auditMiddleware } = require('../middleware/audit');
const { logAudit, logInfo, logWarning } = require('../config/logger');

// Register endpoint
router.post('/register', validateRegistration, checkValidation, auditMiddleware('USER_REGISTER', 'user'), async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Username, email, and password are required'
            });
        }

        // Check if user already exists
        const checkQuery = 'SELECT id FROM admin_users WHERE username = $1 OR email = $2';
        const checkResult = await db.query(checkQuery, [username, email]);

        if (checkResult.rows.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Username or email already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user into database (default role: 'user')
        const insertQuery = `
            INSERT INTO admin_users (username, email, password, first_name, last_name, role, created_at)
            VALUES ($1, $2, $3, $4, $5, 'user', NOW())
            RETURNING id, username, email, role
        `;
        const result = await db.query(insertQuery, [
            username,
            email,
            hashedPassword,
            firstName || null,
            lastName || null
        ]);

        const newUser = result.rows[0];

        // Set session
        req.session.adminLoggedIn = true;
        req.session.adminId = newUser.id;
        req.session.adminUsername = newUser.username;
        req.session.adminRole = newUser.role;

        res.status(201).json({
            status: 'success',
            message: 'Registration successful',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred during registration'
        });
    }
});

// Login endpoint
router.post('/login', validateLogin, checkValidation, auditMiddleware('USER_LOGIN', 'user'), async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please enter both username and password'
            });
        }

        // Get user from database (allow login with username or email)
        const query = 'SELECT id, username, password, email, role, is_active FROM admin_users WHERE username = $1 OR email = $1';
        const result = await db.query(query, [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid username or password'
            });
        }

        const user = result.rows[0];

        // Check if account is active
        if (!user.is_active) {
            return res.status(403).json({
                status: 'error',
                message: 'Your account has been deactivated. Please contact support.'
            });
        }

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
        req.session.adminRole = user.role;

        res.json({
            status: 'success',
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
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
router.post('/logout', auditMiddleware('USER_LOGOUT', 'user'), (req, res) => {
    const userId = req.session.adminId;
    const username = req.session.adminUsername;
    
    req.session.destroy((err) => {
        if (err) {
            logWarning('Logout failed', { userId, error: err.message });
            return res.status(500).json({
                status: 'error',
                message: 'Failed to logout'
            });
        }
        
        logInfo('User logged out', { userId, username });
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
                username: req.session.adminUsername,
                role: req.session.adminRole
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
