<?php
require 'backend/config/database.php';
$pdo = getDBConnection();
$stmt = $pdo->query('SHOW COLUMNS FROM feedback_form');
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));

$stmt2 = $pdo->query('SELECT * FROM feedback_form WHERE hospital_id = 1');
print_r($stmt2->fetchAll(PDO::FETCH_ASSOC));
?>
