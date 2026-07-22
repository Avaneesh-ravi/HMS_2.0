<?php
$_GET['hospital_id'] = 1;
$_SESSION['admin_id'] = 1; // for ensureSession() if needed
require 'backend/ajax/get-questions.php';
