export default class GraphEditorElement {
    constructor() {
        this.graphEditor = undefined;
    }
    getName() {
        return "<unknown element>";
    }
    isNode() { }
    getSVGElement() { }
    setModel(model) { }
    getModel() { }
    setParam(param) { }
    getParam() { }
    setParamValue(param, value) { }
    getParamDict() { }
    move(newPos) { }
    getPosition() { }
    update() { }
    onSelect() { }
    onDeselect() { }
    onRemoval() { }
}
