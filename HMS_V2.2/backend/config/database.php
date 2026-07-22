<?php
/**
 * Database connection (PDO) — single reusable connection object.
 * Edit these 4 constants to match your local MySQL / XAMPP / WAMP setup.
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'hospital_feedback_system');
define('DB_USER', 'root');
define('DB_PASS', '');          // XAMPP default is empty string

function getDBConnection(): PDO {
    static $pdo = null;

    if ($pdo === null) {
        try {
            $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            die('Database connection failed. Please check config/database.php — ' . $e->getMessage());
        }
    }

    return $pdo;
}
