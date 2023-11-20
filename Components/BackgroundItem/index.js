const backgroundTemplate = `<div class="backgroundItem" data-id="{{id}}">
<img class="img" src="{{img}}" alt="{{name}}" />
<span class="name">{{name}}</span>
</div>`;

function generateBackgroundItem(props) {
    let template = backgroundTemplate;

    // if (!props.name) {
    //     var tmpName = props.name.substring(0, 1);
    //     template = template.replace(
    //         '<span class="name">{{name}}</span>',
    //         `<span class="name">沒有場景</span>`,
    //     );
    // }

    // if (!props.img) {
    //     var tmpName = props.name.substring(0, 1);
    //     template = template.replace(
    //         '<img class="img" src="{{img}}" alt="{{name}}" />',
    //         `<div class="tmpImg"><span>${tmpName}</span></div>`,
    //     );
    // }

    return generateHtml(template, {
        ...props,
    });
}
