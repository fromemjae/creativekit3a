<?php
/**
 * config/db.php — THE single, centralized database connection.
 *
 * Every page, dashboard metric, search/filter, report and CRUD action
 * includes this file and uses its $pdo / get_db() handle. The whole
 * system runs on ONE MySQL database: creativekit3a_db
 * (schema + seed: database/creativekit3a.sql).
 *
 * Uses PHP PDO with prepared statements to prevent SQL injection.
 */

require_once __DIR__ . '/app.php';   // BASE_URL + url() helper

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$db_host = '127.0.0.1';
$db_name = getenv('CK3A_DB_NAME') ?: 'creativekit3a_db';
$db_user = 'root';
$db_pass = '';
$db_port = 3306;

$pdo = null;

// Attempt 1: Standard TCP connection on 127.0.0.1
try {
    $dsn = "mysql:host={$db_host};port={$db_port};dbname={$db_name};charset=utf8mb4";
    $pdo = new PDO($dsn, $db_user, $db_pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
} catch (PDOException $e1) {
    // Attempt 2: Fallback to localhost (may use default socket)
    try {
        $dsn = "mysql:host=localhost;dbname={$db_name};charset=utf8mb4";
        $pdo = new PDO($dsn, $db_user, $db_pass, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    } catch (PDOException $e2) {
        // Attempt 3: Specific macOS XAMPP unix socket
        try {
            $socket = '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock';
            $dsn = "mysql:unix_socket={$socket};dbname={$db_name};charset=utf8mb4";
            $pdo = new PDO($dsn, $db_user, $db_pass, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e3) {
            // Keep $pdo as null; calling pages can display a friendly setup notice
            $pdo = null;
        }
    }
}

/**
 * Returns active PDO instance or null
 */
function get_db(): ?PDO {
    global $pdo;
    return $pdo;
}

/**
 * Sanitize string for HTML output
 */
function e(?string $str): string {
    return htmlspecialchars($str ?? '', ENT_QUOTES, 'UTF-8');
}

/**
 * Flash message helper: set
 */
function set_flash(string $type, string $message): void {
    $_SESSION['flash'] = [
        'type'    => $type, // 'success', 'danger', 'warning', 'info'
        'message' => $message,
    ];
}

/**
 * Flash message helper: get and clear
 */
function get_flash(): ?array {
    if (isset($_SESSION['flash'])) {
        $flash = $_SESSION['flash'];
        unset($_SESSION['flash']);
        return $flash;
    }
    return null;
}

require_once __DIR__ . '/settings.php';   // setting() / setting_on(): system-wide settings
