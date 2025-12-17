const db = require('./database');
const { logInfo, logWarning, logError } = require('./logger');

/**
 * Analyze query performance
 * @param {string} query - SQL query to analyze
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query analysis results
 */
const analyzeQuery = async (query, params = []) => {
    try {
        const explainQuery = `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) ${query}`;
        const result = await db.query(explainQuery, params);
        
        const plan = result.rows[0]['QUERY PLAN'][0];
        const executionTime = plan['Execution Time'];
        const planningTime = plan['Planning Time'];
        const totalTime = executionTime + planningTime;

        logInfo('Query Analysis', {
            executionTime: `${executionTime.toFixed(2)}ms`,
            planningTime: `${planningTime.toFixed(2)}ms`,
            totalTime: `${totalTime.toFixed(2)}ms`
        });

        // Warn if query is slow
        if (totalTime > 100) {
            logWarning('Slow query detected', {
                query: query.substring(0, 100) + '...',
                totalTime: `${totalTime.toFixed(2)}ms`
            });
        }

        return {
            executionTime,
            planningTime,
            totalTime,
            plan: plan.Plan
        };

    } catch (error) {
        logError(error, { context: 'QUERY_ANALYSIS', query: query.substring(0, 100) });
        throw error;
    }
};

/**
 * Execute query with performance monitoring
 * @param {string} query - SQL query
 * @param {Array} params - Query parameters
 * @param {Object} options - Options {analyze: boolean, logSlow: boolean, slowThreshold: number}
 * @returns {Promise<Object>} Query results
 */
const executeQuery = async (query, params = [], options = {}) => {
    const {
        analyze = false,
        logSlow = true,
        slowThreshold = 100 // milliseconds
    } = options;

    const startTime = Date.now();

    try {
        const result = await db.query(query, params);
        const executionTime = Date.now() - startTime;

        // Log slow queries
        if (logSlow && executionTime > slowThreshold) {
            logWarning('Slow query detected', {
                query: query.substring(0, 100) + '...',
                executionTime: `${executionTime}ms`,
                rowCount: result.rows.length
            });
        }

        // Analyze if requested
        if (analyze && process.env.NODE_ENV === 'development') {
            await analyzeQuery(query, params);
        }

        return result;

    } catch (error) {
        const executionTime = Date.now() - startTime;
        logError(error, {
            context: 'QUERY_EXECUTION',
            query: query.substring(0, 100),
            executionTime: `${executionTime}ms`
        });
        throw error;
    }
};

/**
 * Build optimized pagination query
 * @param {string} table - Table name
 * @param {Object} options - Options {where, orderBy, limit, offset, select}
 * @returns {Object} Query and parameters
 */
const buildPaginationQuery = (table, options = {}) => {
    const {
        where = '',
        orderBy = 'created_at DESC',
        limit = 20,
        offset = 0,
        select = '*'
    } = options;

    const query = `
        SELECT ${select}
        FROM ${table}
        ${where ? `WHERE ${where}` : ''}
        ORDER BY ${orderBy}
        LIMIT $1 OFFSET $2
    `;

    return {
        query: query.trim(),
        params: [limit, offset]
    };
};

/**
 * Build optimized count query
 * @param {string} table - Table name
 * @param {Object} options - Options {where}
 * @returns {string} Count query
 */
const buildCountQuery = (table, options = {}) => {
    const { where = '' } = options;

    return `
        SELECT COUNT(*) as total
        FROM ${table}
        ${where ? `WHERE ${where}` : ''}
    `.trim();
};

/**
 * Get table statistics
 * @param {string} table - Table name
 * @returns {Promise<Object>} Table statistics
 */
const getTableStats = async (table) => {
    try {
        const query = `
            SELECT 
                schemaname,
                tablename,
                pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
                pg_total_relation_size(schemaname||'.'||tablename) as size_bytes,
                n_tup_ins as inserts,
                n_tup_upd as updates,
                n_tup_del as deletes,
                n_live_tup as live_rows,
                n_dead_tup as dead_rows,
                last_vacuum,
                last_autovacuum,
                last_analyze,
                last_autoanalyze
            FROM pg_stat_user_tables
            WHERE tablename = $1
        `;

        const result = await db.query(query, [table]);
        
        if (result.rows.length > 0) {
            logInfo('Table Statistics', { table, stats: result.rows[0] });
            return result.rows[0];
        }

        return null;

    } catch (error) {
        logError(error, { context: 'GET_TABLE_STATS', table });
        throw error;
    }
};

/**
 * Get missing indexes suggestions
 * @param {string} table - Table name
 * @returns {Promise<Array>} Suggested indexes
 */
const getMissingIndexes = async (table) => {
    try {
        const query = `
            SELECT
                schemaname,
                tablename,
                attname,
                n_distinct,
                correlation
            FROM pg_stats
            WHERE tablename = $1
            AND n_distinct > 100
            AND correlation < 0.5
            ORDER BY n_distinct DESC
        `;

        const result = await db.query(query, [table]);
        
        const suggestions = result.rows.map(row => ({
            column: row.attname,
            distinctValues: row.n_distinct,
            correlation: row.correlation,
            suggestion: `CREATE INDEX idx_${table}_${row.attname} ON ${table}(${row.attname});`
        }));

        if (suggestions.length > 0) {
            logInfo('Index Suggestions', { table, count: suggestions.length });
        }

        return suggestions;

    } catch (error) {
        logError(error, { context: 'GET_MISSING_INDEXES', table });
        throw error;
    }
};

/**
 * Vacuum and analyze table
 * @param {string} table - Table name
 * @returns {Promise<void>}
 */
const optimizeTable = async (table) => {
    try {
        logInfo('Optimizing table', { table });
        
        await db.query(`VACUUM ANALYZE ${table}`);
        
        logInfo('Table optimized', { table });

    } catch (error) {
        logError(error, { context: 'OPTIMIZE_TABLE', table });
        throw error;
    }
};

/**
 * Get active connections
 * @returns {Promise<Array>} Active connections
 */
const getActiveConnections = async () => {
    try {
        const query = `
            SELECT 
                pid,
                usename,
                application_name,
                client_addr,
                state,
                query,
                query_start,
                state_change
            FROM pg_stat_activity
            WHERE state != 'idle'
            AND pid != pg_backend_pid()
            ORDER BY query_start DESC
        `;

        const result = await db.query(query);
        return result.rows;

    } catch (error) {
        logError(error, { context: 'GET_ACTIVE_CONNECTIONS' });
        throw error;
    }
};

/**
 * Kill long-running queries
 * @param {number} maxDuration - Maximum query duration in seconds
 * @returns {Promise<number>} Number of queries killed
 */
const killLongRunningQueries = async (maxDuration = 300) => {
    try {
        const query = `
            SELECT pg_terminate_backend(pid)
            FROM pg_stat_activity
            WHERE state = 'active'
            AND pid != pg_backend_pid()
            AND query_start < NOW() - INTERVAL '${maxDuration} seconds'
        `;

        const result = await db.query(query);
        const killed = result.rows.length;

        if (killed > 0) {
            logWarning('Long-running queries killed', { count: killed, maxDuration });
        }

        return killed;

    } catch (error) {
        logError(error, { context: 'KILL_LONG_RUNNING_QUERIES' });
        throw error;
    }
};

module.exports = {
    analyzeQuery,
    executeQuery,
    buildPaginationQuery,
    buildCountQuery,
    getTableStats,
    getMissingIndexes,
    optimizeTable,
    getActiveConnections,
    killLongRunningQueries
};
