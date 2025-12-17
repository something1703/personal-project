require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

console.log('\n🔍 Checking Nodemailer Setup...\n');
console.log('Email User:', process.env.EMAIL_USER);
console.log('Password Set:', process.env.EMAIL_PASSWORD ? '✅ Yes' : '❌ No');

transporter.verify((error, success) => {
    if (error) {
        console.log('\n❌ Nodemailer Error:', error.message);
        console.log('\n💡 Troubleshooting:');
        console.log('1. Check if EMAIL_USER and EMAIL_PASSWORD are set in .env');
        console.log('2. Verify Gmail App Password is correct');
        console.log('3. Enable 2-Step Verification in Gmail');
    } else {
        console.log('\n✅ Nodemailer Setup Complete!');
        console.log('✅ Connection to Gmail verified');
        console.log('✅ Ready to send emails\n');
        
        console.log('📧 Features configured:');
        console.log('  - Contact form emails');
        console.log('  - Password reset emails');
        console.log('  - Auto-reply to customers\n');
    }
    process.exit(0);
});
