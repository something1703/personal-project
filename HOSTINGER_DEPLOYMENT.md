# 🚀 DEPLOYMENT CHECKLIST - theinfinityresearch.com

## ⏰ BEFORE YOU START

### 1️⃣ Gmail App Password Setup (For sharmadeep675@gmail.com)
Your admin email **sharmadeep675@gmail.com** is used for:
- ✉️ Sending password reset emails to users
- 📧 Receiving contact form submissions
- 🔔 System notifications

**Setup Steps:**
1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not already enabled)
3. Search for "App passwords" or go to https://myaccount.google.com/apppasswords
4. Select **Mail** and **Other (Custom name)** → Enter "Hostinger Survey"
5. Click **Generate**
6. **COPY THE 16-CHARACTER PASSWORD** (looks like: `abcd efgh ijkl mnop`)
7. Save it - you'll need it for `config.php`

---

## 📦 PRE-DEPLOYMENT

### Step 1: Build Frontend
```bash
cd /home/rudra/personal-project/frontend
npm run build
```
✅ This creates `frontend/out/` folder

### Step 2: Generate Session Secret
```bash
openssl rand -hex 32
```
✅ Copy this 64-character string for `config.php`

### Step 3: Prepare Files
- ✅ Frontend: `frontend/out/` (ready to upload)
- ✅ Backend: `php/` folder (ready to upload)
- ✅ Database: `php/database_mysql.sql` (ready to import)

---

## 🌐 ON HOSTINGER cPanel

### Step 1: Access cPanel
- Login to Hostinger panel
- Open cPanel (File Manager, MySQL, phpMyAdmin)

---

### Step 2: Create MySQL Database

1. **cPanel → MySQL Databases**
2. **Create Database:**
   - Name: `survey_tracking` (or any name)
   - Hostinger will prefix it (e.g., `u123456_survey_tracking`)
   - **COPY THE FULL DATABASE NAME**

3. **Create Database User:**
   - Username: `survey_admin` (or any name)
   - Password: **Generate Strong Password** (30+ characters)
   - Hostinger will prefix it (e.g., `u123456_survey_admin`)
   - **COPY USERNAME & PASSWORD**

4. **Add User to Database:**
   - Select your database and user
   - Grant **ALL PRIVILEGES**
   - Click **Add**

5. **SAVE THESE CREDENTIALS:**
   ```
   Database Host: localhost
   Database Name: u123456_survey_tracking
   Database User: u123456_survey_admin
   Database Password: [your generated password]
   ```

---

### Step 3: Import Database

1. **cPanel → phpMyAdmin**
2. Click your database name (left sidebar)
3. Click **Import** tab
4. **Choose File** → Select `database_mysql.sql`
5. Click **Go**
6. ✅ Should see "Import has been successfully finished"

---

### Step 4: Upload Files

**Using File Manager:**

1. **Upload Frontend:**
   - Go to `public_html/`
   - Delete default files (index.html, etc.)
   - Upload ALL contents from `frontend/out/`
   - Should see: `index.html`, `_next/`, folders for each page

2. **Upload Backend:**
   - Create folder: `public_html/api/`
   - Upload ALL contents from `php/` folder to `api/`
   - Should see: `api/auth.php`, `api/dashboard.php`, `config/`, `includes/`, etc.

3. **Create Logs Folder:**
   - Create: `public_html/api/logs/`
   - Right-click → Permissions → Set to **755**

---

### Step 5: Update Config Files

**Edit: `/public_html/api/config/config.php`**

Find these lines and update:
```php
// Line 37: Your Gmail App Password (from Step 1)
define('SMTP_PASSWORD', 'abcd efgh ijkl mnop'); // Paste your 16-char app password

// Line 47: Your Session Secret (from Step 2)
define('SESSION_SECRET', 'paste-your-64-character-random-string-here');
```

**Edit: `/public_html/api/config/database.php`**

Update lines 5-8 with credentials from MySQL setup:
```php
private $host = "localhost";
private $db_name = "u123456_survey_tracking"; // Your full database name
private $username = "u123456_survey_admin";    // Your full username
private $password = "your-strong-password";    // Your database password
```

---

### Step 6: Set Permissions

**Important files to check:**
- `public_html/api/logs/` → **755**
- `public_html/api/config/config.php` → **644**
- `public_html/api/config/database.php` → **644**
- All `.php` files → **644**

---

## 🧪 TESTING

### 1. Test Homepage
Visit: https://theinfinityresearch.com
- ✅ Should load the homepage
- ✅ Check browser console (F12) for errors

### 2. Test API
Visit: https://theinfinityresearch.com/api/
- ✅ Should show "Welcome to Survey Tracking API"

### 3. Test Registration
- Go to: https://theinfinityresearch.com/register
- Create a test account
- ✅ Should register successfully
- ✅ Check database (phpMyAdmin → users table)

### 4. Test Login
- Go to: https://theinfinityresearch.com/login
- Login with test account
- ✅ Should redirect to dashboard

### 5. Test Password Reset
- Go to: https://theinfinityresearch.com/forgot-password
- Enter your test email
- ✅ Check **sharmadeep675@gmail.com** inbox for reset email
- ✅ Click link → should work

### 6. Test Contact Form
- Go to: https://theinfinityresearch.com/contact
- Submit a message
- ✅ Check **sharmadeep675@gmail.com** inbox

### 7. Test Admin Dashboard
- Login with admin account (from database)
- Go to: https://theinfinityresearch.com/admin/dashboard
- ✅ Should load admin panel

---

## 🔒 SECURITY CHECKLIST

- ✅ HTTPS enabled (Hostinger provides free SSL)
- ✅ `session.cookie_secure = 1` in config.php
- ✅ Strong database password
- ✅ Gmail App Password (not main password)
- ✅ Random SESSION_SECRET generated
- ✅ Display errors OFF in production
- ✅ CORS only allows your domain
- ⚠️ Never commit `config.php` with real credentials to git

---

## 🐛 COMMON ISSUES

### Issue: "Database connection failed"
- Check database credentials in `database.php`
- Verify database exists in phpMyAdmin
- Check if user has permissions

### Issue: "CORS error" in browser
- Update `$allowed_origins` in `config.php`
- Add `www` version if needed

### Issue: "Email not sending"
- Verify Gmail App Password (not regular password)
- Check Gmail has 2FA enabled
- Check SMTP settings in `config.php`

### Issue: "404 Not Found" for API calls
- Check `.htaccess` exists in `public_html/api/`
- Verify PHP files uploaded correctly
- Check file permissions

---

## 📝 DEFAULT ADMIN ACCOUNT

Check your `database_mysql.sql` for default admin credentials.
**Change password immediately after first login!**

---

## ✅ DEPLOYMENT COMPLETE!

Your site should now be live at:
- 🌐 **Frontend**: https://theinfinityresearch.com
- 🔌 **API**: https://theinfinityresearch.com/api
- 📧 **Admin Email**: sharmadeep675@gmail.com

**Next Steps:**
1. Create admin account (if not in SQL)
2. Test all features thoroughly
3. Monitor `api/logs/php_errors.log` for issues
4. Set up regular database backups in Hostinger

---

## 🆘 NEED HELP?

If stuck, provide these details:
- Error message (browser console or php_errors.log)
- Which step you're on
- Screenshots of cPanel setup
