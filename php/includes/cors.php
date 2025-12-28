<?php
// CORS headers
function setCorsHeaders() {
    global $allowed_origins;
    
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    
    // Allow localhost origins for development
    if (in_array($origin, $allowed_origins) || strpos($origin, 'http://localhost') === 0 || strpos($origin, 'http://127.0.0.1') === 0) {
        header("Access-Control-Allow-Origin: $origin");
    }
    
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json; charset=UTF-8");
    
    // Handle preflight requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}
?>
