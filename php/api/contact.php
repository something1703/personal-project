<?php
require_once '../config/database.php';
require_once '../config/config.php';
require_once '../includes/cors.php';
require_once '../includes/session.php';
require_once '../includes/logger.php';
require_once '../includes/email.php';

setCorsHeaders();
startSession();

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

// Submit contact form
if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $name = $data['name'] ?? '';
    $email = $data['email'] ?? '';
    $subject = $data['subject'] ?? '';
    $message = $data['message'] ?? '';
    
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'All fields are required'
        ]);
        exit();
    }
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid email address'
        ]);
        exit();
    }
    
    try {
        // Save to database
        $query = "INSERT INTO contact_submissions (name, email, subject, message, created_at)
                  VALUES (:name, :email, :subject, :message, NOW())";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':subject', $subject);
        $stmt->bindParam(':message', $message);
        $stmt->execute();
        
        // Send email notification
        try {
            $emailResult = sendContactFormEmail($name, $email, $subject, $message);
        } catch (Exception $e) {
            $emailResult = [
                'success' => false,
                'message' => 'Exception: ' . $e->getMessage()
            ];
        }
        
        // Debug: Always log the email result
        logInfo('Contact form email attempt', [
            'email_result' => $emailResult,
            'company_email' => defined('COMPANY_EMAIL') ? COMPANY_EMAIL : SMTP_FROM_EMAIL,
            'name' => $name,
            'email' => $email
        ]);
        
        if (!$emailResult['success']) {
            // Log email failure with detailed error
            logError('Contact form email failed', [
                'error' => $emailResult['message'],
                'name' => $name,
                'email' => $email,
                'smtp_host' => SMTP_HOST,
                'smtp_port' => SMTP_PORT,
                'smtp_username' => SMTP_USERNAME
            ]);
            
            // In development, include error in response for debugging
            // Remove this in production for security
            $debugInfo = '';
            if (defined('BASE_URL') && strpos(BASE_URL, 'localhost') !== false) {
                $debugInfo = ' (Email error: ' . $emailResult['message'] . ')';
            }
        }
        
        logInfo('Contact form submitted', [
            'name' => $name,
            'email' => $email,
            'subject' => $subject,
            'email_sent' => $emailResult['success'],
            'email_error' => $emailResult['success'] ? null : $emailResult['message']
        ]);
        
        http_response_code(201);
        $responseMessage = 'Thank you for your message. We will get back to you soon!';
        if (!$emailResult['success'] && isset($debugInfo)) {
            $responseMessage .= $debugInfo;
        }
        
        echo json_encode([
            'status' => 'success',
            'message' => $responseMessage,
            'email_sent' => $emailResult['success'],
            'email_message' => $emailResult['message'] // Debug info
        ]);
        
    } catch (PDOException $e) {
        logError('Contact form error', ['error' => $e->getMessage()]);
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to submit contact form'
        ]);
    }
}

else {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method not allowed'
    ]);
}
?>
