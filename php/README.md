# Survey Tracking System - PHP Version

## Overview
This is the PHP backend for the Survey Traffic Tracking System. It provides REST API endpoints for authentication, tracking, dashboard, admin panel, and contact form functionality.

## Requirements
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache/Nginx web server
- PDO PHP extension
- JSON PHP extension

## Installation

### 1. Database Setup
```bash
# Import the database schema
mysql -u root -p < database_mysql.sql
```

### 2. Configuration
Edit `config/config.php` and update the following:
- Database credentials in `config/database.php`
- Base URLs
- Email settings (for password reset)
- Session secret

### 3. Web Server Configuration

#### Apache (.htaccess)
The project includes `.htaccess` files for URL rewriting.

#### Nginx
Add this to your nginx configuration:
```nginx
location /api/ {
    try_files $uri $uri/ /index.php?$query_string;
}
```

### 4. Permissions
```bash
# Create logs directory
mkdir -p logs
chmod 755 logs

# Set proper permissions
chmod 644 config/*.php
chmod 644 api/*.php
```

## API Endpoints

### Authentication
- `POST /api/auth.php?action=login` - User login
- `POST /api/auth.php?action=register` - User registration
- `POST /api/auth.php?action=logout` - User logout
- `GET /api/auth.php?action=status` - Check auth status

### Tracking
- `GET /api/track.php?uid=XXX&pid=XXX&action=Complete` - Track survey completion

### Dashboard (Admin only)
- `GET /api/dashboard.php?action=records` - Get tracking records
- `GET /api/dashboard.php?action=stats` - Get statistics
- `POST /api/dashboard.php?action=callback` - Generate callback URL

### Admin (Admin only)
- `GET /api/admin.php?action=users` - Get all users
- `PUT /api/admin.php?action=users&id=X` - Update user
- `DELETE /api/admin.php?action=users&id=X` - Delete user
- `GET /api/admin.php?action=audit-logs` - Get audit logs

### Contact
- `POST /api/contact.php` - Submit contact form

### Password Reset
- `POST /api/password-reset.php?action=forgot` - Request password reset
- `GET /api/password-reset.php?action=verify&token=XXX` - Verify reset token
- `POST /api/password-reset.php?action=reset` - Reset password

## Security Features
- Password hashing with bcrypt
- Session management with timeout
- CORS protection
- SQL injection prevention (PDO prepared statements)
- XSS protection
- Audit logging
- Rate limiting (implement in web server)

## Default Credentials
- Username: `admin`
- Password: `admin123`

**⚠️ Change the default password immediately after first login!**

## Directory Structure
```
php/
├── api/
│   ├── auth.php
│   ├── track.php
│   ├── dashboard.php
│   ├── admin.php
│   ├── contact.php
│   └── password-reset.php
├── config/
│   ├── database.php
│   └── config.php
├── includes/
│   ├── cors.php
│   ├── session.php
│   └── logger.php
├── logs/
│   ├── app.log
│   └── php_errors.log
├── database_mysql.sql
└── README.md
```

## Logging
- Application logs: `logs/app.log`
- PHP errors: `logs/php_errors.log`
- Audit logs: Stored in database `audit_logs` table

## CORS Configuration
Update `$allowed_origins` in `config/config.php` to match your frontend URL.

## Production Deployment
1. Set `display_errors = 0` in php.ini
2. Enable HTTPS and set `session.cookie_secure = 1`
3. Update `BASE_URL` and `FRONTEND_URL` in config
4. Configure email settings for password reset
5. Set strong `SESSION_SECRET`
6. Implement rate limiting at web server level
7. Regular database backups

## Troubleshooting

### CORS Issues
- Check `$allowed_origins` in `config/config.php`
- Verify web server CORS headers

### Database Connection
- Verify credentials in `config/database.php`
- Check MySQL service is running
- Ensure database exists

### Session Issues
- Check PHP session configuration
- Verify session directory permissions
- Check session timeout settings

## Support
For issues or questions, please contact the development team.
