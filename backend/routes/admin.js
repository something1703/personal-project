const express = require('express');
const router = express.Router();
const { requireRole } = require('../middleware/auth');
const { getAuditLogs } = require('../middleware/audit');
const { getUserSessions, revokeSession, revokeAllUserSessions } = require('../middleware/sessionManager');
const { logInfo, logError } = require('../config/logger');
const { getTableStats, getActiveConnections, getMissingIndexes } = require('../config/queryOptimizer');
const { getCacheStats, clearAllCaches, clearCache } = require('../config/cache');

// Get audit logs (admin only)
router.get('/logs', requireRole('admin'), async (req, res) => {
    try {
        const { userId, action, startDate, endDate, limit } = req.query;

        const filters = {};
        if (userId) filters.userId = parseInt(userId);
        if (action) filters.action = action;
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;
        if (limit) filters.limit = parseInt(limit);

        const logs = await getAuditLogs(filters);

        res.json({
            status: 'success',
            data: logs,
            count: logs.length
        });

    } catch (error) {
        logError(error, { action: 'GET_AUDIT_LOGS' });
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch audit logs'
        });
    }
});

// Get user's active sessions
router.get('/sessions', async (req, res) => {
    try {
        const userId = req.session.adminId;

        if (!userId) {
            return res.status(401).json({
                status: 'error',
                message: 'Not authenticated'
            });
        }

        const sessions = await getUserSessions(userId);

        res.json({
            status: 'success',
            data: sessions,
            current: req.sessionID
        });

    } catch (error) {
        logError(error, { action: 'GET_USER_SESSIONS', userId: req.session.adminId });
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch sessions'
        });
    }
});

// Revoke a specific session
router.delete('/sessions/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const userId = req.session.adminId;

        if (!userId) {
            return res.status(401).json({
                status: 'error',
                message: 'Not authenticated'
            });
        }

        // Verify the session belongs to the user (for security)
        const userSessions = await getUserSessions(userId);
        const sessionExists = userSessions.some(s => s.session_id === sessionId);

        if (!sessionExists && !req.session.adminRole === 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'You can only revoke your own sessions'
            });
        }

        const success = await revokeSession(sessionId);

        if (success) {
            logInfo('Session revoked by user', { userId, sessionId });
            res.json({
                status: 'success',
                message: 'Session revoked successfully'
            });
        } else {
            res.status(404).json({
                status: 'error',
                message: 'Session not found'
            });
        }

    } catch (error) {
        logError(error, { action: 'REVOKE_SESSION', userId: req.session.adminId });
        res.status(500).json({
            status: 'error',
            message: 'Failed to revoke session'
        });
    }
});

// Revoke all sessions except current
router.post('/sessions/revoke-all', async (req, res) => {
    try {
        const userId = req.session.adminId;

        if (!userId) {
            return res.status(401).json({
                status: 'error',
                message: 'Not authenticated'
            });
        }

        const count = await revokeAllUserSessions(userId, req.sessionID);

        logInfo('All sessions revoked by user', { userId, count });

        res.json({
            status: 'success',
            message: `${count} session(s) revoked successfully`
        });

    } catch (error) {
        logError(error, { action: 'REVOKE_ALL_SESSIONS', userId: req.session.adminId });
        res.status(500).json({
            status: 'error',
            message: 'Failed to revoke sessions'
        });
    }
});

// Get audit statistics (admin only)
router.get('/stats', requireRole('admin'), async (req, res) => {
    try {
        const db = require('../config/database');

        const query = `
            SELECT 
                action,
                COUNT(*) as count,
                MAX(created_at) as last_occurrence
            FROM audit_logs
            WHERE created_at > NOW() - INTERVAL '30 days'
            GROUP BY action
            ORDER BY count DESC
            LIMIT 20
        `;

        const result = await db.query(query);

        res.json({
            status: 'success',
            data: result.rows
        });

    } catch (error) {
        logError(error, { action: 'GET_AUDIT_STATS' });
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch audit statistics'
        });
    }
});

// Get performance metrics (admin only)
router.get('/performance', requireRole('admin'), async (req, res) => {
    try {
        const [trackingStats, auditStats, sessionStats, connections, cacheStats] = await Promise.all([
            getTableStats('tracking'),
            getTableStats('audit_logs'),
            getTableStats('user_sessions'),
            getActiveConnections(),
            Promise.resolve(getCacheStats())
        ]);

        res.json({
            status: 'success',
            data: {
                database: {
                    tracking: trackingStats,
                    audit_logs: auditStats,
                    user_sessions: sessionStats,
                    activeConnections: connections.length,
                    connections: connections
                },
                cache: cacheStats,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        logError(error, { action: 'GET_PERFORMANCE_METRICS' });
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch performance metrics'
        });
    }
});

// Get index suggestions for optimization (admin only)
router.get('/performance/indexes/:table', requireRole('admin'), async (req, res) => {
    try {
        const { table } = req.params;
        const suggestions = await getMissingIndexes(table);

        res.json({
            status: 'success',
            data: suggestions,
            count: suggestions.length
        });

    } catch (error) {
        logError(error, { action: 'GET_INDEX_SUGGESTIONS', table: req.params.table });
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch index suggestions'
        });
    }
});

// Clear all caches (admin only)
router.post('/performance/cache/clear', requireRole('admin'), async (req, res) => {
    try {
        const { cacheType } = req.body;

        if (cacheType && cacheType !== 'all') {
            clearCache(cacheType);
            logInfo('Cache cleared', { type: cacheType, userId: req.session.adminId });
        } else {
            clearAllCaches();
            logInfo('All caches cleared', { userId: req.session.adminId });
        }

        res.json({
            status: 'success',
            message: 'Cache cleared successfully'
        });

    } catch (error) {
        logError(error, { action: 'CLEAR_CACHE' });
        res.status(500).json({
            status: 'error',
            message: 'Failed to clear cache'
        });
    }
});

module.exports = router;
