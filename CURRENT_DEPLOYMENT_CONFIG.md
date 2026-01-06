# Current Deployment Configuration
**Updated:** 2026-01-06
**Environment:** Production - Hostinger Basic Plan
**Domain:** theinfinityresearch.com

---

## 🌐 URLs Configuration

### Frontend
- **Production URL:** `https://theinfinityresearch.com`
- **Environment Variable:** `NEXT_PUBLIC_API_URL=https://theinfinityresearch.com/php`
- **File Location:** `frontend/.env.local`

### Backend (PHP)
- **API Base URL:** `https://theinfinityresearch.com/php`
- **Configuration File:** `php/config/config.php`

---

## 🗄️ Database Configuration

### MySQL Database (Hostinger)
- **Host:** `localhost`
- **Database Name:** `u832093887_surveytracking`
- **Username:** `u832093887_surveytracking`
- **Password:** `Surveytracking@123`
- **Configuration File:** `php/config/database.php`

---

## ⚙️ Backend PHP Settings (`php/config/config.php`)

### URLs
```php
define('BASE_URL', 'https://theinfinityresearch.com/php');
define('FRONTEND_URL', 'https://theinfinityresearch.com');
```

### CORS Allowed Origins
```php
$allowed_origins = [
    'https://theinfinityresearch.com'
];
```

### Email Configuration (Gmail SMTP)
```php
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'your-email@gmail.com'); // ⚠️ UPDATE THIS
define('SMTP_PASSWORD', 'your-app-password');    // ⚠️ UPDATE THIS
define('SMTP_FROM_EMAIL', 'noreply@theinfinityresearch.com');
define('SMTP_FROM_NAME', 'The Infinity Research');
define('COMPANY_EMAIL', 'contact@theinfinityresearch.com');
```

### Security Settings
```php
define('SESSION_SECRET', 'your-unique-secret-key-change-this-in-production'); // ⚠️ UPDATE THIS
```

---

## 📁 File Structure on Hostinger

### Root Directory: `/domains/theinfinityresearch.com/public_html/`

```
public_html/
├── index.html              # Frontend entry point
├── _next/                  # Next.js static assets
├── php/                    # Backend PHP files
│   ├── api/               # API endpoints
│   ├── config/            # Configuration files
│   │   ├── config.php    # General config
│   │   └── database.php  # Database config
│   └── vendor/           # Composer dependencies
└── .htaccess             # Apache rewrite rules
```

---

## 🔧 Configuration Files Status

| File | Status | Location | Notes |
|------|--------|----------|-------|
| `config.php` | ✅ Created | `php/config/` | From config.php.example |
| `database.php` | ✅ Ready | `php/config/` | Hostinger MySQL configured |
| `.env.local` | ✅ Created | `frontend/` | Production API URL set |
| `.htaccess` | ✅ Ready | Root | Routing configured |

---

## 🚀 Deployment Checklist

### Before Uploading to Hostinger:

- [ ] **Update Email Settings** in `php/config/config.php`
  - Replace `SMTP_USERNAME` with your Gmail
  - Replace `SMTP_PASSWORD` with Gmail App Password
  
- [ ] **Update Session Secret** in `php/config/config.php`
  - Generate a strong 64+ character random string
  
- [ ] **Build Frontend**
  ```bash
  cd frontend
  npm run build
  ```

- [ ] **Verify Database**
  - Ensure database `u832093887_surveytracking` exists on Hostinger
  - Verify credentials in `php/config/database.php`
  
- [ ] **Upload Files** (See EXACT_UPLOAD_STRUCTURE.md)
  - Upload `out/` folder contents to `public_html/`
  - Upload `php/` folder to `public_html/php/`
  - Upload `.htaccess` to `public_html/`

---

## 🔐 Security Reminders

1. **Never commit** `config.php` and `.env.local` to Git (already in .gitignore)
2. **Use strong passwords** for database and session secrets
3. **Enable HTTPS** (Hostinger provides free SSL)
4. **Keep sensitive credentials** secure and separate

---

## 📝 Quick Reference Commands

### Local Development
```bash
# Start PHP server
php -S localhost:8000 -t php

# Start Next.js dev server
cd frontend
npm run dev
```

### Build for Production
```bash
cd frontend
npm run build
```

### Test Database Connection
```bash
php test-db.php
```

---

## 🔗 Related Documentation

- [EXACT_UPLOAD_STRUCTURE.md](./EXACT_UPLOAD_STRUCTURE.md) - Upload guide
- [HOSTINGER_DEPLOYMENT_GUIDE.md](./HOSTINGER_DEPLOYMENT_GUIDE.md) - Deployment steps
- [API_ENDPOINTS.md](./API_ENDPOINTS.md) - API documentation

---

## ⚠️ Action Items

### Required Before Deployment:
1. ✅ Database configuration - DONE
2. ✅ Frontend URL configuration - DONE
3. ⚠️ Email credentials - **NEEDS UPDATE**
4. ⚠️ Session secret - **NEEDS UPDATE**
5. ⏳ Build frontend - **PENDING**
6. ⏳ Upload to Hostinger - **PENDING**

---

**Status:** Configuration files created and ready for production deployment
**Next Step:** Update email credentials and session secret, then build and upload
