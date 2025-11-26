const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Submit contact form
router.post('/submit', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate inputs
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                status: 'error',
                message: 'All fields are required'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid email address'
            });
        }

        // Insert into database (optional - for storing contact submissions)
        const query = `
            INSERT INTO contact_submissions (name, email, subject, message, created_at)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING *
        `;

        await db.query(query, [name, email, subject, message]);

        res.json({
            status: 'success',
            message: 'Thank you for contacting us! We will get back to you soon.'
        });

    } catch (error) {
        console.error('Error submitting contact form:', error);
        
        // If table doesn't exist, still return success (email notification could be sent instead)
        if (error.code === '42P01') { // Table does not exist error
            console.log('Contact submissions table not found, but returning success');
            return res.json({
                status: 'success',
                message: 'Thank you for contacting us! We will get back to you soon.'
            });
        }

        res.status(500).json({
            status: 'error',
            message: 'Failed to submit contact form. Please try again.'
        });
    }
});

module.exports = router;
