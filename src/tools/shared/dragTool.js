import { GraphEditorTool } from "../tool";

/**
 * Drag an element
 */
export class GraphEditorDraggingTool extends GraphEditorTool {
    setDragged(element) {
        this.dragged = element;
    }
    getName() {
        return "Select/Drag";
    }
    onMouseDown(pos, element) {
        // drag start
        this.setDragged(element);
        this.graphEditor.setSelectedElement(element);
    }
    onMouseUp() {
        // drag end
        this.setDragged(undefined);
    }
    onMouseLeave() {
        // drag end
        this.setDragged(undefined);
    }
    onMouseMove(pos) {
        // drag in progress, move element to mouse pos
        if (this.dragged !== undefined) {
            this.dragged.move(pos);
            this.graphEditor.updateGraph();
        }
    }
}
