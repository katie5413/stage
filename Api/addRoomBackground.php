<?php
session_start();
include('../pdoInc.php');

$res = array();
$res = array("status" => "404");

// 檢查是否有代碼
if (isset($_POST['name']) && isset($_POST['img']) && isset($_POST['roomID'])) {
    $roomID = $_POST['roomID'];
    // 有 id 就是 update
    if (isset($_POST['id'])) {
        $updateBackground = $dbh->prepare('UPDATE stage_background SET  name=?,img = ? WHERE id=? AND roomID=?');
        $updateBackground->execute(array($_POST['name'], $_POST['img'], $_POST['id'], $roomID));
    } else {
        $addBackground = $dbh->prepare('INSERT INTO stage_background (roomID, name, img ) VALUES (?, ?, ?)');
        $addBackground->execute(array($roomID, $_POST['name'], $_POST['img']));
    }

    $res = array("status" => "success", "name" => $_POST['name']);
}

echo json_encode($res);
