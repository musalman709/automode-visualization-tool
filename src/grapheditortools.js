
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
	if(element === undefined) {
	  var node = new GraphEditorNode("rd_node", pos);
		this.graphEditor.addElement(node);
		this.graphEditor.setSelectedElement(node);
	}
}



function GraphEditorNewEdgeTool() {
	GraphEditorTool.call(this);
	this.graphEditor = undefined;
}
GraphEditorNewEdgeTool.prototype = Object.create(GraphEditorTool.prototype)

GraphEditorNewEdgeTool.prototype.onToolSelect = function() {
  this.graphEditor.setSelectedElement(undefined);
}
GraphEditorNewEdgeTool.prototype.getToolId = function() {
	return "addedge";
}
GraphEditorNewEdgeTool.prototype.getName = function() {
	return "Add Edge";
}
GraphEditorNewEdgeTool.prototype.onMouseDown = function(pos, element) {
  if(element === undefined) {
    this.graphEditor.setSelectedElement(undefined);
  }
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
	      }
      }
		  // deleselect
		  this.graphEditor.setSelectedElement(undefined);
    }
  }
}



function GraphEditorDraggingTool() {
	GraphEditorTool.call(this);
	this.graphEditor = undefined;
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
	this.setDragged(element);
	this.graphEditor.setSelectedElement(element);
}
GraphEditorDraggingTool.prototype.onMouseUp = function(pos) {
	this.setDragged(undefined);
}
GraphEditorDraggingTool.prototype.onMouseLeave = function() {
	this.setDragged(undefined);
}
GraphEditorDraggingTool.prototype.onMouseMove = function(pos) {
	if(this.dragged !== undefined) {
		this.dragged.move(pos);
		this.graphEditor.callExporter();
	}
}



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
	if(element !== undefined) {
		var that = this;
		element.onRemoval();
		this.graphEditor.removeElement(element);
	}
}

