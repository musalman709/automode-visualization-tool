import { GraphEditorTool } from "../tool";

/**
 * Create a new node at click pos
 */
export class GraphEditorNewNodeTool extends GraphEditorTool {
    getName() {
        return "Add Node";
    }
    onMouseDown(pos, element) {
        this.graphEditor.setSelectedElement(undefined);
        // only create node if mouse over empty space
        if (element === undefined) {
            this.graphEditor.addNode(pos);
        }
    }
}
