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

// Get all tracking records with filters and pagination
if ($method === 'GET' && strpos($_SERVER['REQUEST_URI'], '/records') !== false) {
    requireRole('admin');
    
    $pid = $_GET['pid'] ?? '';
    $status = $_GET['status'] ?? '';
    $search = $_GET['search'] ?? '';
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? min((int)$_GET['limit'], MAX_PAGE_LIMIT) : DEFAULT_PAGE_LIMIT;
    
    try {
        $whereConditions = [];
        $params = [];
        
        // Filter by Project ID
        if (!empty($pid)) {
            $whereConditions[] = "pid = :pid";
            $params[':pid'] = $pid;
        }
        
        // Filter by Status
        if (!empty($status)) {
            $whereConditions[] = "status = :status";
            $params[':status'] = $status;
        }
        
        // Search in UID or PID
        if (!empty($search)) {
            $whereConditions[] = "(uid LIKE :search1 OR pid LIKE :search2)";
            $params[':search1'] = "%$search%";
            $params[':search2'] = "%$search%";
        }
        
        $whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';
        
        // Get total count
        $countQuery = "SELECT COUNT(*) as total FROM tracking $whereClause";
        $stmt = $db->prepare($countQuery);
        $stmt->execute($params);
        $total = (int)$stmt->fetch()['total'];
        
        // Get records
        $offset = ($page - 1) * $limit;
        $query = "SELECT * FROM tracking $whereClause ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        $stmt = $db->prepare($query);
        
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        
        $stmt->execute();
        $records = $stmt->fetchAll();
        
        echo json_encode([
            'status' => 'success',
            'data' => $records,
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'totalPages' => ceil($total / $limit)
            ]
        ]);
        
    } catch (PDOException $e) {
        logError('Dashboard records error', ['error' => $e->getMessage()]);
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to fetch records'
        ]);
    }
}

// Get statistics
elseif ($method === 'GET' && strpos($_SERVER['REQUEST_URI'], '/stats') !== false) {
    requireRole('admin');
    
    try {
        $query = "SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'Complete' THEN 1 ELSE 0 END) as complete,
                    SUM(CASE WHEN status = 'Terminate' THEN 1 ELSE 0 END) as terminate,
                    SUM(CASE WHEN status = 'Quotafull' THEN 1 ELSE 0 END) as quotafull
                  FROM tracking";
        
        $stmt = $db->query($query);
        $stats = $stmt->fetch();
        
        echo json_encode([
            'status' => 'success',
            'data' => $stats
        ]);
        
    } catch (PDOException $e) {
        logError('Dashboard stats error', ['error' => $e->getMessage()]);
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to fetch statistics'
        ]);
    }
}

// Trigger callback (hit URL with UID)
elseif ($method === 'POST' && strpos($_SERVER['REQUEST_URI'], '/callback') !== false) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $baseUrl = $data['baseUrl'] ?? '';
    $uid = $data['uid'] ?? '';
    
    if (empty($baseUrl) || empty($uid)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Base URL and UID are required'
        ]);
        exit();
    }
    
    try {
        // Generate final URL
        if (strpos($baseUrl, 'uid=') !== false) {
            $finalUrl = preg_replace('/uid=([^&]*)/', "uid=$uid", $baseUrl);
        } else {
            $separator = strpos($baseUrl, '?') !== false ? '&' : '?';
            $finalUrl = $baseUrl . $separator . "uid=$uid";
        }
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Callback URL generated',
            'data' => [
                'generatedUrl' => $finalUrl,
                'uid' => $uid
            ]
        ]);
        
    } catch (Exception $e) {
        logError('Callback error', ['error' => $e->getMessage()]);
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to generate callback'
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
