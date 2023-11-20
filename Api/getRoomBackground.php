<?php
session_start();
include('../pdoInc.php');
if (isset($_POST['roomID'])) {
    $roomID = $_POST['roomID'];
    // getBackground
    $findRoomBackground = $dbh->prepare('SELECT * FROM stage_background WHERE roomID = ? ORDER BY id ASC');
    $findRoomBackground->execute(array($roomID));

    $backgrounds = array();
    while ($backgroundItem = $findRoomBackground->fetch(PDO::FETCH_ASSOC)) {

        $data = array();
        $data = array("id" => $backgroundItem['id'], "name" => $backgroundItem['name'], "img" => $backgroundItem['img']);

        array_push($backgrounds, $data);
    }

    echo json_encode($backgrounds);
} else {
    echo null;
}
