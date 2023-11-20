<?php
session_start();
include('../pdoInc.php');
$roomData = array();
$roomData = array("status" => '404');
if (isset($_POST['code']) && isset($_POST['password'])) {
    // getRoomInfo
    $findRoom = $dbh->prepare('SELECT * FROM stage_room WHERE roomID = ?');
    $findRoom->execute(array($_POST['code']));
    if ($roomItem = $findRoom->fetch(PDO::FETCH_ASSOC)) {

        // getRoomInfo
        $findRoomMsg = $dbh->prepare('SELECT roomID, content FROM stage_message WHERE roomID = ?');
        $findRoomMsg->execute(array($_POST['code']));
        if ($msgItem = $findRoomMsg->fetch(PDO::FETCH_ASSOC)) {
            $_SESSION['roomMsg'] = $msgItem['content'];
        }

        // 有找到才會放到 SESSION
        $_SESSION['roomID'] = $_POST['code'];
        $_SESSION['roomName'] = $roomItem['roomName'];

        // check owner
        $password = hash('sha256', $_POST['password']);
        if ($roomItem['roomPassword'] == $password) {
            $_SESSION['roomOwner'] = $_POST['code'];
            $roomData = array("status" => 'backstage', "roomName" => $roomItem['roomName']);
        } else {
            $roomData = array("status" => 'wrongPass', "roomName" => $roomItem['roomName']);
        }
    }
}

echo json_encode($roomData);
