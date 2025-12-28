<?php
require_once '../config/database.php';
require_once '../config/config.php';
require_once '../includes/cors.php';
require_once '../includes/session.php';
require_once '../includes/logger.php';

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
        $query = "INSERT INTO contact_submissions (name, email, subject, message, created_at)
                  VALUES (:name, :email, :subject, :message, NOW())";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':subject', $subject);
        $stmt->bindParam(':message', $message);
        $stmt->execute();
        
        logInfo('Contact form submitted', [
            'name' => $name,
            'email' => $email,
            'subject' => $subject
        ]);
        
        http_response_code(201);
        echo json_encode([
            'status' => 'success',
            'message' => 'Thank you for your message. We will get back to you soon!'
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
