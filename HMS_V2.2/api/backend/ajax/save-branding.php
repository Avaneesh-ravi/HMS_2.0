<?php
require_once '../config/database.php';
require_once '../includes/functions.php';
ensureSession();
ob_start();

header('Content-Type: application/json');

if (empty($_SESSION['admin_id'])) {
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

try {
    $pdo = getDBConnection();
    $hospitalId = (int)($_SESSION['hospital_id'] ?? 0);

    if ($hospitalId === 0) {
        // Super admin trying to save global branding? Or maybe super admin cannot save?
        echo json_encode(['success' => false, 'message' => 'Super admin cannot modify hospital branding globally here. Select a specific hospital first.']);
        exit;
    }

    $hospitalName = $_POST['hospitalName'] ?? '';
    $address = $_POST['address'] ?? '';
    $contactNumber = $_POST['contactNumber'] ?? '';
    $email = $_POST['email'] ?? '';
    $logoData = $_POST['logo'] ?? '';
    
    $updateQuery = "UPDATE hospital SET name = :name, address1 = :address, mobile = :phone, email = :email";
    $params = [
        ':name' => $hospitalName,
        ':address' => $address,
        ':phone' => $contactNumber,
        ':email' => $email,
        ':id' => $hospitalId
    ];

    if (!empty($logoData) && strpos($logoData, 'data:image/') === 0) {
        list($type, $logoData) = explode(';', $logoData);
        list(, $logoData)      = explode(',', $logoData);
        $logoData = base64_decode($logoData);
        
        // determine extension
        $ext = 'png';
        if (strpos($type, 'jpeg') !== false) $ext = 'jpg';
        else if (strpos($type, 'gif') !== false) $ext = 'gif';
        else if (strpos($type, 'svg') !== false) $ext = 'svg';

        $filename = 'logo_' . $hospitalId . '_' . time() . '.' . $ext;
        $uploadPath = __DIR__ . '/../uploads/' . $filename;
        
        if (!is_dir(__DIR__ . '/../uploads/')) {
            mkdir(__DIR__ . '/../uploads/', 0777, true);
        }
        file_put_contents($uploadPath, $logoData);
        
        $updateQuery .= ", logo = :logo";
        $params[':logo'] = $filename;
    }

    $updateQuery .= " WHERE hospital_id = :id";
    $stmt = $pdo->prepare($updateQuery);
    $stmt->execute($params);

    ob_clean();
    echo json_encode(['success' => true, 'message' => 'Branding settings updated successfully']);

} catch (Exception $e) {
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
