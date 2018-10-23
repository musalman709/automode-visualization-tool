
function GraphEditorNode(id, pos) {
	GraphEditorElement.call(this);
	this.id = id;
	
	this.g = createSVGElement("g", {id:this.id});
	this.rect = createSVGElement("rect", 
		{class:"nodeFrame", x:pos.x-25, y:pos.y-25, width:50, height:50, 
		rx:10, ry:10});
	this.g.append(this.rect);	
	
	this.move(pos);
}

GraphEditorNode.prototype = Object.create(GraphEditorElement.prototype);

GraphEditorNode.prototype.getSVGElement = function() {
	return this.g;
}
GraphEditorNode.prototype.move = function(newPos) {
	this.rect.attr("x", newPos.x-25);
	this.rect.attr("y", newPos.y-25);
	this.incomingPos = {x:newPos.x, y:newPos.y-25};
	this.outgoingPos = {x:newPos.x, y:newPos.y+25};
	
	this.updateDependents();
}
GraphEditorNode.prototype.getIncomingPoint = function() {
	return this.incomingPos;
}
GraphEditorNode.prototype.getOutgoingPoint = function() {
	return this.outgoingPos;
}



function GraphEditorEdge(id, srcElement, destElement) {
	GraphEditorElement.call(this);
	this.srcElement = srcElement;
	this.destElement = destElement;
	this.id = id;
	
	this.g = createSVGElement("g", {id:this.id});
	this.line = createSVGElement("line", {class:"arrow", stroke:"black",
		"marker-end":"url(#arrowhead)"});
	this.g.append(this.line);
	
	this.srcElement.addDependent(this);
	this.destElement.addDependent(this);
	this.update();
}

GraphEditorEdge.prototype = Object.create(GraphEditorElement.prototype);

GraphEditorEdge.prototype.getSVGElement = function() {
	return this.g;
}
GraphEditorEdge.prototype.move = function(newPos) {
	this.update();
}
GraphEditorEdge.prototype.update = function() {
	this.line.attr("x1", this.srcElement.outgoingPos.x);
	this.line.attr("y1", this.srcElement.outgoingPos.y);
	this.line.attr("x2", this.destElement.incomingPos.x);
	this.line.attr("y2", this.destElement.incomingPos.y);
}

