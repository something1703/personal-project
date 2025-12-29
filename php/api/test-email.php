<?php
/**
 * Email Test API Endpoint
 * 
 * Access: http://localhost/survey_tracking/php/api/test-email.php
 * 
 * WARNING: Remove or protect this file in production!
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/email.php';
require_once __DIR__ . '/../includes/cors.php';

setCorsHeaders();

header('Content-Type: text/html; charset=UTF-8');

// Simple test
$testEmail = COMPANY_EMAIL;
$testSubject = "Test Email from Survey Tracking System";
$testBody = "
<html>
<body>
    <h2>Email Test</h2>
    <p>This is a test email to verify the email system is working correctly.</p>
    <p>Time: " . date('Y-m-d H:i:s') . "</p>
    <p>SMTP Host: " . SMTP_HOST . "</p>
    <p>SMTP Port: " . SMTP_PORT . "</p>
    <p>SMTP Username: " . SMTP_USERNAME . "</p>
</body>
</html>
";

echo "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Email Test</title>";
echo "<style>body{font-family:Arial,sans-serif;max-width:800px;margin:50px auto;padding:20px;}";
echo ".success{color:green;padding:15px;background:#d4edda;border:1px solid #c3e6cb;border-radius:4px;margin:20px 0;}";
echo ".error{color:red;padding:15px;background:#f8d7da;border:1px solid #f5c6cb;border-radius:4px;margin:20px 0;}";
echo "h1{color:#333;}hr{margin:20px 0;}</style></head><body>";

echo "<h1>Email Test Script</h1>";
echo "<p>Testing email to: <strong>$testEmail</strong></p>";
echo "<hr>";

// Check if PHPMailer is available
global $phpmailer_available;
echo "<p><strong>PHPMailer Available:</strong> " . ($phpmailer_available ? "Yes" : "No (using native SMTP)") . "</p>";

// Test email sending
echo "<p>Sending test email...</p>";
$result = sendEmail($testEmail, $testSubject, $testBody, 'Test Recipient');

if ($result['success']) {
    echo "<div class='success'>";
    echo "<strong>✓ SUCCESS:</strong> " . htmlspecialchars($result['message']);
    echo "</div>";
    echo "<p>Check your inbox at <strong>$testEmail</strong></p>";
    echo "<p>Also check your <strong>spam/junk folder</strong> if you don't see it.</p>";
} else {
    echo "<div class='error'>";
    echo "<strong>✗ FAILED:</strong> " . htmlspecialchars($result['message']);
    echo "</div>";
    echo "<h3>Troubleshooting:</h3>";
    echo "<ul>";
    echo "<li>Check SMTP credentials in <code>config/config.php</code></li>";
    echo "<li>Verify Gmail App Password is correct (line 38 in config.php)</li>";
    echo "<li>Check PHP error logs: <code>" . ini_get('error_log') . "</code></li>";
    echo "<li>Ensure OpenSSL extension is enabled in PHP</li>";
    echo "<li>Check firewall/antivirus isn't blocking SMTP connections (port 587)</li>";
    echo "<li>Verify 2-Step Verification is enabled on Gmail account</li>";
    echo "<li>Make sure you're using an App Password, not your regular Gmail password</li>";
    echo "</ul>";
}

echo "<hr>";
echo "<p><small>Test completed at: " . date('Y-m-d H:i:s') . "</small></p>";
echo "<p><a href='javascript:location.reload()'>Run Test Again</a></p>";
echo "</body></html>";
?>

