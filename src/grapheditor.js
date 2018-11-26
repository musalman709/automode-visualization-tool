"use strict";

/**
 * Create a select list for nodes/edges models
 */
function createModelsSelectMenu(graphEditor, element) {

  var modelsArray = undefined;

  if(element.isNode()) {
    modelsArray = graphEditor.getNodeModels();
  } else {
    modelsArray = graphEditor.getEdgeModels();
  }

  var select_tag = $('<select></select>');
  select_tag.addClass("paramselect");

  modelsArray.forEach(function(model) {
    var opt_tag = $('<option></option>');

    opt_tag.val(model.id);
    opt_tag.html(model.name);
    opt_tag.click(function(obj) {
      element.setModel(model);
      graphEditor.callExporter();
    });

    if(model === element.getModel()) {
      opt_tag.attr("selected", "selected");
    }

    select_tag.append(opt_tag);
  });

  return select_tag;
}



function GraphEditorElement() {
	this.grapheditor = undefined;
}
GraphEditorElement.prototype.getName = function() {
  return "<unknown element>";
}
GraphEditorElement.prototype.isNode = function() {}
GraphEditorElement.prototype.getSVGElement = function() {}
GraphEditorElement.prototype.setModel = function(model) {}
GraphEditorElement.prototype.getModel = function() {}
GraphEditorElement.prototype.buildParamPane = function() {}
GraphEditorElement.prototype.move = function(newPos) {}
GraphEditorElement.prototype.getPosition = function() {}
GraphEditorElement.prototype.update = function() {}
GraphEditorElement.prototype.onSelect = function() {}
GraphEditorElement.prototype.onDeselect = function() {}
GraphEditorElement.prototype.onRemoval = function() {}



function GraphEditorTool() {
	this.grapheditor = undefined;
}
GraphEditorTool.prototype.onToolSelect = function() {}
GraphEditorTool.prototype.onToolDeselect = function() {}
GraphEditorTool.prototype.onMouseDown = function(pos, element) {}
GraphEditorTool.prototype.onMouseUp = function(pos) {}
GraphEditorTool.prototype.onMouseLeave = function() {}
GraphEditorTool.prototype.onMouseMove = function(pos) {}



/**
 * Create a GraphEditor, an object that manages tools and graph elements,
 * create the svg area and receive input from the user 
 */
function GraphEditor(graphcontainer, toolscontainer, paramcontainer) {
	this.graphcontainer = graphcontainer;
	this.toolscontainer = toolscontainer;
	this.paramcontainer = paramcontainer;
	this.exporter = undefined;
	this.svg = undefined;
	this.elementmodels = undefined;
	this.elements = [];
	this.tools = [];
	this.currentTool = undefined;
	this.selectedElement = undefined;
	
	this.createGraph();
	
	var that = this;
	
	this.svg.on("mousedown", function(e) { that.onMouseDown(e); });
	this.svg.on("mouseup", function(e) { that.onMouseUp(e);	});
	this.svg.on("mouseleave", function(e) {	that.onMouseLeave(e); });
	this.svg.on("mousemove", function(e) { that.onMouseMove(e);	});
}


GraphEditor.prototype.createGraph = function() {
	this.graphcontainer.empty();
	this.toolscontainer.empty();
	this.paramcontainer.empty();
	
	this.svg = createSVGElement("svg", {id:"graph"});
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

GraphEditor.prototype.setElementModels = function(data) {
  this.elementmodels = data;
}

GraphEditor.prototype.getElementModels = function() {
  return this.elementmodels;
}

GraphEditor.prototype.getNodeModels = function() {
  if(this.elementmodels === undefined)
    return undefined;

  return this.elementmodels.nodes;
}

GraphEditor.prototype.getEdgeModels = function() {
  if(this.elementmodels === undefined)
    return undefined;

  return this.elementmodels.edges;
}

GraphEditor.prototype.addElement = function(element) {
	if(element instanceof GraphEditorElement) {
		this.elements.push(element);
		element.graphEditor = this;
		
		var that = this;
		element.getSVGElement().on("mousedown", function(e) {
			that.onMouseDown(e, element);
			e.stopPropagation();
		});
		this.svg.append(element.getSVGElement());	
		this.callExporter();
	}
}

GraphEditor.prototype.removeElement = function(element) {
	if(this.elements.remove(element)) {
		element.onRemoval();
		element.getSVGElement().remove();
		if(this.selectedElement === element) {
			this.setSelectedElement(undefined);
		}
		this.callExporter();
	}
}

GraphEditor.prototype.getElements = function() {
  return this.elements;
}

GraphEditor.prototype.clearElements = function() {
  // Not the more efficient but we are sur that all elements
  // are deleted properly
  while(this.elements.length > 0) {
    this.removeElement(this.elements[this.elements.length-1]);
  }
}

GraphEditor.prototype.setSelectedElement = function(element) {
	if(this.selectedElement !== undefined) {
		this.selectedElement.onDeselect();
	}
	
	this.selectedElement = element;
	
	this.paramcontainer.empty();

	if(this.selectedElement !== undefined) {
		this.selectedElement.onSelect();

		if(this.elementmodels !== undefined){
		  this.paramcontainer.append(createModelsSelectMenu(this, element));
		}
	}
}

GraphEditor.prototype.addTool = function(tool) {
	if(tool instanceof GraphEditorTool) {
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
	this.setSelectedElement(element);
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

GraphEditor.prototype.setExporter = function(exporter) {
  this.exporter = exporter;
}

GraphEditor.prototype.callExporter = function() {
  this.exporter.export(this);
}

