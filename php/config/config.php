<?php
// General configuration
define('BASE_URL', 'http://localhost/survey_tracking/php');
define('FRONTEND_URL', 'http://localhost:3000');

// Session configuration
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 0); // Set to 1 in production with HTTPS
ini_set('session.cookie_samesite', 'Lax'); // Changed from Strict to Lax for Next.js compatibility

// Session timeout (24 hours)
define('SESSION_TIMEOUT', 24 * 60 * 60);

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/php_errors.log');

// CORS settings
$allowed_origins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
];

// Rate limiting
define('RATE_LIMIT_WINDOW', 15 * 60); // 15 minutes
define('RATE_LIMIT_MAX', 100);
define('AUTH_RATE_LIMIT_MAX', 5);

// Email configuration (for password reset)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'your-email@gmail.com');
define('SMTP_PASSWORD', 'your-app-password');
define('SMTP_FROM_EMAIL', 'noreply@insightselite.com');
define('SMTP_FROM_NAME', 'Insights Elite');

// Security
define('PASSWORD_SALT_ROUNDS', 10);
define('SESSION_SECRET', 'your-secret-key-change-in-production');

// Pagination
define('DEFAULT_PAGE_LIMIT', 20);
define('MAX_PAGE_LIMIT', 100);
?>
