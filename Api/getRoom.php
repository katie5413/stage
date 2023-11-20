

<?php
/* 20230505 改成進去房間才拿資料，節省載入時間，暫時不會用到這支 */

session_start();
include('../pdoInc.php');
$roomData = array();
$roomData = array("status" => '404');
if (isset($_POST['roomID'])) {

    // getRoomInfo
    $findRoom = $dbh->prepare('SELECT roomID, roomName FROM stage_room WHERE roomID = ?');
    $findRoom->execute(array($_POST['roomID']));
    if ($roomItem = $findRoom->fetch(PDO::FETCH_ASSOC)) {

        // getRoomInfo
        $findRoomMsg = $dbh->prepare('SELECT roomID, content FROM stage_message WHERE roomID = ?');
        $findRoomMsg->execute(array($_POST['roomID']));
        if ($msgItem = $findRoomMsg->fetch(PDO::FETCH_ASSOC)) {
            $_SESSION['roomMsg'] = $msgItem['content'];
        }

        // getMembers
        $findRoomMember = $dbh->prepare('SELECT * FROM stage_member WHERE roomID = ? ORDER BY id ASC');
        $findRoomMember->execute(array($_POST['roomID']));

        $roomMemberNumber = 0;
        $members = array();
        while ($memberItem = $findRoomMember->fetch(PDO::FETCH_ASSOC)) {

            $person = array();
            $person = array("id" => $memberItem['id'], "name" => $memberItem['name'], "img" => $memberItem['img']);

            array_push($members, $person);
            $roomMemberNumber++;
        }

        // getRoomQuestion
        $findRoomQuestion = $dbh->prepare('SELECT content FROM stage_question WHERE roomID = ? ');
        $findRoomQuestion->execute(array($_POST['roomID']));

        if ($questionItem = $findRoomQuestion->fetch(PDO::FETCH_ASSOC)) {
            $_SESSION['roomQuestion'] = $questionItem['content'];
        }

        $roomData = array("status" => 'success', "roomName" => $roomItem['roomName'], "roomMsg" => $msgItem['content'], "roomMember" => $members, "roomQuestion" => $questionItem['content']);

        // 有找到才會放到 SESSION
        $_SESSION['roomID'] = $_POST['roomID'];
        $_SESSION['roomName'] = $roomItem['roomName'];
        $_SESSION['roomImage'] = $images;
        $_SESSION['roomMemberNumber'] = $roomMemberNumber;
        $_SESSION['roomMember'] = $members;

        echo json_encode($roomData);
    } else {
        echo json_encode($roomData);
    }
} else {
    echo json_encode($roomData);
}
