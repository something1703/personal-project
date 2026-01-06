<?php
require_once 'config/config.php';
require_once 'config/database.php';

echo "<h2>Timezone Verification</h2>";
echo "<p>Use this logic to see if the server time matches your local time.</p>";
echo "<hr>";

// 1. PHP Time
echo "<strong>PHP Server Time:</strong> " . date('Y-m-d H:i:s') . " (" . date_default_timezone_get() . ")<br>";

// 2. Database Time
try {
    $database = new Database();
    $db = $database->getConnection();
    $stmt = $db->query("SELECT NOW() as db_time");
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "<strong>Database Time:</strong> " . $row['db_time'] . "<br>";
} catch (Exception $e) {
    echo "DB Error: " . $e->getMessage();
}

echo "<hr>";
echo "<strong>Your Browser Time:</strong> <script>document.write(new Date().toLocaleString())</script>";
?>
