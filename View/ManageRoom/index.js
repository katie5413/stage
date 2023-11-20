$(document).ready(function () {
    const roomID = document.getElementById("roomID").textContent;
    let backgrounds = [];
    let members = [];
    let message = [];
    let question = [];
    activeLoading("init");

    // 房間名
    $(".roomName.form__input").click(function () {
        $(this).addClass("edit");
    });

    $("#changeRoomName").blur(function () {
        $(".roomName.form__input.edit").removeClass("edit");
    });

    const initRoomName = $("#changeRoomName").val();

    const changeRoomName = () => {
        $.ajax({
            type: "POST",
            url: `../../Api/updateRoomName.php`,
            data: {
                name: $("#changeRoomName").val(),
                roomID,
            },
            dataType: "json",
            success: function (data) {
                console.log("editRoomName", data);
            },
        });
    };

    // 改房間名
    $(document).click(function (e) {
        if (
            $(".roomName.form__input") !== e.target &&
            !$(".roomName.form__input").has(e.target).length
        ) {
            $(".roomName.form__input").removeClass("edit");
            if (initRoomName !== $("#changeRoomName").val()) {
                changeRoomName();
            }
        }
    });


    // 背景圖
    const fetchRoomBackgroundStatus = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: `../../Api/getRoomBackground.php`,
                dataType: 'json',
                data: {
                    roomID,
                },
                success: function (backgroundData) {
                    backgrounds = backgroundData;
                    console.log('載入背景圖成功');
                    resolve(true);
                },
                fail: function (xhr, ajaxOptions, thrownError) {
                    console.log('載入背景圖失敗');
                    reject(false);
                },
            });
        });
    };

    // 成員名單
    const fetchRoomMemberStatus = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: `../../Api/getRoomMember.php`,
                dataType: 'json',
                data: {
                    roomID,
                },
                success: function (memberData) {
                    members = memberData;
                    console.log('載入成員成功');
                    resolve(true);
                },
                fail: function (xhr, ajaxOptions, thrownError) {
                    console.log('載入成員失敗');
                    reject(false);
                },
            });
        });
    };

    // 對話
    const fetchRoomMsgStatus = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: `../../Api/getRoomMsg.php`,
                dataType: "json",
                data: {
                    roomID,
                },
                success: function (msgData) {
                    const messageData = JSON.parse(msgData);

                    // 創建時沒有內容，會是 null ，因此會報錯
                    if (messageData != null) {
                        messageData.forEach((msg) => {
                            message.push(msg);
                        });
                        message = messageData;
                    }

                    console.log("載入對話成功");
                    resolve(true);
                },
                fail: function (xhr, ajaxOptions, thrownError) {
                    console.log("載入對話失敗");
                    reject(false);
                },
            });
        });
    };

    // 問題
    const fetchRoomQuestionStatus = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: `../../Api/getRoomQuestion.php`,
                dataType: "json",
                data: {
                    roomID,
                },
                success: function (data) {
                    const questionData = JSON.parse(data);
                    if (questionData != null) {
                        questionData.forEach((questionItem) => {
                            question.push(questionItem);
                        });
                    }

                    console.log("載入題目成功");
                    resolve(true);
                },
                fail: function (xhr, ajaxOptions, thrownError) {
                    console.log("載入題目失敗");
                    reject(false);
                },
            });
        });
    };

    (async function () {
        try {
            let getBackgroundDone = await fetchRoomBackgroundStatus();
            let getMemberDone = await fetchRoomMemberStatus();
            let getMsgDone = await fetchRoomMsgStatus();
            let getQuestionDone = await fetchRoomQuestionStatus();

            if (getBackgroundDone) {
                console.log('backgrounds', backgrounds);
                $('.backgrounds').children().remove();

                if (backgrounds.length == 0) {
                    $('#backgroundArea').removeClass('active');
                } else {
                    $('#backgroundArea').addClass('active');
                    backgrounds.forEach((item) => {
                        $('.backgrounds').append(
                            generateBackgroundItem({
                                id: item.id,
                                img: item.img,
                                name: item.name,
                            }),
                        );
                    });
                }
            }

            if (getMemberDone) {
                console.log('members', members);
                // Member
                $('.members').children().remove();

                if (members.length == 0) {
                    $('#memberArea').removeClass('active');
                } else {
                    $('#memberArea').addClass('active');
                    members.forEach((item) => {
                        $('.members').append(
                            generateAvatar({
                                id: item.id,
                                img: item.img,
                                name: item.name,
                            }),
                        );
                    });

                    // 最多四位
                    if (members.length == 4) {
                        $('#memberArea .buttons').hide()
                    }
                }
            }

            // 共用 imageTab
            if (getBackgroundDone && getMemberDone) {
                activeImageList();
            }

            if (getMsgDone) {
                console.log("msg", message);
                // message
                if (message != null) {
                    message.map((item, index) => {
                        let msgOwner = members.filter((person) => person.id == item.who)[0];

                        let stage = backgrounds.filter((stage) => stage.id == item.background)[0];

                        const typeText = {
                            undefined: "文字",
                            null: "文字",
                            text: "文字",
                            image: "圖片",
                            link: "連結",
                        };

                        item.type = item.type == null ? "text" : item.type;

                        $("#message").append(
                            generateMsgInputItem({
                                index: index + 1, // 0 塞不進去，所以要加 1
                                characterID: item.who,
                                characterName:
                                    item.who == -1 || msgOwner == null
                                        ? "沒有成員"
                                        : msgOwner.name,
                                backgroundID: item.background,
                                backgroundName: item.background == -1 || stage == null
                                ? "沒有場景"
                                : stage.name,
                                type: item.type,
                                typeText: typeText[item.type],
                                text: item.text,
                                imageSRC: item.imageSRC,
                                memberData: members,
                                backgroundData: backgrounds,
                            })
                        );

                        // 更改內容類型
                        $(
                            `.msgManageItem[data-id="${index + 1
                            }"] .form__input.drop[data-type="contentType"] .option`
                        ).on("click", function () {
                            $(this).closest(".msgManageItem").removeClass("text image link");
                            $(this).closest(".msgManageItem").addClass($(this).attr("value"));
                        });
                    });

                    activeGalleryItem();
                }

                // 註冊對話事件
                activeMsgItem();

                for (let i = 0; i < $(".msgCharacter").length; i++) {
                    if ($(".msgCharacter").eq(i).val() == "沒有成員") {
                        $(".msgCharacter").eq(i).addClass("alert");
                    }
                }
                // message done
            }

            // 問題
            if (getQuestionDone) {
                console.log("question", question);

                // qa
                if (question != null) {
                    question.map((item, index) => {
                        $("#question").append(
                            generateQuestionInputItem({
                                questionData: item.options, // ['選項一','選項二'...]
                                answerID: item.answerID,
                                questionIndex: item.indexName ? item.indexName : index + 1, // 題號
                            })
                        );
                    });

                    // 註冊刪除問題事件
                    activeDeleteQuestionItem();
                }
                //qa done
            }

            if (getMemberDone && getMsgDone && getQuestionDone) {
                init();
            }
        } catch (err) {
            console.log(err);
        }
    })();

    // 確定都有拿到資料

    const init = () => {
        closeLoading();
        console.log("載入完成");
    };

    $("#watch").on("click", function () {
        setTimeout(function () {
            window.open("../Main/index.php");
        }, 200);
    });

    $("#share").on("click", function () {
        let dummy = document.createElement("input"),
            text = window.location.href;

        document.body.appendChild(dummy);
        const shareLink = text
            .concat(`?roomCode=${roomID}`)
            .replace("ManageRoom", "Main");
        dummy.value = shareLink;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
        alert("複製成功！");
    });

    // toggleExpand
    $(".toggleExpand").click(function () {
        $(this).toggleClass("collapse");
    });

    $('#memberDisplayArea').click(function () {
        $('#memberArea').toggleClass('collapse');
    });

    $("#contentDisplayArea").click(function () {
        $("#messageArea").toggleClass("collapse");
    });

    $("#questionDisplayArea").click(function () {
        $("#questionArea").toggleClass("collapse");
    });

    // 圖片

    $('#addBackground').click(function () {
        openPop({ tab: $('#imageTab'), target: "background" });
    });

    // 角色
    $('#addMember').click(function () {
        openPop({ tab: $('#imageTab'), target: "member" });
    });

    $('#imageTab .modalConfirm').click(function () {
        const target = $('#imageTab').attr('target');
        const targetId = $('#imageTab').attr('targetId');
        const action = targetId ? "edit" : "add";
        const config = {
            member: {
                title: "成員",
                api: "../../Api/addRoomMember.php"
            },
            background: {
                title: "場景",
                api: "../../Api/addRoomBackground.php"
            },
        };
        const imageSRC = $("#imageTab").find(".croppedImg").attr("src");

        let valid = true;
        if ($('#imageName').val().trim().length == 0) {
            valid = false;
            showErrorMsg({
                target: $('#imageTab'),
                msg: `請輸入${config[target].title}名稱`,
            });
        }

        if (valid) {
            $.ajax({
                type: 'POST',
                url: config[target].api,
                data: {
                    id: targetId ? targetId : undefined,
                    name: $('#imageName').val(),
                    img: imageSRC,
                    roomID,
                },
                dataType: 'json',
                success: function (data) {
                    console.log(action, target, data);
                    closePop()
                    // 自動儲存後重整
                    $('#saveContent').click();
                },
                fail: function (jqXHR, textStatus, errorThrown) {
                    console.log(action, target, targetId, jqXHR, textStatus, errorThrown)
                }
            });

            // manageImageStep('submit');
        }
    });

    $('#imageTab .delete_button').click(function () {
        const target = $('#imageTab').attr('target');
        const targetId = $('#imageTab').attr('targetId');

        const config = {
            member: {
                api: "../../Api/deleteRoomMember.php"
            },
            background: {
                api: "../../Api/deleteRoomBackground.php"
            },
        };

        $.ajax({
            type: 'POST',
            url: config[target].api,
            data: {
                id: targetId,
                roomID,
            },
            dataType: 'json',
            success: function (data) {
                console.log('delete', target, data);
                // 自動儲存後重整
                $('#saveContent').click();

                // manageImageStep('submit');
            },
        });
    });

    function activeImageList() {
        $('.person').click(function () {
            let data = {
                id: $(this).attr('data-id'),
                img: $(this).find('.img').attr('src'),
                name: $(this).find('span.name').text(),
            };
            openPop({ tab: $('#imageTab'), data, target: "member" });
        });

        $('.backgroundItem').click(function () {
            let data = {
                id: $(this).attr('data-id'),
                img: $(this).find('.img').attr('src'),
                name: $(this).find('span.name').text(),
            };
            openPop({ tab: $('#imageTab'), data, target: "background" });
        });
    }

    // 角色 end

    // 處理上傳的圖片

    $("#upload_gallery_img").change(function () {
        let file = this.files[0];
        //用size属性判断文件大小不能超过800KB ，前端直接判断的好处，免去服务器的压力。
        if (file.size > 1 * 1024 * 800) {
            alert("圖片不可大於 800KB");
        } else {
            let reader = new FileReader();
            reader.onload = function () {
                // 通过 reader.result 来访问生成的 base64 DataURL
                let base64 = reader.result;
                $("#galleryModal")
                    .find(".cropImageResult")
                    .append(
                        `<img class="tmpUploadImg" src="${base64}" alt="uploadImage">`
                    );

                // switch status
                $("#galleryModal").attr("image-status", "upload");

                let image = $("#galleryModal").find(".tmpUploadImg")[0];
                let button = $("#galleryModal").find(".crop_button")[0];

                var cropper = new Cropper(image, {
                    ready: function (event) {
                        // Zoom the image to its natural size
                        // cropper.zoomTo(1);
                    },
                    crop: function (event) { },
                    zoom: function (event) {
                        // Keep the image in its natural size
                        if (event.detail.oldRatio === 1) {
                            event.preventDefault();
                        }
                    },
                });

                button.onclick = function () {
                    let croppedCanvas = cropper.getCroppedCanvas();

                    $("#galleryModal").find(".cropImageResult").children().remove();
                    $("#galleryModal")
                        .find(".cropImageResult")
                        .append(
                            `<img class="croppedImg" src="${croppedCanvas.toDataURL()}" alt="croppedImg" />`
                        );
                    // switch status
                    $("#galleryModal").attr("image-status", "crop");
                };
            };
            reader.readAsDataURL(file);
        }
    });

    // 重新上傳
    $("#galleryModal")
        .find(".reUpload_button")
        .click(function () {
            resetGalleryModal();
        });

    // 確認
    $("#galleryModal")
        .find(".modalConfirm")
        .on("click", function () {
            const actionType = $("#galleryModal").attr("action-type");
            let valid = true;
            const imageSRC = $("#galleryModal").find(".croppedImg").attr("src");
            const updateImageID = $("#galleryModal").attr("data-id");

            // 不用檢查是否上傳圖片，因為沒上傳圖片不會有按鈕

            if (valid) {
                switch (actionType) {
                    case "add":
                        $("#addMsg .imageForm").addClass("upload");
                        $("#addMsg .imageForm .upload img").attr("src", imageSRC);

                        break;
                    case "edit":
                        const targetID = $(this).closest(".msgManageItem").attr("data-id");
                        $(`.msgManageItem[data-id="${updateImageID}"]`)
                            .find(".openGalleryModal")
                            .attr("src", imageSRC);

                        break;
                }

                resetGalleryModal();
                closeModal();
                $("#galleryModal").removeAttr("data-id");
            }
        });

    // 取消
    $("#galleryModal")
        .find(".modalCancel")
        .on("click", function (e) {
            e.preventDefault();
            resetGalleryModal();
            closeModal();
            $("#galleryModal").removeAttr("data-id");
        });

    // 刪除
    // $('#galleryModal')
    //     .find('.delete_button')
    //     .on('click', function () {
    //         $.ajax({
    //             type: 'POST',
    //             url: `../../../Api/deleteRoomGallery.php`,
    //             data: {
    //                 id: $('#galleryModal').attr('data-id'),
    //             },
    //             dataType: 'json',
    //             success: function (data) {
    //                 console.log('delete', data);
    //                 // 自動儲存後重整
    //                 $('#saveContent').click();
    //             },
    //         });
    //     });

    function resetGalleryModal() {
        // 重置 gallery
        $("#galleryModal").attr("image-status", "init");
        $("#galleryModal").find(".cropImageResult").children().remove();
    }

    function activeGalleryItem(id) {
        if (id) {
            $(`.msgManageItem[data-id="${id}"] .openGalleryModal`).click(function () {
                const targetID = $(this).closest(".msgManageItem").attr("data-id");
                const targetImageSRC = $(this).attr("src");

                $("#galleryModal").attr("data-id", targetID);
                $("#galleryModal").attr("image-status", "crop");

                openModal({
                    targetModal: $("#galleryModal"),
                    modalTitle: "編輯圖片",
                    actionType: "edit",
                });

                if (targetImageSRC) {
                    $("#galleryModal")
                        .find(".cropImageResult")
                        .append(
                            `<img class="croppedImg" src="${targetImageSRC}" alt="croppedImg" />`
                        );
                }
            });
        } else {
            $(".msgManageItem .openGalleryModal").click(function () {
                const targetID = $(this).closest(".msgManageItem").attr("data-id");
                const targetImageSRC = $(this).attr("src");

                $("#galleryModal").attr("data-id", targetID);
                $("#galleryModal").attr("image-status", "crop");

                openModal({
                    targetModal: $("#galleryModal"),
                    modalTitle: "編輯圖片",
                    actionType: "edit",
                });

                if (targetImageSRC) {
                    $("#galleryModal")
                        .find(".cropImageResult")
                        .append(
                            `<img class="croppedImg" src="${targetImageSRC}" alt="croppedImg" />`
                        );
                }
            });
        }

        console.log("activeGalleryItem");
    }
    // 圖片 end

    // 對話

    $(".selectType.form__input.drop .option").on("click", function () {
        const newContentTypeOption = $(this).attr("value");

        // 設定內容類型
        $("#addMsg").attr("content-type", newContentTypeOption);
    });

    $(".openGalleryModal").on("click", function () {
        openModal({
            targetModal: $("#galleryModal"),
            modalTitle: "新增圖片",
            actionType: "add",
        });
    });

    $("#addMsg #addMsgContent").click(function () {
        const target = $("#addMsg");
        const characterID = target.find("#selectMsgCharacter").attr("select-id");
        const characterName =
            target.find("#selectMsgCharacter").val() || "沒有成員";
        const backgroundID = target.find("#selectMsgBackground").attr("select-id");
        const backgroundName =
            target.find("#selectMsgBackground").val() || "沒有場景";
        const msgType = target.find(".newContentTypeOption").attr("select-id");

        if (msgType) {
            const typeText = {
                text: "文字",
                image: "圖片",
                link: "連結",
            };

            let msgText = null;
            let msgImageSRC = null;

            let valid = true;
            let errorMsg = [];

            if (characterID.trim().length == 0) {
                valid = false;
                target.find(".selectCharacter .drop__container").addClass("error");
                alert("請選擇角色");
            }

            if (backgroundID.trim().length == 0) {
                valid = false;
                target.find(".selectBackground .drop__container").addClass("error");
                alert("請選擇場景");
            }

            switch (msgType) {
                case "text":
                    msgText = target.find('.newMsg input[name="newMsg"]').val();

                    if (msgText.trim().length == 0) {
                        valid = false;
                        target.find(".newMsg").addClass("error");

                        alert("請輸入對話");
                    }
                    break;
                case "link":
                    msgText = target.find('.newMsg input[name="newLink"]').val();

                    if (msgText.trim().length == 0) {
                        valid = false;
                        target.find(".newMsg").addClass("error");

                        alert.push("請輸入連結");
                    }
                    break;
                case "image":
                    msgImageSRC = target.find(".imageForm .upload img").attr("src");

                    if (msgImageSRC == "../Images/icon/upload.svg") {
                        valid = false;

                        alert("請選擇圖片");
                    }
                    break;
            }

            if (valid) {
                const uuid = generateUniqueId().slice(8);
                $("#message").append(
                    generateMsgInputItem({
                        index: uuid,
                        characterID: characterID,
                        characterName: characterName,
                        backgroundID,
                        backgroundName,
                        type: msgType,
                        typeText: typeText[msgType],
                        text: msgText,
                        imageSRC: msgImageSRC,
                        memberData: members,
                        backgroundData: backgrounds,
                    })
                );

                // 清空角色
                $("#selectMsgCharacter").val("");

                //  清空原本的內容類型
                $(".newContentTypeOption").removeAttr("select-id");
                $(".newContentTypeOption").val("");

                // 清空對話
                $("#addMsg .newMsg .input").val("");

                // 註冊對話事件
                activeMsgItem();
                activeGalleryItem(uuid);

                if (msgType == "image") {
                    $("#addMsg .imageForm").removeClass("upload");
                }

                // 關閉 modal
                closeModal();
            }
        } else {
            alert("請先選擇內容類型");
        }
    });

    function activeMsgItem() {
        $(".deleteMsgItem").on("click", function () {
            $(this).parent().remove();
        });
    }

    // 對話 end

    // 問題
    $("#newQuestionContent").on("blur", function () {
        let selectValue = $("#newQuestionContent").val();
        let selection = selectValue.split(",");
        if (selection[selection.length - 1] == "") {
            selection.pop();
        }
        $(".selectAnswer .select-items .option").remove();

        const optionItemTemplate = `<div class="option" data-id="{{key}}" value="{{key}}">{{text}}</div>`;

        function generateOptionItem(props) {
            let template = optionItemTemplate;

            return generateHtml(template, {
                ...props,
            });
        }

        if (selection.length > 1) {
            // 至少兩個選項
            for (i = 0; i < selection.length; i++) {
                // 不得為空, key 不能為 0 ，所以要加一
                if (selection[i] != "") {
                    $(".selectAnswer .select-items").append(
                        generateOptionItem({ key: i + 1, text: selection[i] })
                    );
                }
            }
        }
    });
    // 新增
    $("#addQuestionContent").click(function () {
        let questionIndexName = $("#newQuestionIndexName").val();
        let answerID = $("#newQuestionContentAnswer").attr("select-id"); // 1, 2, 3 ... 因為 key 不能有 0
        let selectValue = $("#newQuestionContent").val();
        let selection = selectValue.split(",");
        if (selection[selection.length - 1] == "") {
            selection.pop();
        }
        let valid = true;

        if (questionIndexName.length < 0) {
            valid = true;
            $("#newQuestionIndexName").parent().addClass("error");
        }

        if (!answerID) {
            valid = false;
            $("#newQuestionContentAnswer").parent().addClass("error");
        }

        if (selection.length < 2) {
            valid = false;
            $("#newQuestionContent").parent().addClass("error");
        }

        if (valid) {
            $("#question").append(
                generateQuestionInputItem({
                    questionIndex: questionIndexName,
                    questionData: selection, // ['選項一','選項二'...]
                    answerID: answerID,
                })
            );
            //  清空原本的
            initAddQuestionForm();

            // 註冊刪除問題事件
            activeDeleteQuestionItem();
        }
    });

    function initAddQuestionForm() {
        $("#newQuestionIndexName").val(""); // 題號
        $("#newQuestionContent").val(""); // 選項
        $("#newQuestionContentAnswer").removeAttr("select-id"); // 答案號碼
        $("#newQuestionContentAnswer").val(""); // 答案
    }

    // 刪除問題
    $(".deleteQuestionItem").on("click", function () {
        $(this).parent().remove();
    });

    function activeDeleteQuestionItem() {
        $(".deleteQuestionItem").on("click", function () {
            $(this).parent().remove();
        });
    }
    // 問題 end

    // 儲存
    $("#saveContent").on("click", function () {
        activeLoading("saving");

        (async function () {
            try {
                let checkContent = await checkContentSave();
                let checkQuestion = await checkQuestionSave();

                if (checkContent && checkQuestion) {

                    alert('儲存成功');

                    activeLoading("success");

                    closeLoading();

                    // 重整
                    window.location.reload();
                }
            } catch (err) {
                console.log(err);
                activeLoading("fail");

                setTimeout(() => {
                    alert("儲存失敗，聊天室內容過大，請壓縮圖片後再試一次");
                    closeLoading();
                }, 1000);
            }
        })();
    });

    function checkContentSave() {
        return new Promise((resolve, reject) => {
            // 儲存對話內容
            let msgData = [];

            for (let i = 0; i < $(".msgManageItem").length; i++) {
                const characterId =
                    $(".msgManageItem").eq(i).find(".msgCharacter").attr("select-id") ||
                    -1;
                const text = $(".msgManageItem").eq(i).find(".content").val();
                const type =
                    $(".msgManageItem")
                        .eq(i)
                        .find(".contentTypeOption")
                        .attr("select-id") || "text";
                const imageSRC =
                    $(".msgManageItem").eq(i).find(".msgImage").attr("src") ||
                    "../Images/icon/upload.svg";
                const backgroundId =
                $(".msgManageItem").eq(i).find(".msgBackground").attr("select-id") ||
                -1;

                let tmpData = {
                    who: characterId,
                    background: backgroundId,
                    type,
                };

                if (type == "image") {
                    tmpData.imageSRC = imageSRC;
                }

                if (text.length > 0) {
                    if (type == "text" || type == "link") {
                        tmpData.text = text;
                    }

                    msgData.push(tmpData);
                }
            }
            console.log(msgData);

            $.ajax({
                type: "POST",
                url: `../../Api/updateRoomContent.php`,
                dataType: "json",
                data: {
                    content: JSON.stringify(msgData),
                    roomID,
                },
                success: function (data) {
                    console.log(data);
                    resolve(true);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr, ajaxOptions, thrownError);
                    reject(false);
                },
            });
        });
    }

    function checkQuestionSave() {
        return new Promise((resolve, reject) => {
            // 儲存題目
            let questionData = [];

            for (let i = 0; i < $(".questionManageItem").length; i++) {
                let questionIndexName = $(".questionManageItem")
                    .eq(i)
                    .find(".questionIndexName")
                    .val();
                let answerID =
                    $(".questionManageItem")
                        .eq(i)
                        .find(".answerOption")
                        .attr("select-id") || -1;
                let options = $(".questionManageItem").eq(i).find(".content").val();
                let selection = options.split(",");
                if (selection[selection.length - 1] == "") {
                    selection.pop();
                }

                if (selection.length > 0) {
                    let tmpData = {
                        indexName: questionIndexName,
                        options: selection,
                        answerID,
                    };
                    questionData.push(tmpData);
                }
            }

            $.ajax({
                type: "POST",
                url: `../../Api/updateRoomQuestion.php`,
                dataType: "json",
                data: {
                    content: JSON.stringify(questionData),
                    roomID,
                },
                success: function (data) {
                    console.log(data);
                    resolve(true);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr, ajaxOptions, thrownError);
                    reject(false);
                },
            });
        });
    }
});
