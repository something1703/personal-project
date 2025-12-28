<?php
// Logging functions

function logInfo($message, $context = []) {
    writeLog('INFO', $message, $context);
}

function logWarning($message, $context = []) {
    writeLog('WARNING', $message, $context);
}

function logError($message, $context = []) {
    writeLog('ERROR', $message, $context);
}

function writeLog($level, $message, $context = []) {
    $logFile = __DIR__ . '/../logs/app.log';
    $logDir = dirname($logFile);
    
    if (!file_exists($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    $timestamp = date('Y-m-d H:i:s');
    $contextStr = !empty($context) ? json_encode($context) : '';
    $logEntry = "[$timestamp] [$level] $message $contextStr" . PHP_EOL;
    
    file_put_contents($logFile, $logEntry, FILE_APPEND);
}

function logAudit($db, $userId, $action, $entityType = null, $entityId = null, $details = []) {
    try {
        $ipAddress = getUserIP();
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
        $detailsJson = json_encode($details);
        
        $query = "INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, user_agent, details)
                  VALUES (:user_id, :action, :entity_type, :entity_id, :ip_address, :user_agent, :details)";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':action', $action);
        $stmt->bindParam(':entity_type', $entityType);
        $stmt->bindParam(':entity_id', $entityId);
        $stmt->bindParam(':ip_address', $ipAddress);
        $stmt->bindParam(':user_agent', $userAgent);
        $stmt->bindParam(':details', $detailsJson);
        $stmt->execute();
    } catch (PDOException $e) {
        error_log("Audit log error: " . $e->getMessage());
    }
}
?>
