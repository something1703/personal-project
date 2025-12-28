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

// Login endpoint
if ($method === 'POST' && strpos($_SERVER['REQUEST_URI'], '/login') !== false) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';
    
    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Please enter both username and password'
        ]);
        exit();
    }
    
    try {
        $query = "SELECT id, username, password, email, role, is_active 
                  FROM admin_users 
                  WHERE username = :username OR email = :username";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        
        if ($stmt->rowCount() === 0) {
            http_response_code(401);
            echo json_encode([
                'status' => 'error',
                'message' => 'Invalid username or password'
            ]);
            exit();
        }
        
        $user = $stmt->fetch();
        
        // Check if account is active
        if (!$user['is_active']) {
            http_response_code(403);
            echo json_encode([
                'status' => 'error',
                'message' => 'Your account has been deactivated. Please contact support.'
            ]);
            exit();
        }
        
        // Verify password
        if (!password_verify($password, $user['password'])) {
            http_response_code(401);
            echo json_encode([
                'status' => 'error',
                'message' => 'Invalid username or password'
            ]);
            exit();
        }
        
        // Set session
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_id'] = $user['id'];
        $_SESSION['admin_username'] = $user['username'];
        $_SESSION['admin_role'] = $user['role'];
        $_SESSION['last_activity'] = time();
        
        // Log audit
        logAudit($db, $user['id'], 'USER_LOGIN', 'user', $user['id'], [
            'username' => $user['username']
        ]);
        
        logInfo('User logged in', ['user_id' => $user['id'], 'username' => $user['username']]);
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Login successful',
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'role' => $user['role']
            ]
        ]);
        
    } catch (PDOException $e) {
        logError('Login error', ['error' => $e->getMessage()]);
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'An error occurred during login'
        ]);
    }
}

// Register endpoint
elseif ($method === 'POST' && strpos($_SERVER['REQUEST_URI'], '/register') !== false) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $username = $data['username'] ?? '';
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    $firstName = $data['firstName'] ?? null;
    $lastName = $data['lastName'] ?? null;
    
    if (empty($username) || empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Username, email, and password are required'
        ]);
        exit();
    }
    
    try {
        // Check if user already exists
        $checkQuery = "SELECT id FROM admin_users WHERE username = :username OR email = :email";
        $stmt = $db->prepare($checkQuery);
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Username or email already exists'
            ]);
            exit();
        }
        
        // Hash password
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        
        // Insert user
        $insertQuery = "INSERT INTO admin_users (username, email, password, first_name, last_name, role, created_at)
                        VALUES (:username, :email, :password, :first_name, :last_name, 'user', NOW())";
        
        $stmt = $db->prepare($insertQuery);
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->bindParam(':first_name', $firstName);
        $stmt->bindParam(':last_name', $lastName);
        $stmt->execute();
        
        $userId = $db->lastInsertId();
        
        // Set session
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_id'] = $userId;
        $_SESSION['admin_username'] = $username;
        $_SESSION['admin_role'] = 'user';
        $_SESSION['last_activity'] = time();
        
        // Log audit
        logAudit($db, $userId, 'USER_REGISTER', 'user', $userId, [
            'username' => $username
        ]);
        
        logInfo('User registered', ['user_id' => $userId, 'username' => $username]);
        
        http_response_code(201);
        echo json_encode([
            'status' => 'success',
            'message' => 'Registration successful',
            'user' => [
                'id' => $userId,
                'username' => $username,
                'email' => $email
            ]
        ]);
        
    } catch (PDOException $e) {
        logError('Registration error', ['error' => $e->getMessage()]);
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'An error occurred during registration'
        ]);
    }
}

// Logout endpoint
elseif ($method === 'POST' && strpos($_SERVER['REQUEST_URI'], '/logout') !== false) {
    $userId = $_SESSION['admin_id'] ?? null;
    $username = $_SESSION['admin_username'] ?? null;
    
    if ($userId) {
        logAudit($db, $userId, 'USER_LOGOUT', 'user', $userId, [
            'username' => $username
        ]);
        logInfo('User logged out', ['user_id' => $userId, 'username' => $username]);
    }
    
    session_unset();
    session_destroy();
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Logout successful'
    ]);
}

// Check auth status
elseif ($method === 'GET' && strpos($_SERVER['REQUEST_URI'], '/status') !== false) {
    if (isLoggedIn()) {
        echo json_encode([
            'status' => 'success',
            'authenticated' => true,
            'user' => [
                'id' => $_SESSION['admin_id'],
                'username' => $_SESSION['admin_username'],
                'role' => $_SESSION['admin_role']
            ]
        ]);
    } else {
        echo json_encode([
            'status' => 'success',
            'authenticated' => false
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
