<?php
require 'HMS_V2.2/backend/config/database.php';
$pdo = getDBConnection();
$stmt = $pdo->query('SHOW TABLES');
print_r($stmt->fetchAll(PDO::FETCH_COLUMN));
$stmt = $pdo->query('DESCRIBE question');
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
$stmt = $pdo->query('DESCRIBE yesno_question');
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
