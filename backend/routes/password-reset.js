const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const { logAudit, logInfo, logError } = require('../config/logger');

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password'
    }
});

// Validation middleware
const validateResetRequest = [
    body('email').trim().isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
];

const validateResetPassword = [
    body('token').trim().notEmpty().withMessage('Token is required'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
];

// Request password reset
router.post('/request-reset', validateResetRequest, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors: errors.array()
        });
    }

    try {
        const { email } = req.body;

        // Find user by email
        const userQuery = 'SELECT id, username, email FROM admin_users WHERE email = $1 AND is_active = true';
        const userResult = await db.query(userQuery, [email]);

        if (userResult.rows.length === 0) {
            // Don't reveal if email exists or not (security best practice)
            return res.json({
                status: 'success',
                message: 'If your email is registered, you will receive a password reset link shortly.'
            });
        }

        const user = userResult.rows[0];

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

        // Save token to database
        const insertQuery = `
            INSERT INTO password_reset_tokens (user_id, token, expires_at)
            VALUES ($1, $2, $3)
        `;
        await db.query(insertQuery, [user.id, hashedToken, expiresAt]);

        // Send reset email
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request - Insights Elite',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #007bff;">Password Reset Request</h2>
                    <p>Hello ${user.username || 'User'},</p>
                    <p>You have requested to reset your password. Click the button below to reset it:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Reset Password</a>
                    </div>
                    <p>Or copy and paste this URL into your browser:</p>
                    <p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
                    <p><strong style="color: #dc3545;">⏰ This link will expire in 1 hour.</strong></p>
                    <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">Insights Elite - Survey Tracking System</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        logAudit('PASSWORD_RESET_REQUESTED', user.id, { email });
        logInfo('Password reset email sent', { userId: user.id, email });

        res.json({
            status: 'success',
            message: 'If your email is registered, you will receive a password reset link shortly.'
        });

    } catch (error) {
        logError(error, { action: 'PASSWORD_RESET_REQUEST' });
        res.status(500).json({
            status: 'error',
            message: 'An error occurred. Please try again later.'
        });
    }
});

// Verify reset token
router.get('/verify-token/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const query = `
            SELECT prt.id, prt.user_id, prt.expires_at, prt.used, au.email, au.username
            FROM password_reset_tokens prt
            JOIN admin_users au ON prt.user_id = au.id
            WHERE prt.token = $1 AND prt.used = false AND prt.expires_at > NOW()
        `;
        const result = await db.query(query, [hashedToken]);

        if (result.rows.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid or expired reset token'
            });
        }

        res.json({
            status: 'success',
            message: 'Token is valid',
            email: result.rows[0].email
        });

    } catch (error) {
        logError(error, { action: 'VERIFY_RESET_TOKEN' });
        res.status(500).json({
            status: 'error',
            message: 'An error occurred. Please try again later.'
        });
    }
});

// Reset password
router.post('/reset-password', validateResetPassword, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors: errors.array()
        });
    }

    try {
        const { token, password } = req.body;
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find valid token
        const tokenQuery = `
            SELECT prt.id, prt.user_id, au.email, au.username
            FROM password_reset_tokens prt
            JOIN admin_users au ON prt.user_id = au.id
            WHERE prt.token = $1 AND prt.used = false AND prt.expires_at > NOW()
        `;
        const tokenResult = await db.query(tokenQuery, [hashedToken]);

        if (tokenResult.rows.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid or expired reset token'
            });
        }

        const { id: tokenId, user_id: userId, username } = tokenResult.rows[0];

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update password
        const updateQuery = 'UPDATE admin_users SET password = $1 WHERE id = $2';
        await db.query(updateQuery, [hashedPassword, userId]);

        // Mark token as used
        const markUsedQuery = 'UPDATE password_reset_tokens SET used = true WHERE id = $1';
        await db.query(markUsedQuery, [tokenId]);

        // Log audit
        logAudit('PASSWORD_RESET_COMPLETED', userId, { username });
        logInfo('Password reset successfully', { userId, username });

        res.json({
            status: 'success',
            message: 'Password has been reset successfully. You can now login with your new password.'
        });

    } catch (error) {
        logError(error, { action: 'RESET_PASSWORD' });
        res.status(500).json({
            status: 'error',
            message: 'An error occurred. Please try again later.'
        });
    }
});

// Clean up expired tokens (should be run periodically via cron)
router.post('/cleanup-tokens', async (req, res) => {
    try {
        const query = 'DELETE FROM password_reset_tokens WHERE expires_at < NOW() OR used = true';
        const result = await db.query(query);

        logInfo('Password reset tokens cleaned up', { deletedCount: result.rowCount });

        res.json({
            status: 'success',
            message: `Cleaned up ${result.rowCount} expired tokens`
        });

    } catch (error) {
        logError(error, { action: 'CLEANUP_TOKENS' });
        res.status(500).json({
            status: 'error',
            message: 'An error occurred during cleanup'
        });
    }
});

module.exports = router;
