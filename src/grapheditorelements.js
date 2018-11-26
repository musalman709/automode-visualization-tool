
function GraphEditorNode(id, pos) {
	GraphEditorElement.call(this);
	this.id = id;
	this.incomingEdges = [];
	this.outgoingEdges = [];
	this.model = defaultNodeModel();
	
	this.pos = {x:0, y:0};
	this.g = createSVGElement("g", {id:this.id});

	this.buildSVGElements();
	this.move(pos);
}

GraphEditorNode.prototype = Object.create(GraphEditorElement.prototype);

GraphEditorNode.prototype.buildSVGElements = function()
{
  this.frame = createSVGElement(this.model.display_tag, this.model.display_opts);

  this.text = createSVGElement("text", this.model.display_text_opts);
  this.text.html(this.model.display_text);

  this.g.append(this.frame);
  this.g.append(this.text);
}

GraphEditorNode.prototype.getName = function() {
  return this.id;
}
GraphEditorNode.prototype.isNode = function() {
  return true;
}
GraphEditorNode.prototype.getSVGElement = function() {
	return this.g;
}
GraphEditorNode.prototype.setModel = function(model) {
  var pos = this.getPosition();

  this.model = model;

  this.frame.remove();
  this.text.remove();
  this.buildSVGElements();
  this.frame.addClass("selected");

  this.move(pos);
}
GraphEditorNode.prototype.getModel = function() {
  return this.model;
}
GraphEditorNode.prototype.buildParamPane = function() {
  var container = $('<div></div>');
  container.append('<p>Parameters [TODO]</p>');
  return container;
}
GraphEditorNode.prototype.move = function(newPos) {
	this.pos = newPos;
	this.g.attr("transform", "translate(" + newPos.x.toString() + "," + newPos.y.toString() + ")");
	this.incomingPos = points_sum(this.model.incoming_point, newPos);
	this.outgoingPos = points_sum(this.model.outgoing_point, newPos);
	
	this.updateEdges();
}
GraphEditorNode.prototype.getPosition = function() {
  return this.pos;
}
GraphEditorNode.prototype.onSelect = function() {
	this.frame.attr("class", "nodeFrame selected");
}
GraphEditorNode.prototype.onDeselect = function() {
	this.frame.attr("class", "nodeFrame");
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
	
	this.model = undefined;

	this.g = createSVGElement("g", {id:this.id});

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
GraphEditorEdge.prototype.setModel = function(model) {
  this.model = model;
}
GraphEditorEdge.prototype.getModel = function() {
  return this.model;
}
GraphEditorEdge.prototype.buildParamPane = function() {
  var container = $('<div></div>');
  container.append('<p>Parameters [TODO]</p>');
  return container;
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

