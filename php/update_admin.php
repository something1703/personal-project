<?php
/**
 * Script to update the main Admin's email address
 * Run this once, then delete it.
 */
require_once 'config/config.php';
require_once 'config/database.php';

// The email you want to set for the admin
$new_email = "infinityresearch904@gmail.com";
$admin_username = "admin";

echo "<h2>Updating Admin Email</h2>";

try {
    $database = new Database();
    $db = $database->getConnection();

    // 1. Check if this email is already taken by another user
    $check_stmt = $db->prepare("SELECT id, username FROM admin_users WHERE email = :email AND username != :username");
    $check_stmt->bindParam(':email', $new_email);
    $check_stmt->bindParam(':username', $admin_username);
    $check_stmt->execute();

    if ($check_stmt->rowCount() > 0) {
        $existing = $check_stmt->fetch(PDO::FETCH_ASSOC);
        echo "<div style='color: red; padding: 10px; border: 1px solid red;'>";
        echo "<strong>Error:</strong> This email ($new_email) is already being used by another user: <strong>" . htmlspecialchars($existing['username']) . "</strong>.<br>";
        echo "You cannot have two users with the same email.";
        echo "</div>";
    } else {
        // 2. Update the admin record
        $update_stmt = $db->prepare("UPDATE admin_users SET email = :email WHERE username = :username");
        $update_stmt->bindParam(':email', $new_email);
        $update_stmt->bindParam(':username', $admin_username);
        
        if ($update_stmt->execute()) {
            echo "<div style='color: green; padding: 10px; border: 1px solid green;'>";
            echo "<strong>✓ SUCCESS!</strong><br>";
            echo "The email for user '<strong>$admin_username</strong>' has been updated to: <strong>$new_email</strong>.<br>";
            echo "You can now use the 'Forgot Password' feature with this email.";
            echo "</div>";
        } else {
            echo "<p style='color: red;'>Database update failed.</p>";
        }
    }

} catch (PDOException $e) {
    echo "<p style='color: red;'>Database Error: " . $e->getMessage() . "</p>";
}
?>
