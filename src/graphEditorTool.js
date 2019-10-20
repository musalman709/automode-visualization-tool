/**
 * Prototype of editor tools
 */
export default class GraphEditorTool {
    constructor() {
        this.graphEditor = undefined;
    }
    onToolSelect() { }
    onToolDeselect() { }
    onMouseDown(pos, element) { }
    onMouseUp(pos) { }
    onMouseLeave() { }
    onMouseMove(pos) { }
}
