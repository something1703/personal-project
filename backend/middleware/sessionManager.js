const db = require('../config/database');
const { logWarning, logInfo } = require('../config/logger');

// Session timeout in milliseconds (30 minutes of inactivity)
const SESSION_TIMEOUT = 30 * 60 * 1000;

// Middleware to check session timeout
const checkSessionTimeout = async (req, res, next) => {
    if (!req.session.adminLoggedIn) {
        return next();
    }

    const now = Date.now();
    const lastActivity = req.session.lastActivity || now;
    const timeSinceLastActivity = now - lastActivity;

    // Check if session has timed out
    if (timeSinceLastActivity > SESSION_TIMEOUT) {
        const userId = req.session.adminId;
        const username = req.session.adminUsername;

        // Destroy session
        req.session.destroy((err) => {
            if (err) {
                logWarning('Error destroying timed out session', { userId, error: err.message });
            }
        });

        logInfo('Session timed out', { userId, username, inactivityDuration: timeSinceLastActivity });

        return res.status(401).json({
            status: 'error',
            message: 'Your session has expired due to inactivity. Please login again.',
            code: 'SESSION_TIMEOUT'
        });
    }

    // Update last activity time
    req.session.lastActivity = now;
    
    // Save session (force update)
    req.session.save((err) => {
        if (err) {
            logWarning('Error saving session', { userId: req.session.adminId, error: err.message });
        }
    });

    next();
};

// Middleware to track user sessions in database
const trackSession = async (req, res, next) => {
    if (!req.session.adminLoggedIn) {
        return next();
    }

    try {
        const sessionData = {
            userId: req.session.adminId,
            sessionId: req.sessionID,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent'),
            expiresAt: new Date(Date.now() + SESSION_TIMEOUT)
        };

        // Upsert session in database
        const query = `
            INSERT INTO user_sessions (user_id, session_id, ip_address, user_agent, last_activity, expires_at)
            VALUES ($1, $2, $3, $4, NOW(), $5)
            ON CONFLICT (session_id) 
            DO UPDATE SET 
                last_activity = NOW(),
                expires_at = $5
        `;

        await db.query(query, [
            sessionData.userId,
            sessionData.sessionId,
            sessionData.ipAddress,
            sessionData.userAgent,
            sessionData.expiresAt
        ]);

    } catch (error) {
        // Don't block request if session tracking fails
        logWarning('Error tracking session', { 
            userId: req.session.adminId, 
            error: error.message 
        });
    }

    next();
};

// Clean up expired sessions from database
const cleanupExpiredSessions = async () => {
    try {
        const query = 'DELETE FROM user_sessions WHERE expires_at < NOW()';
        const result = await db.query(query);
        
        if (result.rowCount > 0) {
            logInfo('Cleaned up expired sessions', { count: result.rowCount });
        }
        
        return result.rowCount;
    } catch (error) {
        logWarning('Error cleaning up expired sessions', { error: error.message });
        throw error;
    }
};

// Get active sessions for a user
const getUserSessions = async (userId) => {
    try {
        const query = `
            SELECT 
                session_id,
                ip_address,
                user_agent,
                last_activity,
                expires_at,
                created_at
            FROM user_sessions
            WHERE user_id = $1 AND expires_at > NOW()
            ORDER BY last_activity DESC
        `;
        
        const result = await db.query(query, [userId]);
        return result.rows;
    } catch (error) {
        logWarning('Error fetching user sessions', { userId, error: error.message });
        throw error;
    }
};

// Revoke a specific session
const revokeSession = async (sessionId) => {
    try {
        const query = 'DELETE FROM user_sessions WHERE session_id = $1';
        const result = await db.query(query, [sessionId]);
        
        logInfo('Session revoked', { sessionId });
        return result.rowCount > 0;
    } catch (error) {
        logWarning('Error revoking session', { sessionId, error: error.message });
        throw error;
    }
};

// Revoke all sessions for a user (except current)
const revokeAllUserSessions = async (userId, exceptSessionId = null) => {
    try {
        let query = 'DELETE FROM user_sessions WHERE user_id = $1';
        const params = [userId];

        if (exceptSessionId) {
            query += ' AND session_id != $2';
            params.push(exceptSessionId);
        }

        const result = await db.query(query, params);
        
        logInfo('All user sessions revoked', { userId, count: result.rowCount });
        return result.rowCount;
    } catch (error) {
        logWarning('Error revoking all user sessions', { userId, error: error.message });
        throw error;
    }
};

// Run cleanup periodically (every 15 minutes)
const startSessionCleanup = () => {
    const CLEANUP_INTERVAL = 15 * 60 * 1000; // 15 minutes
    
    setInterval(async () => {
        try {
            await cleanupExpiredSessions();
        } catch (error) {
            logWarning('Scheduled session cleanup failed', { error: error.message });
        }
    }, CLEANUP_INTERVAL);

    logInfo('Session cleanup scheduler started', { interval: '15 minutes' });
};

module.exports = {
    checkSessionTimeout,
    trackSession,
    cleanupExpiredSessions,
    getUserSessions,
    revokeSession,
    revokeAllUserSessions,
    startSessionCleanup,
    SESSION_TIMEOUT
};
