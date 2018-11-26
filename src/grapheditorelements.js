
function GraphEditorNode(id, pos) {
	GraphEditorElement.call(this);
	this.id = id;
	this.incomingEdges = [];
	this.outgoingEdges = [];
	
	this.g = createSVGElement("g", {id:this.id});

	/*modify here for the json queries*/
	/*this.rect = createSVGElement("rect", 
		{class:"nodeFrame", x:pos.x-25, y:pos.y-25, width:50, height:50, 
		rx:10, ry:10});*/
		$.ajax({
			type: "GET",
			url:"./graphelementsdata.json",
			data:"format=json&jsoncallback=?/",
			dataType:"json",
			sucess:function(feed){
					this.rect = createSVGElement(feed.node[0].shapename,{class:feed.node[0].class, x:pos.x+feed.node[0].x_offset,
						y:pos.y+feed.node[0].y_offset, width:feed.node[0].width, height:feed.node[0].height, rx:feed.node[0].rx, 
						ry:feed.node[0].ry});
				}
			});

	this.g.append(this.rect);	
	
	this.move(pos);
}

GraphEditorNode.prototype = Object.create(GraphEditorElement.prototype);

GraphEditorNode.prototype.getName = function() {
  return this.id;
}
GraphEditorNode.prototype.isNode = function() {
  return true;
}
GraphEditorNode.prototype.getSVGElement = function() {
	return this.g;
}
GraphEditorNode.prototype.move = function(newPos) {
	this.rect.attr("x", newPos.x-25);
	this.rect.attr("y", newPos.y-25);
	this.incomingPos = {x:newPos.x, y:newPos.y-25};
	this.outgoingPos = {x:newPos.x, y:newPos.y+25};
	
	this.updateEdges();
}
GraphEditorNode.prototype.getPosition = function() {
  return {x:this.rect.attr("x"), y:this.rect.attr("y")};
}
GraphEditorNode.prototype.onSelect = function() {
	this.rect.attr("class", "nodeFrame selected");
}
GraphEditorNode.prototype.onDeselect = function() {
	this.rect.attr("class", "nodeFrame");
}
GraphEditorNode.prototype.onRemoval = function() {
	while(this.incomingEdges.length > 0) {
		this.incomingEdges[0].onRemoval();
	}
	while(this.outgoingEdges.length > 0) {
		this.outgoingEdges[0].onRemoval();
	}
	this.getSVGElement().remove();
}
GraphEditorNode.prototype.getIncomingPoint = function() {
	return this.incomingPos;
}
GraphEditorNode.prototype.getOutgoingPoint = function() {
	return this.outgoingPos;
}
GraphEditorNode.prototype.addIncomingEdge = function(edge) {
	if(edge instanceof GraphEditorEdge) {
		this.incomingEdges.add(edge);
	}
}
GraphEditorNode.prototype.removeIncomingEdge = function(edge) {
	this.incomingEdges.remove(edge);
}
GraphEditorNode.prototype.getIncomingEdges = function() {
  return this.incomingEdges;
}
GraphEditorNode.prototype.addOutgoingEdge = function(edge) {
	if(edge instanceof GraphEditorEdge) {
		this.outgoingEdges.add(edge);
	}
}
GraphEditorNode.prototype.removeOutgoingEdge = function(edge) {
	this.outgoingEdges.remove(edge);
}
GraphEditorNode.prototype.getOutgoingEdges = function() {
  return this.outgoingEdges;
}
GraphEditorNode.prototype.updateEdges = function() {
	for(var i = 0; i < this.incomingEdges.length; ++i) {
		this.incomingEdges[i].update();
	}
	for(var i = 0; i < this.outgoingEdges.length; ++i) {
		this.outgoingEdges[i].update();
	}
}



function GraphEditorEdge(id, srcElement, destElement) {
	GraphEditorElement.call(this);
	this.srcElement = srcElement;
	this.destElement = destElement;
	this.id = id;
	
	this.g = createSVGElement("g", {id:this.id});

	/*modify here for the json queries*/

	this.line = createSVGElement("line", {class:"arrow", stroke:"black",
		"marker-end":"url(#arrowhead)"});
	this.g.append(this.line);
	
	this.srcElement.addOutgoingEdge(this);
	this.destElement.addIncomingEdge(this);
	this.update();
}

GraphEditorEdge.prototype = Object.create(GraphEditorElement.prototype);

GraphEditorEdge.prototype.getName = function() {
  return this.id;
}
GraphEditorEdge.prototype.isNode = function() {
  return false;
}
GraphEditorEdge.prototype.getSVGElement = function() {
	return this.g;
}
GraphEditorEdge.prototype.move = function(newPos) {
	this.update();
}
GraphEditorEdge.prototype.getPosition = function() {
  return {x:this.line.attr("x1"), y:this.line.attr("y1")};
}
GraphEditorEdge.prototype.update = function() {
	this.line.attr("x1", this.srcElement.outgoingPos.x);
	this.line.attr("y1", this.srcElement.outgoingPos.y);
	this.line.attr("x2", this.destElement.incomingPos.x);
	this.line.attr("y2", this.destElement.incomingPos.y);
}
GraphEditorEdge.prototype.onSelect = function() {
	this.line.attr("class", "arrow selected");
}
GraphEditorEdge.prototype.onDeselect = function() {
	this.line.attr("class", "arrow");
}
GraphEditorEdge.prototype.onRemoval = function() {
	this.srcElement.removeOutgoingEdge(this);
	this.destElement.removeIncomingEdge(this);
	this.getSVGElement().remove();
}
GraphEditorEdge.prototype.getSrcNode = function() {
	return this.srcElement;
}
GraphEditorEdge.prototype.getDestNode = function() {
	return this.destElement;
}

