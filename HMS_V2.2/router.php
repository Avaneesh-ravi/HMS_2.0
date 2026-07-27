<?php
// Single entry point — keeps this app under Vercel's 12-function limit.
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$path = trim($path, '/');

// Map "/" to your actual homepage file — adjust if different:
if ($path === '' || $path === 'index.php') {
    $path = 'frontend/index.php';
}

$file = __DIR__ . '/' . $path;

// Security: only allow serving real .php files inside this project
if (!str_ends_with($file, '.php') || !file_exists($file)) {
    http_response_code(404);
    echo "Not Found: $path";
    exit;
}

require $file;