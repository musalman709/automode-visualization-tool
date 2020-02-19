import { GraphEditorTool } from "../tool";

/**
 * Delete element
 */
export class GraphEditorRootSelectorTool extends GraphEditorTool {
    getName() {
        return "Select start";
    }
    onMouseDown(pos, element) {
        if (element !== undefined && element.isNode())
            this.graphEditor.setFirstElement(element);
    }
}