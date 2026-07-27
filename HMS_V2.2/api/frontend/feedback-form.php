<?php
require_once '../backend/includes/functions.php';
require_once '../backend/config/database.php';

$hospital_id = (int)($_GET['hospital_id'] ?? 1);
$hospitalName = 'Healthcare Center';

if ($hospital_id > 0) {
    try {
        $pdo = getDBConnection();
        $stmt = $pdo->prepare("SELECT name FROM hospital WHERE hospital_id = ?");
        $stmt->execute([$hospital_id]);
        $name = $stmt->fetchColumn();
        if ($name) $hospitalName = $name;
    } catch (Exception $e) {}
}
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?= clean($hospitalName) ?> — Patient Feedback Form</title>
    <meta name="description" content="Streamline patient feedback collection with an intuitive, bilingual form that enhances hospital service evaluation and improves patient experience." />
    <meta name="robots" content="noindex, nofollow" />
    <style>html, body { height: 100%; margin: 0; } #root { height: 100%; }</style>
    
    <script type="module" crossorigin src="./assets/index-dyLmuNy2.js"></script>
    <link rel="stylesheet" crossorigin href="./assets/index-CQN_0eQV.css">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
