<?php
require_once __DIR__ . '/' . '../config/database.php';
require_once __DIR__ . '/' . '../includes/functions.php';
ensureSession();
requireAdminLogin();

$assets = getViteAssets(__DIR__ . '/../../../frontend/index.html');
$latestJs = $assets['js'];
$latestCss = $assets['css'];
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Apollo Healthcare Center — Admin Dashboard</title>
    <meta name="robots" content="noindex, nofollow" />
    <script>
      window.ADMIN_HOSPITAL_ID = <?= json_encode((int)($_SESSION['hospital_id'] ?? 0)) ?>;
    </script>
    <style>html, body { height: 100%; margin: 0; } #root { height: 100%; }
      #error-box { display: none; padding: 20px; background: #fff0f0; border: 1px solid red; color: red; position: fixed; z-index: 9999; top: 0; width: 100%; font-family: monospace; }
    </style>
    <script>
      window.addEventListener('error', function(e) {
        document.getElementById('error-box').style.display = 'block';
        document.getElementById('error-box').innerHTML += e.message + '<br>' + e.filename + ':' + e.lineno + '<br>';
      });
      window.addEventListener('unhandledrejection', function(e) {
        document.getElementById('error-box').style.display = 'block';
        document.getElementById('error-box').innerHTML += e.reason + '<br>';
      });
    </script>
    
    <script type="module" crossorigin src="../../../frontend/assets/<?= $latestJs ?>"></script>
    <link rel="stylesheet" crossorigin href="../../../frontend/assets/<?= $latestCss ?>">
  </head>
  <body>
    <div id="error-box"></div>
    <div id="root"></div>
  </body>
</html>
