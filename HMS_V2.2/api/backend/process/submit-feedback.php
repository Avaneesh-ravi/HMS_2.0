<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect('../feedback-form.php');
}

$pdo = getDBConnection();

// Combine first and last name if present
if (isset($_POST['first_name']) && isset($_POST['last_name'])) {
    $_POST['full_name'] = trim($_POST['first_name'] . ' ' . $_POST['last_name']);
}

// ---- Basic server-side validation ----
$errors = [];
foreach (['uhid', 'full_name', 'age', 'gender', 'mobile_number', 'visit_type'] as $req) {
    if (empty($_POST[$req])) {
        $errors[] = ucfirst(str_replace('_', ' ', $req)) . ' is required.';
    }
}
if (empty($_POST['signature_confirmed'])) {
    $errors[] = 'Please confirm the declaration checkbox before submitting.';
}

if (!empty($errors)) {
    // In production, redirect back with flash-messages; kept simple here.
    die('<h3>Please correct the following and go back:</h3><ul><li>' . implode('</li><li>', array_map('clean', $errors)) . '</li></ul><a href="../feedback-form.php">&larr; Back to form</a>');
}

try {
    $pdo->beginTransaction();

    $patientData = [
        'hospital_id'      => (int)($_POST['hospital_id'] ?? 1),
        'feedback_form_id' => (int)($_POST['feedback_form_id'] ?? 1),
        'uhid'             => clean($_POST['uhid']),
        'full_name'        => clean($_POST['full_name']),
        'age'              => (int) $_POST['age'],
        'gender'           => clean($_POST['gender']),
        'mobile_number'    => clean($_POST['mobile_number']),
        'email'            => $_POST['email'] ?? '',
        'address'          => $_POST['address'] ?? '',
        'pincode'          => $_POST['pincode'] ?? '',
        'city'             => $_POST['city'] ?? '',
        'state'            => $_POST['state'] ?? 'Tamil Nadu',
        'country'          => $_POST['country'] ?? 'India',
        'visit_type'       => clean($_POST['visit_type']),
        'visit_uhid'       => $_POST['visit_uhid'] ?? '',
        'admission_date'   => $_POST['admission_date'] ?? '',
        'discharge_date'   => $_POST['discharge_date'] ?? '',
    ];
    $patientId = insertPatient($pdo, $patientData);

    // Dynamic Mapping for Ratings
    $ratings = [];
    $categoryMap = [
        'rating_reception' => 'Reception Experience',
        'rating_admission' => 'Admission Process',
        'rating_billing'   => 'Billing Services',
        'rating_doctor'    => 'Doctor Treatment',
        'rating_nursing'   => 'Nursing Care',
        'rating_pharmacy'  => 'Pharmacy',
        'rating_lab_scan'  => 'Lab & Scan Services',
        'rating_insurance' => 'Insurance',
        'rating_food'      => 'Food Services',
        'rating_physiotherapy' => 'Physiotherapy',
        'rating_blood_bank' => 'Blood Bank',
        'rating_cleanliness' => 'Cleanliness',
        'rating_overall'   => 'Overall Experience'
    ];

    foreach ($categoryMap as $postKey => $questionText) {
        if (!empty($_POST[$postKey])) {
            $stmt = $pdo->prepare("SELECT question_id FROM rating_question WHERE question_text_en = ? LIMIT 1");
            $stmt->execute([$questionText]);
            $qId = $stmt->fetchColumn();
            if (!$qId) {
                $pdo->prepare("INSERT INTO rating_question (question_text_en) VALUES (?)")->execute([$questionText]);
                $qId = $pdo->lastInsertId();
            }
            $ratings[$qId] = (int)$_POST[$postKey];
        }
    }

    // Also support dynamically passed question IDs
    foreach ($_POST as $postKey => $value) {
        if (strpos($postKey, 'rating_q_') === 0 && !empty($value)) {
            $qId = (int)str_replace('rating_q_', '', $postKey);
            if ($qId > 0) {
                $ratings[$qId] = (int)$value;
            }
        }
    }
    
    // Dynamic Mapping for Yes/No
    $yesno = [];
    $ynMap = [
        'cleanliness_issue' => ['text' => 'Is there any cleanliness issue?', 'remarks' => $_POST['cleanliness_issue_text'] ?? ''],
        'cost_explained'    => ['text' => 'Was the cost explained at the time of admission?', 'remarks' => $_POST['cost_issue_text'] ?? ''],
        'would_recommend'   => ['text' => 'Would you recommend our hospital?', 'remarks' => $_POST['recommend_reason_text'] ?? '']
    ];

    foreach ($ynMap as $postKey => $ynData) {
        if (isset($_POST[$postKey])) {
            $stmt = $pdo->prepare("SELECT yesno_question_id FROM yesno_question WHERE question_en = ? LIMIT 1");
            $stmt->execute([$ynData['text']]);
            $ynId = $stmt->fetchColumn();
            if (!$ynId) {
                $pdo->prepare("INSERT INTO yesno_question (question_en) VALUES (?)")->execute([$ynData['text']]);
                $ynId = $pdo->lastInsertId();
            }
            $yesno[$ynId] = [
                'answer'  => $_POST[$postKey],
                'remarks' => $ynData['remarks']
            ];
        }
    }

    // Also support dynamically passed yes/no questions
    foreach ($_POST as $postKey => $value) {
        if (strpos($postKey, 'yesno_q_') === 0 && isset($value) && strpos($postKey, '_text') === false) {
            $ynId = (int)str_replace('yesno_q_', '', $postKey);
            if ($ynId > 0) {
                $remarks = $_POST['yesno_q_' . $ynId . '_text'] ?? '';
                $yesno[$ynId] = [
                    'answer'  => $value,
                    'remarks' => $remarks
                ];
            }
        }
    }

    $feedbackData = $_POST;
    $feedbackData['ratings'] = $ratings;
    $feedbackData['yesno'] = $yesno;

    insertFeedbackSubmission($pdo, $patientId, $feedbackData);

    $pdo->commit();
} catch (Exception $e) {
    $pdo->rollBack();
    die('Something went wrong while saving your feedback. Please try again. (' . $e->getMessage() . ')');
}

redirect('../../frontend/thank-you.php');
