"use strict";

function createSVGElement(tagname, attrObject) {
	var svgElem = document.createElementNS("http://www.w3.org/2000/svg", 
		tagname);
	Object.keys(attrObject).forEach(function(key) {
		svgElem.setAttribute(key, attrObject[key]);
	});
	return $(svgElem);
}



function GraphEditorElement() {
	this.dependentElements = [];
}
GraphEditorElement.prototype.getSVGElement = function() {}
GraphEditorElement.prototype.addToGraph = function(graph) {}
GraphEditorElement.prototype.removeFromGraph = function(graph) {}
GraphEditorElement.prototype.move = function(newPos) {}
GraphEditorElement.prototype.update = function() {}
GraphEditorElement.prototype.getIncomingPoint = function() {
	return {x:0, y:0};
};
GraphEditorElement.prototype.getOutgoingPoint = function() {
	return {x:0, y:0};
}
GraphEditorElement.prototype.addDependent = function(element) {
	this.dependentElements.push(element);
}
GraphEditorElement.prototype.removeDependent = function(element) {
	for(var i = 0; i < this.dependentElements.length; ++i) {
		if(this.dependentElements[i] === element) {
			this.dependentElements.splice(i, 1);
			return;
		}
	}
}
GraphEditorElement.prototype.updateDependents = function() {
	this.dependentElements.forEach(function(elem) {
		elem.update();
	});
}



function GraphEditorTool() {
	this.grapheditor = undefined;
}
GraphEditorTool.prototype.onToolSelect = function() {}
GraphEditorTool.prototype.onToolDeselect = function() {}
GraphEditorTool.prototype.onMouseDown = function(pos, element) {}
GraphEditorTool.prototype.onMouseUp = function(pos) {}
GraphEditorTool.prototype.onMouseLeave = function() {}
GraphEditorTool.prototype.onMouseMove = function(pos) {}



function GraphEditor(graph, graphcontainer, toolscontainer) {
	this.graph = undefined;
	this.graphcontainer = graphcontainer;
	this.toolscontainer = toolscontainer;
	this.svg = undefined;
	this.elements = [];
	this.tools = [];
	this.currentTool = undefined;
	
	this.setGraph(graph);
	
	var that = this;
	
	this.svg.on("mousedown", function(e) { that.onMouseDown(e); });
	this.svg.on("mouseup", function(e) { that.onMouseUp(e);	});
	this.svg.on("mouseleave", function(e) {	that.onMouseLeave(e); });
	this.svg.on("mousemove", function(e) { that.onMouseMove(e);	});
}


GraphEditor.prototype.setGraph = function(graph) {
	this.graphcontainer.empty();
	this.toolscontainer.empty();
	
	this.graph = graph;
	
	this.svg = createSVGElement("svg", {id:this.graph.id});
	this.svg.on("selectstart", function(e) { e.preventDefault(); });
	this.graphcontainer.append(this.svg);
	
	this.defs = createSVGElement("defs", {});
	var arrowMarker = createSVGElement("marker", 
		{id:"arrowhead", refX:10, refY:5, markerWidth:10, markerHeight:10,
		orient:"auto-start-reverse"});
	var arrowMarkerShape = createSVGElement("path", 
		{d:"M 0 0 L 10 5 L 0 10 Z"});
	arrowMarker.append(arrowMarkerShape);
	this.defs.append(arrowMarker);
	this.svg.append(this.defs);
}

GraphEditor.prototype.addElement = function(element) {
	this.elements.push(element);
	element.graphEditor = this;
	
	element.addToGraph(this.graph);
	
	var that = this;
	element.getSVGElement().on("mousedown", function(e) {
		that.onMouseDown(e, element);
		e.stopPropagation();
	});
	this.svg.append(element.getSVGElement());
}

GraphEditor.prototype.removeElement = function(element) {
	for(var i = 0; i < this.elements.length; ++i) {
		if(this.elements[i] === element) {
			element.getSVGElement().remove();
			element.removeFromGraph(this.graph);
			this.elements.splice(i, 1);
		}
	}
}

GraphEditor.prototype.addTool = function(tool) {
	this.tools.push(tool);
	tool.graphEditor = this;
	
	var graphEditor = this;
	var element = jQuery("<p/>", {class:"tool", 
	id:"tool_" + tool.getToolId(), text:tool.getName()});
	element.on("click", function(e) {
		graphEditor.setCurrentTool(tool);
	});
	this.toolscontainer.append(element);
}

GraphEditor.prototype.setCurrentTool = function(tool) {
	if(this.currentTool !== undefined) {
		$("#tool_" + this.currentTool.getToolId())
		.attr("class", "tool");
		this.currentTool.onToolDeselect();
	}
	
	this.currentTool = tool;
	
	if(this.currentTool !== undefined) {
		$("#tool_" + this.currentTool.getToolId())
		.attr("class", "tool selected");
		this.currentTool.onToolSelect();
	}
}

GraphEditor.prototype.SVGCoordFromHTML = function(x, y) {
	var svgPt = this.svg[0].createSVGPoint();
	svgPt.x = x;
	svgPt.y = y;
	svgPt = svgPt.matrixTransform(this.svg[0].getScreenCTM().inverse());
	return svgPt;
}

GraphEditor.prototype.onMouseDown = function(e, element) {
	if(this.currentTool !== undefined) {
		var pos = this.SVGCoordFromHTML(e.pageX, e.pageY);
		this.currentTool.onMouseDown(pos, element);
	}
}
GraphEditor.prototype.onMouseUp = function(e) {
	if(this.currentTool !== undefined) {
		var pos = this.SVGCoordFromHTML(e.pageX, e.pageY);
		this.currentTool.onMouseUp(pos);
	}
}
GraphEditor.prototype.onMouseLeave = function(e) {
	if(this.currentTool !== undefined) {
		this.currentTool.onMouseLeave();
	}
}
GraphEditor.prototype.onMouseMove = function(e) {
	if(this.currentTool !== undefined) {
		var pos = this.SVGCoordFromHTML(e.pageX, e.pageY);
		this.currentTool.onMouseMove(pos);
	}
}

GraphEditor.prototype.addSVGElement = function(element) {
	this.svg.append(element);
}

