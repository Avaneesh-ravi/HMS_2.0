<?php
require 'HMS_V2.2/backend/config/database.php';
$pdo = getDBConnection();
$stmt = $pdo->query('DESCRIBE rating_question');
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
$stmt = $pdo->query('DESCRIBE feedback_form_rating_question');
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
$stmt = $pdo->query('SELECT * FROM rating_question');
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
$stmt = $pdo->query('SELECT * FROM feedback_form_rating_question');
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
