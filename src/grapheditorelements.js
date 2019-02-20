
function GraphEditorNode(id, pos) {
	GraphEditorElement.call(this);
	this.id = id;
	this.incomingEdges = [];
	this.outgoingEdges = [];

	this.model = defaultNodeModel();
	this.param = defaultNodeParam();

	this.paramdict = {};
	this.paramcontainer = undefined;
	
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
  if(this.model === undefined) {
    this.model = defaultNodeModel();
  }

  // remove edges if there's too much
  while(this.model.max_incoming_edges >= 0 &&
    this.incomingEdges.length > this.model.max_incoming_edges) {
		this.incomingEdges[0].onRemoval();
	}
	while(this.model.max_outgoing_edges >= 0 &&
    this.outgoingEdges.length > this.model.max_outgoing_edges) {
		this.outgoingEdges[0].onRemoval();
	}

  // remake frame
  this.frame.remove();
  this.text.remove();
  this.buildSVGElements();
  this.frame.addClass("selected");

  this.move(pos);
}
GraphEditorNode.prototype.getModel = function() {
  return this.model;
}
GraphEditorNode.prototype.setParam = function(param) {
  if(param === undefined) {
    this.param = defaultNodeParam();
  } else {
    this.param = param;
  }

  this.paramdict = {};

  // A node model can have no parameters
  // If it have, set default values
  if(this.param.categories.length > 0) {
    this.setParamValue(this.param.categoryid, this.param.categories[0].id);
  }
}
GraphEditorNode.prototype.getParam = function() {
  return this.param;
}
GraphEditorNode.prototype.setParamValue = function(param, value) {
  this.paramdict[param] = value;

  if(param == this.param.categoryid) {
    this.paramdict = {};
    this.paramdict[this.param.categoryid] = value;

    // category change, reset dict with new set of parameters
    var pdict = this.paramdict;
    var that = this;
    this.param.categories.forEach(function(c) {
      if(c.id == value) {
        c.param.forEach(function(p) {
          pdict[p.id] = p.min;
        });

        // Update displayed label
        if(c.hasOwnProperty("display_name")) {
          that.text.html(c.display_name);
        } else {
          that.text.html(that.model.display_text);
        }
      }
    });
  }
}
GraphEditorNode.prototype.getParamDict = function() {
  return this.paramdict;
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
	this.graphEditor.removeElement(this);
}
GraphEditorNode.prototype.getIncomingPoint = function() {
	return this.incomingPos;
}
GraphEditorNode.prototype.getOutgoingPoint = function() {
	return this.outgoingPos;
}
GraphEditorNode.prototype.canHaveMoreIncomingEdges = function() {
  return this.model.max_incoming_edges < 0 ||
    (this.model.max_incoming_edges - this.incomingEdges.length > 0);
}
GraphEditorNode.prototype.addIncomingEdge = function(edge) {
	if(edge instanceof GraphEditorEdge && this.canHaveMoreIncomingEdges()) {
		this.incomingEdges.add(edge);
		return true;
	}
	return false;
}
GraphEditorNode.prototype.removeIncomingEdge = function(edge) {
	this.incomingEdges.remove(edge);
}
GraphEditorNode.prototype.getIncomingEdges = function() {
  return this.incomingEdges;
}
GraphEditorNode.prototype.canHaveMoreOutgoingEdges = function() {
  return this.model.max_outgoing_edges < 0 ||
    (this.model.max_outgoing_edges - this.outgoingEdges.length > 0);
}
GraphEditorNode.prototype.addOutgoingEdge = function(edge) {
	if(edge instanceof GraphEditorEdge && this.canHaveMoreOutgoingEdges()) {
		this.outgoingEdges.add(edge);
		return true;
	}
	return false;
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
	this.srcElement = undefined;
	this.destElement = undefined;
	this.id = id;

	this.model = defaultEdgeModel();
	this.param = defaultEdgeParam();
	
	if(srcElement.canHaveMoreOutgoingEdges() &&
	  destElement.canHaveMoreIncomingEdges()) {

	  this.srcElement = srcElement;
	  this.destElement = destElement;

	  this.g = createSVGElement("g", {id:this.id});

	  this.line = createSVGElement("line", {class:"arrow", stroke:"black",
		  "marker-end":"url(#arrowhead)"});
	  this.g.append(this.line);

	  this.srcElement.addOutgoingEdge(this);
	  this.destElement.addIncomingEdge(this);
	  this.update();
	}
}

GraphEditorEdge.prototype = Object.create(GraphEditorElement.prototype);

GraphEditorEdge.prototype.isValid = function() {
  return this.srcElement !== undefined && this.destElement !== undefined;
}
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
GraphEditorEdge.prototype.setParam = function(param) {
  this.param = param;
}
GraphEditorEdge.prototype.getParam = function() {
  return this.param;
}
GraphEditorEdge.prototype.setParamValue = function(param, value) {
  // pass
}
GraphEditorEdge.prototype.getParamDict = function() {
  return {};
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
	this.graphEditor.removeElement(this);
}
GraphEditorEdge.prototype.getSrcNode = function() {
	return this.srcElement;
}
GraphEditorEdge.prototype.getDestNode = function() {
	return this.destElement;
}

