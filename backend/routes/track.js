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

// Track endpoint - handles ?pid=XXX&uid=XXX&action=Complete/Terminate/Quotafull&redirect_url=XXX
router.get('/', async (req, res) => {
    try {
        const { uid, pid, action, redirect_url } = req.query;

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

        // If redirect_url is provided, redirect to company's URL
        if (redirect_url) {
            // Optionally append status parameters back to company
            const separator = redirect_url.includes('?') ? '&' : '?';
            const redirectWithParams = `${redirect_url}${separator}uid=${uid}&status=${action}&timestamp=${Date.now()}`;
            return res.redirect(redirectWithParams);
        }

        // Return HTML response showing status
        const statusColors = {
            'Complete': '#10b981',
            'Terminate': '#ef4444',
            'Quotafull': '#f59e0b'
        };

        const statusColor = statusColors[action] || '#6b7280';

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Survey Status - ${action}</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        min-height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        padding: 20px;
                    }
                    .container {
                        background: white;
                        border-radius: 20px;
                        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                        padding: 60px 40px;
                        text-align: center;
                        max-width: 500px;
                        width: 100%;
                    }
                    .logo {
                        width: 120px;
                        height: 120px;
                        margin: 0 auto 30px;
                        background: #f3f4f6;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 48px;
                        color: ${statusColor};
                    }
                    .status {
                        font-size: 36px;
                        font-weight: bold;
                        color: ${statusColor};
                        margin-bottom: 20px;
                    }
                    .message {
                        font-size: 18px;
                        color: #6b7280;
                        margin-bottom: 30px;
                        line-height: 1.6;
                    }
                    .details {
                        background: #f9fafb;
                        border-radius: 10px;
                        padding: 20px;
                        margin-top: 30px;
                        text-align: left;
                    }
                    .detail-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 10px 0;
                        border-bottom: 1px solid #e5e7eb;
                    }
                    .detail-row:last-child {
                        border-bottom: none;
                    }
                    .detail-label {
                        font-weight: 600;
                        color: #374151;
                    }
                    .detail-value {
                        color: #6b7280;
                    }
                    .icon {
                        font-size: 64px;
                        margin-bottom: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="logo">
                        ${action === 'Complete' ? '✓' : action === 'Terminate' ? '✕' : '⚠'}
                    </div>
                    <div class="status">${action}</div>
                    <div class="message">
                        ${action === 'Complete' ? 'Thank you for completing the survey!' : 
                          action === 'Terminate' ? 'Survey terminated.' : 
                          'Survey quota has been reached.'}
                    </div>
                    <div class="details">
                        <div class="detail-row">
                            <span class="detail-label">Reference ID:</span>
                            <span class="detail-value">${uid}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Project ID:</span>
                            <span class="detail-value">${pid}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Status:</span>
                            <span class="detail-value" style="color: ${statusColor}; font-weight: 600;">${action}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Timestamp:</span>
                            <span class="detail-value">${new Date().toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `);

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
