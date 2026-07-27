<?php
/**
 * get-hospitals.php
 * Fetch all active hospitals for the selection page
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';

header('Content-Type: application/json');

try {
    $pdo = getDBConnection();
    
    $query = "SELECT id, hospital_name, logo_path, address, contact_number FROM hospitals WHERE is_active = 1 ORDER BY hospital_name ASC";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $hospitals = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Transform the response
    $result = array_map(function($hospital) {
        return [
            'id' => (int)$hospital['id'],
            'name' => $hospital['hospital_name'],
            'logo' => $hospital['logo_path'],
            'address' => $hospital['address'],
            'contactNumber' => $hospital['contact_number']
        ];
    }, $hospitals);
    
    echo json_encode([
        'success' => true,
        'hospitals' => $result
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch hospitals: ' . $e->getMessage()
    ]);
}
