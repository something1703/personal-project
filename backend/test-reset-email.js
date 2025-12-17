require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

async function testPasswordResetEmail() {
    const testEmail = process.env.EMAIL_USER; // Send to yourself
    const resetUrl = 'http://localhost:3000/reset-password/test-token-12345';
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: testEmail,
        subject: 'TEST: Password Reset Request - Insights Elite',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #007bff;">Password Reset Request (TEST)</h2>
                <p>Hello User,</p>
                <p>This is a TEST email to verify password reset functionality.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Reset Password</a>
                </div>
                <p>Or copy and paste this URL into your browser:</p>
                <p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
                <p><strong style="color: #dc3545;">⏰ This link will expire in 1 hour.</strong></p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="color: #666; font-size: 12px;">Insights Elite - Survey Tracking System</p>
            </div>
        `
    };

    console.log('\n🧪 Testing Password Reset Email...\n');
    console.log('From:', process.env.EMAIL_USER);
    console.log('To:', testEmail);
    console.log('Subject:', mailOptions.subject);
    
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('\n✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('\n📧 Check your inbox:', testEmail);
        console.log('(Check spam folder if not in inbox)\n');
    } catch (error) {
        console.error('\n❌ Failed to send test email:');
        console.error('Error:', error.message);
        console.error('\n💡 Troubleshooting:');
        console.error('1. Check if EMAIL_USER is correct:', process.env.EMAIL_USER);
        console.error('2. Check if EMAIL_PASSWORD (App Password) is correct');
        console.error('3. Verify 2-Step Verification is enabled in Gmail');
        console.error('4. Check if "Less secure app access" is enabled (if not using App Password)\n');
    }
    
    process.exit(0);
}

testPasswordResetEmail();
