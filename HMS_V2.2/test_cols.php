<?php
require 'api/backend/config/database.php';
$pdo = getDBConnection();
$stmt = $pdo->query("SELECT column_name FROM information_schema.columns WHERE table_name = 'patient'");
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
