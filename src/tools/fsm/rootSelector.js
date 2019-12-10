import GraphEditorTool from "../graphEditorTool";

/**
 * Delete element
 */
export class GraphEditorRootSelectorTool extends GraphEditorTool {
    constructor() {
        super();
    }
    getToolId() {
        return "rootselector";
    }
    getName() {
        return "Select root";
    }
    onMouseDown(pos, element) {
        if (element !== undefined && element.isNode())
            this.graphEditor.setFirstElement(element);
    }
}