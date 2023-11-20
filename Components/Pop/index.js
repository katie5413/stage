$(".pop .inner .close").click(function () {
    closePop();
});

$(".pop .inner .cancel").click(function () {
    closePop();
});

function initImageTab() {
    let tab = $("#imageTab");

    // 成員名稱
    tab.find("#imageName").val("");

    // 按鈕
    // manageImageStep("init");
    $("#imageTab").attr("image-status", "init");

    // 上傳圖片
    // $("#member__img_area").show();

    // 清空 result
    $("#result").children().remove();

    // 清除操作
    tab.removeAttr("target");
    tab.removeAttr("targetId");
    tab.removeAttr("action");
}

function openPop({ tab, data, target }) {
    tab.addClass("open").removeClass("close");
    $("body").addClass("fixed");

    const action = data ? "edit" : "add";
    tab.attr("action", action);

    $("#imageTab").attr("image-status", action === "add" ? "init" : "crop");

    const actionText = {
        add: "新增",
        edit: "編輯",
    };

    tab.find(".inner .top .title .action").text(actionText[action]);

    const targetConfig = {
        member: {
            title: "成員",
            icon: "../../Images/icon/member.svg",
        },
        background: {
            title: "場景",
            icon: "../../Images/icon/stage.png",
        },
    };

    if (target) {
        tab.attr("target", target);
        tab.find("span.target").text(targetConfig[target].title);

        tab.find(".header__icon").attr("src", targetConfig[target].icon);
    }

    if (data) {
        tab.attr("targetId", data.id);
        tab.find("#imageName").val(data.name);

        // manageImageStep("editInit");

        if (data.img) {
            $("#result").append(
                `<img class="croppedImg" src="${data.img}" alt="avatar">`
            );
            console.log('apply edit img')
        }
    }
}

// 上傳留言圖片
$("#upload_member_img").change(function () {
    var file = this.files[0];
    //用size属性判断文件大小不能超过 800KB ，前端直接判断的好处，免去服务器的压力。
    if (file.size > 1 * 1024 * 800) {
        alert("圖片不可大於 800KB");
    } else {

        var reader = new FileReader();
        reader.onload = function () {
            // 通过 reader.result 来访问生成的 base64 DataURL
            var base64 = reader.result;
            // $("#member__img_area").hide();

            $("#imageTab").find(".cropImageResult").append(
                `<img class="tmpUploadImg" src="${base64}" alt="avatar">`
            );

            $("#imageTab").attr("image-status", "upload");


            let image = $("#imageTab").find(".tmpUploadImg")[0];
            let button = $("#imageTab").find(".crop_button")[0];
            const isBackground = $("#imageTab").attr("target") === "background"
            var cropper = new Cropper(image, {
                viewMode: 1,
                aspectRatio: isBackground ? 4 / 3 : "Nan",
                ready: function () {

                },
            });

            button.onclick = function () {
                var croppedCanvas = cropper.getCroppedCanvas();


                // Show
                $("#imageTab").find(".cropImageResult").children().remove();
                $("#imageTab").find(".cropImageResult").append(
                    `<img class="croppedImg" src="${croppedCanvas.toDataURL()}" alt="image" />`
                );
                console.log('crop img')

                $("#imageTab").attr("image-status", "crop");
            };
        };
        reader.readAsDataURL(file);
    }
});

$("#imageTab .reUpload_button").click(function () {
    $("#imageTab").attr("image-status", "init");
    $("#imageTab").find(".cropImageResult").children().remove();
});

function closePop() {
    $(".pop").removeClass("open").addClass("close");
    $("body").removeClass("fixed");

    initImageTab();
    hideErrorMsg();
}