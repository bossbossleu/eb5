<?php
header("Access-Control-Allow-Origin: *"); // Allow all origins (adjust as needed)
header("Content-Type: application/json");

$fileId = $_GET['fileId']; // Get the fileId from the URL query parameter

try {
    // Construct the Google Drive file URL
    $fileURL = "https://drive.google.com/uc?id=" . $fileId;

    // Fetch the data
    $data = file_get_contents($fileURL);

    // Output the fetched data as JSON
    echo $data;
} catch (Exception $e) {
    // Handle exceptions and log errors
    echo json_encode(array('error' => $e->getMessage()));
}
?>
