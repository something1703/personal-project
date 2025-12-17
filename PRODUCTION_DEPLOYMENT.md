# Production Deployment Guide

## Security Improvements Implemented ✅

### 1. Rate Limiting
- ✅ General API rate limit: 100 requests per 15 minutes per IP
- ✅ Login rate limit: 5 attempts per 15 minutes per IP
- ✅ Prevents brute force attacks and API abuse

### 2. Security Headers
- ✅ Helmet.js installed for security headers
- ✅ XSS protection enabled
- ✅ CSRF protection via sameSite cookies

### 3. Input Validation & Sanitization
- ✅ express-validator for all inputs
- ✅ Username: 3-50 chars, alphanumeric + underscores
- ✅ Email: valid format, normalized
- ✅ Password: min 8 chars, must contain uppercase, lowercase, number, special char
- ✅ XSS-clean middleware for sanitization

### 4. User Role System
- ✅ Database schema updated with role field (admin, user, viewer)
- ✅ Role-based middleware implemented
- ✅ Dashboard restricted to admin and viewer roles
- ✅ Account activation system (is_active field)

### 5. Environment Configuration
- ✅ No hardcoded URLs - all use environment variables
- ✅ Frontend: NEXT_PUBLIC_API_URL
- ✅ Backend: ALLOWED_ORIGINS for CORS
- ✅ Proper HTTPS support in production

### 6. Production Optimizations
- ✅ Compression middleware for responses
- ✅ Body size limits (10mb)
- ✅ Proper error handling (no stack traces in production)
- ✅ Session security (httpOnly, sameSite strict)

---

## Pre-Deployment Checklist

### Backend (.env configuration)

```env
# Database - Update with production credentials
DB_HOST=your-production-db-host
DB_USER=your-production-db-user
DB_PASSWORD=strong-production-password
DB_NAME=survey_tracking
DB_PORT=5432

# Server
PORT=5000
SESSION_SECRET=GENERATE-A-STRONG-RANDOM-SECRET-HERE-64-CHARS-MIN

# Environment
NODE_ENV=production

# CORS - Add your production frontend URLs
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Email - Use App Password, not regular password
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

## Database Migration

Run these SQL commands to update existing database:

```sql
-- Add role and is_active columns to existing tables
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user', 'viewer')),
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update existing admin user to admin role
UPDATE admin_users SET role = 'admin' WHERE username = 'admin';
```

---

## Deployment Steps for Hostinger

### 1. Prepare Your VPS

```bash
# Connect via SSH
ssh root@your-vps-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install PostgreSQL (if not using managed database)
sudo apt install postgresql postgresql-contrib
```

### 2. Upload Your Code

```bash
# Clone from GitHub
git clone https://github.com/yourusername/survey_tracking.git
cd survey_tracking

# Or upload via SFTP/SCP
```

### 3. Backend Setup

```bash
cd backend
npm install --production

# Create .env file with production values
nano .env
# Paste your production environment variables

# Test the backend
npm start

# If working, set up PM2
pm2 start server.js --name survey-backend
pm2 save
pm2 startup
```

### 4. Frontend Setup

```bash
cd ../frontend
npm install

# Create .env.local with production API URL
nano .env.local

# Build for production
npm run build

# Start with PM2
pm2 start npm --name survey-frontend -- start
pm2 save
```

### 5. Set Up Nginx Reverse Proxy

```bash
sudo apt install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/survey-tracking
```

Paste this configuration:

```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/survey-tracking /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Set Up SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx

# Get SSL certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Auto-renewal is set up automatically
sudo certbot renew --dry-run
```

### 7. Configure Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database
CREATE DATABASE survey_tracking;
\c survey_tracking

# Run your database.sql file
\i /path/to/database.sql

# Create database user (if needed)
CREATE USER survey_user WITH PASSWORD 'strong-password';
GRANT ALL PRIVILEGES ON DATABASE survey_tracking TO survey_user;
```

### 8. Final Checks

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs

# Monitor processes
pm2 monit

# Test your application
curl https://api.yourdomain.com/api/health
```

---

## Post-Deployment

### Security Hardening

1. **Change default PostgreSQL password**
2. **Set up firewall (UFW)**:
   ```bash
   sudo ufw allow OpenSSH
   sudo ufw allow 'Nginx Full'
   sudo ufw enable
   ```

3. **Regular updates**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

4. **Monitor logs**:
   ```bash
   pm2 logs
   sudo tail -f /var/log/nginx/error.log
   ```

### Monitoring

- Set up monitoring with services like:
  - **PM2 Plus** for process monitoring
  - **Sentry** for error tracking
  - **Google Analytics** for user analytics

### Backup

- Set up automated database backups:
  ```bash
  # Create backup script
  sudo nano /usr/local/bin/backup-db.sh
  ```

  ```bash
  #!/bin/bash
  pg_dump -U postgres survey_tracking > /backups/survey_tracking_$(date +%Y%m%d).sql
  ```

  ```bash
  sudo chmod +x /usr/local/bin/backup-db.sh
  
  # Add to crontab (daily at 2 AM)
  crontab -e
  0 2 * * * /usr/local/bin/backup-db.sh
  ```

---

## Testing Production

1. **Test authentication**: Login and registration
2. **Test dashboard**: View data, filters, CSV export
3. **Test contact form**: Submit and verify email
4. **Test tracking**: `https://api.yourdomain.com/api/track?uid=test&pid=TEST&status=Complete`
5. **Test security**: Try XSS, SQL injection, rate limiting

---

## Troubleshooting

### Common Issues

1. **CORS errors**: Check ALLOWED_ORIGINS in backend .env
2. **Session not persisting**: Ensure cookies are HTTPS-only in production
3. **Database connection failed**: Check DB credentials and firewall
4. **502 Bad Gateway**: Backend not running, check `pm2 status`
5. **Rate limit errors**: Wait 15 minutes or restart backend

### Useful Commands

```bash
# Restart services
pm2 restart all

# View logs
pm2 logs survey-backend
pm2 logs survey-frontend

# Nginx
sudo systemctl restart nginx
sudo nginx -t

# Database
sudo systemctl status postgresql
sudo -u postgres psql survey_tracking
```

---

## Success! 🎉

Your application is now deployed with:
- ✅ Rate limiting
- ✅ XSS & CSRF protection
- ✅ Input validation
- ✅ Role-based access control
- ✅ HTTPS encryption
- ✅ Environment-based configuration
- ✅ Production optimizations

Access your application at: **https://yourdomain.com**
