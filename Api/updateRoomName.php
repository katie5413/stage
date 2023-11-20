<?php
session_start();
include('../pdoInc.php');

$roomData = array();
$roomData = array("status" => "404");

// 檢查是否有代碼
if (isset($_POST['name']) && isset($_POST['roomID'])) {

    $updateRoom = $dbh->prepare('UPDATE stage_room SET  roomName=? WHERE roomID=?');
    $updateRoom->execute(array($_POST['name'], $_POST['roomID']));

    // 更新資料
    $_SESSION['roomName'] = $_POST['name'];

    $roomData = array("status" => "success", "name" => $_POST['name']);

}

echo json_encode($roomData);
