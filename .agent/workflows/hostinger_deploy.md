---
description: Deploy Survey Tracking (PHP + Next.js static) to Hostinger Basic Plan
---

# 🚀 Hostinger Deployment Guide (Basic Plan)

## 📋 Prerequisites Checklist

- [ ] Hostinger Basic plan account active
- [ ] FTP/SFTP credentials from Hostinger panel (Files → FTP Accounts)
- [ ] MySQL database created in Hostinger (note: DB name, user, password, host)
- [ ] Frontend built successfully (`npm run build` - ✅ DONE)
- [ ] FTP client installed (FileZilla recommended) OR use Hostinger File Manager

---

## 🔧 Step 1: Configure Database for Production

Your `php/config/database.php` file currently has local settings. Update it with your Hostinger MySQL credentials:

```php
<?php
return [
    'host' => 'localhost',              // Usually 'localhost' on Hostinger
    'dbname' => 'YOUR_HOSTINGER_DBNAME', // e.g., u123456789_survey
    'user' => 'YOUR_HOSTINGER_DBUSER',   // e.g., u123456789_dbuser
    'pass' => 'YOUR_HOSTINGER_PASSWORD', // Strong password from Hostinger
    'charset' => 'utf8mb4'
];
```

**Where to find these credentials:**
1. Log in to Hostinger hPanel
2. Go to **Databases → MySQL Databases**
3. Create a new database or use existing one
4. Note down: Database name, Username, Password, Host (usually `localhost`)

---

## 📦 Step 2: Prepare Files for Upload

### Option A: Using File Manager (Recommended for beginners)
**You'll upload these folders directly through Hostinger File Manager:**

1. **Frontend static files** (from `frontend/out/` or `frontend/.next/standalone/`)
2. **PHP backend** (entire `php/` folder)
3. **`.htaccess`** (create this - see Step 4)

### Option B: Create a deployment package (Advanced)

```bash
# Navigate to project root
cd C:\Users\DELL\OneDrive\Desktop\survey_tracking

# Create a zip with all necessary files
powershell -Command "Compress-Archive -Path php,frontend\out,.htaccess -DestinationPath hostinger_deploy.zip -Force"
```

---

## 🌐 Step 3: Upload to Hostinger

### Using Hostinger File Manager (Easiest):

1. Log in to **Hostinger hPanel**
2. Click **File Manager**
3. Navigate to **public_html/** (this is your web root)
4. **Delete default files** (index.html, coming-soon files, etc.)

#### Upload the PHP backend:
5. Click **Upload** → Select entire `php/` folder from your local machine
6. Wait for upload to complete

#### Upload the static frontend:
7. Go to `C:\Users\DELL\OneDrive\Desktop\survey_tracking\frontend\.next\`
8. Look for `standalone/` or go to `out/` folder (Next.js 16 uses `out/` for static export by default)
9. Upload **all files** from the build output to `public_html/`

**OR** if you prefer a cleaner structure:
- Upload static files to `public_html/app/`
- Upload PHP to `public_html/api/` or `public_html/php/`

### Using FileZilla (Alternative):

1. Download FileZilla from [filezilla-project.org](https://filezilla-project.org/)
2. Open FileZilla and connect:
   - **Host:** Your Hostinger FTP host (e.g., ftp.yourdomain.com)
   - **Username:** Your FTP username
   - **Password:** Your FTP password
   - **Port:** 21 (or 22 for SFTP)
3. In **Local site** (left panel): Navigate to `C:\Users\DELL\OneDrive\Desktop\survey_tracking`
4. In **Remote site** (right panel): Navigate to `/public_html/`
5. Drag and drop:
   - `php/` folder → `public_html/php/`
   - Files from `frontend/out/` → `public_html/`

---

## ⚙️ Step 4: Create .htaccess for URL Routing

Create a file named `.htaccess` in the `public_html/` directory with this content:

```apache
# Enable rewrite engine
RewriteEngine On

# Force HTTPS (optional but recommended)
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Route API requests to PHP backend
RewriteCond %{REQUEST_URI} ^/api/ [OR]
RewriteCond %{REQUEST_URI} ^/php/
RewriteRule ^(.*)$ php/$1 [L,QSA]

# Serve static Next.js files
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [L]
```

**To create this in Hostinger File Manager:**
1. Click **+ New File**
2. Name it `.htaccess`
3. Right-click → **Edit**
4. Paste the content above
5. Save

---

## 🗄️ Step 5: Import Database Schema

If your project has database tables:

1. Export your local database:
   ```bash
   # If you have a .sql file in your project
   # Otherwise, export from phpMyAdmin locally
   ```

2. In Hostinger hPanel:
   - Go to **phpMyAdmin**
   - Select your database
   - Click **Import**
   - Upload your `.sql` file
   - Click **Go**

---

## 🧪 Step 6: Test Your Deployment

1. Visit your domain: `https://yourdomain.com`
2. Test all pages:
   - ✅ Homepage (`/`)
   - ✅ About (`/about`)
   - ✅ Contact (`/contact`)
   - ✅ Login (`/login`)
   - ✅ Register (`/register`)
   - ✅ Forgot Password (`/forgot-password`)
   - ✅ Admin Dashboard (`/admin/dashboard`)
   - ✅ Services (`/services`)

3. Test PHP backend endpoints:
   - Contact form submission
   - Login/registration
   - Password reset email

4. Check browser console for errors (F12)

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **500 Internal Server Error** | Check `.htaccess` syntax; verify file permissions (755 for folders, 644 for files) |
| **Database connection failed** | Verify credentials in `database.php`; ensure database exists in Hostinger |
| **404 on all pages** | Check `.htaccess` exists and is in `public_html/` |
| **API endpoints not working** | Verify PHP version in Hostinger (Settings → PHP Configuration); should be 7.4+ |
| **CORS errors** | Add CORS headers to PHP responses (see below) |
| **Email not sending** | Configure SMTP in Hostinger or use Hostinger's default mail() function |

### Add CORS headers to PHP (if needed):

In your PHP files (e.g., `php/api/contact.php`), add at the top:

```php
<?php
header('Access-Control-Allow-Origin: https://yourdomain.com');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
// ... rest of your code
```

---

## 🔒 Security Checklist

- [ ] Update database credentials in `database.php` (no default passwords)
- [ ] Remove or protect `phpinfo()` files
- [ ] Set proper file permissions (644 for files, 755 for directories)
- [ ] Enable HTTPS (Hostinger provides free SSL)
- [ ] Add `.env` files to `.gitignore` (don't commit sensitive data)
- [ ] Test password reset functionality
- [ ] Test file upload limits (if applicable)

---

## 📊 Post-Deployment Optimizations

1. **Enable caching** in `.htaccess`:
```apache
# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

2. **Monitor error logs:**
   - Hostinger → File Manager → `public_html/error_log`

3. **Set up email notifications** for form submissions

---

## 🔄 Future Updates Workflow

### Quick update process:
1. Make changes locally
2. Test locally
3. Run `npm run build` (for frontend changes)
4. Upload only changed files via FTP/File Manager
5. Clear browser cache and test

### Automated deployment (advanced):
- Set up Git deployment through Hostinger Git integration
- Or use deployment scripts with FTP sync

---

## 📞 Need Help?

- **Hostinger Support:** Available 24/7 via live chat
- **Documentation:** [support.hostinger.com](https://support.hostinger.com)
- **Community:** Hostinger Community Forums

---

**Ready to deploy?** Start with Step 1 and work your way through! 🚀
