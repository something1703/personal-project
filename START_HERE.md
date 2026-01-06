# 🚀 QUICK START - Deploy to Hostinger

## ⚡ 3-Step Deployment

### STEP 1: Update Config (5 min) ⚠️
```bash
# Open this file:
php/config/config.php

# Update line 34-35 (Email):
define('SMTP_USERNAME', 'infinityresearch904@gmail.com');
define('SMTP_PASSWORD', 'your-16-char-app-password');

# Update line 42 (Session Secret):
define('SESSION_SECRET', 'generate-64-random-chars');
```
**Get Gmail App Password:** Google Account → Security → 2-Step Verification → App passwords

---

### STEP 2: Upload Files (15 min) 📤

**Login to Hostinger:**
- Go to: Hostinger cPanel → File Manager
- Navigate to: `/domains/theinfinityresearch.com/public_html/`

**Upload these:**
```
✅ .htaccess                    → public_html/.htaccess
✅ frontend/out/*              → public_html/* (all files, not in subfolder!)
✅ php/                        → public_html/php/ (entire folder)
```

**Important:** 
- Upload ALL contents of `frontend/out/` to root of `public_html/`
- Don't create an "out" folder - put files directly in public_html
- Upload the entire `php/` folder as-is

---

### STEP 3: Test (5 min) ✅

Visit and test these:
```
✅ https://theinfinityresearch.com           → Homepage loads
✅ https://theinfinityresearch.com/login     → Login page
✅ https://theinfinityresearch.com/register  → Register page
✅ https://theinfinityresearch.com/contact   → Contact form
```

---

## 📋 Pre-Upload Checklist

- [ ] Updated `SMTP_USERNAME` in config.php
- [ ] Updated `SMTP_PASSWORD` in config.php  
- [ ] Updated `SESSION_SECRET` in config.php
- [ ] Database `u832093887_surveytracking` exists on Hostinger
- [ ] Have FTP/File Manager access to Hostinger

---

## 🆘 Quick Troubleshooting

**Site shows 404?**
→ Check `.htaccess` uploaded and `index.html` in root

**API errors?**
→ Verify `php/` folder uploaded correctly

**Database errors?**
→ Import `php/database_mysql.sql` in cPanel

**Email not working?**
→ Check SMTP credentials in `php/config/config.php`

---

## 📚 Full Guides

- **Complete Guide:** `DEPLOYMENT_READY.md`
- **Config Help:** `REQUIRED_CONFIG_UPDATES.md`
- **Upload Details:** `EXACT_UPLOAD_STRUCTURE.md`

---

**Ready? Start with STEP 1! 🎯**
