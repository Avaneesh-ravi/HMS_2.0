<?php
/**
 * Database connection (PDO) — single reusable connection object.
 * Now using PostgreSQL (Supabase) instead of MySQL.
 * Environment variables must be set in Vercel deployment settings.
 */

// Get environment variables (required for Vercel deployment)
if (!defined('DB_HOST')) define('DB_HOST', getenv('DB_HOST'));
if (!defined('DB_PORT')) define('DB_PORT', getenv('DB_PORT') ?: '6543');
if (!defined('DB_NAME')) define('DB_NAME', getenv('DB_NAME') ?: 'postgres');
if (!defined('DB_USER')) define('DB_USER', getenv('DB_USER'));
if (!defined('DB_PASS')) define('DB_PASS', getenv('DB_PASS'));

function getDBConnection(): PDO {
    static $pdo = null;

    if ($pdo === null) {
        try {
            // Validate required environment variables
            if (!DB_HOST || !DB_USER || !DB_PASS) {
                throw new Exception('Missing required database environment variables (DB_HOST, DB_USER, DB_PASS)');
            }
            
            $dsn = 'pgsql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';sslmode=require';
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            die('Database connection failed. Please check Vercel environment variables. Error: ' . $e->getMessage());
        } catch (Exception $e) {
            die('Configuration error: ' . $e->getMessage());
        }
    }

    return $pdo;
}