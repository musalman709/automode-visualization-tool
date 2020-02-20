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
    onMouseDown(position, element, isCtrlPressed) {
        const prevSelected = this.graphEditor.getSelectedElement();
        // drag start
        this.setDragged(element);
        this.graphEditor.setSelectedElement(element);
        // if ctrl is pressed while clicking outside of an element, add a node
        // if ctrl is pressed while clicking on an element and a node was previously
        // selected, add an edge
        if (isCtrlPressed) {
            if (!element) {
                this.graphEditor.addNode(position);
            } else if (prevSelected && prevSelected.isNode() && element.isNode() 
                && prevSelected !== element) {
                this.graphEditor.addEdge(prevSelected, element);
            }
        }
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
