<?php
/**
 * auth/login.php — Login Handler (POST)
 * Processes login form submissions using password_hash / password_verify.
 * Demonstrates: $_POST, if-else, prepared statements, $_SESSION, password_verify.
 */

require_once __DIR__ . '/../config/db.php';

// Only handle POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ' . $fail_url);
    exit;
}

// Retrieve and sanitize inputs ($_POST)
$email    = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

// Sign In modal (top bar) → errors return to the same page and reopen the modal;
// the full login page (pages/login.php) → errors return there.
$from_modal = !empty($_POST['from_modal']);
$return_to  = safe_return_to($_POST['return_to'] ?? '');
$fail_url   = $from_modal ? $return_to : BASE_URL . '/pages/login.php';

// Server-side validation
$errors = [];
if (empty($email)) {
    $errors[] = 'Email address is required.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email address.';
}

if (empty($password)) {
    $errors[] = 'Password is required.';
}

if (!empty($errors)) {
    $_SESSION['login_errors'] = $errors;
    $_SESSION['login_email']  = $email;
    header('Location: ' . $fail_url);
    exit;
}

// Verify DB connection
if (!$pdo) {
    $_SESSION['login_errors'] = [
        'Could not connect to the database. Please ensure MySQL is running in XAMPP and creativekit3a_db is imported.'
    ];
    $_SESSION['login_email'] = $email;
    header('Location: ' . $fail_url);
    exit;
}

// Look up user with prepared statement (prevents SQL injection)
$stmt = $pdo->prepare("SELECT u.id, u.first_name, u.last_name, u.email, u.password_hash, u.role, u.is_active,
                              COALESCE(o.status, 'active') AS org_status
                       FROM users AS u LEFT JOIN organizations AS o ON o.id = u.organization_id
                       WHERE u.email = :email LIMIT 1");
$stmt->execute([':email' => $email]);
$user = $stmt->fetch();

// Authentication logic using if-else statements
if (!$user) {
    // User not found
    $_SESSION['login_errors'] = ['No account found with that email address.'];
    $_SESSION['login_email']  = $email;
    header('Location: ' . $fail_url);
    exit;
} elseif (!$user['is_active']) {
    // Account deactivated
    $_SESSION['login_errors'] = ['This account has been deactivated. Please contact an administrator.'];
    $_SESSION['login_email']  = $email;
    header('Location: ' . $fail_url);
    exit;
} elseif (!password_verify($password, $user['password_hash'])) {
    // Wrong password
    $_SESSION['login_errors'] = ['Incorrect password. Please try again.'];
    $_SESSION['login_email']  = $email;
    header('Location: ' . $fail_url);
    exit;
} elseif ($user['org_status'] === 'suspended') {
    // The account's organization is suspended (pages/super-admin.php)
    $_SESSION['login_errors'] = ['Your organization\'s access is suspended. Please contact CreativeKit3A.'];
    $_SESSION['login_email']  = $email;
    header('Location: ' . $fail_url);
    exit;
} else {
    // Successful login — set session variables (new session id prevents fixation)
    session_regenerate_id(true);
    $_SESSION['user_id']    = (int)$user['id'];
    $_SESSION['user_role']  = $user['role'];
    $_SESSION['user_name']  = $user['first_name'] . ' ' . $user['last_name'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['login_at']   = time();   // auth/guard.php ends the session after setting('session_hours')

    // Update last_login_at
    $update = $pdo->prepare('UPDATE users SET last_login_at = NOW() WHERE id = :id');
    $update->execute([':id' => $user['id']]);

    // Log activity
    $log = $pdo->prepare('INSERT INTO activity_log (user_id, action, details, ip_address) VALUES (:uid, :action, :details, :ip)');
    $log->execute([
        ':uid'     => $user['id'],
        ':action'  => 'login',
        ':details' => 'User logged in: ' . $user['first_name'] . ' ' . $user['last_name'] . ' (' . ucfirst($user['role']) . ')',
        ':ip'      => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1',
    ]);

    set_flash('success', 'Welcome back, ' . $user['first_name'] . '! You are logged in as ' . ucfirst($user['role']) . '.');

    // Staff & admins go to the portal; customers return to the storefront
    if (in_array($user['role'], ['admin', 'staff'], true)) {
        header('Location: ' . BASE_URL . '/pages/dashboard.php');
    } else {
        header('Location: ' . ($from_modal ? $return_to : BASE_URL . '/'));
    }
    exit;
}
