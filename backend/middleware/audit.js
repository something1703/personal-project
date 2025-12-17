const db = require('../config/database');
const { logAudit, logError } = require('../config/logger');

// Middleware to log audit events
const auditMiddleware = (action, entityType = null) => {
    return async (req, res, next) => {
        // Store original json method
        const originalJson = res.json;

        // Override json method to capture response
        res.json = function(data) {
            // Log audit event
            const auditData = {
                userId: req.session.adminId || null,
                action,
                entityType,
                entityId: req.params.id || req.body.id || null,
                ipAddress: req.ip || req.connection.remoteAddress,
                userAgent: req.get('user-agent'),
                details: {
                    method: req.method,
                    path: req.path,
                    body: sanitizeBody(req.body),
                    query: req.query,
                    statusCode: res.statusCode,
                    success: data.status === 'success'
                }
            };

            // Log to database
            saveAuditLog(auditData);

            // Log to file
            logAudit(action, auditData.userId, auditData.details);

            // Call original json method
            return originalJson.call(this, data);
        };

        next();
    };
};

// Save audit log to database
async function saveAuditLog(auditData) {
    try {
        const query = `
            INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, user_agent, details, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        `;
        
        await db.query(query, [
            auditData.userId,
            auditData.action,
            auditData.entityType,
            auditData.entityId,
            auditData.ipAddress,
            auditData.userAgent,
            JSON.stringify(auditData.details)
        ]);
    } catch (error) {
        logError(error, { context: 'SAVE_AUDIT_LOG' });
    }
}

// Sanitize sensitive data from body
function sanitizeBody(body) {
    if (!body) return {};
    
    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token', 'secret', 'apiKey'];
    
    sensitiveFields.forEach(field => {
        if (sanitized[field]) {
            sanitized[field] = '[REDACTED]';
        }
    });
    
    return sanitized;
}

// Get audit logs with filters
async function getAuditLogs(filters = {}) {
    try {
        let query = `
            SELECT 
                al.id,
                al.user_id,
                au.username,
                al.action,
                al.entity_type,
                al.entity_id,
                al.ip_address,
                al.details,
                al.created_at
            FROM audit_logs al
            LEFT JOIN admin_users au ON al.user_id = au.id
            WHERE 1=1
        `;
        
        const params = [];
        let paramIndex = 1;

        if (filters.userId) {
            query += ` AND al.user_id = $${paramIndex}`;
            params.push(filters.userId);
            paramIndex++;
        }

        if (filters.action) {
            query += ` AND al.action = $${paramIndex}`;
            params.push(filters.action);
            paramIndex++;
        }

        if (filters.startDate) {
            query += ` AND al.created_at >= $${paramIndex}`;
            params.push(filters.startDate);
            paramIndex++;
        }

        if (filters.endDate) {
            query += ` AND al.created_at <= $${paramIndex}`;
            params.push(filters.endDate);
            paramIndex++;
        }

        query += ` ORDER BY al.created_at DESC LIMIT ${filters.limit || 100}`;

        const result = await db.query(query, params);
        return result.rows;
    } catch (error) {
        logError(error, { context: 'GET_AUDIT_LOGS' });
        throw error;
    }
}

module.exports = {
    auditMiddleware,
    getAuditLogs,
    saveAuditLog
};
