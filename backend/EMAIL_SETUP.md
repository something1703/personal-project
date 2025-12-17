# Email Setup Guide for Contact Form

Your contact form now sends emails! Follow these steps to configure it:

## Option 1: Gmail (Recommended)

1. **Enable 2-Step Verification** on your Gmail account:
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Create an App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Insights Elite Contact Form"
   - Copy the 16-character password

3. **Update `.env` file**:
   ```
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   ```

## Option 2: Other Email Providers

### Outlook/Hotmail
```javascript
service: 'outlook'
```

### Yahoo Mail
```javascript
service: 'yahoo'
```

### Custom SMTP
```javascript
host: 'smtp.yourprovider.com',
port: 587,
secure: false,
auth: {
    user: 'your-email@example.com',
    pass: 'your-password'
}
```

## What Happens When Someone Submits the Form?

1. ✅ Form data is saved to the database
2. ✅ Email notification is sent to **contact@insightselite.com**
3. ✅ Auto-reply is sent to the user confirming receipt

## Testing

1. Update your `.env` file with real credentials
2. Restart your backend server
3. Submit the contact form at http://localhost:3000/contact
4. Check both your inbox and the user's email

## Important Notes

- ⚠️ Never commit your `.env` file to GitHub
- ⚠️ Use App Passwords for Gmail (not your account password)
- ⚠️ Change `contact@insightselite.com` in `routes/contact.js` if needed
- ⚠️ For production, use a professional email service like SendGrid, AWS SES, or Mailgun

## Troubleshooting

If emails aren't sending:
- Check your email credentials in `.env`
- Make sure 2-Step Verification is enabled (Gmail)
- Check console logs for error messages
- Verify your email provider allows SMTP access
