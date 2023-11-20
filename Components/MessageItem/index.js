const msgItemTemplate = `<div class="messageItem {{type}}" data-key="{{key}}" act-group="{{actGroup}}" act-index="{{actIndex}}">
    <div class="item">
        <div class="content_box">
            <div class="name">{{name}}</div>
            <div class="text">{{text}}</div>
        </div>
    </div>
</div>`;

function generateMsgItem(props) {
    let template = msgItemTemplate;

    if (props.type == 'image') {
        template = template.replace(
            '<div class="text">{{text}}</div>',
            '<div class="text"><div class="image"><img src="{{msgImg}}" /></div></div>',
        );
    }

    if (props.type == 'link') {
        template = template.replace(
            '<div class="text">{{text}}</div>',
            '<div class="text"><a class="link" target="_blank" href="{{text}}">{{text}}</a></div>',
        );
    }

    return generateHtml(template, {
        ...props,
    });
}

const msgInputItemTemplate = `<div class="msgManageItem {{type}}" data-id={{index}} draggable="true" ondragstart="DragStartMsg()"  ondragover="DragOverMsg()">
    <button class="button dragMsgItem">
        <img src="../../Images/icon/drag.png" alt="drag" class="icon">
    </button>
    <button class="button deleteMsgItem">
        <img src="../../Images/icon/delete.svg" alt="delete" class="icon">
    </button>
    <div class="form__input drop">
        <div class="drop__container">
            <input class="select-selected msgCharacter" type="text" placeholder="角色" autocomplete="off" value="{{characterName}}" select-id="{{characterID}}" />
            <img src="../../Images/icon/arrowRight.svg" alt="icon" class="icon">
            <img src="../../Images/icon/clear.svg" alt="icon" class="drop__clear" />
            <div class="line"></div>
            <div class="select-items selectMsgCharacter"></div>
        </div>
    </div>
    <div class="form__input drop">
        <div class="drop__container">
            <input class="select-selected msgBackground" type="text" placeholder="場景" autocomplete="off" value="{{backgroundName}}" select-id="{{backgroundID}}" />
            <img src="../../Images/icon/arrowRight.svg" alt="icon" class="icon">
            <img src="../../Images/icon/clear.svg" alt="icon" class="drop__clear" />
            <div class="line"></div>
            <div class="select-items selectMsgBackground"></div>
        </div>
    </div>
    <div class="form__input drop" data-type="contentType">
        <div class="drop__container">
            <input class="select-selected contentTypeOption" type="text" placeholder="內容類型" autocomplete="off" value="{{typeText}}" select-id="{{type}}" />
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
    <div class="form__input" data-type="text">
        <input class="input content" type="text" value="{{text}}" placeholder="對話" />
    </div>
    <div class="form__input" data-type="image">
        <img class="image openGalleryModal msgImage" src="../../Images/icon/upload.svg"/>
    </div>
</div>`;

function generateMsgInputItemOption(props) {
    const msgInputItemOptionTemplate = `<div class="option" value="{{value}}">{{label}}</div>`;
    let template = msgInputItemOptionTemplate;

    return generateHtml(template, {
        ...props,
    });
}

function generateMsgInputItem(props) {
    let template = msgInputItemTemplate;

    if (props.memberData) {
        let optionItemHTML = '';

        for (var i = 0; i < props.memberData.length; i++) {
            optionItemHTML += generateMsgInputItemOption({
                value: props.memberData[i].id,
                label: props.memberData[i].name,
            });
        }

        template = template.replace(
            '<div class="select-items selectMsgCharacter"></div>',
            `<div class="select-items selectMsgCharacter">${optionItemHTML}</div>`,
        );
    }

    if (props.backgroundData) {
        let optionItemHTML = '';

        for (var i = 0; i < props.backgroundData.length; i++) {
            optionItemHTML += generateMsgInputItemOption({
                value: props.backgroundData[i].id,
                label: props.backgroundData[i].name,
            });
        }

        template = template.replace(
            '<div class="select-items selectMsgBackground"></div>',
            `<div class="select-items selectMsgBackground">${optionItemHTML}</div>`,
        );
    }

    if (props.imageSRC) {
        template = template.replace(
            '../../Images/icon/upload.svg',
            props.imageSRC,
        );
    }

    return generateHtml(template, {
        ...props,
    });
}


let msgRow;

function DragStartMsg() {
    msgRow = event.target.closest(`.msgManageItem`);
    msgRow.classList.add('drag');
}

function DragOverMsg() {
    event.preventDefault();

    let target = transformToJQuery(event.target.closest(`.msgManageItem`));

    let children = Array.from(target.parent().children());

    if (children.indexOf(target) < children.indexOf(msgRow)) target.after(msgRow);
    else target.before(msgRow);
    msgRow.classList.remove('drag');
}
