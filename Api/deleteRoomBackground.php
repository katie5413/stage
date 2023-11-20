<?php
session_start();
include('../pdoInc.php');

$result = array();
$result = array("status" => "404");

// 檢查是否有代碼
if (isset($_POST['id']) && isset($_POST['roomID']) && $_SESSION['roomOwner'] === $_POST['roomID']) {
    $roomID = $_POST['roomID'];

    $deleteBackground = $dbh->prepare('DELETE FROM stage_background WHERE id=? and roomID=?');
    $deleteBackground->execute(array($_POST['id'], $roomID));


    $result = array("status" => "success", "id" => $_POST['id']);
}

echo json_encode($result);
