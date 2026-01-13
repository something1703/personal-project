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
                  VALUES (:uid, :pid, :status, :ip, :created_at)";
        
        $current_timestamp = date('Y-m-d H:i:s');
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':uid', $uid);
        $stmt->bindParam(':pid', $pid);
        $stmt->bindParam(':status', $action);
        $stmt->bindParam(':ip', $ip);
        $stmt->bindParam(':created_at', $current_timestamp);
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
        $statusLabels = [
            'Complete' => 'COMPLETED',
            'Terminate' => 'TERMINATED',
            'Quotafull' => 'QUOTA FULL'
        ];
        
        $statusColors = [
            'Complete' => '#10b981',
            'Terminate' => '#ef4444',
            'Quotafull' => '#f59e0b'
        ];
        
        $statusBadgeColors = [
            'Complete' => '#10b981',
            'Terminate' => '#ef4444',
            'Quotafull' => '#f59e0b'
        ];
        
        $statusLabel = $statusLabels[$action] ?? 'UNKNOWN';
        $statusColor = $statusColors[$action] ?? '#6b7280';
        $badgeColor = $statusBadgeColors[$action] ?? '#6b7280';
        $icon = $action === 'Complete' ? '✓' : ($action === 'Terminate' ? '✕' : '⚠');
        
        $heading = $action === 'Complete' ? 'Thank You!' : 
                   ($action === 'Terminate' ? 'Survey Terminated' : 'Quota Reached');
        
        $message = $action === 'Complete' ? 'Your survey response has been successfully recorded.' : 
                   ($action === 'Terminate' ? 'Your survey response has been terminated.' : 'The survey quota has been reached.');
        
        $timestamp = date('Y-m-d H:i:s');
        $year = date('Y');
        
        // Set content type to HTML
        header('Content-Type: text/html; charset=UTF-8');
        
        echo <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Survey Status - $statusLabel</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f5f5f5;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            padding: 0;
            max-width: 600px;
            width: 100%;
            overflow: hidden;
        }
        .header {
            padding: 50px 40px 30px;
            text-align: center;
            border-bottom: 1px solid #e5e7eb;
        }
        .logo-container {
            width: 120px;
            height: 120px;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .logo-img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }
        .badge {
            display: inline-block;
            background: $badgeColor;
            color: white;
            padding: 8px 24px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            letter-spacing: 0.5px;
            margin-bottom: 20px;
        }
        .heading {
            font-size: 32px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 15px;
        }
        .message {
            font-size: 16px;
            color: #6b7280;
            line-height: 1.6;
        }
        .details-section {
            padding: 30px 40px;
        }
        .details-heading {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
            text-align: center;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 16px 0;
            border-bottom: 1px solid #f3f4f6;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: 400;
            color: #6b7280;
            font-size: 15px;
        }
        .detail-value {
            color: #1f2937;
            font-weight: 500;
            font-size: 15px;
            font-family: 'Courier New', monospace;
        }
        .footer {
            background: #f9fafb;
            padding: 20px 40px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer-text {
            font-size: 14px;
            color: #6b7280;
        }
        .company-name {
            font-weight: 600;
            color: #1f2937;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-container">
                <img src="/infinity%20logo.png" alt="Infinity Research Logo" class="logo-img">
            </div>
            <div class="badge">$statusLabel</div>
            <h1 class="heading">$heading</h1>
            <p class="message">$message</p>
        </div>
        
        <div class="details-section">
            <h2 class="details-heading">Response Details</h2>
            <div class="detail-row">
                <span class="detail-label">Project ID</span>
                <span class="detail-value">$pid</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Respondent ID</span>
                <span class="detail-value">$uid</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Location</span>
                <span class="detail-value">Global - Region A</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">IP Address</span>
                <span class="detail-value">$ip</span>
            </div>
        </div>
        
        <div class="footer">
            <p class="footer-text">© $year <span class="company-name">Infinity Research</span>. All rights reserved.</p>
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
