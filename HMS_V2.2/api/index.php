<?php
// Single entry point for all PHP requests ? Vercel's Hobby plan caps
// deployments at 12 Serverless Functions, and this app has 25+ PHP files,
// so every request is routed through this one file instead of deploying
// each script as its own function.

$baseDir = __DIR__;

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$path = trim($path, '/');

if ($path === '') {
    $path = 'frontend/index.php';
}

$path = str_replace('..', '', $path);
$target = $baseDir . '/' . $path;

if (substr($target, -4) !== '.php' || !is_file($target)) {
    http_response_code(404);
    header('Content-Type: text/plain');
    echo 'Not found';
    exit;
}

require $target;
