const { body, validationResult } = require('express-validator');

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

// Role-based access control
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.session.adminLoggedIn) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized. Please login first.'
            });
        }

        if (!roles.includes(req.session.adminRole)) {
            return res.status(403).json({
                status: 'error',
                message: 'Forbidden. You do not have permission to access this resource.'
            });
        }

        next();
    };
}

// Input validation middleware
const validateRegistration = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
];

const validateLogin = [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

const validateContact = [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email').trim().isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
    body('subject').trim().isLength({ min: 3, max: 255 }).withMessage('Subject must be between 3 and 255 characters'),
    body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters'),
];

// Check validation results
function checkValidation(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
}

module.exports = { 
    requireAuth, 
    requireRole,
    validateRegistration,
    validateLogin,
    validateContact,
    checkValidation
};
