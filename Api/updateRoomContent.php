<?php
session_start();
include('../pdoInc.php');

$roomContentData = array();
$roomContentData = array("status" => "404");

// 檢查是否有代碼
if (isset($_POST['content']) && isset($_POST['roomID'])) {
    $roomID = $_POST['roomID'];

    $updateRoomContent = $dbh->prepare('UPDATE stage_message SET content=? WHERE roomID=?');
    $updateRoomContent->execute(array($_POST['content'], $roomID));

    // getRoomInfo
    $findRoomMsg = $dbh->prepare('SELECT content FROM stage_message WHERE roomID = ?');
    $findRoomMsg->execute(array($roomID));
    if ($msgItem = $findRoomMsg->fetch(PDO::FETCH_ASSOC)) {
        $_SESSION['roomMsg'] = $_POST['content'];
    }

    $roomContentData = array("status" => "success", "roomMsg" => $_POST['content'], 'roomOwner' => $roomID);
}

echo json_encode($roomContentData);
