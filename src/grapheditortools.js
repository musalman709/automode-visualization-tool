/**
 * Shared tools between Btree and FSM
 */

/**
 * Select the clicked element
 */
function GraphEditorSelectTool() {
	GraphEditorTool.call(this);
	this.graphEditor = undefined;
}
GraphEditorSelectTool.prototype = Object.create(GraphEditorTool.prototype)

GraphEditorSelectTool.prototype.getToolId = function() {
	return "select";
}
GraphEditorSelectTool.prototype.getName = function() {
	return "Select";
}
GraphEditorSelectTool.prototype.onMouseDown = function(pos, element) {
	if(element !== undefined) {
		this.graphEditor.setSelectedElement(element);
	} else {
		this.graphEditor.setSelectedElement(undefined);
	}
}

/**
 * Create a new node at click pos
 */
function GraphEditorNewNodeTool() {
	GraphEditorTool.call(this);
	this.graphEditor = undefined;
}
GraphEditorNewNodeTool.prototype = Object.create(GraphEditorTool.prototype)

GraphEditorNewNodeTool.prototype.getToolId = function() {
	return "addnode";
}
GraphEditorNewNodeTool.prototype.getName = function() {
	return "Add Node";
}
GraphEditorNewNodeTool.prototype.onMouseDown = function(pos, element) {
  this.graphEditor.setSelectedElement(undefined);
  // only create node if mouse over empty space
	if(element === undefined) {
	  var node = new GraphEditorNode("rd_node", pos);
		this.graphEditor.addElement(node);
		this.graphEditor.setSelectedElement(node);
	}
}

/**
 * Create a new edge between two nodes
 */
function GraphEditorNewEdgeTool() {
	GraphEditorTool.call(this);
	this.graphEditor = undefined;
}
GraphEditorNewEdgeTool.prototype = Object.create(GraphEditorTool.prototype)

GraphEditorNewEdgeTool.prototype.onToolSelect = function() {
  // deselect previous element
  this.graphEditor.setSelectedElement(undefined);
}
GraphEditorNewEdgeTool.prototype.getToolId = function() {
	return "addedge";
}
GraphEditorNewEdgeTool.prototype.getName = function() {
	return "Add Edge";
}
GraphEditorNewEdgeTool.prototype.onMouseDown = function(pos, element) {
  // select first element
  if(element === undefined) {
    this.graphEditor.setSelectedElement(undefined);
  }
  // on second element clicked, create edge between them
  else {
    var selected = this.graphEditor.getSelectedElement();

    if(selected === undefined) {
      this.graphEditor.setSelectedElement(element);
    }
    else {
      if(element.isNode() && selected.isNode()) {
        // create edge
	      var edge = new GraphEditorEdge("rd_edge", selected, element)
	      // if edge valid, add it
	      if(edge.isValid()) {
	        this.graphEditor.addElement(edge);
		  	this.graphEditor.setSelectedElement(edge);
	      }
      }
		  // deleselect
		  this.graphEditor.setSelectedElement(undefined);
    }
  }
}

/**
 * Drag an element
 */
function GraphEditorDraggingTool() {
	GraphEditorTool.call(this);
	this.graphEditor = undefined;
	// the current dragged element
	this.dragged = undefined;
}
GraphEditorDraggingTool.prototype = Object.create(GraphEditorTool.prototype)
	
GraphEditorDraggingTool.prototype.setDragged = function(element) {
	this.dragged = element;
}
GraphEditorDraggingTool.prototype.getToolId = function() {
	return "dragging";
}
GraphEditorDraggingTool.prototype.getName = function() {
	return "Drag";
}
GraphEditorDraggingTool.prototype.onMouseDown = function(pos, element) { 
  // drag start
	this.setDragged(element);
	this.graphEditor.setSelectedElement(element);
}
GraphEditorDraggingTool.prototype.onMouseUp = function(pos) {
  // drag end
	this.setDragged(undefined);
}
GraphEditorDraggingTool.prototype.onMouseLeave = function() {
  // drag end
	this.setDragged(undefined);
}
GraphEditorDraggingTool.prototype.onMouseMove = function(pos) {
  // drag in progress, move element to mouse pos
	if(this.dragged !== undefined) {
		this.dragged.move(pos);
		this.graphEditor.callExporter();
	}
}

/**
 * Delete element
 */
function GraphEditorDeleteTool() {
	GraphEditorTool.call(this);
}
GraphEditorDeleteTool.prototype = Object.create(GraphEditorTool.prototype);

GraphEditorDeleteTool.prototype.getToolId = function() {
	return "delete";
}
GraphEditorDeleteTool.prototype.getName = function() {
	return "Delete";
}
GraphEditorDeleteTool.prototype.onMouseDown = function(pos, element) {
  // remove cliked element
	if(element !== undefined) {
		var that = this;
		element.onRemoval();
		this.graphEditor.removeElement(element);
	}
}

