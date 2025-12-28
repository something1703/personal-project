<?php
require_once '../config/database.php';
require_once '../config/config.php';
require_once '../includes/cors.php';
require_once '../includes/session.php';
require_once '../includes/logger.php';

setCorsHeaders();

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

// Track endpoint - handles ?pid=XXX&uid=XXX&action=Complete/Terminate/Quotafull&redirect_url=XXX
if ($method === 'GET') {
    $uid = $_GET['uid'] ?? '';
    $pid = $_GET['pid'] ?? '';
    $action = $_GET['action'] ?? '';
    $redirect_url = $_GET['redirect_url'] ?? '';
    
    // Validate action
    $validActions = ['Complete', 'Terminate', 'Quotafull'];
    if (!in_array($action, $validActions)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid action. Allowed: Complete, Terminate, Quotafull'
        ]);
        exit();
    }
    
    // Validate required parameters
    if (empty($uid) || empty($pid)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Missing required parameters: uid and pid'
        ]);
        exit();
    }
    
    // Get user IP
    $ip = getUserIP();
    
    try {
        // Insert into database
        $query = "INSERT INTO tracking (uid, pid, status, ip, created_at) 
                  VALUES (:uid, :pid, :status, :ip, NOW())";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':uid', $uid);
        $stmt->bindParam(':pid', $pid);
        $stmt->bindParam(':status', $action);
        $stmt->bindParam(':ip', $ip);
        $stmt->execute();
        
        logInfo('Tracking recorded', [
            'uid' => $uid,
            'pid' => $pid,
            'status' => $action,
            'ip' => $ip
        ]);
        
        // If redirect_url is provided, redirect to company's URL
        if (!empty($redirect_url)) {
            $separator = strpos($redirect_url, '?') !== false ? '&' : '?';
            $redirectWithParams = $redirect_url . $separator . "uid=$uid&status=$action&timestamp=" . time();
            header("Location: $redirectWithParams");
            exit();
        }
        
        // Return HTML response showing status
        $statusColors = [
            'Complete' => '#10b981',
            'Terminate' => '#ef4444',
            'Quotafull' => '#f59e0b'
        ];
        
        $statusColor = $statusColors[$action] ?? '#6b7280';
        $icon = $action === 'Complete' ? '✓' : ($action === 'Terminate' ? '✕' : '⚠');
        $message = $action === 'Complete' ? 'Thank you for completing the survey!' : 
                   ($action === 'Terminate' ? 'Survey terminated.' : 'Survey quota has been reached.');
        
        $timestamp = date('Y-m-d H:i:s');
        
        echo <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Survey Status - $action</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 60px 40px;
            text-align: center;
            max-width: 500px;
            width: 100%;
        }
        .logo {
            width: 120px;
            height: 120px;
            margin: 0 auto 30px;
            background: #f3f4f6;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            color: $statusColor;
        }
        .status {
            font-size: 36px;
            font-weight: bold;
            color: $statusColor;
            margin-bottom: 20px;
        }
        .message {
            font-size: 18px;
            color: #6b7280;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        .details {
            background: #f9fafb;
            border-radius: 10px;
            padding: 20px;
            margin-top: 30px;
            text-align: left;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: 600;
            color: #374151;
        }
        .detail-value {
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            $icon
        </div>
        <div class="status">$action</div>
        <div class="message">
            $message
        </div>
        <div class="details">
            <div class="detail-row">
                <span class="detail-label">Reference ID:</span>
                <span class="detail-value">$uid</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Project ID:</span>
                <span class="detail-value">$pid</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value" style="color: $statusColor; font-weight: 600;">$action</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Timestamp:</span>
                <span class="detail-value">$timestamp</span>
            </div>
        </div>
    </div>
</body>
</html>
HTML;
        
    } catch (PDOException $e) {
        logError('Tracking error', ['error' => $e->getMessage()]);
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to save tracking data'
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
