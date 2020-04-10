import { GraphEditorTool } from "../tool";

/**
 * Create a new edge between two nodes
 */
export class GraphEditorNewEdgeTool extends GraphEditorTool {
    onToolSelect() {
        // deselect previous element
        this.graphEditor.setSelectedElement(undefined);
    }
    getToolId() {
        return "addedge";
    }
    getName() {
        return "Add Edge";
    }
    onMouseDown(pos, element) {
        // select first element
        if (element === undefined) {
            this.graphEditor.setSelectedElement(undefined);
        }
        // on second element clicked, create edge between them
        else {
            let selected = this.graphEditor.getSelectedElement();
            if (selected === undefined) {
                this.graphEditor.setSelectedElement(element);
            }
            else {
                if (element.isNode() && selected.isNode()) {
                    this.graphEditor.addEdge(selected, element);
                }
                // deleselect
                this.graphEditor.setSelectedElement(undefined);
            }
        }
    }
}
