<?php
session_start();
include('../pdoInc.php');

$newMemberData = array();
$newMemberData = array("status" => "404");

// 檢查是否有代碼
if (isset($_POST['id']) && isset($_POST['roomID'])&& $_SESSION['roomOwner'] === $_POST['roomID']) {
    $roomID = $_POST['roomID'];

    $deleteMember = $dbh->prepare('DELETE FROM stage_member WHERE id=? and roomID=?');
    $deleteMember->execute(array($_POST['id'], $roomID));


    $newMemberData = array("status" => "success", "id" => $_POST['id']);

    // getMembers
    $findRoomMember = $dbh->prepare('SELECT * FROM stage_member WHERE roomID = ? ORDER BY id ASC');
    $findRoomMember->execute(array($roomID));

    $members = array();
    while ($memberItem = $findRoomMember->fetch(PDO::FETCH_ASSOC)) {

        $person = array();
        $person = array("id" => $memberItem['id'], "name" => $memberItem['name'], "img" => $memberItem['img']);

        array_push($members, $person);
    }

    // 更新資料
    $_SESSION['roomMember'] = $members;
}

echo json_encode($newMemberData);
