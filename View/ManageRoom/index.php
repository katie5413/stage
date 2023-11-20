<?php
session_start();
include "../../pdoInc.php";
?>

<html>

<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <link rel="stylesheet" type="text/css" href="../../Common/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/2.0.0-alpha.2/cropper.css" integrity="sha512-5ZQRy5L3cl4XTtZvjaJRucHRPKaKebtkvCWR/gbYdKH67km1e18C1huhdAc0wSnyMwZLiO7nEa534naJrH6R/Q==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/2.0.0-alpha.2/cropper.min.css" integrity="sha512-6QxSiaKfNSQmmqwqpTNyhHErr+Bbm8u8HHSiinMEz0uimy9nu7lc/2NaXJiUJj2y4BApd5vgDjSHyLzC8nP6Ng==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" type="text/css" href="../../Components/Avatar/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="../../Components/BackgroundItem/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="../../Components/Button/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="../../Components/Pop/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="../../Components/DropBox/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="../../Components/MessageItem/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="../../Components/QuestionItem/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="../../Components/Input/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="../../Components/ErrorMsg/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="../../Components/GalleryItem/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="../../Components/Modal/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="../../Components/Loading/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="index.css?v=<?php echo time(); ?>">
    <!-- Google Tag Manager -->
    <script>
        (function(w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({
                'gtm.start': new Date().getTime(),
                event: 'gtm.js'
            });
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src =
                'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', 'GTM-K7S8TL9');
    </script>
    <!-- End Google Tag Manager -->
    <title>舞台｜管理</title>
</head>

<body>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-K7S8TL9" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    <div id="loaderWrapper" class="active" type="init">
        <div class="loader"></div>
        <div class="text init">
            初始化中，請稍等
        </div>
        <div class="text success">
            儲存成功
        </div>
    </div>
    <div class="bg">

        <div class="header">
            <div class="roomName active form__input">
                <h3># <span id="roomID"><?php echo $_SESSION['roomOwner'] ?></span></h3>
                <input id="changeRoomName" name="roomName" value="<?php echo $_SESSION['roomName'] ?>" />
            </div>
        </div>

        <div id="manageMember" class="manageTitle">
            <h3>舞台管理</h3>
            <div class="buttons">
                <button id="share" class="button button-hollow">複製連結</button>
                <button id="watch" class="button button-hollow">檢視模式</button>
                <button id="saveContent" class="button button-fill">儲存</button>
            </div>
        </div>
        <p>註：圖片不可大於 800KB </p>

        <div id="manageBackground" class="manageTitle">
            <h3>舞台背景</h3>
        </div>
        <p>註：圖片比例為 4:3 </p>

        <div id="backgroundArea" class="area imageManage">
            <div class="buttons">
                <button id="addBackground" class="btn"><img src="../../Images/icon/add.svg" /></button>
            </div>
            <div class="backgrounds imageList"></div>
        </div>

        <div id="manageMember" class="manageTitle">
            <h3>舞台成員(<?php echo $_SESSION['roomMemberNumber'] ?>)</h3>
        </div>
        <p>註：最多四位</p>

        <div id="memberArea" class="area imageManage">
            <div class="buttons">
                <button id="addMember" class="btn"><img src="../../Images/icon/add.svg" /></button>
            </div>
            <div class="members imageList"></div>
        </div>

        <div class="previewMember">
            <h3>預覽成員位置</h3>

        </div>

        <div id="manageContent" class="manageTitle">
            <h3 id="contentDisplayArea" class="toggleExpand">內容<span><img src="../../Images/icon/arrowRight.svg" alt="icon" class="icon"></span></h3>
        </div>

        <div id="messageArea" class="area contentForm">
            <div id="message" class="form"></div>
            <div id="addMsg" content-type="text">
                <div class="selectCharacter contentSelect">
                    <div class="form__input">
                        <div class="drop__container">
                            <input id="selectMsgCharacter" name="msgCharacter" class="select-selected" type="text" placeholder="角色" autocomplete="off" value="" select-id="" />
                            <img src="../../Images/icon/arrowRight.svg" alt="icon" class="icon">
                            <div class="line"></div>
                            <div class="select-items">
                                <?php
                                $sth = $dbh->prepare('SELECT id, name FROM stage_member WHERE roomID=?');
                                $sth->execute(array($_SESSION['roomOwner']));
                                while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
                                    echo '<div class="option" value=' . $row['id'] . '>' . $row['name'] . '</div>';
                                }
                                ?>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="selectBackground contentSelect">
                    <div class="form__input">
                        <div class="drop__container">
                            <input id="selectMsgBackground" name="msgBackground" class="select-selected" type="text" placeholder="場景" autocomplete="off" value="" select-id="" />
                            <img src="../../Images/icon/arrowRight.svg" alt="icon" class="icon">
                            <div class="line"></div>
                            <div class="select-items">
                                <?php
                                $sth = $dbh->prepare('SELECT id, name FROM stage_background WHERE roomID=?');
                                $sth->execute(array($_SESSION['roomOwner']));
                                while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
                                    echo '<div class="option" value=' . $row['id'] . '>' . $row['name'] . '</div>';
                                }
                                ?>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="selectType form__input drop">
                    <div class="drop__container">
                        <input class="select-selected newContentTypeOption" type="text" placeholder="內容類型" autocomplete="off" value="" select-id="" />
                        <img src="../../Images/icon/arrowRight.svg" alt="icon" class="icon">
                        <img src="../../Images/icon/clear.svg" alt="icon" class="drop__clear" />
                        <div class="line"></div>
                        <div class="select-items">
                            <div class="option" value="text">文字</div>
                            <div class="option" value="image">圖片</div>
                            <div class="option" value="link">連結</div>
                        </div>
                    </div>
                </div>
                <div class="textForm">
                    <div class="form__input newMsg text">
                        <input class="input" type="text" name="newMsg" placeholder="請輸入對話" />
                    </div>
                </div>
                <div class="linkForm">
                    <div class="form__input newMsg link">
                        <input class="input" type="text" name="newLink" placeholder="請輸入連結" />
                    </div>
                </div>
                <div class="imageForm">
                    <div class="default">
                        <img class="openGalleryModal image" src="../../Images/icon/upload.svg" alt="image" />

                    </div>
                    <div class="upload">
                        <img class="openGalleryModal image" src="../../Images/icon/upload.svg" alt="image" />

                    </div>
                </div>
                <button id="addMsgContent" type="submit" class="button button-fill"><img src="../../Images/icon/send.svg" alt="send" class="icon"></button>
            </div>
        </div>

        <div id="manageQuestion" class="manageTitle">
            <h3 id="questionDisplayArea" class="toggleExpand">題目<span><img src="../../Images/icon/arrowRight.svg" alt="icon" class="icon"></span></h3>
        </div>
        <div id="questionArea" class="area contentForm">
            <div id="question" class="form"></div>
            <div class="addQuestion">
                <!-- 自訂題號 -->
                <div class="form__input">
                    <input id="newQuestionIndexName" class="input" type="text" name="newQuestionIndexName" placeholder="題號" />
                </div>
                <div class="form__input">
                    <input id="newQuestionContent" class="input" type="text" name="newQuestion" placeholder="所有選項，至少兩個，且用半形逗號分隔（選項一,選項二）" />
                </div>
                <div class="selectAnswer">
                    <div class="form__input">
                        <div class="drop__container">
                            <input id="newQuestionContentAnswer" name="newQuestionContentAnswer" class="select-selected" type="text" placeholder="答案" autocomplete="off" value="" select-id="" />
                            <img src="../../Images/icon/arrowRight.svg" alt="icon" class="icon">
                            <div class="line"></div>
                            <div class="select-items"></div>
                        </div>
                    </div>
                </div>
                <button id="addQuestionContent" type="submit" class="button button-fill"><img src="../../Images/icon/send.svg" alt="send" class="icon"></button>
            </div>
        </div>

    </div>
    <div id="imageTab" class="pop close" image-status="init">
        <div class="inner">
            <div class="top">
                <div class="title">
                    <img class="header__icon" src="../../Images/icon/member.svg" alt="icon">
                    <span class="action"></span>
                    <span class="target"></span>
                </div>
                <div class="close">
                    <img src="../../Images/icon/close.svg" alt="close" />
                </div>
            </div>
            <div class="content">
                <div class="form__input member_name">
                    <div class="title">
                        <div><span class="target"></span>名稱</div>
                    </div>
                    <input class="input" id="imageName" type="text" name="member_name" placeholder="請輸入名稱" />
                </div>

                <input type="file" name="upload_member_img" id="upload_member_img" accept=".jpg, .jpeg, .png, .svg" hidden />
                <label for="upload_member_img">
                    <div id="member__img_area" class="uploadImgArea img">
                        <img class="member_submit image_submit" src="../../Images/icon/upload.svg" alt="member_submit" />
                    </div>
                </label>
                <div id="result" class="cropImageResult"></div>
            </div>

            <div class="errorMsg">
                <img class="icon" src="../../Images/icon/error.svg" alt="error" />
                <span class="text">errorText</span>
            </div>

            <div class="buttons">
                <div class="function-button">
                    <button id="delete_image" type="submit" class="button button-pink delete_button">刪除</button>
                    <button class="button button-hollow reUpload_button">重新上傳</button>
                </div>
                <div class="function-button">
                    <button class="button button-hollow crop_button">裁切</button>

                    <button type="submit" class="button button-fill modalConfirm">確定</button>
                </div>
            </div>
        </div>
    </div>
    <div id="galleryModal" class="modal cropImageModal" action-type="" image-status="init">
        <div class="modalWrapper">
            <div class="content">
                <div class="top">
                    <img class="icon" src="../../Images/icon/edit-white.svg" />
                    <div class="title">標題</div>
                </div>
                <div class="middle">
                    <input type="file" name="upload_gallery_img" id="upload_gallery_img" accept=".jpg, .jpeg, .png, .svg" hidden />
                    <label for="upload_gallery_img">
                        <div class="img uploadImgArea">
                            <img class="image_submit" src="../../Images/icon/upload.svg" alt="image_submit" />
                        </div>
                    </label>
                    <div class="cropImageResult"></div>
                </div>
                <div class="errorMsg">
                    <img class="icon" src="../../Images/icon/error.svg" alt="error" />
                    <span class="text">errorText</span>
                </div>
                <div class="bottom">
                    <div class="function-button">
                        <button type="submit" class="button button-pink delete_button">刪除圖片</button>
                        <button class="button button-hollow reUpload_button">重新上傳</button>
                    </div>
                    <div class="function-button">
                        <button class="button button-hollow crop_button">裁切</button>
                    </div>
                    <div class="buttonGroup">
                        <button class="button button-hollow modalCancel">
                            取消
                        </button>
                        <button class="button button-fill modalConfirm">確認</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- <div id="addMsgModal" class="modal" action-type="add" content-type="text">
        <div class="modalWrapper">
            <div class="content">
                <div class="top">
                    <img class="icon" src="../../Images/icon/edit-white.svg" />
                    <div class="title">標題</div>
                </div>
                <div class="middle">
                    <div class="selectCharacter">
                        <div class="form__input">
                            <div class="title">角色<span class="mustFillLabel">必填</span></div>
                            <div class="drop__container">
                                <input class="select-selected" type="text" placeholder="請選擇角色" autocomplete="off" value="" select-id="" />
                                <img src="../../Images/icon/arrowRight.svg" alt="icon" class="icon">
                                <div class="line"></div>
                                <div class="select-items"></div>
                            </div>
                        </div>
                    </div>
                    <div class="textForm">
                        <div class="form__input newMsg text">
                            <div class="title">對話<span class="mustFillLabel">必填</span></div>
                            <input class="input" type="text" name="newMsg" placeholder="請輸入對話" />
                        </div>
                    </div>
                    <div class="linkForm">
                        <div class="form__input newMsg link">
                            <div class="title">連結<span class="mustFillLabel">必填</span></div>
                            <input class="input" type="text" name="newLink" placeholder="請輸入連結" />
                        </div>
                    </div>
                    <div class="imageForm">
                        <div class="form__input newMsg">
                            <div class="title">圖片<span class="mustFillLabel">必填</span></div>
                            <div class="drop__container">
                                <input class="select-selected" type="text" placeholder="請選擇圖片" autocomplete="off" value="" select-id="" />
                                <img src="../../Images/icon/arrowRight.svg" alt="icon" class="icon">
                                <div class="line"></div>
                                <div class="select-items">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="errorMsg">
                    <img class="icon" src="../../Images/icon/error.svg" alt="error" />
                    <span class="text">errorText</span>
                </div>
                <div class="bottom">
                    <div class="buttonGroup">
                        <button class="button button-hollow modalCancel">
                            取消
                        </button>
                        <button class="button button-fill modalConfirm">確認</button>
                    </div>
                </div>
            </div>
        </div>
    </div> -->
    <script src="../../Common/util.js"></script>
    <script src="../../Common/global.js"></script>
    <script src="../../Dependencies/jquery/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/2.0.0-alpha.2/cropper.min.js" integrity="sha512-IlZV3863HqEgMeFLVllRjbNOoh8uVj0kgx0aYxgt4rdBABTZCl/h5MfshHD9BrnVs6Rs9yNN7kUQpzhcLkNmHw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/2.0.0-alpha.2/cropper.js" integrity="sha512-witv14AEvG3RlvqCAtVxAqply8BjTpbWaWheEZqOohL5pxLq3AtIwrihgz7SsxihwAZkhUixj171yQCZsUG8kw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="../../Components/Avatar/index.js?v=<?php echo time(); ?>"></script>
    <script src="../../Components/BackgroundItem/index.js?v=<?php echo time(); ?>"></script>
    <script src="../../Components/Pop/index.js?v=<?php echo time(); ?>"></script>
    <script src="../../Components/DropBox/index.js?v=<?php echo time(); ?>"></script>
    <script src="../../Components/Input/index.js?v=<?php echo time(); ?>"></script>
    <script src="../../Components/MessageItem/index.js?v=<?php echo time(); ?>"></script>
    <script src="../../Components/QuestionItem/index.js?v=<?php echo time(); ?>"></script>
    <script src="../../Components/ErrorMsg/index.js?v=<?php echo time(); ?>"></script>
    <script src="../../Components/GalleryItem/index.js?v=<?php echo time(); ?>"></script>
    <script src="../../Components/Modal/index.js?v=<?php echo time(); ?>"></script>
    <script src="../../Components/Loading/index.js?v=<?php echo time(); ?>"></script>
    <script src="index.js"></script>

</body>

</html>