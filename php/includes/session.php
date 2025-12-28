<?php
// Session management functions

function startSession() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    // Check session timeout
    if (isset($_SESSION['last_activity'])) {
        if (time() - $_SESSION['last_activity'] > SESSION_TIMEOUT) {
            session_unset();
            session_destroy();
            return false;
        }
    }
    
    $_SESSION['last_activity'] = time();
    return true;
}

function isLoggedIn() {
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

function requireAuth() {
    if (!isLoggedIn()) {
        http_response_code(401);
        echo json_encode([
            'status' => 'error',
            'message' => 'Authentication required'
        ]);
        exit();
    }
}

function requireRole($role) {
    requireAuth();
    
    if (!isset($_SESSION['admin_role']) || $_SESSION['admin_role'] !== $role) {
        http_response_code(403);
        echo json_encode([
            'status' => 'error',
            'message' => 'Insufficient permissions'
        ]);
        exit();
    }
}

function getUserIP() {
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        return $_SERVER['HTTP_X_FORWARDED_FOR'];
    } elseif (!empty($_SERVER['HTTP_X_REAL_IP'])) {
        return $_SERVER['HTTP_X_REAL_IP'];
    } elseif (!empty($_SERVER['REMOTE_ADDR'])) {
        return $_SERVER['REMOTE_ADDR'];
    }
    return '0.0.0.0';
}

function trackSession($db) {
    if (!isLoggedIn()) {
        return;
    }
    
    $userId = $_SESSION['admin_id'];
    $sessionId = session_id();
    $ipAddress = getUserIP();
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $expiresAt = date('Y-m-d H:i:s', time() + SESSION_TIMEOUT);
    
    try {
        $query = "INSERT INTO user_sessions (user_id, session_id, ip_address, user_agent, expires_at, last_activity)
                  VALUES (:user_id, :session_id, :ip_address, :user_agent, :expires_at, NOW())
                  ON DUPLICATE KEY UPDATE 
                  last_activity = NOW(),
                  expires_at = :expires_at";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':session_id', $sessionId);
        $stmt->bindParam(':ip_address', $ipAddress);
        $stmt->bindParam(':user_agent', $userAgent);
        $stmt->bindParam(':expires_at', $expiresAt);
        $stmt->execute();
    } catch (PDOException $e) {
        error_log("Session tracking error: " . $e->getMessage());
    }
}
?>
