<?php
// Single entry point for Vercel deployment — routes all requests through this file
// to stay under Vercel's 12 Serverless Function limit

$rootDir = __DIR__;
$requestUri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$requestUri = trim($requestUri, '/');

// Helper function to get file MIME type
function getMimeType($file) {
    $mimes = [
        'html' => 'text/html; charset=UTF-8',
        'css' => 'text/css',
        'js' => 'application/javascript',
        'json' => 'application/json',
        'svg' => 'image/svg+xml',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif' => 'image/gif',
        'webp' => 'image/webp',
        'woff' => 'font/woff',
        'woff2' => 'font/woff2',
        'ttf' => 'font/ttf',
        'eot' => 'application/vnd.ms-fontobject',
    ];
    $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    return $mimes[$ext] ?? 'application/octet-stream';
}

// Helper function to serve a static file
function serveStaticFile($file) {
    if (file_exists($file) && is_file($file)) {
        header('Content-Type: ' . getMimeType($file));
        header('Cache-Control: public, max-age=31536000');
        readfile($file);
        exit;
    }
    return false;
}

// Handle API requests (/api/...)
if (strpos($requestUri, 'api/') === 0) {
    $apiPath = substr($requestUri, 4); // Remove 'api/' prefix
    
    // Route to api/backend or api/frontend PHP files
    if (strpos($apiPath, 'backend/') === 0) {
        $target = $rootDir . '/api/' . $apiPath;
    } elseif (strpos($apiPath, 'frontend/') === 0) {
        $target = $rootDir . '/api/' . $apiPath;
    } else {
        // Try both backend and frontend paths, or use the api/index.php
        $backendTarget = $rootDir . '/api/backend/' . $apiPath;
        $frontendTarget = $rootDir . '/api/frontend/' . $apiPath;
        
        if (file_exists($backendTarget)) {
            $target = $backendTarget;
        } elseif (file_exists($frontendTarget)) {
            $target = $frontendTarget;
        } else {
            // Default to api/index.php for routing
            $target = $rootDir . '/api/index.php';
            $_SERVER['REQUEST_URI'] = '/api/' . $apiPath;
        }
    }
    
    // Ensure we're serving a PHP file
    if (!str_ends_with($target, '.php')) {
        $target .= '.php';
    }
    
    if (file_exists($target)) {
        require $target;
        exit;
    }
    
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'API endpoint not found']);
    exit;
}

// Handle static files from frontend
$staticFile = $rootDir . '/frontend/' . $requestUri;
if (file_exists($staticFile) && is_file($staticFile)) {
    serveStaticFile($staticFile);
}

// Handle root request or any non-API, non-file request → serve frontend SPA
if ($requestUri === '' || $requestUri === 'index.php' || $requestUri === 'index.html') {
    serveStaticFile($rootDir . '/frontend/index.html');
}

// For all other routes (SPA routing), serve the frontend index.html
$indexFile = $rootDir . '/frontend/index.html';
if (file_exists($indexFile)) {
    serveStaticFile($indexFile);
}

// Fallback 404
http_response_code(404);
header('Content-Type: text/html; charset=UTF-8');
echo '<!DOCTYPE html><html><body><h1>404 - Not Found</h1></body></html>';
exit;