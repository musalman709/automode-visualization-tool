
function GraphEditorNewNodeTool() {
	GraphEditorTool.call(this);
	this.graphEditor = undefined;
	this.nodeCounter = 0;
}
GraphEditorNewNodeTool.prototype = Object.create(GraphEditorTool.prototype)

GraphEditorNewNodeTool.prototype.getToolId = function() {
	return "addnode";
}
GraphEditorNewNodeTool.prototype.getName = function() {
	return "Add Node";
}
GraphEditorNewNodeTool.prototype.onMouseDown = function(pos, element) {
	if(element === undefined) {
		this.nodeCounter += 1;
		this.graphEditor.addElement(
			new GraphEditorNode("node_"+this.nodeCounter, pos)
			);
	}
}



function GraphEditorNewEdgeTool() {
	GraphEditorTool.call(this);
	this.graphEditor = undefined;
	this.edgeCounter = 0;
	this.lastNodeClicked = undefined;
}
GraphEditorNewEdgeTool.prototype = Object.create(GraphEditorTool.prototype)

GraphEditorNewEdgeTool.prototype.getToolId = function() {
	return "addedge";
}
GraphEditorNewEdgeTool.prototype.getName = function() {
	return "Add Edge";
}
GraphEditorNewEdgeTool.prototype.onToolDeselect = function() {
	this.lastNodeClicked = undefined;
}
GraphEditorNewEdgeTool.prototype.onMouseDown = function(pos, element) {
	if(element !== undefined) {
		if(this.lastNodeClicked !== undefined
		&& this.lastNodeClicked !== element) {
			this.edgeCounter += 1;
			this.graphEditor.addElement(
				new GraphEditorEdge("edge_"+this.edgeCounter,
				this.lastNodeClicked, element)
				);
			this.lastNodeClicked = undefined;
		} else {
			this.lastNodeClicked = element;
		}
	}
}



function GraphEditorDraggingTool() {
	GraphEditorTool.call(this);
	this.graphEditor = undefined;
	this.dragged = undefined;
}
GraphEditorDraggingTool.prototype = Object.create(GraphEditorTool.prototype)
	
GraphEditorDraggingTool.prototype.getToolId = function() {
	return "dragging";
}
GraphEditorDraggingTool.prototype.getName = function() {
	return "Drag";
}
GraphEditorDraggingTool.prototype.onMouseDown = function(pos, element) { 
	this.dragged = element;
}
GraphEditorDraggingTool.prototype.onMouseUp = function(pos) {
	this.dragged = undefined;
}
GraphEditorDraggingTool.prototype.onMouseLeave = function() {
	this.dragged = undefined;
}
GraphEditorDraggingTool.prototype.onMouseMove = function(pos) {
	if(this.dragged !== undefined) {
		this.dragged.move(pos);
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
		element.dependentElements.forEach(function(elem) {
			that.graphEditor.removeElement(elem);
		});
		this.graphEditor.removeElement(element);
	}
}

