<?php
/**
 * Email utility functions
 * Supports PHPMailer if available, falls back to PHP mail()
 */

require_once __DIR__ . '/../config/config.php';

// Check if PHPMailer is available via Composer autoload
$phpmailer_available = false;
if (file_exists(__DIR__ . '/../vendor/autoload.php')) {
    require_once __DIR__ . '/../vendor/autoload.php';
    $phpmailer_available = class_exists('PHPMailer\PHPMailer\PHPMailer');
}

/**
 * Send email using SMTP
 * 
 * @param string $to Recipient email address
 * @param string $subject Email subject
 * @param string $body Email body (HTML)
 * @param string $toName Recipient name (optional)
 * @param string $replyTo Reply-to email (optional)
 * @return array ['success' => bool, 'message' => string]
 */
function sendEmail($to, $subject, $body, $toName = '', $replyTo = '') {
    global $phpmailer_available;
    
    if ($phpmailer_available) {
        return sendEmailWithPHPMailer($to, $subject, $body, $toName, $replyTo);
    } else {
        return sendEmailWithMail($to, $subject, $body, $toName, $replyTo);
    }
}

/**
 * Send email using PHPMailer
 */
function sendEmailWithPHPMailer($to, $subject, $body, $toName = '', $replyTo = '') {
    try {
        $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
        
        // Server settings
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USERNAME;
        $mail->Password = SMTP_PASSWORD;
        $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = SMTP_PORT;
        $mail->CharSet = 'UTF-8';
        
        // Enable verbose debug output (disable in production)
        // $mail->SMTPDebug = \PHPMailer\PHPMailer\SMTP::DEBUG_SERVER;
        
        // Recipients
        $mail->setFrom(SMTP_FROM_EMAIL, SMTP_FROM_NAME);
        $mail->addAddress($to, $toName);
        
        if (!empty($replyTo)) {
            $mail->addReplyTo($replyTo);
        }
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $body;
        $mail->AltBody = strip_tags($body);
        
        $mail->send();
        
        return [
            'success' => true,
            'message' => 'Email sent successfully'
        ];
        
    } catch (\Exception $e) {
        $errorInfo = isset($mail) ? $mail->ErrorInfo : $e->getMessage();
        error_log("Email sending failed: " . $errorInfo);
        return [
            'success' => false,
            'message' => 'Failed to send email: ' . $errorInfo
        ];
    }
}

/**
 * Fallback email function using native PHP SMTP (works without PHPMailer)
 */
function sendEmailWithMail($to, $subject, $body, $toName = '', $replyTo = '') {
    return sendEmailWithNativeSMTP($to, $subject, $body, $toName, $replyTo);
}

/**
 * Send email using native PHP SMTP socket connection
 */
function sendEmailWithNativeSMTP($to, $subject, $body, $toName = '', $replyTo = '') {
    try {
        // Create socket connection
        $socket = @fsockopen(SMTP_HOST, SMTP_PORT, $errno, $errstr, 30);
        
        if (!$socket) {
            throw new \Exception("Failed to connect to SMTP server: $errstr ($errno)");
        }
        
        // Read server greeting
        $response = fgets($socket, 515);
        if (substr($response, 0, 3) != '220') {
            throw new \Exception("SMTP server error: $response");
        }
        
        // Send EHLO
        fputs($socket, "EHLO " . SMTP_HOST . "\r\n");
        $response = '';
        while ($line = fgets($socket, 515)) {
            $response .= $line;
            if (substr($line, 3, 1) == ' ') break;
        }
        
        // Start TLS
        fputs($socket, "STARTTLS\r\n");
        $response = fgets($socket, 515);
        if (substr($response, 0, 3) != '220') {
            throw new \Exception("STARTTLS failed: $response");
        }
        
        // Enable crypto
        if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            throw new \Exception("Failed to enable TLS");
        }
        
        // Send EHLO again after TLS
        fputs($socket, "EHLO " . SMTP_HOST . "\r\n");
        $response = '';
        while ($line = fgets($socket, 515)) {
            $response .= $line;
            if (substr($line, 3, 1) == ' ') break;
        }
        
        // Authenticate
        fputs($socket, "AUTH LOGIN\r\n");
        $response = fgets($socket, 515);
        if (substr($response, 0, 3) != '334') {
            throw new \Exception("AUTH LOGIN failed: $response");
        }
        
        fputs($socket, base64_encode(SMTP_USERNAME) . "\r\n");
        $response = fgets($socket, 515);
        if (substr($response, 0, 3) != '334') {
            throw new \Exception("Username authentication failed: $response");
        }
        
        fputs($socket, base64_encode(SMTP_PASSWORD) . "\r\n");
        $response = fgets($socket, 515);
        if (substr($response, 0, 3) != '235') {
            throw new \Exception("Password authentication failed: $response");
        }
        
        // Set sender
        fputs($socket, "MAIL FROM: <" . SMTP_FROM_EMAIL . ">\r\n");
        $response = fgets($socket, 515);
        if (substr($response, 0, 3) != '250') {
            throw new \Exception("MAIL FROM failed: $response");
        }
        
        // Set recipient
        fputs($socket, "RCPT TO: <" . $to . ">\r\n");
        $response = fgets($socket, 515);
        if (substr($response, 0, 3) != '250') {
            throw new \Exception("RCPT TO failed: $response");
        }
        
        // Send data
        fputs($socket, "DATA\r\n");
        $response = fgets($socket, 515);
        if (substr($response, 0, 3) != '354') {
            throw new \Exception("DATA command failed: $response");
        }
        
        // Build email headers
        $headers = "From: " . SMTP_FROM_NAME . " <" . SMTP_FROM_EMAIL . ">\r\n";
        $headers .= "To: " . ($toName ? "$toName <$to>" : $to) . "\r\n";
        if (!empty($replyTo)) {
            $headers .= "Reply-To: $replyTo\r\n";
        }
        $headers .= "Subject: $subject\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
        
        // Send email content
        fputs($socket, $headers . "\r\n" . $body . "\r\n.\r\n");
        $response = fgets($socket, 515);
        if (substr($response, 0, 3) != '250') {
            throw new \Exception("Email sending failed: $response");
        }
        
        // Quit
        fputs($socket, "QUIT\r\n");
        fgets($socket, 515);
        fclose($socket);
        
        return [
            'success' => true,
            'message' => 'Email sent successfully'
        ];
        
    } catch (\Exception $e) {
        if (isset($socket) && is_resource($socket)) {
            fclose($socket);
        }
        error_log("Native SMTP error: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to send email: ' . $e->getMessage()
        ];
    }
}

/**
 * Send contact form notification email
 */
function sendContactFormEmail($name, $email, $subject, $message) {
    $companyEmail = defined('COMPANY_EMAIL') ? COMPANY_EMAIL : SMTP_FROM_EMAIL;
    
    $emailSubject = "New Contact Form Submission: " . $subject;
    
    $emailBody = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #555; }
            .value { margin-top: 5px; padding: 10px; background-color: white; border-left: 3px solid #4CAF50; }
            .footer { margin-top: 20px; padding: 10px; text-align: center; color: #777; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>New Contact Form Submission</h2>
            </div>
            <div class='content'>
                <div class='field'>
                    <div class='label'>Name:</div>
                    <div class='value'>" . htmlspecialchars($name) . "</div>
                </div>
                <div class='field'>
                    <div class='label'>Email:</div>
                    <div class='value'>" . htmlspecialchars($email) . "</div>
                </div>
                <div class='field'>
                    <div class='label'>Subject:</div>
                    <div class='value'>" . htmlspecialchars($subject) . "</div>
                </div>
                <div class='field'>
                    <div class='label'>Message:</div>
                    <div class='value'>" . nl2br(htmlspecialchars($message)) . "</div>
                </div>
            </div>
            <div class='footer'>
                <p>This email was sent from the contact form on your website.</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    return sendEmail($companyEmail, $emailSubject, $emailBody, 'Infinity Research', $email);
}
?>

