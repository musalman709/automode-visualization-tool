export default function html(templateString) {
    const template = document.createElement("template");
    template.innerHTML = templateString;
    return template;
}
