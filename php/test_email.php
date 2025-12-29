<?php
/**
 * Email Test Script
 * Use this to test email functionality independently
 * 
 * Access: http://localhost/survey_tracking/php/test_email.php
 * 
 * WARNING: Remove or protect this file in production!
 */

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/includes/email.php';

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

echo "<h1>Email Test Script</h1>";
echo "<p>Testing email to: <strong>$testEmail</strong></p>";
echo "<hr>";

// Check if PHPMailer is available
global $phpmailer_available;
echo "<p>PHPMailer Available: " . ($phpmailer_available ? "Yes" : "No (using native SMTP)") . "</p>";

// Test email sending
echo "<p>Sending test email...</p>";
$result = sendEmail($testEmail, $testSubject, $testBody, 'Test Recipient');

if ($result['success']) {
    echo "<div style='color: green; padding: 10px; background: #d4edda; border: 1px solid #c3e6cb; border-radius: 4px;'>";
    echo "<strong>✓ SUCCESS:</strong> " . $result['message'];
    echo "</div>";
    echo "<p>Check your inbox at <strong>$testEmail</strong></p>";
} else {
    echo "<div style='color: red; padding: 10px; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px;'>";
    echo "<strong>✗ FAILED:</strong> " . $result['message'];
    echo "</div>";
    echo "<h3>Troubleshooting:</h3>";
    echo "<ul>";
    echo "<li>Check SMTP credentials in config.php</li>";
    echo "<li>Verify Gmail App Password is correct</li>";
    echo "<li>Check PHP error logs: " . ini_get('error_log') . "</li>";
    echo "<li>Ensure OpenSSL extension is enabled</li>";
    echo "<li>Check firewall/antivirus isn't blocking SMTP connections</li>";
    echo "</ul>";
}

echo "<hr>";
echo "<p><small>Test completed at: " . date('Y-m-d H:i:s') . "</small></p>";
?>

