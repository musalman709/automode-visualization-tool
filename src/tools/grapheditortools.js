import GraphEditorTool from "./graphEditorTool";

/**
 * Shared tools between Btree and FSM
 */


/**
 * Create a new node at click pos
 */
export class GraphEditorNewNodeTool extends GraphEditorTool{
    constructor() {
        super();
        this.graphEditor = undefined;
    }
    getToolId() {
        return "addnode";
    }
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


/**
 * Create a new edge between two nodes
 */
export class GraphEditorNewEdgeTool extends GraphEditorTool{
    constructor() {
        super();
        this.graphEditor = undefined;
    }
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
            var selected = this.graphEditor.getSelectedElement();
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

/**
 * Drag an element
 */
export class GraphEditorDraggingTool  extends GraphEditorTool{
    constructor() {
        super();
        this.graphEditor = undefined;
        // the current dragged element
        this.dragged = undefined;
    }
    setDragged(element) {
        this.dragged = element;
    }
    getToolId() {
        return "dragging";
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
	

/**
 * Delete element
 */
export class GraphEditorDeleteTool extends GraphEditorTool{
    constructor() {
        super();
    }
    getToolId() {
        return "delete";
    }
    getName() {
        return "Delete";
    }
    onMouseDown(pos, element) {
        // remove cliked element
        if (element !== undefined) {
            this.graphEditor.removeElement(element);
        }
    }
}


