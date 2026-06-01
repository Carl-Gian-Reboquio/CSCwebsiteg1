<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");


if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "message" => "Method not allowed."]);
    exit();
}

require_once "../db_config.php";

$raw  = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "No data received."]);
    exit();
}

$exam_type       = $conn->real_escape_string($data["exam_type"]       ?? "");
$exam_date       = $conn->real_escape_string($data["exam_date"]       ?? "");
$exam_region     = $conn->real_escape_string($data["exam_region"]     ?? "");
$exam_venue      = $conn->real_escape_string($data["exam_venue"]      ?? "");

$last_name       = $conn->real_escape_string($data["last_name"]       ?? "");
$first_name      = $conn->real_escape_string($data["first_name"]      ?? "");
$middle_name     = $conn->real_escape_string($data["middle_name"]     ?? "");
$suffix          = $conn->real_escape_string($data["suffix"]          ?? "");
$birthdate       = $conn->real_escape_string($data["birthdate"]       ?? "");
$gender          = $conn->real_escape_string($data["gender"]          ?? "");
$civil_status    = $conn->real_escape_string($data["civil_status"]    ?? "");

$email           = $conn->real_escape_string($data["email"]           ?? "");
$contact_number  = $conn->real_escape_string($data["contact_number"]  ?? "");
$address         = $conn->real_escape_string($data["address"]         ?? "");

$education_level = $conn->real_escape_string($data["education_level"] ?? "");
$school_name     = $conn->real_escape_string($data["school_name"]     ?? "");

if (!$exam_type || !$exam_date || !$last_name || !$first_name || !$email) {
    echo json_encode(["success" => false, "message" => "Missing required fields."]);
    exit();
}

$application_no = "CSC-" . date("Y") . "-" . strtoupper(substr(md5(uniqid()), 0, 6));

$sql = "INSERT INTO applicants 
    (application_no, exam_type, exam_date, exam_region, exam_venue,
     last_name, first_name, middle_name, suffix,
     birthdate, gender, civil_status,
     email, contact_number, address,
     education_level, school_name)
VALUES
    ('$application_no', '$exam_type', '$exam_date', '$exam_region', '$exam_venue',
     '$last_name', '$first_name', '$middle_name', '$suffix',
     '$birthdate', '$gender', '$civil_status',
     '$email', '$contact_number', '$address',
     '$education_level', '$school_name')";

if ($conn->query($sql)) {
    echo json_encode([
        "success"        => true,
        "application_no" => $application_no,
        "message"        => "Application submitted successfully."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $conn->error
    ]);
}

$conn->close();
?>
