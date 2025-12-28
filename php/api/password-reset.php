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

// Request password reset
if ($method === 'POST' && strpos($_SERVER['REQUEST_URI'], '/forgot') !== false) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $email = $data['email'] ?? '';
    
    if (empty($email)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Email is required'
        ]);
        exit();
    }
    
    try {
        // Check if user exists
        $query = "SELECT id, username, email FROM admin_users WHERE email = :email";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        
        if ($stmt->rowCount() === 0) {
            // Don't reveal if email exists or not for security
            echo json_encode([
                'status' => 'success',
                'message' => 'If the email exists, a password reset link has been sent.'
            ]);
            exit();
        }
        
        $user = $stmt->fetch();
        
        // Generate reset token
        $token = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', time() + 3600); // 1 hour
        
        // Save token to database
        $insertQuery = "INSERT INTO password_reset_tokens (user_id, token, expires_at, created_at)
                        VALUES (:user_id, :token, :expires_at, NOW())";
        
        $stmt = $db->prepare($insertQuery);
        $stmt->bindParam(':user_id', $user['id']);
        $stmt->bindParam(':token', $token);
        $stmt->bindParam(':expires_at', $expiresAt);
        $stmt->execute();
        
        // In production, send email with reset link
        // For now, just log it
        $resetLink = FRONTEND_URL . "/reset-password?token=$token";
        logInfo('Password reset requested', [
            'user_id' => $user['id'],
            'email' => $email,
            'reset_link' => $resetLink
        ]);
        
        echo json_encode([
            'status' => 'success',
            'message' => 'If the email exists, a password reset link has been sent.',
            'reset_link' => $resetLink // Remove this in production
        ]);
        
    } catch (PDOException $e) {
        logError('Password reset request error', ['error' => $e->getMessage()]);
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to process password reset request'
        ]);
    }
}

// Verify reset token
elseif ($method === 'GET' && strpos($_SERVER['REQUEST_URI'], '/verify') !== false) {
    $token = $_GET['token'] ?? '';
    
    if (empty($token)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Token is required'
        ]);
        exit();
    }
    
    try {
        $query = "SELECT prt.*, au.email 
                  FROM password_reset_tokens prt
                  JOIN admin_users au ON prt.user_id = au.id
                  WHERE prt.token = :token 
                  AND prt.used = 0 
                  AND prt.expires_at > NOW()";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        
        if ($stmt->rowCount() === 0) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Invalid or expired token'
            ]);
            exit();
        }
        
        $resetToken = $stmt->fetch();
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Token is valid',
            'email' => $resetToken['email']
        ]);
        
    } catch (PDOException $e) {
        logError('Token verification error', ['error' => $e->getMessage()]);
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to verify token'
        ]);
    }
}

// Reset password
elseif ($method === 'POST' && strpos($_SERVER['REQUEST_URI'], '/reset') !== false) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $token = $data['token'] ?? '';
    $newPassword = $data['password'] ?? '';
    
    if (empty($token) || empty($newPassword)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Token and new password are required'
        ]);
        exit();
    }
    
    try {
        // Verify token
        $query = "SELECT user_id FROM password_reset_tokens 
                  WHERE token = :token 
                  AND used = 0 
                  AND expires_at > NOW()";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        
        if ($stmt->rowCount() === 0) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Invalid or expired token'
            ]);
            exit();
        }
        
        $resetToken = $stmt->fetch();
        $userId = $resetToken['user_id'];
        
        // Hash new password
        $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
        
        // Update password
        $updateQuery = "UPDATE admin_users SET password = :password WHERE id = :user_id";
        $stmt = $db->prepare($updateQuery);
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        
        // Mark token as used
        $markUsedQuery = "UPDATE password_reset_tokens SET used = 1 WHERE token = :token";
        $stmt = $db->prepare($markUsedQuery);
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        
        logAudit($db, $userId, 'PASSWORD_RESET', 'user', $userId, []);
        logInfo('Password reset successful', ['user_id' => $userId]);
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Password reset successful'
        ]);
        
    } catch (PDOException $e) {
        logError('Password reset error', ['error' => $e->getMessage()]);
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to reset password'
        ]);
    }
}

else {
    http_response_code(404);
    echo json_encode([
        'status' => 'error',
        'message' => 'Endpoint not found'
    ]);
}
?>
