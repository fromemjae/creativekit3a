<?php
/**
 * config/settings.php — System-wide settings (table system_settings), edited on
 * pages/super-admin.php. Every value falls back to its default here, so the site
 * keeps working before the migration runs or when the database is down.
 *
 *   setting('maintenance_mode')        -> '0' | '1'
 *   setting_on('registration_open')    -> bool
 */

if (!function_exists('setting')) {

    /** The settings the console edits: key => [default, type, label] */
    function settings_schema(): array {
        return [
            'store_name'          => ['CreativeKit3A', 'text',   'Store name'],
            'support_email'       => ['salesandmarketing@creativekit3a.com', 'email', 'Support email'],
            'registration_open'   => ['1', 'bool',   'Customer registration'],
            'maintenance_mode'    => ['0', 'bool',   'Maintenance mode'],
            'maintenance_message' => ['The quote desk is closed for maintenance. Please check back shortly.', 'text', 'Maintenance message'],
            'quote_min_qty'       => ['50', 'int',   'Minimum quote quantity'],
            'session_hours'       => ['8',  'int',   'Staff session length (hours)'],
        ];
    }

    /** All settings, read once per request */
    function settings_all(): array {
        static $cache = null;
        if ($cache !== null) return $cache;
        $cache = array_map(fn($row) => $row[0], settings_schema());
        $pdo = function_exists('get_db') ? get_db() : null;
        if ($pdo) {
            try {
                foreach ($pdo->query('SELECT setting_key, setting_value FROM system_settings') as $r) {
                    $cache[$r['setting_key']] = $r['setting_value'];
                }
            } catch (PDOException $e) {
                // table not created yet: defaults stand
            }
        }
        return $cache;
    }

    function setting(string $key): string {
        return (string)(settings_all()[$key] ?? '');
    }

    function setting_on(string $key): bool {
        return setting($key) === '1';
    }
}
