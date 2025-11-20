// Authentication middleware
function requireAuth(req, res, next) {
    if (!req.session.adminLoggedIn) {
        return res.status(401).json({
            status: 'error',
            message: 'Unauthorized. Please login first.'
        });
    }
    next();
}

module.exports = { requireAuth };
