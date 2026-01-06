# 📂 EXACT HOSTINGER UPLOAD STRUCTURE

## 🎯 Final Structure on Hostinger

After uploading, your `public_html/` folder should look like this:

```
public_html/
├── .htaccess                          ← Root htaccess (you'll create this)
├── index.html                         ← Frontend homepage
├── about.html                         ← Frontend about page
├── contact.html                       ← Frontend contact page
├── login.html                         ← Frontend login page
├── register.html                      ← Frontend register page
├── forgot-password.html               ← Frontend forgot password
├── reset-password.html                ← Frontend reset password
├── services.html                      ← Frontend services page
├── 404.html                           ← Frontend 404 page
├── _not-found.html                    ← Frontend not found
├── favicon.ico                        ← Frontend favicon
├── *.svg, *.png, *.jpg                ← Frontend images/icons
│
├── _next/                             ← Next.js compiled assets
│   └── static/
│       ├── css/
│       ├── chunks/
│       └── media/
│
├── _not-found/                        ← Frontend folder
├── about/                             ← Frontend folder
├── admin/                             ← Frontend folder
│   └── dashboard/
├── contact/                           ← Frontend folder
├── forgot-password/                   ← Frontend folder
├── login/                             ← Frontend folder
├── register/                          ← Frontend folder
├── reset-password/                    ← Frontend folder
├── services/                          ← Frontend folder
│
└── api/                               ← Backend PHP directory
    ├── .htaccess                      ← API htaccess (already exists in php/)
    ├── index.php                      ← API entry point
    ├── options.php                    ← CORS handler
    ├── test_email.php                 ← Email testing
    │
    ├── api/                           ← API endpoints folder
    │   ├── admin.php                  ← Admin endpoints
    │   ├── auth.php                   ← Authentication
    │   ├── contact.php                ← Contact form
    │   ├── dashboard.php              ← User dashboard
    │   ├── password-reset.php         ← Password reset
    │   ├── test-email.php             ← Email test
    │   └── track.php                  ← Survey tracking
    │
    ├── config/                        ← Configuration files
    │   ├── config.php                 ← Main config (✅ ready)
    │   └── database.php               ← Database config (✅ ready)
    │
    ├── includes/                      ← Include files
    │   └── (any helper files)
    │
    ├── logs/                          ← Log files directory
    │   └── php_errors.log             ← (will be created automatically)
    │
    ├── database_mysql.sql             ← Database schema (for reference)
    ├── EMAIL_SETUP.md                 ← Documentation (optional)
    └── README.md                      ← Documentation (optional)
```

---

## 📋 WHAT TO UPLOAD FROM WHERE

### **Upload Set 1: Frontend (Static Files)**
**Source:** `C:\Users\DELL\OneDrive\Desktop\survey_tracking\frontend\out\`  
**Destination:** `public_html/`  
**Method:** Upload ALL contents (not the "out" folder itself, but everything INSIDE it)

**Files to upload (from frontend/out/):**
```
✅ index.html
✅ index.txt
✅ about.html, about.txt, about/
✅ contact.html, contact.txt, contact/
✅ login.html, login.txt, login/
✅ register.html, register.txt, register/
✅ forgot-password.html, forgot-password.txt, forgot-password/
✅ reset-password.html, reset-password.txt, reset-password/
✅ services.html, services.txt, services/
✅ 404.html
✅ _not-found.html, _not-found.txt, _not-found/
✅ admin/ (entire folder)
✅ _next/ (entire folder)
✅ favicon.ico
✅ *.svg files (file.svg, globe.svg, next.svg, vercel.svg, window.svg)
✅ *.png files (all country flags, etc.)
✅ *.jpg files (about1.jpg, bg.jpg)
✅ __next.* files (metadata files)
```

---

### **Upload Set 2: Backend (PHP Files)**
**Source:** `C:\Users\DELL\OneDrive\Desktop\survey_tracking\php\`  
**Destination:** `public_html/api/`  
**Method:** Upload ALL contents from php/ folder

**Files to upload (from php/):**
```
✅ .htaccess                    → public_html/api/.htaccess
✅ index.php                    → public_html/api/index.php
✅ options.php                  → public_html/api/options.php
✅ test_email.php               → public_html/api/test_email.php
✅ database_mysql.sql           → public_html/api/database_mysql.sql
✅ EMAIL_SETUP.md (optional)    → public_html/api/EMAIL_SETUP.md
✅ README.md (optional)         → public_html/api/README.md

✅ api/ (entire folder)         → public_html/api/api/
   ├── admin.php
   ├── auth.php
   ├── contact.php
   ├── dashboard.php
   ├── password-reset.php
   ├── test-email.php
   └── track.php

✅ config/ (entire folder)      → public_html/api/config/
   ├── config.php
   └── database.php

✅ includes/ (entire folder)    → public_html/api/includes/
   └── (any files inside)

✅ logs/ (empty folder)         → public_html/api/logs/
   └── (will be auto-created if doesn't exist)
```

---

### **Upload Set 3: Root .htaccess**
**Source:** Create this file (see below)  
**Destination:** `public_html/.htaccess`  
**Method:** Create new file in Hostinger File Manager

---

## 📝 ROOT .HTACCESS FILE

Create this file in `public_html/.htaccess`:

```apache
# Enable Rewrite Engine
RewriteEngine On
RewriteBase /

# ============================================
# SECURITY HEADERS
# ============================================
<IfModule mod_headers.c>
    # Prevent clickjacking
    Header always set X-Frame-Options "DENY"
    
    # XSS Protection
    Header always set X-XSS-Protection "1; mode=block"
    
    # Prevent MIME sniffing
    Header always set X-Content-Type-Options "nosniff"
    
    # Referrer Policy
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # HSTS - Force HTTPS (uncomment after testing)
    # Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>

# ============================================
# FORCE HTTPS
# ============================================
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# ============================================
# API ROUTING
# ============================================
# Route all /api/* requests to the api directory
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ api/$1 [L,QSA]

# ============================================
# STATIC FRONTEND ROUTING
# ============================================
# Serve static files directly (HTML, CSS, JS, images)
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# Fallback to index.html for client-side routing
RewriteRule ^(.*)$ index.html [L]

# ============================================
# DIRECTORY PROTECTION
# ============================================
# Disable directory browsing
Options -Indexes

# Protect sensitive files
<FilesMatch "\.(env|log|sql|md|txt)$">
    Order allow,deny
    Deny from all
</FilesMatch>

# ============================================
# BROWSER CACHING
# ============================================
<IfModule mod_expires.c>
    ExpiresActive On
    
    # Images
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/x-icon "access plus 1 year"
    
    # CSS and JavaScript
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType text/javascript "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    
    # HTML
    ExpiresByType text/html "access plus 0 seconds"
</IfModule>

# ============================================
# GZIP COMPRESSION
# ============================================
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE text/javascript
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/json
    AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>
```

---

## 🚀 STEP-BY-STEP UPLOAD PROCESS

### **METHOD 1: Hostinger File Manager (Recommended for Beginners)**

#### **Step 1: Access File Manager**
1. Log in to Hostinger hPanel
2. Click **File Manager**
3. Navigate to `public_html/`

---

#### **Step 2: Clean public_html/**
1. Select all default files (index.html, coming-soon files, etc.)
2. Click **Delete**
3. Confirm deletion
4. Now `public_html/` should be empty

---

#### **Step 3: Upload Frontend Files**
1. Make sure you're in `public_html/`
2. Click **Upload** button (top right)
3. Navigate to: `C:\Users\DELL\OneDrive\Desktop\survey_tracking\frontend\out\`
4. **Select ALL files and folders** inside `out/`:
   - Hold `Ctrl+A` to select all
   - Or manually select all ~60 files/folders
5. Click **Open** to start upload
6. Wait for upload to complete (may take 2-5 minutes)

**Result:** You should see `index.html`, `_next/`, folders, etc. directly in `public_html/`

---

#### **Step 4: Create API Directory**
1. In `public_html/`, click **+ New Folder**
2. Name it: `api`
3. Press Enter

---

#### **Step 5: Upload Backend Files**
1. Navigate into `public_html/api/` (click on the api folder)
2. Click **Upload** button
3. Navigate to: `C:\Users\DELL\OneDrive\Desktop\survey_tracking\php\`
4. **Select ALL files and folders** inside `php/`:
   - Hold `Ctrl+A` to select all
   - Including: `.htaccess`, `index.php`, `api/`, `config/`, `includes/`, `logs/`, etc.
5. Click **Open** to start upload
6. Wait for upload to complete

**Result:** You should see `.htaccess`, `api/`, `config/`, etc. inside `public_html/api/`

---

#### **Step 6: Create Root .htaccess**
1. Go back to `public_html/` (click the breadcrumb)
2. Click **+ New File**
3. Name it: `.htaccess` (include the dot!)
4. Press Enter
5. Right-click the file → **Edit**
6. Copy and paste the Root .htaccess content (from above)
7. Click **Save**

---

#### **Step 7: Set Permissions for Logs**
1. Navigate to `public_html/api/logs/`
2. Right-click the `logs` folder → **Permissions**
3. Set to: `755` (or check: read/write/execute for owner, read/execute for group/others)
4. Click **Save**

---

#### **Step 8: Verify Upload**
Check that your structure matches the diagram at the top.

**Quick checklist:**
- [ ] `public_html/index.html` exists (frontend)
- [ ] `public_html/_next/` folder exists (frontend assets)
- [ ] `public_html/.htaccess` exists (root config)
- [ ] `public_html/api/.htaccess` exists (API config)
- [ ] `public_html/api/config/config.php` exists (backend config)
- [ ] `public_html/api/api/auth.php` exists (API endpoint)
- [ ] `public_html/api/logs/` folder exists (with 755 permissions)

---

### **METHOD 2: FileZilla FTP (Faster for Large Uploads)**

#### **Step 1: Get FTP Credentials**
1. Hostinger hPanel → **Files** → **FTP Accounts**
2. Copy:
   - **Host:** ftp.theinfinityresearch.com (or provided host)
   - **Username:** (provided)
   - **Password:** (provided)
   - **Port:** 21

---

#### **Step 2: Connect FileZilla**
1. Download FileZilla from https://filezilla-project.org/
2. Open FileZilla
3. Enter credentials at the top:
   - Host: `ftp.theinfinityresearch.com`
   - Username: `your-ftp-username`
   - Password: `your-ftp-password`
   - Port: `21`
4. Click **Quickconnect**

---

#### **Step 3: Navigate to public_html/**
1. In the **Remote site** panel (right side)
2. Navigate to `/public_html/`
3. Delete default files

---

#### **Step 4: Upload Frontend**
1. In **Local site** panel (left side):
   - Navigate to: `C:\Users\DELL\OneDrive\Desktop\survey_tracking\frontend\out\`
2. **Select all files/folders** inside `out/`
3. **Drag and drop** to `public_html/` on the right panel
4. Wait for transfer

---

#### **Step 5: Create api/ and Upload Backend**
1. In **Remote site** (right panel):
   - Right-click `public_html/` → Create directory → `api`
2. In **Local site** (left panel):
   - Navigate to: `C:\Users\DELL\OneDrive\Desktop\survey_tracking\php\`
3. **Select all files/folders** inside `php/`
4. **Drag and drop** to `public_html/api/` on the right panel
5. Wait for transfer

---

#### **Step 6: Create Root .htaccess**
1. Create `.htaccess` locally with the content above
2. Upload to `public_html/.htaccess`

---

## 📊 UPLOAD SIZE ESTIMATE

**Frontend:** ~10-15 MB (static files)  
**Backend:** <1 MB (PHP files)  
**Total:** ~15-20 MB

**Upload time:**
- File Manager: 3-8 minutes
- FileZilla: 1-3 minutes

---

## ✅ POST-UPLOAD VERIFICATION

### **Test 1: Frontend Homepage**
Open: `https://theinfinityresearch.com`  
**Expected:** Homepage loads with proper styling

### **Test 2: API Entry Point**
Open: `https://theinfinityresearch.com/api/`  
**Expected:** Welcome message or JSON response

### **Test 3: Check File Structure**
Use File Manager to verify all files uploaded correctly

### **Test 4: Check PHP Logs**
Navigate to: `public_html/api/logs/`  
**Expected:** Folder exists with 755 permissions (log file will be created on first error)

---

## ⚠️ COMMON ISSUES

### Issue: "index.html not found"
**Solution:** Make sure you uploaded contents of `out/` folder, not the folder itself

### Issue: "API 404 errors"
**Solution:** 
- Check `api/` folder exists and contains files
- Verify `.htaccess` in both `public_html/` and `public_html/api/`

### Issue: "Permission denied" for logs
**Solution:** Set `api/logs/` folder to 755 permissions

### Issue: "HTTPS not working"
**Solution:** 
- Go to Hostinger → SSL/TLS
- Enable free Let's Encrypt SSL
- Wait 5-10 minutes for activation

---

## 🎯 FINAL CHECKLIST

Before you start:
- [ ] Built frontend (`npm run build`) ✅
- [ ] Database credentials configured ✅
- [ ] Email credentials configured ✅
- [ ] Session secret generated ✅

During upload:
- [ ] Clean `public_html/` folder
- [ ] Upload frontend to `public_html/`
- [ ] Create `api/` folder
- [ ] Upload backend to `public_html/api/`
- [ ] Create root `.htaccess`
- [ ] Set logs folder permissions to 755

After upload:
- [ ] Import database (next step)
- [ ] Test homepage
- [ ] Test API
- [ ] Test registration/login
- [ ] Test email functions

---

## 📞 NEXT STEP: DATABASE IMPORT

After uploading files, you need to import the database.

**File to import:** `public_html/api/database_mysql.sql`  
**Method:** phpMyAdmin (separate guide available)

---

**You're ready to upload! Choose your method and follow the steps.** 🚀
