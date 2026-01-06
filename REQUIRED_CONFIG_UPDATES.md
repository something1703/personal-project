# ⚠️ REQUIRED CONFIGURATION UPDATES

## 📝 Before You Upload - Update These Files

### 1. Update Email Configuration in `php/config/config.php`

**File:** `c:\Users\DELL\OneDrive\Desktop\survey_tracking\php\config\config.php`

**Lines to Update (34-35):**
```php
// CURRENT (Line 34-35):
define('SMTP_USERNAME', 'your-email@gmail.com'); 
define('SMTP_PASSWORD', 'your-app-password');

// CHANGE TO:
define('SMTP_USERNAME', 'infinityresearch904@gmail.com'); // Your actual Gmail
define('SMTP_PASSWORD', 'xxxx xxxx xxxx xxxx'); // Your Gmail App Password
```

**How to Get Gmail App Password:**
1. Go to your Google Account: https://myaccount.google.com/
2. Security → 2-Step Verification (must be enabled)
3. Scroll down to "App passwords"
4. Select app: "Mail"
5. Select device: "Other (Custom name)" → enter "Hostinger"
6. Click "Generate"
7. Copy the 16-character password (format: xxxx xxxx xxxx xxxx)
8. Paste it in config.php

---

### 2. Update Session Secret in `php/config/config.php`

**File:** `c:\Users\DELL\OneDrive\Desktop\survey_tracking\php\config\config.php`

**Line to Update (42):**
```php
// CURRENT (Line 42):
define('SESSION_SECRET', 'your-unique-secret-key-change-this-in-production');

// CHANGE TO (generate random string):
define('SESSION_SECRET', 'YOUR_GENERATED_64_CHAR_RANDOM_STRING_HERE');
```

**Generate Random Key:**

**Option 1 - Using Git Bash:**
```bash
openssl rand -base64 64 | tr -d '\n'
```

**Option 2 - Using PowerShell:**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

**Option 3 - Online Generator:**
Visit: https://generate-random.org/api-key-generator?count=1&length=64

Copy the generated string and paste it in config.php line 42.

---

## 🔧 Quick Update Script

**Run these commands to update automatically:**

```bash
cd c:\Users\DELL\OneDrive\Desktop\survey_tracking

# Generate session secret (Git Bash)
SESSION_KEY=$(openssl rand -base64 64 | tr -d '\n')
echo "Generated key: $SESSION_KEY"

# Or check current config
cat php/config/config.php | grep -A 2 "SMTP_USERNAME"
cat php/config/config.php | grep "SESSION_SECRET"
```

---

## ✅ Verification Checklist

After updating, verify:
- [ ] SMTP_USERNAME contains your actual Gmail address
- [ ] SMTP_PASSWORD contains 16-character App Password
- [ ] SESSION_SECRET is at least 64 random characters
- [ ] No placeholder text remains (no "your-email", "your-password", etc.)

---

## 📄 Example of Correctly Updated Lines

```php
// Line 34-35 (Email)
define('SMTP_USERNAME', 'infinityresearch904@gmail.com');
define('SMTP_PASSWORD', 'abcd efgh ijkl mnop'); // 16 chars from Google

// Line 42 (Session Secret)
define('SESSION_SECRET', 'aB3dEf1gHi2jKl4mNo5pQr6sT7uVw8xYz9ABC0DEF1GHI2JKL3MNO4PQR5STU6VWX');
```

---

## 🚨 SECURITY REMINDER

**DO NOT:**
- ❌ Use your regular Gmail password
- ❌ Commit config.php to Git
- ❌ Share these credentials publicly
- ❌ Use weak or short session secrets

**DO:**
- ✅ Use Gmail App Password (16 characters)
- ✅ Generate strong random session secret (64+ chars)
- ✅ Keep config.php in .gitignore
- ✅ Store credentials securely

---

## 🎯 After Updating

Once you've updated both values:
1. Save `php/config/config.php`
2. Upload to Hostinger at: `public_html/php/config/config.php`
3. Test email functionality via contact form
4. Test password reset feature

**Ready to upload after these 2 updates!** ✅
