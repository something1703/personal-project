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

// Get all users (admin only)
if ($method === 'GET' && strpos($_SERVER['REQUEST_URI'], '/users') !== false) {
    requireRole('admin');
    
    try {
        $query = "SELECT id, username, email, first_name, last_name, role, is_active, created_at 
                  FROM admin_users 
                  ORDER BY created_at DESC";
        
        $stmt = $db->query($query);
        $users = $stmt->fetchAll();
        
        echo json_encode([
            'status' => 'success',
            'data' => $users
        ]);
        
    } catch (PDOException $e) {
        logError('Get users error', ['error' => $e->getMessage()]);
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to fetch users'
        ]);
    }
}

// Update user role (admin only)
elseif ($method === 'PUT' && strpos($_SERVER['REQUEST_URI'], '/users/') !== false) {
    requireRole('admin');
    
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Extract user ID from URL
    preg_match('/\/users\/(\d+)/', $_SERVER['REQUEST_URI'], $matches);
    $userId = $matches[1] ?? null;
    
    $role = $data['role'] ?? '';
    $isActive = isset($data['is_active']) ? (bool)$data['is_active'] : null;
    
    if (!$userId) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'User ID is required'
        ]);
        exit();
    }
    
    try {
        $updates = [];
        $params = [':user_id' => $userId];
        
        if (!empty($role) && in_array($role, ['admin', 'user', 'viewer'])) {
            $updates[] = "role = :role";
            $params[':role'] = $role;
        }
        
        if ($isActive !== null) {
            $updates[] = "is_active = :is_active";
            $params[':is_active'] = $isActive ? 1 : 0;
        }
        
        if (empty($updates)) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'No valid fields to update'
            ]);
            exit();
        }
        
        $query = "UPDATE admin_users SET " . implode(', ', $updates) . " WHERE id = :user_id";
        $stmt = $db->prepare($query);
        $stmt->execute($params);
        
        logAudit($db, $_SESSION['admin_id'], 'USER_UPDATE', 'user', $userId, [
            'role' => $role,
            'is_active' => $isActive
        ]);
        
        echo json_encode([
            'status' => 'success',
            'message' => 'User updated successfully'
        ]);
        
    } catch (PDOException $e) {
        logError('Update user error', ['error' => $e->getMessage()]);
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to update user'
        ]);
    }
}

// Delete user (admin only)
elseif ($method === 'DELETE' && strpos($_SERVER['REQUEST_URI'], '/users/') !== false) {
    requireRole('admin');
    
    // Extract user ID from URL
    preg_match('/\/users\/(\d+)/', $_SERVER['REQUEST_URI'], $matches);
    $userId = $matches[1] ?? null;
    
    if (!$userId) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'User ID is required'
        ]);
        exit();
    }
    
    // Prevent deleting yourself
    if ($userId == $_SESSION['admin_id']) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'You cannot delete your own account'
        ]);
        exit();
    }
    
    try {
        $query = "DELETE FROM admin_users WHERE id = :user_id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        
        logAudit($db, $_SESSION['admin_id'], 'USER_DELETE', 'user', $userId, []);
        
        echo json_encode([
            'status' => 'success',
            'message' => 'User deleted successfully'
        ]);
        
    } catch (PDOException $e) {
        logError('Delete user error', ['error' => $e->getMessage()]);
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to delete user'
        ]);
    }
}

// Get audit logs (admin only)
elseif ($method === 'GET' && strpos($_SERVER['REQUEST_URI'], '/audit-logs') !== false) {
    requireRole('admin');
    
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? min((int)$_GET['limit'], MAX_PAGE_LIMIT) : DEFAULT_PAGE_LIMIT;
    
    try {
        // Get total count
        $countQuery = "SELECT COUNT(*) as total FROM audit_logs";
        $stmt = $db->query($countQuery);
        $total = (int)$stmt->fetch()['total'];
        
        // Get logs
        $offset = ($page - 1) * $limit;
        $query = "SELECT al.*, au.username 
                  FROM audit_logs al
                  LEFT JOIN admin_users au ON al.user_id = au.id
                  ORDER BY al.created_at DESC 
                  LIMIT :limit OFFSET :offset";
        
        $stmt = $db->prepare($query);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $logs = $stmt->fetchAll();
        
        echo json_encode([
            'status' => 'success',
            'data' => $logs,
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'totalPages' => ceil($total / $limit)
            ]
        ]);
        
    } catch (PDOException $e) {
        logError('Get audit logs error', ['error' => $e->getMessage()]);
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to fetch audit logs'
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
