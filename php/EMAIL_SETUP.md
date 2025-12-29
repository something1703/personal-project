# Email Setup Guide

## Configuration

The email system has been configured to use `infinityresearch904@gmail.com` as the company email address.

## Gmail App Password Setup

To send emails through Gmail, you need to create an App Password:

1. **Enable 2-Step Verification** on your Google Account:
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification if not already enabled

2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Survey Tracking App" as the name
   - Click "Generate"
   - Copy the 16-character password (no spaces)

3. **Update Configuration**:
   - Open `php/config/config.php`
   - Replace `'your-app-password'` with your generated App Password:
   ```php
   define('SMTP_PASSWORD', 'your-16-character-app-password');
   ```

## XAMPP Configuration

Since you're using XAMPP, you typically **don't need to change anything** in the XAMPP folder because:

1. **We're using Gmail's SMTP server** - Emails are sent through Gmail, not through XAMPP's local mail server
2. **OpenSSL extension** - Usually enabled by default in XAMPP (needed for SMTP TLS)

### Optional: Verify PHP Extensions

To check if required extensions are enabled:

1. Create a test file `phpinfo.php` in your project:
   ```php
   <?php phpinfo(); ?>
   ```
2. Open it in browser: `http://localhost/survey_tracking/php/phpinfo.php`
3. Search for "openssl" - it should be enabled
4. **Delete the file after checking** (security)

### If OpenSSL is Disabled (Rare):

1. Open `C:\xampp\php\php.ini`
2. Find the line: `;extension=openssl`
3. Remove the semicolon: `extension=openssl`
4. Restart Apache in XAMPP Control Panel

## PHPMailer Installation (Recommended)

For reliable email delivery, install PHPMailer using Composer:

### Option 1: Install Composer (Recommended)

1. Download Composer: https://getcomposer.org/download/
2. Install it (or use portable version)
3. Open Command Prompt in your project folder:
   ```bash
   cd C:\Users\DELL\OneDrive\Desktop\survey_tracking\php
   composer require phpmailer/phpmailer
   ```

### Option 2: Manual PHPMailer Installation

1. Download PHPMailer: https://github.com/PHPMailer/PHPMailer/releases
2. Extract to `php/vendor/PHPMailer/PHPMailer/`
3. Update `php/includes/email.php` to use the manual path

### Option 3: Use PHP mail() Fallback

- The system will automatically use PHP's `mail()` function if PHPMailer is not available
- **Note**: `mail()` function may be less reliable and emails might go to spam
- **No XAMPP configuration needed** for this option

## Testing

After configuration, test the contact form:
1. Submit a test message through the contact form
2. Check `infinityresearch904@gmail.com` inbox
3. Check spam folder if email doesn't appear

## Troubleshooting

### Emails not sending:
1. Verify App Password is correct in `config.php`
2. Check PHP error logs: `php/logs/php_errors.log`
3. Ensure SMTP credentials are correct
4. Check if PHPMailer is installed (if using Composer)

### Using PHP mail() fallback:
- The system will automatically use PHP's `mail()` function if PHPMailer is not available
- Note: `mail()` function may be less reliable and emails might go to spam

## Security Notes

- Never commit App Passwords to version control
- Use environment variables in production
- Keep App Passwords secure and rotate them periodically

