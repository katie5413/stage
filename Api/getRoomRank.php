<?php
session_start();
include('../pdoInc.php');

// getRoomRank
$findRoomRank = $dbh->prepare('SELECT stage_loginLog.roomID, stage_room.managerEmail, stage_room.roomName, stage_room.id as createTime, COUNT(*) as times FROM stage_loginLog LEFT JOIN stage_room ON stage_loginLog.roomID = stage_room.roomID GROUP BY stage_room.roomID ORDER BY stage_room.id DESC');
$findRoomRank->execute();

$res = array();
while ($rankItem = $findRoomRank->fetch(PDO::FETCH_ASSOC)) {

    $item = array();
    $item = array("id" => $rankItem['roomID'], "name" => $rankItem['roomName'], "managerEmail" => $rankItem['managerEmail'], "times" => $rankItem['times']);

    array_push($res, $item);
}

echo json_encode($res);
