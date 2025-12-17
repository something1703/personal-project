const NodeCache = require('node-cache');
const { logInfo, logDebug } = require('./logger');

// Create cache instances with different TTLs
// Stats cache - 5 minutes
const statsCache = new NodeCache({
    stdTTL: 300, // 5 minutes
    checkperiod: 60, // Check for expired keys every 60 seconds
    useClones: false
});

// Dashboard data cache - 2 minutes
const dashboardCache = new NodeCache({
    stdTTL: 120, // 2 minutes
    checkperiod: 30,
    useClones: false
});

// User session cache - 30 minutes
const userCache = new NodeCache({
    stdTTL: 1800, // 30 minutes
    checkperiod: 120,
    useClones: false
});

// General purpose cache - 10 minutes
const generalCache = new NodeCache({
    stdTTL: 600, // 10 minutes
    checkperiod: 60,
    useClones: false
});

// Cache middleware for Express routes
const cacheMiddleware = (duration = 300, cacheInstance = generalCache) => {
    return (req, res, next) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        // Create cache key from URL and query params
        const key = `${req.path}_${JSON.stringify(req.query)}`;

        // Try to get cached response
        const cachedResponse = cacheInstance.get(key);

        if (cachedResponse) {
            logDebug('Cache hit', { key, path: req.path });
            return res.json(cachedResponse);
        }

        // Store original json method
        const originalJson = res.json.bind(res);

        // Override json method to cache response
        res.json = (body) => {
            // Only cache successful responses
            if (body.status === 'success') {
                cacheInstance.set(key, body, duration);
                logDebug('Cache set', { key, path: req.path, ttl: duration });
            }
            return originalJson(body);
        };

        next();
    };
};

// Helper functions
const getCacheStats = () => {
    return {
        stats: statsCache.getStats(),
        dashboard: dashboardCache.getStats(),
        user: userCache.getStats(),
        general: generalCache.getStats()
    };
};

const clearAllCaches = () => {
    statsCache.flushAll();
    dashboardCache.flushAll();
    userCache.flushAll();
    generalCache.flushAll();
    logInfo('All caches cleared');
};

const clearCache = (cacheInstance, pattern = null) => {
    if (pattern) {
        const keys = cacheInstance.keys();
        const matchedKeys = keys.filter(key => key.includes(pattern));
        matchedKeys.forEach(key => cacheInstance.del(key));
        logInfo('Cache cleared by pattern', { pattern, count: matchedKeys.length });
    } else {
        cacheInstance.flushAll();
        logInfo('Cache instance cleared');
    }
};

// Set up cache event listeners
[statsCache, dashboardCache, userCache, generalCache].forEach(cache => {
    cache.on('expired', (key, value) => {
        logDebug('Cache key expired', { key });
    });

    cache.on('flush', () => {
        logDebug('Cache flushed');
    });
});

module.exports = {
    // Cache instances
    statsCache,
    dashboardCache,
    userCache,
    generalCache,
    
    // Middleware
    cacheMiddleware,
    
    // Helper functions
    getCacheStats,
    clearAllCaches,
    clearCache
};
