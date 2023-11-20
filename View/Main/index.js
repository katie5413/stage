// debug: 按鈕定位
$("#room_bg").click(function (e) {
    var relativePosition = {
        left: e.pageX + $("#room_bg").scrollLeft() - $("#room_bg").offset().left,
        top: e.pageY - $("#room_bg").offset().top,
    };

    // console.log("x: " + relativePosition.left + " y: " + relativePosition.top);
});

$(document).ready(function () {
    let roomID;
    const windowID = generateUniqueId().slice(0, 10);

    activeLoading("init");

    const fetchRoomID = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: `../../Api/getRoomID.php`,
                success: function (res) {
                    console.log("roomID", res);
                    roomID = res;
                    resolve(true);
                },
                fail: function (xhr, ajaxOptions, thrownError) {
                    console.log("伺服器錯誤");
                    reject(false);
                },
            });
        });
    };

    (async function () {
        try {
            let getRoomIDDone = await fetchRoomID();

            if (getRoomIDDone) {
                init();
            }
        } catch (err) {
            console.log(err);
        }
    })();

    const defaultBackground = "../../Images/stage.jpeg";

    // 所有的背景
    let backgrounds = [];
    // 所有的對話
    let message = [];
    // 所有的 QA
    let question = [];
    // 所有的成員
    let members = [];
    // 目前的人物
    let currentMsgOwner = -1;
    // 目前這個文案是第幾筆
    let currentMsgIndex = -1;
    // 上一個背景
    let lastBackgroundId = -99;
    // 目前場次（用於判斷要顯示的人物）
    let currentAct = -1;

    const clientHeight = document.getElementById("room_bg").clientHeight;
    const bgRatio = clientHeight / 600;

    // 用場景分組的對話
    let msgGroupByBackground = []

    // 初始化房間
    const init = () => {
        console.log("init");

        // 背景圖
        const fetchRoomBackgroundStatus = () => {
            return new Promise((resolve, reject) => {
                $.ajax({
                    type: "POST",
                    url: `../../Api/getRoomBackground.php`,
                    dataType: "json",
                    data: {
                        roomID,
                    },
                    success: function (backgroundData) {
                        console.log("backgrounds", backgroundData);

                        if (backgroundData.length > 0) {
                            backgrounds = backgroundData;
                        }

                        console.log("載入背景圖成功");
                        resolve(true);
                    },
                    fail: function (xhr, ajaxOptions, thrownError) {
                        console.log("載入背景圖失敗");
                        reject(false);
                    },
                });
            });
        };

        const fetchRoomMemberStatus = () => {
            return new Promise((resolve, reject) => {
                $.ajax({
                    type: "POST",
                    url: `../../Api/getRoomMember.php`,
                    data: {
                        roomID,
                    },
                    dataType: "json",
                    success: function (memberData) {
                        console.log("member", memberData);

                        $("#totalMember").text(memberData.length);

                        if (memberData.length > 0) {
                            members = memberData;

                            members.forEach((item) => {
                                $("#stage").append(
                                    generateAvatar({
                                        id: item.id,
                                        img: item.img,
                                        name: item.name,
                                    })
                                );
                            });
                        }

                        console.log("載入成員成功");
                        resolve(true);
                    },
                    fail: function (xhr, ajaxOptions, thrownError) {
                        console.log("載入成員失敗");
                        reject(false);
                    },
                });
            });
        };

        const fetchRoomMsgStatus = () => {
            return new Promise((resolve, reject) => {
                $.ajax({
                    type: "POST",
                    url: `../../Api/getRoomMsg.php`,
                    data: {
                        roomID,
                    },
                    dataType: "json",
                    success: function (msgData) {
                        const messageData =
                            msgData != null && msgData.length > 0
                                ? JSON.parse(msgData)
                                : null;

                        // 創建時沒有內容，會是 null ，因此會報錯
                        if (messageData != null) {

                            messageData.forEach((msg, i) => {
                                message.push({ id: i, ...msg });
                            });

                            msgGroupByBackground = message.reduce((acc, value) => {
                                // compare the current value with the last item in the collected array
                                if (acc.length && acc[acc.length - 1][0].background == value.background) {
                                    // append the current value to it if it is matching
                                    acc[acc.length - 1].push(value);
                                } else {
                                    // append the new value at the end of the collected array
                                    acc.push([value]);
                                }

                                return acc;
                            }, []);
                            console.log('msgGroupByBackground', msgGroupByBackground);

                        }

                        console.log("message", message);

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

        const fetchRoomQuestionStatus = () => {
            return new Promise((resolve, reject) => {
                $.ajax({
                    type: "POST",
                    url: `../../Api/getRoomQuestion.php`,
                    data: {
                        roomID,
                    },
                    dataType: "json",
                    success: function (data) {
                        const questionData = JSON.parse(data);
                        console.log("question", questionData);
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
                // 提交時
                const startTime = new Date();
                let submittedTimes = 0; // 提交次數

                function showRecord() {
                    // 將兩個時間轉換成 JavaScript 的 Date 物件
                    const date1 = startTime;
                    const date2 = new Date();

                    // 取得兩個 Date 物件的時間戳記
                    const timestamp1 = date1.getTime();
                    const timestamp2 = date2.getTime();

                    const minutes = 60;
                    const hours = 60 * 24;

                    // 計算毫秒差
                    const diffSeconds =
                        (Math.round((timestamp2 - timestamp1) / 1000) * 10) / 10;

                    const totalHours = Math.floor(diffSeconds / hours);
                    const formattedHours = totalHours > 9 ? totalHours : `0${totalHours}`;

                    const totalMinutes = Math.floor(diffSeconds / minutes);
                    const formattedMinutes =
                        totalMinutes > 9 ? totalMinutes : `0${totalMinutes}`;
                    const totalSeconds = diffSeconds - minutes * totalMinutes;
                    const formattedSeconds =
                        totalSeconds > 9 ? totalSeconds : `0${totalSeconds}`;

                    const formattedTime =
                        totalHours === 0
                            ? `${formattedMinutes}:${formattedSeconds}`
                            : `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

                    const name = $("#submitName").val();
                    $(".congrats .text span").text(name);
                    $(".congrats .time span").text(formattedTime);
                    $(".congrats .submitTimes span").text(submittedTimes);
                    $("#submitAnswer").hide();
                }

                if (
                    getBackgroundDone &&
                    getMemberDone &&
                    getMsgDone &&
                    getQuestionDone
                ) {
                    start();
                    console.log("start:", startTime.toDateString());
                }
            } catch (err) {
                console.log(err);
            }
        })();
    };

    // 開始
    const start = () => {
        console.log("start");
        startStage();
        closeLoading();
        startQA();
    };

    const startStage = () => {
        console.log("startStage");

        function playSound(type) {
            let sound;
            switch (type) {
                case "bell":
                    sound = new Audio("../../sound/bell.mp3");
                    break;
                case "correct":
                    sound = new Audio("../../sound/correct.mp3");
                    break;
                case "incorrect":
                    sound = new Audio("../../sound/incorrect.mp3");
                    break;
            }

            sound.play();
        }

        let msgIndex =0;
        msgGroupByBackground.map((stage, i) => {
            stage.map((msg, j) => {
                msgIndex++
                let key = generateUniqueId();
                let msgOwner = members.filter(
                    (person) => person.id == msg.who
                )[0];
    
                let imageItem = null;
    
                let text = null;
    
                switch (msg.type) {
                    case "text":
                    case undefined:
                    case "link":
                        text = msg.text;
                        break;
                    case "image":
                        imageItem = msg.imageSRC;
                        break;
                }
                $("#message").append(
                    generateMsgItem({
                        key: key,
                        type:
                            msg.type == undefined
                                ? "text"
                                : msg.type,
                        msgImg: imageItem,
                        name,
                        text,
                        name: msgOwner.name,
                        actGroup: i + 1,
                        actIndex: msgIndex,
                    })
                );
            })
        })

        // message.map(msg => {
        //     let key = generateUniqueId();
        //     let msgOwner = members.filter(
        //         (person) => person.id == msg.who
        //     )[0];

        //     let imageItem = null;

        //     let text = null;

        //     switch (msg.type) {
        //         case "text":
        //         case undefined:
        //         case "link":
        //             text = msg.text;
        //             break;
        //         case "image":
        //             imageItem = msg.imageSRC;
        //             break;
        //     }
        //     $("#message").append(
        //         generateMsgItem({
        //             key: key,
        //             type:
        //                 msg.type == undefined
        //                     ? "text"
        //                     : msg.type,
        //             msgImg: imageItem,
        //             name,
        //             text,
        //             name: msgOwner.name,
        //             actGroup: currentAct + 1,
        //             actIndex: currentMsgIndex + 1,
        //         })
        //     );
        // })

        const updateBackground = (currentMsgIndex, goBack = false) => {
            const currentBackgroundId = message[currentMsgIndex].background;
            const errorBackgroundImage = currentBackgroundId == -1;

            for (let i = 0; i < $('#message .messageItem').length; i++) {
                if ($('#message .messageItem').eq(i).attr("act-index") - 1 === currentMsgIndex) {
                    $('#message .messageItem').eq(i).show()
                } else {
                    $('#message .messageItem').eq(i).hide()
                }
            }

            // 如果與上一幕背景不同，才要刷新
            if (currentBackgroundId != lastBackgroundId) {
                // 更換背景
                const stage = backgrounds.filter(
                    (stage) => stage.id == message[currentMsgIndex].background
                )[0];
                const currentBackgroundImg =
                    message[currentMsgIndex].background == -1 || stage == null
                        ? defaultBackground
                        : stage.img;
                $("#stageBackground").attr("src", currentBackgroundImg);

                // 更新場次
                if (lastBackgroundId == -99) {
                    currentAct = 0;
                } else {
                    goBack ? currentAct-- : currentAct++;
                }

                lastBackgroundId = currentBackgroundId;

                // Note: 若無對話場景也會顯示 -1 ，若第一句剛好沒有場景，會導致錯誤，因此先確認背景，更新場次後再換人上場
                // 換人上場
                const msgInCurrentAct = msgGroupByBackground[currentAct];
                updateCharacter(msgInCurrentAct);
            }
        };

        const updateCharacter = (msgInCurrentAct) => {
            console.log(msgInCurrentAct);
            const uniqueCharacters = [
                ...new Set(msgInCurrentAct.map((item) => item.who)),
            ];
            console.log(uniqueCharacters);
            $(`#stage .person`).hide();
            uniqueCharacters.map((key) => {
                $(`#stage .person[data-id=${key}]`).show();
            });
        };

        $(".bottomArea #triggerMsgNext").on("click", function () {
            console.log("next");

            // 對話更新
            if (currentMsgIndex < message.length - 1) {
                currentMsgIndex++;
                console.log("currentMsgIndex", currentMsgIndex);
                dataLayer.push({
                    event: "nextMsg",
                    roomID: roomID,
                    windowID: windowID,
                });

                playSound("bell");

                updateBackground(currentMsgIndex);

                // let msgOwner = members.filter(
                //     (person) => person.id == message[currentMsgIndex].who
                // )[0];

                // let imageItem = null;

                // let text = null;

                // switch (message[currentMsgIndex].type) {
                //     case "text":
                //     case undefined:
                //     case "link":
                //         text = message[currentMsgIndex].text;
                //         break;
                //     case "image":
                //         imageItem = message[currentMsgIndex].imageSRC;
                //         break;
                // }

                // let key = generateUniqueId();
                // let name = msgOwner == null ? "沒有成員" : msgOwner.name;

                // // 避免 XSS
                // $(`.messageItem[data-key="${key}"] .name`).text(name);
                // if (
                //     message[currentMsgIndex].type == "text" ||
                //     message[currentMsgIndex].type == undefined
                // ) {
                //     $(`.messageItem[data-key="${key}"] .text`).text(text);
                // }

                // if (message[currentMsgIndex].type == "link") {
                //     $(`.messageItem[data-key="${key}"] .text a`).text(text);
                //     $(`.messageItem[data-key="${key}"] .text a`).attr("href", text);
                // }

                // $("#message").append(
                //     generateMsgItem({
                //         key: key,
                //         type:
                //             message[currentMsgIndex].type == undefined
                //                 ? "text"
                //                 : message[currentMsgIndex].type,
                //         msgImg: imageItem,
                //         name,
                //         text,
                //         actGroup: currentAct + 1,
                //         actIndex: currentMsgIndex + 1,
                //     })
                // );

                // 歷史紀錄
                $("#history").append(
                    generateHistoryItem({
                        who: name,
                        msg:
                            message[currentMsgIndex].type === "image"
                                ? message[currentMsgIndex].imageSRC
                                : message[currentMsgIndex].text,
                        type: message[currentMsgIndex].type,
                    })
                );

                $(".room_history .wrapper").animate(
                    { scrollTop: $(".room_history .wrapper").prop("scrollHeight") },
                    500
                );

                // 避免 XSS
                // $(`.messageItem[data-key="${key}"] .name`).text(name);
                // if (
                //     message[currentMsgIndex].type == 'text' ||
                //     message[currentMsgIndex].type == undefined
                // ) {
                //     $(`.messageItem[data-key="${key}"] .text`).text(text);
                // }

                // if (message[currentMsgIndex].type == 'link') {
                //     $(`.messageItem[data-key="${key}"] .text a`).text(text);
                //     $(`.messageItem[data-key="${key}"] .text a`).attr('href', text);
                // }

                // $(`.messageItem[data-key="${key}"]`)[0].scrollIntoView();

                if (currentMsgIndex == message.length - 1) {
                    $(this).removeClass("active");
                }

                $("#triggerMsgPrev").addClass("active");

                // $('.messageItem.image .text').on('click', function () {
                //     openModal({
                //         targetModal: $('#quickView'),
                //     });

                //     $('#quickView .content .middle img').attr(
                //         'src',
                //         $(this).find('img').attr('src'),
                //     );
                // });

                $("#quickView").on("click", function (e) {
                    let close = true;
                    if (e.target == document.getElementById("quickView")) {
                        closeModal();
                    }
                });
            }
        });
        $('.bottomArea #triggerMsgPrev').on('click', function () {
            console.log("prev")

            if (currentMsgIndex > 0) {
                currentMsgIndex--;
                console.log("currentMsgIndex", currentMsgIndex);

                updateBackground(currentMsgIndex, goBack = true);

                dataLayer.push({ event: 'preMsg', roomID: roomID, windowID: windowID });

                if (currentMsgIndex == -1) {
                    $('#triggerMsgPrev').removeClass('active');
                } else {
                    $('#triggerMsgPrev').addClass('active');
                }
                $('#triggerMsgNext').addClass('active');
            }
        });
    };

    const startQA = () => {
        // 題目
        let answer = [];

        if (question != null) {
            question.map((item, index) => {
                $("#question").append(
                    generateQuestionItem({
                        questionData: item.options, // ['選項一','選項二'...]
                        questionIndex: item.indexName ? item.indexName : index + 1, // 題號
                    })
                );
                answer.push(item.answerID);
            });
            activeQuestionItemFunction();
        }

        $("#submitAnswer").click(() => {
            let userAnswer = getAnswer();

            // 累積提交次數
            submittedTimes++;

            if (userAnswer.length == answer.length) {
                let valid = checkAnswer(userAnswer, answer);
                dataLayer.push({
                    event: "submitAnswer",
                    roomID: roomID,
                    windowID: windowID,
                });

                if (valid) {
                    $(".congrats").addClass("active");
                    playSound("correct");
                    dataLayer.push({
                        event: "correct",
                        roomID: roomID,
                        windowID: windowID,
                    });
                    showRecord();
                } else {
                    $(".congrats").removeClass("active");

                    showErrorMsg({
                        target: $(".room_question"),
                        msg: "再檢查一下吧ＱＱ",
                    });
                    playSound("incorrect");
                    dataLayer.push({
                        event: "incorrect",
                        roomID: roomID,
                        windowID: windowID,
                        answer: userAnswer,
                    });
                }
            } else {
                showErrorMsg({
                    target: $(".room_question"),
                    msg: "有未作答的題目",
                });
                playSound("incorrect");

                dataLayer.push({
                    event: "notAllFill",
                    roomID: roomID,
                    windowID: windowID,
                });
            }
        });

        // 拿到使用者填答
        function getAnswer() {
            let userAnswer = [];
            for (let i = 0; i < $(".answerOption").length; i++) {
                let selected = $(".answerOption").eq(i).attr("select-id");
                if (selected != "") {
                    userAnswer.push(selected);
                }
            }
            return userAnswer;
        }

        // 檢查答案是否相同
        function checkAnswer(userAnswer, answer) {
            let valid = true;
            for (let i = 0; i < answer.length; i++) {
                if (userAnswer[i] != answer[i]) {
                    valid = false;
                    $("#question .questionItem").eq(i).find("input").addClass("alert");
                } else {
                    $("#question .questionItem").eq(i).find("input").removeClass("alert");
                }
            }
            return valid;
        }
    };
});
