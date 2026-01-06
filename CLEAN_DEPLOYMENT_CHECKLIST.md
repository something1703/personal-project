# 🧹 CLEAN DEPLOYMENT CHECKLIST
**Deleting all old files and deploying fresh - Step by step**

---

## ⚠️ BEFORE YOU START (5 minutes)

### Step 1: Update Local Configuration Files

**File: `php/config/config.php`**

Open the file and update these 2 lines:

```php
// Line 35 - Gmail App Password:
define('SMTP_PASSWORD', 'xxxx xxxx xxxx xxxx');  // Get from Google Account

// Line 42 - Session Secret:
define('SESSION_SECRET', 'YOUR_64_CHAR_RANDOM_STRING');  // Generate using command below
```

**Generate Session Secret:**
```bash
# Git Bash:
openssl rand -base64 64 | tr -d '\n'

# PowerShell:
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

**Get Gmail App Password:**
1. Go to: https://myaccount.google.com/security
2. Click: 2-Step Verification → App passwords
3. Generate for "Mail" + "Other (Custom)"
4. Copy the 16-character password

✅ **Verify:** Check both values are updated, no placeholders remain

---

## 📦 PHASE 1: BACKUP HOSTINGER (3 minutes)

1. **Login to Hostinger:**
   - Go to: https://hpanel.hostinger.com/
   - Login with your credentials

2. **Open File Manager:**
   - Select your hosting account
   - Click "File Manager"

3. **Backup Current Files:**
   - Navigate to: `/domains/theinfinityresearch.com/public_html/`
   - Select ALL files (Ctrl+A)
   - Right-click → "Compress"
   - Name: `backup_2026-01-06.zip`
   - Click "Compress"
   - Download the zip file to your computer
   - Store safely (in case you need to restore)

✅ **Verify:** Backup downloaded successfully

---

## 🗑️ PHASE 2: DELETE OLD FILES (3 minutes)

**⚠️ WARNING:** Make sure you have the backup first!

1. **In File Manager:**
   - Still in: `/domains/theinfinityresearch.com/public_html/`
   - Select ALL files and folders (Ctrl+A)

2. **Delete Everything:**
   - Right-click → "Delete"
   - Confirm deletion
   - Wait for deletion to complete

3. **Verify Empty:**
   - Folder should now be empty
   - Refresh page to confirm

✅ **Verify:** `public_html/` folder is completely empty

---

## 📤 PHASE 3: UPLOAD NEW FILES (15 minutes)

### Step 3.1: Upload .htaccess (1 minute)

**From:** `c:\Users\DELL\OneDrive\Desktop\survey_tracking\.htaccess`  
**To:** `/domains/theinfinityresearch.com/public_html/.htaccess`

1. In File Manager, click "Upload"
2. Select `.htaccess` from project root
3. Upload to `public_html/` directly

**Note:** Enable "Show Hidden Files" to see it after upload

✅ **Verify:** .htaccess uploaded to public_html root

---

### Step 3.2: Upload Frontend Static Files (8 minutes)

**From:** `c:\Users\DELL\OneDrive\Desktop\survey_tracking\frontend\out\*`  
**To:** `/domains/theinfinityresearch.com/public_html/` (root, NOT in a subfolder!)

**⚠️ CRITICAL:** Upload the **CONTENTS** of the `out/` folder, not the folder itself!

**Method 1: File Manager (easier)**
1. Navigate to `public_html/`
2. Click "Upload"
3. Open `frontend/out/` on your computer
4. Select ALL files inside `out/` (Ctrl+A)
5. Drag and drop OR click "Select Files"
6. Wait for upload to complete (136 files)

**Method 2: FTP (faster for large uploads)**
1. Use FileZilla or similar FTP client
2. Connect to Hostinger FTP
3. Navigate to `public_html/`
4. Upload all contents from `frontend/out/`

**Expected Result:**
```
public_html/
├── index.html           ← Must be directly in public_html
├── _next/               ← Must be directly in public_html
├── about.html
├── contact.html
├── dashboard.html
├── login.html
├── register.html
... etc
```

**WRONG Structure (don't do this):**
```
public_html/
└── out/              ← ❌ Don't create this folder
    └── index.html
```

✅ **Verify:** `index.html` is in `public_html/index.html` (not in a subfolder)

---

### Step 3.3: Upload PHP Backend (5 minutes)

**From:** `c:\Users\DELL\OneDrive\Desktop\survey_tracking\php\`  
**To:** `/domains/theinfinityresearch.com/public_html/php/`

1. In File Manager, navigate to `public_html/`
2. Click "Upload"
3. **Select the entire `php` folder** from your project
4. Upload it (this will create `public_html/php/` automatically)
5. Wait for all PHP files to upload

**Expected Result:**
```
public_html/
├── php/
│   ├── api/
│   ├── config/
│   │   ├── config.php
│   │   └── database.php
│   ├── includes/
│   ├── logs/
│   ├── index.php
│   ├── database_mysql.sql
│   └── ... (all other PHP files)
```

✅ **Verify:** 
- `public_html/php/config/config.php` exists
- `public_html/php/api/` folder exists
- All PHP files uploaded successfully

---

## 🔧 PHASE 4: SET PERMISSIONS (3 minutes)

1. **In File Manager:**
   - Navigate to `public_html/`

2. **Set Folder Permissions:**
   - Right-click on each folder → "Permissions"
   - Set to: `755`
   - Apply to:
     - `php/`
     - `php/api/`
     - `php/config/`
     - `php/includes/`
     - `php/logs/` (if exists)
     - `_next/`

3. **Set File Permissions:**
   - Select all `.html` files → Right-click → "Permissions" → `644`
   - Select all `.php` files in php/ → "Permissions" → `644`
   - `.htaccess` → "Permissions" → `644`

✅ **Verify:** Permissions set (not critical but good practice)

---

## 🗄️ PHASE 5: DATABASE SETUP (5 minutes)

### Step 5.1: Verify Database Exists

1. **Go to cPanel:**
   - From Hostinger panel, click "cPanel"
   - Or directly access Hostinger MySQL Databases

2. **Check Database:**
   - Look for database: `u832093887_surveytracking`
   - Check if user `u832093887_surveytracking` has access

### Step 5.2: Import Database (if needed)

**If database is empty or doesn't exist:**

1. **Access phpMyAdmin:**
   - cPanel → phpMyAdmin
   
2. **Select Database:**
   - Click on `u832093887_surveytracking`
   
3. **Import Schema:**
   - Click "Import" tab
   - Choose file: `php/database_mysql.sql` from your project
   - Click "Go"
   - Wait for import to complete

✅ **Verify:** Database tables created (users, tracking, etc.)

---

## ✅ PHASE 6: TESTING (10 minutes)

### Test 1: Homepage Loading
```
Visit: https://theinfinityresearch.com
Expected: Homepage loads with proper styling
```
- [ ] Homepage loads
- [ ] No 404 error
- [ ] Styling works
- [ ] Images load

### Test 2: Static Pages
```
Visit each page and verify it loads:
```
- [ ] https://theinfinityresearch.com/about
- [ ] https://theinfinityresearch.com/contact
- [ ] https://theinfinityresearch.com/login
- [ ] https://theinfinityresearch.com/register

### Test 3: API Connection
```
Open browser console (F12) on login page
Check for:
```
- [ ] No CORS errors
- [ ] API URL shows: https://theinfinityresearch.com/php/api/...
- [ ] No 404 on API calls

### Test 4: Database Connection
```
Try to register a new user:
```
- [ ] Go to /register
- [ ] Fill in test details
- [ ] Submit form
- [ ] User created successfully OR see specific error

### Test 5: Email Functionality (optional)
```
Test contact form:
```
- [ ] Go to /contact
- [ ] Fill in details
- [ ] Submit
- [ ] Check if email received OR check PHP error logs

### Test 6: Login System
```
Try logging in with test user:
```
- [ ] Go to /login
- [ ] Enter credentials
- [ ] Login successful
- [ ] Redirects to dashboard

---

## 🆘 TROUBLESHOOTING

### Issue: Homepage shows 404
**Fix:**
- Check `index.html` exists in `public_html/` root
- Check `.htaccess` uploaded correctly
- Enable Apache mod_rewrite in Hostinger

### Issue: API calls fail (CORS errors)
**Fix:**
- Verify `php/` folder uploaded completely
- Check `php/config/config.php` has correct FRONTEND_URL
- Check allowed origins in config.php

### Issue: Database connection errors
**Fix:**
- Verify database exists: `u832093887_surveytracking`
- Check credentials in `php/config/database.php`
- Import `php/database_mysql.sql` if tables missing

### Issue: Email not sending
**Fix:**
- Check `SMTP_PASSWORD` updated in `php/config/config.php`
- Verify Gmail App Password is correct
- Check PHP error logs in cPanel for details
- System will fallback to PHP mail() if SMTP fails

### Issue: Pages load but no styling
**Fix:**
- Check `_next/` folder uploaded to root
- Check browser console for 404 on CSS/JS files
- Verify all files from `out/` uploaded

---

## 📊 DEPLOYMENT TIMELINE

| Phase | Time | Status |
|-------|------|--------|
| Config Update | 5 min | ⏸️ Pending |
| Backup Hostinger | 3 min | ⏸️ Pending |
| Delete Old Files | 3 min | ⏸️ Pending |
| Upload .htaccess | 1 min | ⏸️ Pending |
| Upload Frontend | 8 min | ⏸️ Pending |
| Upload PHP | 5 min | ⏸️ Pending |
| Set Permissions | 3 min | ⏸️ Pending |
| Database Setup | 5 min | ⏸️ Pending |
| Testing | 10 min | ⏸️ Pending |
| **TOTAL** | **~45 min** | |

---

## ✅ FINAL CHECKLIST

**Before Starting:**
- [ ] `php/config/config.php` updated with SMTP password
- [ ] `php/config/config.php` updated with SESSION_SECRET
- [ ] Hostinger login credentials ready
- [ ] FTP client ready (if using FTP)
- [ ] `frontend/out/` folder contains 136 files

**During Deployment:**
- [ ] Backup created and downloaded
- [ ] Old files deleted from Hostinger
- [ ] .htaccess uploaded
- [ ] Frontend files uploaded to root
- [ ] PHP folder uploaded
- [ ] Permissions set
- [ ] Database verified/imported

**After Deployment:**
- [ ] Homepage loads successfully
- [ ] All pages accessible
- [ ] API calls working
- [ ] User registration works
- [ ] Login system works
- [ ] No errors in browser console

---

## 🎯 START DEPLOYMENT

**Ready to begin?**

1. ✅ Update `php/config/config.php` NOW
2. 📖 Follow each phase step-by-step
3. ✅ Check off each item as completed
4. 🧪 Test thoroughly after deployment

**Estimated Time:** 45 minutes

**Good luck! 🚀**
