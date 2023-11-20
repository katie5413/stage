const pillTemplate = `<button class="pill" personID="{{id}}" current={{current}} total={{total}} style="top:{{y}}px; left: {{x}}px">
{{ name }}
</button>`;

function generatePillMsg(props) {
    const template = pillTemplate;

    return generateHtml(template, {
        ...props,
    });
}
