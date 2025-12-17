const express = require('express');
const router = express.Router();
const db = require('../config/database');
const nodemailer = require('nodemailer');
const { validateContact, checkValidation } = require('../middleware/auth');

// Configure email transporter
// For Gmail: You need to enable "Less secure app access" or use App Password
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use 'gmail', 'yahoo', 'outlook', etc.
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com', // Add your email
        pass: process.env.EMAIL_PASSWORD || 'your-app-password' // Add your app password
    }
});

// Submit contact form
router.post('/submit', validateContact, checkValidation, async (req, res) => {
    try {
        const { name, email, subject, message, phone } = req.body;

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

        // Send email notification
        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: 'contact@insightselite.com', // Your company email to receive notifications
            subject: `New Contact Form Submission: ${subject}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
                <hr>
                <p><small>Sent from Insights Elite Contact Form</small></p>
            `
        };

        // Send auto-reply to user
        const autoReplyOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: email,
            subject: 'Thank you for contacting Insights Elite',
            html: `
                <h2>Thank you for contacting us!</h2>
                <p>Dear ${name},</p>
                <p>We have received your message and will get back to you shortly.</p>
                <p><strong>Your message:</strong></p>
                <p>${message}</p>
                <hr>
                <p>Best regards,<br>Insights Elite Team</p>
            `
        };

        // Send both emails
        try {
            await transporter.sendMail(mailOptions);
            await transporter.sendMail(autoReplyOptions);
            console.log('Emails sent successfully');
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            // Continue even if email fails - form is still saved to database
        }

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
