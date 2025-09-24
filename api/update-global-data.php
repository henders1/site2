<?php
// update-global-data.php - Automatically updates global-data.js file
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get the posted data
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit();
}

// Validate admin password (change this!)
$adminPassword = 'admin123';
if (!isset($input['adminPassword']) || $input['adminPassword'] !== $adminPassword) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid admin password']);
    exit();
}

// Remove password from data before saving
unset($input['adminPassword']);

// Sanitize the data (escape quotes and backslashes)
function sanitizeForJS($value) {
    return addslashes(htmlspecialchars($value, ENT_QUOTES));
}

// Create the JavaScript file content
$jsContent = "// Global configuration file - automatically updated by admin
";
$jsContent .= "window.globalCardData = {
";
$jsContent .= "    image: "" . sanitizeForJS($input['image'] ?? '') . "",
";
$jsContent .= "    name: "" . sanitizeForJS($input['name'] ?? '') . "",
";
$jsContent .= "    surname: "" . sanitizeForJS($input['surname'] ?? '') . "",
";
$jsContent .= "    nationality: "" . sanitizeForJS($input['nationality'] ?? '') . "",
";
$jsContent .= "    familyName: "" . sanitizeForJS($input['familyName'] ?? '') . "",
";
$jsContent .= "    fathersFamilyName: "" . sanitizeForJS($input['fathersFamilyName'] ?? '') . "",
";
$jsContent .= "    mothersFamilyName: "" . sanitizeForJS($input['mothersFamilyName'] ?? '') . "",
";
$jsContent .= "    birthPlace: "" . sanitizeForJS($input['birthPlace'] ?? '') . "",
";
$jsContent .= "    countryOfBirth: "" . sanitizeForJS($input['countryOfBirth'] ?? '') . "",
";
$jsContent .= "    adress1: "" . sanitizeForJS($input['adress1'] ?? '') . "",
";
$jsContent .= "    adress2: "" . sanitizeForJS($input['adress2'] ?? '') . "",
";
$jsContent .= "    city: "" . sanitizeForJS($input['city'] ?? '') . "",
";
$jsContent .= "    mothersName: "" . sanitizeForJS($input['mothersName'] ?? '') . "",
";
$jsContent .= "    fathersName: "" . sanitizeForJS($input['fathersName'] ?? '') . "",
";
$jsContent .= "    givenDate: "" . sanitizeForJS($input['givenDate'] ?? '') . "",
";
$jsContent .= "    expiryDate: "" . sanitizeForJS($input['expiryDate'] ?? '') . "",
";
$jsContent .= "    seriesAndNumber: "" . sanitizeForJS($input['seriesAndNumber'] ?? '') . "",
";
$jsContent .= "    birthday: "" . sanitizeForJS($input['birthday'] ?? '') . "",
";
$jsContent .= "    sex: "" . sanitizeForJS($input['sex'] ?? '') . "",
";
$jsContent .= "    pesel: "" . sanitizeForJS($input['pesel'] ?? '') . "",
";
$jsContent .= "    adress: "" . sanitizeForJS($input['adress'] ?? '') . "",
";
$jsContent .= "    timestamp: "" . date('c') . ""
";
$jsContent .= "};";

// Try to write the file
$filename = 'global-data.js';
if (file_put_contents($filename, $jsContent) !== false) {
    echo json_encode([
        'success' => true, 
        'message' => 'Global data updated successfully!',
        'timestamp' => date('c')
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to write global-data.js file. Check file permissions.']);
}
?>